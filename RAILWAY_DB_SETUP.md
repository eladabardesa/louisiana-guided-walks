# Railway Database Setup Checklist

## Step 1: Verify PostgreSQL Service Exists

1. Go to your Railway project dashboard
2. You should see **two services**:
   - Your **Next.js app** service (the main one)
   - A **PostgreSQL** service (database)

**If you DON'T see a PostgreSQL service:**
- Click **"New"** → **"Database"** → **"Add PostgreSQL"**
- Railway will create it automatically

## Step 2: Connect Database to Your App

1. Click on your **Next.js app service** (not the PostgreSQL one)
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` - it should be there automatically
   - If it's NOT there, Railway might not have linked it
   - **Fix:** In your app service → "Variables" → "New Variable"
   - Click **"Reference"** → Select your PostgreSQL service → Select `DATABASE_URL`
   - This creates a reference to the database URL

## Step 3: Run Database Migrations

You need to create the database tables. Choose one method:

### Method A: Using Railway Dashboard (Easiest)

1. Go to your **Next.js app service**
2. Click on **"Deployments"** tab
3. Find the latest deployment
4. Click the **three dots menu** (⋯) → **"Run Command"**
5. Enter: `npx prisma migrate deploy`
6. Click **"Run"**
7. Check the output - it should say "Applied migration" or "No pending migrations"

### Method B: Using Railway CLI

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login and link to your project
railway login
railway link

# Run migrations
railway run npx prisma migrate deploy
```

### Method C: One-Time Command in Railway

1. In your app service → **"Settings"** → **"Deploy"**
2. Look for **"Run Command"** or **"One-Time Command"**
3. Enter: `npx prisma migrate deploy`
4. Save and redeploy

## Step 4: Verify Database is Working

1. **Test the form on your live site:**
   - Go to your Railway URL
   - Fill out the form and submit
   - Check if you see a success message

2. **Check Railway logs:**
   - Go to your app service → **"Deployments"** → **"View Logs"**
   - Look for any database connection errors
   - If you see "Can't reach database server" or similar, the DATABASE_URL might be wrong

3. **View your database:**
   - Click on your **PostgreSQL service**
   - Go to **"Data"** tab (if available)
   - Or use Railway's database query interface
   - You should see a `Submission` table with your form data

## Common Issues & Fixes

### Issue: "DATABASE_URL not found"
**Fix:** Make sure PostgreSQL service exists, then reference it in your app service variables

### Issue: "Migration failed" or "Table doesn't exist"
**Fix:** Run `npx prisma migrate deploy` again (see Step 3)

### Issue: Form submits but no data saved
**Fix:** 
- Check Railway logs for errors
- Verify DATABASE_URL is correctly referenced
- Make sure migrations ran successfully

### Issue: "Prisma Client not generated"
**Fix:** Railway should run `prisma generate` during build (it's in package.json build script). If not, check build logs.

## Quick Test

After setup, try submitting the form on your live site. If you see:
- ✅ Success message → Database is working!
- ❌ Error message → Check Railway logs for details
