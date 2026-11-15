import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/format';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const venues = await prisma.venue.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(venues);
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const name = String(body.name || '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const slug = String(body.slug || slugify(name));
  const venue = await prisma.venue.create({
    data: {
      name,
      slug,
      shortName: String(body.shortName || name).trim(),
      tagline: String(body.tagline || '').trim(),
      description: String(body.description || '').trim(),
      heroImage: String(body.heroImage || '/general-hero.jpeg').trim(),
      images: Array.isArray(body.images) ? body.images : [],
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive !== false,
    },
  });

  return NextResponse.json(venue, { status: 201 });
}
