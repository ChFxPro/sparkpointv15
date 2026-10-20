-- The BackPorch (PORCH-001): posts, who may write them, and their images.
-- Spec: docs/backporch/SPEC.md. Applied to project suqtfbculwuetfdhdgdh as
-- migration `create_backporch`.
--
-- Security model:
--   * Anyone (the public anon key) reads published posts whose publish time
--     has passed. Expired posts stay readable so their pages keep working;
--     the site drops them from lists itself.
--   * Writing is limited to emails in porch_editors, not to every signed-in
--     user: this Supabase project's Auth is shared with other tools, and
--     "signed in" must not mean "can publish on the homepage".
--   * porch_editors has RLS on and no policies, so only the Dashboard (or the
--     service role) can add or remove editors.

create table public.porch_editors (
  email text primary key check (email = lower(email) and email like '%@%'),
  name text not null,
  added_at timestamptz not null default now()
);
alter table public.porch_editors enable row level security;

create or replace function public.is_porch_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.porch_editors e
    where e.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_porch_editor() from public, anon;
grant execute on function public.is_porch_editor() to authenticated;

create table public.porch_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 60),
  title text not null check (char_length(btrim(title)) between 1 and 90),
  summary text not null check (char_length(btrim(summary)) between 1 and 280),
  -- The post body: an ordered list of blocks (text, photo, gallery, video, audio,
  -- quote, link, place, file, experiment). Shape is checked in the app
  -- (src/lib/porchBlocks.ts normalizeBlocks); here only that it's a list and not huge.
  blocks jsonb not null default '[]'::jsonb
    check (jsonb_typeof(blocks) = 'array' and jsonb_array_length(blocks) <= 40 and pg_column_size(blocks) <= 120000),
  kind text not null check (kind in ('news', 'gathering', 'ask', 'story')),
  -- How the post presents itself (Porch Lab): {"layout": "standard"|"takeover",
  -- "mood": "dusk"|"sunrise"|"forest"|"plum", "reactions": true|false}. Checked in the app.
  presentation jsonb not null default '{}'::jsonb
    check (jsonb_typeof(presentation) = 'object' and pg_column_size(presentation) <= 2000),
  -- Partner slug from src/data/partners.ts; 'sparkpoint' for our own posts.
  org text not null default 'sparkpoint' check (org ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  image_path text check (image_path is null or image_path ~ '^[a-z0-9][a-z0-9/_.-]*$'),
  image_alt text check (image_alt is null or char_length(image_alt) <= 300),
  link_url text check (link_url is null or (link_url ~ '^https://' and char_length(link_url) <= 500)),
  link_label text check (link_label is null or char_length(link_label) <= 40),
  event_start timestamptz,
  event_end timestamptz,
  event_place text check (event_place is null or char_length(event_place) <= 120),
  pinned boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint porch_image_needs_alt
    check (image_path is null or char_length(btrim(coalesce(image_alt, ''))) > 0),
  constraint porch_event_order
    check (event_end is null or (event_start is not null and event_end >= event_start)),
  constraint porch_published_has_date
    check (status <> 'published' or published_at is not null),
  constraint porch_label_needs_link
    check (link_label is null or link_url is not null)
);

-- At most one pinned post. The trigger below unpins the old one first, so
-- pinning a new post never trips this index.
create unique index porch_posts_one_pin on public.porch_posts (pinned) where pinned;
create index porch_posts_feed on public.porch_posts (status, published_at desc);

create or replace function public.porch_posts_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  -- Drafts and archived posts can't hold the pin.
  if new.status <> 'published' then
    new.pinned := false;
  end if;
  if new.pinned and (tg_op = 'INSERT' or not old.pinned) then
    update public.porch_posts set pinned = false where pinned and id <> new.id;
  end if;
  return new;
end;
$$;

create trigger porch_posts_before_write
  before insert or update on public.porch_posts
  for each row execute function public.porch_posts_before_write();

alter table public.porch_posts enable row level security;

revoke all on public.porch_posts from anon, authenticated;
grant select on public.porch_posts to anon, authenticated;
grant insert, update, delete on public.porch_posts to authenticated;

create policy "Published posts are public"
  on public.porch_posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "Editors read every post"
  on public.porch_posts for select
  to authenticated
  using ((select public.is_porch_editor()));

create policy "Editors create posts"
  on public.porch_posts for insert
  to authenticated
  with check ((select public.is_porch_editor()));

create policy "Editors update posts"
  on public.porch_posts for update
  to authenticated
  using ((select public.is_porch_editor()))
  with check ((select public.is_porch_editor()));

create policy "Editors delete posts"
  on public.porch_posts for delete
  to authenticated
  using ((select public.is_porch_editor()));

-- Media: public to read by URL, not listable, editors-only writes.
-- Photos (resized in the browser first), clips up to a minute, audio, and PDFs.
-- 150 MB covers a one-minute 1080p phone video; longer video belongs on
-- YouTube or Vimeo as an embed, both for bandwidth and because Facebook wants
-- the file uploaded natively anyway.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'porch-media',
  'porch-media',
  true,
  157286400,
  array[
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/webm',
    'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/webm', 'audio/ogg',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

-- Storage needs SELECT to replace or delete an object. Editors only, so the
-- bucket stays unlistable to the public.
create policy "Porch editors see images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'porch-media' and (select public.is_porch_editor()));

create policy "Porch editors upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'porch-media' and (select public.is_porch_editor()));

create policy "Porch editors replace images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'porch-media' and (select public.is_porch_editor()))
  with check (bucket_id = 'porch-media' and (select public.is_porch_editor()));

create policy "Porch editors delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'porch-media' and (select public.is_porch_editor()));

-- ── Porch Lab participation: anonymous polls and porch reactions ──────────────
-- The public never touches these tables directly (RLS on, no policies). Votes and
-- reactions go through the functions below, which check that the post is live,
-- that the poll or reactions really exist on it, and apply a soft rate limit.
-- `voter` is a random token the browser keeps; it makes "one per browser" possible
-- without accounts or tracking, and it is never linked to anything else.

create table public.porch_votes (
  post_id uuid not null references public.porch_posts (id) on delete cascade,
  block_id text not null check (char_length(block_id) between 1 and 40),
  option_index smallint not null check (option_index between 0 and 4),
  voter text not null check (voter ~ '^[a-z0-9]{16,64}$'),
  created_at timestamptz not null default now(),
  primary key (post_id, block_id, voter)
);
alter table public.porch_votes enable row level security;
create index porch_votes_recent on public.porch_votes (post_id, created_at desc);

create table public.porch_reactions (
  post_id uuid not null references public.porch_posts (id) on delete cascade,
  reaction text not null check (reaction in ('chair', 'lantern', 'wave', 'thanks')),
  voter text not null check (voter ~ '^[a-z0-9]{16,64}$'),
  created_at timestamptz not null default now(),
  primary key (post_id, reaction, voter)
);
alter table public.porch_reactions enable row level security;
create index porch_reactions_recent on public.porch_reactions (post_id, created_at desc);

create or replace function public.porch_vote(p_post uuid, p_block text, p_option int, p_voter text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  poll jsonb;
begin
  select b into poll
  from public.porch_posts p, jsonb_array_elements(p.blocks) b
  where p.id = p_post
    and p.status = 'published' and p.published_at <= now()
    and b ->> 'type' = 'poll' and b ->> 'id' = p_block
  limit 1;
  if poll is null then
    return false;
  end if;
  if p_option < 0 or p_option >= jsonb_array_length(poll -> 'options') then
    return false;
  end if;
  -- Soft rate limit: a burst of more than 200 votes a minute on one post is not people.
  if (select count(*) from public.porch_votes v where v.post_id = p_post and v.created_at > now() - interval '1 minute') > 200 then
    return false;
  end if;
  insert into public.porch_votes (post_id, block_id, option_index, voter)
  values (p_post, p_block, p_option, p_voter)
  on conflict do nothing;
  return true;
end;
$$;

create or replace function public.porch_poll_results(p_post uuid, p_block text)
returns table (option_index smallint, votes bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select v.option_index, count(*)
  from public.porch_votes v
  join public.porch_posts p on p.id = v.post_id
  where v.post_id = p_post and v.block_id = p_block
    and p.status = 'published' and p.published_at <= now()
  group by v.option_index;
$$;

create or replace function public.porch_react(p_post uuid, p_reaction text, p_voter text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.porch_posts p
    where p.id = p_post and p.status = 'published' and p.published_at <= now()
      and (p.presentation ->> 'reactions')::boolean is true
  ) then
    return false;
  end if;
  if (select count(*) from public.porch_reactions r where r.post_id = p_post and r.created_at > now() - interval '1 minute') > 200 then
    return false;
  end if;
  insert into public.porch_reactions (post_id, reaction, voter)
  values (p_post, p_reaction, p_voter)
  on conflict do nothing;
  return true;
end;
$$;

create or replace function public.porch_reaction_counts(p_post uuid)
returns table (reaction text, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select r.reaction, count(*)
  from public.porch_reactions r
  join public.porch_posts p on p.id = r.post_id
  where r.post_id = p_post and p.status = 'published' and p.published_at <= now()
  group by r.reaction;
$$;

revoke all on function public.porch_vote(uuid, text, int, text) from public;
revoke all on function public.porch_poll_results(uuid, text) from public;
revoke all on function public.porch_react(uuid, text, text) from public;
revoke all on function public.porch_reaction_counts(uuid) from public;
grant execute on function public.porch_vote(uuid, text, int, text) to anon, authenticated;
grant execute on function public.porch_poll_results(uuid, text) to anon, authenticated;
grant execute on function public.porch_react(uuid, text, text) to anon, authenticated;
grant execute on function public.porch_reaction_counts(uuid) to anon, authenticated;
