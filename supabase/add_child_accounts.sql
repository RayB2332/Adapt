-- Run this in your Supabase SQL Editor
-- Adds child accounts table linked to parent accounts

create table if not exists public.child_accounts (
  id           uuid default gen_random_uuid() primary key,
  parent_id    uuid references auth.users(id) on delete cascade not null,
  child_id     text not null,        -- matches the child's id in adapt_data
  username     text not null unique, -- child's login username
  password_hash text not null,       -- simple hashed password
  child_name   text not null,
  created_at   timestamptz default now()
);

alter table public.child_accounts enable row level security;

-- Parents can manage their own children's accounts
create policy "parent_manage_children" on public.child_accounts
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

-- Allow looking up child by username (for child login)
create policy "child_login_lookup" on public.child_accounts
  for select using (true);
