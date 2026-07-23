import { Dna, HeartPulse } from 'lucide-react';
import { KNOW_YOUR_NUMBERS } from '../../data/knowYourNumbers';

export function OnlineGuide() {
  return (
    <section className="kyn-guide" aria-labelledby="kyn-guide-title">
      <div className="kyn-guide-hero">
        <div>
          <span className="kyn-eyebrow">Metabolic health field guide</span>
          <h1 id="kyn-guide-title">{KNOW_YOUR_NUMBERS.title}</h1>
          <p className="kyn-guide-subtitle">{KNOW_YOUR_NUMBERS.subtitle}</p>
        </div>
        <span className="kyn-hero-mark" aria-hidden="true">
          07
        </span>
      </div>

      <p className="kyn-introduction">{KNOW_YOUR_NUMBERS.introduction}</p>

      <div className="kyn-metric-groups">
        {KNOW_YOUR_NUMBERS.groups.map((group) => (
          <section className={`kyn-metric-group kyn-metric-group--${group.id}`} key={group.id}>
            <h2>{group.title}</h2>
            <div className="kyn-metric-list">
              {group.metrics.map((metric) => (
                <article
                  className={`kyn-metric${metric.featured ? ' kyn-metric--featured' : ''}`}
                  key={metric.number}
                >
                  <span className="kyn-metric-number" aria-hidden="true">
                    {String(metric.number).padStart(2, '0')}
                  </span>
                  <div className="kyn-metric-copy">
                    <h3>{metric.name}</h3>
                    <p>{metric.description}</p>
                  </div>
                  <div className="kyn-metric-reading">
                    <strong>{metric.value}</strong>
                    <span>{metric.preferred}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="kyn-apoe-note">
        <span className="kyn-apoe-icon" aria-hidden="true">
          <Dna size={22} />
        </span>
        <div>
          <h2>An APOE conversation</h2>
          <p>{KNOW_YOUR_NUMBERS.apoeNote}</p>
        </div>
        <HeartPulse className="kyn-apoe-pulse" size={36} aria-hidden="true" />
      </aside>
    </section>
  );
}
