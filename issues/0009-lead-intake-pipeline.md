# 0009 — Lead intake pipeline (Supabase + Resend) + tests

**Status:** needs-triage
**Type:** core + backend
**Depends on:** 0008, 0018
**Blocks:** —

## Problem

Every quote request must reliably land in two places: a Supabase row that the business owns, and a notification email to a configurable inbox. The pipeline must reject spam (honeypot + IP rate-limit), validate input server-side, and surface typed errors so failures are actionable.

## Acceptance criteria

- [ ] Route handler (`app/api/leads/route.ts` or equivalent) accepts POST with the lead payload.
- [ ] Server-side Zod validation reuses the schema from 0008.
- [ ] Honeypot check: any non-empty honeypot value rejects the request silently with a 200 OK (do not signal spam detection to the bot).
- [ ] IP rate-limit: query Supabase for any leads from the same `submitted_ip` in the last 60 seconds; reject with 429 if found.
- [ ] On successful validation: insert into Supabase `leads` table, then send a Resend email to `LEAD_NOTIFY_EMAIL`.
- [ ] If the Supabase insert fails, return 500 with a typed error and **do not send the email**.
- [ ] If the Resend email fails, log the failure but **return success** (the lead is already persisted; email is best-effort secondary).
- [ ] Single orchestration function `submitLead(input, context)` exported from `lib/leads/submitLead.ts` for unit testing.
- [ ] Tests cover: valid submission persists row + sends email; honeypot rejects without persisting; rate-limited submission rejects with the right error type; Zod-invalid input rejects pre-side-effects; Supabase insert failure bubbles a typed error; Resend failure does not bubble (logged + swallowed).
- [ ] Supabase and Resend clients are mocked at the client level — no live calls in tests.

## Implementation notes

- The lead row schema lives in 0018; this issue depends on the table existing.
- Resend `from:` address: until DNS for `kleanvictoria.com.au` is configured, emails come from `onboarding@resend.dev` and may land in spam. Document this in the pre-launch checklist (0017).
- Email body should include: customer name, phone, suburb, service, preferred date, submission timestamp. Include a `mailto:` and `tel:` reply link for one-tap response on phone.
- Honeypot rejection returns 200 OK so bots can't differentiate a successful spam submission from a rejected one.
- Rate-limit query is a Supabase select, not in-memory. Document the index that supports it (in 0018: index on `submitted_ip, created_at`).
- Errors should be discriminated unions (`{ kind: 'validation' | 'rate-limited' | 'supabase-error' | 'unknown', detail }`).

## References

- PRD §"Lead capture & operations", §"Major modules" (Lead intake pipeline)
- Research §5 (Booking & lead flow)
