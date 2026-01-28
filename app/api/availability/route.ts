import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    // Count tickets sold for this tour
    // Tour IDs are stored as "walk-1" or "walk-2" in selectedDate field
    const ticketsSold = await prisma.submission.aggregate({
      where: {
        selectedDate: {
          startsWith: tourId === 'walk-1' ? 'Pilot walk #1' : 'Pilot walk #2',
        },
      },
      _sum: {
        ticketQuantity: true,
      },
    });

    const totalSold = ticketsSold._sum.ticketQuantity || 0;
    const maxTickets = 10;
    const available = Math.max(0, maxTickets - totalSold);
    const isSoldOut = available === 0;

    return NextResponse.json({
      tourId,
      totalSold,
      available,
      maxTickets,
      isSoldOut,
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
