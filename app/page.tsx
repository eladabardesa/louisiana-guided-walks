import Link from 'next/link';
import VenueCard from '@/components/VenueCard';
import { getActiveTours, getActiveVenues } from '@/lib/content';

export const dynamic = 'force-dynamic';

const offeringMeta = [
  {
    tourType: 'REGULAR',
    slug: 'regular-group-walk',
    title: 'A small group',
    fallbackDescription:
      'The walk is free. You need a museum ticket, unless you are a member.',
  },
  {
    tourType: 'FAMILIES_COUPLES',
    slug: 'families-couples-walk',
    title: 'Families and couples',
    fallbackDescription: 'A private walk. Write to me and we will find a time.',
  },
  {
    tourType: 'TEAMBUILDING',
    slug: 'teambuilding-package',
    title: 'A team',
    fallbackDescription:
      'Three meetings: one where you work, one in the museum, one back at work.',
  },
] as const;

export default async function Home() {
  const [venues, tours] = await Promise.all([getActiveVenues(), getActiveTours()]);

  const offerings = offeringMeta.map((meta) => {
    const match = tours.find((t) => t.tourType === meta.tourType);
    return {
      ...meta,
      description: meta.fallbackDescription,
      href: `/tours/${match?.slug || meta.slug}`,
    };
  });

  return (
    <main>
      <section className="page-section pb-0">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-7 max-w-2xl">
              <h1 className="text-gray-900 text-4xl sm:text-5xl font-light tracking-tight leading-[1.08] mb-6">
                Attentive Art
                <br />
                Encounters
              </h1>
              <div className="space-y-4 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  I&rsquo;m inviting you to walk with me in the museum. We&rsquo;ll take time to look,
                  to listen, to be with the artworks, and to see what happens when they look back.
                </p>
                <p>The walks are at Louisiana, Arken, and Charlottenborg.</p>
              </div>
            </div>
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guitar.png" alt="" className="w-full max-w-md h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">How you can come</h2>
            <div className="space-y-3">
              {offerings.map((offering) => (
                <Link
                  key={offering.title}
                  href={offering.href}
                  className="block rounded-xl border border-black/10 bg-white px-5 py-4 hover:border-black/30 transition-colors"
                >
                  <p className="text-gray-900">{offering.title}</p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{offering.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">Where</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {venues.map((venue) => (
                <VenueCard key={venue.slug} venue={venue} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">What people wrote</h2>
          <div className="space-y-6">
            {[
              {
                quote:
                  'The guided art walk through New Works at the Louisiana Museum of Modern Art on 10 February 2026 with Elad Bardes felt less like a conventional museum tour and more like a shared act of looking. Rather than searching for the ‘correct’ interpretation, the exercises prompted us to notice details, observe our reactions, and reflect on how a work affects us personally.',
                author: 'Marina Scandi · Google Review',
              },
              {
                quote:
                  'I would dare to say that this museum walk changed the way I approach art. Before this tour, I perceived a museum as a place where you have to study, focusing mainly on reading every single explanation for each artwork rather than engaging with the art itself. This experience, however, was the complete opposite - for the first time, visiting a museum actually felt like entertainment.',
                author: 'Chebumashka · Google Review',
              },
              {
                quote:
                  'I joined Elad on a tour in Louisiana, and he is a thoughtful guide who brings great sensitivity, knowledge, and openness. His engaging insights and guidance help create a meaningful and personal dialogue with the art exhibits.',
                author: 'Gili Y · Google Review',
              },
            ].map((review) => (
              <div key={review.author} className="flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-xs text-gray-400">{review.author}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
