import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import { getTourBySlug } from '@/lib/content';
import { formatPriceDkk, formatTourDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug);
  if (!tour) return {};
  return {
    title: tour.name,
    description: tour.description || undefined,
  };
}

export default async function TourDetailPage({ params }: Props) {
  const tour = await getTourBySlug(params.slug);
  if (!tour) notFound();

  const priceLabel = tour.isB2B ? 'Contact for details' : formatPriceDkk(tour.price);
  const requiresDate = tour.tourType === 'REGULAR';

  return (
    <main>
      <section className="page-section pb-0">
        <div className="page-container">
          <p className="text-gray-400 text-xs tracking-[0.25em] uppercase mb-3">
            {tour.venue?.name || 'Attentive Art Encounters'}
          </p>
          <h1 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            {tour.name}
          </h1>
          <p className="text-gray-500 mt-3 text-base sm:text-lg">{priceLabel}</p>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            {tour.description && (
              <p className="text-lg sm:text-xl font-light text-gray-900 leading-relaxed mb-8">
                {tour.description}
              </p>
            )}

            {tour.dates.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                  Upcoming dates
                </h2>
                <ul className="space-y-2">
                  {tour.dates.map((date) => (
                    <li key={date.id} className="text-sm text-gray-700 border-b border-gray-100 py-2">
                      {date.label || formatTourDate(date.startsAt, date.language)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <div className="lg:col-span-2">
            <BookingForm
              tourId={tour.id}
              tourSlug={tour.slug}
              tourName={tour.name}
              price={tour.price}
              priceLabel={priceLabel}
              isB2B={tour.isB2B}
              requiresDate={requiresDate}
              dates={tour.dates.map((d) => ({
                id: d.id,
                startsAt: d.startsAt.toISOString(),
                label: d.label || formatTourDate(d.startsAt, d.language),
              }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
