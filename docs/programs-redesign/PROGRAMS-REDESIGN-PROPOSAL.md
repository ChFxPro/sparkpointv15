# SparkPoint Programs Redesign — Confirmed Plan

**Status:** Confirmed — decisions locked 2026-04-16 (see §8)
**Author:** Claude (pair-driving with Jeff)
**Date:** 2026-04-16
**Scope:** `/programs` page + per-program destinations, using `/programs/purpose-workshops` as the template

---

## 1. The problem, in one paragraph

The `/programs` page today works structurally — it has a hero, a "Featured Programs" section (currently Purpose only), a three-pathway "ecosystem" block with cards, a searchable "All Programs" grid, and a `PathwayModal` that opens on click. But it reads flat. Every program looks like every other program. The only program that has its own voice, its own palette, and its own room to breathe is Purpose Workshops, which Codex recently pulled in as a dedicated `/programs/purpose-workshops` route at `src/pages/programs/purpose-workshop/`. We want to keep going in that direction: give each program a real window that feels like itself, make the Programs page feel like an exploration rather than a directory, and let tone shift between soft/individual-driven (Purpose) and corporate/structured (Leadership) without breaking the SparkPoint master brand.

---

## 2. What exists today

### 2.1 Program inventory (from `src/pages/programs/programsData.ts`)

20 programs across 3 pathways. Recently updated on 2026-04-13. Unless you have a separate breakout list I haven't found, **I'm treating `programsData.ts` as the source of truth.** If there's another document, drop it in and I'll reconcile.

**Listen (4)** — community insight infrastructure, pathway color `#9E509F` (plum)
- Echoes from the Community
- Story Collection Projects
- Story Lab Studios (Media Navigator Mentorships)
- Thrive @ 5

**Learn (11)** — relational capacity building, pathway color `#FDB515` (gold)
- Social Health 101: The Science of Connection
- Integrative Well-Being: Food, Mood & Movement
- Brain, Stress & Resilience
- Positive Culture & Belonging
- Learn & Connect Nights
- SupportEd: Connected Classrooms & Educator Well-Being
- Purpose Workshops ← only program with a dedicated landing page today
- Leadership Well-Being
- Emotional Intelligence for Connective Leadership
- Workplace Well-Being & Positive Culture
- Connected Leadership & Culture

**Lead (5)** — cross-sector coordination, pathway color `#E03694` (rose)
- Wellness Rooted in Connection Collaborative (TRCN)
- Education Coalition / Connected Communities Roundtable
- Nonprofit Partner Network & Convening Space
- Voice of the Students (VOS) & Youth Leadership
- Ready Together: Community Preparedness & Resilience

### 2.2 File map — what's where now

```
src/pages/programs/
├── ProgramsPage.tsx              — route /programs, orchestrates sections + modal
├── ProgramsHero.tsx              — animated hero with parallax + summary stats
├── ProgramPagesSection.tsx       — "Featured Programs" (only shows programs with detailPageHref)
├── EcosystemSection.tsx          — Listen / Learn / Lead pathway cards, 3 preview programs each
├── AllProgramsSection.tsx        — searchable grid, grouped by pathway
├── PathwayModal.tsx              — in-place overlay for quick program detail
├── programsData.ts               — types + 20 programs + pathways export
├── programs.css                  — shared programs-page styles (sp-prog-*)
├── purposeWorkshops.css          — legacy purpose-specific CSS (to be retired)
├── PurposeWorkshopsPage.tsx      — route wrapper for /programs/purpose-workshops
└── purpose-workshop/
    ├── PurposeWorkshopLanding.tsx   — 655-line inlined landing (7 sections)
    ├── purposeWorkshopData.ts       — data object
    └── purposeWorkshopShared.css    — scoped styles using .pw-shared wrapper
```

### 2.3 Purpose standalone vs integrated — parity check

| Section | Standalone `purpose_workshop/` | Integrated `PurposeWorkshopLanding.tsx` |
|---|---|---|
| HeroSection | ✅ 128 lines | ✅ inlined |
| WhatIsSection | ✅ | ✅ inlined |
| ExperienceSection | ✅ | ✅ inlined |
| ConnectionSection | ✅ | ✅ inlined |
| GallerySection | ✅ | ✅ inlined |
| AudienceSection | ✅ | ✅ inlined |
| FinalCTASection | ✅ | ✅ inlined |
| SiteFooter | ✅ standalone | ❌ not needed — main site Footer takes over |
| SlideshowPage / SocialStoryPage | ✅ standalone social pages | ❌ correctly omitted — canonical URL is `/programs/purpose-workshops` |

**Parity is effectively 1:1 for the landing page.** Codex collapsed 7 section files into one 655-line file and scoped styles under `.pw-shared`. Data shape preserved. The standalone's `SiteFooter`, `SlideshowPage`, and `SocialStoryPage` are intentionally not ported — the main `Footer` from `src/components/Footer.tsx` handles the footer now, and the social share pages are promo-specific.

Recommendation: **split the 655-line file back into section components** living in `purpose-workshop/sections/` so future programs can pattern-match. Details in §5.1.

---

## 3. Design direction — the "immersive card gallery"

What you picked. Here's the spec, broken out by what the user sees and what we build.

### 3.1 What the user sees

**Hero** (keep and tighten). Drop the summary-stats block — `Pathways | Programs | Featured pages` tells a data story, not a program story. Replace with a single sentence that names the invitation ("Pick a pathway. Step inside a program. See what it feels like from the inside.") and a quiet scroll cue. Parallax stays.

**Pathway filter bar** (new). Three chips — Listen / Learn / Lead — plus "All." Sticky under the header once the hero scrolls past. Clicking a chip filters the gallery below. Each chip carries its pathway color. Second row of chips, quieter: format (Workshop / Series / Cohort / Event / Ongoing) and offering type (Community / Partner / Fee-based). These already exist as data.

**Program gallery** (the centerpiece). A grid of "program windows." Each card:

- ~ 420px tall on desktop, auto-sized on mobile; 3 cols at `lg`, 2 at `md`, 1 at `sm`.
- Top ~60% is a program-specific image (all programs need at least one hero image; see §6 on asset gaps).
- Bottom ~40% is a darkened tinted panel using the pathway color at low opacity.
- Pathway dot + label top-left. Format/offering badges top-right.
- Title in the voice of the program (not generic). Hover reveals a one-line "voice sample" — the program's own opening line.
- Two buttons at the bottom: **Quick Peek** (opens the existing `PathwayModal` repurposed for in-place preview) and **Enter Program** (navigates to the program's dedicated page — or, for non-flagships, to a detail template route with per-program accent + tone).
- Motion: cards lift ~4px on hover, image zooms ~2%, the tinted panel lightens ~8%. One-second stagger on mount via `framer-motion` `staggerChildren`. Respect `useReducedMotion`.

**Pathway deep-dives** (replaces the existing `EcosystemSection`). Below the gallery, three wide bands — one per pathway — that act as interstitials. Each band uses that pathway's full color as a background gradient, carries the pathway description, and offers a "See all Listen programs" CTA that scrolls/filters the gallery. The point is to give Listen / Learn / Lead identity without repeating the same cards.

**Closing CTA** (keep the current one). "Ready to Build With Us?" → Talk With Us + Get Involved.

### 3.2 What "Quick Peek" vs "Enter Program" means

- **Quick Peek** → opens the existing `PathwayModal`, pre-focused on that program. Low-friction, stays on `/programs`. This is the upgrade path for programs that don't yet have a full landing page — they still get a rich, focused preview. URL updates to `?program=slug` (already wired up in `ProgramsPage.tsx`, lines 24–44).
- **Enter Program** → full navigation to `/programs/<slug>`:
  - Flagship programs → full dedicated landing page (Purpose pattern).
  - Non-flagship programs → shared "program detail template" route rendered with per-program data + accent color + tone tokens. Feels distinct without us building 20 from scratch.

### 3.3 Why a card gallery beats the other three options

- **Scrollytelling explorer** — gorgeous but expensive to build for 20 programs and brutal on mobile.
- **Ecosystem diagram** — memorable but users have to learn a new navigation metaphor to reach content they could've found in a list. Bad tradeoff on a page that is, functionally, a directory.
- **Upgrade existing modal pattern** — safest but still reads flat. User's "far from optimized" critique targets exactly this.

The card gallery gives every program a window, scales linearly with the program list, and still lets the most deserving programs (Purpose, Leadership) punch through with a full landing page.

---

## 4. Per-program voice & style — tiered

Agreed: **tiered.** Flagships get full landing pages with their own voice and micro-brand. Everyone else shares a template that still respects a per-program accent color and tone hint.

### 4.1 Proposed flagship tier

| Program | Tier | Reason |
|---|---|---|
| Purpose Workshops | Flagship — live | Already built, tone is soft/individual |
| Leadership Well-Being | Flagship — build next | Complement to Purpose, corporate-facing voice |
| Ready Together: Community Preparedness & Resilience | Flagship | High-stakes topic, deserves its own room |
| Wellness Rooted in Connection Collaborative (TRCN) | Flagship | Partner-facing, coalition-level |
| Voice of the Students (VOS) & Youth Leadership | Flagship | Young audience, distinct voice |

Other programs → shared `ProgramDetailPage` template (§5.2). Full pages for those can be promoted later without refactoring.

**Confirmed 2026-04-16:** flagship list locked as proposed.

### 4.2 Voice + style tokens per program

Add to each `Program` in `programsData.ts`:

```ts
export interface ProgramBrand {
  /** Pathway-relative accent color, defaults to pathway.color if omitted */
  accent?: string;
  /** Secondary color for gradients, panels, hover states */
  accentSoft?: string;
  /** 'soft' | 'corporate' | 'coalition' | 'youth' | 'grounded' */
  voice: ProgramVoice;
  /** One-liner that opens the card's voice sample on hover */
  voiceSample: string;
  /** Palette hint for sections — 'warm' (cream/rose), 'neutral' (slate), 'cool' (plum) */
  palette: 'warm' | 'neutral' | 'cool';
  /** Optional typographic tone — 'balanced' (Purpose), 'structured' (Leadership), default 'balanced' */
  typographicTone?: 'balanced' | 'structured' | 'energetic';
}

export interface Program {
  // ...existing fields
  brand: ProgramBrand;
}
```

Default values fall back to pathway color if `accent` is omitted, so the data migration is non-breaking. Flagships set all fields; non-flagships set only what they want to override.

### 4.3 Voice examples (to anchor the copy work)

| Voice | Tone | Example opener |
|---|---|---|
| `soft` (Purpose) | individual, reflective, first-person | "We're more connected than ever. And still searching for what matters." |
| `corporate` (Leadership) | confident, outcome-focused, second-person | "Strong leadership starts with well-regulated attention. We teach both." |
| `coalition` (TRCN, Education Coalition) | plural, cross-sector, formal-but-warm | "When organizations listen together, the community hears itself." |
| `youth` (VOS) | direct, energetic, spoken-register | "Your voice is already data. Here's what we do with it." |
| `grounded` (Ready Together) | calm, practical, operational | "Ready isn't a feeling. It's a set of small, specific habits." |

These become part of each flagship's landing copy and also feed the card's `voiceSample`. Can be refined with the brand-voice-enforcement skill once the skeleton lands.

### 4.4 CSS tokens — how per-program theming works without a tangle

Per-program styles live in a scoped wrapper (same pattern Purpose already uses with `.pw-shared`). Proposed:

```css
/* src/pages/programs/program-shell/programShell.css */
.program-shell {
  --program-accent: var(--spark-ink);
  --program-accent-soft: rgba(0,0,0,0.08);
  --program-surface: #fffdf9;
  --program-ink: #1a1a1a;
  --program-grid-opacity: 0.06;
  --program-font-display: 'Manrope', ui-sans-serif, system-ui, sans-serif;
}

.program-shell[data-voice="soft"]       { /* purpose-style warm gradients */ }
.program-shell[data-voice="corporate"]  { /* leadership: structured, more navy/slate */ }
.program-shell[data-voice="coalition"]  { /* TRCN: deeper plum + cream */ }
.program-shell[data-voice="youth"]      { /* VOS: energetic yellow + rose */ }
.program-shell[data-voice="grounded"]   { /* Ready Together: olive/stone */ }
```

Each flagship sets `data-voice="..."` and optionally `style={{ '--program-accent': program.brand.accent }}`. Non-flagships rendered via the shared template automatically pick up the pathway's color as their accent.

---

## 5. Scaffolding plan — exact file structure

### 5.1 Purpose refactor (extract inlined sections)

```
src/pages/programs/purpose-workshop/
├── PurposeWorkshopLanding.tsx       — thin layout; just composes sections
├── purposeWorkshopData.ts           — unchanged
├── purposeWorkshopShared.css        — rename → purposeTheme.css
└── sections/
    ├── HeroSection.tsx
    ├── WhatIsSection.tsx
    ├── ExperienceSection.tsx
    ├── ConnectionSection.tsx
    ├── GallerySection.tsx
    ├── AudienceSection.tsx
    └── FinalCTASection.tsx
```

This mirrors the standalone structure Codex flattened, and gives the next flagship (Leadership) real files to pattern-match against. No routing or behavior changes — pure refactor.

### 5.2 Shared program shell (for flagships + non-flagships)

```
src/pages/programs/program-shell/
├── ProgramShell.tsx                 — wrapper that applies data-voice + CSS vars
├── ProgramShell.css                 — the .program-shell tokens above
├── sections/
│   ├── BackToPrograms.tsx           — breadcrumb back to /programs
│   ├── ProgramHero.tsx              — generic hero used by non-flagship detail template
│   ├── ProgramOverview.tsx          — long description + "why it exists"
│   ├── ProgramExperience.tsx        — `whatYoullExperience` bullets w/ iconography
│   ├── ProgramAudience.tsx          — `whoItsFor` + `idealPartners`
│   ├── ProgramOutcomes.tsx          — `outcomes` list
│   └── ProgramCTA.tsx               — `contactCTA` block
└── ProgramDetailPage.tsx            — default non-flagship template: uses all the above
```

Non-flagship route example: `/programs/brain-stress-resilience` → renders `<ProgramShell voice={program.brand.voice}><ProgramDetailPage program={program} /></ProgramShell>`.

Flagships opt out of `ProgramDetailPage` and build their own inside the same shell. Purpose becomes the first example.

### 5.3 New gallery components

```
src/pages/programs/gallery/
├── ProgramsGallerySection.tsx       — the card grid with filter state
├── ProgramCard.tsx                  — single window card
├── PathwayFilterBar.tsx             — sticky chip filter
└── PathwayBand.tsx                  — wide pathway interstitial
```

`ProgramsGallerySection` replaces both `ProgramPagesSection` and `AllProgramsSection`. `EcosystemSection` becomes a series of `PathwayBand`s inlined into the gallery (or removed if the filter bar + bands cover it).

### 5.4 Updated `ProgramsPage.tsx`

```tsx
export default function ProgramsPage() {
  // existing modal state + URL sync stays
  return (
    <div className="sp-programs">
      <SEOHead ... />
      <ProgramsHero />                    {/* tightened, stats removed */}
      <PathwayFilterBar />                {/* new, sticky */}
      <ProgramsGallerySection
        onQuickPeek={handleOpenProgram}
      />                                  {/* new, replaces 3 sections */}
      {/* Optional: keep one or two PathwayBand interstitials */}
      <ClosingCTA />                      {/* existing */}
      <PathwayModal ... />                {/* existing, unchanged behavior */}
    </div>
  );
}
```

### 5.5 Routing additions

```tsx
// App.tsx additions
<Route path="/programs" element={<ProgramsPage />} />
<Route path="/programs/purpose-workshops" element={<PurposeWorkshopsPage />} />          {/* exists */}
<Route path="/programs/leadership-well-being" element={<LeadershipWellBeingPage />} />   {/* flagship, new */}
<Route path="/programs/ready-together" element={<ReadyTogetherPage />} />                {/* flagship, new */}
<Route path="/programs/trcn" element={<TRCNPage />} />                                   {/* flagship, new */}
<Route path="/programs/voice-of-the-students" element={<VOSPage />} />                   {/* flagship, new */}
<Route path="/programs/:slug" element={<ProgramDetailPage />} />                         {/* fallback for non-flagships */}
```

Fallback uses the slug to look up the program in `programsData.ts`. Flagship routes resolve first because they're declared first.

---

## 6. Asset gaps

The card gallery needs a hero image per program. Right now only Purpose has images (`src/assets/purpose_workshops/workshop-*.jpg`). Options:

- **Best** — shoot/source one image per program. Budget: 19 images.
- **Practical near-term** — generate placeholder gradient + icon composites per program using the pathway color + Lucide icon. Ship the gallery, swap images as they come in.
- **Hybrid** — use existing SparkPoint imagery (`src/assets/board_pics`, `connection_happens`, `moments_impact`, `hub`) and assign thematically. I can propose a first-pass mapping in a follow-up.

**Recommendation:** hybrid. I'll do the mapping once you confirm.

---

## 7. Migration sequence — smallest safe steps

Each step is independently deployable. If you stop after step 3, the site still works better than today.

1. **Extract Purpose sections** — pure refactor, zero visual change. Validates the section-component pattern.
2. **Add `ProgramBrand` to the data model** — default values preserve current behavior. Populate flagships.
3. **Build `ProgramShell` + `ProgramDetailPage`** — add the `/programs/:slug` fallback route. All non-flagship programs suddenly have full pages; Quick Peek still works for anyone who prefers the modal.
4. **Ship the gallery** — `ProgramsGallerySection` + `PathwayFilterBar` + `ProgramCard`. Remove `ProgramPagesSection` + `AllProgramsSection` + `EcosystemSection` (or keep hidden behind a feature flag for a release).
5. **Tighten the hero** — drop summary stats, replace with narrative cue.
6. **Promote Leadership Well-Being to flagship** — first full repeat of the Purpose pattern. Validates the shell tokens.
7. **Roll out remaining flagships (Ready Together, TRCN, VOS)** as asset + copy are ready.

Ship each step as its own PR.

---

## 8. Decisions locked (2026-04-16)

| # | Question | Decision |
|---|---|---|
| 1 | Flagship list | **Confirmed as proposed** — Purpose Workshops (live), Leadership Well-Being, Ready Together, TRCN, Voice of the Students. |
| 2 | Breakout list source of truth | **`programsData.ts` is final for now.** No separate document to reconcile. |
| 3 | Voice vocabulary | **Approved** — `soft / corporate / coalition / youth / grounded` becomes the `data-voice` set. |
| 4 | Program imagery | **Reuse existing SparkPoint photography.** Jeff has additional images available to fill gaps. I'll propose a first-pass mapping during step 3. |
| 5 | Keep Quick Peek modal | **Proceed with two-button flow** (Quick Peek modal + Enter Program full page). Reassess at step 4 once gallery is live. |
| 6 | Pathway interstitial bands | **Keep one.** Single band at the top of the gallery for pathway identity; drop the other two. |

---

## 9. What happens next

Immediate next step is §7 step 1 — extract Purpose's 7 sections out of the 655-line `PurposeWorkshopLanding.tsx` into `purpose-workshop/sections/*.tsx`. Pure refactor, no visual change. That work starts next.

In parallel I'll add the `ProgramBrand` type + defaults to `programsData.ts` so flagship data can be populated incrementally.

After that: `ProgramShell` + `ProgramDetailPage` template → gallery + filter bar → hero tighten → flagship rollouts. Each step lands as its own PR.

Follow-up option: run `brand-voice:generate-guidelines` over the confirmed voice vocabulary to produce a copywriter-facing doc for the four new flagships.
