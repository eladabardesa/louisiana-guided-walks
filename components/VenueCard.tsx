import Link from 'next/link';
import type { Venue } from '@/lib/venues';

type VenueCardProps = {
  venue: Venue;
  priority?: boolean;
};

export default function VenueCard({ venue, priority = false }: VenueCardProps) {
  return (
    <Link href={`/venues/${venue.slug}`} className="venue-card block group">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={venue.heroImage}
          alt={`Artwork at ${venue.name}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
        />
        <div className="venue-card-content">
          <h3 className="venue-name">{venue.shortName}</h3>
          <p className="venue-tagline">{venue.tagline}</p>
        </div>
      </div>
    </Link>
  );
}
