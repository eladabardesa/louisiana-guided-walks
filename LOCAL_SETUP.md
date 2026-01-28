# Local Development Setup

## Quick Setup (Using Railway Database)

1. **Get Railway Database URL:**
   - Go to Railway → PostgreSQL service → Variables
   - Copy `database_public_url` (the one with `interchange.proxy.rlwy.net`)

2. **Update .env file:**
   - Open `.env` in your project
   - Replace the DATABASE_URL with Railway's public URL:
     ```
     DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@interchange.proxy.rlwy.net:PORT/railway"
     ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Visit http://localhost:3000
   - Test the form!

## Alternative: Local PostgreSQL

If you prefer local PostgreSQL:

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create database:**
   ```bash
   createdb louisiana_walks
   ```

3. **Update .env:**
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/louisiana_walks?schema=public"
   ```
   (Replace YOUR_USERNAME with your macOS username)

4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

## Verify Everything Works

1. ✅ Dependencies installed (`npm install`)
2. ✅ DATABASE_URL set in `.env`
3. ✅ Migrations run (`npx prisma migrate deploy`)
4. ✅ Dev server running (`npm run dev`)
5. ✅ Form submits successfully

## View Your Data Locally

```bash
npx prisma studio
```

This opens a browser interface to view your database tables and data.
