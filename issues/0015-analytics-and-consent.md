# 0015 — Analytics & cookie consent

**Status:** done
**Type:** observability + compliance
**Depends on:** 0001
**Blocks:** —

## Problem

The business owner needs visibility into where leads come from (GA4), why visitors drop off the booking funnel (Microsoft Clarity), and how the site performs in real-user environments (Vercel Analytics). EU/UK traffic from expats and Google's evolving consent requirements make a cookie consent banner the safe default.

## Acceptance criteria

- [ ] Google Analytics 4 wired in. Reads measurement ID from `NEXT_PUBLIC_GA4_ID`. Fires only after consent.
- [ ] Microsoft Clarity wired in. Reads project ID from `NEXT_PUBLIC_CLARITY_ID`. Fires only after consent (defensive default; Clarity claims GDPR compliance without consent in many jurisdictions but consent-gating is safer).
- [ ] Vercel Analytics wired in (`@vercel/analytics`). Cookieless; fires unconditionally.
- [ ] Cookie consent banner (privacy-first lib such as `vanilla-cookieconsent`) renders on first visit. Categories: necessary (always on), analytics (GA4 + Clarity, opt-in).
- [ ] Banner copy is AU-friendly but functional under GDPR for any EU traffic.
- [ ] Consent state persists across navigation and survives page refresh.
- [ ] Updating consent re-evaluates which scripts are loaded without requiring a page reload.

## Implementation notes

- Use `next/script` with the appropriate strategy (`lazyOnload` is fine for analytics tags).
- Do not hardcode the GA4 measurement ID or Clarity ID; treat as required-for-feature env vars (analytics simply doesn't run if unset).
- Banner copy should mention GA4 and Clarity by name so the consent is informed.
- Test consent gating manually: with cookies cleared, confirm GA4 + Clarity tags do not load until "Accept" is clicked.

## References

- PRD §"Observability & analytics"
- Research §9 (Analytics & consent)
