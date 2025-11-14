# ReelMenu - Project Summary

## What is ReelMenu?

ReelMenu is a TikTok-style restaurant menu and ordering system. Customers scan a QR code at their table and browse the menu through engaging vertical video reels, then place orders directly from their phone.

## Key Features

### Customer Experience
- 📱 **TikTok-Style Interface** - Full-screen vertical video feed
- 🎥 **Video Menu** - Each dish has its own video showcase
- 👆 **Gesture Navigation** - Swipe up/down for dishes, left/right for categories
- 🛒 **In-App Cart** - Add items, adjust quantities, checkout
- 🔇 **Audio Controls** - Mute/unmute videos
- 📦 **Order Placement** - Submit orders directly to kitchen

### Admin Dashboard
- 🏢 **Multi-Restaurant Support** - Manage multiple locations
- 📂 **Category Management** - Organize menu into categories
- 🍽️ **Dish Management** - Add/edit dishes with videos and thumbnails
- 📤 **File Upload** - Upload videos and images directly from computer
- 📊 **Order Management** - View and update order status
- 📱 **QR Code Generator** - Generate QR codes for each restaurant
- 💰 **Revenue Tracking** - Dashboard with stats and analytics

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Router
- TanStack Query

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Storage (file uploads)
- Row Level Security (RLS)

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin panel components
│   │   ├── AdminLayout.tsx
│   │   ├── DishForm.tsx    # Dish creation/editing with uploads
│   │   └── DishList.tsx
│   ├── user/               # Customer-facing components
│   │   ├── VideoReel.tsx   # TikTok-style video player
│   │   ├── CartSidebar.tsx # Shopping cart
│   │   ├── DishOverlay.tsx # Dish info overlay
│   │   └── MenuHeader.tsx
│   └── ui/                 # shadcn/ui components (50+)
├── pages/
│   ├── Menu.tsx            # Customer menu page (main feature)
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminDishes.tsx
│   ├── AdminCategories.tsx
│   ├── AdminOrders.tsx
│   ├── AdminRestaurants.tsx
│   ├── AdminQRCode.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useCart.tsx         # Shopping cart logic
│   └── useRestaurant.tsx   # Restaurant context
├── lib/
│   └── supabase/
│       ├── client.ts       # Supabase client
│       ├── queries.ts      # Database queries
│       └── storage.ts      # File upload functions
├── types/
│   └── index.ts            # TypeScript definitions
└── data/
    └── mockData.ts         # Sample data for testing

supabase/
└── migrations/
    ├── 001_initial_schema.sql    # Database schema
    └── 002_storage_buckets.sql   # Storage setup
```

## Database Schema

**Tables:**
- `restaurants` - Restaurant locations
- `categories` - Menu categories
- `dishes` - Menu items with video URLs
- `orders` - Customer orders
- `order_items` - Order line items
- `admin_users` - Admin authentication

**Storage Buckets:**
- `dish-videos` - Video files (max 200MB)
- `dish-thumbnails` - Image files (max 10MB)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
Your `.env` file already has:
```
VITE_SUPABASE_URL=https://hqopvvwczsgxocnzosce.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

### 3. Setup Storage Buckets
Run the SQL from `setup-storage.sql` in Supabase SQL Editor:
https://supabase.com/dashboard/project/hqopvvwczsgxocnzosce/sql/new

Or if buckets exist, run `fix-buckets.sql` instead.

### 4. Start Development Server
```bash
npm run dev
```

Access at: http://localhost:8080

## Usage Flow

### Admin Setup
1. Go to `http://localhost:8080/`
2. Login to admin panel
3. Create a restaurant (e.g., slug: "my-restaurant")
4. Add categories (e.g., "Starters", "Main Course")
5. Add dishes with videos and thumbnails
6. Generate QR code from QR Code page

### Customer Experience
1. Customer scans QR code
2. Opens `http://localhost:8080/menu/my-restaurant`
3. Browses dishes via video feed
4. Adds items to cart
5. Checks out
6. Order sent to kitchen

### Order Management
1. Admin sees new order in Orders page
2. Updates status: Pending → Preparing → Ready
3. Customer notified (future feature)

## Key Files to Know

**Customer Menu:**
- `src/pages/Menu.tsx` - Main customer interface
- `src/components/user/VideoReel.tsx` - Video player
- `src/components/user/CartSidebar.tsx` - Shopping cart

**Admin Panel:**
- `src/components/admin/DishForm.tsx` - Dish creation with file uploads
- `src/pages/AdminDishes.tsx` - Dish management
- `src/pages/AdminOrders.tsx` - Order management

**Data Layer:**
- `src/lib/supabase/queries.ts` - All database operations
- `src/lib/supabase/storage.ts` - File upload/download

## Features Implemented

✅ Multi-restaurant support
✅ Video menu browsing (TikTok-style)
✅ File uploads (videos & images)
✅ Shopping cart
✅ Order placement
✅ Order management
✅ QR code generation
✅ Dashboard analytics
✅ Category organization
✅ Gesture navigation
✅ Audio controls
✅ Responsive design

## Future Enhancements

🔮 Customer authentication
🔮 Payment integration
🔮 Real-time order updates
🔮 Push notifications
🔮 Order history
🔮 Reviews and ratings
🔮 Dietary filters
🔮 Multi-language support
🔮 Table management
🔮 Waiter call button

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

```env
VITE_SUPABASE_URL              # Supabase project URL
VITE_SUPABASE_PUBLISHABLE_KEY  # Supabase anon key
VITE_SUPABASE_PROJECT_ID       # Project ID
```

## Important Notes

1. **Storage Setup Required** - Must run SQL to create storage buckets before uploading files
2. **Restaurant Slug** - Used in customer URLs, must be unique and URL-friendly
3. **Video Formats** - Supports MP4, WebM, OGG, MOV, AVI, MKV
4. **Image Formats** - Supports JPG, PNG, GIF, WebP, AVIF, BMP, SVG
5. **File Limits** - Videos: 200MB, Images: 10MB
6. **Mobile First** - Customer interface optimized for mobile devices

## Troubleshooting

See `CUSTOMER_FLOW_GUIDE.md` for detailed troubleshooting steps.

Quick fixes:
- **Upload fails**: Run `fix-buckets.sql` in Supabase
- **Menu empty**: Add dishes in admin panel
- **Videos not playing**: Check video URLs and format
- **Orders not saving**: Check Supabase connection

## Documentation Files

- `README.md` - Original project readme
- `CUSTOMER_FLOW_GUIDE.md` - Customer experience walkthrough
- `QUICK_SETUP.md` - Storage setup instructions
- `STORAGE_SETUP.md` - Detailed storage configuration
- `PROJECT_SUMMARY.md` - This file

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Verify database schema matches migrations
4. Test with sample data first
