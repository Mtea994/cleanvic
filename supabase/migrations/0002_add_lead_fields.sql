-- 0002_add_lead_fields.sql
-- Add email, preferred_time, and notes to the leads table to match the new booking form.

alter table public.leads
  add column email           text,
  add column preferred_time  text,
  add column notes           text;
