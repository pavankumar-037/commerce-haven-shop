-- Create offers table for managing homepage sections
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  category TEXT NOT NULL CHECK (category IN ('curated', 'trending', 'festival')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create theme_settings table for admin customization
CREATE TABLE public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#f59e0b',
  secondary_color TEXT DEFAULT '#78716c',
  background_color TEXT DEFAULT '#fafaf9',
  accent_color TEXT DEFAULT '#ea580c',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for offers (public read, admin write)
CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage offers" ON public.offers
  FOR ALL USING (true);

-- RLS Policies for theme_settings (public read, admin write)
CREATE POLICY "Anyone can view theme settings" ON public.theme_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage theme settings" ON public.theme_settings
  FOR ALL USING (true);

-- Insert default theme settings
INSERT INTO public.theme_settings (primary_color, secondary_color, background_color, accent_color)
VALUES ('#f59e0b', '#78716c', '#fafaf9', '#ea580c');

-- Insert sample offers
INSERT INTO public.offers (title, description, image_url, category, status) VALUES
('Premium Silk Collection', 'Handcrafted silk sarees and kurtas for special occasions', '/lovable-uploads/2372473d-64a9-48f6-99ec-5917a66a92eb.png', 'curated', 'active'),
('Modern Ethnic Wear', 'Contemporary designs meeting traditional craftsmanship', '/lovable-uploads/96263624-bbc8-400e-8bef-222f59cba99a.png', 'trending', 'active'),
('Festive Celebration', 'Special festival collection with 30% off', '/lovable-uploads/e1f8b2d5-5f8d-4ac1-bdc6-ab5c8b96cd7b.png', 'festival', 'active');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();