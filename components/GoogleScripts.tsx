'use client';

import { useEffect } from 'react';

/**
 * ConsentModeInit - Initialise Google Consent Mode v2
 *
 * Ce composant initialise uniquement le Consent Mode v2 (RGPD).
 * Les pixels Google Ads/Analytics seront injectés directement dans le HTML après le build.
 *
 * Le Consent Mode garantit qu'aucun tracking ne se fait sans consentement utilisateur.
 */
export default function ConsentModeInit() {
  // Initialize default consent state BEFORE any Google scripts load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize dataLayer (nécessaire pour le Consent Mode)
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer!.push(args);
      };

      // Set default consent to 'denied' for all categories
      // This ensures no tracking happens until user gives consent
      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500,
      });

      console.log('✅ Google Consent Mode v2 initialized (default: denied)');
      console.log('ℹ️  Google pixels will be injected post-build');
    }
  }, []);

  // Ce composant n'affiche rien, il initialise seulement le Consent Mode
  return null;
}
