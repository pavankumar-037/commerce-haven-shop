
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
    title: "Buy 3 Pay for 2",
    description: "Mix & Match any 3 items from ethnic wear",
    products: [
      { id: 1, name: "Cotton Kurta", price: 1299, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=200&h=200&fit=crop" },
      { id: 2, name: "Silk Dupatta", price: 599, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop" },
      { id: 3, name: "Cotton Palazzo", price: 899, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop" }
    ],
    totalPrice: 2797,
    offerPrice: 1898,
    savings: 899,
    badge: "BESTSELLER"
  },
  {
    id: 2,
    title: "Couple's Combo",
    description: "His & Her matching ethnic sets",
    products: [
      { id: 4, name: "Men's Kurta Set", price: 1599, image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d3be?w=200&h=200&fit=crop" },
      { id: 5, name: "Women's Anarkali", price: 2299, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop" }
    ],
    totalPrice: 3898,
    offerPrice: 2999,
    savings: 899,
    badge: "ROMANTIC"
  },
  {
    id: 3,
    title: "Family Pack",
    description: "Complete family ethnic wear set",
    products: [
      { id: 6, name: "Men's Kurta", price: 1299, image: "https://images.unsplash.com/photo-1622445275576-721325763eda?w=200&h=200&fit=crop" },
      { id: 7, name: "Women's Kurti", price: 799, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop" },
      { id: 8, name: "Kids Kurta", price: 799, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&h=200&fit=crop" },
      { id: 9, name: "Kids Lehenga", price: 1299, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" }
    ],
    totalPrice: 4196,
    offerPrice: 2999,
    savings: 1197,
    badge: "FAMILY SPECIAL"
  },
  {
    id: 4,
    title: "Western Wear Combo",
    description: "Complete western wardrobe essentials",
    products: [
      { id: 10, name: "Casual Shirt", price: 899, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop" },
      { id: 11, name: "Denim Jeans", price: 1599, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
      { id: 12, name: "T-Shirt", price: 699, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" }
    ],
    totalPrice: 3197,
    offerPrice: 2399,
    savings: 798,
    badge: "TRENDING"
  }
];

const ComboOffers = ({ onClose }: ComboOffersProps) => {
  const [selectedCombo, setSelectedCombo] = useState<number | null>(null);
  const { addToCart } = useCart();

  const handleAddComboToCart = (combo: typeof comboOffers[0]) => {
    combo.products.forEach(product => {
      addToCart({
        ...product,
        price: Math.floor(combo.offerPrice / combo.products.length), // Distribute offer price
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
              Special Combo Offers
            </h2>
            <p className="text-gray-600">Limited time deals - Save big on combo purchases!</p>
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

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {combo.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
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
              <li>• Free shipping on all combo orders</li>
              <li>• 30-day easy returns</li>
              <li>• Gift wrapping available</li>
              <li>• Earn loyalty points on every purchase</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOffers;
