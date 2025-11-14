-- Quick fix to remove MIME type restrictions from existing buckets
-- Run this in Supabase SQL Editor if you already created the buckets

UPDATE storage.buckets 
SET 
  allowed_mime_types = NULL,
  file_size_limit = 209715200  -- 200MB for videos
WHERE id = 'dish-videos';

UPDATE storage.buckets 
SET 
  allowed_mime_types = NULL,
  file_size_limit = 10485760  -- 10MB for thumbnails
WHERE id = 'dish-thumbnails';

-- Verify the changes
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('dish-videos', 'dish-thumbnails');
