# 0014 — Open Graph image generation (next/og)

**Status:** done
**Type:** seo
**Depends on:** 0003, 0004
**Blocks:** —

## Problem

When someone shares a service or combo URL in WhatsApp, SMS, or social platforms, the link unfurl preview drives click-through. Default thumbs (Unsplash hero crop) look generic; a branded OG card with the page title and KleanVictoria mark converts measurably better — especially for the boomer demographic that shares URLs heavily via SMS/WhatsApp.

## Acceptance criteria

- [ ] `next/og` route handler(s) generate dynamic OG images at runtime.
- [ ] Three template variants:
  - **Service variant** — service name + tagline + KleanVictoria wordmark + mark.
  - **Location variant** — location name + region + KleanVictoria wordmark + mark.
  - **Combo variant** — `"<Service> in <Location>"` + KleanVictoria wordmark + mark.
- [ ] Card dimensions: 1200×630.
- [ ] Card design: navy background, teal accent, mark + wordmark, large headline in Lora, supporting copy in Plus Jakarta Sans.
- [ ] OG image URLs wired into per-page `generateMetadata` (from 0013) so each page exposes its own preview card.
- [ ] Static fallback `/og-default.png` for the homepage and any case where the dynamic generation fails.
- [ ] Cards render correctly when previewed via X / Telegram / WhatsApp / iMessage / Discord.

## Implementation notes

- `next/og` (the App Router OG image API) is the standard way; uses Satori internally to render JSX → PNG.
- Fonts must be loaded as buffers — fetch the woff2 from `next/font` or the public CDN and pass to Satori.
- Logo SVG must be inlined or fetched as a buffer.
- Cache OG images aggressively (immutable per slug; revalidate only when content changes).

## References

- PRD §"User Stories" (story 6 — sharing preview)
- Research §8.4 (Open Graph)
