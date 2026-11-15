import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getBookedSeats } from '@/lib/content';
import { formatPriceDkk, formatTourDate, generateOrderNumber } from '@/lib/format';
import { getBaseUrl, getStripe } from '@/lib/stripe';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = 'eladbardes@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tourId,
      tourDateId,
      quantity: rawQuantity,
      fullName,
      email,
      phone,
      note,
      newsletter,
      customDate,
    } = body;

    if (!tourId || !fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const quantity = Math.max(1, parseInt(String(rawQuantity), 10) || 1);

    const tour = await prisma.tour.findFirst({
      where: { id: tourId, isActive: true },
      include: { venue: true },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    if (tour.isB2B) {
      return NextResponse.json(
        { error: 'This experience is by inquiry only. Please use the contact form.' },
        { status: 400 }
      );
    }

    let tourDate = null;
    if (tourDateId) {
      tourDate = await prisma.tourDate.findFirst({
        where: { id: tourDateId, tourId: tour.id, isActive: true },
      });
      if (!tourDate) {
        return NextResponse.json({ error: 'Selected date not found' }, { status: 404 });
      }

      const capacity = tourDate.capacity ?? tour.capacity;
      if (capacity != null) {
        const booked = await getBookedSeats(tourDate.id);
        if (booked + quantity > capacity) {
          return NextResponse.json(
            { error: 'Not enough spots left for this date' },
            { status: 409 }
          );
        }
      }
    } else if (tour.tourType === 'REGULAR') {
      return NextResponse.json({ error: 'Please select a tour date' }, { status: 400 });
    }

    const totalAmount = tour.price * quantity;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        tourId: tour.id,
        tourDateId: tourDate?.id || null,
        quantity,
        totalAmount,
        status: 'PENDING',
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone || '').trim(),
        note: note ? String(note) : null,
        newsletter: Boolean(newsletter),
        customDate: customDate ? new Date(customDate) : null,
      },
    });

    // Free tours: mark paid immediately, no Stripe
    if (totalAmount === 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      if (resend) {
        try {
          await resend.emails.send({
            from: 'AAE Notifications <onboarding@resend.dev>',
            to: NOTIFY_EMAIL,
            subject: `New free booking: ${orderNumber}`,
            html: `
              <p><strong>${fullName}</strong> booked ${quantity}× ${tour.name}</p>
              <p>Email: ${email}</p>
              <p>Phone: ${phone || '—'}</p>
              <p>Date: ${
                tourDate
                  ? formatTourDate(tourDate.startsAt, tourDate.language)
                  : customDate || 'Flexible / TBA'
              }</p>
              <p>Order: ${orderNumber}</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send booking email:', emailError);
        }
      }

      return NextResponse.json({
        success: true,
        free: true,
        orderNumber,
        redirectUrl: `${getBaseUrl()}/tours/thank-you?order=${orderNumber}`,
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. Please contact us to book.' },
        { status: 503 }
      );
    }

    const dateLabel = tourDate
      ? formatTourDate(tourDate.startsAt, tourDate.language)
      : 'Preferred date TBA';

    const lineItems = [
      {
        quantity,
        price_data: {
          currency: 'dkk',
          unit_amount: tour.price,
          product_data: {
            name: tour.name,
            description: [tour.venue?.name, dateLabel, formatPriceDkk(tour.price)]
              .filter(Boolean)
              .join(' · '),
          },
        },
      },
    ];

    const sessionParams = {
      mode: 'payment' as const,
      customer_email: email,
      line_items: lineItems,
      success_url: `${getBaseUrl()}/tours/thank-you?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/tours/${tour.slug}?cancelled=1`,
      metadata: {
        orderId: order.id,
        orderNumber,
      },
    };

    // Prefer card + MobilePay when enabled on the Stripe account; fall back to card only.
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...sessionParams,
        // mobilepay is valid in Stripe DK accounts; SDK types may lag behind.
        payment_method_types: ['card', 'mobilepay'] as unknown as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      });
    } catch {
      session = await stripe.checkout.sessions.create({
        ...sessionParams,
        payment_method_types: ['card'],
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: 'STRIPE',
        paymentIntentId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Stripe may reject mobilepay if not enabled — retry with card only
    if (message.toLowerCase().includes('mobilepay')) {
      return NextResponse.json(
        {
          error:
            'MobilePay is not enabled on this Stripe account yet. Enable MobilePay in Stripe Dashboard, or contact support.',
          details: process.env.NODE_ENV === 'development' ? message : undefined,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to start checkout',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}
