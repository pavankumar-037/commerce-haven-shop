import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Star, Filter, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ComboOffers from '@/components/ComboOffers';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComboOffers, setShowComboOffers] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);
  const { addToCart, getCartItemsCount } = useCart();

  const defaultHeroSlides = [
    {
      title: "Curated Elegance",
      subtitle: "For Every Occasion - Traditional & Modern Wear",
      bgGradient: "from-amber-200/80 via-orange-200/80 to-yellow-300/80",
      overlayGradient: "bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-yellow-100/90"
    },
    {
      title: "Trending Now",
      subtitle: "Discover the Latest Fashion Collections",
      bgGradient: "from-slate-300/80 via-stone-200/80 to-neutral-300/80",
      overlayGradient: "bg-gradient-to-br from-slate-50/90 via-stone-50/80 to-neutral-100/90"
    },
    {
      title: "Festival Special",
      subtitle: "Celebrate in Style with Premium Ethnic Wear",
      bgGradient: "from-rose-200/80 via-pink-200/80 to-red-300/80",
      overlayGradient: "bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-red-100/90"
    }
  ];

  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    // Load site settings
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSiteSettings(settings);
      
      // Use admin-controlled carousel slides if available
      if (settings.appearance?.carouselSlides && settings.appearance.carouselSlides.length > 0) {
        setHeroSlides(settings.appearance.carouselSlides);
      }
    }

    // Load products
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
      const parsedProducts = JSON.parse(adminProducts);
      setProducts(parsedProducts);
    } else {
      const defaultProducts = [
        // Men's Collection
        {
          id: 1,
          name: "Cream Silk Kurta Pajama Set",
          price: 2299,
          originalPrice: 3499,
          image: "/lovable-uploads/c2e7033c-24d2-4791-8ec2-f68e1ea2b10d.png",
          category: "Men",
          rating: 4.8,
          description: "Premium cream silk kurta with matching pajama, perfect for weddings",
          discount: 34,
          inStock: true
        },
        {
          id: 2,
          name: "Black Embroidered Bandhgala",
          price: 3999,
          originalPrice: 5999,
          image: "/lovable-uploads/ae3e315a-93ba-47e1-800c-7c311334004f.png",
          category: "Men",
          rating: 4.7,
          description: "Elegant black bandhgala with intricate embroidery",
          discount: 33,
          inStock: true
        },
        {
          id: 3,
          name: "Navy Blue Nehru Jacket",
          price: 1899,
          originalPrice: 2499,
          image: "/lovable-uploads/9797e669-1fd7-4b0b-a823-7ee3dd4846d0.png",
          category: "Men",
          rating: 4.6,
          description: "Contemporary navy Nehru jacket for modern gentlemen",
          discount: 24,
          inStock: true
        },
        {
          id: 4,
          name: "Maroon Velvet Sherwani",
          price: 5499,
          originalPrice: 7999,
          image: "/lovable-uploads/b162e3a0-19f8-49d4-b866-a1142d29881a.png",
          category: "Men",
          rating: 4.9,
          description: "Luxurious maroon velvet sherwani with gold detailing",
          discount: 31,
          inStock: true
        },
        // Women's Collection
        {
          id: 5,
          name: "Red Embellished Silk Saree",
          price: 4999,
          originalPrice: 7499,
          image: "/lovable-uploads/2372473d-64a9-48f6-99ec-5917a66a92eb.png",
          category: "Women",
          rating: 4.9,
          description: "Stunning red silk saree with golden embellishments",
          discount: 33,
          inStock: true
        },
        {
          id: 6,
          name: "Pink Designer Lehenga",
          price: 6999,
          originalPrice: 9999,
          image: "/lovable-uploads/96263624-bbc8-400e-8bef-222f59cba99a.png",
          category: "Women",
          rating: 4.8,
          description: "Beautiful pink lehenga with intricate mirror work",
          discount: 30,
          inStock: true
        },
        {
          id: 7,
          name: "Green Silk Anarkali",
          price: 3499,
          originalPrice: 4999,
          image: "/lovable-uploads/cc9d8896-b9c9-4300-9029-fcd6f837dc76.png",
          category: "Women",
          rating: 4.7,
          description: "Elegant green Anarkali suit with golden work",
          discount: 30,
          inStock: true
        },
        {
          id: 8,
          name: "Royal Blue Sharara Set",
          price: 4299,
          originalPrice: 5999,
          image: "/lovable-uploads/68ee88a9-24f0-4523-a557-ff040eeb4760.png",
          category: "Women",
          rating: 4.6,
          description: "Trendy sharara set in royal blue with heavy dupatta",
          discount: 28,
          inStock: true
        },
        {
          id: 9,
          name: "Golden Banarasi Saree",
          price: 5999,
          originalPrice: 8999,
          image: "/lovable-uploads/e1f8b2d5-5f8d-4ac1-bdc6-ab5c8b96cd7b.png",
          category: "Women",
          rating: 4.9,
          description: "Traditional Banarasi saree in golden with zari work",
          discount: 33,
          inStock: true
        },
        // Kids Collection
        {
          id: 10,
          name: "Boys Dhoti Kurta Set",
          price: 1299,
          originalPrice: 1899,
          image: "/lovable-uploads/40f75af7-ae2f-4195-b3e4-baa86dd15ae0.png",
          category: "Kids",
          rating: 4.5,
          description: "Adorable dhoti kurta set for little boys",
          discount: 32,
          inStock: true
        },
        {
          id: 11,
          name: "Girls Lehenga Choli",
          price: 1599,
          originalPrice: 2299,
          image: "/lovable-uploads/7aa55311-3e54-4b8d-ab49-f69184926f1e.png",
          category: "Kids",
          rating: 4.6,
          description: "Beautiful lehenga choli for little princesses",
          discount: 30,
          inStock: true
        },
        {
          id: 12,
          name: "Kids Party Wear Suit",
          price: 999,
          originalPrice: 1499,
          image: "/lovable-uploads/895d725f-a8e9-4e50-999d-703d9fc6523a.png",
          category: "Kids",
          rating: 4.4,
          description: "Stylish party wear suit for kids",
          discount: 33,
          inStock: true
        },
        // Accessories
        {
          id: 13,
          name: "Traditional Juttis",
          price: 899,
          originalPrice: 1299,
          image: "/lovable-uploads/5f02022c-a6ed-4863-b35e-1b4a01f97feb.png",
          category: "Accessories",
          rating: 4.3,
          description: "Handcrafted traditional juttis with embroidery",
          discount: 31,
          inStock: true
        },
        {
          id: 14,
          name: "Silk Stole Collection",
          price: 699,
          originalPrice: 999,
          image: "/lovable-uploads/6b06f730-d9cb-45c4-ab5d-c63ea3e7853d.png",
          category: "Accessories",
          rating: 4.5,
          description: "Premium silk stoles in various colors",
          discount: 30,
          inStock: true
        },
        {
          id: 15,
          name: "Designer Handbag",
          price: 1499,
          originalPrice: 2199,
          image: "/lovable-uploads/9b2796b4-4090-42a0-9d03-03bfc52bcdca.png",
          category: "Accessories",
          rating: 4.4,
          description: "Elegant designer handbag for ethnic wear",
          discount: 32,
          inStock: true
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.inStock;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleTrendingClick = () => {
    if (siteSettings?.appearance?.trendingCollectionLink?.startsWith('#')) {
      const element = document.querySelector(siteSettings.appearance.trendingCollectionLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (siteSettings?.appearance?.trendingCollectionLink) {
      window.location.href = siteSettings.appearance.trendingCollectionLink;
    }
  };

  const handleOffersClick = () => {
    if (siteSettings?.appearance?.offerCollectionLink?.startsWith('#')) {
      setShowComboOffers(true);
    } else if (siteSettings?.appearance?.offerCollectionLink) {
      window.location.href = siteSettings.appearance.offerCollectionLink;
    } else {
      setShowComboOffers(true);
    }
  };

  // Dynamic color styling based on admin settings
  const primaryColor = siteSettings?.appearance?.primaryColor || '#f59e0b';
  const secondaryColor = siteSettings?.appearance?.secondaryColor || '#78716c';
  const accentColor = siteSettings?.appearance?.accentColor || '#ea580c';

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-slate-50">
      {/* Custom CSS for dynamic colors */}
      <style>
        {`
          .dynamic-primary { background-color: ${primaryColor} !important; }
          .dynamic-primary-hover:hover { background-color: ${primaryColor}dd !important; }
          .dynamic-secondary { color: ${secondaryColor} !important; }
          .dynamic-accent { background-color: ${accentColor} !important; }
          .dynamic-gradient { 
            background: linear-gradient(135deg, ${primaryColor}22 0%, ${accentColor}33 100%) !important; 
          }
        `}
      </style>

      {/* Combo Offers Modal */}
      {showComboOffers && (
        <ComboOffers onClose={() => setShowComboOffers(false)} />
      )}

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 sticky top-0 z-40">
        {siteSettings?.appearance?.showPromoBanner && (
          <div 
            className="text-white text-center py-2 text-sm font-medium dynamic-gradient"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` 
            }}
          >
            {siteSettings.appearance.promoBanner}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-stone-800">
                {siteSettings?.general?.siteName || 'StyleHub'}
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="pl-10 rounded-full border-stone-300 focus:border-amber-400 bg-stone-50/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleOffersClick}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
              >
                <Gift className="w-5 h-5 mr-2" />
                Offers
              </Button>
              <Link to="/track-order" className="text-stone-600 hover:text-amber-600 text-sm font-medium">
                Track Order
              </Link>
              <Link to="/contact" className="text-stone-600 hover:text-amber-600 text-sm font-medium">
                Contact
              </Link>
              <Link to="/auth" className="text-stone-600 hover:text-amber-600">
                <User className="w-6 h-6" />
              </Link>
              <Link to="/cart" className="relative text-stone-600 hover:text-amber-600">
                <ShoppingCart className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 text-white">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel with Admin-Controlled Slides */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`min-w-full bg-gradient-to-br ${slide.bgGradient} relative flex-shrink-0`}
            >
              <div className={`absolute inset-0 ${slide.overlayGradient}`} />
              <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="backdrop-blur-sm bg-white/20 rounded-3xl p-12 border border-white/30 shadow-2xl">
                  {siteSettings?.appearance?.heroThumbnail && (
                    <img 
                      src={siteSettings.appearance.heroThumbnail} 
                      alt="Hero" 
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-white/50 shadow-lg"
                    />
                  )}
                  <h1 className="text-6xl font-bold mb-4 text-stone-800 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 text-stone-700 animate-fade-in">
                    {slide.subtitle}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      size="lg" 
                      className="text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                      style={{ 
                        backgroundColor: primaryColor,
                        '--tw-shadow-color': `${primaryColor}44`
                      }}
                    >
                      Shop Now
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-stone-400 text-stone-700 hover:bg-stone-100 font-semibold px-8 py-3 rounded-full"
                      onClick={handleTrendingClick}
                    >
                      Trending
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-stone-700 rounded-full backdrop-blur-sm"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-stone-700 rounded-full backdrop-blur-sm"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Collections Preview Section */}
      <div id="trending" className="py-16 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-stone-800">
              Featured Collections
            </h2>
            <p className="text-stone-600 text-lg mb-8">Discover the latest trends in ethnic and modern fashion</p>
          </div>
          
          {/* Collection Categories with Transparent Backgrounds */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {['Women', 'Men', 'Kids', 'Accessories'].map(category => (
              <div 
                key={category}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="bg-gradient-to-br from-white/60 to-stone-100/40 backdrop-blur-sm rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-white/30">
                  <div className="text-4xl mb-4">
                    {category === 'Women' ? '👗' : category === 'Men' ? '👔' : category === 'Kids' ? '🧸' : '👜'}
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">{category}</h3>
                  <p className="text-stone-600 text-sm">New Arrivals</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-stone-200">
          <Filter className="w-5 h-5 text-stone-600 flex-shrink-0 ml-4" />
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full ${
                  selectedCategory === category 
                    ? 'text-white' 
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
                style={selectedCategory === category ? {
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
                } : {}}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-stone-200/50">
              {product.discount && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  {product.discount}% OFF
                </div>
              )}
              
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-2 hover:text-amber-600 transition-colors line-clamp-2 text-stone-800">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-stone-600 ml-1">{product.rating?.toFixed(1) || '4.0'}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-700 border-stone-300">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold" style={{ color: primaryColor }}>₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full text-xs py-2 text-white rounded-lg font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` 
                  }}
                  size="sm"
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-stone-500 text-xl">No products found matching your search.</p>
            <Button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              style={{ backgroundColor: primaryColor }}
              className="mt-4 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-stone-800 to-slate-800 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
            {siteSettings?.general?.siteName || 'StyleHub'}
          </h3>
          <p className="text-stone-300 mb-8 text-lg">
            {siteSettings?.general?.siteDescription || 'Your trusted partner for authentic fashion'}
          </p>
          <div className="flex justify-center space-x-8 mb-6 text-sm">
            <Link to="/track-order" className="text-stone-300 hover:text-amber-400 transition-colors">Track Order</Link>
            <span className="text-stone-500">•</span>
            <Link to="/contact" className="text-stone-300 hover:text-amber-400 transition-colors">Contact Us</Link>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300">24/7 Support</span>
          </div>
          <Link to="/admin/login" className="text-stone-400 text-sm hover:text-amber-400 transition-colors">
            Admin Portal
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
