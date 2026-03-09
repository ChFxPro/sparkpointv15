'use client';

import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { SEOHead } from '../components/SEOHead';

const hubSections = [
  {
    title: 'Preparedness',
    body: 'Community readiness workshops, practical planning tools, and neighborhood-level coordination.',
  },
  {
    title: 'Connection',
    body: 'Trusted gathering spaces that support healing, information sharing, and relationship-building.',
  },
  {
    title: 'Coordination',
    body: 'Cross-sector alignment across schools, nonprofits, healthcare, civic partners, and local sponsors.',
  },
];

export function ResiliencyHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="SparkPoint Resiliency Hub | SparkPoint"
        description="Discover SparkPoint’s Resiliency Hub for preparedness resources, coordinated support, and trusted community connection across Transylvania County and WNC."
        path="/resiliency-hub"
      />

      <section className="pt-32 pb-18 px-6 bg-gradient-to-b from-[#F8F4FA] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6"
          >
            SparkPoint Resiliency Hub
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-600">
            A dedicated space for practical preparedness, shared learning, and coordinated
            community action.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {hubSections.map((section) => (
            <Card key={section.title} className="p-6 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
