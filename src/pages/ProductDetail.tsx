import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ReviewSystem from '@/components/ReviewSystem';

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
    const foundProduct = mockProducts.find(p => p.id === Number(id)) || mockProducts[0];
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
            <ReviewSystem productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
