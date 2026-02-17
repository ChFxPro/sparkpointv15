'use client';

import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import sparkPointLogo from 'figma:asset/16ed15b2e7cab4039cf2d9fb007333306f37886c.png';

interface CTAFinalProps {
  backgroundImage: string;
}

export function CTAFinal({ backgroundImage }: CTAFinalProps) {
  const navigate = useNavigate();

  return (
    <section id="cta" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMG5hdHVyZSUyMHRyZWVzfGVufDF8fHx8MTc2MTA5MDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080')`,
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
          className="text-white mb-6 px-4"
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
          className="text-white/90 mb-6 px-4"
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
          className="text-white/85 mb-12 max-w-4xl mx-auto px-4"
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
          className="flex gap-4 justify-center mb-16 flex-wrap"
        >
          <Button
            size="lg"
            className="px-8 py-6 text-lg transition-all duration-250"
            style={{
              backgroundColor: 'white',
              color: '#E03694',
              minHeight: '44px',
              transform: 'translateZ(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FDB515';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#E03694';
            }}
            onClick={() => {
              navigate('/intake?intent=volunteer');
            }}
          >
            Volunteer or Partner
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-2 transition-all duration-250 hover:bg-white/10"
            style={{
              borderColor: 'white',
              color: 'white',
              backgroundColor: 'transparent',
              minHeight: '44px',
              transform: 'translateZ(0)',
            }}
            onClick={() => {
              window.location.href = 'https://www.yoursparkpoint.org/donations';
            }}
          >
            Donate to SparkPoint
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
            TOGETHER, WE BUILD.
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
          className="mt-16 flex justify-center"
        >
          <motion.img
            src={sparkPointLogo}
            alt="SparkPoint"
            className="h-32 w-auto"
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
