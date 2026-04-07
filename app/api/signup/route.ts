import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = 'eladbardes@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedDate, ticketQuantity, fullName, email, phone, note, newsletter, venue, tourType } = body;

    if (!fullName || !email) {
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
        phone: phone || '',
        note: note || null,
        newsletter: Boolean(newsletter),
        venue: venue || null,
        tourType: tourType || null,
      },
    });

    if (resend) {
      try {
        await resend.emails.send({
          from: 'AAE Notifications <onboarding@resend.dev>',
          to: NOTIFY_EMAIL,
          subject: `New booking inquiry from ${fullName}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; color: #1a1a1a;">
              <h2 style="font-weight: 400; font-size: 18px; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px;">
                New inquiry from your website
              </h2>
              <table style="width: 100%; font-size: 14px; line-height: 1.8;">
                <tr><td style="color: #888; width: 120px;">Name</td><td><strong>${fullName}</strong></td></tr>
                <tr><td style="color: #888;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
                ${phone ? `<tr><td style="color: #888;">Phone</td><td>${phone}</td></tr>` : ''}
                ${venue ? `<tr><td style="color: #888;">Venue</td><td>${venue}</td></tr>` : ''}
                ${tourType ? `<tr><td style="color: #888;">Experience</td><td>${tourType}</td></tr>` : ''}
                ${note ? `<tr><td style="color: #888;">Message</td><td>${note}</td></tr>` : ''}
                <tr><td style="color: #888;">Newsletter</td><td>${newsletter ? 'Yes' : 'No'}</td></tr>
              </table>
              <p style="font-size: 12px; color: #aaa; margin-top: 24px;">
                Sent from aae website contact form
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }
    }

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
