'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';

type Stats = {
  tours: number;
  upcomingDates: number;
  orders: number;
  inquiries: number;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/tours').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/admin/orders').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/admin/submissions').then((r) => (r.ok ? r.json() : [])),
    ]).then(([tours, orders, inquiries]) => {
      const upcomingDates = (tours as { dates?: { startsAt: string; isActive: boolean }[] }[])
        .flatMap((t) => t.dates || [])
        .filter((d) => d.isActive && new Date(d.startsAt) >= new Date()).length;
      setStats({
        tours: tours.length,
        upcomingDates,
        orders: orders.length,
        inquiries: inquiries.length,
      });
    });
  }, []);

  return (
    <AdminShell>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Create a tour with dates, text, and photos — visitors can book and pay on the site. Stripe
        handles cards; MobilePay appears when enabled on your Stripe account.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Tours', value: stats?.tours, href: '/admin/tours' },
          { label: 'Upcoming dates', value: stats?.upcomingDates, href: '/admin/tours' },
          { label: 'Orders', value: stats?.orders, href: '/admin/orders' },
          { label: 'Inquiries', value: stats?.inquiries, href: '/admin/inquiries' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="border border-gray-200 p-5 hover:border-gray-400 transition-colors"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{item.label}</p>
            <p className="text-3xl font-light text-gray-900">
              {item.value == null ? '—' : item.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <Link
          href="/admin/tours"
          className="block w-full sm:w-auto sm:inline-block px-6 py-3 bg-gray-900 text-white text-sm text-center hover:bg-gray-800"
        >
          Open a new tour
        </Link>
        <p className="text-sm text-gray-500">
          Public booking lives at <Link href="/tours" className="underline">/tours</Link>.
        </p>
      </div>
    </AdminShell>
  );
}
