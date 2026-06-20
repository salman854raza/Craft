-- Replaces the old combined "leads" table with a proper auth-aware schema:
-- profiles (extends auth.users), messages (contact form / project
-- enquiries), and newsletter_subscribers (Journal signups).

drop table if exists public.leads;

-- ============================================================
-- PROFILES — 1:1 extension of auth.users
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
-- username/full_name come from supabase.auth.signUp's options.data payload.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- handle_new_user should only ever fire via the trigger above, never be
-- callable directly as a public RPC.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Lets the login form accept a username OR email without exposing the
-- profiles table or auth.users to public reads.
create or replace function public.get_email_by_username(lookup_username text)
returns text
language sql
security definer set search_path = public, auth
stable
as $$
  select u.email::text
  from auth.users u
  join public.profiles p on p.id = u.id
  where p.username = lookup_username
  limit 1;
$$;

revoke all on function public.get_email_by_username(text) from public;
grant execute on function public.get_email_by_username(text) to anon, authenticated;

-- Lets the signup form check username availability before submitting,
-- so failures show a clean "username taken" message instead of a generic
-- signup error.
create or replace function public.is_username_available(check_username text)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select not exists (
    select 1 from public.profiles where username = check_username
  );
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;

-- ============================================================
-- MESSAGES — Contact page / "Start a project" submissions
-- ============================================================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  created_at timestamptz not null default now()
);

create index messages_user_id_idx on public.messages (user_id);
create index messages_created_at_idx on public.messages (created_at desc);

alter table public.messages enable row level security;

-- Anyone — including anonymous visitors — can submit an enquiry.
create policy "messages_insert_anyone"
  on public.messages for insert
  to anon, authenticated
  with check (true);

-- Logged-in users can see only their own past enquiries.
create policy "messages_select_own"
  on public.messages for select
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- NEWSLETTER_SUBSCRIBERS — Journal page signups
-- ============================================================
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active' check (status in ('active','unsubscribed')),
  subscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_insert_anyone"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);
