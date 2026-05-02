# 0007 — Static pages (home, about, contact, services hub, locations hub)

**Status:** needs-triage
**Type:** ui
**Depends on:** 0002, 0004, 0008
**Blocks:** 0013

## Problem

Five non-dynamic pages anchor the site: the homepage (the primary conversion surface), an About page, a Contact page, and two index hubs that list services and locations for nav/footer linking and SEO internal linking.

## Acceptance criteria

### `/` — Homepage

- [ ] Hero section: H1, supporting copy, primary CTA (opens booking modal), trust pill.
- [ ] Trust bar: 4–5 trust items with icons (police-checked, insured, eco-friendly, satisfaction guarantee).
- [ ] Services grid: 11 service tiles, each linking to the standalone service page.
- [ ] Before/after sliders: 3 draggable comparison sliders.
- [ ] Locations grid or region cards: surface the 8–10 region groupings; each region links to filtered location list (or a representative suburb).
- [ ] FAQ accordion: 8 items.
- [ ] CTA band (full-width teal band with CTA).
- [ ] Visible review badge ("4.9★ from 620+ reviews") with a `// WARNING: replace before launch` source comment.

### `/about`

- [ ] Hero with brand statement.
- [ ] Story / company narrative.
- [ ] Values section (3–5 values).
- [ ] Timeline of milestones (template only, content placeholders OK).
- [ ] Accreditations row.
- [ ] **No team or founder photos.**
- [ ] CTA band.

### `/contact`

- [ ] Page-embedded enquiry form (same shared form component from 0008, no modal wrapper required).
- [ ] Trading hours block.
- [ ] Phone + email contact methods.
- [ ] Map placeholder (deferred — real Google Maps embed is out of scope).

### `/services` — Services hub

- [ ] Lists all 11 services with thumbnails + short descriptions.
- [ ] Each tile links to the standalone service page.
- [ ] Page metadata + canonical.

### `/locations` — Locations hub

- [ ] Lists all 120 locations grouped by region.
- [ ] Each entry links to the standalone location page.
- [ ] Page metadata + canonical.

## Implementation notes

- Use the same draggable before/after slider implementation as the prototype; vanilla JS or a lightweight component, not a heavy library.
- The FAQ accordion should be pure CSS (`<details>`/`<summary>`) or a tiny React component.
- The hub pages are valuable internally for crawl efficiency and externally as nav landings; do not de-prioritise them.

## References

- PRD §"User Stories" (Discovery & SEO, Conversion, Trust)
- Research §3.1 (Index hub pages), §6.6 (About page)
