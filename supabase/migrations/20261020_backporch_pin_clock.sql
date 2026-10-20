-- The BackPorch: stamp pins with clock_timestamp() rather than now(). now() is
-- fixed for a whole transaction, so several pins made in one transaction tied and
-- the "unpin the oldest" rule could drop the wrong post. Applied to project
-- suqtfbculwuetfdhdgdh as migration `backporch_pin_clock`.

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
    -- clock_timestamp, not now(): several pins in one transaction must still order.
    new.pinned_at := clock_timestamp();
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
