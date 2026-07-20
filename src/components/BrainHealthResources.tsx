'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Play,
  Headphones,
  FileText,
  Building2,
  HeartHandshake,
  FileDown,
  Download,
  ArrowUpRight,
} from 'lucide-react';

const PROGRAM_GUIDE = {
  pdf: 'https://acrobat.adobe.com/id/urn:aaid:sc:US:2bdfe22d-9666-490f-8b7e-8f9f21fd9afb',
  drive: 'https://drive.google.com/file/d/1FHXhBnTb4rlmZ7ZhLAALbn3GVnmUbW4X/view',
};

interface ResourceItem {
  label: string;
  sub?: string;
  href?: string;
}

interface ResourceGroup {
  title: string;
  icon: LucideIcon;
  chip: string;
  items: ResourceItem[];
}

const GROUPS: ResourceGroup[] = [
  {
    title: 'Recommended Books',
    icon: BookOpen,
    chip: 'bg-[#9E509F]',
    items: [
      { label: 'Undo It!', sub: 'Dean & Anne Ornish' },
      { label: 'Good Energy', sub: 'Casey Means, MD' },
      { label: "The End of Alzheimer's", sub: 'Dale Bredesen, MD' },
      { label: 'The Ageless Brain', sub: 'Dale Bredesen, MD' },
      { label: "Reversing Alzheimer's", sub: 'Heather Sandison, ND' },
      { label: 'Doctored', sub: 'Sandeep Jauhar, MD' },
      { label: "The Alzheimer's Solution", sub: 'Dean & Ayesha Sherzai, MD' },
    ],
  },
  {
    title: 'Talks & Videos',
    icon: Play,
    chip: 'bg-[#E03694]',
    items: [
      { label: "Ornish & Barnard on Alzheimer's research", sub: 'Physicians Committee', href: 'https://youtu.be/sq4cCQf6ia4' },
      { label: 'How improving your metabolism changes your life', sub: 'Rupa Health · Dr. Casey Means', href: 'https://youtu.be/GZzcAQqyaMY' },
      { label: "How to reverse Alzheimer's & cognitive decline", sub: 'Apollo Health', href: 'https://youtu.be/dKDlviywVos' },
      { label: "Reversing Alzheimer's with Dr. Heather Sandison", sub: 'Katherine Ambrose · June 2024', href: 'https://youtu.be/n4ckEq76L2g' },
      { label: "Increasing brainspan & reducing Alzheimer's risk", sub: 'Dr. Richard Isaacson', href: 'https://youtu.be/m6emVfRuGSc' },
      { label: 'Integrative Family Medicine of Asheville', sub: 'Dr. Brian Asbill', href: 'https://youtu.be/50N5giJVASI' },
    ],
  },
  {
    title: 'Podcasts',
    icon: Headphones,
    chip: 'bg-[#F15F48]',
    items: [
      { label: "Hope for Alzheimer's: the power of plant-based nutrition", sub: 'Ep. 283 · Dr. Dean Ornish', href: 'https://youtu.be/WqBu4O4_ERA' },
      { label: 'Take control of your metabolic health', sub: 'The Metabolic Link Ep. 43 · Dr. Casey Means', href: 'https://youtu.be/3C0czhRXKRA' },
      { label: "Reversing Alzheimer's: new research on cognition", sub: 'Dr. Heather Sandison', href: 'https://youtu.be/baQSf_9l-uk' },
    ],
  },
  {
    title: 'Research & Reports',
    icon: FileText,
    chip: 'bg-[#1A1A1A]',
    items: [
      { label: 'Dementia prevention, intervention & care', sub: '2024 Lancet Commission report', href: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)01296-0/abstract' },
      { label: "Lifestyle changes improve cognition in early Alzheimer's", sub: 'Ornish study', href: 'https://lifestylemedicine.org/articles/ornish-research/' },
      { label: 'Strategies to improve brain health & reverse decline', sub: 'Bredesen Protocol', href: 'https://proactivwellnesscenters.com/hormone-replacement/northern-virginia-bredesen-protocol-strategies-to-improve-brain-health-and-reverse-cognitive-decline-resulting-from-alzheimers/' },
      { label: 'Improvement in cognition during a lifestyle intervention', sub: 'Sandison · PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov/37355891/' },
    ],
  },
  {
    title: 'Organizations & Tools',
    icon: Building2,
    chip: 'bg-[#2563eb]',
    items: [
      { label: "Alzheimer's Association", href: 'https://www.alz.org/' },
      { label: 'National Institute on Aging', href: 'https://www.nia.nih.gov/' },
      { label: 'Cleveland Clinic Healthy Brains', href: 'https://www.healthybrains.org/' },
      { label: 'Apollo Health / Bredesen Protocol', href: 'https://www.apollohealthco.com/' },
      { label: 'Virta Health', sub: 'Metabolic health & type 2 diabetes', href: 'https://www.virtahealth.com/' },
      { label: 'Dr. Kellyann Niotis', sub: 'Preventive neurology', href: 'https://drkellyannniotis.com/' },
      { label: 'MyBrainGuide', sub: "UsAgainstAlzheimer's", href: 'https://www.mybrainguide.org/' },
      { label: 'BrainHQ', sub: 'Brain training', href: 'https://www.brainhq.com/' },
    ],
  },
  {
    title: 'Support Communities',
    icon: HeartHandshake,
    chip: 'bg-[#0f9d6a]',
    items: [
      { label: 'Caregiver Action Network', href: 'https://www.caregiveraction.org/' },
      { label: 'AlzConnected', href: 'https://www.alzconnected.org/' },
      { label: 'Dementia Alliance International', href: 'https://www.dementiaallianceinternational.org/' },
    ],
  },
];

export function BrainHealthResources() {
  return (
    <section aria-labelledby="brain-health-resources" className="mt-16">
      <div className="mb-8">
        <span className="mb-4 inline-block rounded-full bg-[#E03694]/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#E03694]">
          Keep Learning
        </span>
        <h2 id="brain-health-resources" className="text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-4xl">
          Brain Health Resource Library
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-gray-500">
          The books, talks, research, and organizations Dr. Ora Wells shared to help you keep exploring cognitive health.
        </p>
      </div>

      <div className="relative mb-8 flex flex-wrap items-center gap-6 overflow-hidden rounded-3xl border border-[#E03694]/20 bg-gradient-to-br from-white to-[#FDF2F8] p-7 md:p-8">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FDB515]/20 blur-2xl" aria-hidden="true" />
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E03694] to-[#FDB515] text-white shadow-lg shadow-[#E03694]/30">
          <FileDown size={28} aria-hidden="true" />
        </span>
        <div className="relative z-10 min-w-[240px] flex-1">
          <h3 className="text-xl font-bold text-[#1A1A1A]">Program Guide</h3>
          <p className="text-gray-500">Follow along with Dr. Wells&rsquo; presentation &mdash; includes homework.</p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-3">
          <a href={PROGRAM_GUIDE.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#E03694] px-5 py-3 font-bold text-white transition hover:bg-[#c2257d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694] focus-visible:ring-offset-2">
            <Download size={16} aria-hidden="true" /> PDF (Adobe)
          </a>
          <a href={PROGRAM_GUIDE.drive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-[#1A1A1A] transition hover:border-[#E03694] hover:text-[#E03694] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694] focus-visible:ring-offset-2">
            <FileText size={16} aria-hidden="true" /> Google Drive
          </a>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="mb-3 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${group.chip}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="text-base font-extrabold tracking-tight text-[#1A1A1A]">{group.title}</h3>
                <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">{group.items.length}</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {group.items.map((item) => {
                  const content = (
                    <>
                      <span className="flex-1 text-[15px] font-semibold leading-snug">
                        {item.label}
                        {item.sub ? <span className="mt-0.5 block text-[13px] font-medium text-gray-500">{item.sub}</span> : null}
                      </span>
                      {item.href ? (
                        <ArrowUpRight size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-[#E03694] opacity-40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      ) : null}
                    </>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 rounded-sm py-3 text-[#1A1A1A] transition hover:text-[#E03694] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/40">
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-start gap-2 py-3 text-[#1A1A1A]">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-8 max-w-2xl border-l-[3px] border-[#E03694] pl-4 text-sm italic text-gray-500">
        This information is provided for educational and informational purposes only and is not medical advice. Please consult your own healthcare provider before making decisions about your health or care.
      </p>
    </section>
  );
}
