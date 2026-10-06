import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

// Masthead for the unlisted photo-share page, matching the convening recap's header
// (the recap keeps its own inline copy). Styles are the `.rh-masthead*` rules in
// ruralHealthConvening.css.

const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

export function ruralHealthAsset(filename: string) {
  return `${BASE}assets/Rural%20Health/${encodeURIComponent(filename)}`;
}

export function RuralHealthMasthead({
  backTo = '/',
  backLabel = 'Back to SparkPoint',
  backAriaLabel = 'Back to SparkPoint home',
}: {
  backTo?: string;
  backLabel?: string;
  backAriaLabel?: string;
}) {
  return (
    <header className="rh-masthead">
      <div className="rh-shell rh-masthead-inner">
        <Link className="rh-back-link" to={backTo} aria-label={backAriaLabel}>
          <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>{backLabel}</span>
        </Link>

        <div className="rh-brand-lockup" aria-label="SparkPoint presents the 2026 WNC Regional Rural Health Convening">
          <img className="rh-back-logo" src={SPARKPOINT_LOGO} alt="SparkPoint" width={839} height={290} />
          <span aria-hidden="true">presents</span>
          <img
            className="rh-event-mark"
            src={ruralHealthAsset('NC Rural Health Convening trimmed.webp')}
            alt="2026 WNC Regional Rural Health Convening"
            width={2677}
            height={1494}
          />
        </div>

        <div className="rh-masthead-date" aria-label="Event date and location">
          <strong>October 1, 2026</strong>
          <span>Deerwoode Reserve</span>
          <span>Brevard, North Carolina</span>
        </div>
      </div>
    </header>
  );
}
