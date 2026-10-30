import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { CopyButton } from '../components/photoShare/photoShareKit';
import media from '../data/collabLabMedia.json';
import { VideoCard, broll } from './collabLab/VideoCard';
import './ruralHealthConvening.css';
import './ruralHealthPhotoShare.css';
import './collabLabMedia.css';

// Editors' b-roll page for the Collaboration Lab (/collaboration-lab/media/b-roll).
// The clips are for the people cutting their own videos, mainly Pisgah Health
// Foundation's editors, so they live here rather than on the public media page.
// Unlisted like that page: noindex, in UNLISTED in scripts/prerender.mjs, and linked
// from nowhere; share the address directly. Files are 1080p in the `event-media`
// bucket (`npm run collab:video`); never mention 4K here (owner's call, 2026-10-29).

const PAGE_PATH = '/collaboration-lab/media/b-roll';
const SPARKPOINT_LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;
const { creditLine, contactEmail } = media;

export function CollabLabBrollPage() {
  return (
    <div className="rh-page rhp-page clb-page clb-broll-page">
      <SEOHead
        title="B-roll · Collaboration Lab | SparkPoint"
        description="B-roll clips from the Collaboration Lab: Building Partnerships That Last, October 23, 2026 in Brevard, NC, for editors."
        path={PAGE_PATH}
        image="/assets/collab-lab/media-og.jpg"
        imageAlt="The Collaboration Lab in Brevard, NC"
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        noindex
      />

      <header className="clb-masthead">
        <div className="rh-shell clb-masthead-inner">
          <Link to="/" className="clb-masthead-logo" aria-label="SparkPoint home">
            <img src={SPARKPOINT_LOGO} alt="SparkPoint" width={839} height={290} />
          </Link>
          <p className="clb-masthead-date">
            <strong>October 23, 2026</strong>
            <span>Mary C. Jenkins Community &amp; Cultural Center · Brevard, NC</span>
          </p>
        </div>
      </header>

      <main id="main-content">
        <section className="clb-act clb-act-create" aria-labelledby="clb-broll-title">
          <div className="rh-shell">
            <header className="clb-act-head">
              <p className="clb-act-label">Collaboration Lab · For editors</p>
              <h1 id="clb-broll-title">B-roll from the morning</h1>
              <div className="clb-act-intro">
                <p>
                  Clips to cut into your own videos and posts. Tap one to watch a small preview; the download is the
                  full-quality 1080p file. The photos and the full program recordings are on the{' '}
                  <Link to="/collaboration-lab/media">Collaboration Lab media page</Link>.
                </p>
              </div>
            </header>

            <ul className="clb-video-list">
              {broll.map((video) => (
                <VideoCard key={video.id} video={video} download />
              ))}
            </ul>
          </div>
        </section>

        <section className="rhp-guide" aria-labelledby="clb-broll-guide-title">
          <div className="rh-shell rhp-guide-grid">
            <div>
              <h2 id="clb-broll-guide-title">Using the clips</h2>
              <ul className="rhp-usage">
                {media.usage.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="rhp-guide-foot">
                Need a different cut, or something we haven't posted? Email{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </div>
            <div className="rhp-guide-cards">
              <div className="rhp-guide-card">
                <p className="rhp-guide-label">Credit line</p>
                <p className="rhp-guide-credit">{creditLine}</p>
                <CopyButton text={creditLine} label="Copy credit" copiedLabel="Credit copied" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="rh-colophon">
        <div className="rh-shell">
          <Link to="/collaboration-lab/media">
            <ArrowLeft aria-hidden="true" size={16} />
            Collaboration Lab media page
          </Link>
          <p>{creditLine}.</p>
        </div>
      </footer>
    </div>
  );
}

export default CollabLabBrollPage;
