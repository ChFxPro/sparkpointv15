-- Backstage access roles
--
-- Adds a `profiles` table keyed to auth.users so the internal portal can tell
-- staff, board members, and partners apart.
--
-- SECURITY NOTE — why the default is 'pending' and not 'staff':
-- Any sign-in method that can create a user (email signup, and magic links in
-- particular, which create a user by default) would otherwise hand a stranger a
-- working account at whatever this default says. 'pending' grants nothing
-- anywhere in the app, so a self-registered account is inert until somebody
-- deliberately promotes it. Existing logins are backfilled to 'staff' below.
--
-- `role` is a text column with a CHECK rather than an enum, so adding a role
-- later is a one-line constraint change instead of an ALTER TYPE that cannot
-- run in the same transaction as its first use.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'pending'
    check (role in ('pending', 'staff', 'board', 'partner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in user may read only their own profile, and there is deliberately
-- no insert/update policy: role changes happen in the Supabase dashboard via
-- the service role, so a client can never promote itself.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Everyone who already has a login predates this table and is known-good staff.
insert into public.profiles (id, role)
select id, 'staff' from auth.users
on conflict (id) do nothing;

-- New signups land as 'pending' (the column default) and stay inert until promoted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Promote someone after you have confirmed who they are:
--   update public.profiles set role = 'board'   where id = '<auth user uuid>';
--   update public.profiles set role = 'partner' where id = '<auth user uuid>';
--
-- Review who currently holds what:
--   select p.role, u.email from public.profiles p join auth.users u on u.id = p.id
--   order by p.role, u.email;
