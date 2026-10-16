'use client';

import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { conveningPhotoSrcSet, conveningPhotoUrl } from '../lib/conveningPhotos';
import { Sparkmark } from './Sparkmark';

// The homepage's closing ask: one primary action (give), one secondary (time).
export function CTAFinal() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden px-6 py-20 md:py-28"
      style={{ backgroundColor: 'var(--home-gold, #FDB515)', color: 'var(--home-plum, #2A1430)' }}
    >
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-[var(--home-plum)] lg:max-w-none" style={{ aspectRatio: '4 / 5' }}>
          <img
            src={conveningPhotoUrl('238')}
            srcSet={conveningPhotoSrcSet('238')}
            sizes="(min-width: 1024px) 40vw, 28rem"
            alt="Attendees talk in Adirondack chairs around a fire pit outside the barn"
            width={960}
            height={640}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '45% 55%' }}
          />
        </div>

        <div>
          <Sparkmark size="3rem" variant="ink" className="mb-8 text-[var(--home-pink-deep)]" />
          <h2 id="cta-heading" className="home-display" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            Pull up a chair.
          </h2>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed md:text-xl">
            There&rsquo;s a seat for you at every SparkPoint gathering. Help keep the circle going:
            give what you can, or give your time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Link
              to="/donations"
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full px-9 py-4 text-lg font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A1430]/40"
              style={{ backgroundColor: 'var(--home-plum, #2A1430)' }}
            >
              Donate to SparkPoint
              <ArrowUpRight size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/get-involved"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 text-lg font-bold underline decoration-2 underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A1430]/40 sm:justify-start"
            >
              Volunteer or partner with us <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 text-sm font-medium opacity-80">Donations are handled on our secure giving page.</p>
        </div>
      </div>

      {/* Contact anchor */}
      <div id="contact" className="absolute bottom-0 left-0 h-1 w-full" />
    </section>
  );
}
