# SparkPoint Gala invitation

An email invitation for the SparkPoint Gala (Friday, December 11, 2026, 6 p.m.),
designed to match `/events/sparkpoint-gala`. It's a single image, because the
places it goes (the Squarespace newsletter and Outlook) take images and buttons
but not coded HTML emails.

```bash
npm run invite:gala
```

That writes `output/gala-invitation/sparkpoint-gala-invitation-save-the-date.jpg`
(or `…-tickets.jpg` once tickets are on sale): 1200 px wide, shown at 600 px in
email so it stays sharp on phones, about 0.5 MB. `output/` is git-ignored, so
re-run the command whenever you need the file.

## Updating it

Edit `invitation.config.json`, then run the command again.

- **When tickets go live**: set `tickets.live` to `true`, put the ticket link
  in `tickets.url` (shown on the image, so keep it readable, e.g.
  `yoursparkpoint.org/events/sparkpoint-gala`), and optionally a line like
  `"Tickets $150 · Tables of 8 available"` in `tickets.price`. The closing
  section switches to "Tickets are on sale" and "Get your tickets".
- **When the venue is set**: fill `venue.name` (e.g. `"The Venue Name"`),
  `venue.place` (e.g. `"Brevard, NC"`), and `venue.short`, a one-word label for
  the boarding pass's Gate field (10 characters max).
- **When the 8 trips are defined**: add them to `trips`, for example
  `{ "destination": "Tuscany, Italy", "board": "TUSCANY ITALY" }`. `board` is
  what the departures board shows: 16 characters max, capitals. Until all 8 are
  listed, the rest of the board says "REVEALING SOON".

To preview a change without touching the real settings:

```bash
node scripts/gala-invitation/render.mjs --config my-test.json --out /some/folder
```

Keep the details here in step with the Gala page (`src/pages/GalaPage.tsx`,
`src/data/events.ts`), and keep internal notes off both: board-member
bidding, the AmFund contact, and any unconfirmed giveback percentage.

## Sending it

**Link to use for the image and the button**:
`https://yoursparkpoint.org/events/sparkpoint-gala` (or the ticket link once
tickets are on sale).

**Squarespace newsletter (Email Campaigns)**

1. Add an **Image** block, upload the JPG, and set the block's link to the URL
   above.
2. Add a **Button** block right under it ("Get gala updates", later "Get your
   tickets") with the same link. A real button still works when someone's email
   blocks images.
3. Add a sentence or two of text above the image (see the copy below). An email
   that's only an image is more likely to land in spam.

**Outlook (Microsoft 365)**

1. Write the short note first, then **Insert → Pictures** and choose the JPG.
2. Select the image, press **Ctrl+K** (**⌘K** on a Mac), and paste the URL so a
   click opens the Gala page.
3. Right-click the image → **Edit Alt Text** and paste the alt text below.
4. If Outlook shows it oversized, right-click → **Size and Position** and set
   the width to 600 px (keep the aspect ratio locked).

## Email copy

**Subject lines** (pick one)

- You're invited: The SparkPoint Gala, December 11
- See the world. Strengthen home. ✈️ Save the date
- Your seat is waiting: The SparkPoint Gala

**Preview text**

An evening of connection and a live auction of eight travel experiences that
give back to Transylvania County.

**Note above the image**

> Friends,
>
> Please save the date for the SparkPoint Gala on Friday, December 11, at 6 p.m.
> It's an evening of connection and celebration, with a live auction of eight
> travel experiences, and a portion of every trip comes home to help bring the
> Transylvania Resilience Hub to life. Venue and tickets are coming soon, and
> we'd love for you to be there.

**Button**: Get gala updates (later: Get your tickets)

**Alt text for the image**

You're invited to the SparkPoint Gala, Friday, December 11, 2026, at 6 p.m.:
an evening of connection and a live auction of eight travel experiences that
gives back to the Transylvania Resilience Hub. Venue and tickets coming soon.
