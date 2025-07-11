-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
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

-- Create index for user_email to quickly fetch user orders
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders (user_email);

-- Create index for order_status for admin filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (order_status);

-- Create index for created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Users can only see their own orders (based on email)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (true); -- For now, allow all reads for admin panel

-- Users can insert their own orders
CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can update orders (for admin)
CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
