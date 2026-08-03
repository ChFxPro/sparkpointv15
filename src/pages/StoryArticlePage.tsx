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
import { BrainHealthResources } from '../components/BrainHealthResources';
import { DrOraEventGallery } from '../components/DrOraEventGallery';
import { DrOraUpcomingTalk } from '../components/DrOraUpcomingTalk';

interface RelatedLink {
  to: string;
  kind: 'Story' | 'Program' | 'Resource';
  title: string;
  blurb: string;
}

// Every entry here traces to a real connection in the site's own data: the
// same recurring column/category, an explicit reference inside the article
// text (e.g. Community Connectors naming FWRD, or the Echoes column
// discussing Hurricane Helene the same weeks the Helene film covers), or a
// program page that documents the same initiative the story is about. Keyed
// by `${categoryId}/${slug}` — articles with no genuine match (e.g.
// "Community Champions") are simply omitted rather than forced.
const RELATED_LINKS: Record<string, RelatedLink[]> = {
  'programs/when-neighbors-become-leaders': [
    {
      to: '/programs/community-connectors',
      kind: 'Program',
      title: 'Community Connectors',
      blurb: 'The ongoing initiative this story documents — trusted local people helping neighbors find resources and stay prepared.',
    },
    {
      to: '/stories/disaster-recovery/helene-one-year',
      kind: 'Story',
      title: 'Helene: One Year of Healing',
      blurb: 'The listening tour that surfaced the trusted connectors this story is about.',
    },
    {
      to: '/directory/fwrd-long-term-recovery',
      kind: 'Resource',
      title: 'FWRD Transylvania — Long-Term Recovery Group',
      blurb: 'The Community Connectors launch partner named in this story.',
    },
  ],
  'talks-lectures/dr-ora-brain-health': [
    {
      to: '/programs/brain-stress-resilience',
      kind: 'Program',
      title: 'Brain, Stress & Resilience',
      blurb: 'A SparkPoint workshop on what stress does in the brain — and how connection helps protect it.',
    },
  ],
  'disaster-recovery/helene-one-year': [
    {
      to: '/stories/programs/when-neighbors-become-leaders',
      kind: 'Story',
      title: 'When neighbors become leaders',
      blurb: 'How this listening tour grew into the Community Connectors initiative.',
    },
    {
      to: '/programs/community-connectors',
      kind: 'Program',
      title: 'Community Connectors',
      blurb: 'The ongoing initiative this listening tour helped launch.',
    },
    {
      to: '/directory/fwrd-long-term-recovery',
      kind: 'Resource',
      title: 'FWRD Transylvania — Long-Term Recovery Group',
      blurb: "Transylvania County's long-term Hurricane Helene recovery group.",
    },
  ],
  'community-voice/week-5': [
    {
      to: '/stories/community-voice/week-4',
      kind: 'Story',
      title: 'Echoes from the Community — Week 4',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/community-voice/week-3',
      kind: 'Story',
      title: 'Echoes from the Community — Week 3',
      blurb: 'Another entry from the same weekly column.',
    },
  ],
  'community-voice/week-4': [
    {
      to: '/stories/community-voice/week-5',
      kind: 'Story',
      title: 'Echoes from the Community — Week 5',
      blurb: 'The latest entry in the same weekly column.',
    },
    {
      to: '/stories/community-voice/week-3',
      kind: 'Story',
      title: 'Echoes from the Community — Week 3',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/disaster-recovery/helene-one-year',
      kind: 'Story',
      title: 'Helene: One Year of Healing',
      blurb: 'The tribute film built from the same community listening.',
    },
  ],
  'community-voice/week-3': [
    {
      to: '/stories/community-voice/week-4',
      kind: 'Story',
      title: 'Echoes from the Community — Week 4',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/community-voice/week-2',
      kind: 'Story',
      title: 'Echoes from the Community — Week 2',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/disaster-recovery/helene-one-year',
      kind: 'Story',
      title: 'Helene: One Year of Healing',
      blurb: 'The tribute film built from the same community listening.',
    },
  ],
  'community-voice/week-2': [
    {
      to: '/stories/community-voice/week-3',
      kind: 'Story',
      title: 'Echoes from the Community — Week 3',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/community-voice/week-1',
      kind: 'Story',
      title: 'Echoes from the Community — Week 1',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/disaster-recovery/helene-one-year',
      kind: 'Story',
      title: 'Helene: One Year of Healing',
      blurb: 'The tribute film built from the same community listening.',
    },
  ],
  'community-voice/week-1': [
    {
      to: '/stories/community-voice/week-2',
      kind: 'Story',
      title: 'Echoes from the Community — Week 2',
      blurb: 'Another entry from the same weekly column.',
    },
    {
      to: '/stories/disaster-recovery/helene-one-year',
      kind: 'Story',
      title: 'Helene: One Year of Healing',
      blurb: 'The tribute film built from the same community listening.',
    },
  ],
};

function RelatedSection({ items }: { items: RelatedLink[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Keep exploring</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group block rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-[#E03694]/30 hover:bg-gray-50"
          >
            <span className="mb-2 inline-block text-[11px] font-bold uppercase tracking-wide text-[#E03694]">
              {item.kind}
            </span>
            <span className="block font-semibold text-gray-900 transition-colors group-hover:text-[#E03694]">
              {item.title}
            </span>
            <span className="mt-1 block text-sm text-gray-500 leading-relaxed">{item.blurb}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
  const relatedLinks = RELATED_LINKS[`${category.id}/${article.slug}`] ?? [];

  const metaDescription = article.seoDescription || article.excerpt || article.subhead || `Read the full story of ${article.title} at SparkPoint.`;
  const articlePath = `/stories/${category.id}/${article.slug}`;
  const canonical = canonicalUrl(articlePath);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: metaDescription,
    image: displayImage ? [displayImage] : ['https://yoursparkpoint.org/og/default.jpg'],
    author: {
      '@type': 'Person',
      name: article.author || 'SparkPoint Editorial Team',
    },
    publisher: {
      '@id': CONTACT_INFO.organizationSchemaId,
    },
    mainEntityOfPage: canonical,
    articleSection: category.title,
    datePublished: article.publishedTime || article.date,
    inLanguage: 'en-US',
  };

  // Render Helmet for both layouts
  const pageMeta = (
    <SEOHead
      title={article.seoTitle ?? `${article.title} | SparkPoint Stories`}
      description={metaDescription}
      path={articlePath}
      type="article"
      image={displayImage}
      imageAlt={article.imageAlt ?? `${article.title} story image from SparkPoint`}
      imageType={displayImage.includes('.webp') ? 'image/webp' : undefined}
      imageWidth={article.imageWidth}
      imageHeight={article.imageHeight}
      keywords={article.keywords}
      publishedTime={article.publishedTime}
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

          {article.slug === 'dr-ora-brain-health' && <DrOraUpcomingTalk />}

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
              referrerPolicy="strict-origin-when-cross-origin"
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

          {article.slug === 'dr-ora-brain-health' && <DrOraEventGallery />}
          {article.slug === 'dr-ora-brain-health' && <BrainHealthResources />}

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

          <RelatedSection items={relatedLinks} />
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
              style={{ objectPosition: category?.imagePosition || 'center' }}
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

        <RelatedSection items={relatedLinks} />
      </article>
    </div>
  );
}
