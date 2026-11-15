import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Elad and the philosophy behind Attentive Art Encounters in Copenhagen.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-section">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">About me</h2>
              <div className="space-y-5 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  Art has always been a big part of my life &mdash; cinema, music, theatre, literature, visual art.
                  I honestly can&rsquo;t imagine a day without it.
                </p>
                <p>
                  Over the years I&rsquo;ve worked as an art educator in many forms &mdash; with kids, tourists, and adults, in museums, workplaces, and living rooms. A special mission for me has been to find a way into art with people who are not used to it, people who might usually choose something else.
                </p>
                <p>
                  Living so close to Louisiana feels like a gift. These walks are my way of sharing it.
                  We also walk at Arken and Charlottenborg.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
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
      <section className="page-section border-t border-black/10">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">About the walk</h2>
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
                We&rsquo;ll walk slowly.
                We&rsquo;ll stop often.
                We&rsquo;ll leave space for conversation, silence, and whatever comes up.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="page-container">
          <Link
            href="/tours"
            className="inline-block rounded-lg px-6 py-3 text-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            Book a walk
          </Link>
        </div>
      </section>
    </main>
  );
}
