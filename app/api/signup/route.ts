import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedDate, ticketQuantity, fullName, email, phone, note, newsletter } = body;

    // Basic validation
    if (!selectedDate || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ticket quantity
    const quantity = parseInt(ticketQuantity) || 1;
    if (quantity < 1 || quantity > 2) {
      return NextResponse.json(
        { error: 'Ticket quantity must be between 1 and 2' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check availability before saving
    const tourId = selectedDate.includes('Pilot walk #1') ? 'walk-1' : selectedDate.includes('Pilot walk #2') ? 'walk-2' : '';
    if (tourId) {
      // Count current tickets sold for this tour
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

      if (available < quantity) {
        return NextResponse.json(
          { error: `Only ${available} ticket(s) available` },
          { status: 400 }
        );
      }
    }

    // Save to database
    const submission = await prisma.submission.create({
      data: {
        selectedDate,
        ticketQuantity: quantity,
        fullName,
        email,
        phone,
        note: note || null,
        newsletter: Boolean(newsletter),
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    // Log more details for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error message:', errorMessage);
    if (errorStack) {
      console.error('Error stack:', errorStack);
    }
    
    // Check for common database connection errors
    if (errorMessage.includes('Can\'t reach database') || errorMessage.includes('P1001')) {
      console.error('Database connection failed. Check DATABASE_URL in .env');
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to save submission', 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}
