export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  video_url: string;
  thumbnail_url: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface CartItem {
  dish_id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail_url: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready';

export interface Order {
  id: string;
  restaurant_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string | null;
  quantity: number;
  price: number;
  dish_name: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
