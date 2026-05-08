# 0004 — Content data model & adapter layer

**Status:** done
**Type:** core
**Depends on:** 0001
**Blocks:** 0005, 0006, 0007, 0010, 0013, 0014

## Problem

Every marketing page on the site reads from a single data source: 11 services, 120 locations, and 1,320 derived combos. The data must be typed, queryable, and accessed only through a thin adapter layer so the data source can be swapped (TS → Contentful) without touching pages, the slug resolver, or the SEO layer.

## Acceptance criteria

- [ ] `Service` type defined: `slug`, `name`, `shortDescription`, `longDescription`, `whatsIncluded` (string[]), `process` (ordered string[]), `faq` (`{ q, a }[]`), `heroImage`, `iconName`, `priceFrom: null` (typed slot for future use).
- [ ] `Location` type defined: `slug`, `name`, `postcode`, `region` (enum: Inner / Inner East / Inner West / Inner North / Inner South / Middle East / Middle West / etc.), `lat`, `lng`, `description` (template field).
- [ ] `Combo` type defined or computed: `service`, `location`, plus a derived H1 and blurb.
- [ ] `lib/content/data/services.ts` populated with all 11 services from the prototype, with Flood Restoration framed as honest cleanup ("Water-damaged carpet & upholstery drying"), no IICRC claims.
- [ ] `lib/content/data/locations.ts` populated with all ~120 Melbourne suburbs in postcodes 3000–3207, sourced from data.gov.au or equivalent.
- [ ] Adapter functions exported: `getService(slug)`, `getLocation(slug)`, `getCombo(serviceSlug, locationSlug)`, `getAllServices()`, `getAllLocations()`, `getAllCombos()`.
- [ ] Adapters return `null` (not throw) for unknown slugs.
- [ ] Combo content is computed from service + location: H1 = `"<Service Name> in <Location Name>"`, blurb is parameterized template with location tokens.
- [ ] Optional `comboOverrides` shape exists (left empty in v1) so per-combo unique copy can be added later without a schema change.
- [ ] Pages and the slug resolver only import from `lib/content/`, never from `lib/content/data/`.

## Implementation notes

- Source for the postcode dataset: `data.gov.au` Australia Post Postcodes Dataset, filtered to VIC postcodes 3000–3207.
- Region grouping should align with commonly understood Melbourne sub-areas (Inner, Inner East, etc.) so we can later filter location lists by region in the UI.
- All copy in service/location data should be free of fake testimonials, fake prices, and fake review counts.
- Keep the data files purely declarative; no business logic inside data files.

## References

- PRD §"Major modules" (Content adapters), §"Data shapes"
- Research §4 (Content & data model)
