'use client';

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { STORIES_DATA } from '../data/stories';

const newsletterArchives = [
  {
    label: 'Current Newsletter Archive',
    href: 'https://www.yoursparkpoint.org/newsletter',
    note: 'Primary archive currently hosted on the main SparkPoint site.',
  },
];

export function NewsMediaPage() {
  const recentStoryLinks = STORIES_DATA.flatMap((category) =>
    category.articles.slice(0, 2).map((article) => ({
      categoryId: category.id,
      title: article.title,
      date: article.date,
      slug: article.slug,
    }))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      <Helmet>
        <title>News & Media | SparkPoint</title>
        <meta
          name="description"
          content="Newsletter archives, media highlights, and recent SparkPoint stories."
        />
      </Helmet>

      <section className="pt-32 pb-18 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6"
          >
            News & Media
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-600">
            One place for newsletter archives and recent SparkPoint media/story updates.
          </p>
        </div>
      </section>

      <section className="pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-5">Newsletter Archives</h2>
            <div className="space-y-4">
              {newsletterArchives.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-gray-100 p-4 hover:border-[#E03694]/40 transition-colors"
                >
                  <p className="font-semibold text-[#1A1A1A]">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.note}</p>
                </a>
              ))}
            </div>
          </Card>

          <Card className="p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-5">Recent Stories & Media</h2>
            <div className="space-y-3">
              {recentStoryLinks.map((story) => (
                <Link
                  key={`${story.categoryId}-${story.slug}`}
                  to={`/stories/${story.categoryId}/${story.slug}`}
                  className="block rounded-xl border border-gray-100 p-4 hover:border-[#E03694]/40 transition-colors"
                >
                  <p className="font-semibold text-[#1A1A1A]">{story.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{story.date}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/stories">
            <Button variant="outline" className="px-8 mr-3">
              Browse All Stories
            </Button>
          </Link>
          <Link to="/programs">
            <Button className="px-8" style={{ backgroundColor: '#E03694', color: 'white' }}>
              Explore Programs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
