'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onOpenSettings: () => void;
}

export default function Navbar({ onOpenSettings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Expertise façade', id: 'solutions' },
    { label: 'Réalisations avant / après', id: 'realisations' },
    { label: 'Avis clients', id: 'testimonials' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? isScrolled
              ? 'bg-[#1a1a1a] shadow-lg border-b border-gray-800'
              : 'bg-[#0a0a0a]/95 backdrop-blur-sm'
            : isScrolled
            ? 'bg-white shadow-lg border-b border-gray-200'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={scrollToTop}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://i.postimg.cc/YL12gx64/logo-oeko.png"
                alt="OEKO Logo"
                className="h-12 w-auto"
              />
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`font-medium transition-colors relative group ${
                    isDarkMode
                      ? 'text-white hover:text-[#C0FF72]'
                      : 'text-[#2a2a2a] hover:text-[#352c5b]'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C0FF72] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:0189701727"
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isDarkMode
                    ? 'text-white hover:text-[#C0FF72]'
                    : 'text-[#352c5b] hover:text-[#352c5b]/80'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>01 89 70 17 27</span>
              </a>

              <Button
                onClick={() => scrollToSection('contact-form')}
                className="bg-[#352c5b] hover:bg-[#352c5b]/90 text-white px-6 transition-all duration-300 cta-pulse-glow"
              >
                Demander mon diagnostic
              </Button>

              <button
                onClick={onOpenSettings}
                className={`p-2 transition-colors ${
                  isDarkMode
                    ? 'text-white hover:text-[#C0FF72]'
                    : 'text-[#2a2a2a] hover:text-[#352c5b]'
                }`}
                aria-label="Ouvrir les préférences d'accessibilité"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:0189701727"
                className={`p-2 transition-colors ${
                  isDarkMode
                    ? 'text-white hover:text-[#C0FF72]'
                    : 'text-[#352c5b] hover:text-[#352c5b]/80'
                }`}
                aria-label="Appeler"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                onClick={onOpenSettings}
                className={`p-2 transition-colors ${
                  isDarkMode
                    ? 'text-white hover:text-[#C0FF72]'
                    : 'text-[#2a2a2a] hover:text-[#352c5b]'
                }`}
                aria-label="Préférences"
              >
                <Settings className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition-colors ${
                  isDarkMode
                    ? 'text-white hover:text-[#C0FF72]'
                    : 'text-[#2a2a2a] hover:text-[#352c5b]'
                }`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-4 py-3 text-[#2a2a2a] hover:bg-[#C0FF72]/10 hover:text-[#352c5b] rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <Button
                onClick={() => scrollToSection('contact-form')}
                className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white py-6 transition-all duration-300 cta-pulse-glow"
              >
                Demander mon diagnostic
              </Button>

              <a
                href="tel:0189701727"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[#352c5b] hover:bg-[#352c5b]/5 rounded-lg font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>01 89 70 17 27</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />
    </>
  );
}
