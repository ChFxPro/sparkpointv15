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

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function pct(part: number, whole: number) {
  if (!whole) return 0;
  return (part / whole) * 100;
}

export type InsightKind = 'reach' | 'engagement' | 'growth';

export interface Insight {
  text: string;
  kind: InsightKind;
}

/**
 * Plain-language read of the month's numbers, scoped to this month alone.
 * Month-over-month comparison lives in the trajectory section instead,
 * where it can carry real context (viral-day outliers, multi-month framing)
 * — repeating a bare "down X% from last month" here just doubles up bad
 * news without adding anything the stat tiles don't already show quietly.
 *
 * Each insight carries a `kind` (reach/engagement/growth) so the UI can color
 * it to match the same metric's color everywhere else on the page (stat
 * blocks, chart lines) — never by list position, which reshuffles arbitrarily
 * whenever the underlying data changes which insights fire.
 */
export function buildInsights(summary: ReportSummary, dailyMetrics: DailyMetric[]): Insight[] {
  if (dailyMetrics.length === 0) return [];

  const insights: Insight[] = [];

  const peakDay = dailyMetrics.reduce((a, b) => (b.views > a.views ? b : a));
  const avgViews = summary.total_views / dailyMetrics.length;
  if (avgViews > 0 && peakDay.views > avgViews * 1.5) {
    const multiple = peakDay.views / avgViews;
    insights.push({
      kind: 'reach',
      text:
        `${formatDay(peakDay.date)} was the month's standout day — ${peakDay.views.toLocaleString()} views, ` +
        `${multiple.toFixed(1)}x the daily average of ${Math.round(avgViews).toLocaleString()}.`,
    });
  }

  const midpoint = Math.floor(dailyMetrics.length / 2);
  const firstHalf = dailyMetrics.slice(0, midpoint);
  const secondHalf = dailyMetrics.slice(midpoint);
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.views, 0) / (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.views, 0) / (secondHalf.length || 1);
  if (firstHalfAvg > 0) {
    const change = pct(secondHalfAvg - firstHalfAvg, firstHalfAvg);
    if (Math.abs(change) >= 15) {
      insights.push({
        kind: 'reach',
        text:
          change > 0
            ? `Momentum built through the month — views in the second half were up ${Math.round(change)}% over the first half.`
            : `Views were front-loaded this month, ${Math.round(Math.abs(change))}% higher in the first half than the second.`,
      });
    }
  }

  if (summary.total_interactions > 0) {
    const engagementRate = pct(summary.total_interactions, summary.total_views);
    insights.push({
      kind: 'engagement',
      text:
        `${summary.total_interactions.toLocaleString()} likes, comments, and shares this month — ` +
        `people engaged with content on ${engagementRate.toFixed(1)}% of views.`,
    });
  }

  if (summary.total_audience && summary.new_follows > 0) {
    const growth = pct(summary.new_follows, summary.total_audience - summary.new_follows);
    insights.push({
      kind: 'growth',
      text:
        `${summary.new_follows} new followers joined this month, growing the audience ${growth.toFixed(1)}% to ${summary.total_audience.toLocaleString()}.`,
    });
  }

  return insights.slice(0, 4);
}
