-- The BackPorch: up to three pinned posts instead of one. Applied to project
-- suqtfbculwuetfdhdgdh as migration `backporch_three_pins`.
--
-- The homepage band leads with the pinned posts (it replaced the homepage
-- spotlight), so two or three things can be featured at once. The most recently
-- pinned post leads; pinning a fourth unpins the one pinned longest ago.
-- `pinned_at` is set by the trigger only, so the order can't be forged from the client.

alter table public.porch_posts add column pinned_at timestamptz;
update public.porch_posts set pinned_at = coalesce(published_at, now()) where pinned;

drop index public.porch_posts_one_pin;
create index porch_posts_pins on public.porch_posts (pinned_at desc) where pinned;

create or replace function public.porch_posts_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  -- Drafts and archived posts can't hold a pin.
  if new.status <> 'published' then
    new.pinned := false;
  end if;
  if not new.pinned then
    new.pinned_at := null;
  elsif tg_op = 'INSERT' or not old.pinned then
    new.pinned_at := now();
    -- Keep at most three: this one plus the two most recent other pins.
    update public.porch_posts set pinned = false
    where pinned and id <> new.id
      and id not in (
        select p.id from public.porch_posts p
        where p.pinned and p.id <> new.id
        order by p.pinned_at desc nulls last
        limit 2
      );
  else
    new.pinned_at := old.pinned_at;
  end if;
  return new;
end;
$$;
