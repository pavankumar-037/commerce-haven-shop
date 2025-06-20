
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Star, Filter, Percent, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ComboOffers from '@/components/ComboOffers';

// Indian Clothing Products (100+ items)
const mockProducts = [
  // Men's Ethnic Wear
  { id: 1, name: "Men's Cotton Kurta Set", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.5, description: "Pure cotton kurta with matching pajama", discount: 35 },
  { id: 2, name: "Silk Dhoti Kurta", price: 2499, originalPrice: 3999, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.7, description: "Traditional silk dhoti kurta for festivals", discount: 38 },
  { id: 3, name: "Nehru Jacket Set", price: 1899, originalPrice: 2899, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.4, description: "Elegant Nehru jacket with kurta", discount: 34 },
  { id: 4, name: "Bandhgala Suit", price: 4999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.8, description: "Royal bandhgala suit for weddings", discount: 38 },
  { id: 5, name: "Pathani Suit", price: 1599, originalPrice: 2299, image: "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.3, description: "Comfortable pathani suit", discount: 30 },
  
  // Women's Ethnic Wear
  { id: 6, name: "Banarasi Silk Saree", price: 3999, originalPrice: 6999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.9, description: "Handwoven Banarasi silk saree", discount: 43 },
  { id: 7, name: "Anarkali Suit Set", price: 2299, originalPrice: 3499, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.6, description: "Beautiful Anarkali with dupatta", discount: 34 },
  { id: 8, name: "Lehenga Choli", price: 5999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.8, description: "Designer lehenga for weddings", discount: 40 },
  { id: 9, name: "Cotton Kurti", price: 799, originalPrice: 1299, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.2, description: "Comfortable cotton kurti", discount: 38 },
  { id: 10, name: "Palazzo Set", price: 1199, originalPrice: 1899, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.4, description: "Trendy palazzo with kurta", discount: 37 },

  // Men's Western Wear
  { id: 11, name: "Cotton Casual Shirt", price: 899, originalPrice: 1499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.3, description: "100% cotton casual shirt", discount: 40 },
  { id: 12, name: "Denim Jeans", price: 1599, originalPrice: 2499, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.5, description: "Premium denim jeans", discount: 36 },
  { id: 13, name: "Polo T-Shirt", price: 699, originalPrice: 999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.2, description: "Cotton polo t-shirt", discount: 30 },
  { id: 14, name: "Formal Blazer", price: 2999, originalPrice: 4999, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.7, description: "Formal blazer for office", discount: 40 },
  { id: 15, name: "Cargo Pants", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.1, description: "Multi-pocket cargo pants", discount: 35 },

  // Women's Western Wear
  { id: 16, name: "Casual Top", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop", category: "Women's Western", rating: 4.3, description: "Trendy casual top", discount: 40 },
  { id: 17, name: "High Waist Jeans", price: 1399, originalPrice: 2199, image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop", category: "Women's Western", rating: 4.6, description: "High waist skinny jeans", discount: 36 },
  { id: 18, name: "Maxi Dress", price: 1199, originalPrice: 1899, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop", category: "Women's Western", rating: 4.4, description: "Elegant maxi dress", discount: 37 },
  { id: 19, name: "Crop Top", price: 499, originalPrice: 799, image: "https://images.unsplash.com/photo-1564342196976-0e4869ba7fd3?w=400&h=400&fit=crop", category: "Women's Western", rating: 4.2, description: "Stylish crop top", discount: 38 },
  { id: 20, name: "Blazer Jacket", price: 2199, originalPrice: 3499, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Women's Western", rating: 4.5, description: "Professional blazer", discount: 37 },

  // Kids Wear
  { id: 21, name: "Boys Kurta Pajama", price: 799, originalPrice: 1299, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.4, description: "Cotton kurta pajama for boys", discount: 38 },
  { id: 22, name: "Girls Lehenga", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop", category: "Kids", rating: 4.6, description: "Beautiful lehenga for girls", discount: 35 },
  { id: 23, name: "Kids T-Shirt", price: 399, originalPrice: 699, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.2, description: "Comfortable cotton t-shirt", discount: 43 },
  { id: 24, name: "Boys Shorts", price: 499, originalPrice: 799, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop", category: "Kids", rating: 4.1, description: "Cotton shorts for boys", discount: 38 },
  { id: 25, name: "Girls Dress", price: 699, originalPrice: 1199, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", category: "Kids", rating: 4.5, description: "Pretty dress for girls", discount: 42 },

  // Accessories
  { id: 26, name: "Silk Dupatta", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Accessories", rating: 4.3, description: "Elegant silk dupatta", discount: 40 },
  { id: 27, name: "Leather Belt", price: 799, originalPrice: 1299, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", category: "Accessories", rating: 4.4, description: "Genuine leather belt", discount: 38 },
  { id: 28, name: "Cotton Stole", price: 399, originalPrice: 699, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop", category: "Accessories", rating: 4.2, description: "Soft cotton stole", discount: 43 },
  { id: 29, name: "Ethnic Jewelry Set", price: 1299, originalPrice: 2199, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Accessories", rating: 4.7, description: "Traditional jewelry set", discount: 41 },
  { id: 30, name: "Handbag", price: 999, originalPrice: 1699, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", category: "Accessories", rating: 4.3, description: "Stylish handbag", discount: 41 },

  // Additional Products to reach 100+
  { id: 31, name: "Cotton Pyjama Set", price: 899, originalPrice: 1399, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.3, description: "Comfortable cotton pyjama", discount: 36 },
  { id: 32, name: "Designer Kurta", price: 1599, originalPrice: 2499, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop", category: "Men's Ethnic", rating: 4.6, description: "Designer printed kurta", discount: 36 },
  { id: 33, name: "Formal Shirt", price: 1099, originalPrice: 1799, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.4, description: "Formal office shirt", discount: 39 },
  { id: 34, name: "Chinos", price: 1399, originalPrice: 2199, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop", category: "Men's Western", rating: 4.5, description: "Slim fit chinos", discount: 36 },
  { id: 35, name: "Printed Saree", price: 1999, originalPrice: 3199, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", category: "Women's Ethnic", rating: 4.5, description: "Beautiful printed saree", discount: 38 },

  // Continue adding more products...
  ...Array.from({ length: 65 }, (_, i) => ({
    id: 36 + i,
    name: `Fashion Item ${36 + i}`,
    price: Math.floor(Math.random() * 3000) + 500,
    originalPrice: Math.floor(Math.random() * 2000) + 1000,
    image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=400&fit=crop`,
    category: ["Men's Ethnic", "Women's Ethnic", "Men's Western", "Women's Western", "Kids", "Accessories"][Math.floor(Math.random() * 6)],
    rating: 4 + Math.random(),
    description: "Premium quality clothing item",
    discount: Math.floor(Math.random() * 30) + 20
  })).map(item => ({
    ...item,
    originalPrice: Math.floor(item.price * 1.5)
  }))
];

const Index = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComboOffers, setShowComboOffers] = useState(true);
  const { addToCart, getCartItemsCount } = useCart();

  const categories = ['All', "Men's Ethnic", "Women's Ethnic", "Men's Western", "Women's Western", 'Kids', 'Accessories'];

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
          <h2 className="text-3xl font-bold mb-4">BIG SALES</h2>
          <div className="flex justify-center space-x-4 mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2">Women</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Men</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Kids</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Accessories</Badge>
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
