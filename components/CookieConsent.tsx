'use client';

import { useState, useEffect } from 'react';
import { getConsent, setConsent } from '@/lib/consent';

export default function CookieConsent({
  onConsentChange,
}: {
  onConsentChange: (granted: boolean) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsent();
    if (status === null) {
      setVisible(true);
    } else {
      onConsentChange(status === 'granted');
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    setConsent('granted');
    setVisible(false);
    onConsentChange(true);
  };

  const handleDecline = () => {
    setConsent('denied');
    setVisible(false);
    onConsentChange(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-3xl px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="bg-white border border-gray-200 shadow-lg px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            We use cookies for analytics to improve your experience.{' '}
            <a href="https://gdpr.eu/cookies/" target="_blank" rel="noopener noreferrer" className="underline text-gray-900 hover:text-gray-600 transition-colors">
              Learn more
            </a>
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
