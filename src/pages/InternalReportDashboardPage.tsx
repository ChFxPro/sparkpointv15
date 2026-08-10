import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router';
import { Download, Printer } from 'lucide-react';
import { motion, useInView, useReducedMotion, useScroll, useMotionValueEvent, useTransform } from 'motion/react';
import { SEOHead } from '../components/SEOHead';
import { RequireInternalAuth } from '../components/RequireInternalAuth';
import { PrintReportPage } from '../components/internal-reports/PrintReportPage';
import { buildInsights } from '../components/internal-reports/reportInsights';
import { buildTrajectoryInsights, type HistoryMonth } from '../components/internal-reports/trajectoryInsights';
import {
  computeMomentum,
  buildHeadline,
  buildStorySummary,
  buildFunderBlurb,
  FOLLOWER_GOAL,
  type Momentum,
} from '../components/internal-reports/reportNarrative';
import {
  computePeakDayBeat,
  computeEngagementRateBeat,
  computeFollowsTrendBeat,
} from '../components/internal-reports/reportBeats';
import { supabase } from '../lib/supabaseClient';
import './internalReportDashboard.css';

const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

interface DailyMetric {
  date: string;
  views: number;
  viewers: number;
  visits: number;
  interactions: number;
  follows: number;
  link_clicks: number;
}

interface ReportDownload {
  label: string;
  storage_path: string;
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

interface ReportSnapshot {
  id: string;
  report_type: string;
  period: string;
  title: string;
  date_range: string;
  summary: ReportSummary;
  daily_metrics: DailyMetric[];
  downloads: ReportDownload[];
}

/* ---------------------------------------------------------------------- */
/* Data layer — unchanged by the visual rebuild below.                    */
/* ---------------------------------------------------------------------- */

function previousPeriod(period: string): string | null {
  const match = period.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(Date.UTC(year, month - 2, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function useReportSnapshot(reportType: string | undefined, period: string | undefined) {
  const [report, setReport] = useState<ReportSnapshot | null | undefined>(undefined);
  const [previousSummary, setPreviousSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportType || !period) return;
    let cancelled = false;
    setReport(undefined);
    setPreviousSummary(null);
    setError(null);

    supabase
      .from('report_snapshots')
      .select('id, report_type, period, title, date_range, summary, daily_metrics, downloads')
      .eq('report_type', reportType)
      .eq('period', period)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError('Could not load this report right now.');
          return;
        }
        setReport((data as ReportSnapshot | null) ?? null);
      });

    const prior = previousPeriod(period);
    if (prior) {
      supabase
        .from('report_snapshots')
        .select('summary')
        .eq('report_type', reportType)
        .eq('period', prior)
        .maybeSingle()
        .then(({ data }) => {
          if (!cancelled && data) setPreviousSummary((data as { summary: ReportSummary }).summary);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [reportType, period]);

  return { report, previousSummary, error };
}

function useReportHistory(reportType: string | undefined, uptoPeriod: string | undefined) {
  const [history, setHistory] = useState<HistoryMonth[]>([]);

  useEffect(() => {
    if (!reportType || !uptoPeriod) return;
    let cancelled = false;

    supabase
      .from('report_snapshots')
      .select('period, title, summary, daily_metrics')
      .eq('report_type', reportType)
      .lte('period', uptoPeriod)
      .order('period', { ascending: true })
      .then(({ data }) => {
        if (!cancelled && data) setHistory(data as HistoryMonth[]);
      });

    return () => {
      cancelled = true;
    };
  }, [reportType, uptoPeriod]);

  return history;
}

function buildCsv(report: ReportSnapshot) {
  const header = ['Date', 'Views', 'Viewers', 'Visits', 'Interactions', 'Follows', 'Link clicks'];
  const rows = report.daily_metrics.map((row) => [
    row.date,
    row.views,
    row.viewers,
    row.visits,
    row.interactions,
    row.follows,
    row.link_clicks,
  ]);
  return [header, ...rows].map((line) => line.join(',')).join('\n');
}

function downloadCsv(report: ReportSnapshot) {
  const blob = new Blob([buildCsv(report)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.report_type}-${report.period}-daily-metrics.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function DownloadButton({ download, solid }: { download: ReportDownload; solid?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('internal-reports')
      .createSignedUrl(download.storage_path, 60);
    setLoading(false);

    if (error || !data) {
      window.alert(`Could not fetch "${download.label}" — it may not be uploaded yet.`);
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <button type="button" className={`irn-btn ${solid ? 'irn-btn--solid' : ''}`} onClick={handleClick} disabled={loading}>
      <Download size={15} aria-hidden="true" />
      {loading ? 'Preparing…' : download.label}
    </button>
  );
}

function usePrintMode() {
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const finish = () => setPrinting(false);
    window.addEventListener('afterprint', finish);
    return () => window.removeEventListener('afterprint', finish);
  }, []);

  const openPrintDialog = () => {
    setStatus('Opening the print dialog. Choose "Save as PDF" to download the visual summary.');
    document.body.classList.add('ir-printing');
    setPrinting(true);
    requestAnimationFrame(() => {
      window.print();
      document.body.classList.remove('ir-printing');
    });
  };

  return { printing, status, openPrintDialog };
}

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function monthLabel(period: string) {
  return new Date(`${period}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long' });
}

function monthYearLabel(period: string) {
  return new Date(`${period}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/* ---------------------------------------------------------------------- */
/* Appendix summary table — "Metric / This month / Comparison", the same   */
/* recap structure as every earlier report design in this project. Each   */
/* row's comparison only appears when the data backing it actually        */
/* exists (a previous month, a real momentum window, a real peak day) —   */
/* never a fabricated baseline.                                           */
/* ---------------------------------------------------------------------- */

interface SummaryRow {
  label: string;
  value: string;
  comparison: string;
  delta: 'up' | 'down' | 'flat';
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function deltaFor(change: number | null): 'up' | 'down' | 'flat' {
  if (change == null || Math.abs(change) < 1) return 'flat';
  return change > 0 ? 'up' : 'down';
}

function buildSummaryRows({
  report,
  summary,
  previousSummary,
  momentum,
  peakBeat,
  rateBeat,
  history,
}: {
  report: ReportSnapshot;
  summary: ReportSummary;
  previousSummary: ReportSummary | null;
  momentum: Momentum | null;
  peakBeat: ReturnType<typeof computePeakDayBeat>;
  rateBeat: ReturnType<typeof computeEngagementRateBeat>;
  history: HistoryMonth[];
}): SummaryRow[] {
  const rows: SummaryRow[] = [];
  const prior = previousPeriod(report.period);
  const prevLabel = prior ? monthLabel(prior) : null;

  const viewsChange = previousSummary ? pctChange(summary.total_views, previousSummary.total_views) : null;
  rows.push({
    label: 'Total views',
    value: fmt(summary.total_views),
    comparison:
      viewsChange != null && prevLabel
        ? `${viewsChange >= 0 ? 'Up' : 'Down'} ${Math.abs(viewsChange).toFixed(1)}% vs. ${prevLabel} (${fmt(previousSummary!.total_views)})`
        : '—',
    delta: deltaFor(viewsChange),
  });

  if (momentum) {
    const sorted = [...report.daily_metrics].sort((a, b) => a.date.localeCompare(b.date));
    const last7 = sorted.slice(-7);
    const prior7 = sorted.slice(-14, -7);
    rows.push({
      label: `Views, ${formatDay(last7[0].date)}–${formatDay(last7[last7.length - 1].date)}`,
      value: fmt(momentum.recentViews),
      comparison: `${momentum.changePercent >= 0 ? 'Up' : 'Down'} ${Math.abs(momentum.changePercent).toFixed(1)}% vs. ${formatDay(prior7[0]?.date ?? last7[0].date)}–${formatDay(prior7[prior7.length - 1]?.date ?? last7[0].date)} (${fmt(momentum.priorViews)})`,
      delta: deltaFor(momentum.changePercent),
    });
  }

  if (peakBeat) {
    rows.push({
      label: `Peak day (${formatDay(peakBeat.date)})`,
      value: fmt(peakBeat.views),
      comparison: `${peakBeat.multiple.toFixed(1)}× the ${fmt(Math.round(peakBeat.avgViews))}-view daily average`,
      delta: 'flat',
    });
  }

  const interactionsChange = previousSummary ? pctChange(summary.total_interactions, previousSummary.total_interactions) : null;
  rows.push({
    label: 'Total interactions',
    value: fmt(summary.total_interactions),
    comparison:
      interactionsChange != null && prevLabel
        ? `${interactionsChange >= 0 ? 'Up' : 'Down'} ${Math.abs(interactionsChange).toFixed(1)}% vs. ${prevLabel} (${fmt(previousSummary!.total_interactions)})`
        : '—',
    delta: deltaFor(interactionsChange),
  });

  if (rateBeat) {
    rows.push({
      label: 'Interactions per view',
      value: `${rateBeat.currentRate.toFixed(2)}%`,
      comparison: `${rateBeat.changePercent >= 0 ? 'Up' : 'Down'} from ${rateBeat.previousRate.toFixed(2)}% in ${prevLabel ?? 'the prior month'}`,
      delta: deltaFor(rateBeat.changePercent),
    });
  }

  if (previousSummary && prevLabel) {
    rows.push({
      label: 'Viewers',
      value: fmt(summary.total_viewers),
      comparison: `${prevLabel}: ${fmt(previousSummary.total_viewers)}`,
      delta: deltaFor(pctChange(summary.total_viewers, previousSummary.total_viewers)),
    });
    rows.push({
      label: 'Profile visits',
      value: fmt(summary.total_visits),
      comparison: `${prevLabel}: ${fmt(previousSummary.total_visits)}`,
      delta: deltaFor(pctChange(summary.total_visits, previousSummary.total_visits)),
    });
    rows.push({
      label: 'Link clicks',
      value: fmt(summary.total_link_clicks),
      comparison: `${prevLabel}: ${fmt(previousSummary.total_link_clicks)}`,
      delta: deltaFor(pctChange(summary.total_link_clicks, previousSummary.total_link_clicks)),
    });
    rows.push({
      label: 'New follows',
      value: fmt(summary.new_follows),
      comparison: `${prevLabel}: ${fmt(previousSummary.new_follows)}`,
      delta: 'flat',
    });
  } else {
    rows.push({ label: 'Viewers', value: fmt(summary.total_viewers), comparison: '—', delta: 'flat' });
    rows.push({ label: 'Profile visits', value: fmt(summary.total_visits), comparison: '—', delta: 'flat' });
    rows.push({ label: 'Link clicks', value: fmt(summary.total_link_clicks), comparison: '—', delta: 'flat' });
    rows.push({ label: 'New follows', value: fmt(summary.new_follows), comparison: '—', delta: 'flat' });
  }

  if (summary.total_audience != null) {
    rows.push({
      label: 'Total audience',
      value: fmt(summary.total_audience),
      comparison: `Goal: ${fmt(FOLLOWER_GOAL)}`,
      delta: 'flat',
    });
  }

  if (history.length >= 2) {
    const sorted = [...history].sort((a, b) => a.period.localeCompare(b.period));
    const total = sorted.reduce((sum, m) => sum + m.summary.total_views, 0);
    rows.push({
      label: `Total views, ${sorted.length}-month`,
      value: fmt(total),
      comparison: sorted.map((m) => `${monthLabel(m.period)} ${fmt(m.summary.total_views)}`).join(' · '),
      delta: 'flat',
    });
  }

  return rows;
}

function summaryRowsToCsv(rows: SummaryRow[]) {
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const header = ['Metric', 'Value', 'Comparison'].map(escape).join(',');
  const lines = rows.map((r) => [r.label, r.value, r.comparison].map(escape).join(','));
  return [header, ...lines].join('\r\n');
}

/* ---------------------------------------------------------------------- */
/* Motion helpers                                                          */
/* ---------------------------------------------------------------------- */

// One-shot scroll-into-view reveal. Wraps its children in a div (block-level,
// no visual footprint of its own) that gains .is-in the first time it enters
// the viewport — CSS owns the actual opacity/transform transition per
// element, this hook just supplies the trigger.
function Reveal({ className = '', children }: { className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  return (
    <div ref={ref} className={`irn-reveal ${inView || reduceMotion ? 'is-in' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}

// Counts up from 0 to `target` the first time `active` becomes true (a
// section entering view, typically). Reduced motion skips straight to the
// final value — no motion, not a faster version of the same motion.
function useCountUp(target: number, active: boolean, duration = 1600, decimals = 0) {
  const reduceMotion = useReducedMotion() ?? false;
  const [value, setValue] = useState(reduceMotion ? target : 0);
  // Tracks the target we've already animated to (not just whether we've
  // "started") — bignumTarget is computed as `report?.summary.total_views ??
  // 0` before the data has loaded, so if the scroll trigger fires while
  // that fallback 0 is still current, a plain "started" boolean would lock
  // the count-up at 0 forever once the real number arrives on a later
  // render. Re-firing whenever the real target changes self-heals that.
  const startedForRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || startedForRef.current === target) return;
    startedForRef.current = target;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    function frame(now: number) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(frame);
      else setValue(target);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduceMotion]);

  return fmt(value, decimals);
}

// Splits a plain sentence into per-word spans with a staggered reveal delay
// (via --irn-i), reusable for any generated narrative string.
function SplitSentence({ text }: { text: string }) {
  const words = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);
  let i = 0;
  return (
    <>
      {words.map((chunk, idx) => {
        if (/^\s+$/.test(chunk)) return <span key={idx}>{chunk}</span>;
        const wordIndex = i++;
        return (
          <span key={idx} className="w" style={{ ['--irn-i' as string]: wordIndex }}>
            {chunk}
          </span>
        );
      })}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* SVG chart data — pure functions, generic over any number of days/months */
/* ---------------------------------------------------------------------- */

interface DailyArc {
  width: number;
  height: number;
  linePath: string;
  areaPath: string;
  gridYs: number[];
  band: { x: number; width: number } | null;
  peak: { x: number; y: number };
  baseline: number;
}

function buildDailyArc(daily: DailyMetric[]): DailyArc | null {
  if (daily.length < 2) return null;
  const width = 900;
  const height = 300;
  const padX = 40;
  const padTop = 30;
  const padBottom = 60;
  const n = daily.length;
  const maxViews = Math.max(...daily.map((d) => d.views), 1);
  const usableW = width - padX * 2;
  const usableH = height - padTop - padBottom;
  const baseline = padTop + usableH;

  const xFor = (i: number) => padX + (n === 1 ? 0 : (i / (n - 1)) * usableW);
  const yFor = (v: number) => padTop + usableH - (v / maxViews) * usableH;
  const points = daily.map((d, i) => [xFor(i), yFor(d.views)] as const);

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${baseline} L${points[0][0].toFixed(1)},${baseline} Z`;

  const bandStartIdx = n >= 14 ? n - 7 : null;
  const band = bandStartIdx != null ? { x: xFor(bandStartIdx), width: width - padX - xFor(bandStartIdx) } : null;

  const peakIdx = daily.reduce((best, d, i, arr) => (d.views > arr[best].views ? i : best), 0);

  return {
    width,
    height,
    linePath,
    areaPath,
    gridYs: [padTop, padTop + usableH / 2, baseline],
    band,
    peak: { x: points[peakIdx][0], y: points[peakIdx][1] },
    baseline,
  };
}

function DailyArcSvg({ daily }: { daily: DailyMetric[] }) {
  const arc = useMemo(() => buildDailyArc(daily), [daily]);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-20%' });
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [arc]);

  if (!arc) return null;
  const lit = inView || reduceMotion;

  return (
    <div className="irn-arcwrap" ref={wrapRef} aria-hidden="true">
      <svg className={`irn-arc ${lit ? 'is-lit-svg' : ''}`} viewBox={`0 0 ${arc.width} ${arc.height}`} preserveAspectRatio="xMidYMid meet" role="presentation">
        <defs>
          <linearGradient id="irn-arcgrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#9E509F" />
            <stop offset="45%" stopColor="#E03694" />
            <stop offset="78%" stopColor="#F15F48" />
            <stop offset="100%" stopColor="#FDB515" />
          </linearGradient>
          <linearGradient id="irn-areagrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E03694" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#E03694" stopOpacity="0" />
          </linearGradient>
        </defs>

        {arc.band && (
          <>
            <rect className="irn-band" x={arc.band.x} y={30} width={arc.band.width} height={arc.height - 90} rx={10} />
            <text className="irn-band-lab" x={arc.band.x + arc.band.width / 2} y={26} textAnchor="middle">
              FINAL WEEK
            </text>
          </>
        )}

        {arc.gridYs.map((y, i) => (
          <line key={i} className="irn-grid" x1={40} y1={y} x2={arc.width - 40} y2={y} />
        ))}

        <path className="irn-area" d={arc.areaPath} />
        <path
          ref={pathRef}
          className="irn-line"
          d={arc.linePath}
          style={{
            strokeDasharray: pathLength || undefined,
            strokeDashoffset: lit ? 0 : pathLength,
            transition: lit ? 'stroke-dashoffset 2.1s var(--irn-ease) .15s' : 'none',
          }}
        />

        <circle className="irn-tip" cx={arc.peak.x} cy={arc.peak.y} r={9} fill="#FDB515" />
        <circle className="irn-tip" cx={arc.peak.x} cy={arc.peak.y} r={19} fill="#FDB515" opacity={0.18} />

        <text x={40} y={arc.height - 10} textAnchor="start">
          {formatDay(daily[0].date).toUpperCase()}
        </text>
        <text x={arc.width - 40} y={arc.height - 10} textAnchor="end">
          {formatDay(daily[daily.length - 1].date).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

function FollowsTrendSvg({ points }: { points: { period: string; value: number }[] }) {
  const width = 340;
  const height = 190;
  const padX = 30;
  const yTop = 40;
  const yBottom = 152;
  const maxV = Math.max(...points.map((p) => p.value), 1);
  const n = points.length;
  const xFor = (i: number) => padX + (n === 1 ? 0 : (i / (n - 1)) * (width - padX * 2));
  const yFor = (v: number) => yBottom - (v / maxV) * (yBottom - yTop);
  const coords = points.map((p, i) => ({ x: xFor(i), y: yFor(p.value), value: p.value, month: monthLabel(p.period) }));
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const colors = ['#9E509F', '#E03694', '#9E509F', '#E03694'];

  return (
    <svg
      className="irn-follows"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`New follows by month: ${coords.map((c) => `${c.month} ${c.value}`).join(', ')}.`}
    >
      <line className="irn-axis" x1={20} y1={yBottom} x2={width - 20} y2={yBottom} />
      <path className="irn-path" d={path} />
      {coords.map((c, i) => (
        <g className="irn-pt" key={i} style={{ transitionDelay: `${0.5 + i * 0.45}s` }}>
          <circle cx={c.x} cy={c.y} r={7} fill={colors[i % colors.length]} />
          <text className="irn-vlab" x={c.x} y={c.y - 16} textAnchor="middle">
            {fmt(c.value)}
          </text>
          <text className="irn-mlab" x={c.x} y={height - 18} textAnchor="middle">
            {c.month.slice(0, 3).toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Beats                                                                   */
/* ---------------------------------------------------------------------- */

interface BeatDescriptor {
  key: string;
  kicker: string;
  heading: string;
  body: ReactNode;
  viz: ReactNode;
}

function useBeatReveal() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduceMotion = useReducedMotion() ?? false;
  return { ref, isIn: inView || reduceMotion };
}

function Beat({ descriptor, flip }: { descriptor: BeatDescriptor; flip: boolean }) {
  const { ref, isIn } = useBeatReveal();
  return (
    <article ref={ref} className={`irn-beat ${flip ? 'irn-beat--flip' : ''} ${isIn ? 'is-in' : ''}`}>
      <div className="irn-beat-txt">
        <p className="irn-beat-no">
          <s></s>
          {descriptor.kicker}
        </p>
        <h3>{descriptor.heading}</h3>
        <p>{descriptor.body}</p>
      </div>
      <div className="irn-beat-viz">
        <div className="irn-viz">{descriptor.viz}</div>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------- */
/* Dashboard content                                                       */
/* ---------------------------------------------------------------------- */

function DeltaChip({ value, previousValue }: { value: number; previousValue?: number }) {
  if (previousValue == null || previousValue === 0) return null;
  const change = ((value - previousValue) / previousValue) * 100;
  if (Math.abs(change) < 1) return null;
  const up = change > 0;
  return (
    <span className="irn-chip irn-chip--plain">
      <span className={up ? 'irn-arrow-up' : 'irn-arrow-down'} aria-hidden="true" />
      {up ? 'Up' : 'Down'} {Math.abs(change).toFixed(1)}% from last month
    </span>
  );
}

function DashboardContent() {
  const { reportType, period } = useParams<{ reportType: string; period: string }>();
  const { report, previousSummary, error } = useReportSnapshot(reportType, period);
  const history = useReportHistory(reportType, period);
  const { printing, status: printStatus, openPrintDialog } = usePrintMode();
  const pagePath = `/internal/reports/${reportType}/${period}`;
  const reduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  // The scale itself stays a motion value applied directly via style — never
  // lifted into React state, since that would re-render this whole subtree
  // on every scroll frame. Only the three discrete stage-progress flags
  // below go through setState, and each only actually re-renders on the
  // rare frame where it flips (React bails out on an identical boolean).
  const stageScale = useTransform(heroProgress, [0, 1], [1, 0.94]);

  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { margin: '-30% 0px -30% 0px' });
  const [litByScroll, setLitByScroll] = useState(false);
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  useMotionValueEvent(heroProgress, 'change', (v) => {
    if (v > 0.02) setLitByScroll(true);
    setS1(v > 0.1);
    // Was 0.36 — with the hero box now sized to fit its content (rather
    // than a fixed 100vh box tuned for one exact word count), that much
    // extra scroll before the paragraph appears read as "the text under
    // the chips is just missing." Bringing it close to s1 keeps a slight
    // cascade without the long wait.
    setS2(v > 0.15);
  });
  const lit = reduceMotion || stageInView || litByScroll;

  const bignumTarget = report?.summary.total_views ?? 0;
  const bignumDisplay = useCountUp(bignumTarget, lit, 2000);

  // ---- chapter rail: track which act is centered in the viewport ----
  const RAIL_SECTIONS = useMemo(
    () => [
      { id: 'irn-open', label: 'Cover' },
      { id: 'irn-hero', label: 'The number' },
      { id: 'irn-line', label: 'The month' },
      { id: 'irn-beats', label: 'What moved' },
      { id: 'irn-momentum', label: 'Momentum' },
      { id: 'irn-numbers', label: 'The rest' },
      { id: 'irn-funder', label: 'For funders' },
      { id: 'irn-appendix', label: 'Appendix' },
    ],
    [],
  );
  const [activeRail, setActiveRail] = useState('irn-open');
  const lightIds = useMemo(() => new Set(['irn-line', 'irn-beats', 'irn-numbers', 'irn-appendix']), []);

  useEffect(() => {
    if (!report) return;
    const sections = RAIL_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.42;
        let best = sections[0].id;
        sections.forEach((sec) => {
          const r = sec.getBoundingClientRect();
          if (r.top <= mid && r.bottom > mid) best = sec.id;
        });
        setActiveRail(best);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [report, RAIL_SECTIONS]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  function say(msg: string) {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }

  async function handleCopyFunder(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      say('Funder paragraph copied');
    } catch {
      say('Copy failed — select the text instead');
    }
  }

  if (error) {
    return (
      <div className="irn-report">
        <header className="irn-masthead">
          <Link to="/internal/reports">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" className="irn-masthead-logo" />
            <span>← Back to reports</span>
          </Link>
        </header>
        <div className="irn-act irn-act--night" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <p role="alert">{error}</p>
        </div>
      </div>
    );
  }

  if (report === undefined) {
    return (
      <div className="irn-report">
        <header className="irn-masthead">
          <Link to="/internal/reports">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" className="irn-masthead-logo" />
            <span>← Back to reports</span>
          </Link>
        </header>
        <div className="irn-act irn-act--night" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <p>Loading report…</p>
        </div>
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="irn-report">
        <SEOHead title="Report not found — SparkPoint" description="Report not found." path={pagePath} noindex />
        <header className="irn-masthead">
          <Link to="/internal/reports">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" className="irn-masthead-logo" />
            <span>← Back to reports</span>
          </Link>
        </header>
        <div className="irn-act irn-act--night" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <p>This report doesn't exist yet.</p>
        </div>
      </div>
    );
  }

  const { summary, daily_metrics: daily } = report;
  const momentum: Momentum | null = computeMomentum(daily);
  const headline = buildHeadline(report.period, summary, previousSummary, momentum);
  const story = buildStorySummary(report.period, summary, momentum);
  const funderBlurb = buildFunderBlurb(report.period, summary);
  const insights = buildInsights(summary, daily); // still used for the print PDF's bullet list
  const trajectoryInsights = buildTrajectoryInsights(history);
  const reachTrajectory = trajectoryInsights.filter((i) => i.kind === 'reach');
  const growthTrajectory = trajectoryInsights.find((i) => i.kind === 'growth');

  const peakBeat = computePeakDayBeat(daily);
  const rateBeat = computeEngagementRateBeat(summary, previousSummary);
  const followsBeat = computeFollowsTrendBeat(history);

  const beats: BeatDescriptor[] = [];
  if (peakBeat) {
    beats.push({
      key: 'peak',
      kicker: 'The spike',
      heading: `One day drove ${peakBeat.multiple.toFixed(1)}× the average day's views.`,
      body: `${formatDay(peakBeat.date)} alone brought ${fmt(peakBeat.views)} views against a daily average of ${fmt(Math.round(peakBeat.avgViews))}. A single strong piece of content can still move the whole month.`,
      viz: (
        <>
          <p className="irn-viz-cap">Daily views · {monthLabel(report.period)}</p>
          <div className="irn-ratio">
            <div className="irn-ratio-col">
              <div className="irn-ratio-bar is-small" style={{ height: `${Math.max(8, (peakBeat.avgViews / peakBeat.views) * 100)}%` }} />
              <p className="irn-ratio-lab">
                <b>{fmt(Math.round(peakBeat.avgViews))}</b>Average day
              </p>
            </div>
            <div className="irn-ratio-col">
              <div className="irn-ratio-bar is-big" style={{ height: '90%' }} />
              <p className="irn-ratio-lab">
                <b>{fmt(peakBeat.views)}</b>
                {formatDay(peakBeat.date)}, the peak
              </p>
            </div>
          </div>
        </>
      ),
    });
  }
  if (rateBeat) {
    const up = rateBeat.changePercent > 0;
    beats.push({
      key: 'rate',
      kicker: 'The engagement',
      heading: up ? 'A bigger share of viewers engaged than last month.' : 'Engagement held up less than last month.',
      body: `Interactions ${rateBeat.currentInteractions >= rateBeat.previousInteractions ? 'grew' : 'fell'} to ${fmt(rateBeat.currentInteractions)} from ${fmt(rateBeat.previousInteractions)}. As a share of views, the rate went ${up ? 'up' : 'down'} to ${rateBeat.currentRate.toFixed(2)}%, from ${rateBeat.previousRate.toFixed(2)}%.`,
      viz: (
        <>
          <p className="irn-viz-cap">Interactions · {monthLabel(report.period)}</p>
          <div className="irn-dial">
            <span className="irn-dial-n irn-num">{fmt(rateBeat.currentInteractions)}</span>
            <span className="irn-dial-meta">
              <strong>{up ? 'Rate up' : 'Rate down'}</strong> {Math.abs(rateBeat.changePercent).toFixed(0)}% vs. last month
            </span>
          </div>
          <div className="irn-rates">
            <div>
              <p className="irn-rate-top">
                <span>Last month's rate</span>
                <b>{rateBeat.previousRate.toFixed(2)}%</b>
              </p>
              <div className="irn-rate-rail">
                <div className="irn-rate-fill is-prev" style={{ width: `${Math.min(100, (rateBeat.previousRate / Math.max(rateBeat.currentRate, rateBeat.previousRate)) * 100)}%` }} />
              </div>
            </div>
            <div>
              <p className="irn-rate-top">
                <span>This month's rate</span>
                <b>{rateBeat.currentRate.toFixed(2)}%</b>
              </p>
              <div className="irn-rate-rail">
                <div className="irn-rate-fill is-current" style={{ width: `${Math.min(100, (rateBeat.currentRate / Math.max(rateBeat.currentRate, rateBeat.previousRate)) * 100)}%` }} />
              </div>
            </div>
          </div>
          <p className="irn-note">
            <b>What the rate is</b>Interactions divided by views — a way to compare engagement even when total reach moves.
          </p>
        </>
      ),
    });
  }
  if (followsBeat) {
    const last = followsBeat.points[followsBeat.points.length - 1];
    const prior = followsBeat.points[followsBeat.points.length - 2];
    const slower = last.value < prior.value;
    beats.push({
      key: 'follows',
      kicker: 'The follows',
      heading: slower ? "New follows slowed from last month's pace." : 'New follows picked up from last month.',
      body: `${fmt(last.value)} new follows in ${monthLabel(last.period)}, against ${fmt(prior.value)} in ${monthLabel(prior.period)}.`,
      viz: (
        <>
          <p className="irn-viz-cap">New follows · last {followsBeat.points.length} months</p>
          <FollowsTrendSvg points={followsBeat.points} />
          <p className="irn-note">
            <b>How we're reading it</b>
            {growthTrajectory
              ? growthTrajectory.text
              : `We are not calling this ${followsBeat.isSteady ? 'anything but steady growth' : 'steady growth in either direction'} — a few months is a shape, not a trend.`}
          </p>
        </>
      ),
    });
  }

  const stageFootText = reachTrajectory.length > 0 ? reachTrajectory.map((i) => i.text).join(' ') : null;
  const summaryRows = buildSummaryRows({ report, summary, previousSummary, momentum, peakBeat, rateBeat, history });

  return (
    <div className="irn-report">
      <SEOHead
        title={`${report.title} — SparkPoint Internal Reports`}
        description={`Internal report: ${report.title}, ${report.date_range}.`}
        path={pagePath}
        noindex
      />

      <motion.div className="irn-progress" style={{ scaleX: scrollYProgress }} />

      <nav className="irn-rail" aria-label="Report sections">
        {RAIL_SECTIONS.map((s) => (
          <button key={s.id} type="button" className={activeRail === s.id ? 'is-on' : ''} onClick={() => jumpTo(s.id)}>
            <i></i>
            <span>{s.label}</span>
          </button>
        ))}
      </nav>

      <header className="irn-masthead">
        <Link to="/internal/reports">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" className="irn-masthead-logo" />
          <span>← Back to reports</span>
        </Link>
        <span className="irn-masthead-tag">{report.date_range}</span>
      </header>

      {/* ACT 0 — cover */}
      <header className="irn-act irn-cover" id="irn-open">
        <div className="irn-glow a" aria-hidden="true" />
        <div className="irn-glow b" aria-hidden="true" />
        <div className="irn-glow c" aria-hidden="true" />
        <div className="irn-gridtex" aria-hidden="true" />
        <div className="irn-wrap">
          <div className="irn-brandbar">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" className="irn-brandmark" />
            <span className="irn-dotsep">/</span>
            <em>Western North Carolina</em>
          </div>
          <h1>{headline}</h1>
          <p className="irn-sub">
            A short story about where {monthLabel(report.period)} went on Facebook and Instagram, told in the order it happened.
          </p>
          <div className="irn-meta-row">
            <span className="irn-pill">Social media report</span>
            <span className="irn-pill">{monthYearLabel(report.period)}</span>
            <span className="irn-pill">Internal &amp; funder copy</span>
          </div>
          <div className="irn-scrollcue" aria-hidden="true">
            <span className="bar" />
            Scroll to begin
          </div>
        </div>
      </header>

      {/* ACT 1 — the number */}
      <section className="irn-act irn-hero-scene" id="irn-hero" aria-labelledby="irn-hero-h" ref={heroRef}>
        <div className="irn-stage" ref={stageRef}>
          <motion.div className="irn-stage-inner" style={{ scale: reduceMotion ? 1 : stageScale }}>
            <DailyArcSvg daily={daily} />

            <h2 id="irn-hero-h" className={`irn-bignum irn-num ${lit ? 'is-lit' : ''}`}>
              {bignumDisplay}
            </h2>
            <p className="irn-bignum-label">views in {monthLabel(report.period)}</p>

            <div className={`irn-stage-line ${s1 ? 'is-s1' : ''}`}>
              <DeltaChip value={summary.total_views} previousValue={previousSummary?.total_views} />
              <span className="irn-chip irn-chip--plain">{fmt(summary.total_viewers)} viewers</span>
            </div>

            {(stageFootText || momentum) && (
              <p className={`irn-stage-foot ${s2 ? 'is-s2' : ''}`}>
                {stageFootText}
                {stageFootText && momentum ? ' ' : ''}
                {momentum && (
                  <>
                    But the shape of {monthLabel(report.period)} matters as much as the total.{' '}
                    <b>Its last seven days were its {momentum.changePercent >= 0 ? 'strongest' : 'quietest'}</b>, and that is where the
                    month's momentum sits.
                  </>
                )}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ACT 2 — the sentence */}
      <section className="irn-act irn-act--paper" id="irn-line" aria-labelledby="irn-line-h">
        <div className="irn-wrap">
          <Reveal>
            <p className="irn-kicker">The month in one sentence</p>
          </Reveal>
          <SentenceReveal id="irn-line-h" text={story} />
          <p className="irn-attrib">Every number here comes from the platform's own monthly export. Nothing is estimated or projected.</p>
        </div>
      </section>

      {/* ACT 3 — the beats */}
      {beats.length > 0 && (
        <section className="irn-act irn-act--paper" id="irn-beats" aria-labelledby="irn-beats-h" style={{ paddingTop: 0 }}>
          <div className="irn-wrap">
            <Reveal>
              <p className="irn-kicker">What actually moved</p>
            </Reveal>
            <Reveal>
              <h2 id="irn-beats-h" style={{ fontSize: 'clamp(1.4rem,3vw,2.1rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: 16, maxWidth: '22ch' }}>
                {beats.length === 1 ? 'One thing explains the shape of the month.' : `${beats.length === 2 ? 'Two things' : 'Three things'} explain the shape of the month.`}
              </h2>
            </Reveal>
            <div className="irn-beats">
              {beats.map((b, i) => (
                <Beat key={b.key} descriptor={b} flip={i % 2 === 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ACT 4 — momentum */}
      {momentum && (
        <MomentumAct report={report} momentum={momentum} monthName={monthLabel(report.period)} />
      )}

      {/* ACT 5 — the rest of the numbers */}
      <NumbersAct summary={summary} previousSummary={previousSummary} />

      {/* ACT 6 — funder line */}
      <section className="irn-act irn-act--funder" id="irn-funder" aria-labelledby="irn-fund-h">
        <div className="irn-wrap">
          <Reveal>
            <p className="irn-kicker">Ready to send</p>
          </Reveal>
          <h2 id="irn-fund-h" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Funder-facing summary
          </h2>
          <Reveal>
            <blockquote className="irn-quote">
              <p>{funderBlurb}</p>
              <p className="irn-sig">Draft language · review before external use</p>
              <button type="button" className="irn-copybtn" onClick={() => handleCopyFunder(funderBlurb)}>
                Copy this paragraph
              </button>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* APPENDIX */}
      <section className="irn-act irn-act--appendix" id="irn-appendix" aria-labelledby="irn-app-h">
        <div className="irn-wrap">
          <div className="irn-appendix-head">
            <div>
              <p className="irn-kicker">Appendix</p>
              <h2 id="irn-app-h">The numbers, plainly.</h2>
            </div>
            <div className="irn-btns">
              <button
                type="button"
                className="irn-btn"
                onClick={() => {
                  const blob = new Blob([summaryRowsToCsv(summaryRows)], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${report.report_type}-${report.period}-summary.csv`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  URL.revokeObjectURL(url);
                  say('CSV downloaded');
                }}
              >
                Download CSV
              </button>
              <button type="button" className="irn-btn irn-btn--solid" onClick={openPrintDialog}>
                <Printer size={15} aria-hidden="true" style={{ marginRight: 6, verticalAlign: -2 }} />
                Print / Save as PDF
              </button>
              {report.downloads.map((d) => (
                <DownloadButton key={d.storage_path} download={d} />
              ))}
            </div>
          </div>
          {printStatus && (
            <p role="status" aria-live="polite" style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--irn-muted)' }}>
              {printStatus}
            </p>
          )}

          <div className="irn-tablewrap">
            <table className="irn-table">
              <caption>
                SparkPoint · {report.title} · {report.date_range}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">{monthYearLabel(report.period)}</th>
                  <th scope="col">Comparison</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                    <td className={`irn-delta-${row.delta}`}>{row.comparison}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="irn-table-details">
            <summary>
              <span>
                <span className="irn-caret" aria-hidden="true">▸</span> Day-by-day data
              </span>
              <button
                type="button"
                className="irn-btn"
                onClick={(e) => {
                  e.preventDefault();
                  downloadCsv(report);
                  say('Daily CSV downloaded');
                }}
              >
                Download daily CSV
              </button>
            </summary>
            <div className="irn-tablewrap">
              <table className="irn-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Views</th>
                    <th scope="col">Viewers</th>
                    <th scope="col">Visits</th>
                    <th scope="col">Interactions</th>
                    <th scope="col">Follows</th>
                    <th scope="col">Link clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((row) => (
                    <tr key={row.date}>
                      <td>{formatDay(row.date)}</td>
                      <td>{fmt(row.views)}</td>
                      <td>{fmt(row.viewers)}</td>
                      <td>{fmt(row.visits)}</td>
                      <td>{fmt(row.interactions)}</td>
                      <td>{fmt(row.follows)}</td>
                      <td>{fmt(row.link_clicks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </section>

      <footer className="irn-footer">
        <div className="irn-wrap">
          Source: platform-native insights export, {report.date_range}. Prepared for SparkPoint leadership, partners and funders.
          <br />
          Comparisons are month-over-month unless noted. Last-seven-days figures compare the final week of the month with the seven
          days before it, within the same month — a recency signal, not a monthly total.
          {history.length >= 2 &&
            (() => {
              const sorted = [...history].sort((a, b) => a.period.localeCompare(b.period));
              const first = sorted[0].summary.total_views;
              const last = sorted[sorted.length - 1].summary.total_views;
              const trendWord = last > first ? 'grown' : last < first ? 'declined' : 'held steady';
              const breakdown = sorted.map((m) => `${monthLabel(m.period)} ${fmt(m.summary.total_views)}`).join(', ');
              return (
                <>
                  <br />
                  Total views have {trendWord} across the last {sorted.length} months ({breakdown}).
                  {followsBeat &&
                    !followsBeat.isSteady &&
                    ' New-follow counts are reported as-is: one month carried most of the total, not an even trend line.'}
                </>
              );
            })()}
        </div>
      </footer>

      <div className={`irn-toast ${toast ? 'is-shown' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>

      {printing &&
        createPortal(
          <div className="ir-print-root" aria-hidden="true">
            <PrintReportPage
              title={report.title}
              dateRange={report.date_range}
              summary={report.summary}
              dailyMetrics={report.daily_metrics}
              insights={insights.map((i) => i.text)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

function SentenceReveal({ id, text }: { id: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <h2 id={id} ref={ref} className={`irn-sentence ${inView || reduceMotion ? 'is-in' : ''}`}>
      <SplitSentence text={text} />
    </h2>
  );
}

function MomentumAct({
  report,
  momentum,
  monthName,
}: {
  report: ReportSnapshot;
  momentum: Momentum;
  monthName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduceMotion = useReducedMotion() ?? false;
  const isIn = inView || reduceMotion;
  const up = momentum.changePercent >= 0;
  const sorted = [...report.daily_metrics].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const prior7 = sorted.slice(-14, -7);
  const shareOfMonth = report.summary.total_views > 0 ? (momentum.recentViews / report.summary.total_views) * 100 : 0;

  const recentDisplay = useCountUp(momentum.recentViews, isIn, 1600);
  const priorDisplay = useCountUp(momentum.priorViews, isIn, 1400);

  return (
    <section className="irn-act irn-act--momentum" id="irn-momentum" aria-labelledby="irn-mom-h" ref={ref}>
      <div className="irn-wrap">
        <Reveal>
          <p className="irn-kicker">Where it stands right now</p>
        </Reveal>
        <div className="irn-mom">
          <Reveal>
            <div>
              <h2 id="irn-mom-h">
                The last seven days were the <em>{up ? 'fastest' : 'quietest'} week</em> of the month.
              </h2>
              <p>
                {fmt(momentum.recentViews)} views between {formatDay(last7[0].date)} and {formatDay(last7[last7.length - 1].date)}, {up ? 'up' : 'down'}{' '}
                {Math.abs(Math.round(momentum.changePercent))}% on the {fmt(momentum.priorViews)} views of the week before.{' '}
                {shareOfMonth >= 15 && `About ${Math.round(shareOfMonth)}% of the month's entire reach landed in its final seven days.`}
              </p>
            </div>
          </Reveal>

          <div className={`irn-trackset ${isIn ? 'is-in' : ''}`}>
            <div className="irn-track irn-track--muted">
              <div className="irn-track-top">
                <span className="irn-track-name">
                  {formatDay(prior7[0]?.date ?? last7[0].date)}&ndash;{formatDay(prior7[prior7.length - 1]?.date ?? last7[0].date)}
                </span>
                <span className="irn-track-val irn-num">{priorDisplay}</span>
              </div>
              <div className="irn-track-rail">
                <div className="irn-track-fill is-prev" style={{ width: `${Math.min(100, (momentum.priorViews / Math.max(momentum.recentViews, momentum.priorViews)) * 100)}%` }} />
              </div>
            </div>
            <div className="irn-track">
              <div className="irn-track-top">
                <span className="irn-track-name">
                  {formatDay(last7[0].date)}&ndash;{formatDay(last7[last7.length - 1].date)}
                </span>
                <span className="irn-track-val irn-num">{recentDisplay}</span>
              </div>
              <div className="irn-track-rail">
                <div className="irn-track-fill is-now" style={{ width: `${Math.min(100, (momentum.recentViews / Math.max(momentum.recentViews, momentum.priorViews)) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumbersAct({ summary, previousSummary }: { summary: ReportSummary; previousSummary: ReportSummary | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduceMotion = useReducedMotion() ?? false;
  const isIn = inView || reduceMotion;

  const cells: { k: string; v: number; prev?: number; accent?: boolean }[] = [
    { k: 'Interactions', v: summary.total_interactions, prev: previousSummary?.total_interactions, accent: true },
    { k: 'Viewers', v: summary.total_viewers, prev: previousSummary?.total_viewers },
    { k: 'Profile visits', v: summary.total_visits, prev: previousSummary?.total_visits },
    { k: 'Link clicks', v: summary.total_link_clicks, prev: previousSummary?.total_link_clicks },
    { k: 'New follows', v: summary.new_follows, prev: previousSummary?.new_follows },
  ];

  return (
    <section className="irn-act irn-act--paper" id="irn-numbers" aria-labelledby="irn-num-h" ref={ref}>
      <div className="irn-wrap">
        <Reveal>
          <p className="irn-kicker">The rest of the board</p>
        </Reveal>
        <Reveal>
          <h2 id="irn-num-h" style={{ fontSize: 'clamp(1.4rem,3vw,2.1rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: 16, maxWidth: '22ch' }}>
            Everything else we tracked.
          </h2>
        </Reveal>

        <div className={`irn-grid5 ${isIn ? 'is-in' : ''}`}>
          {cells.map((c, i) => (
            <div className="irn-cell" key={c.k} style={{ ['--irn-i' as string]: i }}>
              <p className="irn-cell-k">{c.k}</p>
              <p className="irn-cell-v irn-num" style={c.accent ? { color: 'var(--irn-purple)' } : undefined}>
                {fmt(c.v)}
              </p>
              {c.prev != null && <p className="irn-cell-n">Last month: {fmt(c.prev)}</p>}
            </div>
          ))}
        </div>

        {summary.total_audience != null && (
          <div className={`irn-goal ${isIn ? 'is-in' : ''}`}>
            <div className="irn-goal-head">
              <div>
                <p className="irn-cell-k">Total audience</p>
                <p className="irn-goal-now irn-num">
                  {fmt(summary.total_audience)}
                  <small>followers</small>
                </p>
              </div>
              <p className="irn-goal-target">Goal: {fmt(FOLLOWER_GOAL)}</p>
            </div>
            <div
              className="irn-goal-rail"
              role="img"
              aria-label={`${fmt(summary.total_audience)} of a ${fmt(FOLLOWER_GOAL)}-follower goal, about ${Math.round((summary.total_audience / FOLLOWER_GOAL) * 100)} percent.`}
            >
              <div className="irn-goal-fill" style={{ width: `${Math.min(100, (summary.total_audience / FOLLOWER_GOAL) * 100)}%` }} />
            </div>
            <div className="irn-goal-ticks">
              <span>0</span>
              <span>{fmt(Math.max(0, FOLLOWER_GOAL - summary.total_audience))} to go</span>
              <span>{fmt(FOLLOWER_GOAL)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function InternalReportDashboardPage() {
  return (
    <RequireInternalAuth>
      <DashboardContent />
    </RequireInternalAuth>
  );
}
