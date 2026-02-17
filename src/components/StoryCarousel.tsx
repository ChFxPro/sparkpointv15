'use client';

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface Story {
  title: string;
  image: string;
  caption: string;
}

interface StoryCarouselProps {
  stories: Story[];
}

export function StoryCarousel({ stories }: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const navigate = useNavigate();
  
  // Combine system preference with manual override
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories.length, prefersReducedMotion]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section id="stories" className="relative py-12 md:py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1710438399440-83452997ffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRleHR1cmUlMjBzdWJ0bGUlMjBwYXR0ZXJufGVufDF8fHx8MTc2MTA4OTQzMnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
          className="text-center mb-10 md:mb-16"
        >
          <h2
            className="mb-4"
            style={{ color: '#1A1A1A', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2', letterSpacing: '-1px' }}
          >
            Every story strengthens our community.
          </h2>
          <p
            className="max-w-3xl mx-auto"
            style={{ color: '#666666', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.5' }}
          >
            Explore voices of recovery, resilience, and belonging — collected through local 
            storytelling and lived experience.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-[450px] md:h-[600px] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={stories[currentIndex].image}
                  alt={stories[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay with Pulse */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(0deg, rgba(224, 54, 148, 0.9) 0%, rgba(224, 54, 148, 0.2) 60%, transparent 80%)'
                  }}
                  animate={{
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />

                {/* Story Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-2 md:mb-3"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
                  >
                    {stories[currentIndex].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: '1.5' }}
                  >
                    {stories[currentIndex].caption}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all hover:scale-110"
              aria-label="Previous story"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ChevronLeft size={24} style={{ color: '#E03694' }} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all hover:scale-110"
              aria-label="Next story"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ChevronRight size={24} style={{ color: '#E03694' }} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex ? '#E03694' : '#D1D5DB',
                  transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
                }}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="px-8 py-6 text-lg transition-all duration-250"
            style={{
              backgroundColor: '#E03694',
              color: 'white',
              minHeight: '44px',
              transform: 'translateZ(0)',
            }}
            onClick={() => navigate('/stories')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FDB515';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E03694';
            }}
          >
            Read More Stories
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
