# How to Run Migrations on Railway

## Option 1: Railway CLI (Easiest)

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```
   (This will open your browser to authenticate)

3. **Link to your project:**
   ```bash
   railway link
   ```
   (Select your project when prompted)

4. **Run migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

That's it! The migrations will run and create your database tables.

## Option 2: Add Migration to Build Script

We can add migrations to run automatically during build. Let me know if you want this option.

## Option 3: Railway Dashboard - Settings

1. Go to your "The deployment" service
2. Click "Settings" tab
3. Look for "Build Command" or "Deploy Command"
4. We can add the migration command there

## After Migrations Run

Test your form again - it should work!
