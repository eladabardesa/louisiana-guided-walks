import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const startsAt = new Date(body.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: 'Valid startsAt is required' }, { status: 400 });
  }

  try {
    const date = await prisma.tourDate.update({
      where: { id: params.id },
      data: {
        startsAt,
        label: body.label ? String(body.label) : null,
        language: body.language ? String(body.language) : null,
        capacity: body.capacity === '' || body.capacity == null ? null : Number(body.capacity),
        isActive: Boolean(body.isActive),
      },
    });
    return NextResponse.json(date);
  } catch {
    return NextResponse.json({ error: 'Date not found' }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    await prisma.tourDate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Date not found' }, { status: 404 });
  }
}
