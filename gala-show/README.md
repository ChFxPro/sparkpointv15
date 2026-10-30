# Gala show deck

The on-screen deck for **A World of Connections, the SparkPoint Gala** (December 11, 2026).
Its look follows the Gala brand kit in `Branding/Gala/WorldOfConnections/` (README and
`lockup.html`): everything in Josefin Sans, Art Deco, the lockup ported from `lockup.html`
(with the live globe lined up behind its drawn one, Brevard on the home node), the
double-hairline rule, a double frame round each page, and trips numbered as
connections ("Connection 01").
It runs the room: the holding loop, the welcome, the year in review, staff and board
recognition, the live travel auction (one page per trip, with a gold globe that turns to
each destination and draws the route from Brevard), and the thank-you with a QR code
for giving.

It is not part of the website. `show/` is a self-contained folder: copy it anywhere
(the "SP Gala 26" Drive folder, a USB stick, the show laptop) and open `index.html` in
Chrome. No install, no internet.

## On the night

1. Copy `show/` to the show laptop, with the videos in `show/media/` (see the README there).
2. Open `show/index.html` in **Chrome**. Press **F** for full screen.
3. In the editor (**E**), click **Check media files**. Then press **E** again to close it.
4. Turn off sleep and notifications on the laptop; set sound to the room's speakers.

| Key | Does |
| --- | --- |
| → Space Page Down | Next (clickers send these) |
| ← Page Up | Back |
| B or . | Black screen; any key brings it back |
| L | Jump to the holding loop, and back to where you were |
| S | On a trip page: stamp it SOLD (again to remove) |
| O | All pages, click one to go there |
| 12 then Enter | Go to page 12 |
| F | Full screen |
| E | Edit the show |
| H | The key list |

On the first loop page the build-in plays, then the loop runs until you press →, which
plays the build-out and moves on. Hidden pages (the sponsors page starts hidden) are
skipped during the show.

## Editing

Press **E**. The panel lists every page; pick one to change its words, files, or
whether it's hidden; add, duplicate, move, or delete pages. Layouts are fixed per page
type so everything stays on brand.

**Save** (or Cmd+S) writes `content.js` back into the show folder. The first time,
Chrome asks you to pick the folder (the one with `index.html` in it) and to allow
editing; after that it remembers. Each save keeps the previous version in
`show/backups/`. If Chrome can't write to the folder, Save downloads `content.js`
instead; put it in the folder, replacing the old one.

Trips need a latitude and longitude for the globe. In Google Maps, right-click the
place and click the numbers at the top of the menu to copy them (latitude first;
west and south are negative).

`content.js` is plain JavaScript and can be edited by hand too.

## Slide template kit (Keynote, PowerPoint, Canva)

For anyone who'd rather build slides in the app they know, `npm run kit` writes
`output/gala-show-kit/`: a PowerPoint template (opens in Keynote and imports into
Canva) with eleven layouts matching the deck's page types, filled with the current
`content.js`; every background rendered from the live globe (trips with a
destination get their route); transparent globe cut-outs; the lockup, sparkmark and
giving QR code; installable Josefin Sans; and a README for each app. Re-run
it after the trips are set. It needs Chrome, and Python with `fonttools` and
`brotli` for the fonts (`FONT_PYTHON=/path/to/python npm run kit`).

`src/plate.js` (built to `kit/.build/`) renders a page's background with no words;
`kit/make-kit.mjs` screenshots those and builds the template; `kit/fonts.py` cuts
static fonts at the deck's settings.

## Building

The code lives in `src/`; `npm run build` bundles it into `show/deck.js` and
`show/deck.css`, which are committed so the folder works straight from a checkout.

```bash
cd gala-show && npm install && npm run build
```

- `src/main.js` runs the show: keys, page changes, overview, blackout.
- `src/slides.js` draws each page type; `src/schema.js` lists the types, their fields,
  and where the globe sits behind each.
- `src/globe.js` is the three.js globe. The land dots come from the site's
  `public/assets/events/gala/world-dots.svg`, read at build time.
- `src/editor.js` is the edit panel and saving.

Everything is inlined (fonts, the sparkmark, three.js) because Chrome won't load fonts
or modules from `file://`. To preview while working, serve `show/` (the `gala-show`
entry in `.claude/launch.json` does this) and reload after `npm run watch` rebuilds.
