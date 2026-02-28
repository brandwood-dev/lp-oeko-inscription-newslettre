'use client';

import { Shield, TrendingUp, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function SolutionSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div
          ref={elementRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 max-w-full">
              <div className="inline-block">
                <div className="bg-[#C0FF72]/20 text-[#352c5b] px-3 py-1.5 rounded-full text-xs font-medium">
                  Votre solution
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-[#352c5b] break-words">
                Notre expertise au service de votre <span className="text-accent">façade</span>
              </h2>

              <p className="text-sm md:text-base text-[#2a2a2a]/70 leading-relaxed break-words">
                OEKO est spécialisée dans le ravalement de façade pour maisons individuelles, Maisons à ossature métallique et pavillons des années 70 à 2000, avec une approche technique, préventive et durable.
              </p>

              <div className="space-y-3 pt-2 max-w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-[#C0FF72] rounded-full p-2 flex-shrink-0">
                    <Shield className="w-4 h-4 text-[#352c5b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-[#352c5b] mb-1 break-words">
                      Protection du bâtiment
                    </h3>
                    <p className="text-sm text-[#2a2a2a]/70 break-words">
                      Stop infiltrations, prévention fissures, renforcement étanchéité.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#C0FF72] rounded-full p-2 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#352c5b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-[#352c5b] mb-1 break-words">
                      Valorisation patrimoine
                    </h3>
                    <p className="text-sm text-[#2a2a2a]/70 break-words">
                      Augmentez la valeur de votre bien jusqu'à 15%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#C0FF72] rounded-full p-2 flex-shrink-0">
                    <Award className="w-4 h-4 text-[#352c5b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-[#352c5b] mb-1 break-words">
                      Prévention dégradations
                    </h3>
                    <p className="text-sm text-[#2a2a2a]/70 break-words">
                      Intervention préventive avant aggravation des dommages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Button
                  size="lg"
                  className="bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold px-6 md:px-8 py-4 md:py-5 text-sm md:text-base rounded-md transition-all duration-300 hover:glow-accent group whitespace-nowrap"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Avis d'un expert
                  <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="relative max-w-full">
              <div className="bg-gradient-to-br from-[#352c5b] to-[#352c5b]/80 rounded-2xl p-5 md:p-6 lg:p-8 text-white max-w-full overflow-hidden">
                <h3 className="text-lg md:text-xl font-semibold mb-4 break-words">
                  Pourquoi OEKO ?
                </h3>

                <div className="space-y-2.5 max-w-full">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">17 ans d'expérience</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">Garantie décennale</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">Équipe certifiée</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">Matériaux premium</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">Délais respectés</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C0FF72] flex-shrink-0" />
                    <p className="text-sm md:text-base break-words">Service 7j/7</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xl md:text-2xl font-bold text-[#C0FF72]">2500+</p>
                      <p className="text-xs text-white/80 break-words">Projets</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl md:text-2xl font-bold text-[#C0FF72]">98%</p>
                      <p className="text-xs text-white/80 break-words">Satisfaits</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl md:text-2xl font-bold text-[#C0FF72]">4.9</p>
                      <p className="text-xs text-white/80 break-words">Google</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
