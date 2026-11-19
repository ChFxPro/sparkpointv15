// The Gala page's live music (#music): the Blue Ridge Bakery Band plays
// throughout the evening (booked 2026-11, Jeff). Sits between "How it works"
// (the passport) and the FAQ, as a night band between those ivory sections.
//
// Facts come from the band's own page, https://www.marcbrownmusic.org/bands
// (roots, country, blues and gospel; fiddle, banjo, mandolin, guitar and
// harmonica with three-part harmony; the stories behind the songs; Fridays at
// the Blue Ridge Bakery in Brevard). Re-check it before changing the copy.
// The photo is the band's promotional photo from that page.

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Sparkmark } from '../components/Sparkmark';

const BASE = import.meta.env.BASE_URL;
const BAND_URL = 'https://www.marcbrownmusic.org/bands';
const INSTRUMENTS = ['Fiddle', 'Banjo', 'Mandolin', 'Guitar', 'Harmonica'];

export function GalaBand() {
  const reduceMotion = useReducedMotion();
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
    </section>
  );
}
