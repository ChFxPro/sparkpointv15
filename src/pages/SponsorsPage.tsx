'use client';

import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { SEOHead } from '../components/SEOHead';

const sponsorHighlights = [
  'Community resilience and preparedness support',
  'Youth leadership and school-connected initiatives',
  'Story collection and community voice infrastructure',
  'Cross-sector partner convenings and coordination',
];

export function SponsorsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF8]">
      <SEOHead
        title="Sponsors | SparkPoint"
        description="Sponsor SparkPoint to fund community resilience, youth leadership, and collaboration programs supporting Transylvania County and Western North Carolina."
        path="/sponsors"
      />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6"
          >
            Sponsors
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            SparkPoint sponsors help sustain consistent, community-rooted programming across
            Transylvania County.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsorHighlights.map((item) => (
            <Card key={item} className="p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-700 leading-relaxed">{item}</p>
            </Card>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="px-8"
            style={{ backgroundColor: '#E03694', color: 'white' }}
            onClick={() => navigate('/intake?intent=partner')}
          >
            Become a Sponsor
          </Button>
          <Link to="/mission" className="inline-flex">
            <Button variant="outline" className="px-8">
              View Mission Partnerships
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
