"use client";

import { useEffect } from "react";
import Script from "next/script";
import { CheckCircle2, Phone, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MerciPage() {
  // Track conversion when page loads (form submission success)
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      // Send conversion event to Google Ads
      window.gtag("event", "conversion", {
        send_to: "AW-16743031815",
      });
    }
  }, []);

  return (
    <>
      {/* Google Ads Conversion Script */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-16743031815',
            'transaction_id': ''
          });
        `}
      </Script>

      <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-[#C0FF72] rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-[#352c5b]" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#352c5b] mb-4">
              Merci pour votre demande !
            </h1>

            <p className="text-lg md:text-xl text-[#2a2a2a]/80 mb-6 leading-relaxed">
              Un expert OEKO vous contactera{" "}
              <span className="font-semibold text-[#352c5b]">
                très rapidement
              </span>{" "}
              pour établir votre diagnostic gratuit.
            </p>

            <div className="bg-[#C0FF72]/10 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-[#352c5b] mb-4">
                Besoin d'une réponse immédiate ?
              </h2>
              <div className="space-y-3">
                <a
                  href="tel:0189701727"
                  className="flex items-center justify-center gap-3 text-[#352c5b] hover:text-accent transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg font-medium">01 89 70 17 27</span>
                </a>
                <a
                  href="mailto:contact@oeko.fr"
                  className="flex items-center justify-center gap-3 text-[#2a2a2a]/70 hover:text-accent transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>contact@oeko.fr</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-[#2a2a2a]/80">
                  <span className="font-medium text-[#352c5b]">
                    Expertise reconnue
                  </span>{" "}
                  depuis plus de 17 ans dans le ravalement de façade
                </p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-[#2a2a2a]/80">
                  <span className="font-medium text-[#352c5b]">
                    Diagnostic 100% gratuit
                  </span>{" "}
                  sans engagement de votre part
                </p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-[#2a2a2a]/80">
                  <span className="font-medium text-[#352c5b]">
                    Garantie décennale
                  </span>{" "}
                  sur tous nos travaux de ravalement
                </p>
              </div>
            </div>

            <Link href="/">
              <Button
                size="lg"
                className="bg-[#352c5b] hover:bg-[#352c5b]/90 text-white px-8 py-6 text-base rounded-md transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
