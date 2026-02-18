'use client';

import { motion } from 'motion/react';

// Local program imagery (WebP + JPG fallback)
import sparkpurposeWebp from '../assets/connection_happens/sparkpurpose1.webp';
import sparkpurposeJpg from '../assets/connection_happens/sparkpurpose1.jpg';
import storyWebp from '../assets/connection_happens/story1.webp';
import storyJpg from '../assets/connection_happens/story1.jpg';
import vosWebp from '../assets/connection_happens/vos1.webp';
import vosJpg from '../assets/connection_happens/vos1.jpg';

export function ConnectionSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-[#1A1A1A] text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
            Three Ways Connection Happens Here.
          </h2>
          <p className="text-[#666666] text-lg md:text-xl leading-relaxed">
            SparkPoint turns connection into momentum through three core programs — purpose,
            story, and youth voice. Each one creates space for belonging, reflection, and
            shared growth across Transylvania County.
          </p>
        </div>

        {/* Program Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* SparkPurpose */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="group relative rounded-2xl overflow-hidden shadow-xl bg-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <picture>
                <source srcSet={sparkpurposeWebp} type="image/webp" />
                <img
                  src={sparkpurposeJpg}
                  alt="SparkPurpose workshop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-sm uppercase tracking-widest text-[#FDB515] font-semibold mb-2">
                SparkPurpose
              </p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                Purpose Workshops
              </h3>
              <p className="text-[#555] leading-relaxed mb-6">
                Guided sessions that help individuals and teams clarify values,
                reflect deeply, and move forward with alignment and intention.
              </p>
              <a
                href="#programs"
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                Learn More →
              </a>
            </div>
          </motion.div>

          {/* Story Collection */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden shadow-xl bg-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <picture>
                <source srcSet={storyWebp} type="image/webp" />
                <img
                  src={storyJpg}
                  alt="Story collection interview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-sm uppercase tracking-widest text-[#FDB515] font-semibold mb-2">
                Story Collection
              </p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                Story & Voice Infrastructure
              </h3>
              <p className="text-[#555] leading-relaxed mb-6">
                We collect lived experience across the county so decisions,
                partnerships, and programming reflect real community voices.
              </p>
              <a
                href="#programs"
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                Explore Stories →
              </a>
            </div>
          </motion.div>

          {/* Voices of the Students */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="group relative rounded-2xl overflow-hidden shadow-xl bg-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <picture>
                <source srcSet={vosWebp} type="image/webp" />
                <img
                  src={vosJpg}
                  alt="Youth program engagement"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-sm uppercase tracking-widest text-[#FDB515] font-semibold mb-2">
                Voices of the Students
              </p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                Youth Voice & Belonging
              </h3>
              <p className="text-[#555] leading-relaxed mb-6">
                Student-led programming that builds confidence, connection,
                and civic participation across middle and high school campuses.
              </p>
              <a
                href="#programs"
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                See Youth Programs →
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
