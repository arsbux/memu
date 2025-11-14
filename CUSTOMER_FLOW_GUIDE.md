# Customer Flow Guide

## How the Customer Experience Works

### 1. Admin Setup (First Time)
1. Go to admin dashboard: `http://localhost:8080/`
2. Login (use the simple auth)
3. Create a restaurant with a slug (e.g., "my-restaurant")
4. Add categories (e.g., "Starters", "Main Course")
5. Add dishes with videos and thumbnails
6. Go to QR Code page and download/print the QR code

### 2. Customer Scans QR Code
When a customer scans the QR code, they'll be directed to:
```
http://localhost:8080/menu/{restaurant-slug}
```

For example:
- `http://localhost:8080/menu/my-restaurant`
- `http://localhost:8080/menu/pizza-palace`
- `http://localhost:8080/menu/burger-joint`

### 3. Customer Menu Experience

**What the customer sees:**
- Full-screen TikTok-style video feed
- Restaurant name in top-left corner
- Current category name at the top center
- Mute/unmute button in top-right
- Shopping cart button in top-right
- Dish details overlay at the bottom:
  - Dish name
  - Description
  - Price
  - "Add to Cart" button

**Navigation:**
- **Swipe Up/Down** - Navigate between dishes in the same category
- **Swipe Left/Right** - Switch between categories
- **Tap video** - Pause/play (hold to pause)
- **Tap mute icon** - Toggle sound
- **Tap cart icon** - Open cart sidebar

### 4. Adding Items to Cart
1. Customer watches a dish video
2. Taps "Add to Cart" button
3. Badge appears on cart icon showing item count
4. Can continue browsing and adding more items

### 5. Checkout Process
1. Customer taps cart icon
2. Cart sidebar opens showing:
   - All added items with thumbnails
   - Quantity controls (+/-)
   - Remove item button (X)
   - Total price
3. Customer can adjust quantities
4. Taps "Checkout" button
5. Order is sent to kitchen (saved in database)
6. Success message appears
7. Cart is cleared

### 6. Admin Receives Order
1. Admin goes to Orders page
2. Sees new order with "Pending" status
3. Can update status to:
   - **Preparing** - Kitchen is working on it
   - **Ready** - Order is ready for pickup/delivery

## Testing the Flow

### Quick Test Steps:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Setup admin side:**
   - Go to `http://localhost:8080/`
   - Login
   - Create restaurant: "test-restaurant"
   - Add category: "Appetizers"
   - Add a dish with video and thumbnail
   - Note the restaurant slug

3. **Test customer side:**
   - Open new browser tab/window
   - Go to `http://localhost:8080/menu/test-restaurant`
   - Should see the video feed
   - Try swiping, adding to cart, checkout

4. **Verify order:**
   - Go back to admin dashboard
   - Check Orders page
   - Should see the new order

## URL Structure

```
Customer URLs:
/menu/{restaurant-slug}          - Main menu feed

Admin URLs:
/                                - Admin login
/admin/dashboard                 - Dashboard
/admin/restaurants               - Manage restaurants
/admin/categories                - Manage categories
/admin/dishes                    - Manage dishes
/admin/orders                    - View/manage orders
/admin/qr-code                   - Generate QR codes
```

## Mobile Experience

The customer menu is optimized for mobile:
- Full-screen vertical videos
- Touch gestures for navigation
- Responsive cart sidebar
- Mobile-friendly buttons and controls

Test on mobile by:
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://YOUR_IP:8080/menu/restaurant-slug`
3. Or use browser dev tools mobile emulation

## Troubleshooting

**Menu shows "No dishes available":**
- Make sure you've added dishes in the admin panel
- Check that dishes are marked as "active"
- Verify the restaurant slug in the URL matches your restaurant

**Videos not playing:**
- Check that video URLs are valid
- Ensure videos are uploaded to Supabase storage
- Try using sample video URLs for testing

**Orders not appearing:**
- Check browser console for errors
- Verify Supabase connection
- Make sure restaurant ID is being passed correctly

**QR code not working:**
- Ensure the URL format is correct
- Test the URL manually in a browser first
- Check that the restaurant slug is correct
