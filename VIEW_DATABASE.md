# How to View Your Database Submissions

## Option 1: Railway Dashboard (Easiest)

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Sign in and open your project

2. **Open PostgreSQL Service:**
   - Click on your **PostgreSQL** service (not the Next.js app)
   - Look for a **"Data"** or **"Query"** tab
   - Railway may have a built-in database viewer

3. **View Submissions:**
   - If Railway has a data viewer, you'll see your `Submission` table
   - Click on it to see all form submissions

## Option 2: Prisma Studio (Best for Local)

**Prisma Studio** is a visual database browser. Use it locally:

1. **Make sure your `.env` file has Railway's database URL:**
   ```bash
   # Your .env should have:
   DATABASE_URL="postgresql://postgres:...@interchange.proxy.rlwy.net:43972/railway"
   ```

2. **Run Prisma Studio:**
   ```bash
   cd "/Users/eladbardes/Documents/Louisiana guided walks"
   npx prisma studio
   ```

3. **View your data:**
   - Prisma Studio opens in your browser (usually http://localhost:5555)
   - Click on **"Submission"** model
   - You'll see all form submissions with:
     - Full name
     - Email
     - Phone
     - Selected tour date
     - Ticket quantity
     - Newsletter opt-in
     - Submission timestamp

## Option 3: Railway CLI + Database Connection

You can also connect directly using Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway connect postgres
```

This opens a PostgreSQL command line where you can run SQL queries:

```sql
SELECT * FROM "Submission" ORDER BY "createdAt" DESC;
```

## Quick Check: See Recent Submissions

If you just want to verify submissions are being saved:

1. **Check Railway Logs:**
   - Go to Railway → Your app service → Deployments → View Logs
   - Look for successful submission logs

2. **Test Locally:**
   - Run `npx prisma studio` locally
   - Submit a test form entry
   - Refresh Prisma Studio to see it appear

## What You'll See in the Database

Each submission includes:
- **id** - Unique identifier
- **selectedDate** - Which tour they selected (e.g., "Pilot walk #1 - Tuesday, Feb 10 at 16:00")
- **ticketQuantity** - 1 or 2 tickets
- **fullName** - User's name
- **email** - User's email
- **phone** - User's phone number
- **note** - Optional note (or null)
- **newsletter** - true/false
- **createdAt** - When they submitted

## Troubleshooting

**Can't see data?**
- Make sure migrations ran: Check Railway logs for "Applied migration"
- Verify DATABASE_URL is correct in Railway variables
- Try Prisma Studio locally first to test connection

**Prisma Studio won't connect?**
- Check your `.env` file has the correct Railway database URL
- Make sure you're using the `database_public_url` (not internal URL)
- Test connection: `npx prisma db pull` (should work without errors)
