# 0002 — Design system component library

**Status:** done
**Type:** ui
**Depends on:** 0001
**Blocks:** 0006, 0007, 0008

## Problem

The prototype's `shared.css` defines a coherent set of visual building blocks — announce bar, nav, footer, modal, buttons, trust bar, CTA band, sticky mobile CTA, photo placeholder. These need to be reusable React components styled with Tailwind so every page across 1,456 routes shares the same look and behavior.

## Acceptance criteria

- [ ] **Announce bar** — full-width navy bar with white copy and a gold-highlighted span.
- [ ] **Nav** — sticky, backdrop-blur, 70px height, logo (left) + nav links (center) + phone button + primary CTA (right). Hides nav links + CTAs at ≤768px in favor of a hamburger.
- [ ] **Mobile nav drawer** — fullscreen navy overlay, large white links, close button top-right.
- [ ] **Buttons** — primary (teal/navy), secondary (outlined navy), phone (icon + outlined), white-on-teal, ghost-dark, primary-lg variants per prototype.
- [ ] **Trust bar** — offwhite band with icon-pill items, wraps on small screens.
- [ ] **CTA band** — teal full-width band with heading, supporting copy, and CTA buttons.
- [ ] **Footer** — 4-col grid (brand / links / resources / contact), collapses to 2-col at 1024px and 1-col at 768px. Bottom row with copyright + secondary links.
- [ ] **Modal** — overlay with backdrop blur, centered card with close button, focus trap, ESC dismisses, scroll lock.
- [ ] **Sticky mobile CTA** — fixed bottom bar with Book Now (primary) + Call (phone) buttons, only renders ≤768px, body padding-bottom adjusted.
- [ ] **Photo placeholder** — navy2 hatched-pattern placeholder with monospace label, used as a fallback when an image is not yet supplied.
- [ ] **Section primitives** — `<Section>`, `<SectionHead>` (with optional `center` variant), `<SectionLabel>`, `<SectionTitle>`, `<SectionDesc>`. Section default padding `80px 5vw`, collapses to `56px 5vw` at ≤520px.
- [ ] All components are responsive per the prototype's breakpoints (1024 / 768 / 520).
- [ ] All components are keyboard-navigable; modal traps focus.

## Implementation notes

- Icons: small inline SVGs only — do not pull in an icon library.
- Class composition via `clsx` or `cva` if useful; not required.
- The `<Logo />` component lives in 0003, not here. The Nav and Footer should consume it as a slot.
- Match the prototype's exact color values via Tailwind theme tokens — no inline hex codes in components.

## References

- PRD §"Brand & UI"
- Research §6.2 (Visual design system)
- `design/handoff/project/shared.css`
