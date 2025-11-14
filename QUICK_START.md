# Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Setup Storage (One-Time)
1. Go to: https://supabase.com/dashboard/project/hqopvvwczsgxocnzosce/sql/new
2. Copy all SQL from `setup-storage.sql` (or `fix-buckets.sql` if buckets exist)
3. Paste and click "Run"

### Step 2: Start the App
```bash
npm run dev
```

### Step 3: Create Your First Restaurant
1. Open: http://localhost:8080
2. Login to admin panel
3. Click "Restaurants" → "Add Restaurant"
4. Fill in:
   - Name: "My Restaurant"
   - Slug: "my-restaurant" (used in URL)
5. Click "Create"

### Step 4: Add a Category
1. Click "Categories" → "Add Category"
2. Fill in:
   - Name: "Starters"
   - Slug: "starters"
3. Click "Create"

### Step 5: Add Your First Dish
1. Click "Dishes" → "Add Dish"
2. Fill in:
   - Name: "Paneer Tikka"
   - Price: 299
   - Category: Select "Starters"
   - Description: "Delicious grilled cottage cheese"
3. Upload a video (or paste a URL)
4. Upload a thumbnail (or paste a URL)
5. Click "Create Dish"

### Step 6: Test Customer View
1. Open new tab: http://localhost:8080/menu/my-restaurant
2. You should see your dish video!
3. Try:
   - Swipe up/down to navigate
   - Tap "Add to Cart"
   - Open cart and checkout

### Step 7: Check the Order
1. Go back to admin dashboard
2. Click "Orders"
3. You should see the new order!
4. Update status: Pending → Preparing → Ready

## That's It! 🎉

You now have a working TikTok-style restaurant menu system.

## Next Steps

- Add more dishes and categories
- Generate QR code from "QR Code" page
- Print and place on tables
- Customers scan and order!

## Quick Tips

**For Testing:**
- Use sample video URLs from the internet
- Or upload short video clips from your computer
- Keep videos under 200MB

**Sample Video URLs:**
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4
```

**Sample Image URLs:**
```
https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400
https://images.unsplash.com/photo-1529589510304-b7e994a92f60?w=400
```

## Troubleshooting

**Upload fails?**
- Run `fix-buckets.sql` in Supabase SQL Editor

**Menu is empty?**
- Make sure dishes are marked as "active"
- Check that you're using the correct restaurant slug

**Videos not playing?**
- Check video URL is valid
- Try a different video format
- Check browser console for errors

## Need Help?

Check these files:
- `CUSTOMER_FLOW_GUIDE.md` - Detailed customer experience
- `PROJECT_SUMMARY.md` - Complete project overview
- `STORAGE_SETUP.md` - Storage configuration details
