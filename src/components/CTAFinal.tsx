'use client';

import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import sparkPointLogo from '../assets/compd/35bb889d1f4d0b05ae6753439b58199640858447.webp';
import mountainPng from '../assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png';
import mountainWebp from '../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.webp';
import mountainWebpMobile from '../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9-1400.webp';

export function CTAFinal() {
  const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 1024;
  const ctaBackgroundWebp = isMobileViewport ? mountainWebpMobile : mountainWebp;
  const supportsImageSet =
    typeof window !== 'undefined' &&
    typeof window.CSS !== 'undefined' &&
    window.CSS.supports('background-image', `image-set(url("${ctaBackgroundWebp}") 1x)`);
  const ctaBackgroundImage = supportsImageSet
    ? `image-set(
      url("${ctaBackgroundWebp}") type("image/webp"),
      url("${mountainPng}") type("image/png")
    )`
    : `url("${mountainPng}")`;

  return (
    <section id="cta" className="relative py-20 md:py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full absolute inset-0"
          style={{
            backgroundImage: ctaBackgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            filter: 'blur(10px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, rgba(158, 80, 159, 0.8) 0%, rgba(224, 54, 148, 0.85) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
          className="text-white mb-5 md:mb-6 px-4"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: '1.2',
            letterSpacing: '-1.5px',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          Our next chapter begins with intention.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.45, 0, 0.55, 1] }}
          className="text-white/90 mb-5 md:mb-6 px-4"
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
            lineHeight: '1.59',
            textShadow: '0px 0px 3px rgba(0, 0, 0, 0.25)'
          }}
        >
          Connecting people. Building trust. Creating change.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.3, delay: 0.35, ease: [0.45, 0, 0.55, 1] }}
          className="text-white/85 mb-10 md:mb-12 max-w-4xl mx-auto px-4"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.65',
            textShadow: '0px 0px 3px rgba(0, 0, 0, 0.25)',
            letterSpacing: '0.01em'
          }}
        >
          SparkPoint strengthens Transylvania County by connecting people, programs, and purpose 
          to build lasting wellness, resilience, and belonging, grounded in compassion and the 
          belief that together we can weather any storm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.45, 0, 0.55, 1] }}
          className="flex gap-3 md:gap-4 justify-center mb-12 md:mb-16 flex-wrap"
        >
          <Button
            asChild
            size="lg"
            className="px-6 py-4 text-base sm:px-8 sm:py-6 sm:text-lg transition-all duration-250"
            style={{
              backgroundColor: 'white',
              color: '#E03694',
              minHeight: '44px',
              transform: 'translateZ(0)',
            }}
          >
            <Link to="/intake?intent=volunteer">Volunteer or Partner</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-6 py-4 text-base sm:px-8 sm:py-6 sm:text-lg border-2 transition-all duration-250 hover:bg-white/10"
            style={{
              borderColor: 'white',
              color: 'white',
              backgroundColor: 'transparent',
              minHeight: '44px',
              transform: 'translateZ(0)',
            }}
          >
            <Link to="/donations">Donate to SparkPoint</Link>
          </Button>
        </motion.div>

        {/* Tagline Cascade */}
        <div className="space-y-2 px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.45, 0, 0.55, 1] }}
            className="text-white"
            style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)', fontWeight: '600', letterSpacing: '0.05em' }}
          >
            TOGETHER, WE BELONG.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 1.15, ease: [0.45, 0, 0.55, 1] }}
            className="text-white"
            style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)', fontWeight: '600', letterSpacing: '0.05em' }}
          >
            TOGETHER, WE HEAL.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.45, 0, 0.55, 1] }}
            className="text-white"
            style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)', fontWeight: '600', letterSpacing: '0.05em' }}
          >
            TOGETHER, WE CONNECT.
          </motion.div>
        </div>

        {/* SparkMark Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 1.65, ease: [0.45, 0, 0.55, 1] }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <motion.img
            src={sparkPointLogo}
            alt="SparkPoint logo"
            width={839}
            height={290}
            sizes="(min-width: 768px) 256px, 192px"
            className="h-24 sm:h-32 w-auto"
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
        
        {/* Contact anchor */}
        <div id="contact" className="absolute bottom-0 left-0 w-full h-1" />
      </div>
    </section>
  );
}
