-- Fix the LPAD function issue in order number generation
-- The previous function had type casting issues with LPAD

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS set_order_number();

-- Recreate the function with proper type casting
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  epoch_part TEXT;
BEGIN
  -- Generate a unique order number using timestamp and random component
  epoch_part := LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 100000)::TEXT, 5, '0');
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || epoch_part;
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Alternative simpler function that doesn't use LPAD
CREATE OR REPLACE FUNCTION generate_simple_order_number()
RETURNS TEXT AS $$
BEGIN
  -- Generate order number with timestamp and random suffix
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || FLOOR(RANDOM() * 10000)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger function to use the simpler version
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_simple_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_set_order_number ON public.orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();
