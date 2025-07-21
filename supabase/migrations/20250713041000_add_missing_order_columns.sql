-- Add missing columns to orders table to match the application code
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_info JSONB,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS coupon_discount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS applied_coupon JSONB;

-- Also add a column mapping for total_amount -> total for compatibility
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2);

-- Update existing records to have the total column match total_amount
UPDATE public.orders SET total = total_amount WHERE total IS NULL;

-- Create a function to auto-populate total from total_amount if total is not provided
CREATE OR REPLACE FUNCTION sync_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- If total is not provided but total_amount is, copy it
  IF NEW.total IS NULL AND NEW.total_amount IS NOT NULL THEN
    NEW.total := NEW.total_amount;
  END IF;
  
  -- If total_amount is not provided but total is, copy it
  IF NEW.total_amount IS NULL AND NEW.total IS NOT NULL THEN
    NEW.total_amount := NEW.total;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync totals
DROP TRIGGER IF EXISTS trigger_sync_order_totals ON public.orders;
CREATE TRIGGER trigger_sync_order_totals
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION sync_order_totals();
