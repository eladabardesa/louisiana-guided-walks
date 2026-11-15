/**
 * Static venue helpers kept for client components that need sync access.
 * Server pages should prefer lib/content.ts (database-backed).
 */
export type Venue = {
  slug: string;
  name: string;
  shortName: string;
  heroImage: string;
  images: { src: string; alt: string }[];
  tagline: string;
  description: string;
};

export const venues: Venue[] = [
  {
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

export const tourTypes = [
  {
    id: 'regular',
    name: 'Regular Walk',
    description: 'Join a small group for an attentive walk through the museum. Open to all.',
    price: 'Free',
    note: 'Museum entrance ticket required',
  },
  {
    id: 'families-couples',
    name: 'Families & Couples',
    description: 'A private walk designed for you and your loved ones. A shared experience through art.',
    price: 'Contact for details',
    note: null,
  },
  {
    id: 'teambuilding',
    name: 'Teambuilding',
    description:
      'Three sessions — one at your workplace, one in the museum, one back at work. Art as a tool for team connection.',
    price: 'Contact for details',
    note: 'B2B packages available',
  },
] as const;

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}
