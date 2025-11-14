# Storage Setup Guide

## Setting Up Supabase Storage Buckets

To enable video uploads in the admin dashboard, you need to set up storage buckets in Supabase.

### Option 1: Run the Migration (Recommended)

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply the migration file `supabase/migrations/002_storage_buckets.sql`.

### Option 2: Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Create two new buckets:

#### Bucket 1: dish-videos
- Name: `dish-videos`
- Public: ✅ Yes
- File size limit: 100MB (recommended)
- Allowed MIME types: `video/*`

#### Bucket 2: dish-thumbnails
- Name: `dish-thumbnails`
- Public: ✅ Yes
- File size limit: 5MB (recommended)
- Allowed MIME types: `image/*`

4. Set up policies for each bucket (or use the SQL from the migration file)

### Testing the Upload Feature

1. Log in to the admin dashboard
2. Go to **Dishes** page
3. Click **Add Dish** or edit an existing dish
4. You'll see two upload sections:
   - **Video**: Upload video files (max 100MB) or paste a URL
   - **Thumbnail**: Upload image files (max 5MB) or paste a URL
5. Select files from your computer and submit the form

### File Naming Convention

Uploaded files are automatically named with the pattern:
```
{restaurantId}/{timestamp}.{extension}
```

This ensures unique filenames and organizes files by restaurant.

### Notes

- Videos are stored with public access for easy playback
- The form shows live previews of selected files
- You can still use external URLs if you prefer
- File uploads happen when you submit the form
- Upload progress is indicated with a loading state
