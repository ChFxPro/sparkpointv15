'use client';

import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useScroll,
  useTransform
} from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import sparkPointLogo from 'figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png';
import mountainPng from '../assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png';
import mountainAvif from '../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.avif';
import mountainWebp from '../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.webp';

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  const navigate = useNavigate();
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();

  // Combine system preference with manual override
  const prefersReducedMotion =
    systemReducedMotion || motionPreference === 'reduce';

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showMission, setShowMission] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll tracking
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 800], [0, 150]);
  const headlineY = useTransform(scrollY, [0, 800], [0, 200]);
  const subheadY = useTransform(scrollY, [0, 800], [0, 250]);
  const buttonsY = useTransform(scrollY, [0, 800], [0, 300]);
  const contentOpacity = useTransform(scrollY, [0, 400, 800], [1, 0.5, 0]);

  const phrases = ['Healing through', 'Growing with', 'Thriving in', 'Living through', 'Rooted in'];

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentPhraseIndex(4); // Show final phrase immediately
      setShowMission(true);
      setShowButtons(true);
      return;
    }

    // Show mission immediately with headline
    setShowMission(true);

    const intervalDuration = 1600; // 1.4s display + 0.2s smoother transition

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => {
        if (prev < phrases.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, intervalDuration);

    // Show buttons right after subheader
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(buttonsTimer);
    };
  }, [prefersReducedMotion]);

  // Optional: parallax-fixed backgrounds can be expensive on mobile.
  // This keeps your desktop look while avoiding mobile jank.
  const backgroundAttachment =
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'scroll' : 'fixed';

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fixed Background Image with Overlay */}
      <div className="fixed inset-0 z-0" style={{ height: '100vh' }}>
        {/* Mountain Background */}
        <div
          className="absolute inset-0"
          style={{
            // Prefer AVIF/WebP when available, fall back to PNG
            backgroundImage: `image-set(
              url("${mountainAvif}") type("image/avif"),
              url("${mountainWebp}") type("image/webp"),
              url("${mountainPng}") type("image/png")
            )`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment,
          }}
        />

        {/* Top vignette for directional lighting */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.15) 0%, transparent 50%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(180deg, rgba(253, 181, 21, 0.3) 0%, rgba(224, 54, 148, 0.4) 100%)',
          }}
        />

        {/* Animated drift gradient with color shift */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #FDB515 0%, transparent 60%)',
          }}
          animate={{
            x: [-20, 20, -20],
            y: [-20, 20, -20],
            background: [
              'radial-gradient(circle at 50% 50%, #FDB515 0%, transparent 60%)',
              'radial-gradient(circle at 50% 50%, #E03694 0%, transparent 60%)',
              'radial-gradient(circle at 50% 50%, #FDB515 0%, transparent 60%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{
          paddingTop: 'clamp(120px, 15vh, 200px)',
          opacity: prefersReducedMotion ? 1 : undefined,
        }}
        aria-label="Rooted in Connection — SparkPoint strengthens Transylvania County by connecting people, programs, and purpose to build lasting wellness, resilience, and belonging, grounded in compassion and the belief that together we can weather any storm."
      >
        {/* SparkPoint Logo */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : logoY,
            opacity: prefersReducedMotion ? 1 : contentOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="mb-8 md:mb-12 flex justify-center"
          >
            <img
              src={sparkPointLogo}
              alt="SparkPoint Logo"
              className="h-20 md:h-32 lg:h-40 w-auto"
              style={{
                filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.2))',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Animated Headline */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : headlineY,
            opacity: prefersReducedMotion ? 1 : contentOpacity,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 4.625rem)',
              fontWeight: 800,
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
              textShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            className="text-white mb-6 px-4"
          >
            {/* Animated Prefix */}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPhraseIndex}
                initial={{ opacity: 0, y: -12, filter: 'blur(10px)', scale: 1.02 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, y: 12, filter: 'blur(10px)', scale: 1.02 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                {phrases[currentPhraseIndex]}
              </motion.span>
            </AnimatePresence>

            {/* Static Connection with Gradient Overlay */}
            <span
              style={{
                display: 'block',
                position: 'relative',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ display: 'inline-block' }}
              >
                Connection
              </motion.span>

              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  background:
                    'linear-gradient(90deg, rgba(253, 181, 21, 0.5) 0%, rgba(224, 54, 148, 0.5) 50%, rgba(253, 181, 21, 0.5) 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                Connection
              </motion.span>
            </span>
          </motion.h1>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : subheadY,
            opacity: prefersReducedMotion ? 1 : contentOpacity,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.45, 0, 0.55, 1],
            }}
            className="text-white/90 mb-12 max-w-3xl mx-auto px-4"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              lineHeight: '1.6',
              textShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
              maxWidth: '780px',
            }}
          >
            Together, we build a stronger, more connected Transylvania County and Western North Carolina.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : buttonsY,
            opacity: prefersReducedMotion ? (showButtons ? 1 : 0) : contentOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: showButtons ? 1 : 0,
              y: showButtons ? 0 : 30,
            }}
            transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center"
          >
            <Button
              size="lg"
              className="px-8 py-6 text-lg transition-all duration-250 hover:brightness-105 w-full sm:w-auto"
              onClick={() => navigate('/get-involved')}
              style={{
                backgroundColor: '#E03694',
                color: 'white',
                minHeight: '44px',
                transform: 'translateZ(0)',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 640) {
                  e.currentTarget.style.width = `${e.currentTarget.offsetWidth + 4}px`;
                }
                e.currentTarget.style.backgroundColor = '#FDB515';
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 640) {
                  e.currentTarget.style.width = 'auto';
                }
                e.currentTarget.style.backgroundColor = '#E03694';
              }}
            >
              Get Involved
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2 transition-all duration-250 hover:brightness-105 w-full sm:w-auto"
              onClick={() => navigate('/about')}
              style={{
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'transparent',
                minHeight: '44px',
                transform: 'translateZ(0)',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 640) {
                  e.currentTarget.style.width = `${e.currentTarget.offsetWidth + 4}px`;
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 640) {
                  e.currentTarget.style.width = 'auto';
                }
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
