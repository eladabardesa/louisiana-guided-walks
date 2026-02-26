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
    tagline: 'Where the sea meets art',
    description:
      'Louisiana is where I first understood that a museum could feel like home. We walk through galleries that open onto the sea, letting the art and the landscape talk to each other. Here, the conversation between inside and outside becomes part of the experience itself.',
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
    tagline: 'Bold architecture, bold art',
    description:
      'Arken\'s striking building is an artwork in itself. Inside, the exhibitions push boundaries and invite strong reactions. Our walks here embrace that intensity — we slow down in a space that dares to be loud, and find the quiet moments within it.',
  },
  {
    slug: 'simian',
    name: 'Simian',
    shortName: 'Simian',
    heroImage: '/venues/simian-xenakis.png',
    images: [
      { src: '/venues/simian-xenakis.png', alt: "Iannis Xenakis, La Légende d'Eer at Simian" },
      { src: '/venues/simian-extended-views.png', alt: 'Extended Views II at Simian' },
      { src: '/venues/simian-langer.png', alt: 'Laura Langer, Why am I me? at Simian' },
    ],
    tagline: 'Art at the edge',
    description:
      'Simian is a space where experimental art meets raw curiosity. The work shown here often resists easy interpretation — and that\'s exactly what makes our walks so rewarding. We sit with the unfamiliar and let it speak to us in its own time.',
  },
  {
    slug: 'charlottenborg',
    name: 'Kunsthal Charlottenborg',
    shortName: 'Charlottenborg',
    heroImage: '/venues/charlottenborg-mirga-tas.png',
    images: [
      { src: '/venues/charlottenborg-mirga-tas.png', alt: 'Małgorzata Mirga-Tas at Kunsthal Charlottenborg' },
    ],
    tagline: 'Contemporary art in the heart of Copenhagen',
    description:
      'Charlottenborg sits between Nyhavn and Kongens Nytorv, and its exhibitions are always current, always provocative. Walking here, we engage with art that speaks directly to the world we live in now — the questions it raises are the ones we carry with us when we leave.',
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
    description: 'Three sessions — one at your workplace, one in the museum, one back at work. Art as a tool for team connection.',
    price: 'Contact for details',
    note: 'B2B packages available',
  },
] as const;

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}
