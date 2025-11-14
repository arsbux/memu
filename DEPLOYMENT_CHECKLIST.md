# 🚀 Deployment Checklist for menu.atomiclabs.space

## Pre-Deployment

### ✅ Code Ready
- [x] Build tested locally (`npm run build`)
- [x] All features working in development
- [x] No console errors
- [x] Code pushed to GitHub

### ✅ Supabase Setup
- [ ] Storage buckets created (`dish-videos`, `dish-thumbnails`)
- [ ] Run `setup-storage.sql` or `fix-buckets.sql`
- [ ] Database migrations applied
- [ ] RLS policies configured
- [ ] Test data added (optional)

## Netlify Setup

### Step 1: Create New Site
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub
4. Select repository: `arsbux/memu`
5. Configure:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 2: Environment Variables
Add in Netlify dashboard (Site settings → Environment variables):

```
VITE_SUPABASE_URL=https://hqopvvwczsgxocnzosce.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxb3B2dndjenNneG9jbnpvc2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTQwMTQsImV4cCI6MjA3Nzk5MDAxNH0.NTPaokzkTYNqP2HEb4saUBDy34rHa7v_nq9NHGFGTBY
VITE_SUPABASE_PROJECT_ID=hqopvvwczsgxocnzosce
```

### Step 3: Custom Domain
1. Go to Domain settings
2. Add custom domain: `menu.atomiclabs.space`
3. Configure DNS:
   - Type: CNAME
   - Name: menu
   - Value: [your-netlify-site].netlify.app
4. Wait for DNS propagation (5-30 minutes)
5. Enable "Force HTTPS"

### Step 4: Deploy
1. Click "Deploy site"
2. Monitor build logs
3. Wait for deployment to complete

## Post-Deployment Testing

### ✅ Basic Functionality
- [ ] Site loads at menu.atomiclabs.space
- [ ] HTTPS is working (green padlock)
- [ ] No 404 errors on page refresh
- [ ] All assets loading correctly

### ✅ Admin Panel
- [ ] Can access admin login at `/`
- [ ] Can login successfully
- [ ] Dashboard loads with stats
- [ ] Can create restaurant
- [ ] Can add categories
- [ ] Can add dishes
- [ ] Video upload works
- [ ] Image upload works
- [ ] Can view orders
- [ ] QR code generates correctly

### ✅ Customer Experience
- [ ] Menu loads at `/menu/restaurant-slug`
- [ ] Videos play correctly
- [ ] Audio controls work
- [ ] Swipe navigation works
- [ ] Can add items to cart
- [ ] Cart displays correctly
- [ ] Checkout works
- [ ] Order appears in admin dashboard

### ✅ Mobile Testing
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Touch gestures work
- [ ] Videos autoplay
- [ ] Cart sidebar works
- [ ] Responsive layout correct

### ✅ Performance
- [ ] Page load time < 3 seconds
- [ ] Videos load smoothly
- [ ] No lag in navigation
- [ ] Images optimized

## Troubleshooting

### Build Fails
```bash
# Check build logs in Netlify
# Common issues:
- Missing environment variables
- Node version mismatch
- Dependency issues
```

### 404 on Refresh
```bash
# Verify netlify.toml exists with redirects
# Should redirect all routes to index.html
```

### Videos Not Playing
```bash
# Check:
- Video URLs are correct
- Storage buckets are public
- CORS is configured
- Video format is supported
```

### Orders Not Saving
```bash
# Check:
- Supabase connection
- RLS policies allow inserts
- Restaurant ID is valid
- Browser console for errors
```

## Monitoring Setup

### Analytics (Optional)
- [ ] Enable Netlify Analytics
- [ ] Set up Google Analytics
- [ ] Configure error tracking

### Uptime Monitoring
- [ ] Set up UptimeRobot
- [ ] Configure alerts
- [ ] Test notification system

### Performance Monitoring
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Optimize if needed

## Final Checks

- [ ] All documentation updated
- [ ] README has correct URLs
- [ ] Environment variables documented
- [ ] Backup plan in place
- [ ] Team notified of deployment
- [ ] Support channels ready

## Rollback Plan

If something goes wrong:
1. Go to Netlify → Deploys
2. Find last working deployment
3. Click "Publish deploy"
4. Site rolls back instantly

## Success Criteria

✅ Site is live at menu.atomiclabs.space
✅ All features working as expected
✅ No critical errors in console
✅ Mobile experience is smooth
✅ Orders flow from customer to admin
✅ QR codes work correctly
✅ Performance is acceptable

## Next Steps After Deployment

1. **Create Test Restaurant**
   - Add sample categories
   - Upload test dishes with videos
   - Generate QR code

2. **Share with Team**
   - Send admin credentials
   - Share documentation links
   - Provide support contact

3. **Monitor First Week**
   - Check error logs daily
   - Monitor performance
   - Gather user feedback
   - Fix any issues quickly

4. **Plan Improvements**
   - Collect feature requests
   - Prioritize enhancements
   - Schedule updates

## Support Contacts

- **Technical Issues**: Check GitHub issues
- **Netlify Support**: https://www.netlify.com/support/
- **Supabase Support**: https://supabase.com/support

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Status**: _____________
