-- The BackPorch: pins count only live posts, and editors need a confirmed email.
-- Applied to project suqtfbculwuetfdhdgdh on 2026-10-20 as migration
-- `backporch_live_pins_confirmed_editors` (by the PM session, with Jeff's OK). Replaces porch_posts_before_write
-- (last set by backporch_pin_clock) and is_porch_editor (from create_backporch).
--
-- 1. Pins. The three-pin cap counted every pinned row, including a post that had
--    expired (still pinned, no longer shown), so an expired pin could push a live
--    one off. Now: a scheduled post can't be pinned (it isn't up yet), pinning a
--    post first unpins any expired ones, and the cap keeps the two most recent
--    other live pins.
-- 2. Editors. Sign-ups are off, so this is defence in depth: being on the
--    porch_editors list counts only for an account whose email is confirmed.

create or replace function public.porch_posts_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  -- Drafts, archived posts, and posts not up yet can't hold a pin.
  if new.status <> 'published' or new.published_at is null or new.published_at > now() then
    new.pinned := false;
  end if;
  if not new.pinned then
    new.pinned_at := null;
  elsif tg_op = 'INSERT' or not old.pinned then
    -- clock_timestamp, not now(): several pins in one transaction must still order.
    new.pinned_at := clock_timestamp();
    -- Expired posts give up their pins.
    update public.porch_posts set pinned = false
    where pinned and id <> new.id and expires_at is not null and expires_at <= now();
    -- Keep at most three: this one plus the two most recent other live pins.
    update public.porch_posts set pinned = false
    where pinned and id <> new.id
      and id not in (
        select p.id from public.porch_posts p
        where p.pinned and p.id <> new.id
          and p.published_at <= now()
          and (p.expires_at is null or p.expires_at > now())
        order by p.pinned_at desc nulls last
        limit 2
      );
  else
    new.pinned_at := old.pinned_at;
  end if;
  return new;
end;
$$;

create or replace function public.is_porch_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.porch_editors e on e.email = lower(u.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.is_porch_editor() from public, anon;
grant execute on function public.is_porch_editor() to authenticated;
