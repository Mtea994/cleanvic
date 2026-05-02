# 0006 — Catch-all dynamic route + page templates

**Status:** needs-triage
**Type:** ui + routing
**Depends on:** 0002, 0004, 0005
**Blocks:** 0013, 0014

## Problem

The catch-all `app/[slug]/page.tsx` must dispatch to the appropriate page template (service, location, or combo) based on the slug resolver's output, and `generateStaticParams` must enumerate all 1,451 dynamic URLs at build time so they ship as static HTML.

## Acceptance criteria

- [ ] `app/[slug]/page.tsx` exists.
- [ ] `generateStaticParams` returns every standalone service slug, every standalone location slug, and every combo slug.
- [ ] The page component calls `resolveSlug(params.slug)` and renders:
  - Service template when `kind === 'service'`
  - Location template when `kind === 'location'`
  - Combo template when `kind === 'combo'`
  - `notFound()` when `kind === 'unknown'` or `'reserved'`
- [ ] `generateMetadata` per page returns the appropriate title, description, canonical URL, OG metadata.
- [ ] **Service page template** renders: hero (name + tagline + CTA), what's-included grid, process steps, before/after slider (if `service.beforeAfter` provided), FAQ accordion, locations grid (linking to combos), CTA band, sticky mobile CTA. No price displayed.
- [ ] **Location page template** renders: hero (suburb name + region + CTA), services grid (linking to combos), trust signals, FAQ, CTA band, sticky mobile CTA.
- [ ] **Combo page template** renders: hero (`"<Service> in <Location>"` H1), service description + what's-included, location-specific blurb (postcodes covered, neighbouring suburbs), FAQ, CTA band, sticky mobile CTA.
- [ ] Combo pages reuse the parent service's hero image; no per-combo unique imagery.
- [ ] Every CTA on every template opens the booking modal (issue 0008).
- [ ] All templates are fully responsive at the prototype's breakpoints.

## Implementation notes

- Templates should be thin React components consuming the design-system primitives from 0002.
- Per-page `generateMetadata` reads from the same content adapters the page does.
- Combo pages emit BreadcrumbList JSON-LD via the SEO surface in 0010 + 0013.
- Hydrate as little JS as possible on these pages — they're SSG and mostly static.

## References

- PRD §"Routing & URL architecture"
- Research §3 (Routing & URL architecture), §4.4 (Per-combo content templating)
