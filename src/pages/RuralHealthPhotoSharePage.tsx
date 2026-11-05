import '@fontsource-variable/fraunces';

import type { CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { canonicalUrl } from '../lib/siteOrigin';
import { projectId } from '../utils/supabase/info';
import { CopyButton, photoLabel, usePhotoGallery, webp, type Gallery } from '../components/photoShare/photoShareKit';
import { RuralHealthMasthead } from './RuralHealthMasthead';
import { PostSessionRegisterLink } from './RuralHealthPostSession';
import shareData from '../data/ruralHealthPhotoShare.json';
import { conveningPartners, sponsorTiers } from '../data/ruralHealthConveningSponsors';
import './ruralHealthConvening.css';
import './ruralHealthPhotoShare.css';

// Unlisted photo-share page for the October 1, 2026 convening — a standalone page,
// separate from the recap at /rural-health-convening (which it doesn't change and
// which doesn't link here). It borrows the recap's masthead and paper/forest/brass
// styling so the two read as a set. Reached by direct link only: noindex, and
// prerender.mjs keeps it out of the sitemap (UNLISTED). It is still prerendered so a
// shared link unfurls with a real preview instead of hitting the GitHub Pages 404.
//
// The image files live in the public-read Supabase Storage bucket
// `convening-photos` (rural-health-2026/), not in this repo, so the gallery can grow
// to hundreds of photos. Their metadata — sets, optional titles, alt, sizes — plus the
// credit and usage terms live in src/data/ruralHealthPhotoShare.json (display order =
// array order). Add a batch with
// `SUPABASE_SECRET_KEY=... node scripts/rural-health-photo-share.mjs ingest <folder> --set <id>`.
// `#photo-<id>` deep-links straight to a photo in the lightbox.

// `#photo-<id>` deep-links straight to a photo in the lightbox. The grid, lightbox,
// selection tray, and share/download logic are shared with the Collaboration Lab page
// (src/components/photoShare/photoShareKit.tsx).

const PAGE_PATH = '/rural-health-convening/photos';
const RECAP_PATH = '/rural-health-convening';
const { creditLine } = shareData;

// Written in the participant's voice, about the day. No photo credit (the caption
// travels with whatever photo is picked) and no thanks to SparkPoint, which would read
// as the host scripting its own praise.
const SUGGESTED_CAPTION = `Spent October 1 at the 2026 WNC Regional Rural Health Convening in Brevard with rural health leaders from across Western North Carolina. We walked a family's story through the Rural Health Field Simulator, saw where the doors, delays, and handoffs really are, and left with new people to call. Rural health is stronger when we build it together. ${canonicalUrl(RECAP_PATH).replace(/^https?:\/\//, '')}`;

const gallery: Gallery = {
  photos: shareData.photos,
  sets: shareData.sets,
  base: `https://${projectId}.supabase.co/storage/v1/object/public/convening-photos/rural-health-2026`,
  filePrefix: 'rhp',
  downloadPrefix: shareData.downloadPrefix,
  caption: SUGGESTED_CAPTION,
  zipNote: `2026 WNC Regional Rural Health Convening · October 1, 2026 · Brevard, NC\n\n${creditLine}.\n\n${shareData.usage.map((line) => `- ${line}`).join('\n')}\n`,
};
const { photos } = gallery;
const featured = photos[0];
function SponsorWall() {
  return (
    <section className="rhp-sponsors" aria-labelledby="rhp-sponsors-title">
      <div className="rh-shell">
        <div className="rhp-section-head rhp-section-head-center">
          <p className="rhp-eyebrow">With gratitude</p>
          <h2 id="rhp-sponsors-title">The people who made the day possible</h2>
          <p>
            Thank you to the sponsors who underwrote the convening and the partners who helped build it. Tag
            them when you share.
          </p>
        </div>

        <div className="rhp-tiers">
          {sponsorTiers.map((tier) => (
            <div key={tier.id} className={`rhp-tier rhp-tier-${tier.id}`}>
              <p className="rhp-tier-label">{tier.label}</p>
              <ul>
                {tier.sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <a href={sponsor.href} target="_blank" rel="noreferrer" aria-label={`${sponsor.name} (opens in a new tab)`}>
                      <img
                        src={sponsor.src}
                        alt={sponsor.name}
                        width={sponsor.width}
                        height={sponsor.height}
                        loading="lazy"
                        style={{ '--optical': sponsor.optical ?? 1 } as CSSProperties}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rhp-tier rhp-tier-partners">
            <p className="rhp-tier-label">Hosted in partnership with</p>
            <ul>
              {conveningPartners.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.href} target="_blank" rel="noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>
                    <img
                      src={partner.src}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      loading="lazy"
                      style={{ '--optical': partner.optical ?? 1 } as CSSProperties}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RuralHealthPhotoSharePage() {
  const { grid, overlays, openPhoto, hasSelection } = usePhotoGallery(gallery);

  return (
    <div className={`rh-page rhp-page${hasSelection ? ' has-tray' : ''}`}>
      <SEOHead
        title="Photos · 2026 Rural Health Convening | SparkPoint"
        description="Thank you for filling the room. Photos from the October 1, 2026 WNC Regional Rural Health Convening—free to download and share with credit."
        path={PAGE_PATH}
        image="/assets/Rural%20Health/photo-share-og.jpg"
        imageAlt={featured.alt}
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        noindex
      />

      <a className="rh-skip-link" href="#photos">
        Skip to the photos
      </a>

      <RuralHealthMasthead backTo={RECAP_PATH} backLabel="Back to the recap" backAriaLabel="Back to the convening recap" />

      <main id="main-content">
        <section className="rhp-hero" aria-labelledby="rhp-title">
          <div className="rh-shell rhp-hero-grid">
            <div className="rhp-hero-copy">
              <PostSessionRegisterLink />
              <p className="rh-past-kicker">
                <span aria-hidden="true">✦</span>
                October 1, 2026 · Photos from the day
              </p>
              <h1 id="rhp-title">
                <span>Thank you for</span>
                <span>filling the room.</span>
              </h1>
              <div className="rh-star-rule" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p className="rhp-lede">
                Rural health leaders from across Western North Carolina packed the barn at Deerwoode Reserve to
                listen, walk the Rural Health Field Simulator together, and leave with new people to call. These
                are the photos from that day. Pick a few favorites and share them with your network.
              </p>
              <div className="rh-actions">
                <a className="rh-button rh-button-primary" href="#photos">
                  See the photos
                  <ArrowDown aria-hidden="true" size={19} />
                </a>
              </div>
            </div>

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
          </div>
        </section>

        <section id="photos" className="rhp-gallery" aria-labelledby="rhp-gallery-title">
          <div className="rh-shell">
            <div className="rhp-gallery-head">
              <div>
                <p className="rhp-eyebrow">The gallery · {photos.length} photos</p>
                <h2 id="rhp-gallery-title">Photos from the day</h2>
                <p className="rhp-source">{creditLine}.</p>
              </div>
            </div>

            {grid}
          </div>
        </section>

        <section className="rhp-guide" aria-labelledby="rhp-guide-title">
          <div className="rh-shell rhp-guide-grid">
            <div>
              <p className="rhp-eyebrow">Sharing these photos</p>
              <h2 id="rhp-guide-title">Help us tell people what happened.</h2>
              <ul className="rhp-usage">
                {shareData.usage.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="rhp-guide-foot">
                Need a full-resolution original for print? Email{' '}
                <a href={`mailto:${shareData.contactEmail}`}>{shareData.contactEmail}</a>.
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

        <SponsorWall />

        <section className="rhp-closing" aria-label="More from the convening">
          <div className="rh-shell rhp-closing-inner">
            <div>
              <h2>The full story of the day</h2>
              <p>The program, the Rural Health Field Simulator, and what comes next for rural health in our region.</p>
            </div>
            <div className="rhp-closing-actions">
              <Link className="rh-button rh-button-primary" to={RECAP_PATH}>
                Read the convening recap
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <a className="rhp-closing-mail" href={`mailto:${shareData.contactEmail}?subject=Photos%20from%20the%20Rural%20Health%20Convening`}>
                <Mail aria-hidden="true" size={16} />
                Took photos yourself? Send them our way.
              </a>
            </div>
          </div>
        </section>
      </main>

      {overlays}

      <footer className="rh-colophon">
        <div className="rh-shell">
          <Link to={RECAP_PATH}>
            <ArrowLeft aria-hidden="true" size={16} />
            Back to the convening recap
          </Link>
          <p>{creditLine}.</p>
        </div>
      </footer>
    </div>
  );
}

export default RuralHealthPhotoSharePage;
