'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { TrendingUp, Users, Heart, Award, Calendar, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { SEOHead } from '../components/SEOHead';
import { useAccessibility } from '../context/AccessibilityContext';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import communityMomentImg from 'figma:asset/c468599141a487a1168ff53b1f6de665f3b4be9d.png';
import heleneIcon from 'figma:asset/3c1537cde524e7172c827aa2411c2c759ae68ece.png';

import helene1Webp from '../assets/moments_impact/helene1.webp';
import helene1Jpg from '../assets/moments_impact/helene1.jpg';
import helene2Webp from '../assets/moments_impact/helene2.webp';
import helene2Jpg from '../assets/moments_impact/helene2.jpg';
import helene3Webp from '../assets/moments_impact/helene3.webp';
import helene3Jpg from '../assets/moments_impact/helene3.jpg';

import ora1Webp from '../assets/moments_impact/ora1.webp';
import ora1Jpg from '../assets/moments_impact/ora1.jpg';
import ora2Webp from '../assets/moments_impact/ora2.webp';
import ora2Jpg from '../assets/moments_impact/ora2.jpg';
import ora3Webp from '../assets/moments_impact/ora3.webp';
import ora3Jpg from '../assets/moments_impact/ora3.jpg';
import {
  IMPACT_2025,
  IMPACT_2025_NOVEMBER_SHARE_PERCENT,
} from '../data/impact2025';

const impactMetrics = [
  {
    icon: Users,
    value: IMPACT_2025.attendanceTotalRecordedMinimum,
    displaySuffix: '+',
    label: 'Recorded Attendance in 2025 (minimum)',
    shortLabel: 'Attendance',
    description: 'Minimum recorded attendance across 2025 events with attendance data.',
    color: '#E03694',
    gradient: 'linear-gradient(135deg, #E03694 0%, #F15F48 100%)'
  },
  {
    icon: TrendingUp,
    value: IMPACT_2025.eventsLogged,
    label: 'Events Logged in 2025',
    shortLabel: 'Events',
    description: 'Canonical annual event total from SparkPoint 2025 tracking.',
    color: '#9E509F',
    gradient: 'linear-gradient(135deg, #9E509F 0%, #E03694 100%)'
  },
  {
    icon: Heart,
    value: IMPACT_2025.uniqueCollaboratingOrganizationCount,
    label: 'Collaborating Organizations in 2025',
    shortLabel: 'Partners',
    description: 'Unique collaborating organization tokens in the 2025 tracker.',
    color: '#FDB515',
    gradient: 'linear-gradient(135deg, #FDB515 0%, #F15F48 100%)'
  },
  {
    icon: Award,
    value: IMPACT_2025.eventsWithAttendanceRecorded,
    label: 'Events with Attendance Recorded',
    description: 'Events with attendance data in the 2025 source set.',
    color: '#F15F48',
    gradient: 'linear-gradient(135deg, #F15F48 0%, #E03694 100%)'
  }
];

function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px 20% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    if (prefersReducedMotion) {
       setCount(target);
       return;
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * easeOutQuart));

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasStarted, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

type PhotoStackImage = {
  webp: string;
  jpg: string;
  alt: string;
};

function PhotoStack({
  images,
  label,
  prefersReducedMotion,
}: {
  images: PhotoStackImage[];
  label: string;
  prefersReducedMotion: boolean;
}) {
  const [order, setOrder] = useState(() => images.map((_, i) => i));

  const rotate = () => {
    setOrder((prev) => (prev.length <= 1 ? prev : [...prev.slice(1), prev[0]]));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      rotate();
    }
  };

  // The stack is intentionally calm: subtle depth, small rotation, no flash.
  const stackPositions = [
    { y: 0, scale: 1, rotate: 0, shadow: 'shadow-md' },
    { y: 12, scale: 0.975, rotate: -1.5, shadow: 'shadow-sm' },
    { y: 22, scale: 0.95, rotate: 1.5, shadow: 'shadow-sm' },
  ];

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={rotate}
        onKeyDown={onKeyDown}
        aria-label={label}
        className="group relative w-full max-w-2xl rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/40"
      >
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
          <div className="relative w-full aspect-[4/3]">
            {order.slice(0, 3).map((imgIndex, position) => {
              const img = images[imgIndex];
              const pos = stackPositions[position] ?? stackPositions[0];

              return (
                <motion.div
                  key={imgIndex}
                  className={`absolute inset-0 ${pos.shadow} rounded-2xl border border-slate-100 bg-white p-2 ring-1 ring-slate-200/70`}
                  style={{ zIndex: 10 - position }}
                  animate={
                    prefersReducedMotion
                      ? { y: pos.y, scale: pos.scale, rotate: pos.rotate }
                      : { y: pos.y, scale: pos.scale, rotate: pos.rotate }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 260, damping: 24 }
                  }
                >
                  <picture className="block w-full h-full rounded-xl overflow-hidden bg-white">
                    <source type="image/webp" srcSet={img.webp} />
                    <img
                      src={img.jpg}
                      alt={img.alt}
                      className="w-full h-full object-contain brightness-[0.92] contrast-[1.04]"
                      loading="lazy"
                      draggable={false}
                    />
                  </picture>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-sm">
            <span className="sp-text-sm text-slate-500">Click to shuffle photos</span>
            <span className="sp-text-sm text-slate-400">{images.length} images</span>
          </div>
        </div>
      </button>
    </div>
  );
}

export function ImpactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const heleneImages: PhotoStackImage[] = [
    {
      webp: helene1Webp,
      jpg: helene1Jpg,
      alt: 'Helene: One Year of Healing community moment 1',
    },
    {
      webp: helene2Webp,
      jpg: helene2Jpg,
      alt: 'Helene: One Year of Healing community moment 2',
    },
    {
      webp: helene3Webp,
      jpg: helene3Jpg,
      alt: 'Helene: One Year of Healing community moment 3',
    },
  ];

  const oraImages: PhotoStackImage[] = [
    {
      webp: ora1Webp,
      jpg: ora1Jpg,
      alt: 'Dr. Ora Brain Health Series community moment 1',
    },
    {
      webp: ora2Webp,
      jpg: ora2Jpg,
      alt: 'Dr. Ora Brain Health Series community moment 2',
    },
    {
      webp: ora3Webp,
      jpg: ora3Jpg,
      alt: 'Dr. Ora Brain Health Series community moment 3',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <SEOHead
        title="Our Impact | SparkPoint"
        description="See SparkPoint’s measurable 2025 impact across attendance, partnerships, and programs advancing community connection and resilience in Transylvania County."
        path="/impact"
      />
      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="relative pt-24 pb-12 md:pt-32 md:pb-24 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(224, 54, 148, 0.08) 0%, rgba(158, 80, 159, 0.08) 50%, rgba(253, 181, 21, 0.08) 100%)',
            }}
          />
          
          {/* Floating Gradient Orbs */}
          <motion.div
            animate={prefersReducedMotion ? {} : { 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224, 54, 148, 0.2) 0%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          />
          <motion.div
            animate={prefersReducedMotion ? {} : { 
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '40%',
              right: '15%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(158, 80, 159, 0.2) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />
          <motion.div
            animate={prefersReducedMotion ? {} : { 
              x: [0, 20, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253, 181, 21, 0.15) 0%, transparent 70%)',
              filter: 'blur(45px)'
            }}
          />
          
          {/* Geometric Pattern Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="#E03694" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div 
          className="relative z-10 max-w-6xl mx-auto text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div 
                className="px-6 py-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #E03694, #9E509F)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                2025 Impact Report
              </div>
            </motion.div>
            
            <h1
              className="mb-6 md:mb-8"
              style={{ 
                color: '#1A1A1A', 
                fontSize: 'clamp(3rem, 10vw, 5rem)', // Responsive font size
                lineHeight: '1', 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #666666 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Impact in Action
            </h1>
            <p
              className="max-w-3xl mx-auto mb-12"
              style={{ 
                color: '#666666', 
                fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', // Responsive font size
                lineHeight: '1.6' 
              }}
            >
              Measuring the difference we make together — through data, stories, 
              and the lasting change we create in our community.
            </p>
            
            {/* Quick Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 items-center"
            >
              {impactMetrics.slice(0, 3).map((metric, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: metric.gradient }}
                  />
                  <span style={{ color: '#1A1A1A', fontSize: '1.125rem', fontWeight: '600' }}>
                    <Counter target={metric.value} />
                    {'displaySuffix' in metric && metric.displaySuffix ? metric.displaySuffix : ''}
                  </span>
                  <span style={{ color: '#666666', fontSize: '0.95rem' }}>
                    {'shortLabel' in metric && metric.shortLabel ? metric.shortLabel : metric.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Community Impact, at County Scale (Narrative Rewrite) */}
      <section className="py-12 md:py-24 px-6 bg-white relative overflow-hidden">
        {/* Narrative Flow Container */}
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* 1. Lead With Presence */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24 text-center md:text-left"
          >
             <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
  SparkPoint was present in the community{" "}
  <span className="text-[#E03694]">week after week</span> in 2025.
</h2>

              <p className="text-lg md:text-2xl text-slate-600 mb-8 md:mb-12 leading-relaxed max-w-3xl">
                  Trust isn’t built in moments. It’s built in presence. In a rural county of ~33,000 people, sustained connection matters more than volume.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 md:gap-16 border-t border-slate-100 pt-8 mb-8">
                  <div>
                      <div className="text-3xl font-bold text-slate-900">{IMPACT_2025.eventsLogged.toLocaleString()}</div>
                      <div className="sp-text-sm text-slate-500">Total Events & Sessions</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-900">{IMPACT_2025.monthsActiveProgramming} Months</div>
                      <div className="sp-text-sm text-slate-500">Active Programming</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-900">{IMPACT_2025.attendanceTotalRecordedMinimum.toLocaleString()}+</div>
                      <div className="sp-text-sm text-slate-500">Verified Attendance Moments</div>
                  </div>
              </div>

              {/* December Highlights */}
              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-[#E03694] inline-block w-full max-w-3xl">
                  <p className="text-slate-700 font-medium mb-3">
                      December included community-wide holiday events and public gatherings that reinforced year-long trust and visibility:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sp-text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                          <Sparkles className="text-[#E03694]" size={16} />
                          <span>Holiday Gala (~90 attendees)</span>
                      </li>
                      <li className="flex items-center gap-2">
                          <Users className="text-[#9E509F]" size={16} />
                          <span>Light Up the Night (~200 engaged)</span>
                      </li>
                  </ul>
              </div>

              {/* Community Moments Image */}
              <div className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <img 
                    src={communityMomentImg} 
                    alt="SparkPoint community members gathering during 2025 events in Transylvania County" 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-gray-50 text-center">
                    <p className="sp-text-sm text-gray-500 font-medium uppercase tracking-wider">Community Moments: 2025 Highlights</p>
                  </div>
              </div>
          </motion.div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 2. Density / Attendance */}
          <div className="bg-slate-50/70 rounded-3xl p-6 md:p-10 border border-slate-100">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative pl-6 md:pl-8 border-l-4 border-slate-200"
            >
                <div className="mb-4 sp-text-sm font-bold tracking-widest text-slate-400 uppercase">Engagement Density</div>
                <div className="text-4xl md:text-7xl font-bold text-[#9E509F] mb-4">
                    {IMPACT_2025.attendanceTotalRecordedMinimum.toLocaleString()}+
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Verified Attendance Moments</h3>
                <p className="text-base md:text-lg text-slate-600 max-w-2xl">
                    This number doesn't just represent reach—it represents <span className="font-semibold text-[#9E509F]">return</span>. 
                    It reflects repeated engagement, meaning people didn’t just come once—they came back.
                </p>
            </motion.div>
          </div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 3. Youth Presence (Pillar) */}
          <div className="bg-white rounded-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className=""
            >
                <div className="bg-slate-50 rounded-3xl p-6 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDB515] opacity-10 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <h3 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">
                        Youth engagement is our <span className="text-[#FDB515]">foundation</span>.
                    </h3>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl relative z-10">
                        It’s not a sidebar—it represents nearly half of SparkPoint’s entire participation footprint.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">Youth-Centered Programs</div>
                            <div className="sp-text-sm text-slate-500 font-medium">Ongoing sessions that prioritize student voice and resilience.</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">School + Community Settings</div>
                            <div className="sp-text-sm text-slate-500 font-medium">Programming runs across campus and neighborhood partner spaces.</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">Partner-Led Delivery</div>
                            <div className="sp-text-sm text-slate-500 font-medium">SparkPoint convenes with educators and youth-focused organizations.</div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-200/60 sp-text-sm text-slate-500 relative z-10">
                        <span className="font-semibold">Primary Partners:</span> TC Strong, CARE
                    </div>
                </div>
            </motion.div>
          </div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 4. Community as Connector */}
          <div className="bg-slate-50/70 rounded-3xl p-6 md:p-10 border border-slate-100">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
                <div>
                    <div className="mb-4 sp-text-sm font-bold tracking-widest text-[#F15F48] uppercase">Connector Work</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Supporting the backbone of community.
                    </h3>
                    <p className="text-base md:text-lg text-slate-600 mb-6">
                        Across adult and community convenings, SparkPoint often steps back—serving as the connector and facilitator so our partners can lead.
                    </p>
                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#F15F48] rounded-full"></span>
                            Community Conversations
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#F15F48] rounded-full"></span>
                            Leadership Talks
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#F15F48] rounded-full"></span>
                            Recovery-Aligned Sessions
                        </li>
                    </ul>
                </div>
                <div className="bg-[#FFF5F2] rounded-3xl p-6 md:p-10 flex items-center justify-center min-h-[200px] md:min-h-[240px]">
                     <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-[#F15F48] mb-2">Connector Role</div>
                        <div className="text-slate-600 font-medium">Community + Partner Convenings</div>
                     </div>
                </div>
            </motion.div>
          </div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 5. Story Collection */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=""
          >
              <div className="border-l-4 border-[#E03694] pl-8 py-4 bg-gradient-to-r from-pink-50/50 to-transparent rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Story Collection as Intelligence</h3>
                  <p className="text-lg text-slate-600 mb-6 max-w-3xl">
                      We treat stories as data. Through countywide story collection and resident interviews, community voices directly inform our priorities, advocacy, and response.
                  </p>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#E03694]/20 text-[#E03694] sp-text-sm font-medium">
                      Listening is an active metric.
                  </div>
              </div>
          </motion.div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 6. Anchor Moments */}
          <div className="bg-slate-50/70 rounded-3xl p-6 md:p-10 border border-slate-100">
            <h3 className="text-3xl font-bold text-slate-900 mb-4 text-center" style={{ opacity: 1 }}>
              Moments that consolidate trust.
            </h3>

            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-500" style={{ opacity: 1, transform: 'none' }}>
              Trust becomes visible when communities return, institutions invite us back, and partnerships deepen over time.
            </p>

            <div className="space-y-6">
              {/* Helene: One Year of Healing (keep the event badge icon as-is) */}
              <div
                className="flex items-start gap-6 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-transform hover:scale-[1.01]"
                style={{ opacity: 1, transform: 'none' }}
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 mt-1">
                  <img src={heleneIcon} alt="Helene: One Year of Healing event badge" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Helene: One Year of Healing</h4>
                  <p className="text-slate-500">
                    One year after the storm, SparkPoint convened partners and residents to mark resilience together — creating space for collective processing and renewed collaboration.
                  </p>
              <PhotoStack
                images={heleneImages}
                label="Helene: One Year of Healing photo stack"
                prefersReducedMotion={prefersReducedMotion}
              />
                </div>
              </div>

              {/* Dr. Ora Brain Health Series */}
              <div
                className="flex items-start gap-6 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-transform hover:scale-[1.01]"
                style={{ opacity: 1, transform: 'none' }}
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 mt-1">
                  <span className="text-3xl">🧠</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Dr. Ora Brain Health Series</h4>
                  <p className="text-slate-500">
                    Hosted across Brevard College, Rotary, Cedar Mountain, and Saluda, this series traveled through the county through repeated invitations from trusted partners.
                  </p>
              <PhotoStack
                images={oraImages}
                label="Dr. Ora Brain Health Series photo stack"
                prefersReducedMotion={prefersReducedMotion}
              />
                </div>
              </div>
            </div>
          </div>
          <div className="my-12 md:my-16 border-t border-slate-100" />

          {/* 7. Momentum */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl"
          >
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Momentum increased toward the end of the year.</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                  <div>
                      <div className="text-5xl font-bold text-[#FDB515] mb-2">{IMPACT_2025.novemberAttendanceMoments.toLocaleString()}</div>
                      <div className="text-white/60 sp-text-sm uppercase tracking-wider">November Attendance Moments</div>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-white/10"></div>
                  <div>
                      <div className="text-5xl font-bold text-[#FDB515] mb-2">{IMPACT_2025_NOVEMBER_SHARE_PERCENT}%</div>
                      <div className="text-white/60 sp-text-sm uppercase tracking-wider">of Annual Reach in Nov</div>
                  </div>
              </div>
          </motion.div>
          <div className="my-12 md:my-16" />

          {/* Closing */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
              <p className="text-xl md:text-2xl font-serif italic text-slate-400">
                  "Growth followed trust — not the other way around."
              </p>
          </motion.div>

        </div>
      </section>





      {/* Enhanced Annual Reports CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated Gradient Background */}
          <motion.div 
            animate={prefersReducedMotion ? {} : { 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'linear-gradient(135deg, #E03694 0%, #9E509F 30%, #FDB515 60%, #F15F48 100%)',
              backgroundSize: '200% 200%'
            }}
            className="absolute inset-0"
          />
          
          {/* Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FileText size={64} style={{ color: 'white', margin: '0 auto 32px' }} />
            </motion.div>
            
            <h2
              className="mb-6"
              style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: '1.1', letterSpacing: '-1px' }} // Responsive font size
            >
              Dive Deeper into Our Impact
            </h2>
            
            <p
              className="mb-12 max-w-3xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.6' }}
            >
              Explore detailed annual reports with comprehensive data, stories, 
              and insights into how we're building a stronger community together.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="px-10 py-7 transition-all group"
                style={{
                  background: 'white',
                  color: '#E03694',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  borderRadius: '16px'
                }}
              >
                <span>Download Annual Report</span>
                <ArrowRight 
                  className="ml-2 transition-transform group-hover:translate-x-1" 
                  size={24} 
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <KeepExploringLinks
        title="Keep Exploring"
        intro="Impact is strongest when it’s connected to stories, participation, and ongoing collaboration."
        links={[
          {
            to: '/stories',
            label: 'Read the stories behind the numbers',
            description: 'Explore local stories that provide context for SparkPoint’s impact data.',
          },
          {
            to: '/volunteer',
            label: 'Volunteer with SparkPoint',
            description: 'Find ways to support community connection and resilience in practical ways.',
          },
          {
            to: '/contact',
            label: 'Contact our team',
            description: 'Reach out to ask questions or start a conversation about local collaboration.',
          },
        ]}
      />
    </div>
  );
}
