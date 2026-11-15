import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

type Params = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const tour = await prisma.tour.findUnique({ where: { id: params.id } });
  if (!tour) {
    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  }

  const body = await request.json();
  const startsAt = new Date(body.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: 'Valid startsAt is required' }, { status: 400 });
  }

  const date = await prisma.tourDate.create({
    data: {
      tourId: params.id,
      startsAt,
      label: body.label ? String(body.label) : null,
      language: body.language ? String(body.language) : null,
      capacity: body.capacity === '' || body.capacity == null ? null : Number(body.capacity),
      isActive: body.isActive !== false,
    },
  });

  return NextResponse.json(date, { status: 201 });
}
