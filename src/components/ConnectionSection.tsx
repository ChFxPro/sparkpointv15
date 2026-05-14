'use client';

import { AnimatePresence, motion } from 'motion/react';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

// Local program imagery (WebP + JPG fallback)
import sparkpurposeWebp from '../assets/connection_happens/sparkpurpose1.webp';
import sparkpurposeJpg from '../assets/connection_happens/sparkpurpose1.jpg';
import storyWebp from '../assets/connection_happens/story1.webp';
import storyJpg from '../assets/connection_happens/story1.jpg';
import vosWebp from '../assets/connection_happens/vos1.webp';
import vosJpg from '../assets/connection_happens/vos1.jpg';

type ProgramModalProps = {
  open: boolean;
  onClose: () => void;
  badge: string;
  title: string;
  subtitle?: string;
  body: string;
  highlights: string[];
};

function ProgramModal({ open, onClose, badge, title, subtitle, body, highlights }: ProgramModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ isolation: 'isolate' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          {/* Overlay */}
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
            style={{ cursor: 'default' }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0B0B10]/85 text-white shadow-2xl backdrop-blur-xl"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#FDB515] font-semibold">
                    {badge}
                  </p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">
                    {title}
                  </h3>
                  {subtitle ? (
                    <p className="mt-2 text-white/70 leading-relaxed">{subtitle}</p>
                  ) : null}
                </div>

                <button
                  onClick={onClose}
                  className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <p className="mt-6 text-white/80 leading-relaxed">{body}</p>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-widest text-white/70 font-semibold mb-3">
                  What this includes
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/85">
                      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#FDB515]" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {badge === 'SparkPurpose' ? (
                    <a
                      href="/programs/purpose-workshops"
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
                    >
                      View Purpose Workshops
                    </a>
                  ) : null}
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl bg-[#FDB515] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function ConnectionSection() {
  const [openModal, setOpenModal] = useState<null | 'sparkpurpose' | 'vos'>(null);
  const navigate = useNavigate();
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        <ProgramModal
          open={openModal === 'sparkpurpose'}
          onClose={() => setOpenModal(null)}
          badge="SparkPurpose"
          title="Purpose Workshops"
          subtitle="Guided, welcoming sessions that help people clarify what matters and move forward with alignment."
          body="SparkPurpose workshops create space for reflection, conversation, and practical next steps. They are designed to be accessible and community-centered — helping participants turn insight into momentum."
          highlights={[
            'Interactive group workshops (community + partner-hosted)',
            'Personal reflection prompts that support real conversation',
            'Facilitated discussion that builds trust and shared understanding',
            'Clear next-step takeaways participants can act on'
          ]}
        />

        <ProgramModal
          open={openModal === 'vos'}
          onClose={() => setOpenModal(null)}
          badge="Voices of the Students"
          title="Youth Voice & Belonging"
          subtitle="Student-centered programming that builds connection, confidence, and leadership." 
          body="Voices of the Students (VOS) creates consistent touchpoints for young people to connect, be heard, and participate in shaping a healthier school culture. It’s relationship-forward and built for real-world campus rhythms."
          highlights={[
            'Student-led, relationship-forward sessions',
            'Campus-based activities that reduce barriers to participation',
            'Belonging-focused programming that strengthens peer connection',
            'Ongoing touchpoints that build trust over time'
          ]}
        />
        {/* Section Header */}
        <div className="max-w-3xl mb-16 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 md:p-8">
          <h2
            className="text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4"
            style={{ textShadow: '0 3px 18px rgba(0,0,0,0.55)' }}
          >
            Three Ways Connection Happens Here.
          </h2>
          <p
            className="text-white/85 text-lg md:text-xl leading-relaxed"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.45)' }}
          >
            SparkPoint turns connection into momentum through three core programs — purpose,
            story, and youth voice. Each one creates space for belonging, reflection, and
            shared growth across Transylvania County & beyond.
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
                  width={2000}
                  height={1333}
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
              <button
                type="button"
                onClick={() => setOpenModal('sparkpurpose')}
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                Learn More →
              </button>
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
                  width={2000}
                  height={1333}
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
              <button
                type="button"
                onClick={() => navigate('/stories')}
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                Explore Stories →
              </button>
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
                  width={2000}
                  height={1333}
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
              <button
                type="button"
                onClick={() => setOpenModal('vos')}
                className="inline-block text-sm font-semibold uppercase tracking-wide text-[#FDB515] hover:underline"
              >
                See Youth Programs →
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
