import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/format';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const name = String(body.name || '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const venue = await prisma.venue.update({
      where: { id: params.id },
      data: {
        name,
        slug: String(body.slug || slugify(name)),
        shortName: String(body.shortName || name).trim(),
        tagline: String(body.tagline || '').trim(),
        description: String(body.description || '').trim(),
        heroImage: String(body.heroImage || '').trim(),
        images: Array.isArray(body.images) ? body.images : [],
        sortOrder: Number(body.sortOrder) || 0,
        isActive: Boolean(body.isActive),
      },
    });
    return NextResponse.json(venue);
  } catch {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    await prisma.venue.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  }
}
