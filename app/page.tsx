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
          src="/general-hero.jpeg"
          alt="Art projection in a dark museum space"
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

      {/* Image strip — real walk moments */}
      <section className="py-4 sm:py-6">
        <div className="page-container">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/general-group.jpeg"
                alt="A group watching a video installation during an AAE walk"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/general-sculpture.jpeg"
                alt="Outdoor sculpture in snow"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/general-materials.jpeg"
                alt="AAE walk materials and booklets"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
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
              Three museums in Copenhagen
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

      {/* Reviews */}
      <section className="page-section">
        <div className="page-container">
          <div className="mb-12 sm:mb-16 max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">
              What people say
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-4">
              From our walkers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">
                &ldquo;A truly unique experience. Elad has a gift for making you see art in a completely new way. I left feeling like I&rsquo;d actually been somewhere, not just looked at things.&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-gray-400">Google Review</p>
            </div>

            <div className="flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">
                &ldquo;The best thing I&rsquo;ve done in Copenhagen in months. It&rsquo;s not a lecture, it&rsquo;s a conversation. Elad creates a space where you feel comfortable sharing what you actually think and feel.&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-gray-400">Google Review</p>
            </div>

            <div className="flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">
                &ldquo;We did the teambuilding format with our team. The combination of art and honest conversation was powerful. People opened up in ways they never do at the office.&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-gray-400">Google Review</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://www.google.com/search?q=aae+attentive+art+encounters+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              See all reviews on Google
            </a>
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
                src="/elad-guiding.jpeg"
                alt="Elad guiding a group through art"
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
