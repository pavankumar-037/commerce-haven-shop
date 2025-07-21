-- Manual Orders Table Creation Script
-- Run this in your Supabase SQL editor if the orders table doesn't exist

-- First, drop the table if it exists to start fresh
DROP TABLE IF EXISTS public.orders;

-- Create the orders table
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  customer_info jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  coupon_discount decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  applied_coupon jsonb,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  order_status text DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_email ON public.orders (user_email);
CREATE INDEX idx_orders_status ON public.orders (order_status);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production)
CREATE POLICY "Allow all operations on orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

-- Create function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a test record to verify everything works
INSERT INTO public.orders (
  user_email,
  customer_info,
  items,
  subtotal,
  total,
  payment_method
) VALUES (
  'test@example.com',
  '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"1234567890","address":"123 Test St","city":"Test City","state":"Test State","zipCode":"12345"}',
  '[{"id":1,"name":"Test Product","price":99.99,"quantity":1,"image":"/placeholder.svg"}]',
  99.99,
  99.99,
  'test'
);

-- Verify the table was created successfully
SELECT COUNT(*) as record_count FROM public.orders;

-- Clean up the test record
DELETE FROM public.orders WHERE user_email = 'test@example.com';

-- Show table structure
\d public.orders;
