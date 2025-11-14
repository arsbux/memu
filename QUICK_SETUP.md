# Quick Storage Setup Guide

## Problem
Video uploads are failing because the Supabase storage buckets don't exist yet.

## Solution - 3 Easy Steps

### Step 1: Go to Supabase SQL Editor
1. Open your browser and go to: https://supabase.com/dashboard/project/hqopvvwczsgxocnzosce/sql/new
2. You should see a SQL editor

### Step 2: Copy and Run the SQL

**If buckets DON'T exist yet:**
1. Open the file `setup-storage.sql` in this project
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL editor
4. Click "Run" button

**If buckets ALREADY exist (you see the error):**
1. Open the file `fix-buckets.sql` instead
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL editor
4. Click "Run" button

### Step 3: Verify
After running the SQL, you should see a success message showing 2 buckets:
- `dish-videos` (max 200MB, accepts ALL file types)
- `dish-thumbnails` (max 10MB, accepts ALL file types)

## Alternative: Manual Setup via Dashboard

If you prefer using the UI:

1. Go to: https://supabase.com/dashboard/project/hqopvvwczsgxocnzosce/storage/buckets

2. Create first bucket:
   - Click "New bucket"
   - Name: `dish-videos`
   - Public: ✅ YES
   - File size limit: 100 MB
   - Allowed MIME types: `video/mp4, video/webm, video/ogg, video/quicktime`
   - Click "Create bucket"

3. Create second bucket:
   - Click "New bucket"
   - Name: `dish-thumbnails`
   - Public: ✅ YES
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
   - Click "Create bucket"

4. Set policies for BOTH buckets:
   - Click on bucket name
   - Go to "Policies" tab
   - Click "New policy"
   - Select "For full customization"
   - Policy name: "Allow all operations"
   - Target roles: `public`
   - Check ALL boxes: SELECT, INSERT, UPDATE, DELETE
   - USING expression: `true`
   - WITH CHECK expression: `true`
   - Click "Save policy"

## Test the Upload

1. Start your dev server: `npm run dev`
2. Go to admin dashboard
3. Navigate to Dishes
4. Click "Add Dish"
5. Try uploading a video file
6. Check browser console for detailed logs

## Troubleshooting

If uploads still fail:
- Check browser console for error messages
- Verify buckets exist in Supabase dashboard
- Verify policies are set to allow public access
- Make sure your `.env` file has correct Supabase credentials
