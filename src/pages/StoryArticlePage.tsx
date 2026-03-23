'use client';

import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Printer, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { STORIES_DATA } from '../data/stories';
import { useEffect } from 'react';
import { CONTACT_INFO } from '../data/contactInfo';
import { canonicalUrl } from '../lib/siteOrigin';
import { SEOHead } from '../components/SEOHead';

export function StoryArticlePage() {
  const { categoryId, slug } = useParams();
  const navigate = useNavigate();
  
  const category = STORIES_DATA.find(c => c.id === categoryId);
  const article = category?.articles.find(a => a.slug === slug);

  useEffect(() => {
    if (!category || !article) {
      // Handle 404
      // navigate('/stories');
    }
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [category, article]);

  if (!category || !article) {
    return <div className="min-h-screen pt-32 text-center">Article not found</div>;
  }

  // Use article image or fallback to category image
  const displayImage = article.image || category.image;
  const isVideoArticle = !!article.videoUrl;

  const metaDescription = article.excerpt || article.subhead || `Read the full story of ${article.title} at SparkPoint.`;
  const articlePath = `/stories/${category.id}/${article.slug}`;
  const canonical = canonicalUrl(articlePath);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: metaDescription,
    image: displayImage ? [displayImage] : ['https://www.yoursparkpoint.org/og/default.jpg'],
    author: {
      '@type': 'Person',
      name: article.author || 'SparkPoint Editorial Team',
    },
    publisher: {
      '@id': CONTACT_INFO.organizationSchemaId,
    },
    mainEntityOfPage: canonical,
    articleSection: category.title,
    datePublished: article.date,
    inLanguage: 'en-US',
  };

  // Render Helmet for both layouts
  const pageMeta = (
    <SEOHead
      title={`${article.title} | SparkPoint Stories`}
      description={metaDescription}
      path={articlePath}
      type="article"
      image={displayImage}
      imageAlt={`${article.title} story image from SparkPoint`}
      jsonLd={articleSchema}
    />
  );

  if (isVideoArticle) {
    return (
      <div className="min-h-screen relative bg-[#FDFDFD]">
        {pageMeta}
        <article className="max-w-4xl mx-auto px-6 pt-32 pb-24">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-12 overflow-x-auto whitespace-nowrap">
            <Link to="/stories" className="hover:text-[#E03694] transition-colors">Stories</Link>
            <span className="text-gray-300">/</span>
            <Link to={`/stories/${category.id}`} className="hover:text-[#E03694] transition-colors">{category.title}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Feature Video Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block mb-6 text-[#E03694] text-sm font-bold uppercase tracking-widest"
            >
              {category.title}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              {article.title}
            </motion.h1>
            {article.subhead && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-500 font-medium leading-relaxed"
              >
                {article.subhead}
              </motion.p>
            )}
          </header>

          {/* Embedded Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm mb-16 bg-black"
          >
            <iframe
              width="100%"
              height="100%"
              src={article.videoUrl}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </motion.div>

          {/* Project Write-Up */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg prose-gray max-w-none mx-auto
              prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
              prose-p:text-gray-700 prose-p:leading-8 prose-p:mb-6
              prose-a:text-[#E03694] prose-a:no-underline hover:prose-a:underline
              font-serif
            "
          >
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </motion.div>

          {/* Optional Supporting Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-200 max-w-2xl mx-auto text-center"
          >
            <div className="text-gray-500 font-medium mb-6">
              Presented {article.date}
            </div>
            <div className="w-12 h-1 bg-gray-100 mx-auto rounded-full mb-6"></div>
            <Link 
              to={`/stories/${category.id}`}
              className="inline-flex items-center text-[#E03694] font-bold hover:text-[#c2257d] transition-colors group"
            >
              More stories from {category.title}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </article>
      </div>
    );
  }

  // Standard Article Layout
  return (
    <div className="min-h-screen relative bg-white">
      {pageMeta}
      <article className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/stories" className="hover:text-[#E03694] transition-colors">Stories</Link>
          <span className="text-gray-300">/</span>
          <Link to={`/stories/${category.id}`} className="hover:text-[#E03694] transition-colors">{category.title}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-3 py-1 bg-[#E03694]/10 text-[#E03694] text-xs font-bold uppercase tracking-widest rounded-full mb-6"
          >
            {category.title}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
          >
            {article.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 text-gray-500 text-sm md:text-base font-medium"
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {article.date}
            </div>
            {article.author && (
               <div className="flex items-center gap-2">
                 <User size={16} />
                 {article.author}
               </div>
            )}
          </motion.div>
        </header>

        {/* Hero Image */}
        {displayImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16 rounded-2xl overflow-hidden shadow-sm"
          >
            <img 
              src={displayImage} 
              alt={`${article.title} community story image from SparkPoint`} 
              className="w-full h-auto max-h-[600px] object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* Article Body */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg prose-gray max-w-none mx-auto
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-8 prose-p:mb-6
            prose-a:text-[#E03694] prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-[#E03694] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic
            prose-li:text-gray-700
          "
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </motion.div>

        {/* Footer / CTA */}
        <div className="mt-20 pt-10 border-t border-gray-100">
           <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Have a story to share?</h3>
             <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
               We believe every voice matters. Your experience helps build a stronger, more connected community.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button asChild className="bg-[#E03694] hover:bg-[#c2257d] text-white px-8 py-6 text-lg">
                 <Link to="/intake?intent=contact">Submit Your Story</Link>
               </Button>
               <Button asChild variant="outline" className="px-8 py-6 text-lg border-gray-300 text-gray-700 hover:bg-gray-100">
                 <Link to={`/stories/${category.id}`}>Back to {category.title}</Link>
               </Button>
             </div>
           </div>
        </div>
      </article>
    </div>
  );
}
