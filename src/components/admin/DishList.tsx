import { Dish, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface DishListProps {
  dishes: Dish[];
  categories: Category[];
  onEdit: (dish: Dish) => void;
  onDelete: (dishId: string) => void;
}

const DishList = ({ dishes, categories, onEdit, onDelete }: DishListProps) => {
  const [previewDish, setPreviewDish] = useState<Dish | null>(null);

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleDelete = (dish: Dish) => {
    if (confirm(`Delete "${dish.name}"?`)) {
      onDelete(dish.id);
      toast.success('Dish deleted');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dishes.map((dish) => (
        <Card key={dish.id} className="glass border-white/20 overflow-hidden animate-fade-in">
          <div className="relative group">
            <img
              src={dish.thumbnail_url}
              alt={dish.name}
              className="w-full h-48 object-cover"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setPreviewDish(dish)}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{dish.name}</DialogTitle>
                </DialogHeader>
                <video
                  src={dish.video_url}
                  controls
                  autoPlay
                  loop
                  className="w-full rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{dish.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dish.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent font-bold">₹{dish.price}</p>
                <p className="text-xs text-muted-foreground">
                  {getCategoryName(dish.category_id)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(dish)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleDelete(dish)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DishList;
