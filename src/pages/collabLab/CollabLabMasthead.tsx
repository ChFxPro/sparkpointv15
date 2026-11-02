import { Link } from 'react-router';
import phfLogo from '../../assets/collab-lab/phf-logo.webp';

// The strip across the top of both Collaboration Lab pages. The Collaboration Lab is
// Pisgah Health Foundation's program, so their logo leads, in full colour on the light
// paper. SparkPoint made the photos, video, and this page, and is credited at the side
// (PHF's ask, Cara Bradshaw, 2026-11-02: a board member read the page as a SparkPoint
// event on a phone).

const SPARKPOINT_LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;

export function CollabLabMasthead() {
  return (
    <header className="clb-masthead">
      <div className="rh-shell clb-masthead-inner">
        <a className="clb-masthead-host" href="https://pisgahhealthfoundation.org" target="_blank" rel="noopener noreferrer">
          <img src={phfLogo} alt="Pisgah Health Foundation (opens in a new tab)" width={720} height={266} />
        </a>
        <p className="clb-masthead-credit">
          <span>Photos &amp; video by</span>
          <Link to="/" aria-label="SparkPoint home">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" width={839} height={290} />
          </Link>
        </p>
      </div>
    </header>
  );
}
