# An Atlas of Wonders invitation (the SparkPoint Gala)

An email invitation for An Atlas of Wonders, the SparkPoint Gala (Friday,
December 11, 2026, 6 p.m.),
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

**Link to use for the image and the button**: the ticket link,
`https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala` (tickets are on
sale; before that it was `https://yoursparkpoint.org/events/sparkpoint-gala`).

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
section images on a midnight background (Style → Email Background `#0B1322`).
Squarespace emails can't load Fraunces, so the live text uses the closest
built-in match:

- Style → Font Pack **Book Serif**, Font Sizes one step up from the default.
- The note: "Friends," as an italic Medium Heading, body in soft ivory
  `#E6DFD2`, side padding 35 px (lines up with the copy inside the images) and
  bottom padding 23 px. A text block takes one color, so the greeting can't be
  brass on its own.
- The "Picture it…" bridge line: centered italic in soft brass `#E8D3A4`, to
  echo the hero's "See the world. Strengthen home."
- Buttons stay sans (brass `#D9B56A`, midnight text), like the buttons drawn in
  the images.

The two drafts:

- **Attendees**: "You're invited: An Atlas of Wonders, the SparkPoint Gala". No
  sponsor section. Uses the on-sale note below, with the preview "An Atlas of
  Wonders, the SparkPoint Gala, December 11 at Connestee Falls: tickets on sale, $100 per person. An
  evening of connection and a live travel auction that gives back to
  Transylvania County."
- **Sponsor direct**: "Come aboard An Atlas of Wonders, the SparkPoint Gala,
  as a travel partner". Adds the
  seat map and a "Request early boarding" button above the ticket button.

The order, with each image's link (all on
`https://yoursparkpoint.org/events/sparkpoint-gala` unless noted):

| Block | Images (link) | Version |
| --- | --- | --- |
| Text | The note (see below) | both, worded per version |
| Images | `01-hero` (page), `02-boarding-pass.gif` (page) | both |
| Text | "Picture it: a first-class evening at home in Transylvania County, and a live auction of eight trips around the world. Tap any part of this invitation to explore it on the Gala page." | both |
| Images | `03-departures.gif` (`#routes-title`), `04-passport` (`#passport`), `05-luggage-tags` (`#tags-title`), `06-postcard` (`#return-title`) | both |
| Images | `07-travel-partners` (the Monday sponsor form) | sponsor only, above `08` |
| Images | `08-your-seat` (the ticket link) | both |
| Button | "Request early boarding" (Monday sponsor form) | sponsor only |
| Button | "Get tickets · $100" (the ticket link) | both |

The ticket link is `https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala`
(tickets went on sale 2026-10-19 at $100 per person).

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

- Hero: You're invited: An Atlas of Wonders, the SparkPoint Gala, a live travel
  auction. See the world. Strengthen home.
- Boarding pass: SparkPoint invites you to join us for An Atlas of Wonders,
  the SparkPoint Gala. A first-class boarding pass: Transylvania County to
  Anywhere, Friday, December 11, 2026, boarding at 6 p.m., at Connestee Falls
  Country Club, Brevard, NC.
- Departures: The travel auction: eight departures, one home base. A
  departures board lists An Atlas of Wonders on December 11 and eight trips
  going up for bid with a live auctioneer, destinations revealed soon.
- Passport: Your passport to the auction: 8 travel experiences, 3 years to
  travel, no blackout dates, and you can match the winning bid.
- Luggage tags: Where will yours take you? Five leather luggage tags:
  anniversary, milestone birthday, honeymoon, family vacation, bucket list.
- Postcard: Travel that gives back to our community. A postcard reading
  Greetings from HOME shows a concept rendering of the Transylvania Resilience
  Hub, which a portion of every travel package sold at the Gala helps bring to
  life.
- Your seat: Tickets are on sale. Your seat is waiting: $100 per person at
  Connestee Falls Country Club.
- Travel partners: Travel partners: your brand, cleared for takeoff. A cabin
  seat map with First Class, Business and Main Cabin sponsor seats. Seat map
  opening soon.

Update the venue, board, and closing alt text along with the images.

**Sponsor-direct copy**

- Subject: Come aboard An Atlas of Wonders, the SparkPoint Gala, as a travel partner
- Preview: An Atlas of Wonders, the SparkPoint Gala, December 11: put your brand on board for an
  evening of connection and a live travel auction that gives back to
  Transylvania County.
- Note:

  > Friends,
  >
  > SparkPoint invites you to join us for An Atlas of Wonders, the SparkPoint
  > Gala, on Friday, December 11, at 6 p.m. at Connestee Falls Country Club in
  > Brevard: an evening of connection and a live auction of eight travel
  > experiences, with a portion of every trip coming home to help bring the
  > Transylvania Resilience Hub to life. Tickets are now on sale at $100 per
  > person. We're inviting local businesses to come aboard An Atlas of Wonders
  > as travel partners, through sponsorships and in-kind support for food, drink,
  > and entertainment. Take a look at the evening below, then request early
  > boarding and we'll find the seat that fits you.

The attendee draft uses the subject below and the on-sale note.

## The name

The event is **An Atlas of Wonders**, with SparkPoint as a separate byline,
"the SparkPoint Gala" (set 2026-10-19). Don't join them with a colon and "A".

- In sentences: "Join us for An Atlas of Wonders, the SparkPoint Gala, on
  Friday, December 11…", then just "An Atlas of Wonders". Invite people *for*
  it, not "at" it.
- As a kicker or label: "The SparkPoint Gala · Live travel auction".
- The tagline stays "See the world. Strengthen home."
- The full lockup (globe included) is the title wherever the name appears as a
  heading, never typed or stacked name text. The hero centers the
  dark-background lockup under a small "You're invited · Live travel auction"
  line, with the tagline beneath it; the invitation card uses the
  light-background lockup. Both PNGs live in `assets/` and their byline reads
  THE SPARKPOINT GALA.
- The DEC 11 passport stamp sits on the invitation card's top corner, clear of
  either title.
- The ticket link stays `https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala`
  exactly; it's on printed QR codes.

## Email copy

**Subject lines** (pick one)

- You're invited: An Atlas of Wonders, the SparkPoint Gala
- An Atlas of Wonders: see the world, strengthen home ✈️
- Your seat is waiting: An Atlas of Wonders, December 11

Tickets are on sale (2026-10-19), so use the on-sale copy. The save-the-date
copy is kept below for reference only.

**Preview text**

An Atlas of Wonders, the SparkPoint Gala, December 11 at Connestee Falls:
tickets on sale, $100 per person. An evening of connection and a live travel auction that gives back to
Transylvania County.

**Note above the image**

> Friends,
>
> Join us for An Atlas of Wonders, the SparkPoint Gala, on Friday, December 11,
> at 6 p.m. at Connestee Falls Country Club in Brevard. It's an evening of
> connection and celebration, with a live auction of eight travel experiences,
> and a portion of every trip comes home to help bring the Transylvania
> Resilience Hub to life. Tickets are $100 per person and on sale now. Your
> seat is waiting.

**Button**: Get tickets · $100, linking to
`https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala`

**Alt text for the image**

You're invited to An Atlas of Wonders, the SparkPoint Gala, Friday, December
11, 2026, at 6 p.m. at
Connestee Falls Country Club: an evening of connection and a live auction of
eight travel experiences that gives back to the Transylvania Resilience Hub.
Tickets are on sale now, $100 per person.

**Before tickets went on sale** (no longer used)

- Preview: An evening of connection and a live auction of eight travel
  experiences that give back to Transylvania County.
- Note: Please save the date for the SparkPoint Gala on Friday, December 11, at
  6 p.m. It's an evening of connection and celebration, with a live auction of
  eight travel experiences, and a portion of every trip comes home to help
  bring the Transylvania Resilience Hub to life. Venue and tickets are coming
  soon, and we'd love for you to be there.
- Button: Get gala updates, linking to the Gala page.
