// Structured (not prose) facts for the dashboard's three scroll "beats" —
// each pairs a number with a visualization, so unlike reportInsights.ts
// (flat sentences) these return the raw figures a chart needs. Every beat
// is optional: each compute function returns null when its condition isn't
// honestly met, and the page simply omits that beat rather than padding it.

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

export interface PeakDayBeat {
  date: string;
  views: number;
  avgViews: number;
  multiple: number;
}

// Same >1.5x-average threshold reportInsights.ts uses for its own peak-day
// insight, so the two never disagree about whether a given month had a real
// standout day.
export function computePeakDayBeat(dailyMetrics: DailyMetric[]): PeakDayBeat | null {
  if (dailyMetrics.length === 0) return null;
  const peak = dailyMetrics.reduce((a, b) => (b.views > a.views ? b : a));
  const avgViews = dailyMetrics.reduce((sum, r) => sum + r.views, 0) / dailyMetrics.length;
  if (avgViews <= 0 || peak.views <= avgViews * 1.5) return null;
  return { date: peak.date, views: peak.views, avgViews, multiple: peak.views / avgViews };
}

export interface EngagementRateBeat {
  currentRate: number;
  previousRate: number;
  currentInteractions: number;
  previousInteractions: number;
  changePercent: number;
}

// Only appears when there's a real prior month to compare against — rate
// improving or worsening is meaningless without a baseline, so this beat is
// never shown on a report's first month.
export function computeEngagementRateBeat(
  summary: ReportSummary,
  previousSummary: ReportSummary | null,
): EngagementRateBeat | null {
  if (!previousSummary || summary.total_views <= 0 || previousSummary.total_views <= 0) return null;
  const currentRate = (summary.total_interactions / summary.total_views) * 100;
  const previousRate = (previousSummary.total_interactions / previousSummary.total_views) * 100;
  if (previousRate <= 0) return null;
  return {
    currentRate,
    previousRate,
    currentInteractions: summary.total_interactions,
    previousInteractions: previousSummary.total_interactions,
    changePercent: ((currentRate - previousRate) / previousRate) * 100,
  };
}

export interface FollowsTrendBeat {
  points: { period: string; value: number }[];
  isSteady: boolean;
}

// Mirrors trajectoryInsights.ts's own "steady" definition (no month at zero,
// no single month over 60% of the total) so the beat and the bigger-picture
// section never contradict each other about the same span.
export function computeFollowsTrendBeat(
  history: { period: string; summary: ReportSummary }[],
): FollowsTrendBeat | null {
  if (history.length < 2) return null;
  const sorted = [...history].sort((a, b) => a.period.localeCompare(b.period));
  const points = sorted.map((m) => ({ period: m.period, value: m.summary.new_follows }));
  const total = points.reduce((sum, p) => sum + p.value, 0);
  if (total <= 0) return null;
  const max = Math.max(...points.map((p) => p.value));
  const isSteady = points.every((p) => p.value > 0) && max / total <= 0.6;
  return { points, isSteady };
}
