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

-- Replace the old one-contact constraint. Existing legacy rows remain readable,
-- while all new or updated rows must contain both contact methods.
alter table public.customer_leads drop constraint if exists customer_leads_contact_check;
alter table public.customer_leads drop constraint if exists customer_leads_both_contacts_check;
alter table public.customer_leads add constraint customer_leads_both_contacts_check
  check (phone is not null and email is not null) not valid;

create index if not exists customer_leads_created_at_idx on public.customer_leads (created_at desc);
alter table public.customer_leads enable row level security;
-- No anon/authenticated policies: only the server-side service role can access this table.
\n-- Human-operated support inbox\ncreate table if not exists public.support_conversations (id uuid primary key default gen_random_uuid(), customer_name text not null, phone text not null, email text not null, access_token_hash text not null, status text not null default 'open' check (status in ('open','closed')), created_at timestamptz not null default now(), last_message_at timestamptz not null default now());\ncreate table if not exists public.support_messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.support_conversations(id) on delete cascade, sender text not null check (sender in ('customer','admin')), body text not null check (length(body) between 1 and 3000), created_at timestamptz not null default now());\ncreate index if not exists support_conversations_last_message_idx on public.support_conversations(last_message_at desc);\ncreate index if not exists support_messages_conversation_idx on public.support_messages(conversation_id,created_at);\nalter table public.support_conversations enable row level security;\nalter table public.support_messages enable row level security;\n