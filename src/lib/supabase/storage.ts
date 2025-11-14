import { supabase } from '@/integrations/supabase/client';

const VIDEOS_BUCKET = 'dish-videos';
const THUMBNAILS_BUCKET = 'dish-thumbnails';

export async function uploadVideo(file: File, restaurantId: string): Promise<string> {
  try {
    console.log('Starting video upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;

    console.log('Uploading to path:', fileName);

    const { data, error } = await supabase.storage
      .from(VIDEOS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload video: ${error.message}`);
    }

    console.log('Upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from(VIDEOS_BUCKET)
      .getPublicUrl(data.path);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Video upload failed:', error);
    throw error;
  }
}

export async function uploadThumbnail(file: File, restaurantId: string): Promise<string> {
  try {
    console.log('Starting thumbnail upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;

    console.log('Uploading to path:', fileName);

    const { data, error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }

    console.log('Upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from(THUMBNAILS_BUCKET)
      .getPublicUrl(data.path);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Thumbnail upload failed:', error);
    throw error;
  }
}

export async function deleteVideo(url: string): Promise<void> {
  try {
    const path = url.split(`${VIDEOS_BUCKET}/`)[1];
    if (path) {
      await supabase.storage.from(VIDEOS_BUCKET).remove([path]);
    }
  } catch (error) {
    console.error('Error deleting video:', error);
  }
}

export async function deleteThumbnail(url: string): Promise<void> {
  try {
    const path = url.split(`${THUMBNAILS_BUCKET}/`)[1];
    if (path) {
      await supabase.storage.from(THUMBNAILS_BUCKET).remove([path]);
    }
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
  }
}
