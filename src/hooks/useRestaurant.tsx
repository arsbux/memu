import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Restaurant } from '@/types';
import { getRestaurants, getRestaurantById } from '@/lib/supabase/queries';

interface RestaurantContextType {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  loading: boolean;
  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const RESTAURANT_STORAGE_KEY = 'reelmenu_current_restaurant';

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurantState] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
      
      // Try to restore last selected restaurant
      const storedId = localStorage.getItem(RESTAURANT_STORAGE_KEY);
      if (storedId && !currentRestaurant) {
        try {
          const restaurant = await getRestaurantById(storedId);
          if (data.find(r => r.id === restaurant.id)) {
            setCurrentRestaurantState(restaurant);
          } else if (data.length > 0) {
            // If stored restaurant not found, use first available
            setCurrentRestaurantState(data[0]);
            localStorage.setItem(RESTAURANT_STORAGE_KEY, data[0].id);
          }
        } catch {
          // If stored restaurant not found, use first available
          if (data.length > 0) {
            setCurrentRestaurantState(data[0]);
            localStorage.setItem(RESTAURANT_STORAGE_KEY, data[0].id);
          }
        }
      } else if (data.length > 0 && !currentRestaurant) {
        // No stored restaurant, use first available
        setCurrentRestaurantState(data[0]);
        localStorage.setItem(RESTAURANT_STORAGE_KEY, data[0].id);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRestaurants();
  }, []);

  const setCurrentRestaurant = (restaurant: Restaurant | null) => {
    setCurrentRestaurantState(restaurant);
    if (restaurant) {
      localStorage.setItem(RESTAURANT_STORAGE_KEY, restaurant.id);
    } else {
      localStorage.removeItem(RESTAURANT_STORAGE_KEY);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        currentRestaurant,
        setCurrentRestaurant,
        loading,
        refreshRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

