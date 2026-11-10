# Gala trip promo packs

Builds a promo pack for each of the 8 travel packages at A World of Connections, the SparkPoint Gala (Dec 11, 2026).
The packs are large binaries, so they live outside git, in the trip kit:
`/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/trips/<trip>/pack/` (set `GALA_TRIPS_DIR` to
use another copy). Read that folder's `README.md` first: it has the copy rules.

```bash
npm run trips:stills                       # stills for every trip (or: -- greece iceland)
npm run trips:pack -- greece               # the whole pack for one trip
npm run trips:pack -- greece --only=social,factsheet
npm run trips:pack -- greece --no-music
```

Downloads and intermediate frames are cached in `output/gala-trips/` (git-ignored). A full pack takes about 25 minutes,
most of it the video render.

## What a pack holds

| Step | Template | Output in `pack/` |
| --- | --- | --- |
| stills | none (sharp) | `stills/<trip>-NN-<slug>-{800,1600,2400}.webp`, `stills.json` (alt text, credit line, source) |
| map | `templates/map.html` | `map/<trip>-journey-map-{16x9,9x16,1x1}.{png,mp4}` and a title-free `-plain-4x3.png` |
| video | `templates/reel.html` | `video/<trip>-promo-16x9.mp4` (Gala screen, 60–90 s) and `<trip>-promo-30s-{9x16,1x1}.mp4`, each also `-silent.mp4`; `sources.json` |
| social | `templates/social.html` | `social/<trip>-social-{1080x1350,1080x1080,1080x1920}.png` |
| factsheet | `templates/factsheet.html` | `factsheet/<trip>-fact-sheet.pdf` and a PNG preview |
| always | none | `captions.md`, `LICENSES.md`, `README.md` |

## Where things come from

- **Facts** (nights, travelers, what's included, summary): the kit's `trips.json`. Never edited here.
- **Presentation** (`packs.json`): map stops, coordinates and label sides, the highlights on the cards, the hook line,
  and each trip's `reel` (the shots in the video, in order). Coordinates that the research session adds to `trips.json`
  stops (`{ name, lat, lon }`) win over the ones here.
- **Photos** (`stills.picks.json`): Wikimedia Commons file titles. The licence and author are read from the Commons API
  at build time, and anything that isn't CC0, public domain, CC BY or CC BY-SA is refused.
- **Video**: a reel shot is a pack still (`still`), another Commons photo (`commonsStill`), or a Commons video window
  (`clip: { commons, at, dur, keepTop }`). Only the bytes around the window are fetched from the 4K original.
  `keepTop` crops to the top part of the frame, which removes a channel watermark or burnt-in subtitles along the
  bottom. Stills get a slow camera move (`move`: `in`, `out`, `left`, `right`); `fx` sets the focus for the vertical
  and square cuts. Mark four shots `social: true` for the 30 s cuts.
- **Music**: `packs.json` `music` (a CC BY track on Commons). Every cut is also written silent, so the music can be
  swapped or dropped.
- **Map land**: Natural Earth (public domain), via the `world-atlas` TopoJSON on jsDelivr.
- **Brand**: the lockup is `scripts/gala-print/templates/shared/lockup.{css,js}` (reads "Travel experience"); Josefin
  Sans comes from the brand kit's `fonts/`.

## Rules the code enforces

- **Price switch.** Prices show only when `trips.json` `showPrices` is `true`, and then only a trip's `publicPrice`.
  With the switch on and no `publicPrice`, the build stops. `listPrice` is internal and is never read.
- No auction wording, no provider name, nothing about buying after the Gala: the copy here is fixed, and new copy in
  `packs.json` must follow the same rules.
- `LICENSES.md` is generated from `stills.json` and `video/sources.json`, so it always matches what was used.
  CC BY and BY-SA need a visible credit; `captions.md` carries it for social posts.

## Adding a trip's reel

1. Find clips: search Commons for `filetype:video` with the place name, and check them for cuts, watermarks and
   people's faces.
2. Add the `reel` to the trip in `packs.json` (see Greece), with four `social` shots.
3. `npm run trips:pack -- <trip>`, then watch the 16:9 master.
