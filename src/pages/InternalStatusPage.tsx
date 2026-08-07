import '@fontsource-variable/fraunces';

import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { useRemainingSeats } from '../hooks/useRemainingSeats';
import {
  EVENT_PLANNING_BOARD,
  EVENT_PLANNING_SYNCED_AT,
  RURAL_HEALTH_EVENT_DATE,
  type MondayStatus,
} from '../data/opsStatus';
import './internalStatus.css';

const PAGE_PATH = '/internal/status';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;
const WNC_EVENT_MARK = `${BASE}assets/Rural%20Health/${encodeURIComponent('NC Rural Health Convening trimmed.webp')}`;

function daysUntil(isoDate: string) {
  const target = new Date(isoDate).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function statusDotClass(status: MondayStatus) {
  switch (status) {
    case 'In Progress':
      return 'is-status-dot is-status-dot-in-progress';
    case 'Done':
      return 'is-status-dot is-status-dot-done';
    case 'Stuck':
      return 'is-status-dot is-status-dot-stuck';
    default:
      return 'is-status-dot is-status-dot-not-started';
  }
}

function statusLabel(status: MondayStatus) {
  return status ?? 'Not started';
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function InternalStatusPage() {
  const remainingSeats = useRemainingSeats();
  const days = daysUntil(RURAL_HEALTH_EVENT_DATE);

  return (
    <div className="is-page">
      <SEOHead
        title="2026 WNC Regional Rural Health Convening — Planning Status"
        description="Planning status for the 2026 WNC Regional Rural Health Convening."
        path={PAGE_PATH}
        noindex
      />

      <div className="is-shell">
        <header className="is-masthead">
          <Link className="is-back-link" to="/">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>Back to SparkPoint</span>
          </Link>
          <span className="is-masthead-tag">Planning status</span>
        </header>

        <section className="is-hero">
          <div className="is-brand-lockup" aria-hidden="true">
            <img className="is-sparkpoint-logo" src={SPARKPOINT_LOGO} alt="" width={839} height={290} />
            <span>presents</span>
            <img className="is-event-mark" src={WNC_EVENT_MARK} alt="" width={2677} height={1494} />
          </div>
          <h1>2026 WNC Regional Rural Health Convening</h1>
          <p>Where things stand as we build toward October 1.</p>
        </section>

        <section className="is-metrics">
          <div className="is-metric">
            <strong>{days >= 0 ? days : 0}</strong>
            <span>Days to the convening</span>
          </div>
          <div className="is-metric">
            <strong>{remainingSeats === null ? '—' : remainingSeats}</strong>
            <span>General registration seats remaining</span>
          </div>
        </section>

        <div className="is-section-heading">
          <h2>Event planning</h2>
          <span className="is-synced-at">As of {formatDate(EVENT_PLANNING_SYNCED_AT)}</span>
        </div>

        <div className="is-board">
          {EVENT_PLANNING_BOARD.map((group) => (
            <div className="is-board-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul className="is-board-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <span className={statusDotClass(item.status)} aria-hidden="true" />
                    <span>
                      <span className="is-item-name">{item.name}</span>
                      <small className="is-item-due">
                        {statusLabel(item.status)}
                        {item.dueDate ? ` · ${formatDate(item.dueDate)}` : ''}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="is-footnote">SparkPoint · 2026 WNC Regional Rural Health Convening</p>
      </div>
    </div>
  );
}

export default InternalStatusPage;
