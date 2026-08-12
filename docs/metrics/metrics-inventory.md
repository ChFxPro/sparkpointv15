# Metrics Inventory

Generated: 2026-02-27T02:08:08.898Z
Branch: codex/chore/programs-elevate-content
Total claims: 90

## Most Likely Inconsistent

- Event totals conflict across pages and backend seed data: `77+` (`/impact`), `79` (`/` ImpactSection), and backend `total_events: 103` for 2025.
- Attendance totals conflict: `4,187` (`/impact`), `4,477` (`/` ImpactSection), and backend `attendance: 3,510` for 2025.
- Partner totals conflict: `45` partner organizations/formations in UI vs backend `unique_partners: 38` (2025).
- Story interview volume conflict: Impact sections use `120+` interviews, while stories pages use `140+` voices/interviews.
- Helene date conflict: `September 2024` in `src/data/stories.ts` vs `September 27, 2025` in routed story/article pages.
- Absolute claims without visible qualifier/source: `100% Local Volunteers` and `100% goes to programs`.

## Claims By Route/Page

### /

- **8 verified partners organized by focus area** | values: [8] | units: partners | risk: low | file: src/components/ImpactSection.tsx:493-493
  notes: Comment-level partner count; validate against rendered nodes.
- **34+ Youth-Focused Events & Sessions** | values: [34] | units: events | risk: high | file: src/components/ImpactSection.tsx:518-518
  notes: Youth events/sessions count.
- **~2,100 youth engagement moments** | values: [2100] | units: other | risk: high | file: src/components/ImpactSection.tsx:519-519
  notes: Youth engagement rollup estimate.
- **6 school & college campuses served** | values: [6] | units: other | risk: med | file: src/components/ImpactSection.tsx:520-520
  notes: Institutional reach count.
- **43+ adult/community events** | values: [43] | units: events | risk: high | file: src/components/ImpactSection.tsx:529-529
  notes: Adult/community events count.
- **20+ education & training sessions** | values: [20] | units: events | risk: med | file: src/components/ImpactSection.tsx:539-539
  notes: Training session count.
- **10 story collection stops** | values: [10] | units: stories | risk: high | file: src/components/ImpactSection.tsx:549-549
  notes: Story collection stops count.
- **120+ verified resident interviews** | values: [120] | units: stories | risk: high | file: src/components/ImpactSection.tsx:550-550
  notes: Resident interview volume claim.
- **Residents Supported** | values: [7700] | units: residents | risk: high | file: src/components/ImpactSection.tsx:610-613
  notes: Topline residents-supported claim (rendered as 7,700+).
- **Partnerships Formed** | values: [45] | units: partners | risk: high | file: src/components/ImpactSection.tsx:625-628
  notes: Topline partnerships-formed claim (rendered as 45+).
- **100% Local Volunteers** | values: [100] | units: % | risk: high | file: src/components/ImpactSection.tsx:640-643
  notes: Absolute percentage claim.
- **approximately 33,000 residents** | values: [33000] | units: residents | risk: high | file: src/components/ImpactSection.tsx:683-683
  notes: Population framing statement.
- **Total Events & Sessions (2025)** | values: [79,2025] | units: events | risk: high | file: src/components/ImpactSection.tsx:691-693
  notes: Annual events/sessions rollup.
- **Verified Attendance Moments** | values: [4477] | units: other | risk: high | file: src/components/ImpactSection.tsx:696-698
  notes: Annual attendance rollup.
- **Youth Attendance (Estimated)** | values: [2100] | units: other | risk: high | file: src/components/ImpactSection.tsx:701-704
  notes: Annual youth attendance estimate (rendered with + suffix).
- **Months of Active Programming** | values: [12] | units: other | risk: med | file: src/components/ImpactSection.tsx:707-709
  notes: Operational duration claim.
- **3 Anchor Program Highlights** | values: [3] | units: other | risk: med | file: src/components/ImpactSection.tsx:807-807
  notes: Count of highlighted anchor programs.
- **2025 total attendance** | values: [2025] | units: other | risk: med | file: src/components/ImpactSection.tsx:810-810
  notes: Year context for anchor attendance figures.
- **Attendance 700 (Helene: One Year of Healing)** | values: [700] | units: other | risk: med | file: src/components/ImpactSection.tsx:825-825
  notes: Anchor program attendance value.
- **Attendance 700 (Dr. Ora Brain Health Talks)** | values: [700] | units: other | risk: med | file: src/components/ImpactSection.tsx:840-840
  notes: Anchor program attendance value.
- **Attendance 1,760 (VOS Events & Programming)** | values: [1760] | units: other | risk: med | file: src/components/ImpactSection.tsx:855-855
  notes: Anchor program attendance value.
- **3,160 Total Anchor Attendance** | values: [3160] | units: other | risk: high | file: src/components/ImpactSection.tsx:869-873
  notes: Combined attendance total for anchor highlights.
- **2025 combined programs** | values: [2025] | units: other | risk: low | file: src/components/ImpactSection.tsx:875-875
  notes: Year label for combined-programs total.
- **51% of residents report loneliness** | values: [51] | units: % | risk: high | file: src/components/ImpactSection.tsx:910-913
  notes: Population mental-health prevalence claim.
- **37% report anxiety or trauma** | values: [37] | units: % | risk: high | file: src/components/ImpactSection.tsx:929-932
  notes: Population mental-health prevalence claim.
- **Transylvania County Community Centers (22)** | values: [22] | units: partners | risk: med | file: src/components/PartnerNetworkHub.tsx:109-109
  notes: Partner label includes explicit count in parentheses.

### /about

- **2019–2022** | values: [2019,2022] | units: other | risk: med | file: src/pages/AboutPage.tsx:86-86
  notes: Foundational phase year range.
- **501(c)(3) status established (2020)** | values: [501,3,2020] | units: other | risk: low | file: src/pages/AboutPage.tsx:94-94
  notes: Legal status/date marker.
- **2023 SparkPoint Founded** | values: [2023] | units: other | risk: med | file: src/pages/AboutPage.tsx:99-100
  notes: Founding-year marker.
- **2024 Community Response & Coordination / 1,200+ families assisted** | values: [2024,1200] | units: residents | risk: high | file: src/pages/AboutPage.tsx:111-114
  notes: Response-period family assistance count.
- **2024 Wellness expansion / 6 new wellness programs / 450+ participants** | values: [2024,6,450] | units: other | risk: high | file: src/pages/AboutPage.tsx:121-124
  notes: Program expansion and participant count claim.
- **2025 Regional collaboration / 3 new counties reached / 15 additional partners** | values: [2025,3,15] | units: partners | risk: high | file: src/pages/AboutPage.tsx:131-134
  notes: Geographic expansion and partner-growth claim.
- **2026 Looking Ahead** | values: [2026] | units: other | risk: med | file: src/pages/AboutPage.tsx:142-144
  notes: Forward-looking year marker.
- **milestoneYear="2019–2022"** | values: [2019,2022] | units: other | risk: low | file: src/pages/AboutPage.tsx:666-666
  notes: Repeated foundational-year display.

### /api/impact/*

> **Superseded — this whole section is historical.** The file it inventories,
> `src/supabase/functions/server/index.tsx`, was removed: it was never a deploy path, the
> app never imported it, and its `make-server-535d8907` routes (`/impact/init`,
> `/impact/metrics`, `/volunteer`) were never deployed, so `/api/impact/*` was never a live
> endpoint. The 2024 figures below are now preserved as `src/data/impact2024.ts`. The 2025
> figures below (103 events / 3,510 attendance) were **already wrong** when this inventory
> was written and were corrected in the canonical `src/data/impact2025.ts`
> (109 events / 5,866 attendance) — see `docs/recon/launch-recon-map.md` rows 50–52, which
> flagged exactly this drift as P0. Line references below are stale. Kept for provenance,
> not as a pointer to anything current.

- **SparkPoint Impact Dashboard API - Updated 2025** | values: [2025] | units: other | risk: low | file: src/supabase/functions/server/index.tsx:1-1
  notes: Comment-level year marker for API seed logic.
- **2024 metrics snapshot: community_events 37, workshops 29, youth_events 18, presentations 13, total_events 97, attendance 7000, unique_partners 40, individuals_trained 500, avg_attendance 72.1, ready_groups 8** | values: [2024,37,29,18,13,97,7000,40,500,72.1,8] | units: other | risk: high | file: src/supabase/functions/server/index.tsx:60-72
  notes: Backend seed values can diverge from front-end published metrics.
- **2025 metrics snapshot: community_events 45, workshops 33, youth_events 15, presentations 10, total_events 103, attendance 3510, unique_partners 38, individuals_trained 3510, avg_attendance 56.6, ready_groups 10** | values: [2025,45,33,15,10,103,3510,38,3510,56.6,10] | units: other | risk: high | file: src/supabase/functions/server/index.tsx:74-86
  notes: Backend seed values can diverge from front-end published metrics.

### /community-champions/helene-one-year

- **On September 27, 2025 ... A year had passed since Hurricane Helene ...** | values: [2025,9,27,1] | units: other | risk: high | file: src/pages/CommunityChampionsArticle.tsx:74-74
  notes: Alternate route repeats same date anchor and one-year framing.
- **Helene: One Year of Healing · September 27, 2025 · Brevard Music Center** | values: [2025,9,27] | units: other | risk: high | file: src/pages/CommunityChampionsArticle.tsx:162-162
  notes: Alternate route repeats same footer date.

### /get-involved

- **100% goes to programs** | values: [100] | units: % | risk: high | file: src/pages/GetInvolvedPage.tsx:35-35
  notes: Absolute allocation claim; verify legal/financial support.

### /impact

- **Community Touchpoints in 2025** | values: [12500,2025] | units: other | risk: high | file: src/pages/ImpactPage.tsx:30-31
  notes: Topline annual rollup used in hero quick stats.
- **Volunteer Hours** | values: [850] | units: other | risk: high | file: src/pages/ImpactPage.tsx:39-40
  notes: Topline volunteer-hours claim in hero metrics.
- **Partner Organizations** | values: [45] | units: partners | risk: high | file: src/pages/ImpactPage.tsx:48-49
  notes: Topline partnership count claim.
- **Programs Delivered** | values: [98] | units: other | risk: high | file: src/pages/ImpactPage.tsx:57-58
  notes: Topline delivered-programs claim.
- **2025 Impact Report** | values: [2025] | units: other | risk: med | file: src/pages/ImpactPage.tsx:368-368
  notes: Sets year scope for metrics on this page.
- **week after week in 2025** | values: [2025] | units: other | risk: med | file: src/pages/ImpactPage.tsx:440-440
  notes: Narrative year rollup statement.
- **In a rural county of ~33,000 people** | values: [33000] | units: residents | risk: high | file: src/pages/ImpactPage.tsx:444-444
  notes: Population-scale denominator used to frame impact.
- **77+ Total Events & Sessions** | values: [77] | units: events | risk: high | file: src/pages/ImpactPage.tsx:449-450
  notes: Key annual event/session count.
- **12 Months Active Programming** | values: [12] | units: other | risk: med | file: src/pages/ImpactPage.tsx:453-454
  notes: Operational duration claim.
- **4,187 Verified Attendance Moments** | values: [4187] | units: other | risk: high | file: src/pages/ImpactPage.tsx:457-458
  notes: Core attendance rollup metric.
- **Holiday Gala (~90 attendees)** | values: [90] | units: events | risk: med | file: src/pages/ImpactPage.tsx:470-470
  notes: Event-specific attendance estimate.
- **Light Up the Night (~200 engaged)** | values: [200] | units: other | risk: med | file: src/pages/ImpactPage.tsx:474-474
  notes: Event-specific engagement estimate.
- **4,187 Verified Attendance Moments** | values: [4187] | units: other | risk: high | file: src/pages/ImpactPage.tsx:504-506
  notes: Repeated core attendance rollup metric.
- **~2,100 Youth Attendance Moments** | values: [2100] | units: other | risk: high | file: src/pages/ImpactPage.tsx:536-537
  notes: Youth attendance rollup estimate.
- **34+ Youth-Focused Sessions** | values: [34] | units: events | risk: high | file: src/pages/ImpactPage.tsx:540-541
  notes: Youth session/event count.
- **6 Campuses Served** | values: [6] | units: other | risk: med | file: src/pages/ImpactPage.tsx:544-545
  notes: Institutional reach count.
- **43+ adult and community events** | values: [43] | units: events | risk: high | file: src/pages/ImpactPage.tsx:571-571
  notes: Adult/community event count statement.
- **43+ Community Events** | values: [43] | units: events | risk: high | file: src/pages/ImpactPage.tsx:590-591
  notes: Repeated adult/community event count.
- **10 collection stops and 120+ interviews** | values: [10,120] | units: stories | risk: high | file: src/pages/ImpactPage.tsx:609-609
  notes: Core story-collection throughput claim.
- **565 November Attendance Moments** | values: [565] | units: other | risk: med | file: src/pages/ImpactPage.tsx:684-685
  notes: Monthly attendance subtotal claim.
- **~13.5% of Annual Reach in Nov** | values: [13.5] | units: % | risk: med | file: src/pages/ImpactPage.tsx:689-690
  notes: Monthly share-of-annual-reach claim.
- **Community moments from 2025 events** | values: [2025] | units: other | risk: low | file: src/pages/ImpactPage.tsx:483-483
  notes: Year-scoped descriptor in image alt text.

### /intake

- **typically respond within 24 hours** | values: [24] | units: other | risk: low | file: src/components/GuidedIntakeForm.tsx:212-212
  notes: Service-level response-time expectation.

### /mission

- **500+ attendees at Dr. Ora Wells’ Brain Health keynote at Brevard College** | values: [500] | units: events | risk: high | file: src/pages/MissionPage.tsx:1179-1179
  notes: Large attendance claim in alt text.
- **Education & Youth sector partners (5 listed)** | values: [5] | units: partners | risk: med | file: src/pages/MissionPage.tsx:55-61
  notes: Displayed as partner-count chip via partners.length.
- **Nonprofits & Community sector partners (5 listed)** | values: [5] | units: partners | risk: med | file: src/pages/MissionPage.tsx:70-76
  notes: Displayed as partner-count chip via partners.length.
- **Health & Academic sector partners (5 listed)** | values: [5] | units: partners | risk: med | file: src/pages/MissionPage.tsx:85-91
  notes: Displayed as partner-count chip via partners.length.
- **Civic & Government sector partners (5 listed)** | values: [5] | units: partners | risk: med | file: src/pages/MissionPage.tsx:100-106
  notes: Displayed as partner-count chip via partners.length.
- **Faith & Community sector partners (4 listed)** | values: [4] | units: partners | risk: med | file: src/pages/MissionPage.tsx:115-120
  notes: Displayed as partner-count chip via partners.length.

### /privacy

- **"100 volunteers joined us this year"** | values: [100] | units: other | risk: med | file: src/pages/PrivacyPage.tsx:74-74
  notes: Example impact-reporting statement included in privacy copy.

### /stories

- **A community tribute film created from 140+ voices across Transylvania County.** | values: [140] | units: stories | risk: high | file: src/pages/StoriesPage.tsx:110-110
  notes: Repeated headline story-volume claim.

### /stories/:categoryId

- **Helene: One Year of Healing — September 27, 2025** | values: [2025,9,27] | units: other | risk: high | file: src/pages/StoryCategoryPage.tsx:37-38
  notes: Injected featured article uses explicit 2025 date.

### /stories/community-champions/helene-anniversary

- **article:published_time 2025-09-27** | values: [2025,9,27] | units: other | risk: high | file: src/pages/HeleneOneYearArticle.tsx:23-23
  notes: Publish-date metadata marker.
- **On September 27, 2025 ... A year had passed since Hurricane Helene ...** | values: [2025,9,27,1] | units: other | risk: high | file: src/pages/HeleneOneYearArticle.tsx:75-75
  notes: Narrative date anchor with one-year rollup wording.
- **Helene: One Year of Healing · September 27, 2025 · Brevard Music Center** | values: [2025,9,27] | units: other | risk: high | file: src/pages/HeleneOneYearArticle.tsx:168-168
  notes: Footer date anchor.

### /stories/community-voice

- **Echoes from the Community weekly series includes Week 1–5 entries** | values: [1,2,3,4,5] | units: stories | risk: low | file: src/data/stories.ts:26-31
  notes: Week indexing indicates five sequential weekly installments.
- **January 15, 2026** | values: [2026,1,15] | units: other | risk: low | file: src/data/stories.ts:31-31
  notes: Published date for Week 5 entry.
- **December 11, 2025** | values: [2025,12,11] | units: other | risk: low | file: src/data/stories.ts:54-54
  notes: Published date for Week 4 entry.
- **November 27, 2025** | values: [2025,11,27] | units: other | risk: low | file: src/data/stories.ts:75-75
  notes: Published date for Week 3 entry.
- **November 13, 2025** | values: [2025,11,13] | units: other | risk: low | file: src/data/stories.ts:92-92
  notes: Published date for Week 2 entry.
- **October 23, 2025** | values: [2025,10,23] | units: other | risk: low | file: src/data/stories.ts:112-112
  notes: Published date for Week 1 entry.
- **During 2025, many neighbors ... have shared stories** | values: [2025] | units: other | risk: med | file: src/data/stories.ts:38-38
  notes: Year-based rollup statement about collected stories.

### /stories/disaster-recovery

- **A community tribute film created from 140+ voices across Transylvania County.** | values: [140] | units: stories | risk: high | file: src/data/stories.ts:138-138
  notes: Primary story-volume claim used across pages.
- **based on interviews with over 140 residents across Transylvania County.** | values: [140] | units: residents | risk: high | file: src/data/stories.ts:140-140
  notes: Resident interview-volume claim.
- **our team interviewed more than 140 people across Transylvania County** | values: [140] | units: residents | risk: high | file: src/data/stories.ts:144-144
  notes: Long-form interview-volume claim.
- **September 2024** | values: [2024] | units: other | risk: high | file: src/data/stories.ts:139-139
  notes: Conflicts with Sept 27, 2025 date in routed article pages.

### /stories/volunteer-impact

- **August 2024** | values: [2024] | units: other | risk: low | file: src/data/stories.ts:171-171
  notes: Date label for community champions story.

### *

- **Candid Gold Transparency 2026** | values: [2026] | units: other | risk: med | file: src/components/Footer.tsx:398-402
  notes: Badge year appears in both aria-label and alt text.
- **Sustainable Health for All (est. 2020) is a registered 501(c)(3)** | values: [2020,501,3] | units: other | risk: low | file: src/components/Footer.tsx:441-441
  notes: Legal disclosure statement.
- **© 2025 SparkPoint. All rights reserved.** | values: [2025] | units: other | risk: low | file: src/components/Footer.tsx:472-472
  notes: Copyright year marker.

