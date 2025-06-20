
import { useState } from 'react';
import { X, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

interface ComboOffersProps {
  onClose: () => void;
}

const comboOffers = [
  {
    id: 1,
    title: "Women's Fashion Complete Set",
    description: "Mix & Match - Dress, Shoes & Accessories",
    products: [
      { id: 1, name: "Green Floral Maxi Dress", price: 2299, image: "/lovable-uploads/96263624-bbc8-400e-8bef-222f59cba99a.png" },
      { id: 21, name: "Ethnic Juttis", price: 799, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" },
      { id: 26, name: "Silk Dupatta", price: 599, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop" }
    ],
    totalPrice: 3697,
    offerPrice: 2499,
    savings: 1198,
    badge: "BESTSELLER"
  },
  {
    id: 2,
    title: "Couple's Traditional Combo",
    description: "His & Her ethnic wear with matching accessories",
    products: [
      { id: 11, name: "Men's Cotton Kurta Set", price: 1299, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=200&h=200&fit=crop" },
      { id: 10, name: "Traditional Lehenga", price: 5999, image: "/lovable-uploads/895d725f-a8e9-4e50-999d-703d9fc6523a.png" },
      { id: 29, name: "Men's Ethnic Mojaris", price: 899, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" }
    ],
    totalPrice: 8197,
    offerPrice: 5999,
    savings: 2198,
    badge: "WEDDING SPECIAL"
  },
  {
    id: 3,
    title: "Modern Western Combo",
    description: "Trendy western wear collection",
    products: [
      { id: 2, name: "Pink Floral Mini Dress", price: 1599, image: "/lovable-uploads/af1bcb88-3340-4c04-9e9e-beba1e570e8f.png" },
      { id: 4, name: "Red Bodycon Dress", price: 2499, image: "/lovable-uploads/a8ceae1e-c31e-4874-9a53-b50afb591439.png" },
      { id: 22, name: "High Heel Sandals", price: 1599, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop" }
    ],
    totalPrice: 5697,
    offerPrice: 3999,
    savings: 1698,
    badge: "PARTY READY"
  },
  {
    id: 4,
    title: "Saree & Accessories Bundle",
    description: "Complete saree collection with matching items",
    products: [
      { id: 16, name: "Banarasi Silk Saree", price: 3999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop" },
      { id: 18, name: "Designer Georgette Saree", price: 2799, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=200&h=200&fit=crop" },
      { id: 24, name: "Kolhapuri Chappals", price: 599, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" }
    ],
    totalPrice: 7397,
    offerPrice: 4999,
    savings: 2398,
    badge: "FESTIVE COLLECTION"
  },
  {
    id: 5,
    title: "Men's Complete Wardrobe",
    description: "Ethnic & Western wear with shoes",
    products: [
      { id: 31, name: "Cotton Casual Shirt", price: 899, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop" },
      { id: 32, name: "Denim Jeans", price: 1599, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
      { id: 26, name: "Formal Leather Shoes", price: 2299, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" }
    ],
    totalPrice: 4797,
    offerPrice: 3299,
    savings: 1498,
    badge: "OFFICE READY"
  }
];

const ComboOffers = ({ onClose }: ComboOffersProps) => {
  const [selectedCombo, setSelectedCombo] = useState<number | null>(null);
  const { addToCart } = useCart();

  const handleAddComboToCart = (combo: typeof comboOffers[0]) => {
    combo.products.forEach(product => {
      addToCart({
        ...product,
        price: Math.floor(combo.offerPrice / combo.products.length),
        category: "Combo Offer",
        rating: 4.5,
        description: `Part of ${combo.title}`
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <Gift className="w-6 h-6 mr-2" />
              Special Fashion Combo Offers
            </h2>
            <p className="text-gray-600">Limited time deals - Mix & Match Fashion at Best Prices!</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comboOffers.map((combo) => (
              <div 
                key={combo.id} 
                className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
                  selectedCombo === combo.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{combo.title}</h3>
                    <p className="text-gray-600 mb-3">{combo.description}</p>
                  </div>
                  <Badge className="bg-red-500 text-white">
                    {combo.badge}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4">
                  {combo.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <span className="text-sm line-through text-gray-500">₹{combo.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-primary">Combo Price:</span>
                    <span className="text-xl font-bold text-primary">₹{combo.offerPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600 font-medium">You Save:</span>
                    <span className="text-lg font-bold text-green-600">₹{combo.savings}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">4.5+ Rating</span>
                  </div>
                  <Button 
                    onClick={() => handleAddComboToCart(combo)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Add Combo to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">🎉 Additional Benefits:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Free shipping on all combo orders above ₹999</li>
              <li>• 30-day easy returns & exchanges</li>
              <li>• Gift wrapping available</li>
              <li>• Earn loyalty points on every purchase</li>
              <li>• Mix & match different categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOffers;
