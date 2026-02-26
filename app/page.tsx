import Link from 'next/link';
import VenueCard from '@/components/VenueCard';
import { venues } from '@/lib/venues';

const offerings = [
  {
    title: 'Regular Walks',
    subtitle: 'Open to all',
    description:
      'Join a small group for a slow, attentive walk through the museum. No background needed — just curiosity.',
    detail: 'Free (museum ticket required)',
    href: '/contact?tourType=regular',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    title: 'Families & Couples',
    subtitle: 'Private experience',
    description:
      'A walk designed for you and your loved ones. Art becomes a shared language — a way to connect and discover together.',
    detail: 'Contact for details',
    href: '/contact?tourType=families-couples',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    title: 'Teambuilding',
    subtitle: 'For organizations',
    description:
      'Three sessions: one at your workplace, one in the museum, one back at work. Art as a catalyst for team connection and creative thinking.',
    detail: 'B2B packages available',
    href: '/contact?tourType=teambuilding',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero — muted, editorial */}
      <section className="relative h-[80vh] sm:h-[88vh] overflow-hidden -mt-16 sm:-mt-20">
        <img
          src="/venues/simian-langer.png"
          alt="Laura Langer, Why am I me?"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] mb-5 sm:mb-7">
              Attentive Art<br />
              Encounters
            </h1>
            <p className="text-white/70 text-base sm:text-lg md:text-xl font-light max-w-lg leading-relaxed opacity-0 animate-fade-in-delay">
              Not your usual art tour. Slower. More curious. More yours.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-in-delay">
              <Link
                href="#offerings"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide text-white border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-500"
              >
                Explore experiences
              </Link>
              <Link
                href="/about"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide text-white/50 hover:text-white transition-all duration-300"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings — the core product */}
      <section id="offerings" className="page-section">
        <div className="page-container">
          <div className="mb-12 sm:mb-16 max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">
              What we offer
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-4">
              Three ways to experience art
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-light leading-relaxed">
              Whether you come alone, with someone you love, or with your team — we design the walk around you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
            {offerings.map((offering) => (
              <Link
                key={offering.title}
                href={offering.href}
                className="group bg-white p-8 sm:p-10 flex flex-col hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="text-gray-300 group-hover:text-gray-900 transition-colors duration-300 mb-6">
                  {offering.icon}
                </div>
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">
                  {offering.subtitle}
                </p>
                <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 tracking-tight">
                  {offering.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                  {offering.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{offering.detail}</span>
                  <span className="text-sm text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="bg-gray-50 page-section">
        <div className="page-container">
          <div className="mb-12 sm:mb-16 max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">
              Where we walk
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-4">
              Four museums in Copenhagen
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-light leading-relaxed">
              Each with its own character, its own way of making you see.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {venues.map((venue, index) => (
              <VenueCard key={venue.slug} venue={venue} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="page-section">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6">
                The philosophy
              </p>
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 leading-relaxed tracking-tight mb-6">
                &ldquo;Many of us were taught that a museum is a place where you should be quiet. In these walks, I&rsquo;d like to offer something else.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-md">
                To come as you are. To ask questions, to disagree, to talk, to feel, and to feel OK about it. We walk slowly. We stop often. We leave space for whatever comes up.
              </p>
              <Link
                href="/about"
                className="inline-block text-sm text-gray-900 tracking-wide border-b border-gray-900 pb-0.5 hover:border-gray-400 hover:text-gray-500 transition-colors duration-300"
              >
                About Elad &amp; AAE
              </Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/venues/arken-rasmussen.jpg"
                alt="Kenneth Rasmussen installation at Arken"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="page-container py-20 sm:py-28 md:py-32 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-4">
            Ready to walk?
          </h2>
          <p className="text-base sm:text-lg text-white/50 font-light max-w-md mx-auto mb-10">
            Pick your experience, choose a museum, and let&rsquo;s meet in front of the art.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base tracking-wide text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-300"
          >
            Book a walk
          </Link>
        </div>
      </section>
    </main>
  );
}
