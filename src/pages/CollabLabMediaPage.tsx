import { useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, Clapperboard, Download, HardDrive, Mail, Play } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { PartnerLogoArt } from '../components/partners/PartnerLogoArt';
import { Sparkmark } from '../components/Sparkmark';
import { projectId } from '../utils/supabase/info';
import { CopyButton, photoLabel, storageDownload, usePhotoGallery, webp, type Gallery } from '../components/photoShare/photoShareKit';
import media from '../data/collabLabMedia.json';
import './ruralHealthConvening.css';
import './ruralHealthPhotoShare.css';
import './collabLabMedia.css';

// Unlisted media page for the Collaboration Lab: Building Partnerships That Last
// (October 23, 2026, Mary C. Jenkins Community & Cultural Center, Brevard), with
// Pisgah Health Foundation, Dogwood Health Trust, and FWRD Transylvania. Reached by
// direct link only — noindex, kept out of the sitemap (UNLISTED in prerender.mjs), and
// linked from nowhere on the site — but prerendered so a shared link unfurls.
//
// Photos work exactly like the convening photo page (the shared kit in
// src/components/photoShare/photoShareKit.tsx): `npm run collab:photos` resizes and
// uploads them and records them in src/data/collabLabMedia.json. Video is the
// `videos` array there, uploaded with `npm run collab:video`: the two program
// recordings as 1080p copies, and the b-roll clips as their camera originals with small
// silent previews to play on the page. The 4K program originals (51 GB and 19 GB) stay
// on the NAS; paste a share link into `original.url` to offer one here, otherwise the
// page offers them by email. Everything lives in the public-read `event-media` bucket
// under collaboration-lab-2026/. The page borrows the convening photo page's layout
// and retints it with the event's teal and gold (collabLabMedia.css).

type Video = (typeof media.videos)[number] & { preview?: string; original?: { label: string; bytes: number; url: string } };

const PAGE_PATH = '/collaboration-lab/media';
const BASE = `https://${projectId}.supabase.co/storage/v1/object/public/event-media/collaboration-lab-2026`;
const SPARKPOINT_LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;
const { creditLine, contactEmail } = media;
const videos = media.videos as Video[];
const programs = videos.filter((v) => v.kind === 'program');
const broll = videos.filter((v) => v.kind === 'broll');

// In a participant's voice, about the morning; no credit line (it travels with whatever
// is picked) and no thanks to SparkPoint.
const SUGGESTED_CAPTION =
  'Spent the morning at the Collaboration Lab in Brevard with nonprofit leaders from across Transylvania County: practical tools, local success stories, and a room full of people building partnerships that last.';

const gallery: Gallery = {
  photos: media.photos,
  sets: media.sets,
  base: BASE,
  filePrefix: 'clb',
  downloadPrefix: media.downloadPrefix,
  caption: SUGGESTED_CAPTION,
  zipNote: `Collaboration Lab: Building Partnerships That Last · October 23, 2026 · Brevard, NC\n\n${creditLine}.\n\n${media.usage.map((line) => `- ${line}`).join('\n')}\n`,
};
const { photos } = gallery;
const featured = photos[0];

const PARTNERS = ['Pisgah Health Foundation', 'Dogwood Health Trust', 'FWRD Transylvania (LTRG)'];

const size = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / 1e6))} MB`);
const length = (seconds: number) =>
  seconds >= 60 * 50 ? `${Math.round(seconds / 60)} min` : seconds >= 90 ? `${Math.round(seconds / 60)} min` : `${seconds} sec`;
const quality = (v: Video) => (v.width >= 3840 ? '4K' : `${v.height}p`);
const mailOriginal = (v: Video) =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(`Collaboration Lab video: ${v.title} (4K original)`)}`;

function VideoCard({ video, wide = false }: { video: Video; wide?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const uploaded = video.bytes > 0;
  // Programs stream the 1080p download itself; b-roll plays its small silent preview.
  const playSrc = `${BASE}/${video.preview ?? video.file}`;
  const titleId = `clb-video-${video.id}`;

  return (
    <li className={`clb-video${wide ? ' clb-video-wide' : ''}`} aria-labelledby={titleId}>
      <div className="clb-video-frame">
        {playing ? (
          <video
            ref={ref}
            src={playSrc}
            poster={`${BASE}/${video.poster}`}
            controls
            autoPlay
            playsInline
            preload="metadata"
            width={video.width}
            height={video.height}
            aria-label={video.title}
          />
        ) : (
          <button type="button" className="clb-video-play" onClick={() => setPlaying(true)} disabled={!uploaded}>
            <img src={`${BASE}/${video.poster}`} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="clb-video-play-icon" aria-hidden="true">
              <Play size={26} fill="currentColor" />
            </span>
            <span className="sr-only">
              {video.preview ? `Play a preview of ${video.title}` : `Play ${video.title}`}
            </span>
          </button>
        )}
      </div>
      <div className="clb-video-body">
        <p className="clb-video-meta">
          {length(video.duration)} · {quality(video)}
          {video.preview ? ' · preview plays here' : ''}
        </p>
        <h3 id={titleId}>{video.title}</h3>
        <p className="clb-video-note">{video.note}</p>
        <div className="clb-video-actions">
          {uploaded ? (
            <a className="rhp-action rhp-action-solid" href={storageDownload(`${BASE}/${video.file}`, video.file)}>
              <Download aria-hidden="true" size={17} />
              Download {quality(video)} · {size(video.bytes)}
            </a>
          ) : (
            <span className="clb-video-soon">Download coming soon</span>
          )}
          {video.original &&
            (video.original.url ? (
              <a className="rhp-action" href={video.original.url} target="_blank" rel="noreferrer">
                <HardDrive aria-hidden="true" size={17} />
                {video.original.label} · {size(video.original.bytes)}
              </a>
            ) : (
              <a className="rhp-action" href={mailOriginal(video)}>
                <Mail aria-hidden="true" size={17} />
                Ask for the {video.original.label} ({size(video.original.bytes)})
              </a>
            ))}
        </div>
      </div>
    </li>
  );
}

export function CollabLabMediaPage() {
  const { grid, overlays, openPhoto, hasSelection } = usePhotoGallery(gallery);

  return (
    <div className={`rh-page rhp-page clb-page${hasSelection ? ' has-tray' : ''}`}>
      <SEOHead
        title="Photos & video · Collaboration Lab | SparkPoint"
        description="Photos and video from the Collaboration Lab: Building Partnerships That Last, October 23, 2026 in Brevard, NC. Free to download and share with credit."
        path={PAGE_PATH}
        image="/assets/collab-lab/media-og.jpg"
        imageAlt={featured?.alt ?? 'The Collaboration Lab in Brevard, NC'}
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        noindex
      />

      <a className="rh-skip-link" href="#photos">
        Skip to the photos
      </a>

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
        <section className="rhp-hero clb-hero" aria-labelledby="clb-title">
          <div className="rh-shell rhp-hero-grid">
            <div className="rhp-hero-copy">
              <p className="clb-kicker">
                <Sparkmark className="clb-kicker-mark" variant="ink" />
                Collaboration Lab · Photos &amp; video
              </p>
              <h1 id="clb-title">
                <span>Building partnerships</span>
                <span className="clb-title-accent">that last.</span>
              </h1>
              <p className="rhp-lede">
                Nonprofits from across Transylvania County spent the morning trading practical tools and local
                success stories, and heard from the people behind Wellness Rooted in Connection and Community
                Connectors. These are the photos and video from that morning. Share them, and use them in your own
                work.
              </p>
              <div className="rh-actions clb-hero-actions">
                <a className="rh-button rh-button-primary" href="#photos">
                  See the photos
                  <ArrowDown aria-hidden="true" size={19} />
                </a>
                <a className="rh-button rh-button-secondary" href="#video">
                  Get the video
                  <Clapperboard aria-hidden="true" size={19} />
                </a>
              </div>
            </div>

            {featured && (
              <figure className="rhp-hero-plate">
                <button type="button" onClick={() => openPhoto(featured)} aria-label={`Open ${photoLabel(featured)}`}>
                  <img
                    src={webp(gallery, featured, 1920)}
                    srcSet={`${webp(gallery, featured, 960)} 960w, ${webp(gallery, featured, 1920)} 1920w`}
                    sizes="(max-width: 960px) 100vw, 56vw"
                    alt={featured.alt}
                    width={featured.width}
                    height={featured.height}
                  />
                </button>
                <figcaption>
                  <span>No. {featured.id}{featured.title ? ` · ${featured.title}` : ''}</span>
                  <span>Tap to view larger</span>
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        <section id="photos" className="rhp-gallery" aria-labelledby="clb-gallery-title">
          <div className="rh-shell">
            <div className="rhp-gallery-head">
              <div>
                <p className="rhp-eyebrow">The gallery · {photos.length} photos</p>
                <h2 id="clb-gallery-title">Photos from the morning</h2>
                <p className="rhp-source">{creditLine}.</p>
              </div>
            </div>
            {photos.length ? grid : <p className="rhp-filter-note">The photos are on their way.</p>}
          </div>
        </section>

        <section id="video" className="clb-videos" aria-labelledby="clb-video-title">
          <div className="rh-shell">
            <div className="rhp-gallery-head">
              <div>
                <p className="rhp-eyebrow">Video · full resolution</p>
                <h2 id="clb-video-title">The program, and footage from the room</h2>
                <p className="clb-videos-lede">
                  These are large files, so download them over Wi‑Fi. The program recordings are 1080p copies that
                  are easy to edit. If you need the 4K camera originals, ask and we'll send a link.
                </p>
              </div>
            </div>

            <h3 className="clb-videos-subhead">The program</h3>
            <ul className="clb-video-list clb-video-list-programs">
              {programs.map((video) => (
                <VideoCard key={video.id} video={video} wide />
              ))}
            </ul>

            <h3 className="clb-videos-subhead">B-roll</h3>
            <p className="clb-videos-note">
              Short clips straight from the camera, for your own videos and posts. Tap one to watch a preview; the
              download is the full-resolution original.
            </p>
            <ul className="clb-video-list">
              {broll.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </ul>
          </div>
        </section>

        <section className="rhp-guide" aria-labelledby="clb-guide-title">
          <div className="rh-shell rhp-guide-grid">
            <div>
              <p className="rhp-eyebrow">Sharing</p>
              <h2 id="clb-guide-title">Help us tell people what happened.</h2>
              <ul className="rhp-usage">
                {media.usage.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="rhp-guide-foot">
                Questions, or need something we haven't posted? Email{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </div>

            <div className="rhp-guide-cards">
              <div className="rhp-guide-card">
                <p className="rhp-guide-label">Credit line</p>
                <p className="rhp-guide-credit">{creditLine}</p>
                <CopyButton text={creditLine} label="Copy credit" copiedLabel="Credit copied" />
              </div>
              <div className="rhp-guide-card">
                <p className="rhp-guide-label">Ready-to-post caption</p>
                <p className="rhp-guide-caption">{SUGGESTED_CAPTION}</p>
                <CopyButton text={SUGGESTED_CAPTION} label="Copy caption" copiedLabel="Caption copied" />
              </div>
            </div>
          </div>
        </section>

        <section className="rhp-sponsors clb-partners" aria-labelledby="clb-partners-title">
          <div className="rh-shell">
            <div className="rhp-section-head rhp-section-head-center">
              <p className="rhp-eyebrow">With gratitude</p>
              <h2 id="clb-partners-title">Built together</h2>
              <p>Thank you to the partners who made the morning happen. Tag them when you share.</p>
            </div>
            <ul className="clb-partner-logos">
              {PARTNERS.map((name) => (
                <li key={name}>
                  <PartnerLogoArt name={name} area={9000} minH={40} maxH={84} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rhp-closing" aria-label="Send us your photos">
          <div className="rh-shell rhp-closing-inner">
            <div>
              <h2>Were you there with a camera?</h2>
              <p>We'd love to see the morning from where you sat.</p>
            </div>
            <div className="rhp-closing-actions">
              <a
                className="rh-button rh-button-primary"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent('Photos from the Collaboration Lab')}`}
              >
                <Mail aria-hidden="true" size={18} />
                Send them our way
              </a>
            </div>
          </div>
        </section>
      </main>

      {overlays}

      <footer className="rh-colophon">
        <div className="rh-shell">
          <Link to="/">
            <ArrowLeft aria-hidden="true" size={16} />
            SparkPoint home
          </Link>
          <p>{creditLine}.</p>
        </div>
      </footer>
    </div>
  );
}

export default CollabLabMediaPage;
