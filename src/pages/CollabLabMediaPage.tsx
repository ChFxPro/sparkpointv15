import { ArrowLeft, ArrowRight, Mail, Play, Quote } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { PartnerLogoArt } from '../components/partners/PartnerLogoArt';
import { CopyButton, photoLabel, storageDownload, usePhotoGallery, webp, type Gallery, type SharePhoto } from '../components/photoShare/photoShareKit';
import media from '../data/collabLabMedia.json';
import program from '../data/collabLabProgram.json';
// The Collaboration Lab mark is Pisgah Health Foundation's, cut from their event promo
// (scripts/collab-lab-extract-mark.py). Swap in their vector files if they send them.
import collabWordmarkReversed from '../assets/collab-lab/collab-lab-wordmark-reversed.webp';
import { CollabLabHero } from './collabLab/CollabLabHero';
import { ProgramPlayer, formatTime, momentHash, type ProgramPart } from './collabLab/ProgramPlayer';
import { BASE, byId } from './collabLab/VideoCard';
import './ruralHealthConvening.css';
import './ruralHealthPhotoShare.css';
import './collabLabMedia.css';

// The public page for the Collaboration Lab: Building Partnerships That Last
// (October 23, 2026, Mary C. Jenkins Community & Cultural Center, Brevard), with
// Pisgah Health Foundation, Dogwood Health Trust, and FWRD Transylvania. It is the
// event's page in the Events hub (detailPath in src/data/events.ts), indexed and in the
// sitemap (STATIC in prerender.mjs) since the owner approved it on 2026-10-30.
//
// It tells the morning in the event's own three words. Connect: the room, in a photo
// sequence. Share: the featured collaboration and the program recordings,
// with chapters, captions, a searchable transcript, and pull quotes that open the
// recording at their moment (src/pages/collabLab/ProgramPlayer.tsx, data in
// src/data/collabLabProgram.json). Create: everything to make something with — the
// photo gallery, credit, and caption — plus an outcomes slot that shows once
// `outcomes` in collabLabMedia.json has entries (none are invented here).
//
// B-roll downloads are not on this page: they're for editors (mainly PHF's), so they
// live on their own unlisted page, /collaboration-lab/media/b-roll (CollabLabBrollPage),
// which this page doesn't link to. The only b-roll here is the silent loop
// behind the title (owner's call, 2026-10-29: b-roll isn't something to sit and watch).
//
// Photos work exactly like the convening photo page (the shared kit in
// src/components/photoShare/photoShareKit.tsx): `npm run collab:photos`. Video is the
// `videos` array in collabLabMedia.json, uploaded with `npm run collab:video`: all 1080p,
// with small silent previews of the b-roll. The page deliberately never mentions the 4K
// camera originals (owner's call, 2026-10-29). Everything lives in the public-read
// `event-media` bucket under collaboration-lab-2026/. Layout borrows the convening photo
// page's; collabLabMedia.css retints it with the event's teal and gold.

type Quote = { part: number; t: number; text: string; speaker: string; org?: string };

const PAGE_PATH = '/collaboration-lab/media';
const SPARKPOINT_LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;
const { creditLine, contactEmail } = media;
const outcomes = ((media as { outcomes?: { figure: string; label: string }[] }).outcomes ?? []).filter((o) => o.figure);
const quotes = program.quotes as Quote[];

const parts: ProgramPart[] = program.parts.map((p) => {
  const v = byId(p.video);
  return {
    id: p.video,
    label: p.label,
    title: p.title,
    src: `${BASE}/${v.file}`,
    poster: `${BASE}/${v.poster}`,
    captions: `${import.meta.env.BASE_URL}${p.captions.replace(/^\//, '')}`,
    transcript: `${import.meta.env.BASE_URL}${p.transcript.replace(/^\//, '')}`,
    duration: v.duration,
    bytes: v.bytes,
    download: storageDownload(`${BASE}/${v.file}`, v.file),
    chapters: p.chapters,
  };
});

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
const photo = (id: string) => photos.find((p) => p.id === id);

// The Connect sequence: the room filling up, in roughly the order of the morning.
const CONNECT_STORY: { id: string; caption: string }[] = [
  { id: '10', caption: 'The room filled early.' },
  { id: '02', caption: 'Introductions and catching up.' },
  { id: '08', caption: 'Catching up by the windows.' },
  { id: '05', caption: 'At the tables, ideas went up on sticky notes.' },
  { id: '06', caption: 'Listening as much as talking.' },
  { id: '16', caption: 'And plenty of laughing.' },
];

const PARTNERS = ['Pisgah Health Foundation', 'Dogwood Health Trust', 'FWRD Transylvania (LTRG)'];

function ActHead({ number, word, title, children }: { number: string; word: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="clb-act-head">
      <p className="clb-act-label">
        <span>{number}</span>
        {word}
      </p>
      <h2>{title}</h2>
      {children && <div className="clb-act-intro">{children}</div>}
    </header>
  );
}

function StoryPhoto({ photo: p, caption, onOpen }: { photo: SharePhoto; caption: string; onOpen: () => void }) {
  return (
    <figure className="clb-story-photo">
      <button type="button" onClick={onOpen} aria-label={`Open ${photoLabel(p)}`}>
        <img
          src={webp(gallery, p, 960)}
          srcSet={`${webp(gallery, p, 960)} 960w, ${webp(gallery, p, 1920)} 1920w`}
          sizes="(max-width: 760px) 100vw, 50vw"
          alt={p.alt}
          width={p.width}
          height={p.height}
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function CollabLabMediaPage() {
  const { grid, overlays, openPhoto, hasSelection } = usePhotoGallery(gallery);
  const story = CONNECT_STORY.map((s) => ({ ...s, photo: photo(s.id) })).filter(
    (s): s is { id: string; caption: string; photo: SharePhoto } => Boolean(s.photo),
  );
  const featuredPoster = `${BASE}/${byId('program-2').poster}`;
  const loop = byId('broll-05');

  return (
    <div className={`rh-page rhp-page clb-page${hasSelection ? ' has-tray' : ''}`}>
      <SEOHead
        title="Photos & video · Collaboration Lab | SparkPoint"
        description="Photos and video from the Collaboration Lab: Building Partnerships That Last, October 23, 2026 in Brevard, NC. Free to download and share with credit."
        path={PAGE_PATH}
        image="/assets/collab-lab/media-og.jpg"
        imageAlt={photos[0]?.alt ?? 'The Collaboration Lab in Brevard, NC'}
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
      />

      <a className="rh-skip-link" href="#create">
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
        <CollabLabHero loopSrc={`${BASE}/${loop.preview}`} posterSrc={`${BASE}/${loop.poster}`} />

        {/* ── 01 Connect ── */}
        <section id="connect" className="clb-act clb-act-connect" aria-labelledby="clb-connect-title">
          <div className="rh-shell">
            <ActHead number="01" word="Connect" title="Before anyone took the stage, the room was already at work.">
              <p>
                People from nonprofits across Transylvania County caught up, made introductions, and got to work at
                the tables.
              </p>
            </ActHead>

            <div className="clb-story">
              {story.map((s) => (
                <StoryPhoto key={s.id} photo={s.photo} caption={s.caption} onOpen={() => openPhoto(s.photo)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 02 Share ── */}
        <section id="share" className="clb-act clb-act-share" aria-labelledby="clb-share-title">
          <div className="rh-shell">
            <ActHead number="02" word="Share" title="A collaboration, told by the people doing it.">
              <p>
                The featured collaboration: Sarah Hankey of SparkPoint and Keagan Monteith of FWRD Transylvania on
                Wellness Rooted in Connection and Community Connectors.
              </p>
            </ActHead>

            <div className="clb-feature">
              <figure className="clb-feature-image">
                <img src={featuredPoster} alt="Keagan Monteith and Sarah Hankey in conversation on stage, the audience in the foreground." width={1280} height={720} loading="lazy" />
              </figure>
              <div className="clb-feature-copy">
                <div className="clb-feature-program">
                  <h3>Wellness Rooted in Connection</h3>
                  <p>
                    A community of practice where organizations listen together and strengthen mental wellness and
                    resilience across the county.
                  </p>
                </div>
                <div className="clb-feature-program">
                  <h3>Community Connectors</h3>
                  <p>
                    Neighbors people already trust, with the training and tools to help their communities get ready
                    for hard days and recover from them.
                  </p>
                </div>
                <a className="rh-button rh-button-primary" href={momentHash(0, 2705)}>
                  <Play aria-hidden="true" size={17} />
                  Watch their conversation
                </a>
              </div>
            </div>

            {quotes.length > 0 && (
              <ul className="clb-quotes">
                {quotes.map((q) => (
                  <li key={`${q.part}-${q.t}`}>
                    <blockquote>
                      <Quote aria-hidden="true" size={22} className="clb-quote-mark" />
                      <p>{q.text}</p>
                    </blockquote>
                    <p className="clb-quote-by">
                      <strong>{q.speaker}</strong>
                      {q.org ? `, ${q.org}` : ''}
                    </p>
                    <a className="clb-quote-watch" href={momentHash(q.part, q.t)}>
                      Watch this moment · {parts[q.part]?.label} at {formatTime(q.t)}
                      <ArrowRight aria-hidden="true" size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div className="clb-program">
              <h3 className="clb-program-title">The full program</h3>
              <p className="clb-program-note">
                Jump to any chapter or line of the transcript, or copy a link to a moment to share it.
              </p>
              <ProgramPlayer parts={parts} />
            </div>
          </div>
        </section>

        {/* ── 03 Create ── */}
        <section id="create" className="clb-act clb-act-create" aria-labelledby="clb-create-title">
          <div className="rh-shell">
            <ActHead number="03" word="Create" title="Your turn. Make something with it.">
              <p>
                Every photo from the morning is here for your newsletter, your report, your next grant application,
                or your feed. {creditLine}.
              </p>
            </ActHead>

            {outcomes.length > 0 && (
              <ul className="clb-outcomes" aria-label="What came out of the morning">
                {outcomes.map((o) => (
                  <li key={o.label}>
                    <strong>{o.figure}</strong>
                    <span>{o.label}</span>
                  </li>
                ))}
              </ul>
            )}

            <div id="photos" className="clb-create-block">
              <h3 className="clb-videos-subhead">Photos · {photos.length}</h3>
              {photos.length ? grid : <p className="rhp-filter-note">The photos are on their way.</p>}
            </div>
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
              <img className="clb-closing-mark" src={collabWordmarkReversed} alt="" width={935} height={120} loading="lazy" />
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
