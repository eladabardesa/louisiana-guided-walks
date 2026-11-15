'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatPriceDkk, formatTourDate } from '@/lib/format';

type Order = {
  orderNumber: string;
  status: string;
  quantity: number;
  totalAmount: number;
  fullName: string;
  tour: { name: string; venue?: { name: string } | null };
  tourDate: { startsAt: string; language: string | null } | null;
};

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({ order: orderNumber });
    if (sessionId) params.set('session_id', sessionId);
    fetch(`/api/payments/verify?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [orderNumber, sessionId]);

  return (
    <main className="page-section pt-28 sm:pt-32">
      <div className="page-container max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">Thank you</h1>
        {loading ? (
          <p className="text-gray-500">Confirming your booking…</p>
        ) : order ? (
          <div className="space-y-4 text-gray-700">
            <p>
              {order.status === 'PAID'
                ? 'Your spot is confirmed.'
                : 'We received your booking and are confirming payment.'}
            </p>
            <div className="rounded-xl border border-gray-200 p-5 text-sm space-y-2">
              <p>
                <span className="text-gray-400">Order</span> · {order.orderNumber}
              </p>
              <p>
                <span className="text-gray-400">Tour</span> · {order.tour.name}
              </p>
              {order.tour.venue?.name && (
                <p>
                  <span className="text-gray-400">Venue</span> · {order.tour.venue.name}
                </p>
              )}
              <p>
                <span className="text-gray-400">When</span> ·{' '}
                {order.tourDate
                  ? formatTourDate(order.tourDate.startsAt, order.tourDate.language)
                  : 'To be arranged'}
              </p>
              <p>
                <span className="text-gray-400">Tickets</span> · {order.quantity}
              </p>
              <p>
                <span className="text-gray-400">Total</span> · {formatPriceDkk(order.totalAmount)}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              A confirmation will arrive by email when everything is settled. Questions?{' '}
              <Link href="/contact" className="underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">We couldn&apos;t find that order.</p>
            <Link href="/tours" className="underline text-sm">
              Back to tours
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="page-section pt-28">
          <div className="page-container">
            <p className="text-gray-400">Loading…</p>
          </div>
        </main>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
