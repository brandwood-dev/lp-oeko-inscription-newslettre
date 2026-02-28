'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.85;

      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  const scrollToForm = () => {
    const form = document.getElementById('contact-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm border-t-4 border-[#C0FF72] shadow-2xl p-3">
        <Button
          onClick={scrollToForm}
          size="lg"
          className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white font-semibold px-4 py-4 text-sm rounded-md transition-all duration-300 group cta-pulse-glow-mobile"
          aria-label="Aller au formulaire de contact"
        >
          <span className="flex items-center justify-center whitespace-nowrap">
            Demander mon diagnostic gratuit
            <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
}
