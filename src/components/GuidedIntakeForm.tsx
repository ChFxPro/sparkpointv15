'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, AlertCircle, HandHeart, Handshake, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type IntentType = 'volunteer' | 'partner' | 'contact';

interface GuidedIntakeFormProps {
  initialIntent?: IntentType;
  sourcePath?: string;
}

export function GuidedIntakeForm({ initialIntent = 'contact', sourcePath = '/' }: GuidedIntakeFormProps) {
  const [activeTab, setActiveTab] = useState<IntentType>(initialIntent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Shared state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    // Volunteer specific
    interests: [] as string[],
    availability: '',
    // Partner specific
    organization: '',
    partnershipDetails: ''
  });

  useEffect(() => {
    setActiveTab(initialIntent);
  }, [initialIntent]);

  const handleTabChange = (tab: IntentType) => {
    setActiveTab(tab);
    setSubmissionStatus('idle');
    setErrorMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const current = prev.interests;
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...current, interest] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setErrorMessage('');

    try {
      const payload = {
        intent: activeTab,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source_path: sourcePath,
        interests: activeTab === 'volunteer' ? formData.interests : [],
        availability: activeTab === 'volunteer' ? formData.availability : '',
        organization: activeTab === 'partner' ? formData.organization : '',
        partnershipDetails: activeTab === 'partner' ? formData.partnershipDetails : ''
      };

      const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-393f2b0a/intake`;
      const headers = {
        'Content-Type': 'application/json',
        'apikey': publicAnonKey,
        'Authorization': `Bearer ${publicAnonKey}`,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmissionStatus('success');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Volunteer Interests Options
  const volunteerInterests = [
    'Events & Outreach',
    'SparkPoint Resource Lobby',
    'Story-Collection',
    'Voice of the Students',
    'Preparedness',
    'General Volunteer'
  ];

  if (submissionStatus === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FAF7F5] rounded-3xl shadow-lg border border-[#EBE5E0] p-12 text-center h-full flex flex-col items-center justify-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Message Received</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Thank you for connecting with SparkPoint. We have received your {activeTab} inquiry. Our team reads every message and will be in touch shortly.
        </p>
        <Button 
          onClick={() => {
            setSubmissionStatus('idle');
            setFormData(prev => ({ ...prev, message: '', interests: [] }));
          }}
          className="bg-[#E03694] hover:bg-[#c91e7e] text-white px-8 py-3 h-auto rounded-full font-semibold transition-all shadow-md"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab-like Lane Selectors */}
      <div className="flex flex-col md:flex-row p-1.5 bg-[#F0EBE6] rounded-2xl gap-1.5 md:gap-2">
        {[
          { 
            id: 'volunteer', 
            label: 'Volunteer', 
            desc: 'Lend a hand',
            icon: HandHeart 
          },
          { 
            id: 'partner', 
            label: 'Partner', 
            desc: 'Collaborate',
            icon: Handshake 
          },
          { 
            id: 'contact', 
            label: 'Contact', 
            desc: 'Get in touch',
            icon: MessageCircle 
          }
        ].map((lane) => {
          const isActive = activeTab === lane.id;
          const Icon = lane.icon;
          return (
            <button
              key={lane.id}
              onClick={() => handleTabChange(lane.id as IntentType)}
              className={`
                flex-1 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1.5 p-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-white text-[#E03694] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
              `}
              aria-pressed={isActive}
            >
              <Icon size={18} className={isActive ? 'text-[#E03694]' : 'opacity-70'} />
              <div className="flex flex-col md:items-center text-left md:text-center leading-tight">
                <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                   {lane.label}
                </span>
                <span className="text-[10px] md:text-xs opacity-80 hidden sm:block">
                   {lane.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <motion.div 
        layout
        className="bg-[#FFFCFA] rounded-3xl shadow-[0_8px_30px_-8px_rgba(224,54,148,0.08)] border border-[#EBE5E0] overflow-hidden"
      >
        {/* Header / Trust Indicator area */}
        <div className="px-8 pt-8 pb-0">
             <div className="flex items-center gap-2 text-[#E03694]/90 bg-[#E03694]/5 px-3 py-1.5 rounded-full w-fit mb-2">
                 <ShieldCheck size={14} />
                 <span className="text-xs font-semibold uppercase tracking-wide">Secure & Confidential</span>
             </div>
             <p className="text-slate-500 text-sm">
                We read every message and typically respond within 24 hours.
             </p>
        </div>

        <div className="p-8 md:p-10 pt-6">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section: About You */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100/80">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F0EB] text-slate-500 text-xs font-bold font-mono">1</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">About You</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all placeholder:text-slate-300"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all placeholder:text-slate-300"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                  Phone Number <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all placeholder:text-slate-300"
                  placeholder="(828) 555-0123"
                />
              </div>
            </div>

            {/* Section: How to Connect */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 pb-2 border-b border-slate-100/80">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F0EB] text-slate-500 text-xs font-bold font-mono">2</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Details</h3>
              </div>

              {/* Tab Specific Fields */}
              <AnimatePresence mode="wait">
                {activeTab === 'partner' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label htmlFor="organization" className="block text-sm font-semibold text-slate-700">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        required={activeTab === 'partner'}
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all placeholder:text-slate-300"
                        placeholder="Company or Non-profit Name"
                      />
                    </div>
                     <div className="space-y-2">
                      <label htmlFor="partnershipDetails" className="block text-sm font-semibold text-slate-700">
                        Partnership Ideas
                      </label>
                      <textarea
                        id="partnershipDetails"
                        name="partnershipDetails"
                        value={formData.partnershipDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all resize-y placeholder:text-slate-300"
                        placeholder="Briefly describe how you'd like to partner with SparkPoint..."
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'volunteer' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <label className="block text-sm font-semibold text-slate-700">Areas of Interest</label>
                        <span className="text-xs text-slate-500">Select all that apply</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {volunteerInterests.map((interest) => {
                           const isSelected = formData.interests.includes(interest);
                           return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleInterestToggle(interest)}
                              className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
                                ${isSelected 
                                  ? 'bg-[#E03694]/5 border-[#E03694] text-[#E03694]' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-[#FAF7F5]'}
                              `}
                            >
                              <div className={`
                                w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                ${isSelected ? 'bg-[#E03694] border-[#E03694]' : 'border-slate-200 bg-white'}
                              `}>
                                {isSelected && <CheckCircle2 size={12} className="text-white" />}
                              </div>
                              <span className="text-sm font-medium">{interest}</span>
                            </button>
                           );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="availability" className="block text-sm font-semibold text-slate-700">
                        Availability
                      </label>
                      <input
                        type="text"
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all placeholder:text-slate-300"
                        placeholder="e.g., Weekends, Tuesday mornings, On-call..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shared Message Area */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E03694]/10 focus:border-[#E03694] outline-none transition-all resize-y placeholder:text-slate-300"
                  placeholder={activeTab === 'partner' ? "Additional comments..." : "How can we help you?"}
                />
              </div>
            </div>

            {/* Error Message */}
            {submissionStatus === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                   <p className="font-semibold text-sm">Submission Error</p>
                   <p className="text-sm">{errorMessage}</p>
                   <p className="text-sm mt-1">If this persists, please email us directly at <a href="mailto:info@yoursparkpoint.org" className="underline hover:text-red-800">info@yoursparkpoint.org</a>.</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E03694] hover:bg-[#c91e7e] text-white font-bold py-4 text-lg h-auto rounded-full shadow-[0_4px_14px_0_rgba(224,54,148,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(224,54,148,0.23)] hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Sending...
                  </span>
                ) : (
                  "Send message"
                )}
              </Button>
              <div className="mt-4 text-center">
                 <p className="text-xs text-slate-400">
                   By submitting, you agree to share this info with our team. We respect your privacy.
                 </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
