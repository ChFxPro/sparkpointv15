# Launch Recon Map (Read-Only Pass)

Generated: 2026-02-27 (local)  
Repo: `sparkpointv15`  
Branch: `codex/chore/programs-elevate-content`

## 1) Executive Summary

- Repo is **not clean** (pre-existing edits in `AGENTS.md` and `src/pages/programs/*`); recon completed without touching production code.
- Recent fixes already present:
  - Programs integration exists at `/programs` with route wired in `src/App.tsx:71` and full module in `src/pages/programs/*`.
  - `AGENTS.md` is recently updated (`Last updated: 2026-02-27`; recent commit `0e2a34a`).
- Requested launch edits are **mostly not yet applied**:
  - Address override to `159 W. Main St Unit 2452` is missing in site boilerplate.
  - Mission partner groups/copy and Let’s Connect volunteer list are partially or fully outdated vs request source.
  - Stories top tabs and new Sponsors/Resilience Hub nav structures are missing.
  - News/Media consolidation request is missing.
  - About-page phrasing/year framing is partially aligned but still contains flagged language.
- Metrics are **not centralized**:
  - No `src/data/impact2025.ts` (or equivalent single-source module) exists.
  - 2025 metrics are duplicated/conflicting across `ImpactPage`, `ImpactSection`, `stories`, and Supabase seed data.

## 2) Requested Changes Target Map

| Change item | Status | File(s) | Suggested implementation approach (best insertion point) | Priority |
|---|---|---|---|---|
| Address boilerplate should be `159 W. Main St Unit 2452` | missing | `src/components/Footer.tsx:141-152`<br>`src/components/StructuredData.tsx:13-19` | Update both visible footer address + map link in `Footer()` and schema address object in `StructuredData()` to avoid UI/SEO mismatch. | P0 |
| Mission copy update (`mission_page_copy_update.replace_with`) | missing | `src/pages/MissionPage.tsx:1257` | Replace paragraph under “Working Together Across Sectors” inside `MissionPage` section `id="section-network"`. | P1 |
| Mission partner sectors/list should match `partners_by_group` | partially correct | `src/pages/MissionPage.tsx:48-123`<br>`src/pages/MissionPage.tsx:1263-1294`<br>`src/pages/MissionPage.tsx:1390-1393` | Replace `SECTORS_DATA` source list; rendering already exists (cards + modal) so update data at the constant only. | P0 |
| Partner sectors are duplicated in another component (risk of drift) | partially correct | `src/components/PartnerNetworkHub.tsx:46-134`<br>`src/components/PartnerNetworkHub.tsx:231`<br>`src/components/ImpactSection.tsx:958` | If mission/source-of-truth is changed, synchronize `PartnerNetworkHub` sectors too, or refactor both to shared data module. | P0 |
| Let’s Connect volunteer opportunities list replacement | partially correct | `src/components/GuidedIntakeForm.tsx:109-117`<br>`src/components/GuidedIntakeForm.tsx:338`<br>`src/pages/IntakePage.tsx:94` | Update `volunteerInterests` array; current list includes `Events & Outreach` but not requested items (`SparkPoint Resource Lobby`, `Story-Collection`, `Voice of the Students`, `Preparedness`, `General Volunteer`). | P0 |
| Stories page “Programs” top tab | missing | `src/pages/StoriesPage.tsx:32-100`<br>`src/components/ui/tabs.tsx` | No top tab system currently in `StoriesPage`; add local tab strip in `StoriesPage` above categories grid (reuse `ui/tabs` if desired). | P1 |
| Add “Sponsors” + “SparkPoint Resilience Hub” navigation tabs/entries | missing | `src/components/Header.tsx:23-32`<br>`src/components/Header.tsx:64-67`<br>`src/components/Footer.tsx:34-43`<br>`src/App.tsx:64-83` | Decide global vs local: global requires new header/footer entries + route(s). If page-local tabs, implement in owning page component. Currently absent in both global nav and page tabs. | P1 |
| News/Media consolidation (newsletter archives + media on one page) | missing | `src/components/Header.tsx:153`<br>`src/components/Header.tsx:353-356`<br>`src/components/Header.tsx:396`<br>`src/pages/StoriesPage.tsx` | Header currently points to external newsletter URL only; no in-repo archives/media page route. Add dedicated page + route and repoint nav links. | P1 |
| About page language + 2019/2020 clarity request | partially correct | `src/pages/AboutPage.tsx:86-94`<br>`src/pages/AboutPage.tsx:508-510`<br>`src/pages/AboutPage.tsx:522`<br>`src/pages/AboutPage.tsx:595` | Keep existing year markers (`2019–2022`, `2020`) but revise flagged phrasing (`shared structure`) and tighten origin narrative blocks in `AboutPage`. | P1 |

### Global vs Local Nav Determination

- **Global Header/Footer links currently exist** for `Home`, `Mission`, `Stories`, `Impact`, `Programs`, `Get Involved`, `About`, `Contact` (`Header.menuItems`, `Footer.quickLinks`).
- **Stories page has no top tabs**; it uses category cards (`StoriesPage` grid).
- Requested `Programs`/`Sponsors`/`Resilience Hub` “tabs” are therefore currently **missing as local tabs**, and `Sponsors`/`Resilience Hub` are also **missing globally**.

## 3) Metrics Contradictions Map

Reference bible used: `SparkPoint_2025_Community_Impact_Tracking_REFERENCE.json` (external path provided).  
Key bible totals (2025): `events_logged=109`, `attendance_total_recorded_minimum=5866`, `unique_collaborating_org_tokens_count=41`.

| Claim type | Scope classification | Conflicting values + where found | Bible value (2025) | Files to change | Replace with bible value? | Priority |
|---|---|---|---|---|---|---|
| Events totals | 2025 claim | `77+` (`src/pages/ImpactPage.tsx:449-450`), `79` (`src/components/ImpactSection.tsx:691-693`), `103` (`src/supabase/functions/server/index.tsx:80`) | `109 events_logged` | `src/pages/ImpactPage.tsx`<br>`src/components/ImpactSection.tsx`<br>`src/supabase/functions/server/index.tsx` | yes | P0 |
| Attendance totals | 2025 claim | `4,187` (`src/pages/ImpactPage.tsx:457-458`, `:504-506`), `4,477` (`src/components/ImpactSection.tsx:696-698`), `3,510` (`src/supabase/functions/server/index.tsx:81`) | `5,866 attendance_total_recorded_minimum` | `src/pages/ImpactPage.tsx`<br>`src/components/ImpactSection.tsx`<br>`src/supabase/functions/server/index.tsx` | yes | P0 |
| Partner totals | ambiguous (rendered in 2025 contexts, but not always labeled) | `45` (`src/pages/ImpactPage.tsx:48-49`, `src/components/ImpactSection.tsx:625-628`), `38` (`src/supabase/functions/server/index.tsx:82`) | `41 unique_collaborating_org_tokens_count` | `src/pages/ImpactPage.tsx`<br>`src/components/ImpactSection.tsx`<br>`src/supabase/functions/server/index.tsx` | yes (for 2025-labeled claims) | P0 |
| Interviews / voices | ambiguous (likely project/to-date narrative) | `120+` (`src/pages/ImpactPage.tsx:609`, `src/components/ImpactSection.tsx:550`) vs `140+` (`src/pages/StoriesPage.tsx:110`, `src/data/stories.ts:138/140/144`) | not present in bible | `src/pages/ImpactPage.tsx`<br>`src/components/ImpactSection.tsx`<br>`src/pages/StoriesPage.tsx`<br>`src/data/stories.ts` | no (editorial/source decision needed) | P1 |
| Helene dates | 2025 claim | `September 2024` (`src/data/stories.ts:139`) vs `September 27, 2025` (`src/pages/StoryCategoryPage.tsx:37`, `src/pages/HeleneOneYearArticle.tsx:75/168`, `src/pages/CommunityChampionsArticle.tsx:74/162`) | `2025-09-27` event date in bible | `src/data/stories.ts` (primary mismatch) | yes | P0 |
| Absolute “100%” claims | non-2025/to-date (legal/compliance risk) | `100% Local Volunteers` (`src/components/ImpactSection.tsx:640-643`) and `100% goes to programs` (`src/pages/GetInvolvedPage.tsx:35`) | not present in bible | `src/components/ImpactSection.tsx`<br>`src/pages/GetInvolvedPage.tsx` | no (requires substantiation or qualification) | P0 |

## 4) Risk Notes

- `100%` claims are high-risk unless documented evidence exists; recommend qualification language if evidence is not immediately available.
- Helene date is internally inconsistent between `stories` data (`September 2024`) and routed article pages (`September 27, 2025`), which can create visible trust issues at launch.
- Navigation additions (`Sponsors`, `SparkPoint Resilience Hub`, possible Stories tabs) likely ripple across:
  - `Header` desktop + mobile drawer
  - `Footer` quick links
  - `App.tsx` route table
  - Potential new page components and internal linking.
- Partner data is duplicated in two render paths (`MissionPage` and `PartnerNetworkHub`), increasing re-divergence risk unless centralized.

## 5) Big Run Input Checklist

- `partners-and-fixes.json` in repo default path:
  - `docs/site/partners-and-fixes.json` -> **missing**
  - External file provided and used: `/Users/jeffbannister/Desktop/Spark Point/2026/Web Update/Chat Library/Partner - Updates.json` -> **present**
- 2025 impact bible in repo default path:
  - `docs/metrics/SparkPoint_2025_Community_Impact_Tracking_REFERENCE.json` -> **missing**
  - External file provided and used: `/Users/jeffbannister/Desktop/Spark Point/2026/Web Update/Chat Library/SparkPoint_2025_Community_Impact_Tracking_REFERENCE.json` -> **present**
- Metrics inventory:
  - `docs/metrics/metrics-inventory.json` -> **present**
  - `docs/metrics/metrics-inventory.md` -> **present**
- Branch for big run:
  - **`codex/chore/programs-elevate-content`**

## Centralized Metrics Module Recon

- Existing centralized 2025 module: **not found**.
- Recommended new module path: `src/data/impact2025.ts`.
- Recommended import targets for big-fix run:
  - `src/pages/ImpactPage.tsx` (hero/topline and impact stat cards)
  - `src/components/ImpactSection.tsx` (home impact section metrics + anchor attendance)
  - `src/supabase/functions/server/index.tsx` (if API seed remains in use)
  - `src/data/stories.ts` / `src/pages/StoriesPage.tsx` for interview/date constants where appropriate.
