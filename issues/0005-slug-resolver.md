# 0005 — Slug resolver module + tests

**Status:** needs-triage
**Type:** core
**Depends on:** 0004
**Blocks:** 0006

## Problem

The site uses a single catch-all dynamic route (`app/[slug]/page.tsx`) to serve every standalone service page, every standalone location page, and every service-by-location combo page across 1,456 URLs. A pure resolver function is the single source of truth for "what page is this slug?" Wrong resolution = wrong page or 404 on a valid URL.

## Acceptance criteria

- [ ] Pure function exported: `resolveSlug(slug: string): Resolution` where `Resolution` is one of:
  - `{ kind: 'service', service: Service }`
  - `{ kind: 'location', location: Location }`
  - `{ kind: 'combo', service: Service, location: Location }`
  - `{ kind: 'reserved' }`
  - `{ kind: 'unknown' }`
- [ ] Reserved-paths list (`about`, `contact`, `services`, `locations`, `book`, `api`, `_next`, `favicon.ico`, `robots.txt`, `sitemap.xml`) returns `kind: 'reserved'`.
- [ ] Standalone service slug returns `kind: 'service'`.
- [ ] Standalone location slug returns `kind: 'location'`.
- [ ] Hyphenated combo slug returns `kind: 'combo'` with the correct service and location attached.
- [ ] Combo parsing uses **longest-match split**: walks split points from longest service prefix to shortest, returning the first split where both halves are known slugs.
- [ ] Empty / malformed input returns `kind: 'unknown'` without throwing.
- [ ] Unit tests (Vitest) cover every branch above plus ambiguous edge cases (e.g. multi-word service + multi-word suburb where multiple splits would parse).
- [ ] Tests run against the same data the production code reads — no fixture duplication.
- [ ] Test catalog includes a comment explaining how to add a regression case when a new ambiguity is discovered.

## Implementation notes

- Resolver should be O(n) on slug length: try each split position, query the service/location sets (which are built from the data adapters and could be cached as Sets for O(1) membership).
- Build the reserved-paths list as a plain string set; comparisons are exact.
- The catch-all route handler maps each `Resolution.kind` to a render path; the resolver itself does not render.

## Test cases (non-exhaustive)

- `resolveSlug('carpet-cleaning')` → service.
- `resolveSlug('richmond')` → location.
- `resolveSlug('carpet-cleaning-richmond')` → combo.
- `resolveSlug('about')` → reserved.
- `resolveSlug('does-not-exist')` → unknown.
- `resolveSlug('')` → unknown.
- `resolveSlug('carpet-cleaning-st-kilda')` → combo (multi-word location).
- `resolveSlug('tile-and-grout-cleaning-richmond')` → combo (multi-word service).
- Ambiguity case: a service "x-y" and a location "y-z" with combo input `x-y-z` — longest service prefix wins.

## References

- PRD §"Major modules" (Slug resolver), §"Testing Decisions"
- Research §3.2 (URL structure)
