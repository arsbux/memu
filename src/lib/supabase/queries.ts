import { supabase } from '@/integrations/supabase/client';
import type { Restaurant, Category, Dish, Order, OrderItem, OrderStatus } from '@/types';

// ========== RESTAURANTS ==========

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data as Restaurant[];
}

export async function getRestaurantBySlug(slug: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error) throw error;
  return data as Restaurant;
}

export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Restaurant;
}

export async function createRestaurant(restaurant: Omit<Restaurant, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert(restaurant)
    .select()
    .single();
  
  if (error) throw error;
  return data as Restaurant;
}

export async function updateRestaurant(id: string, updates: Partial<Restaurant>) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Restaurant;
}

export async function deleteRestaurant(id: string) {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ========== CATEGORIES ==========

export async function getCategories(restaurantId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data as Category[];
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Category;
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ========== DISHES ==========

export async function getDishes(restaurantId: string) {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data as Dish[];
}

export async function getDishesByCategory(restaurantId: string, categoryId: string) {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data as Dish[];
}

export async function getDishById(id: string) {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Dish;
}

export async function createDish(dish: Omit<Dish, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('dishes')
    .insert(dish)
    .select()
    .single();
  
  if (error) throw error;
  return data as Dish;
}

export async function updateDish(id: string, updates: Partial<Dish>) {
  const { data, error } = await supabase
    .from('dishes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Dish;
}

export async function deleteDish(id: string) {
  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ========== ORDERS ==========

export async function getOrders(restaurantId?: string, status?: OrderStatus) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Order;
}

export async function getOrderWithItems(id: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (orderError) throw orderError;
  
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);
  
  if (itemsError) throw itemsError;
  
  return {
    ...order,
    items: items || []
  } as Order & { items: OrderItem[] };
}

export async function createOrder(order: {
  restaurant_id: string;
  total_amount: number;
  items: Array<{
    dish_id: string | null;
    quantity: number;
    price: number;
    dish_name: string;
  }>;
}) {
  // Create order
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: order.restaurant_id,
      total_amount: order.total_amount,
      status: 'pending'
    })
    .select()
    .single();
  
  if (orderError) throw orderError;
  
  // Create order items
  const orderItems = order.items.map(item => ({
    order_id: newOrder.id,
    dish_id: item.dish_id,
    quantity: item.quantity,
    price: item.price,
    dish_name: item.dish_name
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) throw itemsError;
  
  return newOrder as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Order;
}

export async function getOrderItems(orderId: string) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('dish_name');
  
  if (error) throw error;
  return data as OrderItem[];
}


