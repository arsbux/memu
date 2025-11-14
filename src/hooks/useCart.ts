import { useState, useEffect } from 'react';
import { CartItem } from '@/types';

const CART_STORAGE_KEY = 'reelmenu_cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish: { id: string; name: string; price: number; thumbnail_url: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish_id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish_id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          dish_id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          thumbnail_url: dish.thumbnail_url,
        },
      ];
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.dish_id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish_id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
  };
};
