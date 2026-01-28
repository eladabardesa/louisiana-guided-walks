# Deployment Guide - GitHub + Railway

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `louisiana-guided-walks` (or your preferred name)
4. Description: "Landing page for pilot museum art walks at Louisiana"
5. Choose **Private** (Railway works perfectly with private repos via GitHub OAuth)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Push Code to GitHub

Open your terminal in this project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Landing page with PostgreSQL backend"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/louisiana-guided-walks.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you haven't set up git credentials, GitHub will prompt you. You may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

## Step 3: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in (use GitHub to sign in for easier integration)

2. Click **"New Project"**

3. Select **"Deploy from GitHub repo"**
   - Railway will ask for GitHub permissions (grant access to your private repos)

4. Choose your `louisiana-guided-walks` repository
   - Private repos work perfectly - Railway accesses them via GitHub OAuth

5. Railway will automatically:
   - Detect it's a Next.js project
   - Start building

6. **Add PostgreSQL Database:**
   - In your Railway project dashboard, click **"New"**
   - Select **"Database"** → **"Add PostgreSQL"**
   - Railway automatically creates a `DATABASE_URL` environment variable

7. **Run Database Migrations:**
   - In Railway dashboard, go to your service
   - Click on the three dots menu → **"View Logs"**
   - Or use Railway CLI:
     ```bash
     # Install Railway CLI first: npm i -g @railway/cli
     railway login
     railway link
     railway run npx prisma migrate deploy
     ```

8. **Get Your Live URL:**
   - Railway automatically generates a URL (e.g., `louisiana-guided-walks.up.railway.app`)
   - You can find it in your service → **"Settings"** → **"Networking"**
   - Or add a custom domain there

## Step 4: Verify Everything Works

1. Visit your Railway URL
2. Fill out the form and submit
3. Check that submissions are saved:
   - Connect to your Railway PostgreSQL database
   - Or use Railway's database dashboard to view data

## Troubleshooting

### Database Connection Issues
- Make sure `DATABASE_URL` is set in Railway (should be automatic)
- Check that migrations ran: `railway run npx prisma migrate deploy`

### Build Failures
- Check Railway build logs
- Make sure all dependencies are in `package.json`
- Verify `prisma generate` runs during build (it's in the build script)

### Form Not Submitting
- Check browser console for errors
- Check Railway service logs
- Verify API route is accessible at `/api/signup`

## Environment Variables

Railway automatically provides:
- `DATABASE_URL` - From PostgreSQL service

No manual configuration needed!
