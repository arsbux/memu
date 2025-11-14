# 🍽️ ReelMenu - TikTok-Style Restaurant Menu

A modern, engaging restaurant menu and ordering system with TikTok-style vertical video reels. Customers scan a QR code and browse dishes through immersive video content, then place orders directly from their phone.

![ReelMenu Demo](https://img.shields.io/badge/Status-Production%20Ready-success)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Customer Experience
- 📱 **TikTok-Style Interface** - Full-screen vertical video feed
- 🎥 **Video Menu** - Each dish showcased with engaging videos
- 👆 **Gesture Navigation** - Swipe up/down for dishes, left/right for categories
- 🛒 **Smart Cart** - Add items, adjust quantities, checkout seamlessly
- 🔇 **Audio Controls** - Mute/unmute videos on the fly
- 📦 **Instant Orders** - Submit orders directly to kitchen

### Admin Dashboard
- 🏢 **Multi-Restaurant** - Manage multiple locations from one dashboard
- 📂 **Category Management** - Organize menu into categories
- 🍽️ **Dish Management** - Add/edit dishes with rich media
- 📤 **File Upload** - Upload videos (200MB) and images (10MB) directly
- 📊 **Order Management** - Real-time order tracking and status updates
- 📱 **QR Code Generator** - Generate and download QR codes
- 💰 **Analytics** - Revenue tracking and order statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/arsbux/memu.git
cd memu

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080`

### Setup Storage (Required)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/hqopvvwczsgxocnzosce/sql/new)
2. Copy SQL from `setup-storage.sql`
3. Paste and run

See [QUICK_START.md](QUICK_START.md) for detailed setup.

## 📱 Usage

### For Restaurant Owners

1. **Login** to admin dashboard
2. **Create** your restaurant with a unique slug
3. **Add** categories (Starters, Main Course, etc.)
4. **Upload** dishes with videos and thumbnails
5. **Generate** QR code and place on tables

### For Customers

1. **Scan** QR code at table
2. **Browse** menu via video feed
3. **Add** items to cart
4. **Checkout** and submit order
5. **Wait** for delicious food!

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router
- TanStack Query

**Backend:**
- Supabase (PostgreSQL)
- Supabase Storage
- Row Level Security

## 📂 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   ├── user/           # Customer-facing components
│   └── ui/             # UI component library
├── pages/              # Route pages
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API
└── types/              # TypeScript definitions

supabase/
└── migrations/         # Database migrations
```

## 🌐 Deployment

### Netlify (Recommended)

1. Connect repository to Netlify
2. Add environment variables (see [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md))
3. Deploy!

Site will be live at: **menu.atomiclabs.space**

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Get started in 5 minutes
- [CUSTOMER_FLOW_GUIDE.md](CUSTOMER_FLOW_GUIDE.md) - Customer experience walkthrough
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete project overview
- [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) - Deployment guide
- [STORAGE_SETUP.md](STORAGE_SETUP.md) - Storage configuration

## 🔧 Configuration

Environment variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 🎯 Key URLs

```
Customer:
/menu/{restaurant-slug}     # Main menu feed

Admin:
/                           # Login
/admin/dashboard            # Dashboard
/admin/restaurants          # Manage restaurants
/admin/categories           # Manage categories
/admin/dishes               # Manage dishes
/admin/orders               # View orders
/admin/qr-code              # Generate QR codes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)

## 📞 Support

For issues or questions:
- Open an [issue](https://github.com/arsbux/memu/issues)
- Check documentation files
- Review browser console for errors

---

Made with ❤️ for restaurants everywhere
