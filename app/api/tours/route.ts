import { NextRequest, NextResponse } from 'next/server';
import { getActiveTours } from '@/lib/content';
import { formatPriceDkk, formatTourDate, parseGalleryImages } from '@/lib/format';

export async function GET(request: NextRequest) {
  const venueSlug = request.nextUrl.searchParams.get('venue') || undefined;
  const tours = await getActiveTours({ venueSlug });

  return NextResponse.json(
    tours.map((tour) => ({
      id: tour.id,
      slug: tour.slug,
      name: tour.name,
      description: tour.description,
      tourType: tour.tourType,
      price: tour.price,
      priceLabel: tour.isB2B ? 'Contact for details' : formatPriceDkk(tour.price),
      capacity: tour.capacity,
      isB2B: tour.isB2B,
      heroImage: tour.heroImage,
      images: parseGalleryImages(tour.images),
      venue: tour.venue
        ? {
            slug: tour.venue.slug,
            name: tour.venue.name,
            shortName: tour.venue.shortName,
          }
        : null,
      dates: tour.dates.map((d) => ({
        id: d.id,
        startsAt: d.startsAt,
        label: d.label || formatTourDate(d.startsAt, d.language),
        language: d.language,
        capacity: d.capacity,
      })),
    }))
  );
}
