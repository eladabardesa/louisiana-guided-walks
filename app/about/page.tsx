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

      <section className="page-section pt-0">
        <div className="page-container">
          <Link
            href="/contact"
            className="inline-block rounded-lg px-6 py-3 text-sm text-white bg-[#102033] hover:bg-[#1a3348]"
          >
            Write to me
          </Link>
        </div>
      </section>
    </main>
  );
}
