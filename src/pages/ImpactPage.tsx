'use client';

import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { TrendingUp, Users, Heart, Award, Calendar, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAccessibility } from '../context/AccessibilityContext';
import communityMomentImg from 'figma:asset/c468599141a487a1168ff53b1f6de665f3b4be9d.png';
import heleneIcon from 'figma:asset/3c1537cde524e7172c827aa2411c2c759ae68ece.png';

const impactMetrics = [
  {
    icon: Users,
    value: 12500,
    label: 'Community Touchpoints in 2025',
    shortLabel: 'Touchpoints',
    description: 'Cumulative participation across programs, youth engagement, events, and partner collaborations throughout the year.',
    color: '#E03694',
    gradient: 'linear-gradient(135deg, #E03694 0%, #F15F48 100%)'
  },
  {
    icon: Heart,
    value: 850,
    label: 'Volunteer Hours',
    shortLabel: 'Volunteer Hours',
    description: 'Dedicated community volunteers making a difference',
    color: '#9E509F',
    gradient: 'linear-gradient(135deg, #9E509F 0%, #E03694 100%)'
  },
  {
    icon: TrendingUp,
    value: 45,
    label: 'Partner Organizations',
    shortLabel: 'Partners',
    description: 'Collaborative partnerships strengthening our network',
    color: '#FDB515',
    gradient: 'linear-gradient(135deg, #FDB515 0%, #F15F48 100%)'
  },
  {
    icon: Award,
    value: 98,
    label: 'Programs Delivered',
    description: 'Wellness, preparedness, and connection initiatives',
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
      { threshold: 0.5 }
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

export function ImpactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>Our Impact | SparkPoint</title>
        <meta name="description" content="How SparkPoint supports well-being, resilience, and collaboration." />
        <link rel="canonical" href="https://chfxpro.github.io/sparkpointv15/impact" />
      </Helmet>
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
                    <Counter target={metric.value} />+
                  </span>
                  <span style={{ color: '#666666', fontSize: '0.875rem' }}>
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
                      <div className="text-3xl font-bold text-slate-900">77+</div>
                      <div className="text-sm text-slate-500">Total Events & Sessions</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-900">12 Months</div>
                      <div className="text-sm text-slate-500">Active Programming</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-900">4,187</div>
                      <div className="text-sm text-slate-500">Verified Attendance Moments</div>
                  </div>
              </div>

              {/* December Highlights */}
              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-[#E03694] inline-block w-full max-w-3xl">
                  <p className="text-slate-700 font-medium mb-3">
                      December included community-wide holiday events and public gatherings that reinforced year-long trust and visibility:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
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
                    alt="Community moments from 2025 events" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Community Moments: 2025 Highlights</p>
                  </div>
              </div>
          </motion.div>

          {/* 2. Density / Attendance */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32 relative pl-6 md:pl-8 border-l-4 border-slate-200"
          >
              <div className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">Engagement Density</div>
              <div className="text-4xl md:text-7xl font-bold text-[#9E509F] mb-4">
                  4,187
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Verified Attendance Moments</h3>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl">
                  This number doesn't just represent reach—it represents <span className="font-semibold text-[#9E509F]">return</span>. 
                  It reflects repeated engagement, meaning people didn’t just come once—they came back.
              </p>
          </motion.div>

          {/* 3. Youth Presence (Pillar) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32"
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
                          <div className="text-4xl font-bold text-slate-900 mb-1">~2,100</div>
                          <div className="text-sm text-slate-500 font-medium">Youth Attendance Moments</div>
                      </div>
                      <div>
                          <div className="text-4xl font-bold text-slate-900 mb-1">34+</div>
                          <div className="text-sm text-slate-500 font-medium">Youth-Focused Sessions</div>
                      </div>
                      <div>
                          <div className="text-4xl font-bold text-slate-900 mb-1">6</div>
                          <div className="text-sm text-slate-500 font-medium">Campuses Served</div>
                      </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-200/60 text-sm text-slate-500 relative z-10">
                      <span className="font-semibold">Primary Partners:</span> TC Strong, CARE
                  </div>
              </div>
          </motion.div>

          {/* 4. Community as Connector */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
              <div>
                  <div className="mb-4 text-sm font-bold tracking-widest text-[#F15F48] uppercase">Connector Work</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                      Supporting the backbone of community.
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 mb-6">
                      For our 43+ adult and community events, SparkPoint often steps back—serving as the connector and facilitator so our partners can lead.
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
                      <div className="text-5xl md:text-6xl font-bold text-[#F15F48] mb-2">43+</div>
                      <div className="text-slate-600 font-medium">Community Events</div>
                   </div>
              </div>
          </motion.div>

          {/* 5. Story Collection */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
              <div className="border-l-4 border-[#E03694] pl-8 py-4 bg-gradient-to-r from-pink-50/50 to-transparent rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Story Collection as Intelligence</h3>
                  <p className="text-lg text-slate-600 mb-6 max-w-3xl">
                      We treat stories as data. Across <span className="font-bold text-[#E03694]">10 collection stops</span> and <span className="font-bold text-[#E03694]">120+ interviews</span>, resident voices directly inform our priorities, advocacy, and response.
                  </p>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#E03694]/20 text-[#E03694] text-sm font-medium">
                      Listening is an active metric.
                  </div>
              </div>
          </motion.div>

          {/* 6. Anchor Moments */}
          <div className="mb-32">
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-slate-900 mb-12 text-center"
              >
                Moments that consolidate trust.
              </motion.h3>
              
              <div className="space-y-6">
                  {[
                    { title: "Juneteenth Festival", desc: "A celebration of shared history and community joy.", icon: <span className="text-2xl">🎉</span> },
                    { title: "Helene: One Year of Healing", desc: "Marking resilience and recovery together.", icon: <img src={heleneIcon} alt="Helene Badge" className="w-10 h-10 object-contain" /> },
                    { title: "TCS Convocation", desc: "Aligning with educators for the year ahead.", icon: <span className="text-2xl">🎓</span> }
                  ].map((event, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-6 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-transform hover:scale-[1.01]"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
                          {event.icon}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">{event.title}</h4>
                            <p className="text-slate-500">{event.desc}</p>
                        </div>
                    </motion.div>
                  ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white shadow-lg">
                      <span className="font-bold text-2xl">700</span>
                      <span className="text-sm text-slate-300 border-l border-slate-700 pl-3">Largest Single-Event Attendance</span>
                  </div>
              </motion.div>
          </div>

          {/* 7. Momentum */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl"
          >
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Momentum increased toward the end of the year.</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                  <div>
                      <div className="text-5xl font-bold text-[#FDB515] mb-2">565</div>
                      <div className="text-white/60 text-sm uppercase tracking-wider">November Attendance Moments</div>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-white/10"></div>
                  <div>
                      <div className="text-5xl font-bold text-[#FDB515] mb-2">~13.5%</div>
                      <div className="text-white/60 text-sm uppercase tracking-wider">of Annual Reach in Nov</div>
                  </div>
              </div>
          </motion.div>

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
    </div>
  );
}
