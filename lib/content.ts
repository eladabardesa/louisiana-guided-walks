import { prisma } from '@/lib/prisma';
import { parseGalleryImages, type GalleryImage } from '@/lib/format';
import type { Tour, TourDate, Venue } from '@prisma/client';

export type VenueView = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  heroImage: string;
  images: GalleryImage[];
  tagline: string;
  description: string;
};

export type TourWithRelations = Tour & {
  venue: Venue | null;
  dates: TourDate[];
};

const FALLBACK_VENUES: VenueView[] = [
  {
    id: 'fallback-louisiana',
    slug: 'louisiana',
    name: 'Louisiana Museum of Modern Art',
    shortName: 'Louisiana',
    heroImage: '/venues/louisiana-basquiat.jpg',
    images: [
      { src: '/venues/louisiana-basquiat.jpg', alt: 'Jean-Michel Basquiat at Louisiana Museum' },
      { src: '/venues/louisiana-arbus.jpg', alt: 'Diane Arbus at Louisiana Museum' },
    ],
    tagline: '',
    description:
      'This is where the walks started. The walk is free. You need a museum ticket, unless you are a member.',
  },
  {
    id: 'fallback-arken',
    slug: 'arken',
    name: 'ARKEN Museum of Modern Art',
    shortName: 'Arken',
    heroImage: '/venues/arken-alqadiri.jpg',
    images: [
      { src: '/venues/arken-alqadiri.jpg', alt: 'Monira Al Qadiri, BENZENE FLOAT at Arken' },
      { src: '/venues/arken-rasmussen.jpg', alt: 'Kenneth Rasmussen installation at Arken' },
      { src: '/venues/arken-andersen.jpg', alt: "Villiam Miklos Andersen, Flora's Wagons of Fools at Arken" },
    ],
    tagline: '',
    description: 'We walk here too. You need a museum ticket, unless you are a member.',
  },
  {
    id: 'fallback-charlottenborg',
    slug: 'charlottenborg',
    name: 'Kunsthal Charlottenborg',
    shortName: 'Charlottenborg',
    heroImage: '/venues/charlottenborg-mirga-tas.png',
    images: [
      { src: '/venues/charlottenborg-mirga-tas.png', alt: 'Małgorzata Mirga-Tas at Kunsthal Charlottenborg' },
    ],
    tagline: '',
    description: 'We walk here too. You need a museum ticket, unless you are a member.',
  },
];

const now = new Date(0);

const FALLBACK_TOURS: TourWithRelations[] = [
  {
    id: 'fallback-regular',
    slug: 'regular-group-walk',
    name: 'A small group',
    description: 'The walk is free. You need a museum ticket, unless you are a member.',
    tourType: 'REGULAR',
    price: 0,
    capacity: 10,
    isActive: true,
    isB2B: false,
    heroImage: null,
    images: [],
    venueId: null,
    createdAt: now,
    updatedAt: now,
    venue: null,
    dates: [],
  },
  {
    id: 'fallback-families',
    slug: 'families-couples-walk',
    name: 'Families and couples',
    description: 'A private walk. Write to me and we will find a time.',
    tourType: 'FAMILIES_COUPLES',
    price: 0,
    capacity: null,
    isActive: true,
    isB2B: false,
    heroImage: null,
    images: [],
    venueId: null,
    createdAt: now,
    updatedAt: now,
    venue: null,
    dates: [],
  },
  {
    id: 'fallback-team',
    slug: 'teambuilding-package',
    name: 'A team',
    description: 'Three meetings: one where you work, one in the museum, one back at work.',
    tourType: 'TEAMBUILDING',
    price: 0,
    capacity: null,
    isActive: true,
    isB2B: true,
    heroImage: null,
    images: [],
    venueId: null,
    createdAt: now,
    updatedAt: now,
    venue: null,
    dates: [],
  },
];

function toVenueView(venue: Venue): VenueView {
  return {
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    shortName: venue.shortName,
    heroImage: venue.heroImage,
    images: parseGalleryImages(venue.images),
    tagline: venue.tagline,
    description: venue.description,
  };
}

export async function getActiveVenues(): Promise<VenueView[]> {
  try {
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (venues.length === 0) return FALLBACK_VENUES;
    return venues.map(toVenueView);
  } catch {
    return FALLBACK_VENUES;
  }
}

export async function getVenueBySlug(slug: string): Promise<VenueView | null> {
  try {
    const venue = await prisma.venue.findFirst({
      where: { slug, isActive: true },
    });
    if (venue) return toVenueView(venue);
  } catch {
    // fall through
  }
  return FALLBACK_VENUES.find((v) => v.slug === slug) || null;
}

export async function getActiveTours(options?: {
  venueSlug?: string;
  includePastDates?: boolean;
}): Promise<TourWithRelations[]> {
  const now = new Date();
  try {
    return await prisma.tour.findMany({
      where: {
        isActive: true,
        ...(options?.venueSlug
          ? { venue: { slug: options.venueSlug, isActive: true } }
          : {}),
      },
      include: {
        venue: true,
        dates: {
          where: {
            isActive: true,
            ...(options?.includePastDates ? {} : { startsAt: { gte: now } }),
          },
          orderBy: { startsAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return FALLBACK_TOURS;
  }
}

export async function getTourBySlug(slug: string): Promise<TourWithRelations | null> {
  const now = new Date();
  try {
    return await prisma.tour.findFirst({
      where: { slug, isActive: true },
      include: {
        venue: true,
        dates: {
          where: { isActive: true, startsAt: { gte: now } },
          orderBy: { startsAt: 'asc' },
        },
      },
    });
  } catch {
    return FALLBACK_TOURS.find((tour) => tour.slug === slug) || null;
  }
}

export async function getSiteContentMap(keys?: string[]): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany({
      where: keys ? { key: { in: keys } } : undefined,
    });
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export async function getBookedSeats(tourDateId: string): Promise<number> {
  const result = await prisma.order.aggregate({
    where: {
      tourDateId,
      status: { in: ['PENDING', 'PAID'] },
    },
    _sum: { quantity: true },
  });
  return result._sum.quantity || 0;
}
