
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Star, Filter, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ComboOffers from '@/components/ComboOffers';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComboOffers, setShowComboOffers] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, getCartItemsCount } = useCart();

  const heroSlides = [
    {
      title: "Curated Elegance",
      subtitle: "For Every Occasion - Traditional & Modern Wear",
      bg: "from-purple-600 to-pink-600"
    },
    {
      title: "Trending Now",
      subtitle: "Discover the Latest Fashion Collections",
      bg: "from-blue-600 to-teal-600"
    },
    {
      title: "Festival Special",
      subtitle: "Celebrate in Style with Premium Ethnic Wear",
      bg: "from-orange-500 to-red-600"
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Combo Offers Modal */}
      {showComboOffers && (
        <ComboOffers onClose={() => setShowComboOffers(false)} />
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b sticky top-0 z-40">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
          🎉 FREE SHIPPING ON ORDERS ABOVE ₹999 | COD AVAILABLE 🎉
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StyleHub
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="pl-10 rounded-full border-2 focus:border-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowComboOffers(true)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                <Gift className="w-5 h-5 mr-2" />
                Offers
              </Button>
              <Link to="/track-order" className="text-gray-600 hover:text-purple-600 text-sm font-medium">
                Track Order
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-purple-600 text-sm font-medium">
                Contact
              </Link>
              <Link to="/auth" className="text-gray-600 hover:text-purple-600">
                <User className="w-6 h-6" />
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-purple-600">
                <ShoppingCart className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`min-w-full bg-gradient-to-r ${slide.bg} text-white py-20 flex-shrink-0`}
            >
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                <p className="text-xl mb-8 animate-fade-in">{slide.subtitle}</p>
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
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

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg mb-8">Discover the latest trends in ethnic and modern fashion</p>
          
          {/* Category Tags */}
          <div className="flex justify-center space-x-4 mb-8 flex-wrap">
            {['Women', 'Men', 'Kids', 'Accessories'].map(category => (
              <Badge 
                key={category}
                variant="outline" 
                className="text-lg px-6 py-3 mb-2 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto bg-white rounded-full p-2 shadow-md">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'hover:bg-purple-50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
              {product.discount && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  {product.discount}% OFF
                </div>
              )}
              
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-2 hover:text-purple-600 transition-colors line-clamp-2 text-gray-800">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 ml-1">{product.rating?.toFixed(1) || '4.0'}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-purple-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full text-xs py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold"
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
            <p className="text-gray-500 text-xl">No products found matching your search.</p>
            <Button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            StyleHub
          </h3>
          <p className="text-gray-300 mb-8 text-lg">Your trusted partner for authentic fashion</p>
          <div className="flex justify-center space-x-8 mb-6 text-sm">
            <Link to="/track-order" className="text-gray-300 hover:text-purple-400 transition-colors">Track Order</Link>
            <span className="text-gray-500">•</span>
            <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact Us</Link>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">24/7 Support</span>
          </div>
          <Link to="/admin/login" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
            Admin Portal
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
