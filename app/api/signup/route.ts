import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedDate, ticketQuantity, fullName, email, phone, note, newsletter, venue, tourType } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const quantity = parseInt(ticketQuantity) || 1;

    const submission = await prisma.submission.create({
      data: {
        selectedDate: selectedDate || 'N/A',
        ticketQuantity: quantity,
        fullName,
        email,
        phone,
        note: note || null,
        newsletter: Boolean(newsletter),
        venue: venue || null,
        tourType: tourType || null,
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes("Can't reach database") || errorMessage.includes('P1001')) {
      console.error('Database connection failed. Check DATABASE_URL in .env');
    }

    return NextResponse.json(
      {
        error: 'Failed to save submission',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
