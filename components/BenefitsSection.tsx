'use client';

import { Shield, PiggyBank, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const benefits = [
  {
    icon: Shield,
    title: 'Protection durable',
    description: 'Protégez votre façade contre les intempéries, l\'humidité et les fissures. Notre expertise garantit une étanchéité optimale pour des décennies.',
    color: 'bg-blue-50',
  },
  {
    icon: PiggyBank,
    title: 'Économie future',
    description: 'Évitez des réparations coûteuses en agissant maintenant. Un ravalement préventif peut vous faire économiser jusqu\'à 40% sur les travaux futurs.',
    color: 'bg-green-50',
  },
  {
    icon: TrendingUp,
    title: 'Valorisation du bien',
    description: 'Augmentez la valeur de votre patrimoine jusqu\'à 15%. Une façade rénovée attire plus d\'acheteurs et améliore votre image.',
    color: 'bg-purple-50',
  },
];

export default function BenefitsSection() {
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
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-[#352c5b] mb-3">
              Une façade <span className="text-accent">protégée</span> aujourd'hui, une maison <span className="text-accent">valorisée</span> demain
            </h2>
            <p className="text-sm md:text-base text-[#2a2a2a]/70 max-w-3xl mx-auto">
              Investissez intelligemment dans votre bien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`w-12 h-12 ${benefit.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="w-6 h-6 text-[#352c5b]" />
                </div>

                <h3 className="text-lg font-semibold text-[#352c5b] mb-2 group-hover:text-accent transition-colors">
                  {benefit.title}
                </h3>

                <p className="text-sm text-[#2a2a2a]/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-md transition-all duration-300 hover:glow-accent max-w-md mx-auto"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="block sm:hidden">Diagnostic gratuit</span>
              <span className="hidden sm:block">Diagnostic gratuit</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
