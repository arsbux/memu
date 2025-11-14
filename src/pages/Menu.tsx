import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoReel from '@/components/user/VideoReel';
import CartSidebar from '@/components/user/CartSidebar';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { getRestaurantBySlug, getCategories, getDishes } from '@/lib/supabase/queries';
import { Restaurant, Category, Dish } from '@/types';
import { toast } from 'sonner';

const Menu = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useCart();
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Load restaurant data
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!restaurantSlug) {
        toast.error('Restaurant not found');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Load restaurant
        const restaurantData = await getRestaurantBySlug(restaurantSlug);
        setRestaurant(restaurantData);
        
        // Load categories
        const categoriesData = await getCategories(restaurantData.id);
        if (categoriesData.length === 0) {
          toast.error('No menu categories available');
          return;
        }
        setCategories(categoriesData);
        setCurrentCategoryId(categoriesData[0].id);
        
        // Load all dishes
        const dishesData = await getDishes(restaurantData.id);
        if (dishesData.length === 0) {
          toast.error('No dishes available');
          return;
        }
        setDishes(dishesData);
        
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        toast.error('Failed to load restaurant menu');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantData();
  }, [restaurantSlug, navigate]);

  const currentDishes = dishes.filter(
    (dish) => dish.category_id === currentCategoryId
  );

  const currentDish = currentDishes[currentDishIndex];

  const handleNextDish = () => {
    if (currentDishIndex < currentDishes.length - 1) {
      setCurrentDishIndex(currentDishIndex + 1);
    }
  };

  const handlePrevDish = () => {
    if (currentDishIndex > 0) {
      setCurrentDishIndex(currentDishIndex - 1);
    }
  };

  const handleCategoryChange = (direction: 'next' | 'prev') => {
    const currentIndex = categories.findIndex((cat) => cat.id === currentCategoryId);
    if (direction === 'next' && currentIndex < categories.length - 1) {
      setCurrentCategoryId(categories[currentIndex + 1].id);
      setCurrentDishIndex(0);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentCategoryId(categories[currentIndex - 1].id);
      setCurrentDishIndex(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - next category
        handleCategoryChange('next');
      } else {
        // Swiped right - previous category
        handleCategoryChange('prev');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  // No dishes state
  if (!currentDish || currentDishes.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-white text-xl mb-2">No dishes available</p>
          <p className="text-gray-400">This category is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-full bg-black overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {currentDish && (
        <VideoReel
          dish={currentDish}
          isMuted={isMuted}
          onAddToCart={() => cart.addToCart(currentDish)}
          onNext={handleNextDish}
          onPrev={handlePrevDish}
          hasNext={currentDishIndex < currentDishes.length - 1}
          hasPrev={currentDishIndex > 0}
        />
      )}

      {/* Restaurant name header */}
      {restaurant && (
        <div className="fixed top-4 left-4 z-50">
          <div className="glass rounded-full px-4 py-2">
            <h1 className="text-white font-semibold">{restaurant.name}</h1>
          </div>
        </div>
      )}

      {/* Category indicator */}
      {categories.length > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="glass rounded-full px-4 py-2">
            <p className="text-white text-sm">
              {categories.find(c => c.id === currentCategoryId)?.name}
            </p>
          </div>
        </div>
      )}

      {/* Minimal floating controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="glass rounded-full hover:bg-white/20"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCartOpen(true)}
          className="relative glass rounded-full hover:bg-white/20"
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.getItemCount() > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-in"
            >
              {cart.getItemCount()}
            </Badge>
          )}
        </Button>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantId={restaurant?.id || ''}
        cart={cart}
      />
    </div>
  );
};

export default Menu;
