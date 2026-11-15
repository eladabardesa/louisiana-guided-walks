import Link from 'next/link';
import type { Venue } from '@/lib/venues';

type VenueCardProps = {
  venue: Venue;
  priority?: boolean;
};

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="block rounded-xl border border-black/10 bg-white p-6 hover:border-black/30 transition-colors"
    >
      <h3 className="text-xl font-normal text-gray-900">{venue.shortName}</h3>
    </Link>
  );
}
