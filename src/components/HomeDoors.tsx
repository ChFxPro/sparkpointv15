import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { conveningPhotoUrl } from '../lib/conveningPhotos';
import { GATHERINGS } from './home/gatherings';

// The four ways in, directly under the hero. On large screens they're tall
// photo panels in a row; the one you point at (or tab to) widens and shows its
// line of copy. On smaller screens they stack with the copy always shown.
const DOORS = [
  {
    title: 'Come to a gathering',
    copy: 'Talks, convenings, and community nights across the county and the region.',
    to: '/events',
    // A photo is a convening photo id, or a { src } from another gathering.
    photo: GATHERINGS.heleneFullHouse,
    alt: 'A full auditorium facing the stage at Helene: One Year of Healing',
    position: '50% 55%',
  },
  {
    title: 'Volunteer',
    copy: 'Give a few hours at an event, a school, or a story session.',
    to: '/intake?intent=volunteer',
    photo: GATHERINGS.heleneCrew,
    alt: 'SparkPoint volunteers in matching yellow shirts smile outside the event tent, one holding a camera rig',
    position: '50% 30%',
  },
  {
    title: 'Partner with us',
    copy: 'For organizations, schools, and sponsors across Western NC working toward the same goals.',
    to: '/intake?intent=partner',
    photo: '55',
    alt: 'Attendees gather at a partner organization’s table under the pavilion',
    position: '55% 50%',
  },
  {
    title: 'Find local help',
    copy: 'Our directory of local resources and the partners who run them.',
    to: '/directory',
    photo: '139',
    alt: 'Attendees study a big map of North Carolina pinned with where everyone works',
    position: '62% 50%',
  },
] as const;

export function HomeDoors() {
  const [active, setActive] = useState(0);

  return (
    <section id="doors" aria-labelledby="home-doors-heading" className="relative scroll-mt-20 bg-white px-6 pb-20 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-7xl">
        <h2 id="home-doors-heading" className="home-h2 mb-10 text-[var(--home-ink)] md:mb-12">
          Four ways to get involved
        </h2>

        <ul className="home-panels flex flex-col gap-3 lg:h-[34rem] lg:flex-row">
          {DOORS.map((door, i) => (
            <li
              key={door.title}
              className="home-panel relative min-h-[15rem] lg:min-h-0"
              data-active={active === i ? 'true' : 'false'}
              onMouseEnter={() => setActive(i)}
            >
              <Link
                to={door.to}
                onFocus={() => setActive(i)}
                className="group absolute inset-0 block overflow-hidden rounded-2xl bg-[var(--home-plum)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--home-pink)] focus-visible:ring-offset-2"
              >
                <img
                  src={typeof door.photo === 'string' ? conveningPhotoUrl(door.photo) : door.photo.src}
                  srcSet={typeof door.photo === 'string' ? undefined : door.photo.srcSet}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt={door.alt}
                  width={960}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="home-panel-img absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: door.position }}
                />
                <span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(0deg, rgba(42,20,48,0.92) 0%, rgba(42,20,48,0.45) 45%, rgba(42,20,48,0.05) 75%)' }}
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col p-6 lg:p-7">
                  <span className="flex items-end justify-between gap-3">
                    <span className="home-display text-white" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.25rem)', lineHeight: 1.05 }}>
                      {door.title}
                    </span>
                    <span
                      className="home-panel-arrow mb-1 inline-flex h-11 w-11 flex-none items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: 'var(--home-pink)' }}
                      aria-hidden="true"
                    >
                      <ArrowRight size={20} />
                    </span>
                  </span>
                  <span className="home-panel-copy mt-3 max-w-sm text-base leading-relaxed text-white">{door.copy}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
