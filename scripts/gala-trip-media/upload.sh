#!/bin/bash
# Uploads the Gala trip videos to the media host the site plays them from:
# the public `gala-media` bucket on the SparkPoint V15 Supabase project
# (Pro plan, served through Supabase's CDN). GitHub Pages delivers large media
# at about 70 KB/s per connection (measured 2026-11-11), too slow for the films.
#
#   npm run gala:media-upload                 # everything in the site's video folder
#   npm run gala:media-upload -- <file> ...   # just these files
#
# Run it after `npm run gala:trip-media` or `npm run gala:trailer` changes any
# file, before merging: the deployed site reads the bucket (VITE_GALA_MEDIA_BASE
# in .github/workflows/deploy.yml), not public/. Files keep their names and are
# overwritten in place; browsers may hold an old copy for up to an hour.
#
# Needs the Supabase CLI signed in (`supabase login`). The service key is
# fetched for each run and never written to disk.
set -euo pipefail
REF=suqtfbculwuetfdhdgdh
URL="https://$REF.supabase.co"
DIR="$(cd "$(dirname "$0")/../.." && pwd)/public/assets/events/gala/trips/video"
KEY=$(supabase projects api-keys --project-ref "$REF" -o json | python3 -c "import json,sys;print(next(k['api_key'] for k in json.load(sys.stdin) if k.get('name')=='service_role' or k.get('id')=='service_role'))")
files=("$@")
[ ${#files[@]} -gt 0 ] || files=("$DIR"/*)
fail=0
for f in "${files[@]}"; do
  n=$(basename "$f")
  case "$n" in
    *.mp4) t=video/mp4 ;; *.webm) t=video/webm ;; *.vtt) t=text/vtt ;; *.webp) t=image/webp ;;
    *) echo "skip $n"; continue ;;
  esac
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$URL/storage/v1/object/gala-media/trips/$n" \
    -H "Authorization: Bearer $KEY" -H "apikey: $KEY" -H "Content-Type: $t" \
    -H 'cache-control: max-age=3600' -H 'x-upsert: true' --data-binary @"$f")
  echo "$code $n"
  [ "$code" = 200 ] || fail=1
done
exit $fail
