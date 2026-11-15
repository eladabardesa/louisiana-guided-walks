'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <body className={isAdmin ? '' : 'pt-16 sm:pt-20'}>
      {!isAdmin && <Header />}
      <div className="min-h-screen">{children}</div>
      {!isAdmin && <Footer />}
    </body>
  );
}
