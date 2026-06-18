-- Leads table: captures both project enquiries (Contact page) and
-- newsletter signups (Journal page) under a single table, distinguished
-- by `inquiry_type`. Inserts happen only from the Netlify Function using
-- the Supabase service role key, which bypasses RLS — so no public
-- insert/select policies are defined here on purpose.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  inquiry_type text not null default 'project' check (inquiry_type in ('project', 'newsletter')),
  name text,
  email text not null,
  phone text,
  project_type text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  source text not null default 'website'
);

comment on table public.leads is 'Contact form enquiries and newsletter signups from the Ashlar Studio website.';
comment on column public.leads.inquiry_type is 'project = contact form enquiry, newsletter = Journal page signup.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_inquiry_type_idx on public.leads (inquiry_type);
create index if not exists leads_email_idx on public.leads (email);

alter table public.leads enable row level security;
-- Intentionally no policies: only the service-role key (used server-side
-- in the Netlify Function) can read or write this table. Anon/authenticated
-- roles have zero access by default with RLS enabled and no policies.
