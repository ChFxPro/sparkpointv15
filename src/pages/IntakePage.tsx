'use client';

import { useSearchParams } from 'react-router';
import { GuidedIntakeForm } from '../components/GuidedIntakeForm';
import { motion } from 'motion/react';
import { Mail, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

const ConnectionMotif = () => (
  <svg 
    className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply" 
    viewBox="0 0 1440 800" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMin slice"
  >
    <defs>
      <linearGradient id="motifGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E03694" stopOpacity="0.08" />
        <stop offset="50%" stopColor="#FDB515" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#E03694" stopOpacity="0.03" />
      </linearGradient>
    </defs>
    <path 
      d="M-100,600 C200,500 400,750 600,650 S900,300 1200,450 S1600,200 1800,300" 
      stroke="url(#motifGradient)" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round"
    />
    <path 
      d="M-150,500 C150,550 450,400 700,550 S1100,600 1400,400 S1700,500 1900,450" 
      stroke="url(#motifGradient)" 
      strokeWidth="2" 
      fill="none" 
      strokeDasharray="10 20"
      strokeLinecap="round"
      opacity="0.7"
    />
     <circle cx="1200" cy="450" r="150" stroke="url(#motifGradient)" strokeWidth="1" opacity="0.5" />
  </svg>
);

export function IntakePage() {
  const [searchParams] = useSearchParams();
  const intentParam = searchParams.get('intent');
  
  // Validate intent
  const validIntents = ['volunteer', 'partner', 'contact'];
  const initialIntent = validIntents.includes(intentParam || '') 
    ? (intentParam as 'volunteer' | 'partner' | 'contact') 
    : 'contact';

  const getPageTitle = () => {
    switch (initialIntent) {
      case 'volunteer': return 'Volunteer with SparkPoint';
      case 'partner': return 'Partner with SparkPoint';
      default: return 'Contact SparkPoint';
    }
  };

  const getPageDescription = () => {
    switch (initialIntent) {
      case 'volunteer':
        return 'Connect with SparkPoint volunteer opportunities that strengthen resilience and practical support across Transylvania County and Western North Carolina.';
      case 'partner':
        return 'Start a SparkPoint partnership aligning schools, nonprofits, agencies, and businesses around community connection and resilience in Western North Carolina.';
      default:
        return 'Contact SparkPoint to ask questions, share your story, or request support as we strengthen connection and community well-being across Transylvania County.';
    }
  };

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} | SparkPoint`}
        description={getPageDescription()}
        path="/intake"
      />
      
      <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
        {/* Soft Background Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/40 to-slate-50/20 pointer-events-none" />
        
        {/* Connection Motif */}
        <ConnectionMotif />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 lg:py-24">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-manrope tracking-tight">
                Let's Connect
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Whether you're looking to volunteer, partner, or just say hello, we're glad you're here.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Main Form Area */}
            <div className="lg:col-span-8">
              <GuidedIntakeForm initialIntent={initialIntent} sourcePath={window.location.pathname + window.location.search} />
            </div>

            {/* "What Happens Next" Panel (Desktop Sidebar) */}
            <motion.div 
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-[#FAF7F5] rounded-2xl p-6 shadow-sm border border-[#EBE5E0]">
                 <h3 className="font-bold text-slate-700 text-base mb-5">What happens next</h3>
                 
                 <div className="relative space-y-6">
                    {/* Connecting Line */}
                    <div className="absolute top-2 left-3 bottom-2 w-px bg-slate-200" />

                    <div className="relative flex gap-3">
                       <div className="relative z-10 w-6 h-6 rounded-full bg-white text-[#E03694] flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <MessageSquare size={12} />
                       </div>
                       <div>
                          <h4 className="font-semibold text-slate-700 text-sm">We read your note</h4>
                          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Every submission is reviewed by a real team member.</p>
                       </div>
                    </div>

                    <div className="relative flex gap-3">
                       <div className="relative z-10 w-6 h-6 rounded-full bg-white text-orange-400 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <UserCheck size={12} />
                       </div>
                       <div>
                          <h4 className="font-semibold text-slate-700 text-sm">Routed to the right person</h4>
                          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">We ensure the right program lead sees it.</p>
                       </div>
                    </div>

                    <div className="relative flex gap-3">
                       <div className="relative z-10 w-6 h-6 rounded-full bg-white text-green-600 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <Mail size={12} />
                       </div>
                       <div>
                          <h4 className="font-semibold text-slate-700 text-sm">We follow up</h4>
                          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">You'll receive a personal response to discuss next steps.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sidebar Contact Info */}
              <div className="bg-[#FAF7F5] rounded-2xl p-6 border border-[#EBE5E0]">
                 <h4 className="font-bold text-slate-700 text-sm mb-3">Prefer to email directly?</h4>
                 <a 
                   href="mailto:info@yoursparkpoint.org" 
                   className="flex items-center gap-2 text-[#E03694] font-medium text-sm hover:underline group"
                 >
                   info@yoursparkpoint.org
                   <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                 </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
