'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import sparkMarkLogo from 'figma:asset/16ed15b2e7cab4039cf2d9fb007333306f37886c.png';
import sparkPointLogo from 'figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png';
import candidSeal from 'figma:asset/5a36f7b11c9d0bf970613a37a28b121b31918d77.png';
import livingWageLogo from 'figma:asset/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png';

// Custom TikTok Icon to match Lucide style
const TikTok = ({ size = 24, style }: { size?: number | string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Mission', href: '/mission' },
  { label: 'Stories', href: '/stories' },
  { label: 'Impact', href: '/impact' },
  { label: 'Programs', href: '/programs' },
  { label: 'News & Media', href: '/news-media' },
  { label: 'Get Involved', href: '/get-involved', highlighted: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/intake?intent=contact' },
];

const socialLinks = [
  { icon: Facebook, label: 'Follow SparkPoint on Facebook', href: 'https://www.facebook.com/yoursparkpoint' },
  { icon: Instagram, label: 'Follow SparkPoint on Instagram', href: 'https://www.instagram.com/yoursparkpoint' },
  { icon: Youtube, label: 'Subscribe to SparkPoint on YouTube', href: 'https://www.youtube.com/@sparkpoint2023' },
  { icon: TikTok, label: 'Follow SparkPoint on TikTok', href: 'https://www.tiktok.com/@sparkysparkpoint?_r=1&_t=ZP-93dyebP3yYR' },
];

export function Footer() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };



  return (
    <footer className="relative overflow-hidden">
      {/* Decorative divider section */}
      <div
        className="relative py-1"
        style={{
          background: 'linear-gradient(90deg, #E03694 0%, #FDB515 50%, #E03694 100%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Main footer content */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-28 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20"
          >
            {/* Column 1: Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              className="relative"
            >
              <div translate="no">
                <img 
                  src={sparkPointLogo} 
                  alt="SparkPoint logo" 
                  className="h-14 w-auto mb-6"
                />
              </div>
              <p
                className="mb-2"
                style={{
                  color: '#E03694',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}
              >
                Wellness Rooted in Connection.
              </p>
              <p
                className="mb-8"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}
              >
                <span translate="no">SparkPoint</span> is a nonprofit built by our community, working toward a more connected and resilient Transylvania County.
              </p>

              {/* Contact Details */}
              <div className="space-y-3">
                <a
                  href="https://maps.google.com/?q=159+W.+Main+St+Unit+2452+Brevard+NC+28712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group transition-all hover:opacity-80"
                >
                  <MapPin 
                    size={20} 
                    className="mt-0.5 flex-shrink-0 transition-all" 
                    style={{ color: '#FDB515', filter: 'drop-shadow(0 0 2px rgba(253, 181, 21, 0.5))' }} 
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.938rem', lineHeight: '1.5' }}>
                    159 W. Main St Unit 2452, Brevard, NC 28712
                  </span>
                </a>
                <a
                  href="tel:+18288838050"
                  className="flex items-center gap-3 group transition-all hover:opacity-80"
                >
                  <Phone 
                    size={20} 
                    className="flex-shrink-0 transition-all" 
                    style={{ color: '#FDB515', filter: 'drop-shadow(0 0 2px rgba(253, 181, 21, 0.5))' }} 
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.938rem', lineHeight: '1.5' }}>
                    (828) 883-8050
                  </span>
                </a>
                <a
                  href="mailto:info@yoursparkpoint.org"
                  className="flex items-center gap-3 group transition-all hover:opacity-80"
                >
                  <Mail 
                    size={20} 
                    className="flex-shrink-0 transition-all" 
                    style={{ color: '#FDB515', filter: 'drop-shadow(0 0 2px rgba(253, 181, 21, 0.5))' }} 
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.938rem', lineHeight: '1.5' }}>
                    info@yoursparkpoint.org
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Column 2: Quick Links & Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            >
              <h3
                className="mb-6"
                style={{
                  background: 'linear-gradient(90deg, #E03694 0%, #FDB515 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  letterSpacing: '-0.5px'
                }}
              >
                Stay Connected
              </h3>

              {/* Quick Links */}
              <nav aria-label="Footer quick links" className="mb-8">
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="relative inline-block group"
                        style={{
                          color: link.highlighted ? '#FDB515' : 'rgba(255, 255, 255, 0.8)',
                          fontSize: '1rem',
                          fontWeight: link.highlighted ? '600' : '500',
                        }}
                      >
                        {link.label}
                        <span
                          className="absolute left-0 -bottom-0.5 w-0 h-0.5 group-hover:w-full transition-all duration-250 ease-in-out"
                          style={{
                            background: link.highlighted
                              ? '#E03694'
                              : 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                          }}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Social Media */}
              <div>
                <h4
                  className="mb-4"
                  style={{
                    color: '#E03694',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        title={social.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
                        whileHover={{
                          backgroundColor: 'rgba(224, 54, 148, 0.25)',
                        }}
                        className="p-3 rounded-full transition-all"
                        style={{
                          backgroundColor: 'rgba(224, 54, 148, 0.15)',
                          border: '1px solid rgba(224, 54, 148, 0.3)',
                        }}
                      >
                        <Icon size={24} style={{ color: '#FDB515' }} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Column 3: Contact Card (Simplified) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
            >
              <div 
                className="rounded-2xl p-8 h-full flex flex-col justify-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <h3
                  className="mb-4"
                  style={{
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                  }}
                >
                  Get in Touch
                </h3>
                <p 
                  className="mb-8"
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                >
                  Have a question, idea, or partnership in mind? We’d love to hear from you.
                </p>
                
                <div className="space-y-3">
                  <Link to="/intake?intent=contact">
                    <Button
                      className="w-full py-6 transition-all duration-250 font-semibold"
                      style={{
                        backgroundColor: '#E03694',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                    >
                      Send a message
                    </Button>
                  </Link>
                  <Link to="/get-involved">
                    <Button
                      variant="outline"
                      className="w-full py-6 transition-all duration-250 font-semibold hover:bg-white/5"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                    >
                      Get involved
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 text-center">
                    <a href="mailto:info@yoursparkpoint.org" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                        Or email us at info@yoursparkpoint.org
                    </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Trust & Accountability Section - Footer Meta Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 pt-8 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Text Group */}
              <div className="text-center md:text-left">
                <h4 
                  className="mb-1"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Trust & Accountability
                </h4>
                <p 
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9375rem',
                  }}
                >
                  We build trust through transparency, fair pay, and responsible care for community stories.
                </p>
              </div>

              {/* Badges Group */}
              <div className="flex items-center gap-6 md:gap-8">
                 <Link 
                    to="/trust"
                    className="text-white/60 text-sm hover:text-white transition-colors mr-2 hidden sm:block group"
                 >
                    Learn what this means <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                 </Link>
                <Link 
                  to="/trust" 
                  className="group transition-opacity hover:opacity-100 opacity-85 block"
                  aria-label="Candid Gold Transparency 2026"
                >
                  <img 
                    src={candidSeal} 
                    alt="Candid Gold Transparency 2026" 
                    className="h-[48px] w-auto object-contain"
                  />
                </Link>
                <Link 
                  to="/trust" 
                  className="group transition-opacity hover:opacity-100 opacity-85 block"
                  aria-label="Living Wage Certified"
                >
                  <img 
                    src={livingWageLogo} 
                    alt="Living Wage Certified" 
                    className="h-[48px] w-auto object-contain"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Charitable Solicitation Disclosure */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div 
              className="p-6 rounded-lg border border-white/20 bg-white/5"
            >
              <div 
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  textAlign: 'left',
                }}
              >
                <p className="font-bold mb-2">
                  Sustainable Health for All (est. 2020) is a registered 501(c)(3) – DBA: SparkPoint
                </p>
                <p>
                  Financial information about this organization and a copy of its license are available from the State Solicitation Licensing Branch at 919-814-5400. The license is not an endorsement by the State.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
        className="relative"
        style={{
          background: 'linear-gradient(90deg, rgba(224, 54, 148, 0.9) 0%, rgba(158, 80, 159, 0.95) 100%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-28 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.875rem',
                letterSpacing: '0.25px',
              }}
            >
              © 2025 <span translate="no">SparkPoint</span>. All rights reserved.
            </p>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link
                to="/privacy"
                className="transition-opacity hover:opacity-70"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.25px',
                }}
              >
                Privacy Policy
              </Link>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>|</span>
              <Link
                to="/trust#site-use"
                className="transition-opacity hover:opacity-70"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.25px',
                }}
              >
                Terms of Use
              </Link>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>|</span>
              <Link
                to="/trust#accessibility"
                className="transition-opacity hover:opacity-70"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.25px',
                }}
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
