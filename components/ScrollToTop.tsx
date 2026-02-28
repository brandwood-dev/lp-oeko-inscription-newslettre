'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Revenir en haut de la page"
      className={`fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 w-12 h-12 bg-[#352c5b] hover:bg-[#352c5b]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:glow-accent focus:outline-none focus:ring-2 focus:ring-[#C0FF72] focus:ring-offset-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
