'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const testimonials = [
  {
    name: 'HEMICI Anais',
    rating: 5,
    comment: 'Oeko s\'est chargé de notre chantier d\'isolation des murs par l\'extérieur et le résultat est tout simplement parfait. Les échanges avec M. Ferrand ont été très fluides et efficaces, et l\'équipe a su répondre à notre contrainte de délai très serré. Les finitions sont impeccables — je les recommande vivement !',
    date: 'Il y a 11 semaines',
  },
  {
    name: 'Laura Giorgianni',
    rating: 5,
    comment: 'Nous sommes passés par l\'entreprise OEKO pour réaliser nos travaux d\'isolation extérieure et c\'était parfait tant sur la partie commerciale que sur les partie travaux. Je recommande ++ Visité en septembre 2025',
    date: 'Il y a 13 semaines',
  },
  {
    name: 'Loulou',
    rating: 5,
    comment: 'Nous avons gagné presque 2 degrés et économisé 1 stère de bois.',
    date: 'Il y a 15 semaines',
  },
  {
    name: 'Patou Maz',
    rating: 5,
    comment: 'Très satisfait du ravalement de ma façade, travail soigné et équipe à l\'écoute, je recommande OKEO.',
    date: 'Il y a 15 semaines',
  },
  {
    name: 'Laurie Deport',
    rating: 5,
    comment: 'Merci à l\'équipe travaux pour la pose de mes volets roulants. Excellent travail.',
    date: 'Il y a 22 semaines',
  },
  {
    name: 'Serge Berthon',
    rating: 5,
    comment: 'J\'ai fait appel à OEKO pour l\'isolation par l\'extérieur de ma maison à ossature métallique à Tremblay-en-France, et je suis pleinement satisfait. L\'équipe est professionnelle, ponctuelle et connaît parfaitement les spécificités de ces constructions. Le résultat est impeccable, avec une vraie amélioration du confort et des économies d\'énergie visibles dès le premier mois. Merci à OEKO pour leur sérieux et leur expertise locale !',
    date: 'Il y a 33 semaines',
  },
  {
    name: 'Valerie Seta',
    rating: 5,
    comment: 'Très satisfait de nos travaux autant sur le plan administratif avec aucunes démarches ou presque, technique la maison a l\'air neuve que relationnelle lors du déroulement des travaux.',
    date: 'Il y a 36 semaines',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { elementRef, isVisible } = useScrollAnimation();

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#352c5b] to-[#352c5b]/90">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div
          ref={elementRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-white mb-3">
              Des propriétaires <span className="text-accent">satisfaits</span> en Île-de-France
            </h2>
            <p className="text-sm md:text-base text-white/80 max-w-3xl mx-auto mb-4">
              La satisfaction de nos clients, notre meilleure garantie
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[#C0FF72] text-[#C0FF72]" />
                ))}
              </div>
              <p className="text-white/90 font-medium ml-2">5/5 sur Google</p>
              <img
                src="https://i.postimg.cc/r05jYcHx/logo.png"
                alt="Google Reviews"
                className="h-5 w-auto max-w-[28px] ml-1 object-contain"
              />
            </div>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {visibleTestimonials.map((testimonial, index) => (
                <div
                  key={`${currentIndex}-${index}`}
                  className={`bg-white rounded-xl p-5 md:p-6 transition-all duration-500 ${
                    index === 0 ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
                  } ${index === 2 ? 'hidden lg:block' : ''} ${index === 1 ? 'hidden md:block' : ''}`}
                >
                  <Quote className="w-6 h-6 text-[#C0FF72] mb-3" />

                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C0FF72] text-[#C0FF72]" />
                    ))}
                  </div>

                  <p className="text-sm text-[#2a2a2a] leading-relaxed mb-4">
                    {testimonial.comment}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-[#352c5b]">{testimonial.name}</p>
                    </div>
                    <p className="text-xs text-[#2a2a2a]/60">{testimonial.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-[#C0FF72]'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Voir l'avis ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <a href="https://maps.app.goo.gl/wmzNsCNWs2k14bGQ7" target="_blank" rel="noopener noreferrer">
                  Voir plus d'avis Google
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
