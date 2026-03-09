'use client';

import { motion } from 'motion/react';
import { ExternalLink, ChevronDown, Check, ArrowRight, Shield, Lock, Eye, Heart, Accessibility, FileText, MousePointer2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import candidSeal from 'figma:asset/5a36f7b11c9d0bf970613a37a28b121b31918d77.png';
import livingWageLogo from 'figma:asset/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png';
import { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

export function TrustPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  const jumpLinks = [
    { label: 'Transparency', id: 'transparency' },
    { label: 'Accessibility', id: 'accessibility' },
    { label: 'Site Use', id: 'site-use' },
    { label: 'Privacy', id: 'privacy' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Trust & Accountability | SparkPoint"
        description="Review SparkPoint’s transparency, accessibility, and data stewardship commitments, including certifications and accountability practices for community trust."
        path="/trust"
      />

      {/* Hero Section */}
      <section className="pt-28 md:pt-40 pb-12 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
              Trust & Transparency
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed max-w-3xl mb-4">
              We believe in being open about how we work, how we treat people, and how we handle information.
            </p>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-12">
              Last updated: February 2026
            </p>

            {/* Jump To Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-12 text-sm md:text-base border-t border-b border-gray-100 py-6">
              <span className="font-semibold text-gray-400 uppercase tracking-widest text-xs py-1">Jump to:</span>
              {jumpLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-[#E03694] hover:text-[#9E509F] font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Intro */}
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Commitment</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                SparkPoint exists to strengthen community well-being through connection. That requires trust. This page outlines our standards for transparency, accessibility, and privacy so you know exactly where we stand.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transparency & Certifications */}
      <section id="transparency" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
             <Eye size={28} className="text-[#E03694]" />
             <h2 className="text-3xl font-bold text-[#1A1A1A]">Transparency</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candid Card */}
            <Card className="p-8 border-none shadow-sm bg-white rounded-2xl flex flex-col h-full">
               <div className="flex-1">
                 <img src={candidSeal} alt="Candid Gold Seal" className="h-16 w-auto mb-6" />
                 <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Candid Gold Seal</h3>
                 <p className="text-gray-600 mb-6 leading-relaxed">
                   We openly share our financials, leadership info, and program details. The Gold Seal reflects our commitment to clarity—so you can see exactly how we operate.
                 </p>
               </div>
               <Button asChild variant="outline" className="w-full sm:w-auto text-sm mt-4">
                  <a href="https://app.candid.org/profile/9865154/sparkpoint--dba-sustainable-health-for-all-84-4042532" target="_blank" rel="noopener noreferrer">
                      View Candid Profile
                  </a>
               </Button>
            </Card>

            {/* Living Wage Card */}
            <Card className="p-8 border-none shadow-sm bg-white rounded-2xl flex flex-col h-full">
               <div className="flex-1">
                 <img src={livingWageLogo} alt="Living Wage Certified" className="h-16 w-auto mb-6" />
                 <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Living Wage Certified</h3>
                 <p className="text-gray-600 mb-6 leading-relaxed">
                   We pay a living wage because community health starts with our own team. We are certified by Just Economics to ensure fair compensation that meets real needs.
                 </p>
               </div>
               <Button asChild variant="outline" className="w-full sm:w-auto text-sm mt-4">
                  <a href="https://www.justeconomicswnc.org/certified-employer/sparkpoint/" target="_blank" rel="noopener noreferrer">
                      View Certification
                  </a>
               </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Accessibility Commitment */}
      <section id="accessibility" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Accessibility size={28} className="text-[#E03694]" />
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Accessibility Commitment</h2>
            </div>
            
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    We are committed to making this website usable by as many people as possible, regardless of technology or ability.
                </p>
                <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                        <Check size={20} className="text-[#E03694] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">We aim to meet WCAG 2.1 AA standards.</span>
                    </li>
                    <li className="flex gap-4">
                        <Check size={20} className="text-[#E03694] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">We test with keyboard navigation and screen readers in mind.</span>
                    </li>
                    <li className="flex gap-4">
                        <Check size={20} className="text-[#E03694] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">We know we aren't perfect, and we are always learning and improving.</span>
                    </li>
                </ul>
                
                <div className="pt-6 border-t border-gray-200">
                    <p className="font-bold text-[#1A1A1A] mb-2">Notice something that’s hard to use?</p>
                    <p className="text-gray-600 text-sm mb-4">Please let us know so we can fix it.</p>
                    <a href="mailto:info@yoursparkpoint.org" className="inline-flex items-center text-[#E03694] font-medium hover:underline">
                        Email us at info@yoursparkpoint.org <ArrowRight size={16} className="ml-2" />
                    </a>
                </div>
            </div>
        </div>
      </section>

      {/* Site Use & Content */}
      <section id="site-use" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <MousePointer2 size={28} className="text-[#E03694]" />
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Site Use & Expectations</h2>
            </div>
            
            <div className="prose prose-lg text-gray-600">
                <p>
                    We provide this website to share information, stories, and resources for our community.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li><strong>Respectful Use:</strong> Please use this site and its content with respect for the people and stories featured here.</li>
                    <li><strong>Information Only:</strong> While we aim for accuracy, the content here is for informational purposes and not professional advice.</li>
                    <li><strong>External Links:</strong> We link to other organizations to be helpful, but we don't control their content or policies.</li>
                </ul>
            </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section id="privacy" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Shield size={28} className="text-[#E03694]" />
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Data & Privacy</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Lock size={120} />
                </div>
                
                <p className="text-xl text-gray-800 font-medium mb-6">
                    We do not sell your personal data. Period.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8 max-w-xl">
                    We only collect information that helps us connect with you (like when you email us or volunteer). We treat your data with care and security.
                </p>

                <Link to="/privacy">
                    <Button className="bg-[#1A1A1A] hover:bg-[#333] text-white px-8 py-6 h-auto text-lg">
                        Read our full Privacy Policy <ArrowRight size={20} className="ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-10">Common Questions</h2>
            <div className="space-y-4">
                <AccordionItem 
                    question="How can I see your financial reports?" 
                    answer="You can view our detailed financial reporting (Form 990s) on our Candid profile, which is linked in the Transparency section above."
                />
                <AccordionItem 
                    question="Who certifies your Living Wage status?" 
                    answer="We are certified by Just Economics of Western North Carolina, a local organization that calculates the real cost of living in our region."
                />
                <AccordionItem 
                    question="Do you use cookies?" 
                    answer="We use very basic analytics to see which pages are popular, but we do not use tracking cookies to follow you around the internet or sell your browsing history."
                />
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 border-t border-gray-100">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Still have questions?</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Transparency works best when it's a conversation. If you’re unsure about something, just ask.
            </p>
            
            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium text-[#1A1A1A]">
                    <a href="mailto:info@yoursparkpoint.org" className="hover:text-[#E03694] transition-colors">info@yoursparkpoint.org</a>
                </p>
                <Link to="/contact">
                    <Button variant="outline" size="lg" className="mt-2">
                        Go to Contact Page
                    </Button>
                </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
            >
                <span className="font-bold text-lg text-[#1A1A1A]">{question}</span>
                <ChevronDown 
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            <motion.div 
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
                    {answer}
                </div>
            </motion.div>
        </div>
    )
}
