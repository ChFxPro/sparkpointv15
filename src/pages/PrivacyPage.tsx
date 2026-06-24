'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Mail, Shield, Lock, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { CONTACT_INFO } from '../data/contactInfo';
import { SEOHead } from '../components/SEOHead';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Privacy Policy | SparkPoint"
        description="Read SparkPoint’s privacy policy and learn how we collect, use, and protect information to support trusted community connection in Transylvania County and WNC."
        path="/privacy"
      />

      <section className="pt-28 md:pt-40 pb-12 md:pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/trust" className="inline-flex items-center text-gray-500 hover:text-[#E03694] mb-8 transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Trust & Accountability
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed mb-4">
              We treat your information with the same care and respect we’d want for our own.
            </p>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-12">
              Last updated: February 2026
            </p>

            {/* Core Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: EyeOff, title: "No Selling", text: "We never sell your personal data to anyone." },
                { icon: Shield, title: "Only What's Needed", text: "We only collect what helps us connect with you." },
                { icon: Lock, title: "Secure Storage", text: "Your data is kept safe and access is limited." }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
                  <item.icon className="text-[#E03694] mb-4" size={24} />
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="prose prose-lg text-gray-600 max-w-none">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">What information we collect</h2>
              <p>
                We collect information primarily when you choose to give it to us. This happens when you:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-8">
                <li>Fill out a contact form or sign up for updates (Name, Email).</li>
                <li>Register to volunteer (Contact info, interests, availability).</li>
                <li>Make a donation (processed securely through our payment partners; we do not store full credit card numbers).</li>
                <li>Share a story with us (only what you choose to share).</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">How we use it</h2>
              <p>
                We use this information to do the work you asked us to do. Specifically:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-8">
                <li><strong>To Communicate:</strong> Responding to your questions or sending updates you signed up for.</li>
                <li><strong>To Coordinate:</strong> Organizing volunteer schedules or events.</li>
                <li><strong>To Report:</strong> We use aggregated (non-identifiable) data to show our impact to funders and the community (e.g., "100 volunteers joined us this year").</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">What we do NOT do</h2>
              <p className="mb-8">
                We do not sell, rent, or trade your personal information to third parties. We do not use your data for advertising tracking across other websites.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">How we protect it</h2>
              <p className="mb-8">
                We use industry-standard security measures to protect your data. Access to personal information is restricted to staff and authorized volunteers who need it to perform their specific roles. We review these practices regularly to ensure they meet our community standards.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">External Links</h2>
              <p className="mb-8">
                Our website may contain links to other sites (like partner organizations or resources). We are not responsible for the privacy practices of those other sites. We encourage you to read their privacy policies if you visit them.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">Questions?</h2>
              <p className="mb-8">
                If you have any questions about this policy or your data, please reach out. We are happy to answer them.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 px-6 py-4 bg-[#FDFDFD] border border-gray-200 rounded-xl hover:border-[#E03694] hover:text-[#E03694] transition-all group">
                <Mail size={20} className="text-gray-400 group-hover:text-[#E03694] transition-colors" />
                <span className="font-medium">{CONTACT_INFO.email}</span>
              </a>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
