import { SEOHead } from '../components/SEOHead';
import { useRemainingSeats } from '../hooks/useRemainingSeats';
import {
  HIGH_PRIORITY,
  ONGOING_PROJECTS,
  RURAL_HEALTH_EVENT_DATE,
  SHOW_RURAL_HEALTH_SEATS_TICKER,
  type OpsItem,
} from '../data/opsStatus';
import './internalStatus.css';

const PAGE_PATH = '/internal/status';

function daysUntil(isoDate: string) {
  const target = new Date(isoDate).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function OpsList({ title, items }: { title: string; items: OpsItem[] }) {
  return (
    <section className="is-section">
      <h2>{title}</h2>
      <ul className="is-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className={`is-status is-status-${item.status.toLowerCase()}`}>{item.status}</span>
            <span className="is-item-body">
              <strong>
                {item.id} — {item.title}
              </strong>
              {item.note ? <span className="is-item-note">{item.note}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function InternalStatusPage() {
  const remainingSeats = useRemainingSeats();
  const days = daysUntil(RURAL_HEALTH_EVENT_DATE);

  return (
    <div className="is-page">
      <SEOHead
        title="Internal Status"
        description="Internal SparkPoint status dashboard."
        path={PAGE_PATH}
        noindex
      />

      <header className="is-header">
        <h1>Internal status</h1>
        <p>Not linked anywhere on the public site. Edit src/data/opsStatus.ts to update.</p>
      </header>

      <section className="is-section is-metrics">
        <div className="is-metric">
          <strong>{days >= 0 ? days : 0}</strong>
          <span>days to the Rural Health Convening</span>
        </div>
        <div className="is-metric">
          <strong>{remainingSeats === null ? '—' : remainingSeats}</strong>
          <span>
            seats remaining (general pool)
            {!SHOW_RURAL_HEALTH_SEATS_TICKER && <em> — public ticker is currently OFF</em>}
          </span>
        </div>
      </section>

      <OpsList title="Ongoing projects" items={ONGOING_PROJECTS} />
      <OpsList title="High priority" items={HIGH_PRIORITY} />
    </div>
  );
}

export default InternalStatusPage;
