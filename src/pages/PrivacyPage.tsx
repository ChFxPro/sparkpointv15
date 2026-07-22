'use client';

import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, EyeOff, Ban, Heart, X, Check, Database, Kanban, MessageSquare, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { CONTACT_INFO } from '../data/contactInfo';
import { SEOHead } from '../components/SEOHead';

const CONTACT_EMAIL = CONTACT_INFO.email;

const PRINCIPLES = [
  { icon: EyeOff, title: 'No tracking', text: "No analytics, ad pixels, or tracking cookies. We can’t build a profile of you — and we don’t try." },
  { icon: Ban, title: 'Never sold', text: 'We never sell, rent, or trade your information — not to advertisers, not to anyone.' },
  { icon: Heart, title: 'Only what you give', text: 'We collect nothing until you choose to reach out. It’s a conversation you started.' },
];

const NO_ITEMS = ['No Google Analytics', 'No ad pixels', 'No tracking cookies', 'No visitor profiles'];

const FORMS: { tag: string; tagClass: string; items: string[] }[] = [
  { tag: 'Contact', tagClass: 'bg-[#E03694]/10 text-[#E03694]', items: ['Name', 'Email', 'Phone (optional)', 'Your message'] },
  { tag: 'Volunteer', tagClass: 'bg-[#2f9e7f]/12 text-[#2f9e7f]', items: ['Name & email', 'Phone (optional)', 'Interests', 'Availability'] },
  { tag: 'Partner', tagClass: 'bg-[#a9720a]/12 text-[#a9720a]', items: ['Name & email', 'Organization', 'Partnership details', 'Your message'] },
];

const USES = [
  { title: 'Respond', text: 'Answer your question or message.' },
  { title: 'Coordinate', text: 'Organize volunteering, partnerships, and events.' },
  { title: 'Report', text: 'Share impact with funders — always aggregated, never identifying you.' },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Privacy Policy | SparkPoint"
        description="SparkPoint runs no analytics or tracking cookies. We collect information only when you contact us, never sell it, and delete it on request. Read our plain-language privacy policy."
        path="/privacy"
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-2">
          <Link to="/trust" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E03694] mb-7 transition-colors group text-sm font-semibold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Trust &amp; Accountability
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="block text-xs font-extrabold tracking-[0.2em] uppercase text-[#E03694] mb-4">Privacy &amp; Trust</span>
            <h1 className="font-extrabold text-[#1A1A1A] tracking-tight leading-[0.98]" style={{ fontSize: 'clamp(2.75rem, 8vw, 4.5rem)' }}>
              We don’t<br />track you<span className="text-[#E03694]">.</span>
            </h1>
            <p className="mt-5 text-lg md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
              No analytics profiling, no ad pixels, no third-party cookies. We only hold what you hand us — to do the one thing you asked: get back to you.
            </p>
            <p className="mt-4 text-xs font-bold tracking-[0.12em] uppercase text-gray-400">Last updated · July 2026</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-11 h-11 rounded-xl bg-[#FBEFF6] flex items-center justify-center mb-4"><p.icon size={22} className="text-[#E03694]" /></div>
                <h3 className="font-bold text-[#1A1A1A] mb-1.5">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* No tracking */}
        <section className="py-12">
          <span className="block text-xs font-extrabold tracking-[0.2em] uppercase text-[#E03694] mb-3">The part most sites hide</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">We don’t watch your browsing.</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl">Most websites quietly track what you do. We don’t run any of it:</p>
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-md p-7">
            <div className="flex flex-wrap gap-2.5">
              {NO_ITEMS.map((n) => (
                <span key={n} className="inline-flex items-center gap-2 bg-[#F6F3F5] rounded-full px-4 py-2 text-sm font-bold text-[#4a4350]">
                  <X size={15} className="text-[#c0563f]" strokeWidth={2.4} /> {n}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[15px] text-gray-500 leading-relaxed flex gap-2.5">
              <Check size={18} className="text-[#2f9e7f] shrink-0 mt-0.5" strokeWidth={2.2} />
              <span>The only thing stored on your device is a functional setting — like remembering your “reduce motion” accessibility choice. We do verify our site with Google Search Console so pages can be found in search; that shows how pages appear in Google overall — it never identifies individual visitors.</span>
            </p>
          </div>
        </section>

        {/* What we collect */}
        <section className="py-6">
          <span className="block text-xs font-extrabold tracking-[0.2em] uppercase text-[#E03694] mb-3">What we collect</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">Only when you reach out.</h2>
          <p className="mt-3 text-gray-500 text-lg">Depending on which form you use, that’s:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {FORMS.map((f) => (
              <div key={f.tag} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md">
                <span className={`inline-block text-[11px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full mb-3.5 ${f.tagClass}`}>{f.tag}</span>
                <ul className="flex flex-col gap-2">
                  {f.items.map((it) => (
                    <li key={it} className="text-[14.5px] text-[#3a3540] flex items-center gap-2.5">
                      <span className="w-[5px] h-[5px] rounded-full bg-[#FDB515] shrink-0" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-gray-500 italic text-[15px]">You’re giving us this so we can respond — we treat it exactly that way.</p>
        </section>

        {/* Where it lives */}
        <section className="py-10">
          <span className="block text-xs font-extrabold tracking-[0.2em] uppercase text-[#E03694] mb-3">Where it lives</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">Two places. Both locked down.</h2>
          <div className="mt-6 bg-gradient-to-br from-white to-[#FBEFF6] border border-gray-100 rounded-2xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
              {[
                { icon: MessageSquare, h: 'Your message', s: 'sent from a form' },
                null,
                { icon: Database, h: 'Secure database', s: 'Supabase · access locked' },
                null,
                { icon: Kanban, h: 'Our team board', s: 'Monday · staff only' },
              ].map((n, i) =>
                n === null ? (
                  <ArrowRight key={i} size={22} className="text-[#E03694] mx-auto rotate-90 md:rotate-0" />
                ) : (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-[#FBEFF6] flex items-center justify-center mx-auto mb-3"><n.icon size={22} className="text-[#E03694]" /></div>
                    <h4 className="font-bold text-[#1A1A1A] text-[15px]">{n.h}</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">{n.s}</p>
                  </div>
                )
              )}
            </div>
            <p className="mt-6 text-center text-[16px] font-semibold text-[#1A1A1A]">That’s it — <span className="text-[#E03694]">nothing sold, nothing shared.</span></p>
            <p className="text-center text-sm text-gray-500 mt-1.5">Access is limited to SparkPoint staff and authorized volunteers who need it to help you.</p>
          </div>
        </section>

        {/* How we use it */}
        <section className="py-6">
          <span className="block text-xs font-extrabold tracking-[0.2em] uppercase text-[#E03694] mb-3">How we use it</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">To do what you asked.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {USES.map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md">
                <h4 className="font-bold text-[#E03694] mb-1.5">{u.title}</h4>
                <p className="text-sm text-gray-500">{u.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your choices CTA */}
        <section className="py-8">
          <div className="relative overflow-hidden bg-[#1A1A1A] text-white rounded-2xl p-9 md:p-10 flex items-center gap-7 flex-wrap">
            <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-[#E03694]/40 blur-2xl" />
            <div className="flex-1 min-w-[260px] relative z-10">
              <h3 className="text-2xl font-bold tracking-tight">Changed your mind? One email.</h3>
              <p className="text-white/70 mt-2 text-[15.5px] max-w-[52ch]">Ask us anytime to see, correct, or delete what you’ve sent — and we’ll take care of it. We keep submissions for about 24 months, then delete or anonymize them.</p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="relative z-10 bg-white text-[#1A1A1A] font-extrabold text-[15px] px-6 py-3.5 rounded-full inline-flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform">
              <Mail size={17} className="text-[#E03694]" /> {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        {/* Fine print */}
        <section className="py-10 pb-24 text-gray-500 text-[15px] leading-relaxed">
          <h4 className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-[#1A1A1A] mt-2 mb-2">Donations</h4>
          <p>Donations are handled by a secure third-party payment processor. We do not store full credit card numbers.</p>
          <h4 className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-[#1A1A1A] mt-6 mb-2">Links to other sites</h4>
          <p>Our site may link to partner organizations and resources. We’re not responsible for their privacy practices — please review their policies when you visit them.</p>
          <h4 className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-[#1A1A1A] mt-6 mb-2">Questions</h4>
          <p>Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#E03694] font-semibold">{CONTACT_EMAIL}</a>. We’d rather you ask than wonder.</p>
        </section>
      </div>
    </div>
  );
}
