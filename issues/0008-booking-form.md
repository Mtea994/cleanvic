# 0008 — Booking modal + form (RHF + Zod)

**Status:** done
**Type:** ui + core
**Depends on:** 0002
**Blocks:** 0007, 0009

## Problem

The booking funnel is the conversion mechanism for the entire site. It must be friction-free, mobile-first, accessible, and produce the exact payload that the lead intake pipeline (0009) expects. Client and server validation must share a single Zod schema so they cannot drift.

## Acceptance criteria

- [ ] Single Zod schema exported from `lib/leads/schema.ts` defining the lead payload: service (enum of the 11 service slugs), name (1–80 chars), phone (AU phone validation), suburb (matches a known location slug or freetext fallback), preferredDate (ISO date, today or later), honeypot (must be empty string).
- [ ] `<BookingForm />` React component built with `react-hook-form` and `@hookform/resolvers/zod`.
- [ ] Form has 3 visual steps:
  - Step 1: pick service (visual chips of all 11 services).
  - Step 2: name, phone, suburb, preferred date.
  - Step 3: confirmation success state.
- [ ] Form is rendered inside the modal component (from 0002) when triggered from any CTA.
- [ ] Form is also embeddable directly inline on `/contact` (no modal wrapper).
- [ ] Honeypot field is rendered visually hidden (`aria-hidden`, `tabindex="-1"`, off-screen positioning).
- [ ] Submission posts to the route handler from 0009.
- [ ] Loading state during submission (spinner on submit button, button disabled).
- [ ] Success state shows confirmation copy + secondary CTA (e.g. call us now).
- [ ] Error state shows a clear, retryable error message with form data preserved.
- [ ] All form controls have associated labels and `aria-describedby` for error text.
- [ ] Modal traps focus and is keyboard-dismissable.
- [ ] Tap targets ≥44×44px on mobile.

## Implementation notes

- Service dropdown / chip group on step 1 should pre-select the relevant service when the form is triggered from a service or combo page.
- Suburb input on step 2 should autocomplete from the locations list — but accept freetext (with a server-side warning if not in the supported area).
- Phone validation should accept AU formats: `04XX XXX XXX`, `+61 4XX XXX XXX`, `(03) XXXX XXXX`.
- Date picker: native `<input type="date">` with `min={today}`.
- Step transitions should preserve scroll position and not unmount step 1 inputs (keep RHF state intact across steps).
- The success state lives **inside** the modal; closing the modal returns the user to the page.

## References

- PRD §"Conversion", §"Major modules" (Lead intake pipeline)
- Research §5 (Booking & lead flow)
