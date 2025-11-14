import { Dish } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DishOverlayProps {
  dish: Dish;
  onAddToCart: () => void;
}

const DishOverlay = ({ dish, onAddToCart }: DishOverlayProps) => {
  const handleAddToCart = () => {
    onAddToCart();
    toast.success(`${dish.name} added to cart!`, {
      duration: 2000,
    });
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-2xl animate-slide-up">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{dish.name}</h2>
        <p className="text-lg text-gray-200 mb-3 line-clamp-2 drop-shadow-md">
          {dish.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent drop-shadow-lg">
            ₹{dish.price}
          </span>
          <Button
            onClick={handleAddToCart}
            className="pointer-events-auto bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 text-lg px-6 py-6 rounded-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DishOverlay;
