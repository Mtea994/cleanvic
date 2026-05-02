# PRD — KleanVictoria Marketing & Lead-Capture Site

_Status: needs-triage_
_Source: synthesised from `docs/research.md` and the Claude Design handoff in `design/handoff/`._

---

## Problem Statement

KleanVictoria is a Melbourne-based residential and commercial cleaning company that has no production web presence. Prospective customers — typically Melbourne residents searching Google for terms like "carpet cleaning Richmond" or "house cleaning Brunswick" — currently cannot find, evaluate, or book KleanVictoria. The owner has no inbound lead pipeline, no way to demonstrate trust signals, and no visibility into where prospects are dropping off.

Two compounding problems:

- **Discoverability.** Without dedicated, location-aware pages, KleanVictoria does not rank for the long-tail, high-intent local queries (`"<service> <Melbourne suburb>"`) that drive most cleaning-services revenue. The reference competitor (mastercleaner.com.au) saturates exactly this space with hundreds of service-by-suburb pages.
- **Conversion.** Even when a prospect arrives at a one-off page, the booking experience must be friction-free across boomer-and-millennial demographics, mobile-first, and quote-driven (not price-shock-driven). A static brochure site won't convert; the site must be a conversion funnel from the first viewport.

The owner additionally needs all of this to be operable: leads landing in a database they own, fakeable trust signals safely contained behind launch-time configuration, and content that a non-developer can later edit through a CMS without a redeploy.

---

## Solution

A 1,456-page Next.js marketing site for `kleanvictoria.com.au` that:

- Ranks in Melbourne local search by generating a unique, indexable page for every (service × location) combination across 11 services and 120 inner/middle Melbourne suburbs.
- Converts visitors via a single 3-step quote-request funnel that's identical on every page, mobile-first, and deeply accessible.
- Lands every quote request in a Supabase database the owner controls, plus a notification email.
- Ships safely: trust signals that could mislead users (review counts, business address, ABN) are env-gated so the JSON-LD emits only real values, even if the visible UI shows placeholders.
- Stays operable: all content lives in typed data files behind adapter functions, so swapping to a Contentful CMS later is a backend-only change with no impact on routes, pages, or SEO.
- Stays measurable: GA4 + Microsoft Clarity + Vercel Analytics together expose funnel drop-off, search intent, and Web Vitals without requiring a custom analytics stack.

---

## User Stories

### Discovery & SEO (prospective customer reaching the site from search)

1. As a Melbourne resident searching Google for "carpet cleaning richmond", I want to land on a page whose title, H1, and copy all explicitly mention both "carpet cleaning" and "Richmond", so that I trust this business actually services my suburb.
2. As a search-engine crawler, I want every page on the site to expose a single canonical URL, so that I do not penalise the site for duplicate content across the 1,320 combo pages.
3. As a search-engine crawler, I want a complete sitemap that enumerates every standalone service, standalone location, and combo URL with appropriate `lastmod` timestamps, so that I can index the entire site efficiently.
4. As a search-engine crawler, I want each page to expose JSON-LD structured data appropriate to its type (LocalBusiness sitewide, Service on service pages, Service + BreadcrumbList on combo pages, FAQPage where FAQ is present), so that the listing can earn rich-result treatment in search.
5. As a Google search user, I want to see a 4–5 star rating snippet under the listing when the business has accumulated real reviews, so that I am more likely to click through. (Schema must not emit until real review counts are configured.)
6. As a person sharing a service link in WhatsApp/SMS, I want a branded preview card to appear with the service name, location, and KleanVictoria logo, so that the recipient knows what they're being sent.
7. As a Google search user on mobile, I want pages that meet Core Web Vitals thresholds (LCP, CLS, INP), so that the listing is not down-ranked.
8. As a search-engine crawler on a preview deploy, I want the preview deploy to be marked `noindex`, so that test content does not pollute the production index.
9. As a Melbourne resident, I want to see breadcrumb navigation on combo pages (Home → Service → Location), so that I understand where I am in the site hierarchy.

### Conversion (visitor to lead)

10. As a homepage visitor, I want to see, above the fold, what the company does, where it serves, the trust signals, and a "get a free quote" affordance, so that I can decide whether to engage in under five seconds.
11. As a visitor, I want every page on the site to surface a "get a free quote" call-to-action prominently, so that I can convert from any entry point regardless of how I arrived.
12. As a visitor, I want a 3-step quote-request flow (pick service → enter contact details → see confirmation), so that the form does not feel overwhelming.
13. As a visitor on a service page, I want to see what's included in the service, the cleaning process, before/after evidence (where available), and an FAQ, so that I have enough information to request a quote without further research.
14. As a visitor on a combo page (`<service> in <suburb>`), I want unique copy specific to my suburb, so that I trust the business genuinely services my area rather than spam-generating identical pages.
15. As a visitor, I want to never see a fixed price quoted on the site, so that the eventual quote is not anchored against a number that may not apply to my specific job.
16. As a visitor, I want a sticky bottom CTA bar on mobile with "Book Now" and "Call" buttons, so that the conversion path is always one tap away.
17. As a visitor who started filling the booking form and got distracted, I want my partial inputs preserved if I switch tabs and return, so that I don't have to retype.
18. As a visitor, I want submission to feel instant (immediate success state, no full-page reload), so that I am not left wondering whether the form worked.
19. As a visitor whose submission failed (network error, validation error), I want a clear error message and my entered data preserved, so that I can correct and retry.

### Trust & credibility

20. As a visitor, I want to see review counts and star ratings prominently on the homepage and footer, so that I have social proof before I commit my contact details.
21. As a visitor, I want to see a "100% satisfaction guarantee" or equivalent risk-reversal signal, so that the perceived risk of booking is reduced.
22. As a visitor, I want to see police-checked / insured / eco-friendly trust badges in the trust bar, so that I feel safe inviting a stranger into my home.
23. As a visitor, I want before/after photo comparisons on service pages, so that I can see the work quality before booking.
24. As a visitor, I want the business's phone number, email, and Melbourne service area visible in the footer, so that I can verify the company is real and contactable.
25. As a visitor, I want the site to never display fake review counts or fake addresses in machine-readable structured data, so that my trust is not earned dishonestly. (Visible UI may show placeholders flagged for replacement; schema must not.)

### Accessibility & cross-demographic UX

26. As a boomer-aged user with reduced fine motor control, I want all interactive elements to have generous tap/click targets (≥44×44px) and visible focus states, so that I do not misclick.
27. As a screen-reader user, I want every interactive element labeled with appropriate aria attributes and every image to have descriptive alt text, so that I can navigate the site.
28. As a user who relies on keyboard navigation, I want every CTA and form control reachable in a sensible tab order with no keyboard traps in the modal, so that I can complete a quote request without a mouse.
29. As a user with low contrast sensitivity, I want all text to meet WCAG AA contrast against its background, so that I can read the site comfortably.
30. As a mobile user, I want the navigation to collapse into a hamburger drawer with a clear close affordance, so that the small screen is not crowded.
31. As a user on a slow connection, I want hero images and above-the-fold content to render before below-the-fold images, so that the site feels fast.

### Lead capture & operations (business owner & developer)

32. As the business owner, I want every quote submission to land in a Supabase database row, so that I have a permanent record I can later sync to a CRM.
33. As the business owner, I want every quote submission to also send an email notification to a configurable inbox, so that I see the lead immediately on my phone.
34. As the business owner, I want each lead to include the chosen service, customer name, phone, suburb, preferred date, and submission timestamp, so that I have everything needed to call back.
35. As the developer, I want the lead recipient email to be set via environment variable per environment, so that dev / preview / production can route to different inboxes.
36. As the developer, I want a honeypot field in the form, so that simple form-spam bots are silently rejected.
37. As the developer, I want IP-based rate limiting backed by Supabase (not in-memory), so that the limit holds across Vercel's stateless serverless instances.
38. As the developer, I want client-side and server-side validation to share a single Zod schema, so that the validation rules cannot drift.
39. As the developer, I want a clear server error returned (and surfaced) if Supabase insert or Resend email fails, so that I can diagnose production issues from the lead source.
40. As a tester, I want to submit a fake lead in dev and confirm both the Supabase row and the email arrival, so that I can verify the pipeline before launch.

### Content management & evolution

41. As the developer, I want all service and location content to live in typed TypeScript data files behind adapter functions, so that the IDE provides autocomplete and the compiler catches typos.
42. As a future content editor, I want a CMS-backed editing experience (Contentful) without a code change to add a new service or update a location's blurb, so that I can ship content without involving a developer. (Migration is post-v1; the adapter layer must be designed so that this swap touches only the data adapter implementation, not pages.)
43. As the business owner, I want to add a new Melbourne suburb to the coverage area by editing a single data file, so that growing the service area does not require new page templates.
44. As the business owner, I want the displayed phone number, address, ABN, and review counts to all be configurable via environment variables, so that I can replace placeholders at launch without a code change.
45. As the developer, I want the JSON-LD address block to be omitted automatically when the address env vars still match their placeholder defaults, so that an accidental launch with placeholders does not earn a Google penalty.
46. As the developer, I want the JSON-LD AggregateRating block to be omitted unless real review count and average env vars are set, so that fake review schema cannot ship.

### Observability & analytics

47. As the business owner, I want Google Analytics 4 wired in, so that I can see where leads come from (organic search, paid search, direct, referral).
48. As the business owner, I want Microsoft Clarity wired in, so that I can watch session replays of the booking funnel and spot UX issues that explain drop-off.
49. As the developer, I want Vercel Web Analytics wired in, so that I can monitor real-user Core Web Vitals without configuring an additional tag.
50. As a visitor in a privacy-sensitive jurisdiction, I want to consent (or decline) optional analytics cookies before any non-essential tag fires, so that my privacy is respected.

### Performance & reliability

51. As a visitor, I want the site to render in under 2.5 seconds (LCP) on a median mobile connection, so that I do not abandon the page.
52. As the developer, I want the production build to complete in under 5 minutes despite generating 1,456 pages, so that deploys remain fast.
53. As the developer, I want all images served via `next/image` with appropriate `priority` flags on heroes, so that image weight does not regress LCP.
54. As the developer, I want unknown URL slugs to return a true 404 (not render a blank page or guess), so that the slug resolver is the only source of routing decisions.
55. As the developer, I want reserved top-level paths (`about`, `contact`, `services`, `locations`, `book`, `api`, `_next`) to never be interpretable as a slug, so that the catch-all does not collide with explicit routes.

### Future expansion (post-v1)

56. As the business owner, when I have accumulated real Google reviews, I want to set my Google Place ID + API key in env vars, and have the site automatically surface live review counts in the AggregateRating schema, so that I can earn rich results without a code change.
57. As the business owner, when I have real prices to publish, I want the option to introduce a `priceFrom` field per service, so that the data shape can grow without a migration.
58. As the business owner, when I am ready to expand to outer Melbourne suburbs, I want to add postcodes 3208–3999 entries to the locations data, so that combo pages auto-generate without template changes.
59. As the business owner, when I am ready to expand to commercial-cleaning B2B intake, I want the service-cleaning page to support a custom-form variant, so that commercial leads can route to a different inbox or schema.

---

## Implementation Decisions

### Stack & framework

- Next.js 15 with App Router and TypeScript.
- Tailwind v4, with a `@theme` block in the global stylesheet that maps the prototype's CSS custom properties (navy / teal / muted / border / radius / shadow tokens, plus the Plus Jakarta Sans + Lora font pairing). Token names match the prototype's vocabulary so swapping accent colors at the client's request remains a single-file edit.
- `next/font` for both Plus Jakarta Sans (body) and Lora (display), eliminating Google Fonts CDN flash.
- Tailwind v4 was selected over porting the prototype's hand-rolled CSS or using CSS Modules because the client may want palette/design changes later — the user explicitly requested it for that reason.

### Routing & URL architecture

- Single catch-all dynamic segment (`app/[slug]/page.tsx`) is the **only** non-static route that resolves marketing pages. The slug resolver decides whether the slug is a known service, a known location, a known combo, a reserved path, or unknown.
- All marketing URLs are flat — no `/services/...` or `/locations/...` prefix. Standalone services live at `/<service-slug>`, standalone locations at `/<location-slug>`, combos at `/<service-slug>-<location-slug>`. This was the explicit user choice for SEO.
- Static App Router routes for `/`, `/about`, `/contact`, `/services` (services hub list), `/locations` (locations hub list).
- Reserved top-level paths (`about`, `contact`, `services`, `locations`, `book`, `api`, `_next`) are explicitly rejected by the resolver.
- All marketing pages are statically generated at build time via `generateStaticParams` reading from the content adapters.

### Major modules

The codebase is intentionally organised around six deep modules with stable interfaces and isolated, testable logic:

- **Slug resolver.** Single function whose interface is `(slug: string) => Resolution`, where `Resolution` is one of `{ kind: 'service', service }`, `{ kind: 'location', location }`, `{ kind: 'combo', service, location }`, `{ kind: 'reserved' }`, or `{ kind: 'unknown' }`. Implements longest-match split for combos: walk the slug, find the longest valid service prefix that leaves a known location suffix. Pure function. Encapsulates the entire URL→content mapping; pages depend on this and only this for routing.
- **Content adapters.** A small set of functions — `getService`, `getLocation`, `getCombo`, `getAllServices`, `getAllLocations`, `getAllCombos` — that page templates and the slug resolver both consume. The implementation in v1 reads from typed TS arrays. The interface is stable; swapping to Contentful later replaces the adapter implementation without touching pages, schemas, or the slug resolver. Combo content is templated from the base service + location data, with optional per-combo overrides.
- **Lead intake pipeline.** Single function (called from a route handler) that orchestrates: Zod schema validation → honeypot check → Supabase rate-limit query (any submission from this IP in the last 60 seconds) → Supabase row insert → Resend email send. Errors are typed, surfaced to the caller, and bubble to the form UI.
- **Review stats adapter.** Single function returning `{ count, average }`. Checks for `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID`; if both present, fetches Google Places API with ISR caching; else falls back to `NEXT_PUBLIC_REVIEW_COUNT` + `NEXT_PUBLIC_REVIEW_AVERAGE`. Both code paths exist from day one — only the env vars decide which is active.
- **JSON-LD builders.** Pure functions per schema type: LocalBusiness, Service, BreadcrumbList, FAQPage, AggregateRating. JSON-in, JSON-out. Each page template assembles the schemas it needs and emits them as `<script type="application/ld+json">` blocks. Address-gate logic inside the LocalBusiness builder: if the configured address values match the placeholder defaults, the address sub-block is omitted from the schema even though the footer continues to render the placeholder visibly.
- **Address-gate (sub-module of the JSON-LD builders).** Pure function that takes the address env values and returns a boolean indicating whether the address sub-block should be emitted. Defaults are excluded by an exact-match comparison against the documented placeholder strings.

### Data shapes

- **Service.** `slug`, `name`, `shortDescription`, `longDescription`, `whatsIncluded` (array of bullets), `process` (ordered steps), `faq` (Q&A array), `heroImage`, `iconName`, `priceFrom: null` (kept as a typed slot for future use; v1 emits "Get a free quote" everywhere).
- **Location.** `slug`, `name`, `postcode`, `region` (one of: Inner / Inner East / Inner West / Inner North / Inner South / Middle East / Middle West / etc.), `lat`, `lng`, `description` template field. Sourced from data.gov.au postcode dataset, scoped to postcodes 3000–3207.
- **Combo content** is computed from service + location at build time. Combo H1: `"<Service Name> in <Location Name>"`. Combo blurb: parameterized template with location-specific tokens (region, neighbouring suburbs covered). Optional `comboOverrides[serviceSlug][locationSlug]` data shape exists but is left empty in v1.
- **Lead.** Persisted to Supabase: `service`, `name`, `phone`, `suburb`, `preferred_date`, `submitted_ip`, `submitted_user_agent`, `created_at`. Honeypot field is validated server-side and never persisted.

### Brand & UI

- Logo redesigned as a custom SVG mark: navy circle background with teal crescent smile and teal filled-oval eyes. Inspired by the Scrub Daddy character-mark genre but intentionally differentiated on shape (circle, not sponge silhouette), smile (closed crescent vs open mouth), eyes (filled vs hollow), and palette (navy/teal vs yellow). Single SVG with `currentColor` on features for Tailwind recoloring. Paired with the prototype's existing wordmark (navy "Clean" + teal italic "Victoria"). A `<Logo />` component supports mark-only / wordmark-only / lockup variants.
- The 11 services from the prototype are kept verbatim. Flood Restoration is reframed as honest cleanup ("Water-damaged carpet & upholstery drying"), not emergency response — no IICRC certification claims, no 24/7 emergency framing.
- Commercial Cleaning shares the same booking form and same recipient inbox as residential in v1. No B2B routing.
- About page has no team/founder photos or bios in v1 — content focuses on story, values, timeline, accreditations.
- Pricing: quote-only across the site. Every CTA reads "Get a free quote." No prices shown anywhere.

### Configuration (env vars)

Every value that may need to change without a code deploy lives in env. The full list is documented in `docs/research.md` §10 and includes: site URL, phone, address parts, ABN, review count/average, lead recipient email, Resend API key, Supabase URL/keys, Google Places API key + Place ID (optional), GA4 ID, Clarity ID. Defaults are placeholder values that the JSON-LD builders treat as "not real" and refuse to emit.

### SEO & analytics

- Per-page metadata via Next.js App Router `metadata` API: title, description, keywords, openGraph, twitter, canonical.
- `metadataBase` reads from `NEXT_PUBLIC_SITE_URL`.
- Sitemap and robots generated from the same content adapters as the pages, ensuring no URL drift.
- Dynamic OG images via `next/og` — one templated card with three variants (service / location / combo).
- GA4, Microsoft Clarity, Vercel Analytics. GA4 + Clarity gated on cookie consent; Vercel Analytics is cookieless and fires unconditionally.
- Cookie consent banner — privacy-first library, AU-friendly default but EU-compliant when needed.

### Anti-abuse

- Honeypot field on the booking form, visually hidden, validated server-side.
- Supabase-backed IP rate limit (60 seconds per IP). In-memory rate limiting was explicitly ruled out because Vercel serverless functions are stateless; Upstash/Vercel KV was considered but Supabase is already in the stack.

### Hosting & deploy

- Vercel for hosting and serverless route handlers.
- Preview deploys are `noindex` via env-var detection at the metadata layer.
- Build pre-renders all 1,456 pages at deploy time. Pages are pure SSG — no ISR in v1 except the review stats adapter, which uses revalidation when sourcing live Google reviews.

---

## Testing Decisions

### Philosophy

A good test in this codebase exercises **observable external behavior** through a module's public interface, not its private implementation. Tests should:

- Treat the module as a black box: inputs go in, outputs (or assertions about side effects) come out.
- Survive refactors that don't change the external contract. Renaming an internal helper, restructuring control flow, or replacing a dependency injection should not require touching the test.
- Fail loudly when the contract changes. A failing test should point at exactly which contract was broken.
- Avoid coupling to file paths, internal class names, or framework internals. Use the module's documented entry points only.
- Run fast and in isolation. No tests against the live Supabase, live Resend, or live Google Places API — those go behind in-memory fakes or stubs.

### Modules with tests, in priority order

1. **Slug resolver** (highest priority). Pure function, complex parsing logic, ship-blocking if wrong (every URL on the site routes through it). Tests cover: every standalone service slug resolves to `kind: 'service'`; every standalone location slug resolves to `kind: 'location'`; every valid `<service>-<location>` combo resolves to `kind: 'combo'` with the correct service and location attached; ambiguous slugs (multi-word service + multi-word suburb where a different split would also be valid) resolve to the longest-match service prefix; reserved paths (`about`, `contact`, `api`, etc.) resolve to `kind: 'reserved'`; unknown slugs resolve to `kind: 'unknown'`; empty / malformed inputs resolve to `kind: 'unknown'` without throwing. Test data is the same TS arrays the production code reads — no fixture duplication.
2. **JSON-LD builders** (highest priority). Pure functions, easiest to test (JSON in, JSON out), and structured-data correctness directly affects search-result eligibility. Tests cover: each schema type emits the required Schema.org fields; LocalBusiness emits `address` only when env values are non-placeholder; AggregateRating emits only when both `NEXT_PUBLIC_REVIEW_COUNT` and `NEXT_PUBLIC_REVIEW_AVERAGE` are set to non-placeholder values; BreadcrumbList combo schema correctly chains Home → Service → Combo; FAQPage emits one entry per Q&A; ServiceArea on LocalBusiness uses the documented `"Greater Melbourne"` value.
3. **Lead intake pipeline** (high priority). The conversion mechanism — silent failures here cost leads. Tests cover: valid submissions persist a Supabase row and trigger a Resend send; honeypot-filled submissions are rejected without persisting; submissions over the rate limit (a prior submission from the same IP within the window) are rejected with a clear error; Zod-invalid inputs are rejected before any side effect; Supabase insert failures bubble a typed error; Resend failures bubble a typed error. Supabase and Resend are mocked at the client level — tests exercise the orchestration, not the third-party SDKs themselves.
4. **Address-gate** (small but ship-blocking). Tests cover: every documented placeholder string is detected as a placeholder; any non-placeholder string is detected as real; partial-placeholder cases (e.g. real street, placeholder postcode) gate to "do not emit" because the address must be fully real to be schema-eligible.
5. **Content adapters** (lower priority — mostly pass-throughs in v1, but the test stake increases when Contentful is wired in). Tests cover: `getService` / `getLocation` return the correct entity for known slugs; return `null` (not throw) for unknown slugs; `getAllServices` / `getAllLocations` / `getAllCombos` return non-empty arrays whose entries match the underlying data exactly; combo content correctly templates the H1 and blurb from service + location data; an optional combo override (when present) replaces the templated values.
6. **Review stats adapter** (lower priority). Tests cover: when env vars `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are unset, the adapter returns the values from `NEXT_PUBLIC_REVIEW_COUNT` and `NEXT_PUBLIC_REVIEW_AVERAGE`; when both API env vars are set, the adapter calls a stubbed Google Places fetch and returns its result; when the API call fails, the adapter falls back to env values rather than throwing; when env values are also unset, the adapter returns `null` for both fields. Network is stubbed; no live API calls.

### Prior art

This is a greenfield codebase with no existing test patterns. The first test file written (recommended: the slug resolver) sets the prior art for the rest. Prefer Vitest as the runner for compatibility with TS, ESM, and Next.js. Tests live in a `__tests__` directory adjacent to each module, or as `*.test.ts` files co-located with the module — the team should pick one convention and stick to it.

### Out of test scope (v1)

- End-to-end browser tests (Playwright) — out of scope for v1, may be added later for the booking funnel.
- Visual regression tests — out of scope.
- Lighthouse CI / Web Vitals gating in CI — out of scope (Vercel Analytics monitors at runtime).
- Tests against real Supabase / real Resend / real Google Places — never; integration is verified manually pre-launch.

---

## Out of Scope

The following are explicitly out of scope for this PRD and deferred to future iterations:

- **Headless CMS migration to Contentful.** The adapter layer is structured to make the swap cheap, but the migration itself is a separate piece of work that requires Contentful schema design, content seeding, and editor onboarding.
- **Live Google Reviews integration.** The review stats adapter scaffold ships in v1, but actually populating it requires a Google Cloud project, an API key, a Google Business Profile with Place ID, and accumulated reviews — none of which exist on day one.
- **Real prices and price calculator.** v1 is quote-only. A future PRD may introduce per-service `priceFrom` values, range pricing, or an interactive calculator (rooms × condition × frequency).
- **Real team photos and About-page bios.** v1 omits the team section entirely. Adding real faces and names is a separate content-and-photography deliverable.
- **Outer Melbourne / regional Victoria expansion.** v1 is scoped to postcodes 3000–3207 (~120 suburbs). Expanding to Greater Melbourne (~320 suburbs) or regional VIC is a data-only change but should be gated on real operational coverage, not speculative growth.
- **Additional services.** v1 ships the 11 services from the prototype. NDIS Cleaning, Strata, Airbnb / Short-Stay Turnover, Move-In Cleaning, Pressure Washing / Driveway Cleaning are not included.
- **Commercial-cleaning B2B form variant.** v1 routes commercial inquiries through the residential booking form to the same inbox.
- **Per-location testimonials and per-suburb local social proof.** v1 reuses global testimonials across all combo pages.
- **Admin dashboard for lead management.** v1 expects the owner to view leads directly in Supabase; a custom CRM/admin view is post-v1.
- **Google Maps embed on the contact page.** v1 ships a placeholder; a real embed depends on a real address being configured.
- **Lighthouse CI gating, structured-data CI tests, broken-link checker, alt-text validator.** v1 monitors via Vercel Analytics; CI gating is post-v1.
- **End-to-end browser tests (Playwright).** v1 ships unit tests on the six deep modules; the booking funnel is verified manually before launch.
- **Internationalisation.** Site is English / AU only.

---

## Further Notes

### Risk register (v1)

- The visible `4.9★ from 620+ reviews` UI badge ships with a placeholder value. A loud `// WARNING: Replace before launch — fake review counts violate ACL §29 and Google's structured-data policy.` comment is anchored at the source-of-truth declaration. The schema cannot leak fake numbers (env-gated), but the UI badge will visibly mislead until replaced. **Pre-launch checklist must include reviewing this badge.**
- Placeholder address and ABN render visibly in the footer until env vars are filled. The schema is gated, but the UI is not. **Pre-launch checklist must include reviewing the footer.**
- Resend deliverability will be poor until DNS records (DKIM/SPF) for `kleanvictoria.com.au` are configured. Until then, sender uses `onboarding@resend.dev` and emails may land in spam. **Pre-launch checklist must include Resend domain verification.**
- 1,320 combo pages risk being flagged as thin/duplicate by Google. Mitigations are in place (unique H1, location-specific blurb, region-specific image fallback, BreadcrumbList schema, own canonical), but we should monitor Search Console for thin-content warnings in the first month.
- The slug resolver's longest-match algorithm could mis-resolve a slug that legitimately overlaps multiple known service/location combinations. This is mitigated by unit tests against ambiguous edge cases, but the test catalog must be maintained as services and locations are added.

### Pre-launch operational checklist (for the PR shipping this work)

- Set production env vars in Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PHONE`, all `NEXT_PUBLIC_ADDRESS_*`, `NEXT_PUBLIC_ABN`, `NEXT_PUBLIC_REVIEW_COUNT`, `NEXT_PUBLIC_REVIEW_AVERAGE`, `LEAD_NOTIFY_EMAIL`, `RESEND_API_KEY`, `SUPABASE_*`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`.
- Configure DNS for Resend domain verification.
- Configure Google Search Console; submit sitemap.
- Configure Google Business Profile (separate to API integration).
- Verify cookie consent banner copy with client / legal.
- Replace visible review-count badge with real numbers, or hide the badge.
- Confirm Supabase row-level security policies on the `leads` table (server-role inserts only; no public reads).

### Reference materials

- `docs/research.md` — full grilling-session research document.
- `design/handoff/` — Claude Design handoff bundle (HTML/CSS/JSX prototypes, design tokens, chat transcripts).
- `https://mastercleaner.com.au/` — competitor / reference site for SEO architecture.
