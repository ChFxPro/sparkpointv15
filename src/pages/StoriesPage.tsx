'use client';

import { motion } from 'motion/react';
import { Heart, Upload, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { STORIES_DATA } from '../data/stories';
import heroImage from 'figma:asset/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png';
import { BehindTheStories } from '../components/BehindTheStories';
import { SEOHead } from '../components/SEOHead';

export function StoriesPage() {
  const navigate = useNavigate();

  const echoesCategory = STORIES_DATA.find((category) => category.id === 'community-voice');
  const heleneCategory = STORIES_DATA.find((category) => category.id === 'disaster-recovery');
  const heleneFeaturedArticle = heleneCategory?.articles.find((article) => article.slug === 'helene-one-year') ?? heleneCategory?.articles[0];
  const sortedCategories = STORIES_DATA.filter(
    (category) => !['community-voice', 'disaster-recovery'].includes(category.id)
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Community Stories | SparkPoint"
        description="Read SparkPoint stories from Transylvania County, including community voices, volunteer impact, and disaster recovery insights that strengthen local resilience."
        path="/stories"
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Community gathering"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="mb-6"
              style={{ 
                color: '#1A1A1A', 
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Responsive font size
                lineHeight: '1.1', 
                letterSpacing: '-2px' 
              }}
            >
              Our Stories
            </h1>
            <p
              className="max-w-2xl mx-auto mb-8"
              style={{ 
                color: '#4A4A4A', 
                fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                lineHeight: '1.6' 
              }}
            >
              Every story is a testament to resilience, connection, and the power of community. 
              These are the voices that inspire us forward.
            </p>
            <p className="font-serif italic text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              These stories come from kitchens, parking lots, church basements, and front porches across Transylvania County.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="px-6 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 text-center">
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-[#E03694]/10 text-[#E03694] text-xs font-bold uppercase tracking-[0.2em]">
              Featured Stories
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <Card
              className="h-full overflow-hidden border-0 shadow-md bg-white cursor-pointer transition-all duration-500 hover:shadow-xl hover:translate-y-[-2px]"
              onClick={() => navigate('/stories/community-voice')}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate('/stories/community-voice');
                }
              }}
            >
              <div className="relative h-72 md:h-80 overflow-hidden">
                <img
                  src={echoesCategory?.image ?? heroImage}
                  alt="Residents sharing stories in SparkPoint's Echoes from the Community series"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="p-6 md:p-8">
                <p className="text-[#E03694] font-medium mb-3 text-sm tracking-wide uppercase">
                  Featured Series
                </p>
                <h2 className="mb-4 font-bold text-gray-900 text-3xl leading-tight">
                  {echoesCategory?.title ?? 'Echoes from the Community'}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {echoesCategory?.description}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <span className="flex items-center text-[#E03694] text-sm font-bold tracking-wide">
                    View Series <ArrowRight size={16} className="ml-2" />
                  </span>
                </div>
              </div>
            </Card>

            <Card className="h-full border-0 shadow-md bg-white flex flex-col p-6 md:p-8">
              <p className="text-[#E03694] font-medium mb-3 text-sm tracking-wide uppercase">
                Featured Film
              </p>
              <h2 className="mb-4 font-bold text-gray-900 text-3xl leading-tight">
                Helene: One Year of Healing
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {heleneFeaturedArticle?.subhead}
              </p>

              <div className="mt-auto">
                {heleneFeaturedArticle?.videoUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-6">
                    <iframe
                      src={heleneFeaturedArticle.videoUrl}
                      title="Helene: One Year of Healing tribute video"
                      aria-label="Helene: One Year of Healing tribute video"
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-6">
                    <img
                      src={heleneCategory?.image ?? heroImage}
                      alt="Helene: One Year of Healing featured visual from SparkPoint"
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => navigate('/stories/disaster-recovery/helene-one-year')}
                >
                  Open Tribute Story
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 md:py-24 px-6 bg-[#FDFDFD]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-4xl font-bold text-[#1A1A1A] leading-tight tracking-tight"
          >
            “Community isn’t just where we live — it’s who we become together.”
          </motion.blockquote>
        </div>
      </section>

      {/* Behind The Stories Section */}
      <BehindTheStories />

      {/* Categories Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {sortedCategories.map((category, index) => {
              return (
                <motion.div
                  key={category.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl hover:translate-y-[-2px] flex flex-col border-0 shadow-md bg-white"
                    onClick={() => navigate(`/stories/${category.id}`)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={category.image}
                        alt={`${category.title} story category cover from SparkPoint`}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                        loading="lazy"
                      />
                      {/* Optional overlay for text readability if needed, but keeping it clean for now */}
                      <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500" />
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h3
                        className="mb-4 font-bold text-gray-900"
                        style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
                      >
                        {category.title}
                      </h3>
                      
                      <p
                        className="flex-grow mb-8 text-gray-600"
                        style={{ fontSize: '1rem', lineHeight: '1.6' }}
                      >
                        {category.description}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span 
                          className="flex items-center text-[#E03694] text-sm font-bold tracking-wide group"
                        >
                          View Stories <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0 opacity-30">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E03694] rounded-full blur-[100px]" />
           <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FDB515] rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart size={40} className="text-[#E03694] mx-auto mb-6" />
            <h2
              className="mb-6 font-bold text-gray-900"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', lineHeight: '1.2' }}
            >
              Share Your Story
            </h2>
            <p
              className="mb-10 text-gray-600 text-lg md:text-xl leading-relaxed"
            >
              Your experience matters. Whether it's a moment of connection, a journey of healing, 
              or a story of hope — we'd love to hear from you and share it with our community.
            </p>
            <Button
              className="px-10 py-7 rounded-full text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #E03694, #9E509F)',
                color: 'white',
              }}
              onClick={() => navigate('/contact')}
            >
              <Upload className="mr-2" size={20} />
              Submit Your Story
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
