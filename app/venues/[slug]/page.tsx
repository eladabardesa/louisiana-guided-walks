import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getActiveTours, getVenueBySlug } from '@/lib/content';
import { formatPriceDkk } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venue = await getVenueBySlug(params.slug);
  if (!venue) return {};

  return {
    title: venue.name,
    description: `Walks with Elad at ${venue.name}.`,
  };
}

export default async function VenuePage({ params }: Props) {
  const venue = await getVenueBySlug(params.slug);
  if (!venue) notFound();

  const tours = await getActiveTours({ venueSlug: venue.slug });
  const allTours = tours.length > 0 ? tours : await getActiveTours();

  return (
    <main>
      <section className="page-section pb-0">
        <div className="page-container">
          <div className="max-w-2xl">
            <h1 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              {venue.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              {venue.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 page-section">
        <div className="page-container">
          <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-6">
            The walks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {allTours.slice(0, 3).map((tour) => (
              <div key={tour.id} className="rounded-xl bg-white p-6 sm:p-8 border border-gray-200">
                <h3 className="text-lg font-normal text-gray-900 mb-2">{tour.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {tour.description}
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-medium text-gray-900">
                    {tour.isB2B ? 'Contact for details' : formatPriceDkk(tour.price)}
                  </p>
                  <Link
                    href={tour.isB2B ? '/contact?tourType=teambuilding' : `/tours/${tour.slug}`}
                    className="inline-block mt-4 text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-400"
                  >
                    {tour.isB2B ? 'Inquire' : 'Book'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
