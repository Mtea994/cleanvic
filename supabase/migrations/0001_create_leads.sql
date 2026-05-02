-- 0001_create_leads.sql
-- Create the `leads` table that the booking funnel writes to.
-- Indexes support the IP-based rate-limit query in lib/leads/submitLead.ts.
-- RLS is enabled with no public read/insert policies; only the service role
-- (used by the server-side route handler) can write.

create extension if not exists "pgcrypto";

create table public.leads (
  id                    uuid primary key default gen_random_uuid(),
  service               text         not null,
  name                  text         not null,
  phone                 text         not null,
  suburb                text         not null,
  preferred_date        date         not null,
  submitted_ip          text         not null,
  submitted_user_agent  text,
  created_at            timestamptz  not null default now()
);

-- Supports the rate-limit query: any leads from this IP since `<sinceIso>`.
create index leads_ip_created_at_idx
  on public.leads (submitted_ip, created_at desc);

-- Sortable inbox / dashboard view.
create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No SELECT, INSERT, UPDATE, DELETE policies for the anon role — service-role
-- key (used server-side only) bypasses RLS entirely.
-- Future: a minimal admin RLS policy may be added once an admin dashboard
-- ships in a separate migration.
