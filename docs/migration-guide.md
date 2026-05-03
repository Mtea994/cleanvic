# Migration Guide — Library Upgrades

_Status: planning_
_Last updated: 2026-05-03_
_Stack baseline: Next.js 16.2.4, React 19.2.5 stable, Node 20+_

---

## Problem Statement

After the Next 16 / React 19 upgrade landed (commit `6fc4d28` and the dev-tooling sweep in `676c669`), several application-layer dependencies remain on older majors. Each has a path to its current major, but each also carries breaking API changes that touch app code or pulls peer-dependency conflicts that would force `--legacy-peer-deps`. We want to land them in controlled stages so each can be verified independently and rolled back without dragging the others.

Constraint that shapes every decision in this guide: **`npm install` must succeed without `--force` or `--legacy-peer-deps`**. If a bump can't satisfy this, it gets deferred, not flagged-around.

---

## Solution

Stage the remaining bumps in three independent, individually-verifiable PRs. Each stage is small enough to review on its own, has a clear rollback (revert the single commit), and leaves the install tree clean.

| Stage | Bumps | Touches | Risk |
| --- | --- | --- | --- |
| 1 | `zod` 3 → 4 + `@hookform/resolvers` 3 → 5 | `lib/leads/schema.ts`, two booking components | Medium — schema API rewrite |
| 2 | `resend` 4 → 6 | `lib/leads/resendClient.ts` | Low — signature compatible, types tightened |
| 3 | `@vercel/analytics` 1 → 2 | `app/layout.tsx` (or wherever `<Analytics />` mounts) | Low — peer-dep trap to avoid |

Deferred indefinitely: `typescript` 5 → 6 (too new, ecosystem types lag), `eslint` 9 → 10 (blocked upstream by `eslint-config-next@16`).

---

## Migration Outcomes

1. As a developer running `npm install`, I want zero ERESOLVE warnings and no install flags, so that CI stays reproducible and onboarding new contributors is friction-free.
2. As a developer running `npm test`, I want all 57 lead-pipeline tests to pass under the new validators, so that schema changes don't silently widen accepted input.
3. As a developer running `npm run build`, I want the 1509-page build to complete on Next 16 + Turbopack with no new warnings introduced by upgraded libs.
4. As a developer running `npm run typecheck`, I want clean output, so that no upgraded type definition silently weakens our type guarantees.
5. As a customer submitting the booking form, I want the same validation messages I'd see today (e.g. "Please use an Australian phone number."), so that the upgrade is invisible at the UX layer.
6. As a customer submitting an invalid email, I want the existing error copy preserved verbatim, so that the form's voice stays consistent with the rest of the site.
7. As the site owner, I want lead emails delivered via Resend with the same template body as today, so that operational continuity is preserved.
8. As the site owner, I want to be able to revert any single stage without affecting the others, so that a regression in (say) zod 4 doesn't block resend's improvements from shipping.
9. As a developer triaging a future incident, I want each stage in its own commit with verification notes, so that `git bisect` and `git blame` give precise answers.
10. As a developer evaluating whether to add `@vercel/analytics@2`, I want documentation of the peerOptional `@sveltejs/kit` trap that broke the first attempt, so that no one rediscovers it on a Friday afternoon.
11. As a developer in 6 months reading this guide, I want to know why TypeScript 6 and ESLint 10 were *not* taken, so that I don't waste time re-investigating.
12. As a maintainer auditing the dependency tree, I want each bump to be the latest stable major at upgrade time (not a leading edge release with <8 weeks of soak), so that we're not absorbing other people's regression discovery for them.

---

## Implementation Decisions

### Stage 1 — zod 4 + @hookform/resolvers 5

These two MUST move together: `@hookform/resolvers@5` peer-requires `zod@^4`. Trying to bump them separately produces an ERESOLVE failure and would force `--legacy-peer-deps`.

**Lead schema (the one consumer of zod we own):**

- Replace `errorMap: () => ({ message })` with the v4 `error` callback signature on `z.enum`. Same is true for any other validator that took `errorMap`.
- Replace the chained `.email()` on `z.string()` with the new top-level `z.email()` validator. Order of `.trim()` becomes irrelevant since `z.email()` doesn't chain off `z.string()` anymore.
- `.or(z.literal(""))` continues to work; no changes to the optional-empty-email idiom.
- `z.infer<typeof leadSchema>` continues to work; the exported `LeadInput` type is unchanged in shape.
- The `honeypot` `.optional().default("")` semantics need a re-read: in v4, `.default()` is applied at output, not input. For honeypot logic that *inspects* the raw input separately from validation, this is a no-op (the inspector reads the request body before zod), but document the change.

**Hook Form resolver (the two components):**

- Imports remain `import { zodResolver } from "@hookform/resolvers/zod";` — no path change.
- If TypeScript complains about `Resolver<T>` mismatches in the `useForm` generic, parameterize explicitly: `useForm<LeadInput>(...)`. Both `BookingForm` and `HeroFunnel` already pass through `LeadInput`-shaped forms so this is mostly a defensive change.
- Resolver internally targets the standard-schema interface in v5. No app-visible change beyond the peer-dep version.

**What we are NOT doing in this stage:**

- Not touching error-formatting code that reads `result.error.issues` (path is unchanged in v4).
- Not migrating any other zod schemas — the lead schema is the only one in the repo.
- Not bumping `react-hook-form` itself — it's at `^7.53.2`, well within `@hookform/resolvers@5` peer range.

### Stage 2 — resend 4 → 6

**The Resend client wrapper:**

- `new Resend(apiKey)` constructor — unchanged.
- `client.emails.send({ from, to, subject, text })` signature — unchanged in v5/v6.
- Return shape `{ data, error }` — unchanged at the value level. The `error` discriminant gained typed `name` codes (`"validation_error" | "missing_api_key" | ...`) but `error.message` (the only field our wrapper reads) is preserved. Our `ResendClientLike` adapter interface stays compatible.
- The `error?.message` mapping in `resendLeadClient.send` requires no change.

**Runtime requirements:**

- v6 is ESM-first and requires Node 18+. Our deployment is Node 20+, so this is satisfied.
- Next 16's bundler handles ESM-only packages without configuration.

**Verification:**

- A live smoke test of the booking form is the right verification, not just unit tests, because the wrapper's external contract is "an email actually sends." The `submitLead.test.ts` suite uses a fake `ResendClientLike`, so it'll keep passing regardless of the upstream change.

### Stage 3 — @vercel/analytics 1 → 2

**The known trap (do not skip this):**

`@vercel/analytics@2` declares `@sveltejs/kit` as a `peerOptional`. npm's resolver treats peerOptional as a constraint to satisfy when *any* peer satisfier is present in the tree — and Vite, which we have via the Vitest 4 toolchain, is one. This pulls in `vite-plugin-svelte`, which peer-requires `vite@^8`, and depending on the resolver's path it can end up requesting versions that conflict with Vitest 4's pinned vite. The first attempt at this bump produced an ERESOLVE that could only be papered over with `--legacy-peer-deps` — which violates our constraint.

**Mitigation paths to evaluate at the time of the bump:**

1. Check whether `@vercel/analytics@2`'s latest patch has dropped or narrowed the SvelteKit peerOptional. If yes, the bump is straightforward.
2. If still present, install with an `overrides` entry in `package.json` that pins the Svelte sub-tree to a version that doesn't pull vite^8. This is uglier than punting but doesn't require install flags.
3. If neither works cleanly, stay on `@vercel/analytics@^1.6.1`. The v1 line continues to receive patches and the v2 feature gap is small for our use case.

**App-code surface:**

- The `<Analytics />` component import path is unchanged across the major.
- No props of the component used in our layout have changed signature.

### Deferred

**TypeScript 5 → 6** — Held until at least one minor patch ships and the surrounding `@types/*` ecosystem catches up. The project's own code is unlikely to need changes; the risk is third-party `@types` packages publishing TS6-incompatible declarations during the early adoption window.

**ESLint 9 → 10** — Blocked upstream. `eslint-config-next@16.2.4` bundles `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react`, all peer-capped at `eslint^9`. Wait for a future `eslint-config-next` release that bumps those plugins.

---

## Testing Decisions

**What "good" looks like:** every stage's tests verify externally observable behavior, not the upgraded library's internals. We are not adding tests for "zod 4 still validates emails" — that's zod's job, not ours.

**Per-stage test plan:**

- **Stage 1** — The existing `lib/leads/__tests__/submitLead.test.ts` suite is the load-bearing verification. It exercises the lead schema through the `submitLead` orchestrator with realistic inputs, hitting validation success, validation failure, and honeypot paths. If any of those error messages change literal text after the v4 migration, the suite catches it. No new tests needed; if a test fails, fix the migration, not the test.
- **Stage 2** — Run the booking form end-to-end against the dev server with a real Resend test API key (or against the existing `RESEND_API_KEY`). The unit tests for `submitLead` use a fake `ResendClientLike`, so they verify the contract but not the wire format. A single manual submission proves the upstream API contract still holds.
- **Stage 3** — Run `npm run build` and inspect the Vercel Analytics injection in the rendered HTML. The Analytics package has no application-level behavior worth unit testing; either the script tag is present and well-formed, or it isn't.

**Cross-cutting verification (every stage):**

1. `npm install` exits with no ERESOLVE warnings and no install flags.
2. `npm run typecheck` is clean.
3. `npm test` shows 57/57 passing.
4. `npm run build` generates 1509 pages without regression.

Prior art: the Next 16 upgrade in `676c669` followed exactly this verification ladder. Reuse it verbatim.

---

## Out of Scope

- **TypeScript 6** — Deferred per "Deferred" section above. Re-evaluate in ~2026-Q3.
- **ESLint 10** — Blocked upstream; not our migration to perform until `eslint-config-next` unblocks.
- **React 20 / Next 17** — Don't exist yet at time of writing. Out of scope by definition.
- **Replacing `@vercel/analytics` with a different analytics provider** — separate decision, separate PRD.
- **Refactoring the lead schema's structure** while migrating to zod 4 — the migration should be a pure semantic-preserving rewrite. Any schema redesign goes in a separate change.
- **Adding new lints** during the eslint-config-next bump — pure version migration only.
- **Deleting unused dependencies** — that's a cleanup pass, separate from upgrades.

---

## Further Notes

- **Why three stages and not one big bump:** every stage has a different risk profile and a different verification signal. Bundling them means a regression in any one blocks the others, and `git bisect` becomes useless. Three small reverts > one large rollback.
- **Why `@hookform/resolvers` and `zod` are paired:** peer-dep enforcement, see Stage 1 implementation notes. Treat them as a single atomic unit.
- **Recording the peer-dep traps in this guide is intentional:** the `@vercel/analytics@2` Svelte trap and the `eslint-config-next@16` peer-cap on ESLint were both rediscovered the hard way during the Next 16 upgrade. Documenting them here means the next person doesn't burn an afternoon on the same problem.
- **The held-back majors will eventually need to land.** This guide is a working document; update it (don't replace it) as each stage ships, and re-evaluate the deferred items when their blockers clear.
