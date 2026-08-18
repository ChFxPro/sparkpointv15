import { ArrowUpRight, CircleAlert, Download } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { RequireInternalAuth } from '../components/RequireInternalAuth';
import { useInternalAuth } from '../hooks/useInternalAuth';
import { useRemainingSeats } from '../hooks/useRemainingSeats';
import {
  COMMS_GRAPHICS,
  COMMS_PLAN,
  COMMS_PLAN_AS_OF,
  CONVENING_ASSETS,
  CONVENING_DECISIONS,
  CONVENING_DECISIONS_SYNCED_AT,
  CONVENING_EVENT_DATE,
  CONVENING_EXPECTED_ATTENDANCE,
  CONVENING_REGISTRATION_NOTE,
  CONVENING_SPONSORS,
  CONVENING_VENUE,
} from '../data/convening';
import './backstage.css';

const PAGE_PATH = '/internal/convening';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;
const NCRHA_LOGO = `${BASE}assets/Rural%20Health/${encodeURIComponent('NCRHA-Logo.webp')}`;
const FHLI_LOGO = `${BASE}assets/Rural%20Health/${encodeURIComponent('FHLI Logo.webp')}`;

function daysUntil(isoDate: string) {
  const target = new Date(isoDate).getTime();
  return Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ConveningContent() {
  const { signOut, user } = useInternalAuth();
  const remainingSeats = useRemainingSeats();
  const days = daysUntil(CONVENING_EVENT_DATE);

  const now = Date.now();
  const upcoming = COMMS_PLAN.filter((item) => new Date(item.date).getTime() >= now);
  const nextSend = upcoming[0];

  return (
    <div className="bs-page">
      <SEOHead
        title="Convening Workspace — SparkPoint"
        description="Shared co-organizer workspace for the 2026 WNC Regional Rural Health Convening."
        path={PAGE_PATH}
        noindex
      />

      <header className="bs-masthead">
        <Link className="bs-masthead-logo" to="/internal">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" />
        </Link>
        <div className="bs-identity">
          <span className="bs-identity-text">{user?.email}</span>
          <button type="button" className="bs-text-button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </header>

      <div className="bs-console">
        <div className="bs-glow" aria-hidden="true" />

        <div className="bs-inner">
          <section className="bs-hero">
            <span className="bs-eyebrow">SparkPoint · NCRHA · FHLI</span>
            <h1>Convening workspace</h1>
            <p>
              Shared working surface for the 2026 WNC Regional Rural Health Convening —{' '}
              {formatDate(CONVENING_EVENT_DATE)} at {CONVENING_VENUE}, {CONVENING_EXPECTED_ATTENDANCE}.
            </p>
            <div className="bs-coorg-marks">
              <img src={NCRHA_LOGO} alt="NC Rural Health Association" />
              <img src={FHLI_LOGO} alt="Foundation for Health Leadership &amp; Innovation" />
            </div>
          </section>

          <div className="bs-stat-row">
            <div className="bs-stat">
              <strong>{days > 0 ? days : 0}</strong>
              <span>days until the convening</span>
            </div>
            <div className="bs-stat">
              <strong>{remainingSeats ?? '—'}</strong>
              <span>{remainingSeats === null ? 'seat count loading' : 'seats remaining'}</span>
            </div>
            <div className="bs-stat">
              <strong>{CONVENING_DECISIONS.length}</strong>
              <span>decisions still open</span>
            </div>
            <div className="bs-stat">
              <strong>{nextSend ? shortDate(nextSend.date) : '—'}</strong>
              <span>{nextSend ? `next: ${nextSend.label}` : 'no sends scheduled'}</span>
            </div>
          </div>

          <section className="bs-lane" data-accent="orange" aria-labelledby="bs-decisions">
            <div className="bs-lane-head">
              <div>
                <h2 id="bs-decisions">Open decisions</h2>
                <p>
                  What still needs a call from one of the three organizations. Reconciled against
                  the planning board on {CONVENING_DECISIONS_SYNCED_AT}.
                </p>
              </div>
              <span className="bs-access-chip">Needs input</span>
            </div>
            <ul className="bs-decision-list">
              {CONVENING_DECISIONS.map((decision) => (
                <li key={decision.id} className="bs-decision">
                  <div className="bs-decision-head">
                    <h3>{decision.question}</h3>
                    <span className="bs-decision-source">{decision.source}</span>
                  </div>
                  <p>{decision.detail}</p>
                  <div className="bs-decision-meta">
                    {decision.owner ? (
                      <span className="bs-chip bs-chip-requires">{decision.owner}</span>
                    ) : (
                      <span className="bs-chip bs-chip-unowned">
                        <CircleAlert aria-hidden="true" /> Needs an owner
                      </span>
                    )}
                    {decision.neededBy && (
                      <span className="bs-card-meta">Needed by {decision.neededBy}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bs-lane" data-accent="gold" aria-labelledby="bs-assets">
            <div className="bs-lane-head">
              <div>
                <h2 id="bs-assets">Print &amp; promo package</h2>
                <p>
                  Current print masters — pull these for your own channels rather than asking for
                  a copy. {CONVENING_REGISTRATION_NOTE}
                </p>
              </div>
              <span className="bs-access-chip">Download</span>
            </div>
            <div className="bs-card-grid">
              {CONVENING_ASSETS.map((asset) => (
                <div key={asset.id} className="bs-card is-open">
                  <div className="bs-card-head">
                    <h3>{asset.title}</h3>
                    <Download className="bs-card-arrow" aria-hidden="true" />
                  </div>
                  <p className="bs-card-body">{asset.description}</p>
                  <div className="bs-card-foot">
                    <span className="bs-card-meta">{asset.format}</span>
                    <div className="bs-asset-actions">
                      <a href={asset.href} download>
                        PDF for print
                      </a>
                      {asset.pngHref && (
                        <a href={asset.pngHref} download>
                          PNG for social
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bs-lane" data-accent="pink" aria-labelledby="bs-comms">
            <div className="bs-lane-head">
              <div>
                <h2 id="bs-comms">Communications schedule</h2>
                <p>
                  The joint NCRHA/FHLI + SparkPoint plan, as of {formatDate(COMMS_PLAN_AS_OF)}.
                  Graphics called for: {COMMS_GRAPHICS.join(', ')}.
                </p>
              </div>
              <span className="bs-access-chip">{upcoming.length} upcoming</span>
            </div>
            <ol className="bs-comms-list">
              {COMMS_PLAN.map((item) => {
                const past = new Date(item.date).getTime() < Date.now();
                return (
                  <li key={item.id} className={`bs-comms-item${past ? ' is-past' : ''}`}>
                    <time dateTime={item.date}>{shortDate(item.date)}</time>
                    <div className="bs-comms-body">
                      <h3>{item.label}</h3>
                      <span className="bs-comms-channel">{item.channel}</span>
                      {item.note && <p>{item.note}</p>}
                    </div>
                    <div className="bs-comms-owner">
                      {item.owner ? (
                        <span className="bs-chip bs-chip-requires">{item.owner}</span>
                      ) : (
                        <span className="bs-chip bs-chip-unowned">
                          <CircleAlert aria-hidden="true" /> Unassigned
                        </span>
                      )}
                      {item.needsConfirmation && (
                        <span className="bs-chip bs-chip-soon">Confirm</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="bs-lane" data-accent="purple" aria-labelledby="bs-sponsors">
            <div className="bs-lane-head">
              <div>
                <h2 id="bs-sponsors">Sponsors</h2>
                <p>Confirmed supporters as they appear on the current print materials.</p>
              </div>
              <span className="bs-access-chip">Confirmed</span>
            </div>
            <ul className="bs-sponsor-list">
              {CONVENING_SPONSORS.map((sponsor) => (
                <li key={sponsor.name}>
                  {sponsor.url ? (
                    <a href={sponsor.url} target="_blank" rel="noreferrer noopener">
                      {sponsor.name}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="bs-sponsor-name">{sponsor.name}</span>
                  )}
                  <span className="bs-sponsor-tier">{sponsor.tier}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bs-share-contact">
            <h2>Also here</h2>
            <p>
              The <Link to="/internal/status">live planning board</Link> carries workstream status
              and ownership. It is an open link, so it deliberately holds no sponsor or
              registration detail — that lives on this page instead, behind sign-in.
            </p>
          </section>
        </div>
      </div>

      <footer className="bs-footer">
        <Link to="/internal">Backstage</Link>
        <span>Co-organizer workspace — please don’t forward downloads outside the three organizations.</span>
      </footer>
    </div>
  );
}

export default function ConveningWorkspacePage() {
  return (
    <RequireInternalAuth access="shared">
      <ConveningContent />
    </RequireInternalAuth>
  );
}
