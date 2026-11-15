import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get('order');
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!orderNumber) {
    return NextResponse.json({ error: 'order is required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { tour: { include: { venue: true } }, tourDate: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // If still pending and we have a session, verify with Stripe
  if (order.status === 'PENDING' && sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              paymentMethod:
                session.payment_method_types?.[0] === 'mobilepay' ? 'MOBILEPAY' : 'STRIPE',
            },
            include: { tour: { include: { venue: true } }, tourDate: true },
          });
          return NextResponse.json(updated);
        }
      } catch (err) {
        console.error('Payment verify error:', err);
      }
    }
  }

  return NextResponse.json(order);
}
