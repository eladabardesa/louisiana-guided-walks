'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

type TourDateOption = {
  id: string;
  label: string;
  startsAt: string;
};

type Props = {
  tourId: string;
  tourSlug: string;
  tourName: string;
  price: number;
  priceLabel: string;
  isB2B: boolean;
  dates: TourDateOption[];
  requiresDate: boolean;
};

export default function BookingForm({
  tourId,
  tourSlug,
  tourName,
  price,
  priceLabel,
  isB2B,
  dates,
  requiresDate,
}: Props) {
  const [tourDateId, setTourDateId] = useState(dates[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCancelled(params.get('cancelled') === '1');
  }, []);

  if (isB2B) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 sm:p-8">
        <h3 className="text-xl font-light text-gray-900 mb-3">By inquiry</h3>
        <p className="text-sm text-gray-600 mb-6">
          This experience is tailored for organizations. Tell us a bit about your team and we&apos;ll
          get back to you.
        </p>
        <Link
          href={`/contact?tourType=teambuilding`}
          className="inline-block rounded-lg px-6 py-3 bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          Contact us
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          tourDateId: requiresDate ? tourDateId : null,
          quantity,
          fullName,
          email,
          phone,
          note,
          newsletter,
          customDate: !requiresDate && customDate ? customDate : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not start booking');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      throw new Error('Unexpected checkout response');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-6 sm:p-8">
      <h3 className="text-xl font-light text-gray-900 mb-1">Book {tourName}</h3>
      <p className="text-sm text-gray-500 mb-6">{priceLabel}</p>

      {cancelled && (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 mb-4">
          Payment was cancelled. You can try again whenever you&apos;re ready.
        </p>
      )}

      {requiresDate && dates.length === 0 ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            No upcoming dates are published yet. Leave an inquiry and we&apos;ll notify you.
          </p>
          <Link
            href={`/contact?tourType=regular`}
            className="inline-block rounded-lg px-6 py-3 border border-gray-900 text-sm hover:bg-gray-900 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {requiresDate ? (
            <div>
              <label className="block text-sm mb-1">Date</label>
              <select
                required
                value={tourDateId}
                onChange={(e) => setTourDateId(e.target.value)}
                className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
              >
                {dates.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-1">Preferred date (optional)</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Tickets</label>
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Note (optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            Keep me posted about future walks
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting
              ? 'Please wait…'
              : price === 0
                ? 'Confirm booking'
                : `Continue to payment · ${priceLabel}`}
          </button>

          {price > 0 && (
            <p className="text-xs text-gray-400 text-center">
              Secure checkout via Stripe — card, and MobilePay when available
            </p>
          )}
        </form>
      )}
    </div>
  );
}
