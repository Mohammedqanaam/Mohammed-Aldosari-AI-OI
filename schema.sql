-- Run in Supabase SQL Editor. Safe for fresh setup and existing table migration.
create extension if not exists pgcrypto;

create table if not exists public.customer_leads (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  phone text not null,
  email text not null,
  data_consent boolean not null default false,
  data_consent_at timestamptz,
  data_consent_version text,
  source text not null default 'cv-builder',
  status text not null default 'started' check (status in ('started','abandoned','paid','closed')),
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

-- Remove obsolete marketing fields from earlier versions.
alter table public.customer_leads drop column if exists marketing_consent;
alter table public.customer_leads drop column if exists marketing_channels;
alter table public.customer_leads drop column if exists marketing_consent_at;
alter table public.customer_leads drop column if exists marketing_revoked_at;

-- Enforce both contact methods for new and updated records.
alter table public.customer_leads alter column phone set not null;
alter table public.customer_leads alter column email set not null;
alter table public.customer_leads drop constraint if exists customer_leads_contact_check;

create index if not exists customer_leads_created_at_idx on public.customer_leads (created_at desc);
alter table public.customer_leads enable row level security;
-- No anon/authenticated policies: only the server-side service role can access this table.
