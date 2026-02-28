'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function CookieConsent() {
  const { consent, hasConsent, updateConsent, acceptAll, rejectAll } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(consent);

  // Show banner if no consent has been given
  useEffect(() => {
    if (!hasConsent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [hasConsent]);

  // Sync preferences with consent
  useEffect(() => {
    setPreferences(consent);
  }, [consent]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    updateConsent(preferences);
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in duration-300" />

      <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:max-w-md z-[70] animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-[#352c5b] to-[#352c5b]/90 p-3 md:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <Cookie className="w-5 h-5 md:w-6 md:h-6 text-[#C0FF72]" />
                <h3 className="text-base md:text-lg font-semibold text-white">
                  Gestion des cookies
                </h3>
              </div>
              <button
                onClick={handleRejectAll}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto">
            {!showSettings ? (
              <>
                <p className="text-sm md:text-base text-[#2a2a2a]/80 leading-relaxed mb-3 md:mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, personnaliser le contenu
                  et analyser notre trafic. Acceptez-vous l'utilisation de cookies ?
                </p>

                <div className="flex items-start gap-2 mb-4 md:mb-6 p-2 md:p-3 bg-[#C0FF72]/10 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#352c5b] flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-[#2a2a2a]/70">
                    Vos données sont protégées conformément au RGPD.
                    <a href="#privacy" className="text-[#352c5b] underline ml-1 hover:text-[#352c5b]/80 font-medium">
                      En savoir plus
                    </a>
                  </p>
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="w-full bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold py-3 md:py-6 text-sm md:text-base transition-all duration-300 hover:glow-accent"
                  >
                    Accepter tous les cookies
                  </Button>

                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 text-[#2a2a2a] py-2 md:py-3 text-sm"
                    >
                      Refuser tout
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="outline"
                      className="border-[#352c5b] text-[#352c5b] hover:bg-[#352c5b]/5 py-2 md:py-3 text-sm"
                    >
                      <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Personnaliser
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-center text-[#2a2a2a]/60 mt-3 md:mt-4">
                  En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.
                </p>
              </>
            ) : (
              <>
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="necessary"
                      checked={preferences.necessary}
                      disabled
                      className="mt-1 data-[state=checked]:bg-[#352c5b] data-[state=checked]:border-[#352c5b]"
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="necessary" className="font-medium text-sm md:text-base text-[#352c5b] cursor-default block mb-1">
                        Cookies nécessaires (obligatoire)
                      </label>
                      <p className="text-xs md:text-sm text-[#2a2a2a]/70">
                        Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, analytics: checked as boolean })
                      }
                      className="mt-1 data-[state=checked]:bg-[#352c5b] data-[state=checked]:border-[#352c5b]"
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="analytics" className="font-medium text-sm md:text-base text-[#352c5b] cursor-pointer block mb-1">
                        Cookies analytiques
                      </label>
                      <p className="text-xs md:text-sm text-[#2a2a2a]/70">
                        Nous permettent de mesurer l'audience et d'améliorer nos services (Google Analytics).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, marketing: checked as boolean })
                      }
                      className="mt-1 data-[state=checked]:bg-[#352c5b] data-[state=checked]:border-[#352c5b]"
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="marketing" className="font-medium text-sm md:text-base text-[#352c5b] cursor-pointer block mb-1">
                        Cookies marketing
                      </label>
                      <p className="text-xs md:text-sm text-[#2a2a2a]/70">
                        Utilisés pour personnaliser les publicités et mesurer l'efficacité de nos campagnes (Google Ads, Meta Ads).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <Button
                    onClick={handleSavePreferences}
                    className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white font-semibold py-3 md:py-6 text-sm md:text-base transition-all duration-300"
                  >
                    Enregistrer mes préférences
                  </Button>

                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    className="w-full border-gray-300 py-2 md:py-3 text-sm"
                  >
                    Retour
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
