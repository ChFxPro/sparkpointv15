-- Public-read bucket for event media pages (photos and video) beyond the convening,
-- starting with the Collaboration Lab (prefix collaboration-lab-2026/). Same rules as
-- convening-photos: public objects can be fetched by URL, but with no storage.objects
-- policies the bucket can't be listed and only a secret key can write.
-- Video downloads go up to 8 GB (the 1080p program recordings are ~4–6 GB); the 4K
-- camera originals are shared from the NAS instead.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  8589934592,
  array['image/jpeg', 'image/webp', 'video/mp4']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
