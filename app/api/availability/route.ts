import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBookedSeats } from '@/lib/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourDateId = searchParams.get('tourDateId');

    if (!tourDateId) {
      return NextResponse.json({ error: 'tourDateId is required' }, { status: 400 });
    }

    const tourDate = await prisma.tourDate.findUnique({
      where: { id: tourDateId },
      include: { tour: true },
    });

    if (!tourDate || !tourDate.isActive || !tourDate.tour.isActive) {
      return NextResponse.json({ error: 'Date not found' }, { status: 404 });
    }

    const maxTickets = tourDate.capacity ?? tourDate.tour.capacity ?? null;
    const totalSold = await getBookedSeats(tourDateId);
    const available = maxTickets == null ? null : Math.max(0, maxTickets - totalSold);

    return NextResponse.json({
      tourDateId,
      totalSold,
      available,
      maxTickets,
      isSoldOut: available === 0,
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
