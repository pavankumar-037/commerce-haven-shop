
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Star, Filter, Percent, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ComboOffers from '@/components/ComboOffers';

// Indian Clothing Products with uploaded images
const mockProducts = [
  // Women's Dresses with uploaded images
  { id: 1, name: "Green Floral Maxi Dress", price: 2299, originalPrice: 3499, image: "/lovable-uploads/96263624-bbc8-400e-8bef-222f59cba99a.png", category: "Women's Western", rating: 4.6, description: "Beautiful green floral print maxi dress", discount: 34 },
  { id: 2, name: "Pink Floral Mini Dress", price: 1599, originalPrice: 2299, image: "/lovable-uploads/af1bcb88-3340-4c04-9e9e-beba1e570e8f.png", category: "Women's Western", rating: 4.5, description: "Cute pink floral mini dress with puff sleeves", discount: 30 },
  { id: 3, name: "Peach Button-Up Dress", price: 1899, originalPrice: 2799, image: "/lovable-uploads/9b2796b4-4090-42a0-9d03-03bfc52bcdca.png", category: "Women's Western", rating: 4.4, description: "Elegant peach colored button-up dress", discount: 32 },
  { id: 4, name: "Red Bodycon Dress", price: 2499, originalPrice: 3799, image: "/lovable-uploads/a8ceae1e-c31e-4874-9a53-b50afb591439.png", category: "Women's Western", rating: 4.7, description: "Stunning red bodycon midi dress", discount: 34 },
  { id: 5, name: "Brown Collar Sweater", price: 1799, originalPrice: 2599, image: "/lovable-uploads/9797e669-1fd7-4b0b-a823-7ee3dd4846d0.png", category: "Women's Western", rating: 4.3, description: "Brown sweater with white collar", discount: 31 },
  { id: 6, name: "Blue Floral Top", price: 999, originalPrice: 1499, image: "/lovable-uploads/68ee88a9-24f0-4523-a557-ff040eeb4760.png", category: "Women's Western", rating: 4.2, description: "Blue and white floral pattern top", discount: 33 },
  { id: 7, name: "Checkered Vintage Blouse", price: 1299, originalPrice: 1899, image: "/lovable-uploads/6b06f730-d9cb-45c4-ab5d-c63ea3e7853d.png", category: "Women's Western", rating: 4.4, description: "Vintage checkered blouse", discount: 32 },
  { id: 8, name: "Burgundy Vest Dress", price: 2199, originalPrice: 3299, image: "/lovable-uploads/cc9d8896-b9c9-4300-9029-fcd6f837dc76.png", category: "Women's Western", rating: 4.6, description: "Burgundy vest dress with white shirt", discount: 33 },
  { id: 9, name: "Pink Ruffle Top", price: 1199, originalPrice: 1799, image: "/lovable-uploads/b162e3a0-19f8-49d4-b866-a1142d29881a.png", category: "Women's Western", rating: 4.3, description: "Pink ruffle sleeve top", discount: 33 },
  { id: 10, name: "Traditional Lehenga", price: 5999, originalPrice: 8999, image: "/lovable-uploads/895d725f-a8e9-4e50-999d-703d9fc6523a.png", category: "Women's Ethnic", rating: 4.8, description: "Beautiful traditional lehenga", discount: 33 },

  // Men's Ethnic Wear
  { id: 11, name: "Cotton Kurta Set", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.5, description: "Pure cotton kurta with matching pajama", discount: 35 },
  { id: 12, name: "Silk Dhoti Kurta", price: 2499, originalPrice: 3999, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.7, description: "Traditional silk dhoti kurta", discount: 38 },
  { id: 13, name: "Nehru Jacket Set", price: 1899, originalPrice: 2899, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.4, description: "Elegant Nehru jacket with kurta", discount: 34 },
  { id: 14, name: "Bandhgala Suit", price: 4999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.8, description: "Royal bandhgala suit", discount: 38 },
  { id: 15, name: "Pathani Suit", price: 1599, originalPrice: 2299, image: "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.3, description: "Comfortable pathani suit", discount: 30 },

  // Women's Ethnic Sarees
  { id: 16, name: "Banarasi Silk Saree", price: 3999, originalPrice: 6999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Sarees", rating: 4.9, description: "Handwoven Banarasi silk saree", discount: 43 },
  { id: 17, name: "Cotton Saree", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", category: "Sarees", rating: 4.4, description: "Comfortable cotton saree", discount: 35 },
  { id: 18, name: "Designer Georgette Saree", price: 2799, originalPrice: 4299, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Sarees", rating: 4.6, description: "Designer georgette saree", discount: 35 },
  { id: 19, name: "Wedding Silk Saree", price: 5499, originalPrice: 8999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Sarees", rating: 4.8, description: "Elegant wedding silk saree", discount: 39 },
  { id: 20, name: "Printed Chiffon Saree", price: 1899, originalPrice: 2899, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", category: "Sarees", rating: 4.5, description: "Printed chiffon saree", discount: 34 },

  // Women's Shoes
  { id: 21, name: "Ethnic Juttis", price: 799, originalPrice: 1299, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", category: "Women's Shoes", rating: 4.3, description: "Traditional ethnic juttis", discount: 38 },
  { id: 22, name: "High Heel Sandals", price: 1599, originalPrice: 2299, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop", category: "Women's Shoes", rating: 4.4, description: "Elegant high heel sandals", discount: 30 },
  { id: 23, name: "Casual Sneakers", price: 1299, originalPrice: 1899, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop", category: "Women's Shoes", rating: 4.2, description: "Comfortable casual sneakers", discount: 32 },
  { id: 24, name: "Kolhapuri Chappals", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", category: "Women's Shoes", rating: 4.5, description: "Traditional Kolhapuri chappals", discount: 40 },
  { id: 25, name: "Block Heel Pumps", price: 1899, originalPrice: 2799, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop", category: "Women's Shoes", rating: 4.6, description: "Stylish block heel pumps", discount: 32 },

  // Men's Shoes
  { id: 26, name: "Formal Leather Shoes", price: 2299, originalPrice: 3499, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", category: "Men's Shoes", rating: 4.5, description: "Premium leather formal shoes", discount: 34 },
  { id: 27, name: "Casual Loafers", price: 1599, originalPrice: 2299, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop", category: "Men's Shoes", rating: 4.3, description: "Comfortable casual loafers", discount: 30 },
  { id: 28, name: "Sports Sneakers", price: 1999, originalPrice: 2999, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop", category: "Men's Shoes", rating: 4.4, description: "Athletic sports sneakers", discount: 33 },
  { id: 29, name: "Ethnic Mojaris", price: 899, originalPrice: 1399, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", category: "Men's Shoes", rating: 4.2, description: "Traditional mojaris", discount: 36 },
  { id: 30, name: "Oxford Shoes", price: 2799, originalPrice: 3999, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", category: "Men's Shoes", rating: 4.6, description: "Classic Oxford shoes", discount: 30 },

  // Men's Western Wear
  { id: 31, name: "Cotton Casual Shirt", price: 899, originalPrice: 1499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.3, description: "100% cotton casual shirt", discount: 40 },
  { id: 32, name: "Denim Jeans", price: 1599, originalPrice: 2499, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.5, description: "Premium denim jeans", discount: 36 },
  { id: 33, name: "Polo T-Shirt", price: 699, originalPrice: 999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.2, description: "Cotton polo t-shirt", discount: 30 },
  { id: 34, name: "Formal Blazer", price: 2999, originalPrice: 4999, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.7, description: "Formal blazer for office", discount: 40 },
  { id: 35, name: "Cargo Pants", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.1, description: "Multi-pocket cargo pants", discount: 35 },

  // Kids Wear
  { id: 36, name: "Boys Kurta Pajama", price: 799, originalPrice: 1299, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.4, description: "Cotton kurta pajama for boys", discount: 38 },
  { id: 37, name: "Girls Lehenga", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop", category: "Kids", rating: 4.6, description: "Beautiful lehenga for girls", discount: 35 },
  { id: 38, name: "Kids T-Shirt", price: 399, originalPrice: 699, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.2, description: "Comfortable cotton t-shirt", discount: 43 },
  { id: 39, name: "Boys Shorts", price: 499, originalPrice: 799, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop", category: "Kids", rating: 4.1, description: "Cotton shorts for boys", discount: 38 },
  { id: 40, name: "Girls Dress", price: 699, originalPrice: 1199, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.5, description: "Pretty dress for girls", discount: 42 },

  // Additional products to reach 100+
  ...Array.from({ length: 60 }, (_, i) => {
    const categories = ["Men's Ethnic", "Women's Ethnic", "Men's Western", "Women's Western", "Kids", "Sarees", "Men's Shoes", "Women's Shoes"];
    const category = categories[i % categories.length];
    const basePrice = Math.floor(Math.random() * 3000) + 500;
    return {
      id: 41 + i,
      name: `${category} Item ${41 + i}`,
      price: basePrice,
      originalPrice: Math.floor(basePrice * 1.5),
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=400&fit=crop`,
      category: category,
      rating: 4 + Math.random(),
      description: "Premium quality fashion item",
      discount: Math.floor(Math.random() * 30) + 20
    };
  })
];

const Index = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComboOffers, setShowComboOffers] = useState(true);
  const { addToCart, getCartItemsCount } = useCart();

  const categories = ['All', "Men's Ethnic", "Women's Ethnic", "Men's Western", "Women's Western", 'Kids', 'Sarees', "Men's Shoes", "Women's Shoes"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* Big Sales Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">BIG SALES - 100+ Products</h2>
          <div className="flex justify-center space-x-4 mb-6 flex-wrap">
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Women</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Men</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Kids</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Sarees</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Shoes</Badge>
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
                    <span className="text-xs text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
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
                >
                  Add to Cart
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
          <div className="flex justify-center space-x-6">
            <span>Free Shipping</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
