import { NextRequest, NextResponse } from 'next/server';
import { TourType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/format';

const TOUR_TYPES = new Set(Object.values(TourType));

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const tours = await prisma.tour.findMany({
    include: {
      venue: true,
      dates: { orderBy: { startsAt: 'asc' } },
      _count: { select: { orders: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(tours);
}

export async function POST(request: NextRequest) {
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

  const tour = await prisma.tour.create({
    data: {
      name,
      slug: String(body.slug || slugify(name)),
      description: body.description ? String(body.description) : null,
      tourType,
      price,
      capacity: body.capacity === '' || body.capacity == null ? null : Number(body.capacity),
      isActive: body.isActive !== false,
      isB2B: Boolean(body.isB2B),
      heroImage: body.heroImage ? String(body.heroImage) : null,
      images: Array.isArray(body.images) ? body.images : [],
      venueId: body.venueId || null,
    },
    include: { venue: true, dates: true },
  });

  return NextResponse.json(tour, { status: 201 });
}
