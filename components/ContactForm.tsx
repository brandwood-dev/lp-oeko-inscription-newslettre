'use client';

import { useState } from 'react';
import { Star, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    houseType: '',
    message: '',
    rgpdConsent: false,
    website: '', // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.rgpdConsent) {
      toast.error('Veuillez accepter les conditions RGPD pour continuer.');
      return;
    }

    if (!formData.houseType) {
      toast.error('Veuillez sélectionner un type de bien.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Log warnings if any service partially failed
      if (data.warnings && data.warnings.length > 0) {
        console.warn('Partial service failures:', data.warnings);
      }

      // Success: redirect to thank you page
      toast.success('Votre demande a été envoyée avec succès !');

      // Note: Google Ads conversion tracking will be handled by
      // pixels injected post-build in the HTML

      setTimeout(() => {
        // Check if we're in an iframe (embedded in Webflow)
        if (window.parent !== window) {
          // Redirect parent window to Webflow merci page
          window.parent.location.href = "https://www.oeko.fr/lp-ravalement-facade-merci";
        } else {
          // Normal redirect (standalone)
          router.push('/merci');
        }
      }, 500);

    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      toast.error(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-12 md:py-16 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-[#352c5b] mb-3">
              Obtenez un <span className="text-[#C0FF72]">diagnostic façade gratuit</span> dès maintenant
            </h2>
            <p className="text-sm md:text-base text-[#2a2a2a]/70 max-w-3xl mx-auto mb-6">
              Un avis professionnel clair, sans engagement, avec intervention rapide en Île-de-France
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#352c5b]" />
                <p className="text-xs font-medium text-[#2a2a2a]/80">100% Gratuit</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#352c5b]" />
                <p className="text-xs font-medium text-[#2a2a2a]/80">Réponse sous 24h</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-[#C0FF72] text-[#C0FF72]" />
                  ))}
                </div>
                <p className="text-xs font-medium text-[#2a2a2a]/80">5/5 Google</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#C0FF72] p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field - hidden from users, bots will fill it */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  opacity: 0,
                }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#352c5b] font-medium">
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#352c5b] font-medium">
                    Adresse email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@exemple.fr"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#352c5b] font-medium">
                    Téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#352c5b] font-medium">
                    Ville / Code postal *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Paris 75001"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="house-type" className="text-[#352c5b] font-medium">
                  Type de bien *
                </Label>
                <Select
                  value={formData.houseType}
                  onValueChange={(value) => setFormData({ ...formData, houseType: value })}
                  required
                >
                  <SelectTrigger id="house-type" className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] h-11">
                    <SelectValue placeholder="Sélectionnez le type de bien..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maison">Maison individuelle</SelectItem>
                    <SelectItem value="immeuble">Immeuble</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#352c5b] font-medium">
                  Décrivez votre projet (optionnel)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez brièvement l'état de votre façade et vos besoins..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b] min-h-[120px]"
                />
              </div>

              <div className="flex items-start space-x-3 py-4 bg-white rounded-lg px-4 border border-gray-200">
                <Checkbox
                  id="rgpd"
                  checked={formData.rgpdConsent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rgpdConsent: checked as boolean })
                  }
                  className="mt-1 border-gray-300 data-[state=checked]:bg-[#352c5b] data-[state=checked]:border-[#352c5b]"
                  required
                />
                <label htmlFor="rgpd" className="text-sm text-[#2a2a2a]/80 leading-relaxed cursor-pointer">
                  J'accepte que mes informations soient utilisées pour être contacté par OEKO dans le cadre de ma demande de diagnostic.
                  <a href="https://www.oeko.fr/politique-de-confidentialite" className="text-[#352c5b] underline ml-1 hover:text-[#352c5b]/80 font-medium">
                    Politique de confidentialité et RGPD
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white font-semibold py-5 md:py-6 text-sm md:text-base rounded-lg transition-all duration-300 hover:glow-accent"
              >
                <span className="block sm:hidden">{isSubmitting ? 'Envoi...' : 'Mon diagnostic gratuit'}</span>
                <span className="hidden sm:block">{isSubmitting ? 'Envoi en cours...' : 'Mon diagnostic gratuit'}</span>
              </Button>

              <p className="text-xs text-center text-[#2a2a2a]/60 pt-2">
                🔒 Vos données sont sécurisées et protégées conformément au RGPD • Réponse garantie sous 24h • Sans engagement
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
