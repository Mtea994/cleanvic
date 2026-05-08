# 0017 — Pre-launch checklist & env-var setup

**Status:** done
**Type:** ops
**Depends on:** all
**Blocks:** —

## Problem

The site ships with placeholder values for review counts, address, ABN, and phone number. JSON-LD gating prevents schema emission of placeholders, but the visible UI does not gate. Several launch-time configuration steps (DNS for Resend, Google Search Console, Supabase RLS) must complete before the site is production-safe.

## Acceptance criteria (operational, not code)

### Env vars (set in Vercel Production)

- [ ] `NEXT_PUBLIC_SITE_URL` = `https://kleanvictoria.com.au`
- [ ] `NEXT_PUBLIC_PHONE` = real phone number
- [ ] `NEXT_PUBLIC_ADDRESS_STREET` = real street address
- [ ] `NEXT_PUBLIC_ADDRESS_SUBURB` = real suburb
- [ ] `NEXT_PUBLIC_ADDRESS_POSTCODE` = real postcode
- [ ] `NEXT_PUBLIC_ADDRESS_REGION` = `VIC`
- [ ] `NEXT_PUBLIC_ABN` = real ABN
- [ ] `NEXT_PUBLIC_REVIEW_COUNT` = real review count (or unset to suppress AggregateRating)
- [ ] `NEXT_PUBLIC_REVIEW_AVERAGE` = real review average (or unset)
- [ ] `LEAD_NOTIFY_EMAIL` = client business inbox
- [ ] `RESEND_API_KEY`
- [ ] `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_GA4_ID`
- [ ] `NEXT_PUBLIC_CLARITY_ID`
- [ ] (Optional) `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`

### DNS & deliverability

- [ ] DNS records (DKIM/SPF/DMARC) configured for `kleanvictoria.com.au` so Resend can send from a branded address (`hello@kleanvictoria.com.au` or similar).
- [ ] Resend domain verification confirmed.
- [ ] Sender `from:` address updated from `onboarding@resend.dev` to the branded address.

### Search & local

- [ ] Google Search Console property added; sitemap submitted.
- [ ] Google Business Profile created and verified.
- [ ] Bing Webmaster Tools (optional, low effort).

### Database

- [ ] Supabase Row-Level Security policies enabled on `leads` table.
- [ ] Confirmed: anon role cannot read/insert; service role can insert.
- [ ] Index on `(submitted_ip, created_at)` exists (rate-limit query).

### Visible-UI review

- [ ] Replace the visible "4.9★ from 620+ reviews" badge with real numbers, or hide it.
- [ ] Footer address and ABN: confirm visible values match real values.
- [ ] Phone number visible on the site matches the real business line.

### Smoke tests

- [ ] Submit a real test lead end-to-end: form → Supabase row appears → Resend email arrives in `LEAD_NOTIFY_EMAIL`.
- [ ] Confirm honeypot rejection: submit a form with the honeypot filled and confirm no row + no email.
- [ ] Confirm rate-limit: submit twice within 60s and confirm second request is 429.
- [ ] View JSON-LD on a sample page (homepage + a combo); validate via Google's Rich Results Test.

## References

- PRD §"Further Notes" (Pre-launch operational checklist)
- Research §10 (Environment variables)
