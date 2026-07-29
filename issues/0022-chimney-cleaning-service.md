# 0022 — Chimney cleaning service line

**Status:** in-progress (code done; photo assets pending)
**Type:** content addition
**Depends on:** 0004 (Content data model & adapter layer)
**Blocks:** —

## Problem Statement

KleanVictoria performs chimney sweeping but has no page for it. Every existing service earns traffic through a service page plus 124 location combo pages; chimney cleaning earns none, so a peak-season Melbourne search for "chimney sweep Richmond" finds nothing. The service is also absent from the booking funnel, so anyone who does ask has to be captured over the phone.

## Solution

Add `chimney-cleaning` as the 8th entry in `lib/content/data/services.ts`. Because the content layer is adapter-driven (issue 0004), a single data entry propagates automatically to the nav dropdown, footer, `/services`, the homepage grid, `/chimney-cleaning`, all 124 combo pages, the sitemap, JSON-LD, and the booking form's service `<select>`. The remaining work is the handful of places that hardcode service knowledge: the icon set, the grid tag/label maps, the hero funnel chips, and prose copy.

## Implementation Decisions

**Identity**
- Slug `chimney-cleaning`, display name "Chimney Cleaning". Matches the site's dominant `-cleaning` suffix and reads correctly through the combo template at `lib/content/index.ts:45` (`Chimney Cleaning in Richmond`). "Chimney sweep" — the higher-volume AU head term — is carried in `shortDescription`, `longDescription`, and the FAQ instead of the slug.
- Inserted at **array index 7** (8th service), ahead of `emergency-flood-restoration`. Deliberate: it places chimney in the footer's top-8 block (`Footer.tsx:16` renders `.slice(0, 8)`) during peak winter season. **Consequence: `emergency-flood-restoration` no longer appears in the footer.**

**Scope of service**
- Full sweep — flue *and* firebox — not a cosmetic hearth clean.
- Appliances covered: open fireplaces, wood heaters / combustion stoves, pellet heaters, wood-fired pizza ovens, and the flues on gas log fireplaces, gas space heaters, and wall furnaces.
- Access: both internal (rods from the firebox) and roof-down, decided on site. The no-mess promise is therefore anchored to opening-seal + HEPA vacuum rather than to a particular method.
- Ancillary: unoccupied bird/possum nest removal, plus bird-guard cowl and rain-cap supply and fit.

**Compliance wording (deliberate, do not loosen)**
- Gas appliances: the page offers flue, firebox, and glass cleaning only. Burner and gas-fitting work is licensed gas work in Victoria (VBA), and the FAQ explicitly refers it to a licensed gasfitter.
- Wildlife: the page offers *unoccupied* nest and debris removal only. Removing a live possum requires an authorised wildlife controller under the Wildlife Act 1975 (Vic); the FAQ says so and offers a referral instead.
- Roof access implies working-at-height duties under the OHS Regulations. Confirm insurance and harness/ladder equipment cover two-storey jobs before advertising heavily.

**Content depth**
- 6 `whatsIncluded` items, a 5-step `process`, and **7 FAQs** — the deepest FAQ set on the site. Justified rather than padded: the service spans six appliance types plus two compliance caveats, and `faq` feeds `FAQPage` JSON-LD (`lib/seo/jsonld.ts:99`), so each entry is a rich-result and objection-handling surface.
- `priceFrom: null`, consistent with every other service.

**Coverage**
- All 124 suburbs, via the existing `getAllCombos()` cross-product. No per-service location filtering was introduced; adding it would require a new `locationSlugs?: string[]` field on `Service` plus changes to `getAllCombos()`, `resolveSlug()`, and the sitemap. Sitemap grows from ~1,488 to ~1,612 URLs.
- `chimney-cleaning` has no prefix collision with any location slug, so `resolveSlug()` needed no change.

**Booking funnel**
- The modal's `<select>` is data-driven via `leadServiceOptions` and picked chimney up for free.
- The homepage `HeroFunnel` chips are hardcoded and were a curated subset of 8. Chimney was added as the 9th chip and `oven-cleaning` as the 10th, keeping the 2-column grid at 5 balanced rows.
- No Supabase migration needed: `leads.service` is `text not null` with no CHECK constraint or enum.

## Accepted Debt

1. **`heroImage` reuses `/images/hero-house-cleaning.jpg`.** No chimney photo has been sourced. `ServiceHero.tsx:101` passes `heroImage` straight into `next/image` with no fallback, so an unresolvable path renders broken — reuse was chosen over a dangling reference. Precedent exists (`end-of-lease-cleaning` reuses `hero-deep-cleaning.jpg`). A `TODO` sits on the field in `services.ts` and a row in `public/images/CREDITS.md`.
2. **Before & After keeps the carpet fallback.** `ServiceBeforeAfter.tsx:60` returns the carpet pair for any service without an explicit branch, so the chimney page reads *"Stained carpet before chimney cleaning"* under a carpet slider. Known and accepted for launch. Fix is ~10 lines: return `[]` for `chimney-cleaning` and have `ServicePage` skip the section when pairs are empty — or better, add a real soot/creosote pair, which is the most persuasive photo type this service has.

## Files Changed

| File | Change |
|---|---|
| `lib/content/data/services.ts` | New `chimney-cleaning` entry at index 7 |
| `components/ui/ServiceIcon.tsx` | `chimney` case (80×80 house + flue + smoke) |
| `components/ui/ServiceGrid.tsx` | TAG `"Wood Heaters & Fireplaces"`, IMG_LABEL `"chimney sweep at work"` |
| `components/booking/HeroFunnel.tsx` | Chimney 9th chip, oven 10th, with 16×16 icons |
| `app/services/page.tsx` | Description rewritten (was 181 chars and truncating in SERPs); hero copy |
| `app/layout.tsx` | Site description + `keywords` |
| `app/page.tsx` | Homepage description |
| `app/[slug]/page.tsx` | Location page description |
| `components/templates/LocationHero.tsx` | Location hero body copy |
| `app/about/page.tsx` | "Today we cover…" paragraph |
| `lib/routing/__tests__/slug-resolver.test.ts` | Service + combo + multi-word-location regression test |
| `public/images/CREDITS.md` | Pending-asset rows for hero and before/after |

## Verification

- `npm run typecheck`, `npm test`, `npm run build` all pass. The build statically renders every combo page, so a bad image path or content error surfaces at build rather than in production.

## Follow-ups

- Source `hero-chimney-cleaning.jpg` (1920×1080) and swap the `heroImage` path.
- Source a real soot before/after pair and add a `chimney-cleaning` branch to `ServiceBeforeAfter.tsx`.
- Confirm insurance covers roof access on two-storey properties before promoting the roof-down method in ads.
- Revisit the array position after winter — chimney at index 7 currently keeps `emergency-flood-restoration` out of the footer.
