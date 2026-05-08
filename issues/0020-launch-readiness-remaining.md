# 0020 — Launch readiness: remaining items from 0019

**Status:** ready
**Type:** ops + small code change
**Depends on:** 0019 (parent), 0013, 0014, 0009
**Blocks:** —

## Problem

Carve-out from issue 0019 covering items not completed in the initial launch push: the OG image-object upgrade, IndexNow integration, Bing Webmaster Tools, the remaining Vercel env vars, and the validation suite (Rich Results, Schema Validator, Mobile-Friendly, PageSpeed/CWV, FB/LinkedIn/Slack share previews).

Items reconciled with 0019 on 2026-05-08. The DNS, GSC, Resend domain verification, sitemap submission, seed-URL indexing requests, and `RESEND_FROM` env var are all already shipped in 0019.

## Acceptance criteria

### Code changes

- [ ] **OG image declarations upgraded to objects with `width`/`height`/`alt`** at four locations:
  - `app/layout.tsx:38` — sitewide default
  - `app/[slug]/page.tsx:52` — service override
  - `app/[slug]/page.tsx:68` — location override
  - `app/[slug]/page.tsx:85` — combo override

  Each declaration uses `width: 1200`, `height: 630`, and a topic-specific `alt`. For dynamic OG URLs in `app/[slug]/page.tsx`, alt must reflect the resolved topic — service name, location name, or `<service> in <location>`. Pattern:

  ```ts
  images: [{
    url: "/og-default.png",
    width: 1200,
    height: 630,
    alt: "KleanVictoria · Professional Cleaning Services Melbourne",
  }]
  ```

- [ ] **IndexNow integration shipped.**
  - New module: `lib/indexnow/` exposing a pure `pingIndexNow(urls, key, host)` function — takes a list of URLs, returns a structured success/failure result.
  - New API route at `app/api/indexnow/route.ts` that reads sitemap URLs (via the same content adapters used by `app/sitemap.ts`) and calls the adapter. Protected by a shared secret (`INDEXNOW_TRIGGER_SECRET` env var) checked against an `Authorization` header.
  - Vercel deploy hook configured to POST to that route on production deploys only.
  - IndexNow key file (random 32-char hex) committed to `public/<key>.txt` with the matching key value.
  - Adapter unit tests with mocked `fetch` covering each documented IndexNow response code (200, 202, 400, 403, 422, 429). Prior art: `lib/seo/__tests__/jsonld.test.ts`.

- [ ] **Doc cleanup: align Resend env-var naming.**
  - Code uses `RESEND_FROM` (`app/api/leads/route.ts:7-8`); add it to `.env.example`.
  - Update README/research notes to reference `RESEND_FROM` consistently.

### Operational

- [ ] **Bing Webmaster Tools** — property added (Domain or URL prefix), GSC verification imported, `sitemap.xml` submitted.

- [ ] **Vercel production envs added: `INDEXNOW_TRIGGER_SECRET` and `INDEXNOW_KEY`.**

  Setup steps (production scope):

  1. Vercel dashboard → Project (kleanvictoria) → Settings → Environment Variables.
  2. Add `INDEXNOW_TRIGGER_SECRET` (Production only):
     - Generate locally: `openssl rand -hex 32`
     - Paste value; tick only "Production"; Save.
  3. Add `INDEXNOW_KEY` (Production only):
     - Generate locally: `openssl rand -hex 16` (yields 32 hex chars).
     - Paste value; tick only "Production"; Save.
     - Ensure `public/<INDEXNOW_KEY>.txt` exists in the repo with that exact key as its sole contents.
  4. Configure Vercel deploy hook: Settings → Git → Deploy Hooks → "Create Hook" bound to the production branch. Copy the hook URL.
  5. Wire deploy hook to call `/api/indexnow` after each production deploy (e.g., a tiny GitHub Action on deployment status, or a curl in the deploy pipeline).
  6. Trigger a redeploy and verify:
     - `curl https://kleanvictoria.com.au/<INDEXNOW_KEY>.txt` returns HTTP 200 with the key string.
     - `curl -X POST -H "Authorization: Bearer $INDEXNOW_TRIGGER_SECRET" https://kleanvictoria.com.au/api/indexnow` returns a structured success response.

### Validation runs

Run on at minimum: homepage, one service page (e.g. `/carpet-cleaning`), one combo page (e.g. `/carpet-cleaning-richmond`).

- [ ] **Rich Results Test** passes — LocalBusiness, Service, FAQPage, BreadcrumbList all eligible.
- [ ] **Schema Markup Validator** passes with no errors.
- [ ] **Mobile-Friendly Test** passes on homepage.
- [ ] **PageSpeed Insights / Core Web Vitals** — homepage and one service page meet: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile. Red issues fixed before considering this issue done.
- [ ] **Facebook Sharing Debugger** — paste each test URL, click "Scrape Again", confirm preview renders with title/description/image. Best done after the OG-objects upgrade ships.
- [ ] **LinkedIn Post Inspector** — same flow; LinkedIn caches harder, so verify after the OG-objects upgrade ships.
- [ ] **Slack / iMessage paste-test** — confirm rendered preview matches expectation.

## References

- Parent: `issues/0019-production-launch-readiness.md`
- Modules: 0013 (SEO infrastructure), 0014 (OG image generation), 0009 (Lead intake)
- IndexNow spec: https://www.indexnow.org/documentation
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
