import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const regularWalk = await prisma.product.upsert({
    where: { id: 'regular-walk-1' },
    update: {},
    create: {
      id: 'regular-walk-1',
      name: 'Regular Group Walk',
      description: 'Join a small group for an attentive walk through the museum. Open to all.',
      tourType: 'REGULAR',
      price: 0, // Free, but museum ticket required
      capacity: 10,
      isActive: true,
      isB2B: false,
    },
  });

  const familiesCouples = await prisma.product.upsert({
    where: { id: 'families-couples-1' },
    update: {},
    create: {
      id: 'families-couples-1',
      name: 'Exclusive Walk for Families & Couples',
      description: 'A private walk designed to help you connect with your loved ones through art. Perfect for couples wanting to deepen their relationship or families where not everyone is initially excited about museums.',
      tourType: 'FAMILIES_COUPLES',
      price: 50000, // 500 DKK in øre - adjust as needed
      capacity: null, // Private, no capacity limit
      isActive: true,
      isB2B: false,
    },
  });

  const teambuilding = await prisma.product.upsert({
    where: { id: 'teambuilding-1' },
    update: {},
    create: {
      id: 'teambuilding-1',
      name: 'Teambuilding Package',
      description: 'B2B package: One meeting at your workplace, one walk at the museum, and one final meeting back at work. Designed to strengthen team connections through art.',
      tourType: 'TEAMBUILDING',
      price: 0, // Contact for pricing
      capacity: null,
      isActive: true,
      isB2B: true,
    },
  });

  console.log('Seeded products:', { regularWalk, familiesCouples, teambuilding });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
