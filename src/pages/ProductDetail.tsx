
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import ReviewSystem from '@/components/ReviewSystem';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load products from admin-managed data (same as Index.tsx)
    const adminProducts = localStorage.getItem('adminProducts');
    let products = [];
    
    if (adminProducts) {
      products = JSON.parse(adminProducts);
    } else {
      // Default products as fallback
      products = [
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
          inStock: true,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Cream", "White", "Gold"]
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
          inStock: true,
          sizes: ["Free Size"],
          colors: ["Red", "Maroon", "Gold"]
        }
      ];
    }

    const foundProduct = products.find(p => p.id === Number(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default selections
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Product not found</p>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
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

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(numRating);
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
                {imageError ? (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📷</div>
                      <p>Image not available</p>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={handleImageError}
                  />
                )}
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
                      ({product.rating || '4.0'}/5)
                    </span>
                  </div>
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
              {product.sizes && product.sizes.length > 0 && (
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
              {product.colors && product.colors.length > 0 && (
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
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
