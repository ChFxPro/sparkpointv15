# SparkPoint Gala invitation

An email invitation for the SparkPoint Gala (Friday, December 11, 2026, 6 p.m.),
designed to match `/events/sparkpoint-gala`. It's a single image, because the
places it goes (the Squarespace newsletter and Outlook) take images and buttons
but not coded HTML emails.

```bash
npm run invite:gala
```

That writes two things into `output/gala-invitation/` (git-ignored, so re-run
the command whenever you need the files):

- `sparkpoint-gala-invitation-save-the-date.jpg` (or `…-tickets.jpg` once
  tickets are on sale): the whole invitation as one image, 1200 px wide, shown
  at 600 px, about 0.5 MB. Use it in Outlook and for online promotion.
- `newsletter/`: the newsletter version (`newsletter.html`) cut into one image
  per section, so the Squarespace email can link each one to its part of the
  Gala page. Two are looping GIFs (the plane flies the boarding pass route; the
  departures board's letters flip into place). Their first frame is the finished
  picture, because desktop Outlook shows only that frame. About 0.7 MB in all;
  the command warns if a GIF passes 1 MB or the set passes 2.5 MB.

Both templates share `styles.css`.

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

**Then update the email copy too.** The note, button, and alt text below come in
a "save the date" version and an "on sale" version. Once tickets or the venue
are announced, switch to the on-sale version (and fill in the venue), so the
text around the image doesn't contradict it.

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

## The newsletter (Squarespace)

There are two drafts in Squarespace Email Campaigns, built from the same
section images on a midnight background (Style → Email Background `#0B1322`,
text blocks set to ivory `#F7F1E5`):

- **Attendees**: "You're invited: The SparkPoint Gala, December 11". No sponsor
  section.
- **Sponsor direct**: "Come aboard as a SparkPoint Gala travel partner". Adds the
  seat map and a "Request early boarding" button.

The order, with each image's link (all on
`https://yoursparkpoint.org/events/sparkpoint-gala` unless noted):

| Block | Images (link) | Version |
| --- | --- | --- |
| Text | The note (see below) | both, worded per version |
| Images | `01-hero` (page), `02-boarding-pass.gif` (page) | both |
| Text | "Picture it: a first-class evening at home in Transylvania County, and a live auction of eight trips around the world. Tap any part of this invitation to explore it on the Gala page." | both |
| Images | `03-departures.gif` (`#routes-title`), `04-passport` (`#passport`), `05-luggage-tags` (`#tags-title`), `06-postcard` (`#return-title`) | both |
| Images | `08-your-seat` (`#close-title`) | both |
| Images | `07-travel-partners` (the Monday sponsor form) | sponsor only, under `08` |
| Button | "Get gala updates" (page) / "Request early boarding" (Monday sponsor form) | attendees / sponsor |

The Monday sponsor form is
`https://forms.monday.com/forms/8bc904c73a179d5be96939ed2c05b62a`
(`GALA_PARTNER_FORM_URL` in `src/data/events.ts`).

Squarespace quirks worth knowing: an Images block holds at most four images;
images inside one block stack with no gap, but blocks have padding, so the
image blocks have their bottom padding set to 0 (Spacing → Padding between
sections → custom); and each image's link and alt text sit behind the arrow
next to it in the block's image list.

**To update it** after changing `invitation.config.json`: re-run the command,
then in each draft open the image's block → Manage images, add the new file,
drag it into place, remove the old one, and re-enter its link and alt text.
The board (`03`), boarding pass (`02`), and closing (`08`) are the ones the
settings change.

**Alt text used**

- Hero: You're invited to the SparkPoint Gala, Friday, December 11, 2026. See
  the world. Strengthen home.
- Boarding pass: SparkPoint requests the pleasure of your company at The
  SparkPoint Gala. A first-class boarding pass: Transylvania County to
  Anywhere, Friday, December 11, 2026, boarding at 6 p.m. Venue to be
  announced.
- Departures: The travel auction: eight departures, one home base. A
  departures board lists the SparkPoint Gala on December 11 and eight trips
  going up for bid with a live auctioneer, destinations revealed soon.
- Passport: Your passport to the auction: 8 travel experiences, 3 years to
  travel, no blackout dates, and you can match the winning bid.
- Luggage tags: Where will yours take you? Five leather luggage tags:
  anniversary, milestone birthday, honeymoon, family vacation, bucket list.
- Postcard: Travel that gives back to our community. A postcard reading
  Greetings from HOME shows a concept rendering of the Transylvania Resilience
  Hub, which a portion of every travel package sold at the Gala helps bring to
  life.
- Your seat: Your seat is waiting. Venue, tickets and destinations coming soon.
- Travel partners: Travel partners: your brand, cleared for takeoff. A cabin
  seat map with First Class, Business and Main Cabin sponsor seats. Seat map
  opening soon.

Update the venue, board, and closing alt text along with the images.

**Sponsor-direct copy**

- Subject: Come aboard as a SparkPoint Gala travel partner
- Preview: Put your brand on board for December 11: an evening of connection
  and a live travel auction that gives back to Transylvania County.
- Note:

  > Friends,
  >
  > On Friday, December 11, at 6 p.m., SparkPoint hosts the SparkPoint Gala:
  > an evening of connection and a live auction of eight travel experiences,
  > with a portion of every trip coming home to help bring the Transylvania
  > Resilience Hub to life. We're inviting local businesses to come aboard as
  > travel partners, through sponsorships and in-kind support for food, drink,
  > and entertainment. Take a look at the evening below, then request early
  > boarding and we'll find the seat that fits you.

The attendee draft uses the subject, preview, and note below.

## Email copy

**Subject lines** (pick one)

- You're invited: The SparkPoint Gala, December 11
- See the world. Strengthen home. ✈️ Save the date
- Your seat is waiting: The SparkPoint Gala

**Preview text**

An evening of connection and a live auction of eight travel experiences that
give back to Transylvania County.

**Note above the image** (save the date: until tickets and venue are announced)

> Friends,
>
> Please save the date for the SparkPoint Gala on Friday, December 11, at 6 p.m.
> It's an evening of connection and celebration, with a live auction of eight
> travel experiences, and a portion of every trip comes home to help bring the
> Transylvania Resilience Hub to life. Venue and tickets are coming soon, and
> we'd love for you to be there.

**Note above the image** (on sale: once tickets go live; fill in the venue)

> Friends,
>
> Tickets are now on sale for the SparkPoint Gala on Friday, December 11, at
> 6 p.m. at [venue name]. It's an evening of connection and celebration, with a
> live auction of eight travel experiences, and a portion of every trip comes
> home to help bring the Transylvania Resilience Hub to life. Your seat is
> waiting.

**Button**: Get gala updates (save the date) · Get your tickets (on sale)

**Alt text for the image** (save the date)

You're invited to the SparkPoint Gala, Friday, December 11, 2026, at 6 p.m.:
an evening of connection and a live auction of eight travel experiences that
gives back to the Transylvania Resilience Hub. Venue and tickets coming soon.

**Alt text for the image** (on sale; fill in the venue)

You're invited to the SparkPoint Gala, Friday, December 11, 2026, at 6 p.m. at
[venue name]: an evening of connection and a live auction of eight travel
experiences that gives back to the Transylvania Resilience Hub. Tickets are on
sale now.
