# Louisiana Guided Walks - Landing Page

A minimal, mobile-first landing page for pilot museum art walks at Louisiana Museum of Modern Art.

## Features

- Single-page design with clean, museum-like aesthetic
- **E-commerce shop** with three tour types:
  - Regular group walks
  - Exclusive families & couples walks
  - Teambuilding B2B packages
- **Payment integration:** Stripe (MobilePay ready)
- **Order management** system
- Two pilot walk date cards with easy selection
- Signup form with validation
- PostgreSQL database backend (via Prisma)
- Fully accessible (keyboard navigation, screen reader support)
- Mobile-first responsive design

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   - Install PostgreSQL locally, or use a cloud service
   - Create a database (e.g., `louisiana_walks`)

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/louisiana_walks?schema=public"
     ```
   - Add Stripe keys (see [SETUP_SHOP.md](SETUP_SHOP.md) for details):
     ```
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

4. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma migrate dev --name add_shop_tables
   ```
   This will create the database tables.

5. **Seed initial products (optional):**
   ```bash
   npm run seed
   ```
   Creates sample products for the shop.

6. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Railway Deployment

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository (optional, but recommended)

### Deployment Steps

1. **Create a new Railway project:**
   - Go to [railway.app](https://railway.app) and create a new project
   - Connect your GitHub repository (or deploy directly)

2. **Add PostgreSQL service:**
   - In your Railway project, click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` environment variable

3. **Deploy your application:**
   - If connected to GitHub: Railway will auto-deploy on push
   - Or use Railway CLI: `railway up`

4. **Run database migrations:**
   - In Railway dashboard, go to your service → "Deployments" → "View Logs"
   - Or use Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```
   - Or add a one-time command in Railway: `npx prisma migrate deploy`

5. **Set up custom domain (optional):**
   - In Railway dashboard → "Settings" → "Networking"
   - Add your custom domain

### Railway Environment Variables

Railway automatically provides:
- `DATABASE_URL` - PostgreSQL connection string (from PostgreSQL service)

No additional environment variables needed!

### Build Configuration

Railway will automatically:
- Detect Next.js project
- Run `npm install`
- Run `npm run build` (which includes `prisma generate`)
- Start the app with `npm start`

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── page.tsx         # Submissions management
│   │   └── orders/
│   │       └── page.tsx     # Orders management
│   ├── api/
│   │   ├── admin/
│   │   │   ├── submissions/ # Admin API for submissions
│   │   │   └── orders/      # Admin API for orders
│   │   ├── payments/
│   │   │   ├── create-intent/ # Stripe checkout session
│   │   │   ├── webhook/      # Stripe webhook handler
│   │   │   └── verify/       # Payment verification
│   │   ├── orders/
│   │   │   └── create/       # Order creation
│   │   └── products/         # Product listing API
│   ├── shop/
│   │   ├── page.tsx          # Shop listing page
│   │   ├── [id]/
│   │   │   └── page.tsx      # Product checkout page
│   │   └── thank-you/
│   │       └── page.tsx      # Thank you page
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Main landing page component
│   └── globals.css           # Global styles and Tailwind imports
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seed script
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Database Schema

### Submission Model (Legacy)
Stores pilot walk registrations:
- `id` - Unique identifier
- `selectedDate` - Selected tour date string
- `ticketQuantity` - Number of tickets
- `fullName` - User's full name
- `email` - User's email address
- `phone` - Phone number
- `note` - Additional note (optional)
- `newsletter` - Newsletter opt-in (boolean)
- `createdAt` - Submission timestamp

### Product Model (New)
Stores tour products:
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `tourType` - REGULAR, FAMILIES_COUPLES, or TEAMBUILDING
- `price` - Price in øre (Danish cents)
- `capacity` - Max participants (null for unlimited)
- `isActive` - Whether product is available
- `isB2B` - Whether it's a B2B product (no public pricing)

### Order Model (New)
Stores shop orders:
- `id` - Unique identifier
- `orderNumber` - Human-readable order number
- `productId` - Reference to product
- `quantity` - Number of tickets/products
- `totalAmount` - Total price in øre
- `status` - PENDING, PAID, CANCELLED, REFUNDED
- `paymentMethod` - STRIPE or MOBILEPAY
- Customer info (name, email, phone, note, newsletter)
- Payment IDs (Stripe payment intent, MobilePay transaction)
- Tour-specific dates

## Configuration

Tour dates are configured at the top of `app/page.tsx` in the `TOUR_DATES` constant. You can easily update dates, times, languages, and capacity there.

## Form Submission

The form sends data to `/api/signup` which saves to PostgreSQL:
- Selected tour date (formatted string)
- Full name (required)
- Email (required)
- Phone (optional)
- Note (optional)
- Newsletter opt-in (boolean)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (ORM)
- **PostgreSQL** (database)
- **Stripe** (payments)
- **Railway** (hosting)

## Shop Features

See [SETUP_SHOP.md](SETUP_SHOP.md) for detailed shop setup instructions including:
- Stripe configuration
- Product management
- Order processing
- Payment webhooks

## Database Management

### View submissions locally:
```bash
npx prisma studio
```
This opens a browser interface to view and manage your database.

### Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

### Reset database (development only):
```bash
npx prisma migrate reset
```

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader friendly error messages
- Proper form validation with accessible error messages
