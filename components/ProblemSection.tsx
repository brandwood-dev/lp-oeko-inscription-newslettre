'use client';

import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const problems = [
  {
    image: 'https://i.postimg.cc/d1Nv4Ych/fissure-maison.jpg',
    title: 'Fissures et lézardes',
    description: 'Des fissures qui s\'agrandissent avec le temps et menacent la structure de votre bien.',
  },
  {
    image: 'https://i.postimg.cc/8zv5cjQh/eau.jpg',
    title: 'Infiltrations d\'eau',
    description: 'L\'humidité s\'infiltre, causant moisissures, dégradations et pertes d\'isolation.',
  },
  {
    image: 'https://i.postimg.cc/vm3dZsB9/enduit.jpg',
    title: 'Dégradation de l\'enduit',
    description: 'Votre enduit se décolle, s\'écaille et perd son étanchéité face aux intempéries.',
  },
  {
    image: 'https://i.postimg.cc/Z5LqpXnq/Maison-abandonnee-a-donner-1024x683.jpg',
    title: 'Perte de valeur',
    description: 'Une façade abîmée peut faire perdre jusqu\'à 20% de la valeur de votre patrimoine.',
  },
];

export default function ProblemSection() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

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
              Ces problèmes de <span className="text-accent">façade</span> mettent votre maison en danger
            </h2>
            <p className="text-sm md:text-base text-[#2a2a2a]/70 max-w-3xl mx-auto">
              Sans intervention, les dégradations s'aggravent rapidement
            </p>
          </div>

          <div className="md:hidden mb-8">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {problems.map((problem, index) => (
                  <div key={index} className="flex-[0_0_90%] min-w-0 pl-4 first:pl-0">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md h-full">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={problem.image}
                          alt={problem.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="90vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-[#352c5b] mb-2">
                          {problem.title}
                        </h3>
                        <p className="text-sm text-[#2a2a2a]/70 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {problems.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'w-8 bg-[#C0FF72]'
                      : 'w-2 bg-gray-300'
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Aller à la diapositive ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C0FF72] cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={problem.image}
                    alt={problem.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#352c5b] mb-2 group-hover:text-accent transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-[#2a2a2a]/70 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-[#352c5b] hover:bg-[#352c5b]/90 text-white px-6 md:px-8 py-4 md:py-5 text-sm md:text-base rounded-md transition-all duration-300 hover:glow-accent whitespace-nowrap"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Limiter les dégâts aujourd'hui
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
