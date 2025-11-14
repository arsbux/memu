-- Create storage buckets for dish videos and thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('dish-videos', 'dish-videos', true, 104857600, NULL),
  ('dish-thumbnails', 'dish-thumbnails', true, 5242880, NULL)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up storage policies for dish-videos bucket (completely open)
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

-- Set up storage policies for dish-thumbnails bucket (completely open)
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
