import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { formatTourDate } from '@/lib/format';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = 'eladbardes@gmail.com';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const orderNumber = session.metadata?.orderNumber;

    const order = orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          include: { tour: true, tourDate: true },
        })
      : orderNumber
        ? await prisma.order.findUnique({
            where: { orderNumber },
            include: { tour: true, tourDate: true },
          })
        : null;

    if (order && order.status !== 'PAID') {
      const paymentType = session.payment_method_types?.[0];
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentMethod: paymentType === 'mobilepay' ? 'MOBILEPAY' : 'STRIPE',
          paymentIntentId: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.id,
        },
      });

      if (resend) {
        try {
          await resend.emails.send({
            from: 'AAE Notifications <onboarding@resend.dev>',
            to: NOTIFY_EMAIL,
            subject: `Paid booking: ${order.orderNumber}`,
            html: `
              <p><strong>${order.fullName}</strong> paid for ${order.quantity}× ${order.tour.name}</p>
              <p>Email: ${order.email}</p>
              <p>Phone: ${order.phone || '—'}</p>
              <p>Date: ${
                order.tourDate
                  ? formatTourDate(order.tourDate.startsAt, order.tourDate.language)
                  : 'Flexible / TBA'
              }</p>
              <p>Amount: ${(order.totalAmount / 100).toFixed(2)} DKK</p>
              <p>Order: ${order.orderNumber}</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send paid booking email:', emailError);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
