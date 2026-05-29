-- ADAPT Learning Platform — Supabase Schema
-- Run this in your Supabase SQL Editor

-- ── 1. Profiles table (extends auth.users) ────────────────────────────────
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  type       text not null check (type in ('parent','student')),
  name       text not null,
  created_at timestamptz default now()
);

-- ── 2. Main data table (stores all app state per user) ────────────────────
create table if not exists public.adapt_data (
  user_id    uuid references auth.users(id) on delete cascade primary key,
  payload    jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ── 3. Row Level Security ─────────────────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.adapt_data enable row level security;

-- Profiles: users can only see and edit their own
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- Data: users can only see and edit their own
create policy "data_select" on public.adapt_data
  for select using (auth.uid() = user_id);
create policy "data_insert" on public.adapt_data
  for insert with check (auth.uid() = user_id);
create policy "data_update" on public.adapt_data
  for update using (auth.uid() = user_id);

-- ── 4. Auto-create profile on signup ─────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, type, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'type', 'student'),
    coalesce(new.raw_user_meta_data->>'name', 'User')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
