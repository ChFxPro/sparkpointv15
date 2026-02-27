'use client';

import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { STORIES_DATA } from '../data/stories';
import { useEffect } from 'react';
import imgPoster from "figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png";
import { HELENE_ONE_YEAR_DATE_LABEL } from '../data/impact2025';

export function StoryCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const category = STORIES_DATA.find(c => c.id === categoryId);

  useEffect(() => {
    if (!category) {
      // potentially redirect to 404 or stories index
      // navigate('/stories'); 
    }
  }, [category, navigate]);

  if (!category) {
    return <div className="min-h-screen pt-32 text-center">Category not found</div>;
  }

  // Inject the new Helene article if we are in the Volunteer Impact (Community Champions) category
  let articles = category.articles || [];
  if (category.id === 'volunteer-impact') {
    const heleneArticle = {
      id: 'helene-anniversary',
      slug: 'helene-anniversary',
      title: 'Helene: One Year of Healing',
      date: HELENE_ONE_YEAR_DATE_LABEL,
      excerpt: 'It started with a question: How do we honor a year of recovery without losing sight of the work that remains? The answer wasn’t in the programming. It was in the people who stood at the gates.',
      image: imgPoster,
      content: '', 
      videoUrl: undefined
    };
    // Ensure we create a new array to avoid mutating the original data reference if we were modifying it directly (though slice handles that usually, this is safer)
    articles = [heleneArticle, ...articles];
  }

  const featuredArticle = articles[0]; // Most recent (first in array)
  const previousArticles = articles.slice(1);
  const isFeaturedVideo = featuredArticle && !!featuredArticle.videoUrl;

  const handleArticleClick = (slug: string) => {
    if (slug === 'helene-anniversary') {
      navigate('/stories/community-champions/helene-anniversary');
    } else {
      navigate(`/stories/${category.id}/${slug}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <Helmet>
        <title>{`${category.title} | SparkPoint`}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://chfxpro.github.io/sparkpointv15/stories/${category.id}`} />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link to="/stories" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#E03694] mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Stories
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6"
          >
            {category.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            {category.description}
          </motion.p>
        </div>
        
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
           <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-100 rounded-full blur-3xl" />
           <div className="absolute top-40 -left-20 w-72 h-72 bg-gray-50 rounded-full blur-3xl" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-[#E03694] pl-3">
               Most Recent
             </h2>
             <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group">
               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="h-64 md:h-auto overflow-hidden relative">
                   <img 
                     src={featuredArticle.image || category.image} 
                     alt={featuredArticle.title}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div 
                     className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent cursor-pointer" 
                     onClick={() => handleArticleClick(featuredArticle.slug)}
                   />
                   {isFeaturedVideo && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                         <Play size={36} className="text-[#E03694] ml-1" fill="currentColor" />
                       </div>
                     </div>
                   )}
                 </div>
                 <div className="p-8 md:p-12 flex flex-col justify-center">
                   <div className="flex items-center gap-2 text-sm font-semibold text-[#E03694] mb-4">
                     <Calendar size={14} />
                     {featuredArticle.date}
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#E03694] transition-colors">
                     {featuredArticle.title}
                   </h3>
                   <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                     {featuredArticle.excerpt}
                   </p>
                   <Button 
                     onClick={() => handleArticleClick(featuredArticle.slug)}
                     className="self-start bg-[#1A1A1A] hover:bg-[#E03694] text-white px-8 py-6 text-lg transition-colors inline-flex items-center gap-2"
                   >
                     {isFeaturedVideo ? (
                       <>
                         <Play size={20} fill="currentColor" />
                         Watch Film
                       </>
                     ) : (
                       "Read Article"
                     )}
                   </Button>
                 </div>
               </div>
             </Card>
          </motion.div>
        )}

        {/* Previous Articles List */}
        {previousArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 border-l-4 border-gray-300 pl-3">
              Previous Stories
            </h2>
            <div className="grid gap-8">
              {previousArticles.map((article, idx) => (
                <div 
                  key={article.id}
                  className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#E03694]/30 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => handleArticleClick(article.slug)}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3 font-medium">
                        <span>{article.date}</span>
                        {article.author && (
                          <>
                            <span>•</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#E03694] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center text-[#E03694] font-bold text-sm mt-2 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
