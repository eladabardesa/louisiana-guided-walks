# Shop Setup Guide

## Overview

The website now includes a full e-commerce shop with:
- Three tour types: Regular walks, Families & Couples, Teambuilding (B2B)
- Stripe payment integration
- MobilePay integration (placeholder - ready for implementation)
- Order management system
- Product management

## Initial Setup

### 1. Database Migration

Run the new migration to create product and order tables:

```bash
npx prisma migrate dev --name add_shop_tables
```

Or on Railway:
```bash
railway run npx prisma migrate deploy
```

### 2. Seed Initial Products

Create sample products:

```bash
npm run seed
```

This creates:
- Regular Group Walk (free, capacity: 10)
- Exclusive Walk for Families & Couples (500 DKK, private)
- Teambuilding Package (B2B, contact for pricing)

### 3. Stripe Setup

1. **Create Stripe account:**
   - Go to https://stripe.com
   - Sign up for an account
   - Get your API keys from https://dashboard.stripe.com/apikeys

2. **Add Stripe keys to Railway:**
   - Go to Railway → Your app service → Variables
   - Add:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` (or `pk_live_...` for production)
     - `STRIPE_SECRET_KEY` = `sk_test_...` (or `sk_live_...` for production)

3. **Set up webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-site.up.railway.app/api/payments/webhook`
   - Select event: `checkout.session.completed`
   - Copy webhook secret
   - Add to Railway: `STRIPE_WEBHOOK_SECRET` = `whsec_...`

4. **For local development:**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/payments/webhook`
   - Copy the webhook secret it provides

### 4. Environment Variables

Add these to your `.env` file (local) and Railway (production):

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Base URL (for Stripe redirects)
NEXT_PUBLIC_BASE_URL=https://your-site.up.railway.app
```

## Managing Products

### Via Admin Panel

Currently, products are managed via database. You can:

1. **View products:** Use Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. **Add products:** Use Prisma Studio or create via API

### Via API (Future)

You can create an admin interface for products, or add them directly via Prisma Studio.

## Tour Types

### 1. Regular Walks (`REGULAR`)
- Group walks with capacity limits
- Shows availability
- Can have fixed dates or flexible scheduling
- Price: Set in product (currently free)

### 2. Families & Couples (`FAMILIES_COUPLES`)
- Private/exclusive walks
- No capacity limit (private)
- Custom date selection
- Price: Set per product

### 3. Teambuilding (`TEAMBUILDING`)
- B2B packages
- No public pricing (`isB2B: true`)
- Contact form instead of payment
- Three-meeting structure

## Payment Flow

### Stripe Flow:
1. Customer fills checkout form
2. Order created (PENDING status)
3. Redirected to Stripe Checkout
4. Payment processed by Stripe
5. Webhook updates order to PAID
6. Customer redirected to thank-you page

### MobilePay Flow:
- Currently placeholder
- Ready for MobilePay API integration when needed

## Admin Features

### View Submissions:
- `/admin` - Legacy pilot walk submissions

### View Orders:
- `/admin/orders` - All shop orders with payment status

## Keeping Existing Site Running

The existing pilot walk registration system (`/` page) continues to work:
- Old submissions still saved to `Submission` table
- New shop orders saved to `Order` table
- Both systems work independently

## Next Steps

1. **Add more products:**
   - Use Prisma Studio or create admin interface
   - Set prices, descriptions, capacity

2. **Customize tour types:**
   - Update product descriptions
   - Adjust pricing
   - Add more product variants

3. **MobilePay integration:**
   - When ready, implement MobilePay API
   - Update checkout flow

4. **Email notifications:**
   - Add email sending on order completion
   - Use Resend, SendGrid, or similar

5. **Product management UI:**
   - Create admin interface for products
   - Allow adding/editing products without database access

## Testing

1. **Test Stripe (test mode):**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

2. **Test orders:**
   - Create test orders
   - Check admin panel
   - Verify webhook updates

3. **Test B2B flow:**
   - Select teambuilding product
   - Submit without payment
   - Verify order created as PENDING
