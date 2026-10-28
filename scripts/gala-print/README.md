# A World of Connections print and social files (the SparkPoint Gala)

The print invitation, social graphics (Tickets on sale now and Save the date), Squarespace ticket images, logo PNGs and
link-preview image for A World of Connections, the SparkPoint Gala (Friday,
December 11, 2026, 6 p.m.). They match `/events/sparkpoint-gala`. The email
invitation has its own generator in `scripts/gala-invitation/`.

```bash
npm run print:gala                   # everything
npm run print:gala -- invite social  # just some groups
```

Files land in `output/gala-print/` (git-ignored). The shared copies live in the
"SP Gala 26" Google Drive folder, which also has a "00 Start here" asset guide.
Replace the Drive files after re-rendering.

| Group | Template | Output |
| --- | --- | --- |
| `logo` | `lockup.html` | `logo/world-of-connections-lockup-for-{dark,light}-backgrounds.png`, transparent, 1608×1082 (the kit's size) |
| `invite` | `invite.html` | `print/sparkpoint-gala-invitation-2up-11x8.5.pdf` (two per letter sheet) and `…-5.5x8.5.pdf` (one) |
| `social` | `social-on-sale.html` | `social/sparkpoint-gala-tickets-on-sale-…` and `social/sparkpoint-gala-save-the-date-…` PNGs, each at 1080x1350, 1080x1080, story 1080x1920 and Facebook event 1920x1005. One template; body class `std` switches it to the Save the date wording |
| `tickets` | `ticket-{square,wide,banner,story}.html` | `tickets/` PNGs at 2160², 3840×2160, 3600×1200 and 2160×3840 for the Squarespace ticket page |
| `share` | `share.html` | `share/gala-share-world-of-connections.jpg`, 1200×630; copy it to `public/assets/events/gala/` to update the site |

The `share` group uses the dark logo PNG, so it renders `logo` too.

## How the templates work

They're plain HTML pages screenshotted (or printed to PDF) by Puppeteer. In
place of fixed paths they use placeholders, which `render.mjs` fills in, so
they render from any checkout:

- `{{JOSEFIN}}`: the site's `@fontsource-variable/josefin-sans` font files (the Gala's only typeface)
- `{{INCLUDE:shared/lockup.css}}` and `{{INCLUDE:shared/lockup.js}}`: inline the shared lockup, below
- `{{PUBLIC}}`: this repo's `public/` (hero photo, sparkmark)
- `{{ASSETS}}`: `scripts/gala-print/assets/` (the QR code, the link-preview background)
- `{{OUTPUT}}`: `output/gala-print/`

The lockup is the title everywhere the name appears as a heading: globe,
sunburst and three flight routes meeting at a home node behind; a small italic
"A"; WORLD with its Deco gap and edge lines; — OF CONNECTIONS —; a double-hairline
rule with the sparkmark; THE SPARKPOINT GALA over LIVE TRAVEL AUCTION. It lives
once, in `templates/shared/lockup.css` and `templates/shared/lockup.js`, ported
exactly from the brand kit's master
(`/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/lockup.html`).
A template drops in `<div class="lk-slot"></div>` (add `light` for cream paper)
and sets the lockup's `font-size`, which is the cap size of WORLD; everything else
scales from it. WORLD runs about 5.3 em wide with its tracking, so keep it under
about 150 px on a 1080 px canvas. Change the kit first, then copy the values
here; the website draws the same lockup in `src/components/GalaLockup.tsx`.
`lockup.html` is the master for the logo PNGs, and the email generator keeps
copies of them in `scripts/gala-invitation/assets/`.

`shared/lockup.css` also has the kit's Deco details: `.deco-frame` (a double
hairline inset 22 px, with a 6 px outline offset, brass at 50% and 28%) and the
square pink button with a brass border. Everything is set in Josefin Sans; only
the split-flap board letters use a monospace face, so each letter fills a tile.

## Common updates

- **The eight trips are announced:** in `templates/invite.html`, edit
  `BOARD_ROWS` in the script at the bottom (16 characters max per destination,
  capitals). Trips are numbered as **connections** ("Connection 01 · Kyoto"),
  never atlas plates. Then run `npm run print:gala -- invite`. Update the website's
  `DEPARTURES` (`src/pages/GalaDepartureBoard.tsx`) and the email's
  `invitation.config.json` at the same time, so every piece lists the same trips.
- **Date, venue or price change:** the text is written into each template. Search
  the templates for the old value. The site reads these from `src/data/events.ts`.
- **The ticket link changes:** don't, if you can help it. It's printed in the
  invitation's QR code and as text. If you must, regenerate
  `assets/ticket-qr.svg` (QR, error correction level Q, for example with
  `npx bwip-js`), update the printed URL in `invite.html` and `TICKET_URL` in
  `render.mjs`, then re-render. The render checks that the QR code decodes to
  `TICKET_URL` and stops if it doesn't.

## Print notes

The invitation runs edge to edge, with text and the QR code kept at least 0.3 in
inside the trim. The render warns if the footer creeps closer. Print at
**Actual size**. A print shop gives clean full bleed; a home printer leaves a
thin white border. Scan a printed copy before printing a batch.

## Names and wording

The name is **A World of Connections** (plural; it replaced An Atlas of Wonders
on 2026-10-28). In sentences: "Join us for A World of Connections, the
SparkPoint Gala." The full form, for titles and the Squarespace product, is *A
World of Connections: SparkPoint Gala & Travel Auction*. The tagline is "Every
journey connects back home.", set with *connects back home.* in Josefin 600
brass. Retired with Atlas: Fraunces, the atlas plates, and the "Atlas Gala"
nickname. Keep internal notes off every piece: board-member bidding, the AmFund
contact, and any unconfirmed giveback percentage.
