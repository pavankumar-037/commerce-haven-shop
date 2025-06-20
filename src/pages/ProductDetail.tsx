import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

// Enhanced Indian product data
const mockProducts = [
  {
    id: 1,
    name: "Men's Premium Cotton Kurta Set",
    price: 1299,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=600&h=600&fit=crop",
    category: "Men's Ethnic",
    rating: 4.5,
    description: "Elegant cotton kurta set perfect for festivals and special occasions. Made from 100% pure cotton with intricate embroidery work. Includes matching pajama. Available in multiple colors and sizes.",
    reviews: [
      { id: 1, user: "Rajesh Kumar", rating: 5, comment: "Excellent quality! Perfect fit and very comfortable." },
      { id: 2, user: "Amit Sharma", rating: 4, comment: "Good material but delivery was slightly delayed." },
      { id: 3, user: "Suresh Patel", rating: 5, comment: "Worth every rupee. Highly recommended!" }
    ],
    discount: 35,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Blue", "Black"]
  },
  {
    id: 2,
    name: "Silk Dhoti Kurta",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop",
    category: "Men's Ethnic",
    rating: 4.7,
    description: "Traditional silk dhoti kurta for festivals",
    discount: 38,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gold", "Maroon", "Cream"]
  },
  {
    id: 3,
    name: "Nehru Jacket Set",
    price: 1899,
    originalPrice: 2899,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop",
    category: "Men's Ethnic",
    rating: 4.4,
    description: "Elegant Nehru jacket with kurta",
    discount: 34,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Grey", "Black"]
  },
  {
    id: 4,
    name: "Bandhgala Suit",
    price: 4999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    category: "Men's Ethnic",
    rating: 4.8,
    description: "Royal bandhgala suit for weddings",
    discount: 38,
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Wine", "Navy"]
  },
  {
    id: 5,
    name: "Pathani Suit",
    price: 1599,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?w=400&h=400&fit=crop",
    category: "Men's Ethnic",
    rating: 4.3,
    description: "Comfortable pathani suit",
    discount: 30,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Beige", "Grey"]
  },
  {
    id: 6,
    name: "Banarasi Silk Saree",
    price: 3999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    category: "Women's Ethnic",
    rating: 4.9,
    description: "Handwoven Banarasi silk saree",
    discount: 43,
    inStock: true,
    sizes: ["Free Size"],
    colors: ["Red", "Green", "Gold"]
  },
  {
    id: 7,
    name: "Anarkali Suit Set",
    price: 2299,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    category: "Women's Ethnic",
    rating: 4.6,
    description: "Beautiful Anarkali with dupatta",
    discount: 34,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "White"]
  },
  {
    id: 8,
    name: "Lehenga Choli",
    price: 5999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop",
    category: "Women's Ethnic",
    rating: 4.8,
    description: "Designer lehenga for weddings",
    discount: 40,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Red", "Gold", "Maroon"]
  },
  {
    id: 9,
    name: "Cotton Kurti",
    price: 799,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop",
    category: "Women's Ethnic",
    rating: 4.2,
    description: "Comfortable cotton kurti",
    discount: 38,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Green", "Yellow"]
  },
  {
    id: 10,
    name: "Palazzo Set",
    price: 1199,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    category: "Women's Ethnic",
    rating: 4.4,
    description: "Trendy palazzo with kurta",
    discount: 37,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Grey"]
  },
  {
    id: 11,
    name: "Cotton Casual Shirt",
    price: 899,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    category: "Men's Western",
    rating: 4.3,
    description: "100% cotton casual shirt",
    discount: 40,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "White", "Grey"]
  },
  {
    id: 12,
    name: "Denim Jeans",
    price: 1599,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    category: "Men's Western",
    rating: 4.5,
    description: "Premium denim jeans",
    discount: 36,
    inStock: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Black", "Grey"]
  },
  {
    id: 13,
    name: "Polo T-Shirt",
    price: 699,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Men's Western",
    rating: 4.2,
    description: "Cotton polo t-shirt",
    discount: 30,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Blue", "Green"]
  },
  {
    id: 14,
    name: "Formal Blazer",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    category: "Men's Western",
    rating: 4.7,
    description: "Formal blazer for office",
    discount: 40,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Grey"]
  },
  {
    id: 15,
    name: "Cargo Pants",
    price: 1299,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
    category: "Men's Western",
    rating: 4.1,
    description: "Multi-pocket cargo pants",
    discount: 35,
    inStock: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Green", "Beige", "Black"]
  },
  {
    id: 16,
    name: "Casual Top",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    category: "Women's Western",
    rating: 4.3,
    description: "Trendy casual top",
    discount: 40,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Pink", "Blue"]
  },
  {
    id: 17,
    name: "High Waist Jeans",
    price: 1399,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop",
    category: "Women's Western",
    rating: 4.6,
    description: "High waist skinny jeans",
    discount: 36,
    inStock: true,
    sizes: ["26", "28", "30", "32"],
    colors: ["Blue", "Black", "Grey"]
  },
  {
    id: 18,
    name: "Maxi Dress",
    price: 1199,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    category: "Women's Western",
    rating: 4.4,
    description: "Elegant maxi dress",
    discount: 37,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Green"]
  },
  {
    id: 19,
    name: "Crop Top",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1564342196976-0e4869ba7fd3?w=400&h=400&fit=crop",
    category: "Women's Western",
    rating: 4.2,
    description: "Stylish crop top",
    discount: 38,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Black", "White", "Pink"]
  },
  {
    id: 20,
    name: "Blazer Jacket",
    price: 2199,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=400&h=400&fit=crop",
    category: "Women's Western",
    rating: 4.5,
    description: "Professional blazer",
    discount: 37,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Grey"]
  },
  {
    id: 21,
    name: "Boys Kurta Pajama",
    price: 799,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop",
    category: "Kids",
    rating: 4.4,
    description: "Cotton kurta pajama for boys",
    discount: 38,
    inStock: true,
    sizes: ["2", "4", "6", "8"],
    colors: ["Blue", "White", "Yellow"]
  },
  {
    id: 22,
    name: "Girls Lehenga",
    price: 1299,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop",
    category: "Kids",
    rating: 4.6,
    description: "Beautiful lehenga for girls",
    discount: 35,
    inStock: true,
    sizes: ["2", "4", "6", "8"],
    colors: ["Pink", "Red", "Gold"]
  },
  {
    id: 23,
    name: "Kids T-Shirt",
    price: 399,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop",
    category: "Kids",
    rating: 4.2,
    description: "Comfortable cotton t-shirt",
    discount: 43,
    inStock: true,
    sizes: ["2", "4", "6", "8"],
    colors: ["Blue", "Green", "Yellow"]
  },
  {
    id: 24,
    name: "Boys Shorts",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop",
    category: "Kids",
    rating: 4.1,
    description: "Cotton shorts for boys",
    discount: 38,
    inStock: true,
    sizes: ["2", "4", "6", "8"],
    colors: ["Blue", "Grey", "Black"]
  },
  {
    id: 25,
    name: "Girls Dress",
    price: 699,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop",
    category: "Kids",
    rating: 4.5,
    description: "Pretty dress for girls",
    discount: 42,
    inStock: true,
    sizes: ["2", "4", "6", "8"],
    colors: ["Pink", "White", "Red"]
  },
  {
    id: 26,
    name: "Silk Dupatta",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.3,
    description: "Elegant silk dupatta",
    discount: 40,
    inStock: true,
    sizes: ["Free Size"],
    colors: ["Red", "Green", "Gold"]
  },
  {
    id: 27,
    name: "Leather Belt",
    price: 799,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.4,
    description: "Genuine leather belt",
    discount: 38,
    inStock: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Black", "Brown"]
  },
  {
    id: 28,
    name: "Cotton Stole",
    price: 399,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.2,
    description: "Soft cotton stole",
    discount: 43,
    inStock: true,
    sizes: ["Free Size"],
    colors: ["White", "Beige", "Grey"]
  },
  {
    id: 29,
    name: "Ethnic Jewelry Set",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.7,
    description: "Traditional jewelry set",
    discount: 41,
    inStock: true,
    sizes: ["Free Size"],
    colors: ["Gold", "Silver"]
  },
  {
    id: 30,
    name: "Handbag",
    price: 999,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.3,
    description: "Stylish handbag",
    discount: 41,
    inStock: true,
    sizes: ["Free Size"],
    colors: ["Black", "Brown", "Beige"]
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    // For demo, we'll use the first product for all IDs
    const foundProduct = mockProducts[0];
    setProduct(foundProduct);
    if (foundProduct?.sizes) setSelectedSize(foundProduct.sizes[0]);
    if (foundProduct?.colors) setSelectedColor(foundProduct.colors[0]);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      description: `${product.description} | Size: ${selectedSize} | Color: ${selectedColor}`
    }, quantity);
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative">
                {product.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
                    {product.discount}% OFF
                  </Badge>
                )}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating}/5)
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.reviews?.length || 0} reviews
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-orange-600">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <Badge className="bg-green-500">Save ₹{product.originalPrice - product.price}</Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Size</h3>
                  <div className="flex space-x-2">
                    {product.sizes.map(size => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Color</h3>
                  <div className="flex space-x-2">
                    {product.colors.map(color => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[50px]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🚚 Delivery Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Free delivery on orders above ₹999</li>
                  <li>• Cash on Delivery available</li>
                  <li>• Easy returns within 30 days</li>
                  <li>• Estimated delivery: 3-5 business days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews?.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-4">{review.user}</span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
