'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Google Consent Mode v2 types
export type ConsentStatus = 'granted' | 'denied';

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentContextType {
  consent: ConsentState;
  hasConsent: boolean;
  updateConsent: (newConsent: Partial<ConsentState>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<ConsentContextType | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'cookie-consent';

// Default consent state (before user choice)
const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [hasConsent, setHasConsent] = useState(false);

  // Initialize consent from localStorage
  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent);
        setConsent({
          necessary: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
        });
        setHasConsent(true);
      } catch (error) {
        console.error('Error parsing stored consent:', error);
      }
    }
  }, []);

  // Update Google Consent Mode whenever consent changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      updateGoogleConsentMode(consent);
    }
  }, [consent]);

  const updateGoogleConsentMode = (consentState: ConsentState) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    // Update consent for Google services
    window.gtag('consent', 'update', {
      analytics_storage: consentState.analytics ? 'granted' : 'denied',
      ad_storage: consentState.marketing ? 'granted' : 'denied',
      ad_user_data: consentState.marketing ? 'granted' : 'denied',
      ad_personalization: consentState.marketing ? 'granted' : 'denied',
      functionality_storage: 'granted',
      personalization_storage: consentState.analytics ? 'granted' : 'denied',
      security_storage: 'granted',
    });

    console.log('Google Consent Mode updated:', {
      analytics_storage: consentState.analytics ? 'granted' : 'denied',
      ad_storage: consentState.marketing ? 'granted' : 'denied',
      ad_user_data: consentState.marketing ? 'granted' : 'denied',
      ad_personalization: consentState.marketing ? 'granted' : 'denied',
    });
  };

  const saveConsent = (newConsent: ConsentState) => {
    const consentData = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    setConsent(newConsent);
    setHasConsent(true);
  };

  const updateConsent = (newConsent: Partial<ConsentState>) => {
    const updated = {
      necessary: true, // Always true
      analytics: newConsent.analytics ?? consent.analytics,
      marketing: newConsent.marketing ?? consent.marketing,
    };
    saveConsent(updated);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent(defaultConsent);
    setHasConsent(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsent,
        updateConsent,
        acceptAll,
        rejectAll,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
