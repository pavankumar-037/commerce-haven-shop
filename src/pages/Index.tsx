
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Star, Filter, Percent, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ComboOffers from '@/components/ComboOffers';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComboOffers, setShowComboOffers] = useState(true);
  const { addToCart, getCartItemsCount } = useCart();

  useEffect(() => {
    // Load products from admin-managed data or use defaults
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
      const parsedProducts = JSON.parse(adminProducts);
      setProducts(parsedProducts);
    } else {
      // Initialize with default products if none exist
      const defaultProducts = [
        {
          id: 1,
          name: "Cream Silk Kurta Pajama Set",
          price: 2299,
          originalPrice: 3499,
          image: "/lovable-uploads/c2e7033c-24d2-4791-8ec2-f68e1ea2b10d.png",
          category: "Men's Ethnic",
          rating: 4.8,
          description: "Premium cream silk kurta with matching pajama, perfect for weddings",
          discount: 34,
          inStock: true
        },
        {
          id: 2,
          name: "Red Embellished Silk Saree",
          price: 4999,
          originalPrice: 7499,
          image: "/lovable-uploads/2372473d-64a9-48f6-99ec-5917a66a92eb.png",
          category: "Sarees",
          rating: 4.9,
          description: "Stunning red silk saree with golden embellishments",
          discount: 33,
          inStock: true
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.inStock;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Combo Offers Modal */}
      {showComboOffers && (
        <ComboOffers onClose={() => setShowComboOffers(false)} />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="bg-primary text-white text-center py-2 text-sm">
          🎉 FREE SHIPPING ON ORDERS ABOVE ₹999 | COD AVAILABLE 🎉
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                IndiaFashion
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="pl-10"
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
                className="text-red-600 hover:text-red-700"
              >
                <Gift className="w-5 h-5 mr-2" />
                Offers
              </Button>
              <Link to="/track-order" className="text-gray-600 hover:text-primary text-sm">
                Track Order
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary text-sm">
                Contact
              </Link>
              <Link to="/auth" className="text-gray-600 hover:text-primary">
                <User className="w-6 h-6" />
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-primary">
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

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Curated Elegance</h1>
          <p className="text-xl mb-8">For Every Occasion - Traditional & Modern Wear</p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            Shop Now
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <div className="flex justify-center space-x-4 mb-6 flex-wrap">
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Women</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Men</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Kids</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Sarees</Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  {product.discount}% OFF
                </div>
              )}
              
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
              
              <div className="p-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 ml-1">{product.rating?.toFixed(1) || '4.0'}</span>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full text-xs py-2"
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">IndiaFashion</h3>
          <p className="text-gray-300 mb-6">Your trusted partner for authentic Indian fashion</p>
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/track-order" className="text-gray-300 hover:text-white">Track Order</Link>
            <span>•</span>
            <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
          <Link to="/admin/login" className="text-gray-400 text-sm hover:text-white">
            Admin Portal
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
