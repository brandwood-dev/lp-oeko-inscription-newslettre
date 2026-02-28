'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import BeforeAfterCard from './BeforeAfterCard';

const projects = [
  {
    location: 'Essonne',
    type: 'Maison à ossature métallique',
    before: 'https://i.postimg.cc/bwhWHbwx/Nouvelle-note.jpg',
    after: 'https://i.postimg.cc/wTKGgJJP/9F7F96F1-4C86-4A98-9B5D-168EA9CA7D72-4-5005-c.jpg',
    description: 'Ravalement complet avec isolation thermique extérieure',
  },
  {
    location: 'Seine-et-Marne',
    type: 'Maison individuelle',
    before: 'https://i.postimg.cc/2jW0c6JF/Nouvelle-note-1.jpg',
    after: 'https://i.postimg.cc/tg75hCWW/50DBC137-3815-4A71-BC7E-2B764AA8EB1E-4-5005-c.jpg',
    description: 'Rénovation de façade avec enduit traditionnel',
  },
  {
    location: 'Val-de-Marne',
    type: 'Maison individuelle',
    before: 'https://i.postimg.cc/1RDK0dnJ/EBD76311-CD2A-4931-9F6F-AD5915B65DC4-4-5005-c.jpg',
    after: 'https://i.postimg.cc/Bv8Tj7fK/656548BD-CC87-4419-8811-38B21246B349-4-5005-c.jpg',
    description: 'Ravalement moderne avec finition lisse et peinture hydrofuge',
  },
];

export default function BeforeAfterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation();

  const extendedProjects = [...projects, ...projects, ...projects];

  const updateCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width >= 1024) {
      setCardsPerView(3);
    } else if (width >= 768) {
      setCardsPerView(2);
    } else {
      setCardsPerView(1);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [updateCardsPerView]);

  const totalGroups = Math.ceil(projects.length / cardsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  }, [totalGroups]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const visibleProjects = extendedProjects.slice(
    currentIndex * cardsPerView,
    currentIndex * cardsPerView + cardsPerView
  );

  return (
    <section className="py-12 md:py-16 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div
          ref={elementRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-[#352c5b] mb-3">
              Avant / Après : des <span className="text-accent">façades</span> transformées en Île-de-France
            </h2>
            <p className="text-sm md:text-base text-[#2a2a2a]/70 max-w-3xl mx-auto">
              Un diagnostic précis pour une solution durable, adaptée à votre maison
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div
              className="overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out">
                {visibleProjects.map((project, index) => (
                  <div
                    key={`${currentIndex}-${index}`}
                    className="animate-in fade-in duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BeforeAfterCard {...project} />
                  </div>
                ))}
              </div>
            </div>

            {totalGroups > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white border-gray-300 hover:border-[#352c5b] hover:bg-[#352c5b]/5 shadow-lg z-10 w-10 h-10 md:w-12 md:h-12"
                  aria-label="Projet précédent"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white border-gray-300 hover:border-[#352c5b] hover:bg-[#352c5b]/5 shadow-lg z-10 w-10 h-10 md:w-12 md:h-12"
                  aria-label="Projet suivant"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </>
            )}
          </div>

          {totalGroups > 1 && (
            <div className="flex gap-2 justify-center mt-8">
              {Array.from({ length: totalGroups }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#C0FF72]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Voir le groupe ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-[#352c5b] hover:bg-[#352c5b]/90 text-white px-6 md:px-8 py-4 md:py-5 text-sm md:text-base rounded-md transition-all duration-300 hover:glow-accent whitespace-nowrap"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Lancer mon projet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
