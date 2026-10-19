# The BackPorch: spec

Status (2026-10-16): built and parked, **not live**. Owner wants more tweaks and testing,
and to launch it together with the homepage redesign rather than on its own.

## Pick up here

**See it locally (no database needed):**

```bash
npm run dev:samples
```

Then open:
- `localhost:3000/backporch` and `/backporch/morning-on-the-porch` (public pages, six sample posts)
- `localhost:3000/internal/backporch/demo` (the editor, no sign-in, nothing saved)
- `localhost:3000/internal/lab/demo` (the Porch Lab bench)

Plain `npm run dev` bakes from the live database instead, which has no posts yet, so the
BackPorch shows empty and the homepage band hides. Sample posts live in
`scripts/backporch/sample-posts.json` (local only; the build refuses them in CI).

**Where the work is:**
- BackPorch: branch `claude/optimistic-kowalevski-aff5c0`.
- Homepage redesign: branch `claude/homepage-design-review-198983`. The BackPorch band
  is meant to sit directly under the new hero; the two branches still need combining
  (they both change `HomePage.tsx`, `AGENTS.md`, `WORKLIST.md`, `package.json`).

**To launch, in order:**
1. Combine the homepage and BackPorch branches on one branch, catch up with `main`, and
   place `BackPorchBand` under the new hero.
2. ~~Apply the migrations~~ (done 2026-10-16: `create_backporch`, `backporch_tighten_grants`).
   Add the editors' emails to `porch_editors` (Jeff, Maggie Grimm; Maggie needs a Supabase
   login), and raise the project-wide Storage upload limit to 150 MB in the Dashboard.
3. Test for real with sign-in: uploads (photo, clip, audio, PDF), link previews, a poll
   vote, reactions, pin and take-down, the Facebook kit downloads.
4. Open the pull request, check the build, merge.
5. Deploy the two edge functions from the canonical checkout on `main` with
   `scripts/deploy-function.sh porch-unfurl` and `... backporch-publish` (the latter
   needs the `GITHUB_DEPLOY_TOKEN` secret first).
6. One Facebook test post (PORCH-008), then promote Porch Lab tools as they prove out.

Open: retention of old posts (owner deferred).

## Why

Meta now limits SparkPoint's Facebook page to external links in **2 posts per
month** unless we pay for Meta One. We won't pay to give Meta our own content.
But Facebook is where most of our audience is: 71% of rural U.S. adults use it,
second only to YouTube (Pew Research Center, *Social Media Fact Sheet*,
Nov. 20, 2025; national rural figures, not Transylvania County-specific).

So we can't leave Facebook, and we can't depend on it for links. The answer is
the IndieWeb practice called **POSSE: Publish on your Own Site, Syndicate
Elsewhere.** Every update lives first on yoursparkpoint.org. Facebook gets a
native copy (photo and text, no link card) that points people home with a short
address they can type, a QR code, or a link in the comments.

One name, one place: **The BackPorch**, hosted by SparkPoint.

- At launch it holds SparkPoint's own news, gatherings, and asks, in our voice.
  Staff post here. It's where Facebook posts point people.
- Later, partner organizations (**neighbors**) post to the same porch, credited
  with their logos; SparkPoint approves. Same page, same address, filterable to
  "From SparkPoint" or "From the neighbors".
- Last, neighbors put a small **porch** on their own websites: recent posts plus
  previous/next links to the next neighbor over (a modern webring).

The name is the brand anchor: it reads as SparkPoint's porch, informal and
open rather than institutional, and it gives the design room to play (porch
light, chairs, "pull up a chair", "neighbors"). It is written as one word,
**BackPorch**. Addresses are lowercase: `/backporch`, with `/back-porch`
redirecting there for anyone who types it with a hyphen.

| | |
| --- | --- |
| Address | `/backporch`, posts at `/backporch/<slug>` |
| Short addresses | `/p/<slug>` |
| Feeds | `/backporch/feed.xml`, `/backporch/feed.json` (filterable by `?from=sparkpoint` in phase 2) |
| Neighbors | Phase 2 |
| Porches on neighbors' sites | Phase 3 |

## Goals

- One place for every SparkPoint update, owned by us, free to use.
- Posting takes a couple of minutes, from a form, with no code and no deploy.
- Every post has a short, sayable address (`yoursparkpoint.org/p/gala`) that
  works on a flyer, out loud, in a QR code, or typed into a Facebook post.
- Facebook posting gets easier, not harder: one click produces the post text and
  a share image with the short address and a QR code on it.
- Open formats (RSS, JSON Feed) so partners, newsletters, and feed readers can
  pull posts without asking us.
- A path to partners posting and to a network of member sites, without becoming
  another social network.

## Non-goals

- Not a social network: no public accounts, comments, likes, follows, or DMs.
- Not an aggregator of the internet: only SparkPoint and approved local partners.
- No tracking pixels or third-party analytics added for this.
- No paid platform features anywhere.

## Phases

| Phase | What | Who posts |
| --- | --- | --- |
| 1. SparkPoint's porch | The BackPorch page, post pages, homepage band, short addresses, RSS/JSON, Facebook kit | SparkPoint staff |
| 2. Neighbors join | Partner posts on the same page, with source filters; partner submissions into an approval queue; automatic pulls from partners' existing RSS | Staff, plus approved partners |
| 3. Porches on neighbors' sites | Embeddable widget and previous/next ring links for neighbors' sites; local, then regional, then statewide | Members |

Phase 1 is the only one specified in build detail below. Phases 2 and 3 are
sketched so phase 1's choices don't block them.

---

## Phase 1: SparkPoint's porch

### What visitors see

**`/backporch`, the feed page**
- Title: "The BackPorch". One line: news, gatherings, and asks from SparkPoint. Pull up a chair.
- Pinned posts first (up to three, most recently pinned first), then everything else newest first.
- Each post shows: organization logo and name, date, title, a short summary,
  an optional photo, and, for gatherings, a date chip.
- Simple filter by kind: All, News, Gatherings, Asks, Stories.
- Links: RSS, JSON Feed, and "Get updates by email" (the existing newsletter).
- Phase 2 adds "From SparkPoint" / "From the neighbors" filters.

**`/backporch/<slug>`, one post**
- The full post: title, photo, body (short, plain formatting), and an optional
  "Learn more" button to an outside link.
- Real link-preview tags (title, summary, image), so the address unfurls
  properly wherever it's shared.

**`/p/<slug>`, the short address**
- Redirects to the post's page (`/backporch/<slug>`). Built the same way as `/pcr_collab` today: a
  static page that link-preview crawlers and QR scanners handle cleanly.

**Homepage band**
- "On the BackPorch", directly under the hero, and the homepage's only featured slot (the spotlight was folded into it on 2026-10-19): the pinned posts
  large, plus the three or four latest as compact items, and a link to the
  BackPorch.
- Phase 2 adds a slim "From the neighbors" row beneath it: the latest partner
  posts, each with its organization's logo (from `src/assets/partner-logos/`).
- **Design bar: it must feel like part of the page, not a widget bolted on.**
  The owner's requirement is "not annoying or jarring", so:
  - Nothing moves on its own: no carousel, ticker, auto-rotation, or
    "NEW" badges. The homepage's motion lives in the hero; this band is the
    calm beat after it.
  - No layout shift: the band is baked into the prerendered page, and the
    live refresh only swaps in newer posts within the same reserved space.
    If there are no posts, the band doesn't render (no empty state).
  - Built from the homepage's own system (type, colours, radii, buttons), so
    it reads as the next section, not an embed. The pinned post leads; the
    others are quieter.
  - The handoff from the hero is designed, not just stacked: spacing,
    background, and where the eye lands next are part of the work.
  - One gentle entrance at most (the same fade-up the page already uses),
    off under reduced motion.
  - Reviewed at phone, tablet, and desktop widths before it ships.
- It slots into whichever homepage ships. The homepage redesign is currently
  uncommitted in another worktree (`homepage-design-review-198983`).

### Posts

One Supabase table, `porch_posts`:

| Field | Notes |
| --- | --- |
| `id` | uuid |
| `slug` | unique, URL-safe, e.g. `gala`; becomes `/backporch/gala` and `/p/gala` |
| `title` | up to ~90 characters |
| `summary` | up to 280 characters; shown in lists and link previews |
| `body` | up to ~2,000 characters, light formatting (paragraphs, links, lists) |
| `kind` | `news` · `gathering` · `ask` · `story` |
| `org` | partner slug from `partners.ts`; `sparkpoint` for SparkPoint's own posts |
| `image_path` | optional, in a new public-read Storage bucket `porch-media` |
| `image_alt` | required when there's an image |
| `link_url`, `link_label` | optional outbound link ("Learn more") |
| `event_start`, `event_end` | for gatherings; drives the date chip |
| `pinned` | up to three pinned posts at a time; pinning a fourth unpins the one pinned longest ago (enforced in the database) |
| `pinned_at` | when it was pinned, set by the trigger; the most recent pin leads |
| `status` | `draft` · `published` · `archived` |
| `published_at`, `expires_at` | scheduling; expired posts drop off the feed but keep their page |
| `created_by`, `updated_at` | audit |

Security (Row Level Security):
- The public read key can read only rows where `status = 'published'`,
  `published_at <= now()`, and not expired.
- Only signed-in staff (the existing `/internal` Supabase Auth) can create,
  edit, pin, or archive.
- Storage bucket: public read; writes only by signed-in staff; images only,
  size-capped (the same approach as the `convening-photos` bucket).

### Posting: `/internal/backporch`

Behind the existing staff sign-in, alongside the reports portal.
- List of posts with status, pin, and quick actions.
- Editor: title, summary (with a live character count), body, kind, photo
  upload with required alt text, optional link, optional event dates, schedule
  and expiry, slug (suggested from the title, editable).
- Live preview of the feed card and the post page.
- **Publish**, then the Facebook kit (below).

### Getting new posts onto the static site

The site is static (GitHub Pages, prerendered at build). Two paths, both needed:
1. **Live:** the feed page, post pages, and homepage band also load published
   posts from Supabase in the browser, so a new post is visible immediately.
2. **Baked:** each build fetches published posts and prerenders their pages,
   the `/p/` short addresses, the RSS and JSON feeds, and sitemap entries.
   Baked pages are what give link previews and search engines real content.

To keep baking prompt:
- A **"Publish to site"** button calls a small Supabase edge function that
  triggers the existing deploy workflow (`workflow_dispatch`) using a
  fine-grained GitHub token held as a Supabase secret. A post is baked within a
  few minutes.
- A **scheduled rebuild** (hourly or nightly cron added to `deploy.yml`) as a
  backstop, which also picks up scheduled and expired posts.

The edge function ships like the others: source in `supabase/functions/`,
reviewed in a PR, deployed with `scripts/deploy-function.sh` (see
`supabase/functions/README.md`). Never an inline MCP deploy.

### Open feeds

- `/backporch/feed.xml` (RSS 2.0) and `/backporch/feed.json` (JSON Feed 1.1),
  generated at build, newest 50 posts. Phase 2 adds a `?from=` filter.
- Linked from `/backporch` and advertised in the page head so feed readers find
  them.
- These are the foundation for phase 3 and let partners and newsletters pull
  posts with no integration work.

### The Facebook kit (syndication)

After publishing, the editor offers:
- **Post text** ready to paste: title, two or three sentences, and the short
  address in plain text (`yoursparkpoint.org/p/gala`), with a copy button.
- **A share image**, made in the browser (no outside service): the post's
  photo, title, SparkPoint branding, the short address, and a QR code, sized
  for a Facebook feed post. Download button.
- No tracking parameters or counters: the site's privacy policy promises no
  analytics, pixels, or tracking cookies (`src/pages/PrivacyPage.tsx`), and the
  BackPorch keeps that promise. Facebook's own page insights still show how a
  post performs there.

**One-time test before relying on it:** check with Meta whether (a) a bare,
typed `yoursparkpoint.org/p/gala` in post text, or (b) a link in the first
comment, counts against the 2-link limit. The image's short address and QR code
work regardless.

### Accessibility and quality bar

- Alt text required for every image; the share image's text is repeated in the
  post text.
- Feed and post pages meet WCAG 2.2 AA; no auto-rotating content.
- Dates in Eastern time, written out ("Thursday, October 1"), not just numbers.
- Works with JavaScript off for baked posts.

### Out of scope for phase 1

Partner posting, comments or reactions, email sending (keep the existing
newsletter; link to it), push notifications, and any FB API integration
(Meta's Graph API needs app review and is not worth the dependency).

---

## Phase 2: partners join (sketch)

- **Partner submissions:** a form (like `/intake`) where a partner proposes a
  post; it lands as `status = 'pending'` with `org` set, and staff approve,
  edit, or decline it in the same editor.
- **Partner accounts (later):** Supabase Auth users tied to one `org`, able to
  draft for their organization only; staff still approve. RLS enforces the org.
- **Automatic pulls:** add an optional `feedUrl` to partners in `partners.ts`.
  A scheduled job reads those RSS feeds (most WordPress, Squarespace, and Wix
  sites have one) and creates pending posts with the partner's logo; trusted
  partners can be set to auto-approve.
- **Content policy:** local, public-benefit, non-commercial-promotional,
  non-partisan; staff can archive anything. Written before phase 2 opens.
- **Neighbors with no feed of their own (owner, 2026-10-15).** The first three
  (The Hunger Coalition, FWRD, Pisgah Health Foundation) likely have none. Make
  both routes easy, and help neighbors get a feed rather than requiring one:
  - *Post through the porch.* A short submission form (or, later, their own
    login). Every neighbor's porch posts also publish as **their own feed**,
    e.g. `/backporch/from/<org>/feed.xml` plus `.json`, so posting on the
    porch gives an organization a working news feed even if its website has
    none. They can point a newsletter tool at it, or embed it (phase 3).
  - *Turn on the feed they already have.* A one-page guide for the platforms
    local sites run on (WordPress, Squarespace blogs, Wix blogs, Google Sites
    has none), showing where the feed address is and how to test it. Most
    nonprofit sites have a feed they've never noticed.
  - *Check it for them.* A "paste your website" helper that looks for a feed
    (`<link rel="alternate">`, `/feed`, `/blog?format=rss`) and reports what it
    found, so nobody has to know what RSS is.

## Phase 3: porches on neighbors' sites (sketch)

A modern webring, built on the phase 1 feeds:
- **Embed:** one line a member pastes into its own site:
  `<script src="https://yoursparkpoint.org/backporch/embed.js" data-member="habitat-for-humanity-transylvania-county"></script>`.
  It shows the latest network posts in a small, self-contained panel (styles
  isolated so it can't break their site) with the member's own posts first.
- **Ring links:** the panel includes "previous member / next member" links and a
  "All the neighbors" link to a neighbor directory, the classic webring
  move, so visitors travel between local organizations' own sites.
- **Membership:** opt-in, tracked in `partners.ts` (a `member` flag) and shown
  on `/directory`; grows from Transylvania County to the region, then statewide.
- **Open by default:** the network feed is itself RSS/JSON, so anyone can build
  on it.

## Phase 1 as built (2026-10-15)

| Piece | Where |
| --- | --- |
| Table, editor allowlist, RLS, image bucket | `supabase/migrations/20261015_backporch.sql` (**not applied yet**, see below) |
| Shared types, dates, image URLs, live fetch | `src/lib/backporch.ts`, `src/hooks/usePorchPosts.ts` |
| Build-time bake + RSS/JSON feeds | `scripts/backporch/bake.mjs` (`npm run backporch:bake`, runs in predev/prebuild) |
| Homepage band "On the BackPorch" | `src/components/backporch/BackPorchBand.tsx`, directly under the hero |
| `/backporch`, `/backporch/<slug>` | `src/pages/backporch/BackPorchPage.tsx`, `BackPorchPostPage.tsx` |
| `/p/<slug>`, `/back-porch` | client redirects in `src/App.tsx`; static stubs with preview tags in `scripts/prerender.mjs` |
| Editor + Facebook kit | `src/pages/backporch/InternalBackPorchPage.tsx`, `FacebookKit.tsx`, `porchImages.ts` |
| "Update the site now" | `supabase/functions/backporch-publish/` (**not deployed yet**) |
| Backstop rebuild | `schedule` in `.github/workflows/deploy.yml`, every two hours |

Choices made while building:
- **Look (owner, 2026-10-15):** more immersive, with some influence from the
  simulator but not a copy. Warm paper, faint contour lines, the simulator's
  porch-at-dusk plate with its lantern glow, and trail blazes marking each kind
  of post (always with the word beside the mark). The `/backporch` page's blazes
  double as filters ("Follow the blazes").
- **The view from the porch (owner, 2026-10-15):** an AI-generated cinematic
  image, friends at sunset over layered ridges, opens the BackPorch page (wide,
  square, and tall crops by screen) and tops the homepage band. Labelled
  "Illustrative image" so it's never mistaken for a real SparkPoint gathering.
  Swap in larger exports at the same file names when available.
- **Night, not cream (owner, 2026-10-15):** the view's light sinks into a deep
  ridge-dusk colour sampled from the image, and the BackPorch page and homepage
  band are dark ("evening on the porch"). Post pages stay light for reading.
- **Editors are an allowlist, not "anyone signed in".** This Supabase project's
  Auth is shared with other tools, so writes require the signed-in email to be
  in `porch_editors`. Add Jeff and Maggie there (Dashboard → Table editor), and
  give Maggie an Auth account if she doesn't have one.
- **Text is plain on purpose.** Body text is paragraphs and bare `https://`
  links only, so nothing pasted in can break the page or inject markup.
- **Photos are resized in the browser** to 480/960/1600 px before upload
  (WebP, or JPEG on Safari), so a phone photo never ships at 6 MB.
- **The share image is 1080×1350** (4:5, the tallest Facebook shows
  uncropped), with the short address and a QR code to `https://yoursparkpoint.org/p/<slug>`.
- **Short addresses lock once a post is published**, so shared links never break.
- **Safe before the migration:** with no table, the build bakes zero posts, the
  homepage band stays hidden, and `/backporch` says "Nothing on the porch yet."
- **A failed fetch in CI fails the deploy** instead of shipping an empty porch
  (and 404ing every `/p/` address). Locally it warns and carries on.

To go live, in order:
1. Apply the migration (Supabase Dashboard SQL editor, or approve the MCP
   `apply_migration` call) and add both editors to `porch_editors`.
2. Merge the PR. The site works without step 3; posts show up right away and
   link previews catch up within two hours.
3. Optional, for instant previews: create a fine-grained GitHub token (this repo
   only, "Actions: read and write"), save it as the Supabase secret
   `GITHUB_DEPLOY_TOKEN`, then deploy with `scripts/deploy-function.sh backporch-publish`
   from the canonical checkout on `main`.
4. PORCH-008: post one test to Facebook as a photo post with the typed short
   address, and confirm it doesn't count against the link limit.

## Multimedia and experiments (built 2026-10-15)

The body of a post is an ordered list of **blocks**, so posts can mix media freely:
text, photo, gallery, video clip, YouTube/Vimeo, audio, quote, link, place, PDF,
and experiment. Owner direction: flexible enough for creative experiments, easy to
post, easy to share; uploaded video capped at one minute.

- **Posting:** drop files onto the composer and the right blocks appear (several
  photos become a gallery); paste a YouTube or Vimeo link into a Link block and it
  becomes a video block. Starters: Event, Ask, Photo story, Voice note. Reorder by
  dragging or with the arrow buttons. Unsaved changes are kept in the browser.
  The first photo is the cover unless another is chosen.
- **Media:** photos are resized in the browser (480/960/1600); clips up to a minute
  and 150 MB (a poster frame is grabbed automatically); audio up to 40 MB; PDFs up
  to 20 MB. Longer video belongs on YouTube or Vimeo.
- **Privacy:** YouTube/Vimeo show a plain play card; nothing loads from them until
  someone presses play, and then only the no-cookie / do-not-track players.
- **Safety:** blocks are data, never HTML. `normalizeBlocks()` keeps only known
  types with well-formed fields (https links, bucket paths, embed ids) before
  anything renders, on the site and in the feeds.
- **Experiments:** coded posts live in the repo at `src/experiments/backporch/<id>/`
  (`meta.ts` + `index.tsx`), started with `npm run porch:experiment <id>`, shipped
  through a pull request, each loaded only on its own post. A post shows one with an
  Experiment block. In feeds, an experiment becomes a link to the post. Sample:
  **Porch Light** (drag the evening from late afternoon to nightfall).
- **Sharing:** every post keeps its short address, preview tags, feed entry, and
  Facebook kit; the kit adds square 1080 px photos for a multi-photo post and the
  clip file to upload natively.

## The Porch Lab (built 2026-10-15)

Owner direction: a suite of extra tools for experimental posts (animated, interactive,
frame-breaking), a place to test features that could be released once they're right.
Field-test tools may appear publicly with a tag.

- **Tools** (blocks set up in the editor, no code): animated text (types itself, or
  words light up on scroll), living backdrop (sunrise, fireflies, drifting ridges),
  count-up numbers, before & after slider, scrolly story, timeline, quick poll; and
  porch reactions on the post itself.
- **Breaking the frame:** blocks can be column, wide, or edge-to-edge; a post can be a
  *takeover* whose first backdrop or photo fills the screen under the title, with a
  mood (dusk, sunrise, forest, plum) that recolours the page; in the feed a takeover
  breaks out of the list full width.
- **Stages** (`src/lib/porchLab.ts`): Lab (previews and the bench only), Field test
  (public, tagged), Released. Starting stages: polls and reactions are Lab until the
  database is live and their spam limits are tested; everything else is Field test.
- **Release checklist:** phone, keyboard and screen reader, no unpausable motion and
  respects reduced motion, no tracking, sensible RSS/Facebook fallback, tried on two
  published posts.
- **Bench:** `/internal/lab` shows every tool on sample content with its notes.
- **Polls and reactions:** anonymous, one per browser via a random token, written only
  through checked database functions with a soft rate limit. Informal, not surveys.

## Link previews (built 2026-10-16)

Owner request: when a link is attached, its image and snippet should appear. Pasting
a link into a Link block now fetches the page's own preview (title, description,
site, image) and shows it as a card, with Remove image / Refresh / Plain link
options. The fetch runs on the `porch-unfurl` edge function (browsers can't read
other sites' pages); the image is resized and stored in our bucket, so readers'
browsers never contact the linked site. Needs `porch-unfurl` deployed; until then
the link still works as a plain card. The local demo uses a dev-server stand-in.

## Decisions (owner, 2026-10-15)

1. **Name:** The BackPorch, one word. Partners are "neighbors".
2. **Short addresses:** `yoursparkpoint.org/p/<slug>`. No separate short domain.
3. **Posting access in phase 1:** Jeff Bannister and Maggie Grimm. Each gets a
   Supabase Auth account created in the Dashboard (no self-serve signup), the
   same way `/internal/reports` access is granted.
4. **Homepage placement:** directly under the hero, held to the design bar in
   "Homepage band" above.
5. **First neighbors for phase 2:** The Hunger Coalition, FWRD Transylvania,
   and Pisgah Health Foundation.

## Still open

- **Retention:** do expired posts stay reachable forever, or archive after a
  year? Deferred by the owner; revisit before phase 1 ships. Until then,
  expired posts drop off the feed and keep their pages (the default above).
- For each first neighbor: do they have a site feed we can pull (The Hunger
  Coalition's site is `hungerfreetc.org`; FWRD's is `gofwrd.org`), or will they
  submit through the form?

## Proposed worklist items

| ID | Work |
| --- | --- |
| PORCH-001 | `porch_posts` table, RLS, `porch-media` bucket (migrations) |
| PORCH-002 | `/internal/backporch` editor with preview, scheduling, pinning |
| PORCH-003 | `/backporch` feed page and `/backporch/<slug>` post pages (live + baked) |
| PORCH-004 | `/p/<slug>` short addresses, RSS/JSON feeds, sitemap entries at build |
| PORCH-005 | Homepage "On the BackPorch" band |
| PORCH-006 | Facebook kit: post text and share image with short address and QR |
| PORCH-007 | Publish-to-site edge function + scheduled rebuild |
| PORCH-008 | One-time Meta link-limit test; record the result here |

Rough sizing: phase 1 is about one focused build cycle (PORCH-001 to 007);
the editor and the Facebook kit are the largest pieces.
