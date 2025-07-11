import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string | null;
  category: 'curated' | 'trending' | 'festival';
  status: 'active' | 'inactive';
}

interface Props {
  category: 'curated' | 'trending' | 'festival';
  title: string;
  subtitle?: string;
  className?: string;
}

const DynamicOffersSection = ({ category, title, subtitle, className = '' }: Props) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchOffers();
  }, [category]);

  const fetchOffers = async () => {
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .lte('start_date', currentDate)
        .or(`end_date.is.null,end_date.gte.${currentDate}`)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error(`Error fetching ${category} offers:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (offer: Offer) => {
    // Convert offer to product format for cart
    const product = {
      id: `offer-${offer.id}`,
      name: offer.title,
      price: 999, // Default price for offers
      originalPrice: 1499,
      image: offer.image_url,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      rating: 4.5,
      description: offer.description,
      discount: 33,
      inStock: true
    };
    addToCart(product);
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">{title}</h2>
            {subtitle && <p className="text-stone-600 text-lg">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-stone-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return null; // Don't render section if no active offers
  }

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">{title}</h2>
          {subtitle && <p className="text-stone-600 text-lg">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={offer.image_url}
                  alt={offer.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`
                    ${category === 'curated' ? 'bg-amber-100 text-amber-800' : 
                      category === 'trending' ? 'bg-blue-100 text-blue-800' : 
                      'bg-rose-100 text-rose-800'}
                  `}>
                    {category === 'curated' ? 'Curated' : 
                     category === 'trending' ? 'Trending' : 'Festival'}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                  {offer.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-stone-800">₹999</span>
                    <span className="text-lg text-stone-500 line-through">₹1,499</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      33% OFF
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={() => handleAddToCart(offer)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-stone-300 hover:border-amber-400 hover:text-amber-600"
                    asChild
                  >
                    <Link to={`/product/offer-${offer.id}`}>
                      <Star className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                
                {offer.end_date && (
                  <div className="mt-3 text-xs text-stone-500 text-center">
                    Offer valid until {new Date(offer.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {offers.length >= 6 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-stone-300 hover:border-amber-400 hover:text-amber-600"
            >
              View All {title}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicOffersSection;