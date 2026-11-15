# Content admin & paid bookings

## What you get

- **/admin** — password-gated control panel for:
  - Tours (text, price, photos, visibility)
  - Dates (add / hide / delete)
  - Venues
  - Homepage / about text
  - Orders (paid bookings)
  - Contact-form inquiries
- **/tours** — public listing + booking
- **Stripe checkout** — card; MobilePay when enabled on your Stripe (Denmark) account
- Free tours (`price = 0`) confirm immediately without payment

## First-time setup

1. Deploy / pull this code, then migrate & seed:

```bash
npx prisma migrate deploy
npm run seed
```

2. Set environment variables (local `.env` and Railway):

```env
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=another-long-random-string
NEXT_PUBLIC_BASE_URL=https://your-domain.example
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Stripe webhook:
   - URL: `https://your-domain/api/payments/webhook`
   - Event: `checkout.session.completed`

4. Optional MobilePay:
   - In Stripe Dashboard → Settings → Payment methods → enable **MobilePay**
   - Checkout will offer MobilePay + card when available; otherwise card only

## Everyday use

1. Open `/admin` and log in
2. **Tours → New tour** — name, venue, description, price (DKK), hero photo
3. Add dates under the tour
4. Mark **Visible on website**
5. Share `/tours` or the specific tour URL

## Photos

- Prefer paths under `/public` (e.g. `/venues/photo.jpg`) so they survive Railway redeploys
- Admin upload writes to `/public/uploads` (fine locally; may be wiped on Railway redeploy unless you commit those files or use a CDN later)

## Notes

- Contact form stays for inquiries / B2B; paid group walks go through `/tours`
- Default admin password fallback is only for local dev if `ADMIN_PASSWORD` is unset — set it in production
