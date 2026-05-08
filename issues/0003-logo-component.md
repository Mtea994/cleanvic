# 0003 — Logo component (SVG mark + wordmark + lockup)

**Status:** done
**Type:** ui
**Depends on:** 0001
**Blocks:** 0014

## Problem

The prototype ships with a placeholder logo glyph in a navy rounded-square. The brand needs a real, distinctive mark that:
- Reads as a friendly cleaning brand at favicon size.
- Sits inside the existing 40×40 logo slot in the nav.
- Is recolorable via Tailwind for theme changes.
- Visually nods to the Scrub Daddy character-mark genre but is intentionally differentiated to avoid trademark risk.

## Acceptance criteria

- [ ] `public/logo-mark.svg` exists: navy circle background + teal crescent smile + teal filled-oval eyes. Uses `currentColor` on the features so Tailwind classes can recolor.
- [ ] `<Logo />` React component supports three variants: `mark` (icon only), `wordmark` (text only), `lockup` (icon + wordmark side by side). Default is `lockup`.
- [ ] Wordmark renders as: navy "Clean" + teal italic "Victoria" using the Lora display font, plus a small uppercase muted "VICTORIA, AUSTRALIA" sub-label per prototype.
- [ ] Mark renders the SVG inline (not as `<img>`) so `currentColor` works.
- [ ] Component accepts a `size` prop affecting the icon dimensions; wordmark scales proportionally.
- [ ] Used by Nav (lockup variant) and Footer (lockup or mark, designer's choice).
- [ ] Favicon uses the mark (`/favicon.ico` + `/icon.svg`).

## Implementation notes

- Trademark differentiation from Scrub Daddy is on: shape (circle, not sponge silhouette), smile (closed crescent vs open mouth), eyes (filled ovals vs hollow cutouts), palette (navy/teal vs yellow). Do not change these without re-running the trademark check.
- Mark dimensions: 40×40 default, scalable.
- The icon container in the prototype is a rounded square — for this implementation it is a circle. Update Nav styling accordingly.
- Use `next/image` in the rare contexts where the mark is shown standalone outside the React tree (e.g. OG images).

## References

- PRD §"Brand & UI" (logo)
- Research §6.1 (Logo)
