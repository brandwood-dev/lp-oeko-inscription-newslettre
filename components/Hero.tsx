"use client";

import { useState } from "react";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Hero() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    houseType: "",
    message: "",
    rgpdConsent: false,
    website: "",
  });
  //nice

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.houseType) {
      toast.error("Veuillez sélectionner un type de bien.");
      return;
    }
    if (!formData.rgpdConsent) {
      toast.error("Veuillez accepter les conditions RGPD pour continuer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      if (data.warnings && data.warnings.length > 0) {
        console.warn("Partial service failures:", data.warnings);
      }

      toast.success("Votre demande a été envoyée avec succès !");

      setTimeout(() => {
        // Check if we're in an iframe (embedded in Webflow)
        if (window.parent !== window) {
          // Redirect parent window to Webflow merci page
          window.parent.location.href = "https://www.oeko.fr/lp-ravalement-facade-merci";
        } else {
          // Normal redirect (standalone)
          router.push("/merci");
        }
      }, 500);
    } catch (err: any) {
      console.error("Form submission error:", err);
      toast.error(
        err.message || "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[85vh] overflow-hidden py-8 md:py-12 lg:py-14">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://i.postimg.cc/3NRqB061/20210316-maisons-france-confort-plain-maison-plain-pied-sous-sol-auzin-622.jpg)",
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#352c5b]/95 via-[#352c5b]/85 to-[#352c5b]/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center max-w-7xl mx-auto">
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-1 text-sm font-medium text-[#352c5b] bg-[#C0FF72] px-4 py-2 rounded-full">
              <Star className="w-4 h-4 fill-[#352c5b] text-[#352c5b]" />
              <Star className="w-4 h-4 fill-[#352c5b] text-[#352c5b]" />
              <Star className="w-4 h-4 fill-[#352c5b] text-[#352c5b]" />
              <Star className="w-4 h-4 fill-[#352c5b] text-[#352c5b]" />
              <Star className="w-4 h-4 fill-[#352c5b] text-[#352c5b]" />
              <span className="ml-2">5/5 sur Google</span>
              <img
                src="https://i.postimg.cc/r05jYcHx/logo.png"
                alt="Google Reviews"
                className="h-4 w-auto max-w-[24px] ml-1 object-contain"
              />
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              Protégez votre <span className="text-[#C0FF72]">façade</span> et
              valorisez votre patrimoine
            </h1>

            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              <span className="text-[#C0FF72] font-medium">
                Diagnostic gratuit
              </span>{" "}
              • Entreprise RGE certifiée • Intervention rapide en Île-de-France
              • Sans dépendre des aides
            </p>

            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-start gap-2 md:gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C0FF72] flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-white/90">
                  <span className="font-medium text-[#C0FF72]">
                    17 ans d'expérience
                  </span>{" "}
                  en ravalement
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C0FF72] flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-white/90">
                  <span className="font-medium text-[#C0FF72]">
                    Entreprise RGE
                  </span>{" "}
                  certifiée
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C0FF72] flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-white/90">
                  <span className="font-medium text-[#C0FF72]">
                    Garantie décennale
                  </span>{" "}
                  incluse
                </p>
              </div>
            </div>

            <div className="pt-2 lg:hidden">
              <Button
                size="lg"
                className="w-full bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold px-4 py-5 text-sm md:text-base rounded-md transition-all duration-300 hover:glow-accent group shadow-lg"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>Diagnostic gratuit</span>
                <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-2 hidden lg:block">
              <Button
                size="lg"
                className="bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold px-8 py-5 text-base rounded-md transition-all duration-300 hover:glow-accent group"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Obtenir mon diagnostic gratuit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="hidden lg:block w-full lg:max-w-[400px] lg:mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 p-5">
            <div className="mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-[#352c5b] mb-1">
                Obtenez votre diagnostic{" "}
                <span className="text-accent">maintenant</span>
              </h3>
              <p className="text-xs text-[#2a2a2a]/70">
                Réponse sous 24h • Sans engagement
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <Input
                id="hero-name"
                type="text"
                placeholder="Nom complet *"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-10 border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
              />

              <Input
                id="hero-email"
                type="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-10 border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
              />

              <Input
                id="hero-phone"
                type="tel"
                placeholder="Téléphone *"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-10 border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
              />

              <Input
                id="hero-city"
                type="text"
                placeholder="Ville / Code postal *"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="h-10 border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
              />

              <Select
                value={formData.houseType}
                onValueChange={(value) =>
                  setFormData({ ...formData, houseType: value })
                }
                required
              >
                <SelectTrigger
                  id="hero-house-type"
                  className="h-10 border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
                >
                  <SelectValue placeholder="Type de bien *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maison">Maison individuelle</SelectItem>
                  <SelectItem value="immeuble">Immeuble</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                id="hero-message"
                placeholder="Décrivez votre projet (optionnel)"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="min-h-[80px] border-gray-300 focus:border-[#352c5b] focus:ring-[#352c5b]"
              />

              <div className="flex items-start space-x-2 py-2">
                <Checkbox
                  id="hero-rgpd"
                  checked={formData.rgpdConsent}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      rgpdConsent: checked as boolean,
                    })
                  }
                  className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#352c5b] data-[state=checked]:border-[#352c5b]"
                  required
                />
                <label
                  htmlFor="hero-rgpd"
                  className="text-xs text-[#2a2a2a]/70 leading-tight cursor-pointer"
                >
                  J'accepte d'être contacté par OEKO.
                  <a
                    href="https://www.oeko.fr/politique-de-confidentialite"
                    className="text-[#352c5b] underline ml-1 hover:text-[#352c5b]/80"
                  >
                    RGPD
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-[#C0FF72] hover:bg-[#C0FF72]/90 text-[#352c5b] font-semibold h-11 rounded-md transition-all duration-300 hover:glow-accent"
              >
                {isSubmitting ? "Envoi..." : "Mon diagnostic avec un expert"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
