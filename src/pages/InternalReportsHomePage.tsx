import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { RequireInternalAuth } from '../components/RequireInternalAuth';
import { useInternalAuth } from '../hooks/useInternalAuth';
import { supabase } from '../lib/supabaseClient';
import './internalReports.css';

const PAGE_PATH = '/internal/reports';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

interface ReportListItem {
  report_type: string;
  period: string;
  title: string;
  date_range: string;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  social_media: 'Social media',
};

function useReportList() {
  const [reports, setReports] = useState<ReportListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('report_snapshots')
      .select('report_type, period, title, date_range')
      .order('period', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError('Could not load reports right now.');
          return;
        }
        setReports(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { reports, error };
}

function ReportsHomeContent() {
  const { signOut } = useInternalAuth();
  const { reports, error } = useReportList();

  return (
    <div className="ir-page">
      <SEOHead
        title="Internal Reports — SparkPoint"
        description="Internal reports portal for SparkPoint leadership and partners."
        path={PAGE_PATH}
        noindex
      />

      <header className="ir-masthead">
        <Link className="ir-back-link" to="/internal">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" style={{ height: 22 }} />
          <span>Backstage</span>
        </Link>
        <button type="button" className="ir-forgot-link" style={{ marginTop: 0 }} onClick={() => void signOut()}>
          Sign out
        </button>
      </header>

      <div className="ir-hero-band">
        <div className="ir-hero-band-inner">
          <span className="ir-eyebrow">SparkPoint</span>
          <h1>Internal reports</h1>
          <p>Data for leadership and partners — pick a report to view details and download it.</p>
        </div>
      </div>

      <div className="ir-shell">
        {error && (
          <p className="ir-error" role="alert" style={{ marginTop: 32 }}>
            {error}
          </p>
        )}

        {reports === null && !error && <div className="ir-loading">Loading reports…</div>}

        {reports && reports.length === 0 && (
          <div className="ir-empty-state">No reports have been published yet.</div>
        )}

        {reports && reports.length > 0 && (
          <div className="ir-card-grid">
            {reports.map((report) => (
              <Link
                key={`${report.report_type}-${report.period}`}
                className="ir-report-card"
                to={`/internal/reports/${report.report_type}/${report.period}`}
              >
                <span className="ir-report-card-eyebrow">
                  {REPORT_TYPE_LABELS[report.report_type] ?? report.report_type}
                </span>
                <h2>{report.title}</h2>
                <p>{report.date_range}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InternalReportsHomePage() {
  return (
    <RequireInternalAuth>
      <ReportsHomeContent />
    </RequireInternalAuth>
  );
}
