# KleanVictoria — Implementation Research Document

_Compiled 2026-05-01 from a structured grilling session. This document captures every decision locked during the session, with rationale and trade-offs, intended to feed a downstream PRD._

---

## 1. Project context

**Source:** Claude Design handoff bundle at `design/handoff/` — a high-converting cleaning-services website mocked in HTML/CSS/JS for **KleanVictoria**, a Melbourne-based cleaning company.

**Reference site:** https://mastercleaner.com.au/

**Bundle contents:**
- `design/handoff/README.md` — handoff instructions
- `design/handoff/chats/chat1.md` — full design conversation transcript
- `design/handoff/project/index.html` — homepage prototype (full conversion funnel, 11 services, before/after sliders)
- `design/handoff/project/carpet-cleaning.html` — service-page template
- `design/handoff/project/melbourne.html` — location-page template
- `design/handoff/project/about-us.html` — about page
- `design/handoff/project/contact.html` — contact page
- `design/handoff/project/shared.css` — design tokens & shared component styles
- `design/handoff/project/tweaks-panel.jsx` — dev-only Claude Design tweaks panel (will be dropped)

**Design intent (from handoff chat):**
- Brand: clean, premium, trustworthy — deep navy/slate primary with bright blue/teal accent
- Audience: high-conversion intent across Melbourne metro; intuitive UX for boomers and millennials
- Mobile-first, large tap targets, sticky CTA bar on mobile
- 3-step inline booking funnel as the primary conversion mechanism
- Built for SEO (semantic HTML, meta tags, location-rich copy, dynamic per-service-per-location pages)

---

## 2. Stack decisions

| Decision | Locked value | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router, TypeScript)** | SEO-first marketing site with hundreds of generated pages; App Router is the modern default and `generateStaticParams` is core to the architecture. |
| Styling | **Tailwind v4** (with `@theme` block in CSS) | User explicitly requested Tailwind because client may want to change colors/design later. Tailwind v4's `@theme` block makes mapping the prototype's CSS custom properties (`--navy`, `--teal`, etc.) clean and keeps token swaps to a single file. |
| Fonts | **`next/font`** loading Plus Jakarta Sans (body) + Lora (display) | Matches prototype, eliminates external CDN flash, automatic preload + size-adjust. |
| Forms library | **`react-hook-form` + `zod`** | Standard pairing; Zod schema reused for client-side validation and server-side route-handler validation. |
| Animations | **CSS-only**, matching prototype | No Framer Motion v1; the prototype uses tasteful CSS transitions only. Layer in a motion library only if a specific need surfaces. |
| Hosting | **Vercel** | User-confirmed. Native Next.js fit, OG image generation, edge functions, env-var management, preview deploys. |
| Lead store | **Supabase** | User-chosen. Persists every lead to a DB you control; enables future CRM/dashboard work without rewiring forms. |
| Transactional email | **Resend** | Free tier 3k emails/mo; Next.js-friendly; one env var. |
| Analytics | **GA4 + Microsoft Clarity + Vercel Analytics** (full stack) | GA4 for funnel attribution, Clarity for free heatmaps + session replay (key for diagnosing the 3-step funnel), Vercel Analytics for Web Vitals. |

---

## 3. Routing & URL architecture

### 3.1 Standalone vs. dynamic
**Decision: dynamic routes from a typed data source.**

- Service pages, location pages, and combo pages are all generated at build time via `generateStaticParams`.
- Adding a new service or location is a TS array entry, not a new file.
- Pages remain fully static (good Core Web Vitals, ideal for SEO).

### 3.2 URL structure
**Decision: fully flat URLs, single catch-all resolver.**

- Standalone service: `/{service-slug}` (e.g. `/carpet-cleaning`)
- Standalone location: `/{location-slug}` (e.g. `/richmond`)
- Service-by-location combo: `/{service-slug}-{location-slug}` (e.g. `/carpet-cleaning-richmond`)

**Implementation:**
- Single `app/[slug]/page.tsx` resolver.
- A slug parser tries the slug as: known service → known location → known combo → 404.
- Combo parsing uses **longest-match split**: walk the slug, find the longest valid service prefix that leaves a known location suffix.
- A reserved-paths list (`about`, `contact`, `services`, `locations`, `book`, `api`, `_next`, etc.) is rejected by the resolver so explicit routes always win.
- A unit test pins the parser against ambiguous-slug edge cases (e.g. multi-word services + multi-word suburbs).

**Index hub pages:**
- `/services` — browseable list of all services (used by nav, footer, sitemap).
- `/locations` — browseable list of all suburbs.

### 3.3 Page count
- 1 home + 4 static (about, contact, services hub, locations hub)
- 11 standalone services
- 120 standalone locations (postcodes 3000–3207)
- 11 × 120 = **1,320** combo pages
- **Total ≈ 1,456 pages** generated at build

### 3.4 Why fully flat (not nested or hyphenated-only)
- User selected hyphenated-flat for combos for SEO weighting.
- Going halfway (prefixed standalones + flat combos) negates the exact-match SEO benefit of `/carpet-cleaning` vs `/services/carpet-cleaning`.
- Mastercleaner.com.au (the user's reference site) does flat-everything.

---

## 4. Content & data model

### 4.1 Source of truth
**Decision: TypeScript constants now → Contentful CMS later.**

- All content lives in `lib/content/data/services.ts` and `lib/content/data/locations.ts`.
- Pages read content via thin adapters: `getService(slug)`, `getLocation(slug)`, `getCombo(serviceSlug, locationSlug)`, `getAllServices()`, `getAllLocations()`.
- Adapters live in `lib/content/`. Pages never touch raw data — they call the adapters.
- When Contentful is introduced, only the adapter implementations change. Page code, component shapes, and slug parsing are unaffected.

### 4.2 Services list (11)
Verbatim from the prototype (after the user's earlier removal of end-of-lease and insurance claims):

1. Carpet Cleaning
2. House Cleaning
3. Commercial Cleaning
4. Window Cleaning
5. Deep Clean
6. Upholstery Cleaning
7. Mattress Cleaning
8. Tile & Grout Cleaning
9. Oven Cleaning
10. Rug Cleaning
11. Flood Restoration

**Special framing — Flood Restoration:** Listed as **honest cleanup** ("Water-damaged carpet & upholstery drying"), **not** emergency response. No IICRC certification claims, no 24/7 emergency framing. Same booking funnel as other services.

**Commercial Cleaning:** Same booking form, same recipient inbox, no separate B2B routing in v1. Sales rep sorts by hand. Promotable to dedicated form/inbox if commercial volume justifies it later.

### 4.3 Locations list (120)
**Coverage area: Melbourne metro postcodes 3000–3207** (Inner + middle Melbourne, ~25km radius from CBD).

- Sourced from the canonical data.gov.au postcode dataset.
- Each location entry: `slug`, `name`, `postcode`, `region` (Inner / Inner East / Inner West / Inner North / Inner South / Middle East / Middle West / etc.), `lat`, `lng`, `description` template field.
- Outer Melbourne (Werribee, Pakenham, Whittlesea, Mornington Peninsula) intentionally excluded — listing suburbs that aren't realistically serviced creates Google Business Profile issues and bad-review risk.

### 4.4 Per-combo content templating
Each combo page (`/{service}-{location}`) templates content from:
- The base service's name, description, FAQ, process.
- The location's name, region, postcode.
- A unique combo H1 ("[Service] in [Location] — Free Quote · KleanVictoria").
- A short location-specific blurb (driving area, neighbouring suburbs covered).
- Per-combo overrides allowed (optional field on the combo data shape) — used sparingly to avoid maintenance burden.

This produces 1,320 pages that are *not* near-duplicates from Google's perspective.

### 4.5 Pricing
**Decision: quote-only everywhere. No prices on any page.**

- No `priceFrom` field on the service data shape.
- Every CTA reads "Get a free quote." The booking form **is** the quote-request form.
- Eliminates suburb-specific pricing risk on the 1,320-combo grid.

---

## 5. Booking & lead flow

### 5.1 Submission pipeline
**Decision: Supabase + Resend.**

1. User submits the booking/quote form.
2. Client-side: `react-hook-form` validates against the shared Zod schema.
3. Server-side: route handler `app/api/leads/route.ts` re-validates with the same Zod schema.
4. Insert into Supabase `leads` table.
5. Send transactional email via Resend to `LEAD_NOTIFY_EMAIL`.
6. Return success → modal "Quote on its way" success state.

### 5.2 Anti-abuse
- **Honeypot field** in the form (hidden from users, bots fill it; submissions where it's non-empty are rejected).
- **Rate limit by IP**: query Supabase for any leads from the same IP in the last 60 seconds; reject if found.
  - Pure in-memory rate limiting is **not** used — Vercel serverless functions are stateless and per-instance memory can be bypassed by hitting different instances.
  - Supabase-backed rate limit works across all instances and adds no infrastructure.

### 5.3 Recipient
- Single inbox via `LEAD_NOTIFY_EMAIL` env var.
- Dev default: `imtinankhurshid007@gmail.com` (set per-environment in Vercel; prod overrides to client's address before launch).
- Resend `from:` address requires `kleanvictoria.com.au` DNS records (DKIM/SPF) to avoid spam folder; until then sends from `onboarding@resend.dev`.

### 5.4 Form fields
Per the prototype:
- Service (dropdown — 11 services)
- Name
- Phone
- Suburb (autocomplete from the 120-location list)
- Preferred date

Plus a hidden honeypot field.

---

## 6. Brand & content

### 6.1 Logo
**Decision: redesigned SVG mark — Scrub-Daddy-genre but distinct.**

- Background: **navy circle** (40×40 default).
- Features: **teal crescent smile** + **teal filled-oval eyes**.
- Single SVG with `currentColor` on features so Tailwind classes can recolor at any time.
- File: `public/logo-mark.svg`.
- Wordmark: ported from prototype CSS — navy "Clean" + teal italic "Victoria" + small uppercase "VICTORIA, AUSTRALIA" sub-label.
- Combined `<Logo />` component takes a `variant` prop (mark-only / wordmark-only / lockup).

**Trademark note:** The mark is *inspired by* the Scrub Daddy visual genre (smiley character mark on a circular base) but intentionally differentiated on:
- Background shape (circle is generic to the genre, not Scrub Daddy's sponge silhouette).
- Smile (closed crescent vs. Scrub Daddy's open mouth, which is the most trademarked element).
- Eye treatment (filled ovals vs. Scrub Daddy's hollow oval cutouts).
- Color palette (navy/teal vs. Scrub Daddy yellow).

### 6.2 Visual design system (ported from prototype)
**Tokens (mapped to Tailwind theme):**
- `--navy: #0d1b2e`
- `--navy2: #162540`
- `--teal: #4e92da` _(primary accent — note: the chat called this "teal" but the value is a desaturated blue)_
- `--teal-lt: #e4f0fb`
- `--gold: oklch(74% 0.14 75)` (used for announce-bar highlights)
- `--white: #fafcfd`
- `--offwhite: #f0f5f7`
- `--text: #1a2635`
- `--muted: #5e7080`
- `--border: #dce8ee`
- `--radius: 14px`
- `--shadow: 0 4px 28px rgba(13,27,46,0.10)`
- `--shadow-lg: 0 12px 48px rgba(13,27,46,0.16)`
- `--font-body: Plus Jakarta Sans`
- `--font-head: Lora`

**Components ported:** announce bar, sticky nav (with backdrop blur), buttons (primary, secondary, phone, white, ghost-dark), trust bar, CTA band, footer (4-col grid → 2-col → 1-col responsive), modal (booking funnel), sticky mobile CTA, mobile nav drawer, photo placeholder (used during dev for slots without final imagery).

### 6.3 Phone number
- Placeholder: `(03) 9000 0000`.
- Wired to `NEXT_PUBLIC_PHONE` env var.
- `// TODO: real phone` comment at the source-of-truth declaration.
- Used by: nav phone button, mobile sticky CTA, footer, all `tel:` links, JSON-LD `LocalBusiness.telephone`.

### 6.4 Address & ABN
- Both placeholder values, env-var driven:
  - `NEXT_PUBLIC_ADDRESS_STREET` (default: `123 Placeholder St`)
  - `NEXT_PUBLIC_ADDRESS_SUBURB`, `_POSTCODE`, `_REGION`
  - `NEXT_PUBLIC_ABN` (default: `00 000 000 000`)
- All carry `// TODO` comments.
- Footer **shows** placeholders verbatim until env vars are filled.
- JSON-LD `LocalBusiness.address` block is **conditionally emitted** — if any of the env vars match the default placeholder strings, the address block is skipped from the schema. This prevents a Google penalty if the site accidentally launches before real values are filled in.
- JSON-LD `serviceArea: "Greater Melbourne"` is always emitted (recommended pattern for service-area businesses without a customer-facing storefront).

### 6.5 Reviews & ratings
- **Visible UI badge** ("4.9★ from 620+ reviews"): kept as hardcoded prototype text, with a prominent `// WARNING: Replace before launch — fake review counts violate ACL §29 and Google's structured-data policy.` comment at the source.
- **JSON-LD `AggregateRating` schema**: env-gated. Only emits when both `NEXT_PUBLIC_REVIEW_COUNT` and `NEXT_PUBLIC_REVIEW_AVERAGE` are set to non-placeholder values.
- **Google Places API integration**: scaffolded now. A `getReviewStats()` adapter checks for `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` env vars; if present, fetches live data with ISR caching; otherwise falls back to the hardcoded env values.
- Pulling live reviews requires the client to have an active Google Business Profile with reviews — adapter is ready when they are.

### 6.6 About page
**Decision: no team/founder photos.**

- Page content focuses on: company story, values, timeline, accreditations.
- No people-faces section (avoids fake-faces-fake-names uncanny valley and ACL §29 risk).
- Trivially extensible later when real team photos exist.

### 6.7 Other reused prototype assets
- 3-step booking funnel (kept as designed — primary conversion mechanism).
- Modal booking flow (kept).
- Before/after comparison sliders (3 on homepage, 2 on carpet service page) — keep functionality.
- Sticky mobile CTA bar (Book Now / Call buttons).
- Mobile hamburger nav drawer.
- FAQ accordion (8-item on homepage).
- Tweaks panel from prototype: **dropped** (Claude Design dev-only artifact, not for production).

---

## 7. Images

**Decision: hand-picked stock photos, full coverage.**

- Sourced from Unsplash / Pexels under their commercial-use licenses.
- ~30 images curated by intent:
  - Homepage hero
  - 3 before/after pairs (homepage)
  - 2 before/after pairs (carpet service page)
  - One hero per service (11 images)
  - One hero per location region (~8 regions, used as fallback for combo pages within that region)
  - Misc: about-page atmosphere, footer accent, OG defaults
- Committed to `public/images/`.
- Served via `next/image` with appropriate `priority` flags on hero images.
- Filename convention: intent-based (e.g. `hero-carpet-cleaning.jpg`, `before-after-rug-1.jpg`).
- Avoid the most-overused stock shots; favor honest, action-oriented imagery.
- Combo pages reuse the parent service hero (no per-combo unique images).
- The prototype's `.photo-placeholder` component is retained as a fallback for slots where no real image is available yet.

---

## 8. SEO

### 8.1 Per-page metadata
- Next.js App Router `metadata` API on every page.
- Fields: `title`, `description`, `keywords`, `openGraph`, `twitter`, `alternates.canonical`, `robots`.
- `metadataBase` reads from `NEXT_PUBLIC_SITE_URL` (default `https://kleanvictoria.com.au`).

### 8.2 Sitemap & robots
- `app/sitemap.ts` generates `sitemap.xml` from the same data sources used to build pages — every standalone service, location, and combo URL is included.
- `app/robots.ts` allows all crawlers, references the sitemap.
- Preview deploys are `noindex` via env var detection.

### 8.3 JSON-LD schemas
- **Sitewide `LocalBusiness`** — name, url, telephone, areaServed, serviceArea (`Greater Melbourne`), geo (Melbourne CBD coordinates), aggregateRating (env-gated). Address conditionally emitted (see §6.4).
- **Service pages**: `Service` schema with `provider: { @type: LocalBusiness, ... }`.
- **Combo pages**: `Service` + `BreadcrumbList` (Home → Service → Location).
- **Pages with FAQ** (homepage, service pages): `FAQPage` schema.

### 8.4 Open Graph
- `next/og` dynamic OG image generation per service / location / combo.
- Branded card: navy background, teal accent, page title, KleanVictoria wordmark.
- One template, three variants (service / location / combo).

### 8.5 Canonical strategy
- Every page emits its own canonical URL.
- Combo pages canonical to themselves (combo intent is distinct from service-only intent).
- Hub pages (`/services`, `/locations`) canonical to themselves.
- No redirects between flat and prefixed forms (only flat exists).

---

## 9. Analytics & consent

- **GA4** — standard tag, fires after consent.
- **Microsoft Clarity** — heatmaps + session replay, free, fires after consent (Clarity claims GDPR compliance, but treating it as consent-gated is safer).
- **Vercel Analytics** — Web Vitals, fires without consent (cookieless).
- **Cookie consent banner** — privacy-first lib (`vanilla-cookieconsent` or equivalent). AU has lighter requirements than GDPR but EU/UK traffic from expats is non-zero, and the banner is cheap insurance.

---

## 10. Environment variables (consolidated)

| Var | Default / placeholder | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://kleanvictoria.com.au` | Canonical base, OG URLs, sitemap. |
| `NEXT_PUBLIC_PHONE` | `(03) 9000 0000` | Displayed phone, `tel:` links, schema. |
| `NEXT_PUBLIC_ADDRESS_STREET` | `123 Placeholder St` | Footer + schema (gated). |
| `NEXT_PUBLIC_ADDRESS_SUBURB` | `Melbourne` | Footer + schema (gated). |
| `NEXT_PUBLIC_ADDRESS_POSTCODE` | `3000` | Footer + schema (gated). |
| `NEXT_PUBLIC_ADDRESS_REGION` | `VIC` | Footer + schema (gated). |
| `NEXT_PUBLIC_ABN` | `00 000 000 000` | Footer + schema (gated). |
| `NEXT_PUBLIC_REVIEW_COUNT` | _(unset)_ | AggregateRating count (gates schema emission). |
| `NEXT_PUBLIC_REVIEW_AVERAGE` | _(unset)_ | AggregateRating value (gates schema emission). |
| `LEAD_NOTIFY_EMAIL` | `imtinankhurshid007@gmail.com` (dev) | Lead notification recipient. |
| `RESEND_API_KEY` | _(required)_ | Transactional email. |
| `RESEND_FROM` | `KleanVictoria <onboarding@resend.dev>` | Branded sender for lead notifications. Set to `KleanVictoria <hello@kleanvictoria.com.au>` after domain verification. |
| `SUPABASE_URL` | _(required)_ | Lead store. |
| `SUPABASE_ANON_KEY` | _(required)_ | Lead store (client). |
| `SUPABASE_SERVICE_ROLE_KEY` | _(required)_ | Lead store (server). |
| `GOOGLE_PLACES_API_KEY` | _(unset, optional)_ | Google reviews adapter — falls back to hardcoded values when unset. |
| `GOOGLE_PLACE_ID` | _(unset, optional)_ | Google reviews adapter. |
| `NEXT_PUBLIC_GA4_ID` | _(required for GA4)_ | Analytics. |
| `NEXT_PUBLIC_CLARITY_ID` | _(required for Clarity)_ | Analytics. |

---

## 11. Out of scope (v2 / future)

- Headless CMS migration (Contentful) — adapter layer is ready; data move only.
- Real Google Business Profile integration (live reviews) — adapter is scaffolded, awaits Place ID + API key.
- Google Maps embed on `/contact` page (placeholder for now).
- Real team photos and bios on About page.
- Real prices / price calculator (currently quote-only).
- Per-suburb local testimonials (currently combo pages reuse global testimonials).
- Commercial-cleaning B2B form variant (currently shares residential form).
- NDIS Cleaning, Strata, Airbnb Turnover, Pressure Washing as additional services (currently scoped to 11).
- Outer Melbourne / regional VIC expansion (currently scoped to postcodes 3000–3207).
- Lighthouse-CI gating, structured-data CI tests, link checker, alt-text validator.
- Admin dashboard for viewing leads (currently view directly in Supabase).

---

## 12. Risks & open items at v1

| Risk | Mitigation |
|---|---|
| Visible "4.9★ / 620+" badge ships before real review numbers exist | Loud `// WARNING` comment at source; JSON-LD AggregateRating env-gated so the structured-data violation is impossible without explicit env var setup. |
| Placeholder address/ABN visible in footer at launch | JSON-LD address block conditionally omitted; footer shows what env vars provide. Documented in env table. |
| Slug parser ambiguity on multi-word service + multi-word suburb combos | Longest-match split + unit tests pinning the parser against known edge cases. |
| 1,320 combo pages flagged as thin/duplicate by Google | Each combo has unique H1, location-specific blurb, region-specific image fallback, BreadcrumbList schema, and own canonical. |
| Resend emails marked as spam before DNS records are configured for `kleanvictoria.com.au` | Documented as a pre-launch step; sender uses `onboarding@resend.dev` until DNS is set. |
| Vercel build time on 1,456 pages | Acceptable on standard Vercel build (~1–2 minutes); document as "watch this" rather than precondition. |
| Supabase free-tier limits at scale | Not an immediate concern; a Melbourne-only cleaning site won't approach free-tier ceilings. Document upgrade trigger. |
| Google penalty if domain is launched while suburb list still includes outer Melbourne suburbs not actually serviced | Coverage explicitly scoped to postcodes 3000–3207 to align with realistic operational radius. |

---

## 13. Build order (proposed)

1. Next.js + TS + Tailwind v4 project scaffold; Tailwind theme mapping prototype tokens.
2. `next/font` setup for Plus Jakarta Sans + Lora.
3. Port `shared.css` design system into Tailwind utility classes + a few small CSS-Module overrides.
4. `<Logo />` component (mark + wordmark + lockups).
5. Shared layout: announce bar, nav (with mobile drawer), footer, sticky mobile CTA.
6. Booking modal + form (`react-hook-form` + `zod`).
7. Supabase + Resend integration; route handler for lead submission.
8. `lib/content/data/{services,locations}.ts` + adapter functions.
9. `app/[slug]/page.tsx` resolver with slug parser + unit tests.
10. Service page template, location page template, combo page template.
11. Static pages: home, about, contact, `/services` hub, `/locations` hub.
12. JSON-LD schemas (LocalBusiness, Service, FAQPage, BreadcrumbList, AggregateRating).
13. `app/sitemap.ts`, `app/robots.ts`, `metadataBase`, per-page metadata.
14. `next/og` dynamic OG images.
15. GA4, Clarity, Vercel Analytics, cookie consent.
16. Curate stock photos into `public/images/`.
17. Google Places review adapter scaffold with fallback.
18. End-to-end test: form submission → Supabase row → Resend email arrival.
19. Deploy to Vercel with preview → prod env vars configured.
