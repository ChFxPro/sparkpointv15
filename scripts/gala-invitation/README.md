# A World of Connections invitation (the SparkPoint Gala)

An email invitation for A World of Connections, the SparkPoint Gala (Friday,
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
  per section (and one per trip), so the Squarespace email can link each one to its part of the
  Gala page. Two are looping GIFs (the plane flies the boarding pass route; the
  departures board's letters flip into place). Their first frame is the finished
  picture, because desktop Outlook shows only that frame. About 0.7 MB in all;
  the command warns if a GIF passes 1 MB or the set passes 2.5 MB.

Both templates share `styles.css` and `trips.js` (the trip cards).

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
- **The eight trips** live in `trips`, copied from the trip kit's
  `trips.json` (`Branding/Gala/WorldOfConnections/trips/`, board decision
  2026-11-09). Keep them in step with it. Each has `board` (what the departures
  board shows: 16 characters max, capitals), `name`, `title`, `nights`,
  `travelers`, `stops` and `summary`, which `trips.js` turns into one card per
  trip.
- **Prices are hidden** (Jeff, 2026-11-10). A trip's `price` shows only when the
  top-level `showPrices` is `true`; it defaults to `false`. `price` is the
  public price, once Jeff sets it. Never copy `trips.json`'s internal
  `listPrice` here: the render stops if a trip has one, and warns whenever
  prices are on.
- **Trip photos**: each card shows the trip's hero still (`01`) from
  `trips/<id>/pack/stills/`, copied into `assets/trips/` at 1600 px, with
  `photoAlt`, `photoPlace`, `photoCredit` and `photoSource` from that folder's
  `stills.json`. Most are CC BY or CC BY-SA, so the card prints the credit on
  the photo, and the email adds a credits text block (below). To swap a photo,
  copy the new file in and update all five fields. South Africa's place is
  left blank on purpose: the still is from Kruger National Park, but the
  trip's camp location isn't confirmed. `photo: null` gives a text-only card.

**Then update the email copy too.** The note, button, and alt text below come in
a "save the date" version and an "on sale" version. Once tickets or the venue
are announced, switch to the on-sale version (and fill in the venue), so the
text around the image doesn't contradict it.

To preview a change without touching the real settings:

```bash
node scripts/gala-invitation/render.mjs --config my-test.json --out /some/folder
```

Keep the details here in step with the Gala page (`src/pages/GalaPage.tsx`,
`src/data/events.ts`), and keep internal notes off both: the package
provider's name (never name AmFund or its staff), internal prices, SparkPoint's
share, and any unconfirmed giveback percentage.

**The trip rules** (Jeff, 2026-11-10; see the trip kit's README):

- **No auction.** No bidding, auctioneer, "winning bid" or "live auction".
  Every trip is sold at a set price, every trip is available to every guest,
  and more than one guest can choose the same trip. Say "Choose your trip at the
  Gala" or "Every trip is available to every guest at a set price".
- **Never mention buying a trip after the Gala.**
- Safe to say: land only (hotels, tours and transfers on the ground; airfare
  not included); for two travelers (Cortona for four); booked with a travel
  specialist; three years to travel. Not yet confirmed, so don't say: how or
  when payment happens, child pricing, private vs group tours, insurance or
  transfers. Don't name the Alaska cruise line.

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
Squarespace emails can't load Josefin Sans, the Gala's typeface, so the live
text uses the closest built-in match. The drafts were first set up with the
**Book Serif** pack; switch Style → Font Pack to the cleanest built-in
**sans** pack (Fraunces is retired), keeping Font Sizes one step up from the
default. Squarespace offers no Josefin, so check it by eye against the images.
- The note: "Friends," as an italic Medium Heading, body in soft ivory
  `#E6DFD2`, side padding 35 px (lines up with the copy inside the images) and
  bottom padding 23 px. A text block takes one color, so the greeting can't be
  brass on its own. With the sans pack, set the greeting upright rather than
  italic: the kit keeps italic for the lockup's small "A" only.
- The "Picture it…" bridge line: centered, upright, in soft brass `#E8D3A4`, to
  echo the hero's "Every journey connects back home."
- Buttons match the kit's Deco button drawn in the images: square corners, pink
  `#E03694`, white capitals. (Squarespace buttons can't take a second border
  colour, so the brass border is left off there.)

The two drafts:

- **Attendees**: "You're invited: A World of Connections, the SparkPoint Gala". No
  sponsor section. Uses the note and preview text under "Email copy" below.
- **Sponsor direct**: "Come aboard A World of Connections, the SparkPoint Gala,
  as a travel partner". Adds the
  seat map and a "Request early boarding" button above the ticket button.

The order, with each image's link (all on
`https://yoursparkpoint.org/events/sparkpoint-gala` unless noted). A
Squarespace Images block holds four images, so the trips run across three:

| Block | Images (link) | Version |
| --- | --- | --- |
| Text | The note (see below) | both, worded per version |
| Images | `01-hero` (page), `02-boarding-pass.gif` (page) | both |
| Text | "Picture it: a first-class evening at home in Transylvania County, and eight trips around the world to choose from. Tap any trip to see it on the Gala page." | both |
| Images | `03-departures.gif` (`#routes-title`), `04-trips` (`#routes-title`), `04-trip-01-greece` (`#trip-greece`), `04-trip-02-iceland` (`#trip-iceland`) | both |
| Images | `04-trip-03-cortona` (`#trip-cortona`), `04-trip-04-scotland` (`#trip-scotland`), `04-trip-05-south-africa` (`#trip-south-africa`), `04-trip-06-portugal` (`#trip-portugal`) | both |
| Images | `04-trip-07-costa-rica` (`#trip-costa-rica`), `04-trip-08-alaska` (`#trip-alaska`) | both |
| Text | The photo credits (below), small, centered, colour `#E6DFD2` | both |
| Images | `05-luggage-tags` (`#tags-title`), `06-postcard` (`#return-title`) | both |
| Images | `07-travel-partners` (the Monday sponsor form) | sponsor only, above `08` |
| Images | `08-your-seat` (the ticket link) | both |
| Button | "Request early boarding" (Monday sponsor form) | sponsor only |
| Button | "Get tickets · $100" (the ticket link) | both |

The `#trip-<id>` anchors are being added to the Gala page by the website work;
until they're live, a link to one simply opens the top of the page. If the
email gets too long, `04-trips-all.jpg` is the whole line-up as one image
(linked to `#routes-title`) in place of `04-trips` and the eight cards.

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
The board (`03`), the trip cards (`04-…`), the boarding pass (`02`) and the
closing (`08`) are the ones the settings change.

**Photo credits text block** (under the trip images; link each licence name to
its deed, below):

> Trip photos via Wikimedia Commons: Greece, Giles Laurent (CC BY-SA 4.0); Iceland, Diego Delso (CC BY-SA 4.0); Cortona, TeKappa (CC BY-SA 4.0); Scotland, john mcsporran from Trossachs, Scotland (CC BY 2.0); South Africa, Chris Eason (CC BY 2.0); Portugal, Krzysztof Golik (CC BY-SA 4.0); Costa Rica, Rhododendrites (CC BY-SA 4.0); Alaska, Jay Galvin (jay galvin) (CC BY 2.0).

Licence deeds:
  - CC BY 2.0: https://creativecommons.org/licenses/by/2.0
  - CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0

**Alt text used**

- Hero: You're invited: A World of Connections, the SparkPoint Gala. Every
  journey connects back home.
- Boarding pass: SparkPoint invites you to join us for A World of Connections,
  the SparkPoint Gala. A first-class boarding pass: Transylvania County to
  Anywhere, Friday, December 11, 2026, boarding at 6 p.m., at Connestee Falls
  Country Club, Brevard, NC.
- Departures: Eight trips, one home base. A departures board lists the
  SparkPoint Gala on December 11, then Greece, Iceland, Cortona, Scotland,
  South Africa, Portugal, Costa Rica and an Alaska cruise, with the nights for
  each.
- Trips heading: Eight connections, one evening. Every trip is available to
  every guest at a set price. Choose yours at the Gala. Land only, for two
  travelers (Cortona for four), with three years to travel.
- Trip 01: Connection 01: Greece & the Greek Islands, 8 nights for two. Three nights in Santorini, three in Mykonos, then two in Athens beneath the Acropolis, linked by an island flight and a ferry. Photo: Blue-domed white churches of Oia above the Santorini caldera and the Aegean Sea.
- Trip 02: Connection 02: Iceland: Land of the Vikings, 6 nights for two. Six nights in Reykjavík with a food tour, the geysers and waterfalls of the Golden Circle, and the Sky Lagoon spa ritual. Photo: Gullfoss waterfall plunging into its canyon with a rainbow in the spray.
- Trip 03: Connection 03: Cortona: Under the Tuscan Sun for four, 6 nights for four. Six nights in a two-bedroom suite in the old town of Cortona, the hilltop village made famous by Under the Tuscan Sun. Photo: The walled hilltop town of Cortona among olive terraces, seen from the air.
- Trip 04: Connection 04: Scotland: Lochs & Legends, 7 nights for two. Edinburgh's castle and Royal Mile, a Loch Ness cruise, then Glasgow and the West Highlands to Glencoe and Loch Lomond. Photo: Golden evening light on the mountains of Glencoe in the Scottish Highlands.
- Trip 05: Connection 05: South Africa: Wild Wonders Photo Safari, 6 nights for two. Five nights in a lakefront tented camp with a private plunge pool, guided game drives every day, and a Big Five drive. Photo: A young male lion resting in the long grass, looking toward the camera.
- Trip 06: Connection 06: Captivating Portugal: Lisbon & Porto, 7 nights for two. Lisbon and Sintra, a private guided drive north to Porto, and a Douro Valley day of wine, lunch and a river cruise. Photo: Traditional rabelo boats on the Douro in front of Porto's Ribeira waterfront at golden hour.
- Trip 07: Connection 07: Colorful Costa Rica, 6 nights for two. Rainforest and volcano around Arenal, then the Pacific beaches of Tamarindo, with two tours of the traveler's choosing. Photo: The cone of Arenal Volcano rising above green rainforest and farmland.
- Trip 08: Connection 08: Alaska Cruise: Explorer of the North, 8 nights for two. A cruise from Seattle in a balcony cabin, calling at Ketchikan, Juneau, Skagway and Victoria, British Columbia. Photo: Mendenhall Glacier flowing between mountains into its lake near Juneau.
- Luggage tags: Where will yours take you? Five leather luggage tags:
  anniversary, milestone birthday, honeymoon, family vacation, bucket list.
- Postcard: Travel that gives back to our community. A postcard reading
  Greetings from HOME shows a concept rendering of the Transylvania Resilience
  Hub, which a portion of every trip helps bring to life.
- Your seat: Tickets are on sale. Your seat is waiting: $100 per person at
  Connestee Falls Country Club.
- Travel partners: Travel partners: your brand, cleared for takeoff. A cabin
  seat map with First Class, Business and Main Cabin sponsor seats. Seat map
  opening soon.

Update the venue, board, trip and closing alt text along with the images.

**Sponsor-direct copy**

- Subject: Come aboard A World of Connections, the SparkPoint Gala, as a travel partner
- Preview: A World of Connections, the SparkPoint Gala, December 11: put your
  brand on board for an evening of connection and eight trips around the world
  that give back to Transylvania County.
- Note:

  > Friends,
  >
  > SparkPoint invites you to join us for A World of Connections, the SparkPoint
  > Gala, on Friday, December 11, at 6 p.m. at Connestee Falls Country Club in
  > Brevard: an evening of connection and celebration, with eight trips around
  > the world to choose from and a portion of every trip coming home to help
  > bring the Transylvania Resilience Hub to life. Tickets are now on sale at
  > $100 per person. We're inviting local businesses to come aboard A World of
  > Connections as travel partners, through sponsorships and in-kind support
  > for food, drink, and entertainment. Take a look at the evening below, then
  > request early boarding and we'll find the seat that fits you.

The attendee draft uses the subject below and the on-sale note.

## The name

The event is **A World of Connections** (plural, the client's wording), the
SparkPoint Gala. It replaced An Atlas of Wonders on 2026-10-28; the brand kit is
`/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/`.

- In sentences: "Join us for A World of Connections, the SparkPoint Gala, on
  Friday, December 11…", then "the Gala". Invite people *for* it, not "at" it.
- Full form, for titles and listings: *A World of Connections: SparkPoint Gala
  & Travel Experience* (was "& Travel Auction" until 2026-11-05).
- As a kicker or label: "The SparkPoint Gala · Eight trips to choose from". The
  lockup's second byline line still reads TRAVEL EXPERIENCE (it matches the
  website's lockup; it was LIVE TRAVEL AUCTION before 2026-11-05).
- The tagline is "Every journey connects back home.", with *connects back
  home.* in Josefin 600 brass.
- The eight trips are numbered as **connections** ("Connection 01 · Greece",
  "Eight connections, one evening."), in `trips.json` order, never atlas
  plates. The departures board lists them by name with their nights. Fraunces and the "Atlas Gala" nickname are
  retired.
- Everything is set in Josefin Sans (`@fontsource-variable/josefin-sans`); only
  the split-flap board letters use a monospace face.
- The full lockup (globe, sunburst and routes included) is the title wherever
  the name appears as a heading, never typed name text. The hero centers the
  dark-background lockup under a small "You're invited" line (the lockup
  already says TRAVEL EXPERIENCE), with the tagline beneath it; the
  invitation card uses the light-background lockup on cream `#f7f1e5`, inside
  the kit's double-hairline frame. Both PNGs live in `assets/`; they're copies
  of `output/gala-print/logo/` from `npm run print:gala -- logo`.
- The DEC 11 passport stamp sits on the invitation card's top corner, clear of
  either title.
- The ticket link stays `https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala`
  exactly; it's on printed QR codes.

## Email copy

**Subject lines** (pick one)

- You're invited: A World of Connections, the SparkPoint Gala
- A World of Connections: every journey connects back home ✈️
- Your seat is waiting: A World of Connections, December 11

Tickets are on sale (2026-10-19), so use the on-sale copy. The save-the-date
copy is kept below for reference only.

**Preview text**

A World of Connections, the SparkPoint Gala, December 11 at Connestee Falls:
tickets on sale, $100 per person. Eight trips around the world to choose from,
each one giving back to Transylvania County.

**Note above the image**

> Friends,
>
> Join us for A World of Connections, the SparkPoint Gala, on Friday, December
> 11, at 6 p.m. at Connestee Falls Country Club in Brevard. It's an evening of
> connection and celebration, with eight trips around the world to choose from:
> Greece, Iceland, Cortona, Scotland, South Africa, Portugal, Costa Rica, and an
> Alaska cruise. Every trip is available to every guest at a set price, and a
> portion of every trip comes home to help bring the Transylvania Resilience
> Hub to life. Tickets are $100 per person and on sale now. Your seat is
> waiting.

**Button**: Get tickets · $100, linking to
`https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala`

**Alt text for the image**

You're invited to A World of Connections, the SparkPoint Gala, Friday, December
11, 2026, at 6 p.m. at Connestee Falls Country Club: an evening of connection
with eight trips around the world to choose from (Greece, Iceland, Cortona,
Scotland, South Africa, Portugal, Costa Rica and an Alaska cruise), each one
available to every guest at a set price, giving back to the Transylvania
Resilience Hub. Tickets are on sale now, $100 per person.
