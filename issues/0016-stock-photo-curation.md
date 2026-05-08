# 0016 — Stock photo curation

**Status:** done
**Type:** content
**Depends on:** —
**Blocks:** 0007 (visual completeness only — page templates can ship with placeholders if this lags)

## Problem

The prototype renders hatched `photo-placeholder` divs everywhere; the site cannot ship to production looking like that. ~30 hand-picked stock photos covering hero, before/after, services, regions, and atmosphere are needed.

## Acceptance criteria

- [ ] Photos sourced from Unsplash and/or Pexels under their commercial-use licenses (no attribution required, but license URLs documented in `public/images/CREDITS.md`).
- [ ] Coverage:
  - Homepage hero (1)
  - Before/after pairs for homepage (3 pairs = 6)
  - Before/after pairs for carpet service page (2 pairs = 4)
  - Service hero per service (11)
  - Region atmosphere images for fallback combo heroes (~8)
  - About page atmosphere (1)
  - Default OG fallback (1)
- [ ] All images optimised before commit: long edge ≤2000px, JPEG quality ~80, alt text drafted.
- [ ] Filename convention: `intent-context.jpg` (e.g. `hero-carpet-cleaning.jpg`, `before-after-rug-1.jpg`, `region-inner-east.jpg`).
- [ ] Committed to `public/images/`.
- [ ] Avoid the most-overused stock shots (the same five "smiling cleaner with spray bottle" photos that every cleaning site uses). Favor honest, action-oriented imagery.
- [ ] `public/images/CREDITS.md` documents source URL + photographer for each image.

## Implementation notes

- Search terms that yield the right tone: "real interior", "clean apartment Melbourne", "carpet vacuum", "kitchen sparkle", "office cleaning real".
- Avoid heavily-staged corporate stock — those photos read as fake to AU residential consumers.
- Before/after photos are hard to source as honest pairs; if a real pair isn't available, treat the slider as illustrative and frame the page so the slider isn't the centerpiece.
- The `<PhotoPlaceholder />` component from 0002 remains in the codebase as a fallback for slots without final imagery.

## References

- PRD §"Images", §"Discovery & SEO" (story 7 — Core Web Vitals)
- Research §7 (Images)
