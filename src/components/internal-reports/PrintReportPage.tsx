const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

const STAT_COLORS = ['#E03694', '#FDB515', '#9E509F', '#F15F48'];

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

interface PrintReportPageProps {
  title: string;
  dateRange: string;
  summary: ReportSummary;
  dailyMetrics: DailyMetric[];
  insights?: string[];
}

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PrintReportPage({ title, dateRange, summary, dailyMetrics, insights = [] }: PrintReportPageProps) {
  // Always six tiles (with a placeholder for a missing audience figure) so the
  // 3-column print grid never leaves a visible gap in the last row.
  const stats: { label: string; value: string }[] = [
    { label: 'Total audience', value: summary.total_audience != null ? summary.total_audience.toLocaleString() : '—' },
    { label: 'Views this month', value: summary.total_views.toLocaleString() },
    { label: 'Content interactions', value: summary.total_interactions.toLocaleString() },
    { label: 'New follows', value: summary.new_follows.toLocaleString() },
    { label: 'Profile visits', value: summary.total_visits.toLocaleString() },
    { label: 'Link clicks', value: summary.total_link_clicks.toLocaleString() },
  ];

  const maxViews = Math.max(1, ...dailyMetrics.map((row) => row.views));
  const gridlineCount = 3;
  const gridlines = Array.from({ length: gridlineCount + 1 }, (_, i) => Math.round((maxViews / gridlineCount) * i));

  return (
    <div className="ir-print-page">
      <div className="ir-print-accent-bar" />

      <header className="ir-print-header">
        <div>
          <span className="ir-print-eyebrow">Social Media Report</span>
          <h1>{title}</h1>
          <p>{dateRange}</p>
        </div>
        <img className="ir-print-logo" src={SPARKPOINT_LOGO} alt="SparkPoint" />
      </header>

      <div className="ir-print-stats">
        {stats.map((stat, index) => (
          <div
            className="ir-print-stat"
            key={stat.label}
            style={{ ['--stat-color' as string]: STAT_COLORS[index % STAT_COLORS.length] }}
          >
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      {insights.length > 0 && (
        <ul className="ir-print-insights">
          {insights.slice(0, 3).map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      )}

      <div className="ir-print-chart-heading">Daily views</div>
      <div className="ir-print-chart-frame">
        <div className="ir-print-chart-axis">
          {[...gridlines].reverse().map((value) => (
            <span key={value}>{value.toLocaleString()}</span>
          ))}
        </div>
        <div className="ir-print-bars">
          {gridlines.map((value) => (
            <div key={value} className="ir-print-gridline" style={{ bottom: `${(value / maxViews) * 100}%` }} />
          ))}
          {dailyMetrics.map((row) => (
            <div
              key={row.date}
              className="ir-print-bar"
              style={{ height: `${Math.max(2, (row.views / maxViews) * 100)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="ir-print-downloads">
        <span>
          <strong>Prepared by SparkPoint</strong>
        </span>
        <span>Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
