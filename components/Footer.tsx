'use client';

import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#352c5b] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 pb-24 lg:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-[#C0FF72] mb-3">Adresse</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C0FF72] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">
                  16 Bis Bd Chamblain<br />
                  77000 Melun
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#C0FF72] mb-3">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C0FF72]" />
                  <a href="tel:0189701727" className="text-sm text-white/80 hover:text-[#C0FF72] transition-colors">
                    01 89 70 17 27
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C0FF72]" />
                  <a href="mailto:contact@oeko.fr" className="text-sm text-white/80 hover:text-[#C0FF72] transition-colors">
                    contact@oeko.fr
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#C0FF72] mb-3">Suivez-nous</h4>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61560399356724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C0FF72] hover:text-[#352c5b] transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C0FF72] hover:text-[#352c5b] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/oeko-fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C0FF72] hover:text-[#352c5b] transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/80 text-center md:text-left">
                © 2026 OEKO. Tous droits réservés.
              </p>
              <p className="text-sm text-white/60 text-center md:text-right">
                Designed by{' '}
                <a
                  href="https://www.brandwoodandco.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C0FF72] hover:underline transition-colors"
                >
                  Brandwood & Co
                </a>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
              <a
                href="https://oeko.fr/mentions-legales"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C0FF72] transition-colors"
              >
                Mentions légales
              </a>
              <span>•</span>
              <a
                href="https://www.oeko.fr/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C0FF72] transition-colors"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
