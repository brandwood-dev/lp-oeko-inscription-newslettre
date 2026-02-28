'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Sun, Moon, Contrast, Zap, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AccessibilitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySidebar({ isOpen, onClose }: AccessibilitySidebarProps) {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
    fontSize: 100,
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      applyPreferences(parsed);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const applyPreferences = (prefs: typeof preferences) => {
    if (prefs.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    if (prefs.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (prefs.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    document.documentElement.style.fontSize = `${prefs.fontSize}%`;
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean | number) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    applyPreferences(newPreferences);
    localStorage.setItem('accessibility-preferences', JSON.stringify(newPreferences));
  };

  const resetPreferences = () => {
    const defaultPreferences = {
      darkMode: false,
      highContrast: false,
      reducedMotion: false,
      fontSize: 100,
    };
    setPreferences(defaultPreferences);
    applyPreferences(defaultPreferences);
    localStorage.setItem('accessibility-preferences', JSON.stringify(defaultPreferences));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-modal="true"
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark-theme:bg-[#1a1a1a] shadow-2xl z-50 animate-in slide-in-from-right duration-300"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark-theme:border-gray-700">
            <h2 id="accessibility-title" className="text-2xl font-semibold text-[#352c5b] dark-theme:text-white">
              Préférences d'accessibilité
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-[#2a2a2a] dark-theme:text-white hover:bg-gray-100 dark-theme:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Fermer les préférences"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {preferences.darkMode ? (
                    <Moon className="w-5 h-5 text-[#352c5b] dark-theme:text-[#C0FF72] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#352c5b] dark-theme:text-[#C0FF72] flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <Label htmlFor="dark-mode" className="text-base font-medium text-[#2a2a2a] dark-theme:text-white cursor-pointer">
                      Thème sombre
                    </Label>
                    <p className="text-sm text-[#2a2a2a]/70 dark-theme:text-white/70 mt-1">
                      Réduire la fatigue oculaire avec un fond sombre
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => updatePreference('darkMode', checked)}
                />
              </div>
            </div>

            <div className="h-px bg-gray-200 dark-theme:bg-gray-700" />

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Contrast className="w-5 h-5 text-[#352c5b] dark-theme:text-[#C0FF72] flex-shrink-0 mt-0.5" />
                  <div>
                    <Label htmlFor="high-contrast" className="text-base font-medium text-[#2a2a2a] dark-theme:text-white cursor-pointer">
                      Contraste élevé
                    </Label>
                    <p className="text-sm text-[#2a2a2a]/70 dark-theme:text-white/70 mt-1">
                      Améliorer la lisibilité avec un contraste renforcé
                    </p>
                  </div>
                </div>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                />
              </div>
            </div>

            <div className="h-px bg-gray-200 dark-theme:bg-gray-700" />

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-[#352c5b] dark-theme:text-[#C0FF72] flex-shrink-0 mt-0.5" />
                  <div>
                    <Label htmlFor="reduced-motion" className="text-base font-medium text-[#2a2a2a] dark-theme:text-white cursor-pointer">
                      Réduire les animations
                    </Label>
                    <p className="text-sm text-[#2a2a2a]/70 dark-theme:text-white/70 mt-1">
                      Désactiver les animations et transitions
                    </p>
                  </div>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
                />
              </div>
            </div>

            <div className="h-px bg-gray-200 dark-theme:bg-gray-700" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ZoomIn className="w-5 h-5 text-[#352c5b] dark-theme:text-[#C0FF72] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="font-size" className="text-base font-medium text-[#2a2a2a] dark-theme:text-white">
                    Taille du contenu
                  </Label>
                  <p className="text-sm text-[#2a2a2a]/70 dark-theme:text-white/70 mt-1 mb-4">
                    Ajuster la taille du texte : {preferences.fontSize}%
                  </p>
                  <Slider
                    id="font-size"
                    min={80}
                    max={150}
                    step={10}
                    value={[preferences.fontSize]}
                    onValueChange={([value]) => updatePreference('fontSize', value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#2a2a2a]/60 dark-theme:text-white/60 mt-2">
                    <span>80%</span>
                    <span>100%</span>
                    <span>150%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark-theme:bg-gray-700" />

            <div className="bg-[#C0FF72]/10 dark-theme:bg-[#C0FF72]/20 rounded-lg p-4">
              <p className="text-sm text-[#2a2a2a] dark-theme:text-white leading-relaxed">
                Ces paramètres sont automatiquement enregistrés et appliqués lors de vos prochaines visites.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark-theme:border-gray-700">
            <Button
              onClick={resetPreferences}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 dark-theme:border-gray-600 dark-theme:hover:bg-gray-800"
            >
              Réinitialiser les paramètres
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
