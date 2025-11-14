-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready');

-- Create restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, slug)
);

-- Create dishes table
CREATE TABLE dishes ( m
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  total_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  dish_name TEXT NOT NULL
);

-- Create admin_users table (optional, for future auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_dishes_category ON dishes(category_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access to restaurants, categories, and dishes
-- (for menu viewing)
CREATE POLICY "Public can view restaurants" ON restaurants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view dishes" ON dishes
  FOR SELECT USING (is_active = TRUE);

-- Allow public to insert orders (customers can place orders)
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow public to view their own orders (for now, allow all)
-- In production, you might want to add customer tracking
CREATE POLICY "Public can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Public can view order_items" ON order_items
  FOR SELECT USING (true);

-- For admin operations, we'll use service role key or add proper auth later
-- For now, allow all operations (you should restrict this in production)
CREATE POLICY "Admin can manage restaurants" ON restaurants
  FOR ALL USING (true);

CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Admin can manage dishes" ON dishes
  FOR ALL USING (true);

CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE USING (true);

CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

