# 0019 — Production launch readiness: Google indexing & OG previews

**Status:** partially-done — remaining work tracked in 0020
**Type:** ops + small code change
**Depends on:** 0013 (SEO infrastructure), 0014 (OG image generation), 0009 (Lead intake), 0017 (Pre-launch checklist)
**Blocks:** —

## Problem

The site is live at `https://kleanvictoria.com.au`, but several launch-readiness gaps remain that block "elegant Google appearance" and reliable OG previews when links are shared:

1. **OG default image was missing.** `app/layout.tsx` referenced `/og-default.png` which did not exist in `public/`. Homepage and the four static hub pages emitted a 404 OG image URL, breaking Slack/LinkedIn/iMessage previews on share. *(Fixed during the grilling session — `public/og-default.png` is now in place at 1200×630.)*

2. **Host canonicalization was misconfigured in Vercel.** Bare `kleanvictoria.com.au` was 307-redirecting to `www`, while the site's `siteUrl`, sitemap, canonicals, JSON-LD, and OG URLs all referenced **bare**. Subsequently, after flipping bare to primary, `www.kleanvictoria.com.au` was still serving the site directly (HTTP 200) instead of redirecting. *(Both issues are fixed and verified — bare serves direct, www returns HTTP/2 308 with correct path-preserving Location header.)*

3. **OG `<meta>` tags emit bare image URLs only** — no `og:image:width`, `og:image:height`, `og:image:alt`. Slack, iMessage, and LinkedIn render larger and more reliable previews when these are present. The site declares `images: ["..."]` instead of `images: [{ url, width, height, alt }]` in four locations (`app/layout.tsx:38`; `app/[slug]/page.tsx:52`, `:68`, `:85`).

4. **No IndexNow integration.** Bing/DuckDuckGo/Yandex indexing is dependent on natural crawl. IndexNow lets the site push a notification on deploy, accelerating Bing-side coverage.

5. **Resend is still sending lead-notification emails from `onboarding@resend.dev`.** Without DKIM/SPF for `kleanvictoria.com.au`, lead emails are at high risk of landing in spam. Sender address is hard-coded; should be env-driven.

6. **GSC + Bing not yet verified, sitemap not submitted, no seed URLs requested for indexing.** No discovery acceleration is happening.

7. **Validation suite (Rich Results Test, Schema Markup Validator, Mobile-Friendly, PageSpeed Insights, Facebook Sharing Debugger, LinkedIn Post Inspector) has not been run against live URLs.**

## Out of scope (deferred)

- NAP & reviews consistency between Google Business Profile and JSON-LD (logo PNG export, `sameAs` social profiles, `openingHours`, real review numbers vs. live Google Places integration). Tracked separately.
- The hardcoded "4.9★ from 620+ reviews" badge and "Police-checked · Insured" copy. Owner is handling outside this issue.
- Directory submissions (True Local, Yellow Pages, hipages, Service Seeking, Word of Mouth, Yelp AU, Apple Maps Connect) — operational/marketing, not engineering.
- `lastmod` accuracy in sitemap (currently `now` for every URL). Low priority — fix when convenient.
- Image sitemap. Skipped — low ROI for service-area cleaning.

## Acceptance criteria

> **Status (2026-05-08):** items marked `[x]` below are verified shipped. Remaining unchecked items have been carved out into issue **0020** for follow-up.

### Code changes

- [ ] **OG image declarations upgraded to objects with `width`/`height`/`alt`** at:
  - `app/layout.tsx` — sitewide default
  - `app/[slug]/page.tsx` — service, location, combo overrides (alt should reflect page topic)
  - Each declaration uses `width: 1200`, `height: 630`, and a topic-specific `alt` string.
- [x] **Resend sender `from:` is env-driven**, not hard-coded. *(Verified 2026-05-08; production env var set in Vercel.)*
  - ~~New env var `RESEND_FROM_EMAIL`~~ → shipped as **`RESEND_FROM`** in `app/api/leads/route.ts:7-8`, fallback `"KleanVictoria <onboarding@resend.dev>"`. Vercel production env var name matches code (`RESEND_FROM`). Naming discrepancy with the original spec; doc/alignment cleanup carried into 0020.
  - Default in production after Resend domain verification: `noreply@kleanvictoria.com.au` (or the agreed branded address).
- [ ] **IndexNow integration shipped.**
  - New module: `lib/indexnow/` exposing a pure `pingIndexNow(urls, key, host)` function — takes a list of URLs, returns a structured success/failure result.
  - New API route at `app/api/indexnow/route.ts` that reads sitemap URLs (via the same content adapters used by `app/sitemap.ts`) and calls the adapter. Protected by a shared secret (`INDEXNOW_TRIGGER_SECRET` env var) checked against an `Authorization` header.
  - Vercel deploy hook configured to POST to that route on production deploys only.
  - IndexNow key file (random 32-char hex) committed to `public/<key>.txt` with the matching key value.

### Operational steps (in DNS/dashboard, not code)

- [x] **Single DNS edit session at the registrar** — add all of: *(Verified 2026-05-08.)*
  - GSC Domain-property verification TXT (`google-site-verification=...`).
  - Resend SPF TXT.
  - Resend DKIM TXT × 2.
  - Resend DMARC TXT (optional but recommended: `v=DMARC1; p=none; rua=mailto:...`).
- [x] **GSC verified** at the Domain property level (`kleanvictoria.com.au`). *(Verified 2026-05-08.)*
- [x] **Resend domain verified.** *(Verified 2026-05-08.)*
- [x] **Sitemap submitted in GSC** (`sitemap.xml`); confirm "Success" status and discovered count ≈ 1456. *(Verified 2026-05-08.)*
- [x] **GSC URL Inspection → Request Indexing** for the 10 seed URLs: *(Verified 2026-05-08.)*
  - `/`
  - `/services`
  - `/locations`
  - `/about`
  - `/contact`
  - `/carpet-cleaning`
  - `/house-cleaning`
  - `/commercial-cleaning`
  - `/deep-clean`
  - `/window-cleaning`
- [ ] **Bing Webmaster Tools** property added (Domain or URL prefix), GSC verification imported, `sitemap.xml` submitted.
- [~] **Vercel envs set in Production scope:** *(Partial as of 2026-05-08 — IndexNow envs deferred to 0020.)*
  - [x] `RESEND_FROM` = branded address (set in Vercel; note: var named `RESEND_FROM`, not `RESEND_FROM_EMAIL`).
  - [ ] `INDEXNOW_TRIGGER_SECRET` = random secret.
  - [ ] `INDEXNOW_KEY` = matches `public/<key>.txt` filename.

### Validation runs (against live URLs)

Run on at minimum: homepage, one service page (e.g. `/carpet-cleaning`), one combo page (e.g. `/carpet-cleaning-richmond`).

- [ ] **Rich Results Test** passes — LocalBusiness, Service, FAQPage, BreadcrumbList all eligible.
- [ ] **Schema Markup Validator** passes with no errors.
- [ ] **Mobile-Friendly Test** passes on homepage.
- [ ] **PageSpeed Insights / Core Web Vitals** — homepage and one service page meet: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile. Red issues fixed before considering this issue done.
- [ ] **Facebook Sharing Debugger** — paste each test URL, click "Scrape Again", confirm preview renders with title/description/image.
- [ ] **LinkedIn Post Inspector** — same flow; LinkedIn caches harder, so verify after the OG-objects upgrade ships.
- [ ] **Slack / iMessage paste-test** — confirm rendered preview matches expectation.

### Sanity checks (CLI)

- [x] `curl -I https://kleanvictoria.com.au/sitemap.xml` returns HTTP/2 200, `application/xml`. *(Verified during grilling.)*
- [x] `curl https://kleanvictoria.com.au/robots.txt` shows `Allow: /`, `Disallow: /api/`, no `Disallow: /`. *(Verified during grilling.)*
- [x] `curl -I https://www.kleanvictoria.com.au/<any-path>` returns HTTP/2 308 with path-preserving `Location: https://kleanvictoria.com.au/<any-path>`. *(Verified during grilling.)*

## Implementation notes

### Module A — OG metadata image-object upgrade

Declarative-only change. Pattern:

```ts
images: [{
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "KleanVictoria · Professional Cleaning Services Melbourne",
}]
```

For dynamic OG URLs in `app/[slug]/page.tsx`, alt must reflect the resolved topic — service name, location name, or `<service> in <location>`.

### Module B — IndexNow integration

Deep, testable adapter. Boundary: the adapter takes plain inputs and returns a structured result, performs the HTTP call, and surfaces the API's quirky response codes (200 OK, 202 Accepted, 422 invalid key, etc.). The trigger route is a thin wrapper: auth-check → load sitemap URLs via existing content adapters → call adapter → return JSON.

Trigger shape: **Vercel deploy hook → POST to `/api/indexnow`**. The deploy hook is configured in the Vercel dashboard (Project → Settings → Git → Deploy Hooks) and bound only to production-branch deploys. The route is idempotent — re-running it is harmless (IndexNow deduplicates server-side).

The IndexNow key file (`public/<key>.txt`) must contain exactly the key string and be reachable at `https://kleanvictoria.com.au/<key>.txt`. Bing's spec requires this for ownership verification.

### Module C — Resend `from:` config

Read `RESEND_FROM_EMAIL` env var. If unset, fall back to `onboarding@resend.dev`. Document the variable in `.env.example` and in the README/research notes.

### Vercel domain — already settled

Bare `kleanvictoria.com.au` is set as Primary; `www.kleanvictoria.com.au` is set to Redirect (308) to bare. No further work needed; included here only as the contextual reason the rest of the work is meaningful.

## Testing decisions

- **Module B (IndexNow adapter):** unit test the pure adapter with a mocked `fetch`. Cover the request payload shape (host, key, keyLocation, urlList), and verify behaviour for each documented IndexNow response code (200 success, 202 accepted, 400 bad request, 403 unauthorized, 422 invalid key, 429 rate-limited). Prior art: `lib/seo/__tests__/jsonld.test.ts` for the pure-function test pattern; `app/api/leads/route.ts` for fetch mocking conventions.
- **Module A (OG image declarations):** no test. Declarative metadata; visual verification via Facebook Sharing Debugger / LinkedIn Post Inspector covers it.
- **Module C (Resend `from:`):** no test. One-line config read.

Test scope rule for Module B: assert external behaviour (HTTP request shape, returned `{ ok, status, message }`) — never the internal control flow.

## References

- Research §3 (Routing & URL architecture), §8 (SEO), §10 (Environment variables), §12 (Risks)
- Issue 0017 (Pre-launch checklist) — overlapping operational items; this issue narrows and re-scopes for indexing + OG specifically.
- Issue 0013 (SEO infrastructure), 0014 (OG image generation), 0009 (Lead intake) — modules being touched.
- IndexNow spec: https://www.indexnow.org/documentation
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
