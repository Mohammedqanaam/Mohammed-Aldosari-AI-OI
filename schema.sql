-- Run once in the Supabase SQL editor for this project.
create extension if not exists pgcrypto;

create table if not exists public.customer_leads (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  phone text,
  email text,
  data_consent boolean not null default false,
  data_consent_at timestamptz,
  data_consent_version text,
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  source text not null default 'cv-builder',
  status text not null default 'started' check (status in ('started','abandoned','paid','closed')),
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  constraint customer_leads_contact_check check (phone is not null or email is not null)
);

create index if not exists customer_leads_created_at_idx on public.customer_leads (created_at desc);
create index if not exists customer_leads_marketing_consent_idx on public.customer_leads (marketing_consent);
alter table public.customer_leads enable row level security;
-- No anon/authenticated policies: only the server-side service role can access this table.
