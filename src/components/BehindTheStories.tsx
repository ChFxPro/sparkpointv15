'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

export function BehindTheStories() {
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps', // keeps the strip filled — first frame starts left, no empty gutter
    dragFree: false,
  });

  // Folder-driven: read the generated manifest, build image URLs.
  useEffect(() => {
    let alive = true;
    fetch(`${BASE}assets/behind_story/manifest.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((files: string[]) => {
        if (alive) setImages((files || []).map((f) => `${BASE}assets/behind_story/${f}`));
      })
      .catch(() => { if (alive) setImages([]); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect); };
  }, [emblaApi, images]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    if (lightbox !== null) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <section className="py-14 md:py-16 border-y border-gray-100 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <span className="block text-xs font-bold tracking-[0.2em] text-[#E03694] uppercase mb-3">Behind the Stories</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight">This is what listening looks like.</h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
          Every story begins behind the lens — real people, real places, captured with trust, consent, and care.
        </p>
      </div>

      {images.length > 0 && (
        <>
          <div className="mt-8 [-webkit-mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <div
              className="overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694] rounded-2xl"
              ref={emblaRef}
              tabIndex={0}
              role="region"
              aria-label="Behind the Stories photo reel"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); emblaApi?.scrollPrev(); }
                if (e.key === 'ArrowRight') { e.preventDefault(); emblaApi?.scrollNext(); }
              }}
            >
              <div className="flex gap-3 px-6">
                {images.map((src, i) => (
                  <div key={src} className="relative flex-[0_0_46%] max-[700px]:flex-[0_0_76%] min-w-0">
                    <div className={`relative aspect-video rounded-2xl overflow-hidden bg-[#0f0b12] shadow-md transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${i === selected ? 'scale-100 shadow-xl z-[2]' : 'scale-[.85]'}`}>
                      <img
                        src={src}
                        alt="SparkPoint story collection — behind the scenes"
                        loading="lazy"
                        draggable={false}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      <button
                        onClick={() => setLightbox(i)}
                        aria-label="Enlarge"
                        className={`absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-opacity ${i === selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      >
                        <Maximize2 size={15} className="text-[#1A1A1A]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 mt-5 flex items-center gap-4">
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to frame ${i + 1}`}
                  className={`h-[7px] rounded-full transition-all ${i === selected ? 'w-5 bg-[#E03694]' : 'w-[7px] bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-semibold hidden sm:inline">Drag to shuffle · {images.length} frames</span>
            <div className="ml-auto flex gap-2">
              <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous" className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1A1A1A] hover:border-[#E03694] hover:text-[#E03694] flex items-center justify-center transition-colors"><ChevronLeft size={19} /></button>
              <button onClick={() => emblaApi?.scrollNext()} aria-label="Next" className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1A1A1A] hover:border-[#E03694] hover:text-[#E03694] flex items-center justify-center transition-colors"><ChevronRight size={19} /></button>
            </div>
          </div>
        </>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-[4vw] cursor-zoom-out" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <img src={images[lightbox]} alt="SparkPoint story collection — enlarged" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          <button className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox(null); }} aria-label="Close"><X size={24} /></button>
        </div>
      )}
    </section>
  );
}
