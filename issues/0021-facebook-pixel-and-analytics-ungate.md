# 0021 — Facebook Pixel, analytics ungating, and legal stub pages

**Status:** needs-triage
**Type:** observability + small content additions
**Depends on:** 0015 (Analytics & cookie consent)
**Blocks:** —

## Problem Statement

The business runs Meta (Facebook/Instagram) ads to drive bookings, but has no Pixel installed — so Meta has zero visibility into which clicks become leads. Without a Pixel and a `Lead` event, the ad platform cannot optimise delivery toward converters, retarget visitors who didn't book, or report cost-per-lead accurately. Today only Google Ads is wired up (`lib/analytics/conversion.ts`), and even that fires only after a consent banner that **never displays on mobile** (`ConsentBanner.tsx` is `hidden sm:block`), so a meaningful share of paid traffic generates no analytics signal at all.

## Solution

Install the Meta Pixel and fire two events: `PageView` on every page (including client-side route changes) and `Lead` on booking-form submissions from both `BookingForm` and `HeroFunnel`. At the same time, simplify the consent model so all three analytics tools (Pixel, GA4, Microsoft Clarity) fire for every visitor in production, with a single production-only gate replacing the broken consent gate. Add stub Privacy and Terms pages that the banner and footer can link to, so the legal surface area is wired up even though the policies themselves are placeholder content for future legal review.

## User Stories

1. As the business owner, I want every page view tracked by Meta, so that Meta's ad delivery algorithm has full visibility into traffic patterns and can optimise audiences.
2. As the business owner, I want every booking-form submission to fire a Meta `Lead` event, so that I can run conversion-optimised campaigns on Facebook and Instagram.
3. As the business owner, I want client-side route navigations to fire `PageView` events, so that single-session multi-page visits are counted accurately and not collapsed into one impression.
4. As the business owner, I want the same route-change fix to apply to GA4, so that Google Analytics no longer undercounts engagement across the App Router.
5. As the business owner, I want analytics to fire for mobile visitors, so that the largest share of my paid traffic produces conversion signal.
6. As the business owner, I want the Pixel ID configurable via environment variable, so that staging and rotated IDs don't require a code change.
7. As the business owner, I want analytics scripts to only run in production, so that my dev work and preview deploys don't pollute Meta and GA4 data with non-real traffic.
8. As the business owner, I want the same single `trackLeadConversion` call to dispatch to both Google Ads and Meta, so that adding more vendors later is a one-file change.
9. As a site visitor, I want a clearly visible footer link to a Privacy Policy and a Terms page, so that I can review the site's data handling before deciding to provide my contact details.
10. As a site visitor on the consent banner, I want links to the Privacy Policy and Terms inline in the banner copy, so that the disclosure is reachable in context.
11. As a site visitor, I want the legal pages to look like the rest of the site, so that they feel like part of a credible business and not boilerplate dropped in.
12. As a returning visitor, I want the consent banner not to mention specific third-party tool names, so that the copy doesn't drift every time a tool is added or removed.
13. As a developer joining the project, I want `.env.example` to document `NEXT_PUBLIC_FB_PIXEL_ID`, so that I know which env vars are expected without reading source.
14. As a developer, I want `trackLeadConversion` to be the single integration point for new conversion vendors, so that I don't have to grep two form components every time I add or change a vendor.
15. As a developer, I want a unit test suite around `trackLeadConversion`, so that I can refactor or extend the function without manually clicking through forms in a browser.
16. As an SEO maintainer, I want the new `/privacy` and `/terms` pages to be statically rendered with `metadata` and a canonical URL, so that they behave like the other static pages and don't surface as duplicate or thin content.
17. As the business owner, I want the Pixel to fail closed when the env var is unset, so that a forgotten config in staging silently does nothing rather than firing against the prod Pixel ID.
18. As a future legal reviewer, I want the stub Privacy and Terms pages to have realistic section headings (Information We Collect, Bookings & Quotes, Governing Law, etc.), so that replacing placeholder paragraphs with reviewed copy is a content edit rather than a rebuild.
19. As the business owner, I want the noscript Pixel fallback included, so that no-JavaScript users (rare on mobile but real on some corporate networks) still register a server-side hit.
20. As a future maintainer, I want the consent banner to remain in the DOM as a UI element even though it no longer gates anything, so that re-introducing real consent gating in the future is a one-component change.

## Implementation Decisions

**Pixel events and transport**
- Two events only: `PageView` (initial load + every client-side route change) and `Lead` (form submit, both forms). No `Contact`, no `CompleteRegistration`.
- Plain `Lead` event — no Advanced Matching, no `value`, no `currency`. Parity with the agreed minimum for v1.
- Browser Pixel only. No Conversions API in this scope.
- Include the standard Meta `<noscript><img>` fallback.

**Configuration**
- New env var `NEXT_PUBLIC_FB_PIXEL_ID` exposed from `lib/config/site.ts` as `fbPixelId`, defaulting to empty string. Matches the GA4/Clarity pattern, not the hardcoded-fallback pattern used for Google Ads in the same file.
- Pixel renders only when `fbPixelId` is set AND `isProduction === true`.
- Add the new var to `.env.example`.

**Environment gating (applies to all three analytics tools)**
- Gate Pixel, GA4, and Microsoft Clarity on `isProduction` (already exported from `lib/config/site.ts`).
- Dev (`next dev`) and Vercel preview deploys: all three are silent.
- Production: all three fire for every visitor regardless of consent state.

**Consent banner**
- Remove the analytics-consent gate from `SiteAnalytics`. The banner remains in the DOM with its existing Accept-all / Essential-only buttons; both buttons continue to write to `kv:cc:analytics` localStorage but neither button changes what loads.
- Banner copy rewritten to:
  > "We use cookies to run this site, improve your experience, and measure our marketing. See our [Privacy Policy](/privacy) and [Terms](/terms)."
- No tool-specific names in the banner copy.
- Banner mobile visibility is **not** changed in this PRD — it remains hidden on mobile. The Pixel fires regardless of banner state, so the mobile gap no longer blocks tracking.

**Code structure**
- Pixel `<Script>` block lives inside `components/analytics/SiteAnalytics.tsx` next to the GA4 and Clarity blocks, behind the same `isProduction` gate.
- A new client component `components/analytics/AnalyticsRouteChange.tsx` mounts inside `app/layout.tsx`. It subscribes to `usePathname()` and on each change fires both `window.fbq('track', 'PageView')` and `window.gtag('event', 'page_view', { page_path })`. The initial PageView from the Pixel and GA4 init scripts is still owed; the route-change effect skips the very first render (matching the page already counted by init).
- `lib/analytics/conversion.ts` extended: `trackLeadConversion` continues to fire the Google Ads conversion, and additionally calls `window.fbq('track', 'Lead')` when `window.fbq` exists. No new exported function, no caller changes in `BookingForm` or `HeroFunnel`.

**Legal stub pages**
- New routes `app/privacy/page.tsx` and `app/terms/page.tsx`. Static rendering, full `metadata` export with canonical URL.
- Each page uses the existing design-system primitives: `Breadcrumb`, `Section`, `SectionHead`, `SectionLabel`, `SectionTitle`, `SectionDesc`, `CtaBand`. No full navy hero — legal pages get a simple page header instead.
- Privacy sections: Information We Collect, How We Use Your Information, Cookies / Analytics / Marketing Pixels, Sharing & Third Parties, Your Rights (AU Privacy Principles), Contact Us.
- Terms sections: Use of This Site, Bookings & Quotes, Cancellations, Liability & Disclaimers, Governing Law (Victoria, Australia), Contact Us.
- Each section contains 1–2 lines of polished placeholder text. No "draft under review" banner — the pages appear finished to the public.

**Footer**
- Add Privacy and Terms links to the bottom row of `components/layout/Footer.tsx`, alongside the existing About/Contact links.

## Testing Decisions

**What makes a good test for this work:** assert external behaviour only — i.e. that the right global side-effects (`window.gtag`, `window.fbq`) are invoked with the right arguments for a given lead payload and a given configuration. Do not assert internal control flow, do not assert specific UUID values, do not snapshot whole call argument arrays — match on the meaningful fields (`send_to`, `event` name, presence of `transaction_id` as a string).

**Module to be tested: `lib/analytics/conversion.ts`**

Test cases for `trackLeadConversion`:
- Fires the Google Ads `conversion` event with the expected `send_to`, `value`, `currency`, and a string `transaction_id` when `window.gtag` exists and `googleAdsId` + `googleAdsConversionLabel` are configured.
- Fires the Meta `Lead` event via `window.fbq` when `window.fbq` exists.
- Fires both side-effects when both `gtag` and `fbq` exist (the common production case).
- Does not throw and does not call `fbq` when `window.fbq` is undefined (Pixel not loaded — e.g. dev or env var unset).
- Does not throw and does not call `gtag` when `window.gtag` is undefined.
- Does not call `gtag` when `googleAdsId` or `googleAdsConversionLabel` is empty.
- Passes the lead's email/phone/first-name/postcode through to `gtag('set', 'user_data', …)` in the same shape the current implementation uses.

**Prior art for the test file structure and mocking style:** `lib/seo/__tests__/jsonld.test.ts`, `lib/leads/__tests__/submitLead.test.ts`. Tests live next to the module under `lib/analytics/__tests__/conversion.test.ts`. Vitest is the runner; `vitest.setup.ts` already wires `@testing-library/jest-dom/vitest`.

**Other modules are not unit-tested in this PRD.** `SiteAnalytics` and `AnalyticsRouteChange` are Next.js Script/effect orchestration with little testable surface beyond "did Script render"; the legal stub pages and footer changes are static markup. Verification for those modules is manual:

- After deploy: load the production site, open Meta Pixel Helper, confirm `PageView` fires on initial load and on every internal navigation.
- Submit a test lead via both `BookingForm` (modal) and `HeroFunnel` (homepage form) — confirm `Lead` appears in the Pixel Helper trail and shortly after in Meta Events Manager.
- Visit `/privacy` and `/terms` directly; confirm both render with the design system, breadcrumbs, and CTA band.
- Inspect the footer; confirm Privacy + Terms links resolve to the new pages.
- Run `next dev` locally and confirm none of `fbq`, `gtag`, or `clarity` initialise (no script tags, no network calls to fbevents.js / googletagmanager.com / clarity.ms).

## Out of Scope

- Meta Conversions API (server-side event mirror). Browser Pixel only for now; CAPI is a future enhancement once browser-side conversions are flowing.
- Real legal review of Privacy and Terms content. The stub pages have placeholder paragraphs; replacing them with lawyer-approved copy is a separate content task.
- Restoring real consent gating. The consent banner stays cosmetically; no functional toggle is built. If/when real consent is required (e.g. EU traffic justification, regulatory change), that is a future PRD.
- Making the consent banner visible on mobile. The mobile-banner gap is preserved as-is; the new analytics setup does not depend on the banner so the gap is no longer blocking.
- Advanced Matching for the Pixel (hashed email, phone, etc.). Plain `Lead` event for v1.
- Lead `value` or `currency` on the Meta event. Equal weighting for all leads in this scope.
- Additional Pixel events such as `Contact` (phone-tap) or `CompleteRegistration`. Two events only.
- New tracking for non-form CTAs (phone-tap on `tel:` links, click-to-email).
- Vercel Analytics changes. Out of scope; it continues to run as today.
- Migration off `vanilla-cookieconsent` or any other dependency change.

## Further Notes

- This PRD intentionally produces a **non-functional consent banner**. The risk was flagged and explicitly accepted: the buttons appear to offer a choice but neither button changes what loads. The mitigation is that all three tools are documented (via the Privacy Policy page and banner copy) and the Privacy Policy is reachable from both the banner and the footer.
- The Google Ads conversion path in `lib/analytics/conversion.ts` already exists and is preserved unchanged in behaviour. The extension is purely additive (one extra `fbq` call).
- `isProduction` reads `VERCEL_ENV === "production"`. Local `next dev` returns `false`. Vercel preview returns `false`. Vercel production returns `true`.
- The route-change effect should listen via `usePathname()` from `next/navigation`. Skip the initial mount to avoid double-firing the first `PageView` (already sent by the Pixel/GA4 init scripts).
- Footer placement: Privacy and Terms join the small bottom row alongside About/Contact, not the larger "Company" cluster. Conventional placement matches user expectations for legal links.

## References

- Builds on: `issues/0015-analytics-and-consent.md`
- Modules touched: `lib/analytics/conversion.ts`, `lib/config/site.ts`, `components/analytics/SiteAnalytics.tsx`, `components/analytics/ConsentBanner.tsx`, `components/layout/Footer.tsx`, `app/layout.tsx`
- New modules: `components/analytics/AnalyticsRouteChange.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `lib/analytics/__tests__/conversion.test.ts`
- Prior-art tests: `lib/seo/__tests__/jsonld.test.ts`, `lib/leads/__tests__/submitLead.test.ts`
- Meta Pixel docs: https://developers.facebook.com/docs/meta-pixel
