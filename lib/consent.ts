const CONSENT_KEY = 'aae-cookie-consent';

export type ConsentStatus = 'granted' | 'denied' | null;

export function getConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

export function setConsent(status: 'granted' | 'denied') {
  localStorage.setItem(CONSENT_KEY, status);
}
