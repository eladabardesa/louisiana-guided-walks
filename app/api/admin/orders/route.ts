import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const orders = await prisma.order.findMany({
    include: {
      tour: { include: { venue: true } },
      tourDate: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json(orders);
}
