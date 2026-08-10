// Prose generation for the dashboard, modeled directly on SparkPoint's own
// established report voice (see the monthly Word docs in the team's Social
// Media Reports folder) — lead with the theme, pair any decline with the
// real win next to it, close on the current goal-progress snapshot.

interface DailyMetric {
  date: string;
  views: number;
  viewers: number;
  visits: number;
  interactions: number;
  follows: number;
  link_clicks: number;
}

interface ReportSummary {
  total_audience: number | null;
  new_follows: number;
  total_views: number;
  total_viewers: number;
  total_visits: number;
  total_interactions: number;
  total_link_clicks: number;
}

// SparkPoint's established Facebook follower goal, per the team's prior
// monthly reports (e.g. the July 2026 Results Brief tracks progress toward
// this same number). Update here if the goal changes.
export const FOLLOWER_GOAL = 3000;

export interface Momentum {
  recentViews: number;
  priorViews: number;
  changePercent: number;
}

/**
 * Final 7 days vs the 7 days before that — the same "recency window" framing
 * SparkPoint's own reports use ("Final seven days: 8,386 views, up 116.4%
 * from the prior seven days"). Far more honest than whole-month-to-whole-month
 * when one early outlier day is doing all the work in the comparison month.
 */
export function computeMomentum(dailyMetrics: DailyMetric[]): Momentum | null {
  if (dailyMetrics.length < 14) return null;
  const sorted = [...dailyMetrics].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const prior7 = sorted.slice(-14, -7);
  const recentViews = last7.reduce((sum, row) => sum + row.views, 0);
  const priorViews = prior7.reduce((sum, row) => sum + row.views, 0);
  if (priorViews === 0) return null;
  return { recentViews, priorViews, changePercent: ((recentViews - priorViews) / priorViews) * 100 };
}

function monthYearLabel(period: string) {
  return new Date(`${period}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Rotates by calendar month so consecutive reports don't open with the exact
// same sentence structure every time — purely a repetition-relief device,
// changes no numbers or claims.
const LEAD_VERBS = ['generated', 'brought in', 'drew'];
function leadVerb(period: string) {
  const month = Number(period.slice(-2)) || 0;
  return LEAD_VERBS[month % LEAD_VERBS.length];
}

export function buildStorySummary(period: string, summary: ReportSummary, momentum: Momentum | null): string {
  const month = monthYearLabel(period);
  let story = `${month} ${leadVerb(period)} ${summary.total_views.toLocaleString()} views from ${summary.total_viewers.toLocaleString()} viewers`;

  if (momentum && momentum.changePercent >= 10) {
    story +=
      `, with a strong late-month lift — the final seven days alone brought in ` +
      `${momentum.recentViews.toLocaleString()} views, up ${Math.round(momentum.changePercent)}% from the week before`;
  } else if (momentum && momentum.changePercent >= 3) {
    story += `, and held roughly steady through the final week, slightly ahead of the week before`;
  }
  story += '.';

  if (summary.total_audience) {
    const progress = (summary.total_audience / FOLLOWER_GOAL) * 100;
    story += ` The current audience snapshot is ${summary.total_audience.toLocaleString()} total followers, ${progress.toFixed(0)}% of the way to the ${FOLLOWER_GOAL.toLocaleString()}-follower goal.`;
  }

  return story;
}

type Direction = 'up' | 'down' | 'flat';

function directionOf(changePercent: number): Direction {
  if (changePercent >= 5) return 'up';
  if (changePercent <= -5) return 'down';
  return 'flat';
}

// Short editorial title for the report's cover — the one place this project
// intentionally writes a headline rather than a plain sentence. Every branch
// is grounded in two real, already-computed signals (month-over-month total,
// and the last-7-vs-prior-7 momentum window) so the phrasing always matches
// what the numbers actually did; nothing here is chosen for mood alone.
export function buildHeadline(
  period: string,
  summary: ReportSummary,
  previousSummary: ReportSummary | null,
  momentum: Momentum | null,
): string {
  const monthDirection: Direction | null =
    previousSummary && previousSummary.total_views > 0
      ? directionOf(((summary.total_views - previousSummary.total_views) / previousSummary.total_views) * 100)
      : null;
  const momentumDirection: Direction | null = momentum ? directionOf(momentum.changePercent) : null;

  if (monthDirection === 'down' && momentumDirection === 'up') return 'A quieter month with a loud finish.';
  if (monthDirection === 'up' && momentumDirection === 'up') return 'Strong month, and still climbing.';
  if (monthDirection === 'up' && momentumDirection === 'down') return "A strong month that's cooling.";
  if (monthDirection === 'down' && momentumDirection === 'down') return 'A slower month, and still slowing.';
  if (monthDirection === 'flat' && momentumDirection === 'up') return 'A steady month that found a gear.';
  if (monthDirection === 'flat' && momentumDirection === 'down') return "A steady month that's losing a step.";

  if (monthDirection === 'up') return 'A stronger month for reach.';
  if (monthDirection === 'down') return 'A quieter month for reach.';
  if (monthDirection === 'flat') return 'A steady month across the board.';

  if (momentumDirection === 'up') return 'Finishing strong.';
  if (momentumDirection === 'down') return 'A slower close to the month.';

  return `${monthYearLabel(period)} social media report.`;
}

export function buildFunderBlurb(period: string, summary: ReportSummary): string {
  const month = monthYearLabel(period);
  let blurb = `In ${month}, SparkPoint's Facebook page generated ${summary.total_views.toLocaleString()} views from ${summary.total_viewers.toLocaleString()} viewers.`;

  if (summary.total_audience) {
    const progress = (summary.total_audience / FOLLOWER_GOAL) * 100;
    blurb += ` The current Facebook audience snapshot is ${summary.total_audience.toLocaleString()} total followers, or ${progress.toFixed(0)}% of the ${FOLLOWER_GOAL.toLocaleString()}-follower goal.`;
  }

  // Close on a real, data-backed note rather than the same generic
  // "convert reach into engagement" CTA every month — state whichever is
  // actually true this month, or say nothing rather than pad with boilerplate.
  const engagementRate = summary.total_views > 0 ? (summary.total_interactions / summary.total_views) * 100 : 0;
  if (engagementRate >= 1) {
    blurb += ` Engagement was a real strength this month — ${summary.total_interactions.toLocaleString()} likes, comments, and shares.`;
  } else if (summary.new_follows > 0) {
    blurb += ` ${summary.new_follows.toLocaleString()} people followed the page for the first time this month.`;
  }

  return blurb;
}
