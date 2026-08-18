import { ArrowUpRight } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { findPartnerShare } from '../data/partnerShares';
import './backstage.css';

const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

export default function PartnerSharePage() {
  const { partnerSlug } = useParams();
  const share = findPartnerShare(partnerSlug);

  /* An unknown slug goes to Backstage rather than a 404 — a partner with a
     mistyped or retired link lands somewhere that explains itself. */
  if (!share) {
    return <Navigate to="/internal" replace />;
  }

  return (
    <div className="bs-page">
      <SEOHead
        title={`SparkPoint + ${share.shortName}`}
        description={`Shared planning material prepared for ${share.org}.`}
        path={`/internal/share/${share.slug}`}
        noindex
      />

      <header className="bs-masthead">
        <Link className="bs-masthead-logo" to="/">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" />
        </Link>
        <span className="bs-masthead-tag">Prepared for {share.shortName}</span>
      </header>

      <div className="bs-console">
        <div className="bs-glow" aria-hidden="true" />

        <div className="bs-inner">
          <section className="bs-hero bs-share-hero">
            {share.logo && (
              <img className="bs-share-logo" src={share.logo} alt={`${share.org} logo`} />
            )}
            <span className="bs-eyebrow">SparkPoint + {share.shortName}</span>
            <h1 className="bs-share-title">{share.org}</h1>
            <p>{share.intro}</p>
          </section>

          <section className="bs-lane" data-accent="gold" aria-labelledby="bs-share-items">
            <div className="bs-lane-head">
              <div>
                <h2 id="bs-share-items">Shared with you</h2>
                <p>Everything on this page is current as of the moment you open it.</p>
              </div>
              <span className="bs-access-chip">Open link</span>
            </div>
            <div className="bs-card-grid">
              {share.items.map((item) => (
                <Link key={item.to} className="bs-card is-open" to={item.to}>
                  <div className="bs-card-head">
                    <h3>{item.title}</h3>
                    <ArrowUpRight className="bs-card-arrow" aria-hidden="true" />
                  </div>
                  <p className="bs-card-body">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bs-share-contact">
            <h2>Questions about anything here?</h2>
            <p>
              Reach {share.contactName} at{' '}
              <a href={`mailto:${share.contactEmail}`}>{share.contactEmail}</a>. If you need
              something that isn’t on this page, just ask — we’ll add it here rather than send a
              file that goes stale.
            </p>
          </section>
        </div>
      </div>

      <footer className="bs-footer">
        <Link to="/">SparkPoint</Link>
        <span>
          This page is unlisted and not indexed. Please don’t forward the link outside{' '}
          {share.shortName}.
        </span>
      </footer>
    </div>
  );
}
