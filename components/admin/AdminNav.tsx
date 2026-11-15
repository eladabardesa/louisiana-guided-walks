'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/tours', label: 'Tours' },
  { href: '/admin/venues', label: 'Venues' },
  { href: '/admin/content', label: 'Text' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/inquiries', label: 'Inquiries' },
];

export default function AdminNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">AAE</p>
          <h1 className="text-2xl font-light text-gray-900">Website control</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Log out
        </button>
      </div>
      <nav className="flex flex-wrap gap-1 -mb-px">
        {links.map((link) => {
          const active =
            link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm border-b-2 transition-colors ${
                active
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
