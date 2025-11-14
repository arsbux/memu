# Netlify Deployment Guide

## Deploy to menu.atomiclabs.space

### Step 1: Connect Repository to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select repository: `arsbux/memu`
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 2: Add Environment Variables

In Netlify dashboard, go to:
**Site settings → Environment variables → Add a variable**

Add these variables:
```
VITE_SUPABASE_URL=https://hqopvvwczsgxocnzosce.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxb3B2dndjenNneG9jbnpvc2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTQwMTQsImV4cCI6MjA3Nzk5MDAxNH0.NTPaokzkTYNqP2HEb4saUBDy34rHa7v_nq9NHGFGTBY
VITE_SUPABASE_PROJECT_ID=hqopvvwczsgxocnzosce
```

### Step 3: Configure Custom Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Enter: `menu.atomiclabs.space`
4. Follow DNS configuration instructions:
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify DNS

### Step 4: Enable HTTPS

1. Netlify will automatically provision SSL certificate
2. Wait a few minutes for certificate to be issued
3. Enable "Force HTTPS" in domain settings

### Step 5: Deploy

1. Click "Deploy site"
2. Wait for build to complete (usually 2-3 minutes)
3. Site will be live at `menu.atomiclabs.space`

## Automatic Deployments

Every push to the `main` branch will automatically trigger a new deployment.

To deploy:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Build Status

Check build status at:
- Netlify dashboard → Deploys tab
- Or via badge: `[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)`

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify environment variables are set correctly
- Ensure `netlify.toml` is in repository root

### 404 Errors on Refresh
- The `netlify.toml` file handles SPA routing
- All routes redirect to `index.html`

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding/changing variables
- Check they're visible in build logs (values will be hidden)

### Slow Build Times
- Netlify caches `node_modules`
- First build may take longer
- Subsequent builds are faster

## Post-Deployment Checklist

✅ Site loads at `menu.atomiclabs.space`
✅ Admin login works
✅ Can create restaurants, categories, dishes
✅ Can upload videos and images
✅ Customer menu loads at `/menu/restaurant-slug`
✅ Videos play correctly
✅ Cart and checkout work
✅ Orders appear in admin dashboard
✅ QR codes generate correctly
✅ HTTPS is enabled

## Performance Optimization

The site is already optimized with:
- Code splitting
- Asset caching (1 year for static assets)
- Gzip compression
- CDN delivery via Netlify

## Monitoring

Monitor your site:
- **Analytics**: Netlify Analytics (optional paid feature)
- **Uptime**: Use UptimeRobot or similar
- **Errors**: Check browser console and Supabase logs

## Rollback

If something goes wrong:
1. Go to Netlify dashboard → Deploys
2. Find a working deployment
3. Click "Publish deploy"
4. Site will instantly rollback

## Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- GitHub Issues: https://github.com/arsbux/memu/issues
