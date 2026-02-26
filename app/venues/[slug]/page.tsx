import { notFound } from 'next/navigation';
import Link from 'next/link';
import { venues, getVenueBySlug, tourTypes } from '@/lib/venues';
import ImageGallery from '@/components/ImageGallery';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return {};

  return {
    title: venue.name,
    description: `Attentive art walks at ${venue.name}. ${venue.tagline}.`,
  };
}

export default function VenuePage({ params }: Props) {
  const venue = getVenueBySlug(params.slug);

  if (!venue) {
    notFound();
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden -mt-16 sm:-mt-20">
        <img
          src={venue.heroImage}
          alt={`Artwork at ${venue.name}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-3">
              AAE at
            </p>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              {venue.name}
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light mt-3">
              {venue.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="page-section">
        <div className="page-container">
          <div className="max-w-2xl">
            <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 leading-relaxed">
              {venue.description}
            </p>
          </div>
        </div>
      </section>

      {/* Image gallery */}
      {venue.images.length > 1 && (
        <section className="pb-16 sm:pb-20 md:pb-24">
          <div className="page-container">
            <ImageGallery images={venue.images} />
          </div>
        </section>
      )}

      {/* Tour types */}
      <section className="bg-gray-50 page-section">
        <div className="page-container">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-3">
            Choose your experience
          </h2>
          <p className="text-base text-gray-500 font-light mb-10 sm:mb-14 max-w-lg">
            Every walk can be tailored. Here are the formats we offer at {venue.shortName}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {tourTypes.map((tour) => (
              <div
                key={tour.id}
                className="bg-white p-6 sm:p-8 border border-gray-200"
              >
                <h3 className="text-lg font-normal text-gray-900 mb-2">
                  {tour.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {tour.description}
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-medium text-gray-900">{tour.price}</p>
                  {tour.note && (
                    <p className="text-xs text-gray-400 mt-1">{tour.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 text-center">
            <Link
              href={`/contact?venue=${venue.slug}`}
              className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base tracking-wide text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
            >
              Book a walk at {venue.shortName}
            </Link>
          </div>
        </div>
      </section>

      {/* Other venues */}
      <section className="page-section">
        <div className="page-container">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-gray-900 mb-8 sm:mb-10">
            Explore other venues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {venues
              .filter((v) => v.slug !== venue.slug)
              .map((v) => (
                <Link
                  key={v.slug}
                  href={`/venues/${v.slug}`}
                  className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-gray-100"
                >
                  <img
                    src={v.heroImage}
                    alt={`Artwork at ${v.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-white text-lg sm:text-xl font-light" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                      {v.shortName}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
