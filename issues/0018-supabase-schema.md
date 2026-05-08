# 0018 — Supabase schema migration (leads table + RLS)

**Status:** done
**Type:** infra + backend
**Depends on:** 0001
**Blocks:** 0009

## Problem

The lead intake pipeline (0009) writes to Supabase. The schema, indexes, and Row-Level Security policies must be defined as a versioned migration — not configured ad-hoc through the Supabase dashboard — so the schema is reproducible across environments and reviewable in PRs.

## Acceptance criteria

- [ ] Supabase project created (development and production).
- [ ] Versioned migration file (e.g. `supabase/migrations/0001_create_leads.sql`) creating the `leads` table.
- [ ] Columns: `id` (uuid pk), `service` (text), `name` (text), `phone` (text), `suburb` (text), `preferred_date` (date), `submitted_ip` (text), `submitted_user_agent` (text), `created_at` (timestamptz default now()).
- [ ] Index on `(submitted_ip, created_at desc)` to support the rate-limit query.
- [ ] Row-Level Security enabled on `leads`.
- [ ] Policy: `service_role` can insert; no public read or insert.
- [ ] Migration applied to both dev and production Supabase projects.
- [ ] Supabase client setup committed: server-side client uses `SUPABASE_SERVICE_ROLE_KEY`; client-side does not need to touch the leads table at all.

## Implementation notes

- Use the Supabase CLI (`supabase migration new`) to author migrations rather than the dashboard SQL editor.
- The honeypot field is **not** persisted (validation rejects pre-insert).
- `submitted_user_agent` is captured for spam pattern analysis later; not displayed to anyone.
- Future schemas (e.g. a `contacts` table for general enquiries, a `bookings` table once the funnel becomes a real booking system) get separate migration files.

## References

- PRD §"Lead capture & operations"
- Research §5 (Booking & lead flow), §10 (Environment variables)
