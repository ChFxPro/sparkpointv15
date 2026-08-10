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

export interface HistoryMonth {
  period: string;
  title: string;
  summary: ReportSummary;
  daily_metrics: DailyMetric[];
}

function monthLabel(period: string) {
  return new Date(`${period}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long' });
}

export type InsightKind = 'reach' | 'engagement' | 'growth';

export interface Insight {
  text: string;
  kind: InsightKind;
}

/**
 * Multi-month context, grounded only in numbers actually loaded — no invented
 * causes, no smoothing over a real decline. Where a month's total was driven
 * by one or two outlier days, that gets named explicitly rather than left to
 * read as "the account is shrinking."
 */
export function buildTrajectoryInsights(history: HistoryMonth[]): Insight[] {
  if (history.length < 2) return [];

  const sorted = [...history].sort((a, b) => a.period.localeCompare(b.period));
  const insights: Insight[] = [];

  const totalViews = sorted.reduce((sum, m) => sum + m.summary.total_views, 0);
  const totalInteractions = sorted.reduce((sum, m) => sum + m.summary.total_interactions, 0);
  const totalFollows = sorted.reduce((sum, m) => sum + m.summary.new_follows, 0);

  insights.push({
    kind: 'reach',
    text:
      `Across ${monthLabel(sorted[0].period)}–${monthLabel(sorted[sorted.length - 1].period)}, SparkPoint content was viewed ` +
      `${totalViews.toLocaleString()} times and drew ${totalInteractions.toLocaleString()} interactions.`,
  });

  if (totalFollows > 0) {
    // "Steady" is only honest if no single month is doing most of the work —
    // summing to a positive total isn't the same as even growth (e.g. one
    // month contributing two-thirds of the total isn't "steady").
    const maxMonthFollows = Math.max(...sorted.map((m) => m.summary.new_follows));
    const isSteady = sorted.length > 1 && sorted.every((m) => m.summary.new_follows > 0) && maxMonthFollows / totalFollows <= 0.6;
    insights.push({
      kind: 'growth',
      text: isSteady
        ? `The audience grew by ${totalFollows.toLocaleString()} new followers over that span — steady growth even in months where views swung.`
        : `The audience grew by ${totalFollows.toLocaleString()} new followers over that span.`,
    });
  }

  let mostConcentrated: { period: string; share: number } | null = null;
  for (const month of sorted) {
    if (!month.daily_metrics.length || !month.summary.total_views) continue;
    const peak = month.daily_metrics.reduce((a, b) => (b.views > a.views ? b : a));
    const share = peak.views / month.summary.total_views;
    if (share > 0.15 && (!mostConcentrated || share > mostConcentrated.share)) {
      mostConcentrated = { period: month.period, share };
    }
  }
  if (mostConcentrated) {
    insights.push({
      kind: 'reach',
      text:
        `${monthLabel(mostConcentrated.period)} was shaped heavily by a single high-traffic day — ` +
        `${Math.round(mostConcentrated.share * 100)}% of that month's views came from one post. Viral moments move the ` +
        `monthly total more than steady baseline activity does, so month-to-month swings don't always mean momentum is lost.`,
    });
  }

  // Only state the raw first-vs-last trend when it's *not* already explained
  // by the outlier-day note above — otherwise this just restates the same
  // decline a second time, which reads as piling on rather than informing.
  const first = sorted[0].summary.total_views;
  const last = sorted[sorted.length - 1].summary.total_views;
  if (first > 0) {
    const change = ((last - first) / first) * 100;
    const explainedByOutlier = mostConcentrated?.period === sorted[0].period && change < 0;
    if (change >= 10) {
      insights.push({
        kind: 'reach',
        text: `Monthly views grew ${Math.round(change)}% from ${monthLabel(sorted[0].period)} to ${monthLabel(sorted[sorted.length - 1].period)}.`,
      });
    } else if (change <= -10 && !explainedByOutlier) {
      insights.push({
        kind: 'reach',
        text:
          `Monthly views are down ${Math.round(Math.abs(change))}% from ${monthLabel(sorted[0].period)} to ${monthLabel(sorted[sorted.length - 1].period)} — ` +
          `even so, the account drew ${totalInteractions.toLocaleString()} interactions and ${totalFollows.toLocaleString()} new followers over the same stretch.`,
      });
    }
  }

  return insights.slice(0, 4);
}
