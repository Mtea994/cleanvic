# 0011 — Address-gate module + tests

**Status:** done
**Type:** seo + core
**Depends on:** 0001
**Blocks:** 0010

## Problem

Address and ABN values default to documented placeholder strings and may visibly render in the footer at any time. The JSON-LD `address` block, however, must never include placeholder data — emitting a fake address is a Google penalty risk and a Google Business Profile suspension risk. A small pure module owns the "is this real or placeholder?" decision so the JSON-LD builder layer cannot make a mistake.

## Acceptance criteria

- [ ] Pure function `shouldEmitAddress(addressValues): boolean` exported from `lib/seo/address-gate.ts`.
- [ ] Returns `true` only when **every** address field is non-placeholder.
- [ ] Returns `false` when **any** field matches its documented placeholder default (e.g. `"123 Placeholder St"`, `"00 000 000 000"`).
- [ ] Placeholder-detection is exact-string match against a documented `PLACEHOLDER_VALUES` constant (no fuzzy matching, no inference).
- [ ] Function is pure (no env-var reads inside; caller passes values in).
- [ ] Tests cover: all-placeholder values gate out; all-real values gate in; partial-real (real street, placeholder postcode) gates out; case-sensitivity (placeholder constant is canonical, mixed case real values are accepted).
- [ ] `PLACEHOLDER_VALUES` constant is exported and documented inline.

## Implementation notes

- The placeholder constants must match the defaults documented in `.env.example` (see issue 0001) and `docs/research.md` §10. Drift between these would break the gate.
- The module is intentionally tiny but has high blast radius: a bug here either suppresses real address (mild — search just doesn't get the local boost) or emits placeholder address (severe — Google penalty risk).
- Do not generalise this into a generic "is-placeholder" utility — the address-gate is specifically about JSON-LD address eligibility and any extension should be a deliberate, separate decision.

## References

- PRD §"Major modules" (Address-gate)
- Research §6.4 (Address & ABN)
