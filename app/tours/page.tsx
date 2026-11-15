import Link from 'next/link';
import type { Metadata } from 'next';
import { getActiveTours } from '@/lib/content';
import { formatPriceDkk, formatTourDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tours',
  description: 'Book an attentive art walk in Copenhagen. Choose a date and sign up online.',
};

export default async function ToursPage() {
  const tours = await getActiveTours();

  return (
    <main>
      <section className="page-section pt-28 sm:pt-32">
        <div className="page-container">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-4">
              Walks
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
              Pick a date if there is one. You can pay on the page. For a private walk or a team
              day, write to me.
            </p>
          </div>

          {tours.length === 0 ? (
            <div className="rounded-xl border border-gray-200 p-8 max-w-xl">
              <p className="text-gray-600 mb-4">
                No public tours are listed right now. Leave an inquiry and we&apos;ll help you find
                a time.
              </p>
              <Link href="/contact" className="text-sm underline">
                Contact us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {tours.map((tour) => {
                const nextDate = tour.dates[0];
                return (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="group rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                        {tour.venue?.shortName || tour.tourType.replace('_', ' ')}
                      </p>
                      <h2 className="text-xl font-light text-gray-900 mb-2">{tour.name}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {tour.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">
                          {tour.isB2B ? 'Contact for details' : formatPriceDkk(tour.price)}
                        </span>
                        <span className="text-gray-400">
                          {nextDate
                            ? formatTourDate(nextDate.startsAt, nextDate.language)
                            : tour.isB2B
                              ? 'Inquiry'
                              : 'Dates TBA'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
