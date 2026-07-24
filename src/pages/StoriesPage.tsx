'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Upload, ArrowRight, Search, Play, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Link, useNavigate } from 'react-router';
import { STORIES_DATA } from '../data/stories';
import { IMPACT_2025 } from '../data/impact2025';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';
import heroImage from 'figma:asset/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png';
import { BehindTheStories } from '../components/BehindTheStories';
import { SEOHead } from '../components/SEOHead';

type FeedKind = 'field' | 'film' | 'article' | 'column';
interface FeedConfig { catId: string; badge: string; kind: FeedKind; video?: boolean; typeLed?: boolean; }

// One lead story per category. Featured = programs (Community Connectors).
const FEED_CONFIG: FeedConfig[] = [
  { catId: 'programs', badge: 'Field Notes', kind: 'field' },
  { catId: 'talks-lectures', badge: 'Talk · Film', kind: 'film', video: true },
  { catId: 'disaster-recovery', badge: 'Film', kind: 'article', video: true },
  { catId: 'volunteer-impact', badge: 'Article', kind: 'article' },
  { catId: 'community-voice', badge: 'Column · Weekly', kind: 'column' },
];
const FEATURED_CAT = 'programs';

function Stat({ target, suffix = '', label, sub }: { target: number; suffix?: string; label: string; sub?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const dur = 1500;
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="px-5 md:border-l first:md:border-l-0 border-[#E03694]/15">
      <div className="text-[clamp(2.5rem,5vw,3.4rem)] font-extrabold leading-none tracking-tight bg-gradient-to-br from-[#E03694] to-[#c22a80] bg-clip-text text-transparent">
        {val.toLocaleString()}{suffix}
      </div>
      <div className="mt-3 text-sm font-bold text-[#1A1A1A]">{label}</div>
      {sub ? <div className="mt-1 text-xs text-gray-400">{sub}</div> : null}
    </div>
  );
}

export function StoriesPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');

  const catById = (id: string) => STORIES_DATA.find((c) => c.id === id);

  const feedItems = FEED_CONFIG.map((cfg) => {
    const category = catById(cfg.catId);
    if (!category) return null;
    const article = cfg.typeLed ? undefined : category.articles?.[0];
    return {
      cfg,
      category,
      article,
      title: article?.title ?? category.title,
      excerpt: article?.excerpt ?? category.description,
      image: article?.image ?? category.image,
      imagePosition: category.imagePosition,
      href: cfg.typeLed || !article ? `/stories/${category.id}` : `/stories/${category.id}/${article.slug}`,
    };
  }).filter(Boolean) as Array<{ cfg: FeedConfig; category: (typeof STORIES_DATA)[number]; article: (typeof STORIES_DATA)[number]['articles'][number] | undefined; title: string; excerpt: string; image: string; imagePosition?: string; href: string }>;

  const featured = feedItems.find((f) => f.cfg.catId === FEATURED_CAT) ?? feedItems[0];

  const chips = [{ id: 'all', label: 'All stories' }, ...feedItems.map((f) => ({ id: f.category.id, label: f.category.title }))];

  const q = query.trim().toLowerCase();
  const visible = feedItems.filter((f) => {
    const catOk = activeCat === 'all' || f.category.id === activeCat;
    const txtOk = !q || (f.title + ' ' + f.excerpt).toLowerCase().includes(q);
    return catOk && txtOk;
  });

  const storyCount = STORIES_DATA.reduce((n, c) => n + (c.articles?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Community Stories | SparkPoint"
        description="The SparkPoint Story Hub — community voices, recovery, talks, and volunteer impact from Transylvania County and across Western North Carolina."
        path="/stories"
      />

      {/* Masthead */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-14 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Community gathering" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <span className="block text-xs font-bold tracking-[0.2em] text-[#E03694] uppercase mb-4">SparkPoint Stories</span>
            <h1 className="font-bold text-[#1A1A1A]" style={{ fontSize: 'clamp(2.75rem, 8vw, 4.5rem)', lineHeight: '1', letterSpacing: '-0.03em' }}>The Story Hub</h1>
            <p className="mt-5 max-w-2xl text-gray-600" style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', lineHeight: '1.6' }}>
              Stories are the engine of our operation — every talk, film, field note, and neighbor's voice across Western North Carolina, in one place.
            </p>
            <p className="mt-3 font-serif italic text-gray-500 text-lg">From kitchens, parking lots, church basements, and front porches across the region.</p>
          </motion.div>
        </div>
      </section>

      {/* Story Collections — the portal to active listening drives */}
      {ACTIVE_STORY_COLLECTIONS.length ? (
        <section className="px-6 pb-10 md:pb-14">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #1A1A1A, #2b1730)' }}>
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E03694] via-[#FDB515] to-[#F15F48]" />
              {ACTIVE_STORY_COLLECTIONS.map((collection) => (
                <div key={collection.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center p-8 md:p-12">
                  <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FDB515] mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#25b06a] animate-pulse" /> {collection.statusLabel}
                    </span>
                    <h2 className="text-white font-bold text-2xl md:text-3xl mb-3">{collection.title}</h2>
                    <p className="text-white/70 max-w-xl leading-relaxed">{collection.summary}</p>
                    {collection.incentive ? (
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/60">
                        <Gift size={16} className="text-[#FDB515]" aria-hidden="true" /> {collection.incentive}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                    {collection.formPath ? (
                      <Button asChild className="rounded-full px-6 py-6 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}>
                        <Link to={collection.formPath}>Share your story <ArrowRight size={16} className="ml-1" /></Link>
                      </Button>
                    ) : null}
                    <Button asChild variant="outline" className="rounded-full px-6 py-6 bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white">
                      <Link to={`/stories/collections/${collection.id}`}>View media kit</Link>
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10 px-8 py-4 md:px-12">
                <Link to="/stories/collections" className="text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white/80 transition-colors">
                  See all story collections, past & present →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Featured */}
      {featured ? (
        <section className="px-6 pb-4 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <Card
              className="overflow-hidden border-0 shadow-md bg-white cursor-pointer transition-all duration-500 hover:shadow-xl hover:translate-y-[-2px]"
              onClick={() => navigate(featured.href)}
              role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(featured.href); } }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] items-stretch">
                <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105" style={{ objectPosition: featured.imagePosition || 'center' }} />
                  <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#E03694]">◆ {featured.cfg.badge}</span>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <p className="text-[#E03694] font-bold mb-3 text-xs tracking-wide uppercase">Featured Story</p>
                  <h2 className="mb-4 font-bold text-gray-900 text-3xl leading-tight">{featured.title}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <span className="flex items-center text-[#E03694] text-sm font-bold tracking-wide">Read the story <ArrowRight size={16} className="ml-2" /></span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      ) : null}

      {/* Filter + search */}
      <div className="sticky top-0 z-20 bg-[#FDFDFD]/90 backdrop-blur border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 py-3.5 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400 mr-1">Browse</span>
            {chips.map((chip) => (
              <button key={chip.id} onClick={() => setActiveCat(chip.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${activeCat === chip.id ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#E03694]'}`}>
                {chip.label}
              </button>
            ))}
            <div className="ml-auto relative flex items-center">
              <Search size={15} className="absolute left-3.5 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stories…" aria-label="Search stories"
                className="rounded-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm w-[200px] focus:w-[240px] focus:outline-none focus:border-[#E03694] transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <section className="px-6 pt-8 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">Latest stories</h3>
            <span className="text-sm text-gray-500">{query ? `${visible.length} match "${query}"` : activeCat === 'all' ? `Showing all ${visible.length}` : `Showing ${visible.length}`}</span>
          </div>
          {visible.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No stories match — try another search or clear the filter.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visible.map((f, i) => (
                <motion.div key={f.category.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (i % 2) * 0.05 }}>
                  <Card
                    className={`h-full min-h-[214px] overflow-hidden border-0 shadow-md bg-white cursor-pointer transition-all duration-500 hover:shadow-xl hover:translate-y-[-3px] flex flex-col sm:flex-row${i % 2 === 1 ? ' sm:flex-row-reverse' : ''}`}
                    onClick={() => navigate(f.href)} role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(f.href); } }}
                  >
                    {f.cfg.typeLed ? (
                      <div className="h-40 sm:h-auto sm:flex-[0_0_44%] bg-gradient-to-br from-[#FBEFF6] to-white flex items-center justify-center">
                        <span className="font-serif text-6xl text-[#E03694] opacity-40 leading-none">"</span>
                      </div>
                    ) : (
                      <div className="relative overflow-hidden bg-gray-100 h-52 sm:h-auto sm:flex-[0_0_44%]">
                        <img src={f.image} alt={f.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105" style={{ objectPosition: f.imagePosition || 'center' }} />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#FDB515]">{f.cfg.badge}</span>
                        {f.cfg.video ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Play size={18} className="fill-[#1A1A1A] text-[#1A1A1A] ml-0.5" /></span>
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      {f.cfg.typeLed ? <span className="mb-2.5 inline-flex w-fit items-center rounded-full bg-[#FBEFF6] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#E03694]">◆ {f.cfg.badge}</span> : null}
                      <h4 className="font-bold text-gray-900 text-xl leading-snug mb-2">{f.title}</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed">{f.excerpt}</p>
                      <div className="mt-4 text-xs font-bold uppercase tracking-wide text-[#E03694]">{f.category.title}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact counter — real 2025 data */}
      <section className="px-6 pt-14">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl shadow-md bg-gradient-to-br from-white via-white to-[#FBEFF6] px-8 py-12 md:py-14 text-center">
            <div className="flex flex-col items-center gap-2 mb-8">
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a9720a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25b06a] animate-pulse" /> Updating as stories publish
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">The impact behind the stories</h3>
              <p className="text-gray-500 max-w-md">Every number here started as someone's story.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
              <Stat target={storyCount} label="Stories published" sub="and growing" />
              <Stat target={IMPACT_2025.attendanceTotalRecordedMinimum} suffix="+" label="Neighbors reached" sub="in 2025 programming" />
              <Stat target={IMPACT_2025.uniqueCollaboratingOrganizationCount} label="Partner organizations" sub="working alongside us" />
              <Stat target={IMPACT_2025.eventsLogged} label="Events & gatherings" sub="across the year" />
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Stories — existing element */}
      <div className="mt-14"><BehindTheStories /></div>

      {/* Echoes strand */}
      {catById('community-voice') ? (
        <section className="px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-md p-8 md:p-11">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#E03694] to-[#FDB515]" />
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <span className="block text-xs font-bold tracking-[0.2em] text-[#E03694] uppercase mb-3">A continuing series</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Echoes from the Community</h3>
                  <p className="text-gray-600 max-w-xl mt-2">Not one story but many — a weekly strand of voices, kept as its own living series instead of scattered through the feed.</p>
                </div>
                <button onClick={() => navigate('/stories/community-voice')} className="text-sm font-bold uppercase tracking-wide text-[#E03694]">All entries →</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {(catById('community-voice')?.articles ?? []).slice(0, 3).map((a) => (
                  <button key={a.id} onClick={() => navigate(`/stories/community-voice/${a.slug}`)} className="text-left bg-[#FDFDFD] border border-gray-100 rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#a9720a]">{a.date}</div>
                    <h5 className="font-bold text-gray-900 mt-2 mb-1 leading-snug">{a.title}</h5>
                    <p className="text-sm text-gray-500">{a.excerpt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Quote */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-2xl md:text-4xl font-bold text-[#1A1A1A] leading-tight tracking-tight">
            "Community isn't just where we live — it's who we become together."
          </motion.blockquote>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E03694] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FDB515] rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Heart size={40} className="text-[#E03694] mx-auto mb-6" />
            <h2 className="mb-6 font-bold text-gray-900" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', lineHeight: '1.2' }}>Share Your Story</h2>
            <p className="mb-10 text-gray-600 text-lg md:text-xl leading-relaxed">Your experience matters. Whether it's a moment of connection, a journey of healing, or a story of hope — we'd love to hear from you and share it with our community.</p>
            <Button asChild className="px-10 py-7 rounded-full text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}>
              <Link to="/stories/collections"><Upload className="mr-2" size={20} />Submit Your Story</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
