# Pre-launch checklist

**Owner:** site owner / launch engineer
**Source of truth:** this file (linked from `issues/0017-pre-launch-checklist.md`)
**Run before:** flipping production DNS for `kleanvictoria.com.au`

---

## 1 · Production env vars (Vercel → Project → Settings → Environment Variables)

Tier these to `Production` only; preview deploys should keep their own values
(e.g. a sandbox Supabase project) so test data does not pollute production.

### Required

- [ ] `NEXT_PUBLIC_SITE_URL` = `https://kleanvictoria.com.au`
- [ ] `NEXT_PUBLIC_PHONE` (real phone number)
- [ ] `NEXT_PUBLIC_ADDRESS_STREET` (real street address — not "123 Placeholder St")
- [ ] `NEXT_PUBLIC_ADDRESS_SUBURB` (real suburb — not "Melbourne")
- [ ] `NEXT_PUBLIC_ADDRESS_POSTCODE` (real postcode — not "3000")
- [ ] `NEXT_PUBLIC_ADDRESS_REGION` = `VIC` (the gate rejects bare `VIC`; pick a real region label or leave unset)
- [ ] `NEXT_PUBLIC_ABN` (real ABN — not "00 000 000 000")
- [ ] `LEAD_NOTIFY_EMAIL` (the client's business inbox)
- [ ] `RESEND_API_KEY` (production key — different from any dev key)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only — must NOT be `NEXT_PUBLIC_*`)
- [ ] `NEXT_PUBLIC_GA4_ID`
- [ ] `NEXT_PUBLIC_CLARITY_ID`

### Optional

- [ ] `NEXT_PUBLIC_REVIEW_COUNT` and `NEXT_PUBLIC_REVIEW_AVERAGE` — only set to **real** review counts. Leaving these unset suppresses both the visible badge and the AggregateRating schema.
- [ ] `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` — when set, the review stats adapter switches to live Google Places data with 1-hour ISR.
- [ ] `RESEND_FROM` — branded sender once Resend domain verification is complete (see §3).

> **Reminder:** after editing env vars in Vercel, redeploy the production
> branch. Env-var changes do NOT take effect on existing builds.

---

## 2 · Visible-UI launch review

JSON-LD is gated by the address-gate and review-stats adapter, but the visible
UI is not. Walk through the site once with the production env vars set:

- [ ] Footer address row matches the real business address.
- [ ] Footer ABN matches the real ABN.
- [ ] Footer phone matches the real business line.
- [ ] Homepage hero review badge: either real numbers, or env vars unset so the badge does not render.
- [ ] No `// WARNING: replace before launch` strings remaining in source for review counts.
- [ ] Trading hours on `/contact` match real operating hours.
- [ ] Cookie consent banner copy reviewed by client / legal counsel (AU + EU compliant default).

---

## 3 · DNS & deliverability (Resend)

Until DNS is configured, emails ship from `onboarding@resend.dev` and land in
spam. Production must use a branded sender.

- [ ] Resend domain added for `kleanvictoria.com.au`.
- [ ] DNS records configured at the domain registrar:
  - [ ] DKIM CNAME(s) per Resend setup
  - [ ] SPF TXT including `include:_spf.resend.com`
  - [ ] DMARC TXT (start with `p=none`, tighten to `p=quarantine` after monitoring)
- [ ] Resend domain verification status: **Verified**.
- [ ] `RESEND_FROM` env var updated to the branded address (e.g. `KleanVictoria <hello@kleanvictoria.com.au>`).
- [ ] Send a real test lead and confirm the email lands in inbox (not spam).

---

## 4 · Search & local

- [ ] Google Search Console property added for `https://kleanvictoria.com.au`.
- [ ] Sitemap submitted: `https://kleanvictoria.com.au/sitemap.xml`.
- [ ] Robots reachable and correct: `https://kleanvictoria.com.au/robots.txt`.
- [ ] Google Business Profile claimed and verified (separate from the API integration).
- [ ] Bing Webmaster Tools (optional, low-effort): property added, sitemap submitted.

---

## 5 · Database (Supabase)

- [ ] Migration `0001_create_leads.sql` applied to the production project.
- [ ] Row-Level Security enabled on `public.leads`.
- [ ] Confirmed: `anon` role cannot SELECT or INSERT.
- [ ] Confirmed: `service_role` can INSERT (the route handler uses the service-role key).
- [ ] Indexes verified:
  - [ ] `idx_leads_ip_recent` on `(submitted_ip, created_at desc)` — rate-limit query
  - [ ] `idx_leads_created_desc` on `(created_at desc)` — owner inbox view

---

## 6 · Smoke tests (against the production deploy)

- [ ] **End-to-end submission:** open `/contact`, submit the inline form with real-looking data, confirm:
  - [ ] A row appears in `public.leads` in Supabase.
  - [ ] An email arrives at `LEAD_NOTIFY_EMAIL`.
- [ ] **Honeypot:** submit a request with the `honeypot` field populated. Expected:
  - [ ] Server returns 200 OK.
  - [ ] No row inserted in `public.leads`.
  - [ ] No email sent.
- [ ] **Rate limit:** submit two valid leads from the same IP within 60 seconds. Expected:
  - [ ] First: 200 OK, row inserted, email sent.
  - [ ] Second: 429 with `error.kind === "rate-limited"`.
- [ ] **JSON-LD:** view-source on `/`, on a service page, and on a combo page. Validate each schema with Google's Rich Results Test (`https://search.google.com/test/rich-results`).
- [ ] **OG images:** paste a service URL and a combo URL into a WhatsApp / iMessage / Telegram preview and confirm the dynamic OG card renders.
- [ ] **Mobile:** open `/`, `/services`, and a combo on a real iPhone and Android device — confirm the sticky bottom CTA appears, the booking modal opens, and the form submits.

---

## 7 · Post-launch monitoring (week 1)

- [ ] Vercel Analytics — check Core Web Vitals trend daily for the first 7 days.
- [ ] Microsoft Clarity — review session replays of the booking funnel; investigate any heatmap dead-zones.
- [ ] GA4 — confirm goal/event firing for `lead_submitted` (if instrumented).
- [ ] Search Console — watch for "Coverage" or "Thin content" warnings on combo URLs.
- [ ] Resend — watch deliverability metrics; spike in bounces means DNS regression.
