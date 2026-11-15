import { NextRequest, NextResponse } from 'next/server';
import { TourType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/format';

const TOUR_TYPES = new Set(Object.values(TourType));

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: {
      venue: true,
      dates: { orderBy: { startsAt: 'asc' } },
      orders: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });

  if (!tour) {
    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  }

  return NextResponse.json(tour);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const name = String(body.name || '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const tourType = String(body.tourType || 'REGULAR') as TourType;
  if (!TOUR_TYPES.has(tourType)) {
    return NextResponse.json({ error: 'Invalid tour type' }, { status: 400 });
  }

  const priceDkk = Number(body.priceDkk);
  const price = Number.isFinite(priceDkk) ? Math.round(priceDkk * 100) : Number(body.price) || 0;

  try {
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        name,
        slug: String(body.slug || slugify(name)),
        description: body.description ? String(body.description) : null,
        tourType,
        price,
        capacity: body.capacity === '' || body.capacity == null ? null : Number(body.capacity),
        isActive: Boolean(body.isActive),
        isB2B: Boolean(body.isB2B),
        heroImage: body.heroImage ? String(body.heroImage) : null,
        images: Array.isArray(body.images) ? body.images : [],
        venueId: body.venueId || null,
      },
      include: { venue: true, dates: { orderBy: { startsAt: 'asc' } } },
    });
    return NextResponse.json(tour);
  } catch {
    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    await prisma.tour.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  }
}
