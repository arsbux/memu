-- Run this SQL in your Supabase SQL Editor to set up storage buckets
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- Step 1: Create the buckets if they don't exist (NULL = accept all file types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('dish-videos', 'dish-videos', true, 104857600, NULL),
  ('dish-thumbnails', 'dish-thumbnails', true, 5242880, NULL)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Step 2: Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete thumbnails" ON storage.objects;

-- Step 3: Create policies for dish-videos bucket (completely open)
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dish-videos');

CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'dish-videos');

CREATE POLICY "Anyone can update videos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'dish-videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'dish-videos');

-- Step 4: Create policies for dish-thumbnails bucket (completely open)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dish-thumbnails');

CREATE POLICY "Anyone can upload thumbnails"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'dish-thumbnails');

CREATE POLICY "Anyone can update thumbnails"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'dish-thumbnails');

CREATE POLICY "Anyone can delete thumbnails"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'dish-thumbnails');

-- Verify the setup
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('dish-videos', 'dish-thumbnails');
