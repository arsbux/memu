import { useState, useRef } from 'react';
import { Dish, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadVideo, uploadThumbnail } from '@/lib/supabase/storage';
import { Upload, Video, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';

interface DishFormProps {
  dish: Dish | null;
  categories: Category[];
  onSave: (dish: Dish) => void;
  onCancel: () => void;
}

const DishForm = ({ dish, categories, onSave, onCancel }: DishFormProps) => {
  const { currentRestaurant } = useRestaurant();
  const [formData, setFormData] = useState<Partial<Dish>>(
    dish || {
      name: '',
      description: '',
      price: 0,
      category_id: categories[0]?.id || '',
      video_url: '',
      thumbnail_url: '',
      is_active: true,
      display_order: 0,
    }
  );
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>(dish?.video_url || '');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(dish?.thumbnail_url || '');
  const [uploading, setUploading] = useState(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Accept any video type
      if (file.size > 200 * 1024 * 1024) { // 200MB limit (increased)
        toast.error('Video file size must be less than 200MB');
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Accept any image type
      if (file.size > 10 * 1024 * 1024) { // 10MB limit (increased)
        toast.error('Image file size must be less than 10MB');
        return;
      }
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview(dish?.video_url || '');
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(dish?.thumbnail_url || '');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!currentRestaurant) {
      toast.error('No restaurant selected');
      return;
    }

    try {
      setUploading(true);
      let videoUrl = formData.video_url || '';
      let thumbnailUrl = formData.thumbnail_url || '';

      // Upload video if a new file is selected
      if (videoFile) {
        toast.info('Uploading video...');
        videoUrl = await uploadVideo(videoFile, currentRestaurant.id);
      }

      // Upload thumbnail if a new file is selected
      if (thumbnailFile) {
        toast.info('Uploading thumbnail...');
        thumbnailUrl = await uploadThumbnail(thumbnailFile, currentRestaurant.id);
      }

      const dishData = {
        ...formData,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      };

      onSave(dishData as Dish);
      toast.success(dish ? 'Dish updated!' : 'Dish created!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="glass border-white/20 animate-fade-in">
      <CardHeader>
        <CardTitle>{dish ? 'Edit Dish' : 'Add New Dish'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dish Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Paneer Tikka"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="299"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Video</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="Or paste video URL..."
                    disabled={!!videoFile}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
                
                {videoPreview && (
                  <div className="relative glass rounded-lg p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 z-10"
                      onClick={clearVideo}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-48 rounded"
                    />
                    {videoFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <Video className="w-3 h-3 inline mr-1" />
                        {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Thumbnail</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="Or paste thumbnail URL..."
                    disabled={!!thumbnailFile}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.svg"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>
                
                {thumbnailPreview && (
                  <div className="relative glass rounded-lg p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 z-10"
                      onClick={clearThumbnail}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-h-48 object-cover rounded"
                    />
                    {thumbnailFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                        {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0}/200 characters
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-primary-glow"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>{dish ? 'Update' : 'Create'} Dish</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DishForm;
