import { PrismaClient, TourType } from '@prisma/client';

const prisma = new PrismaClient();

const venues = [
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
    sortOrder: 1,
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
    sortOrder: 2,
  },
  {
    slug: 'charlottenborg',
    name: 'Kunsthal Charlottenborg',
    shortName: 'Charlottenborg',
    heroImage: '/venues/charlottenborg-mirga-tas.png',
    images: [
      {
        src: '/venues/charlottenborg-mirga-tas.png',
        alt: 'Małgorzata Mirga-Tas at Kunsthal Charlottenborg',
      },
    ],
    tagline: '',
    description: 'We walk here too. You need a museum ticket, unless you are a member.',
    sortOrder: 3,
  },
];

const siteContent = [
  {
    key: 'home.hero.title',
    label: 'Home hero title',
    value: 'Attentive Art\nEncounters',
  },
  {
    key: 'home.hero.subtitle',
    label: 'Home hero paragraph',
    value:
      'To come as you are. To ask questions, to disagree, to talk, to feel, and to feel OK about it. We walk slowly. We stop often. We leave space for whatever comes up.',
  },
  {
    key: 'home.offerings.intro',
    label: 'Home offerings intro',
    value:
      'Whether you come alone, with someone you love, or with your team — we design the walk around you.',
  },
  {
    key: 'home.cta.title',
    label: 'Home CTA title',
    value: 'Ready to walk?',
  },
  {
    key: 'home.cta.subtitle',
    label: 'Home CTA subtitle',
    value: "Pick your experience, choose a museum, and let's meet in front of the art.",
  },
  {
    key: 'about.intro',
    label: 'About intro paragraphs (separate with blank line)',
    value: `Art has always been a big part of my life — cinema, music, theatre, literature, visual art. I honestly can't imagine a day without it.

Over the years I've worked as an art educator in many forms — with kids, tourists, and adults, in museums, workplaces, and living rooms. A special mission for me has been to find a way into art with people who are not used to it, people who might usually choose something else.

Living in Copenhagen, so close to some of the world's most remarkable museums, feels like a gift. These walks are my way of sharing it.`,
  },
];

async function main() {
  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: {
        name: venue.name,
        shortName: venue.shortName,
        heroImage: venue.heroImage,
        images: venue.images,
        tagline: venue.tagline,
        description: venue.description,
        sortOrder: venue.sortOrder,
        isActive: true,
      },
      create: venue,
    });
  }

  for (const item of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value, label: item.label },
      create: item,
    });
  }

  const louisiana = await prisma.venue.findUnique({ where: { slug: 'louisiana' } });

  const regular = await prisma.tour.upsert({
    where: { slug: 'regular-group-walk' },
    update: {},
    create: {
      slug: 'regular-group-walk',
      name: 'Regular Group Walk',
      description:
        'Join a small group for an attentive walk through the museum. Open to all. Museum entrance ticket required.',
      tourType: TourType.REGULAR,
      price: 0,
      capacity: 10,
      isActive: true,
      isB2B: false,
      heroImage: '/general-group.jpeg',
      venueId: louisiana?.id,
      images: [{ src: '/general-group.jpeg', alt: 'Group during an AAE walk' }],
    },
  });

  await prisma.tour.upsert({
    where: { slug: 'families-couples-walk' },
    update: {},
    create: {
      slug: 'families-couples-walk',
      name: 'Exclusive Walk for Families & Couples',
      description:
        'A private walk designed to help you connect with your loved ones through art.',
      tourType: TourType.FAMILIES_COUPLES,
      price: 50000,
      capacity: null,
      isActive: true,
      isB2B: false,
      heroImage: '/general-sculpture.jpeg',
      venueId: louisiana?.id,
    },
  });

  await prisma.tour.upsert({
    where: { slug: 'teambuilding-package' },
    update: {},
    create: {
      slug: 'teambuilding-package',
      name: 'Teambuilding Package',
      description:
        'B2B package: one meeting at your workplace, one walk at the museum, and one final meeting back at work.',
      tourType: TourType.TEAMBUILDING,
      price: 0,
      capacity: null,
      isActive: true,
      isB2B: true,
      heroImage: '/general-materials.jpeg',
    },
  });

  const existingDates = await prisma.tourDate.count({ where: { tourId: regular.id } });
  if (existingDates === 0) {
    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
    inTwoWeeks.setHours(14, 0, 0, 0);

    const inThreeWeeks = new Date();
    inThreeWeeks.setDate(inThreeWeeks.getDate() + 21);
    inThreeWeeks.setHours(11, 0, 0, 0);

    await prisma.tourDate.createMany({
      data: [
        {
          tourId: regular.id,
          startsAt: inTwoWeeks,
          language: 'English',
          capacity: 10,
        },
        {
          tourId: regular.id,
          startsAt: inThreeWeeks,
          language: 'English',
          capacity: 10,
        },
      ],
    });
  }

  console.log('Seed complete: venues, site content, and sample tours.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
