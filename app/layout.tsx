import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import ConsentModeInit from "@/components/GoogleScripts";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OEKO - Ravalement de Façade Expert | Diagnostic Gratuit",
  description:
    "Spécialiste du ravalement de façade. Protection durable, valorisation de votre bien. Obtenez votre diagnostic gratuit. Interventions rapides et garanties.",
  keywords: [
    "ravalement façade",
    "rénovation façade",
    "protection façade",
    "diagnostic gratuit",
    "OEKO",
  ],
  openGraph: {
    title: "OEKO - Ravalement de Façade Expert",
    description: "Spécialiste du ravalement de façade. Diagnostic gratuit.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <head>
        <ConsentModeInit />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16743031815"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16743031815');
            console.log('✅ Google Tag (gtag.js) loaded - ID: AW-16743031815');
            console.log('📊 dataLayer:', window.dataLayer);
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KCT994RQ');
            console.log('✅ Google Tag Manager loaded - ID: GTM-KCT994RQ');
          `}
        </Script>
      </head>
      <body className={montserrat.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KCT994RQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <CookieConsentProvider>{children}</CookieConsentProvider>

        <Script id="gtm-noscript-log" strategy="afterInteractive">
          {`
            console.log('✅ Google Tag Manager (noscript) iframe added to body');
          `}
        </Script>
      </body>
    </html>
  );
}
