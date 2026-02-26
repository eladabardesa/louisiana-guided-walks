import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Elad and the philosophy behind Attentive Art Encounters in Copenhagen.',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero — Elad guiding */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden -mt-16 sm:-mt-20">
        <img
          src="/elad-guiding.jpeg"
          alt="Elad guiding a group"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20">
          <div className="animate-fade-in">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              About
            </h1>
          </div>
        </div>
      </section>

      {/* About me — with portrait */}
      <section className="page-section">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6">
                Meet Elad
              </p>
              <div className="space-y-5 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  Art has always been a big part of my life &mdash; cinema, music, theatre, literature, visual art.
                  I honestly can&rsquo;t imagine a day without it.
                </p>
                <p>
                  Over the years I&rsquo;ve worked as an art educator in many forms &mdash; with kids, tourists, and adults, in museums, workplaces, and living rooms. A special mission for me has been to find a way into art with people who are not used to it, people who might usually choose something else.
                </p>
                <p>
                  Living in Copenhagen, so close to some of the world&rsquo;s most remarkable museums, feels like a gift.
                  These walks are my way of sharing it.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src="/elad-portrait.jpeg"
                  alt="Elad Bardes"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The walk philosophy */}
      <section className="bg-gray-50 page-section">
        <div className="page-container">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6">
              The philosophy
            </p>
            <div className="space-y-5 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              <p>
                A museum, for me, is a place of freedom.
                Of expression, emotions, and intellect.
                A place that raises questions, challenges what we think we already know, puts up a mirror, shows beauty and ugliness side by side, and lets us see the world through the eyes of artists and curators.
              </p>
              <p>
                And still, many of us were taught that a museum is a place where you should be quiet.
                Where you don&rsquo;t really speak.
                Where the masters know better than you.
              </p>
              <p>
                In these walks, I&rsquo;d like to offer something else.
                To come as you are.
                To ask questions, to disagree, to talk, to feel, and to feel OK about it.
              </p>
              <p>
                We walk slowly.
                We stop often.
                We leave space for conversation, silence, and whatever comes up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image break — artworks */}
      <section className="py-4 sm:py-8">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/venues/arken-rasmussen.jpg"
                alt="Kenneth Rasmussen installation at Arken"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src="/venues/simian-xenakis.png"
                alt="Iannis Xenakis at Simian"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="page-section">
        <div className="page-container">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6">
            What we offer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Regular walks</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Join a small group for an attentive walk through the museum. Open to all. The walk itself is free of charge &mdash; a regular museum entrance ticket is required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Families &amp; couples</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A private walk designed for you and your loved ones. A shared experience through art, tailored to your group.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Teambuilding</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Three sessions &mdash; one at your workplace, one in the museum, one back at work. Art as a tool for team connection and creative thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="page-container py-20 sm:py-28 text-center">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-4">
            Let&rsquo;s walk together
          </h2>
          <p className="text-base text-white/50 font-light max-w-md mx-auto mb-8">
            Whether it&rsquo;s your first time in a museum or your hundredth, you&rsquo;re welcome here.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base tracking-wide text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-300"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
