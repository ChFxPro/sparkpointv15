// The Gala page's evening (#music): the Blue Ridge Bakery Band plays throughout,
// and photos of last December's gathering show the room (Jeff, 2026-11-20: promote
// the band and elevate the Gala). Sits directly under the hero.
//
// Facts come from the band's own page, https://www.marcbrownmusic.org/bands
// (roots, country, blues and gospel; fiddle, banjo, mandolin, guitar and
// harmonica with three-part harmony; the stories behind the songs; Fridays at
// the Blue Ridge Bakery in Brevard). Re-check it before changing the copy.
// The photo is the band's promotional photo from that page.

import { useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Sparkmark } from '../components/Sparkmark';

const BASE = import.meta.env.BASE_URL;
const BAND_URL = 'https://www.marcbrownmusic.org/bands';
const INSTRUMENTS = ['Fiddle', 'Banjo', 'Mandolin', 'Guitar', 'Harmonica'];

// Last December: SparkPoint's 2025 holiday gathering (Jingle & Mingle, Dec 12, 2025),
// from the owner's edits on the NAS (Sparkpoint/Xmas Gala 25/Edits), exported as
// 800/1600 WebP pairs. Real guests, so the room the visitor would join, not stock travel.
// Laid out like prints dropped on a table: each has a spot and a tilt on wide
// screens (`d`: left %, top %, degrees) and on phones (`m`), overlapping a little
// but all mostly visible. Hovering, focusing or tapping a print lifts it, straightens
// it and brings it to the top of the pile, where it stays until another is picked up.
const LAST_DECEMBER = [
  { id: '05', d: [1, 5, -5], m: [0, 0, -4], alt: 'A full room at SparkPoint’s 2025 holiday gathering, guests at tables under string lights with a band playing by the Christmas tree.' },
  { id: '03', d: [33, 0, 3], m: [40, 10, 4], alt: 'Guests in holiday dress lined up for a group photo with Santa.' },
  { id: '08', d: [65, 7, -3], m: [1, 26, 3], alt: 'Two musicians, a singer with an acoustic guitar and a guitarist, playing under purple light.' },
  { id: '10', d: [5, 47, 4], m: [41, 39, -3], alt: 'Guests laughing together, one wearing a necklace of Christmas lights.' },
  { id: '11', d: [35, 42, -2], m: [2, 54, -2], alt: 'Friends greeting each other beside a decorated Christmas tree.' },
  { id: '04', d: [64, 50, 5], m: [40, 68, 4], alt: 'A guest smiling beside Santa.' },
];
const past = (id: string, width: number) => `${BASE}assets/events/gala/past/gala-2025-${id}-${width}.webp`;

export function GalaBand() {
  const reduceMotion = useReducedMotion();
  // The pile's stacking order, bottom to top; a picked-up print moves to the top.
  const [order, setOrder] = useState(() => LAST_DECEMBER.map((photo) => photo.id));
  const [picked, setPicked] = useState<string | null>(null);
  const lift = (id: string) => {
    setPicked(id);
    setOrder((current) => [...current.filter((item) => item !== id), id]);
  };
  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="music" className="gala-band" aria-labelledby="band-title">
      <div className="gala-shell gala-band-grid">
        <motion.figure className="gala-band-photo" {...reveal()}>
          <div className="gala-band-frame">
            <img
              src={`${BASE}assets/events/gala/band/blue-ridge-bakery-band-620.webp`}
              width={614}
              height={492}
              loading="lazy"
              decoding="async"
              alt="Three members of the Blue Ridge Bakery Band, smiling in front of a stone wall with a guitar, a mandolin and a banjo."
            />
          </div>
          <figcaption className="gala-band-plate">
            <Sparkmark size="14px" />
            The Blue Ridge Bakery Band · Brevard, NC
          </figcaption>
        </motion.figure>

        <div className="gala-band-copy">
          <motion.div className="gala-section-head" {...reveal(0.08)}>
            <h2 id="band-title">
              The soundtrack <em>is homegrown.</em>
            </h2>
          </motion.div>
          <motion.p className="gala-band-lede" {...reveal(0.14)}>
            The Blue Ridge Bakery Band plays all evening, taking the room back to the golden days
            of roots, country, blues and gospel music, with the stories behind the songs and the
            people who wrote them.
          </motion.p>
          <motion.ul className="gala-band-instruments" aria-label="Instruments" {...reveal(0.2)}>
            {INSTRUMENTS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </motion.ul>
          <motion.p className="gala-band-harmony" {...reveal(0.24)}>
            In three-part harmony. You can also catch them on Fridays at the Blue Ridge Bakery in
            Brevard.
          </motion.p>
          <motion.a
            className="gala-band-link"
            href={BAND_URL}
            target="_blank"
            rel="noopener noreferrer"
            {...reveal(0.28)}
          >
            Meet the band <ArrowRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </motion.a>
        </div>
      </div>

      <div className="gala-shell gala-lastdec">
        <motion.p className="gala-lastdec-title" {...reveal()}>
          Last December, in the same spirit
          <span>SparkPoint’s 2025 holiday gathering</span>
        </motion.p>
        <ul className="gala-lastdec-pile">
          {LAST_DECEMBER.map((photo, index) => (
            <motion.li
              key={photo.id}
              className={picked === photo.id ? 'is-top' : undefined}
              style={
                {
                  '--x': `${photo.d[0]}%`,
                  '--y': `${photo.d[1]}%`,
                  '--r': `${photo.d[2]}deg`,
                  '--mx': `${photo.m[0]}%`,
                  '--my': `${photo.m[1]}%`,
                  '--mr': `${photo.m[2]}deg`,
                  zIndex: order.indexOf(photo.id) + 1,
                } as CSSProperties
              }
              {...reveal(0.06 * index)}
            >
              <button
                type="button"
                className="gala-lastdec-print"
                onMouseLeave={() => setPicked(null)}
                aria-label={`Bring to the top: ${photo.alt}`}
                onClick={() => lift(photo.id)}
                onMouseEnter={() => lift(photo.id)}
                onFocus={() => lift(photo.id)}
              >
              <img
                src={past(photo.id, 800)}
                srcSet={`${past(photo.id, 800)} 800w, ${past(photo.id, 1600)} 1600w`}
                sizes="(max-width: 700px) 60vw, 36vw"
                width={800}
                height={533}
                loading="lazy"
                decoding="async"
                alt=""
              />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
