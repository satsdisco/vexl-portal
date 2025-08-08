# Deployment Instructions for Vexl Portal

## Prerequisites
- Strapi backend deployed (see `/vexl-portal-backend/DEPLOY.md`)
- Vercel account connected to GitHub

## Step 1: Deploy Strapi Backend

### Option A: Deploy to Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `vexl-portal-backend` repository
4. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db
   JWT_SECRET=[generate random 32 char string]
   ADMIN_JWT_SECRET=[generate random 32 char string]
   APP_KEYS=[generate 4 random strings separated by commas]
   API_TOKEN_SALT=[generate random 32 char string]
   ```
5. Deploy and copy the deployment URL

### Option B: Deploy to Render (Free)
1. Go to [Render](https://render.com)
2. New Web Service → Connect `vexl-portal-backend` repo
3. It will auto-detect configuration from `render.yaml`
4. Deploy (takes ~5-10 minutes on free tier)

## Step 2: Configure Strapi Admin
1. Visit `https://your-strapi-url.com/admin`
2. Create your admin account (SAVE THESE CREDENTIALS!)
3. The workshop data is already seeded

## Step 3: Update Frontend Environment

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   ```
   NEXT_PUBLIC_STRAPI_URL = https://your-strapi-url.com
   ```
4. Redeploy to apply changes

### Or via CLI:
```bash
vercel env add NEXT_PUBLIC_STRAPI_URL production
# Enter your Strapi URL when prompted
vercel --prod
```

## Step 4: Verify Deployment
1. Visit your Vercel deployment URL
2. Check `/test-strapi` page to verify connection
3. Visit `/workshop` to see presentations from Strapi
4. Admin dashboard at `/admin/dashboard` should load data

## Current Deployment URLs
- **Frontend (Vercel)**: https://vexl-portal-4dnt21hfj-satsdiscos-projects.vercel.app
- **Strapi Backend**: [To be deployed]
- **GitHub Frontend**: https://github.com/satsdisco/vexl-portal
- **GitHub Backend**: https://github.com/satsdisco/vexl-portal-backend

## Troubleshooting

### CORS Issues
If you get CORS errors, update Strapi's `config/middlewares.ts` to include your Vercel domain:
```typescript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://your-vercel-app.vercel.app'],
  },
}
```

### Data Not Loading
1. Check browser console for errors
2. Verify Strapi is running: `https://your-strapi-url.com/api/presentations`
3. Check environment variables in Vercel dashboard
4. The app falls back to localStorage if Strapi is unavailable

### Authentication Issues
- Demo login (`demo@vexl.it`) works without Strapi
- Real authentication requires Strapi to be running
- Check JWT secret matches between frontend and backend

## Next Steps After Deployment
1. Create real user accounts in Strapi admin
2. Add more presentation templates
3. Configure image uploads (currently using local storage)
4. Consider upgrading to PostgreSQL for production
5. Set up monitoring and analytics