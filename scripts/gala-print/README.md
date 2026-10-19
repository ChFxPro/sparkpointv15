# An Atlas of Wonders print and social files (the SparkPoint Gala)

The print invitation, social graphics, Squarespace ticket images, logo PNGs and
link-preview image for An Atlas of Wonders, the SparkPoint Gala (Friday,
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
| `logo` | `lockup.html` | `logo/atlas-of-wonders-lockup-for-{dark,light}-backgrounds.png`, transparent, 1730×1202 |
| `invite` | `invite.html` | `print/sparkpoint-gala-invitation-2up-11x8.5.pdf` (two per letter sheet) and `…-5.5x8.5.pdf` (one) |
| `social` | `social-on-sale.html` | `social/…-1080x1350`, `…-1080x1080`, `…-story-1080x1920`, `…-facebook-event-1920x1005` PNGs |
| `tickets` | `ticket-{square,wide,banner,story}.html` | `tickets/` PNGs at 2160², 3840×2160, 3600×1200 and 2160×3840 for the Squarespace ticket page |
| `share` | `share.html` | `share/gala-share-atlas.jpg`, 1200×630; copy it to `public/assets/events/gala/` to update the site |

The `share` group uses the dark logo PNG, so it renders `logo` too.

## How the templates work

They're plain HTML pages screenshotted (or printed to PDF) by Puppeteer. In
place of fixed paths they use placeholders, which `render.mjs` fills in, so
they render from any checkout:

- `{{FRAUNCES}}` and `{{MANROPE}}`: the site's `@fontsource` font files
- `{{PUBLIC}}`: this repo's `public/` (hero photo, sparkmark)
- `{{ASSETS}}`: `scripts/gala-print/assets/` (the QR code, the link-preview background)
- `{{OUTPUT}}`: `output/gala-print/`

The lockup (globe, small italic "An", ATLAS, "of Wonders", sparkmark rule, THE
SPARKPOINT GALA) is the title everywhere the name appears as a heading. The
website draws the same lockup in `src/components/GalaLockup.tsx`; keep them in
step. `lockup.html` is the master for the logo PNGs, and the email generator
keeps copies of them in `scripts/gala-invitation/assets/`.

## Common updates

- **The eight trips are announced:** in `templates/invite.html`, edit
  `BOARD_ROWS` in the script at the bottom (16 characters max per destination,
  capitals), then run `npm run print:gala -- invite`. Update the website's
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

The name is **An Atlas of Wonders**. "The SparkPoint Gala" is a separate
byline; never join them with a colon or write "A SparkPoint Gala." Invite
people *for* it: "Join us for An Atlas of Wonders, the SparkPoint Gala." Keep
internal notes off every piece: board-member bidding, the AmFund contact, and
any unconfirmed giveback percentage.
