
import { useState, useEffect } from 'react';
import { X, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

interface ComboOffersProps {
  onClose: () => void;
}

const ComboOffers = ({ onClose }: ComboOffersProps) => {
  const [comboOffers, setComboOffers] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load combo offers from admin-managed data
    const adminOffers = localStorage.getItem('adminOffers');
    if (adminOffers) {
      const parsedOffers = JSON.parse(adminOffers);
      // Only show active offers that are currently valid
      const activeOffers = parsedOffers.filter(offer => 
        offer.isActive && 
        new Date(offer.validFrom) <= new Date() && 
        new Date(offer.validTo) >= new Date()
      );
      setComboOffers(activeOffers);
    } else {
      // Fallback to default offers if none exist
      const defaultOffers = [
        {
          id: 1,
          title: "Premium Men's Ethnic Collection",
          description: "Complete Kurta Set + Bandhgala Jacket",
          products: [
            { id: 1, name: "Cream Silk Kurta Pajama Set", price: 2299, image: "/lovable-uploads/c2e7033c-24d2-4791-8ec2-f68e1ea2b10d.png" },
            { id: 2, name: "Black Embroidered Bandhgala", price: 3999, image: "/lovable-uploads/ae3e315a-93ba-47e1-800c-7c311334004f.png" }
          ],
          totalPrice: 6298,
          offerPrice: 4999,
          savings: 1299,
          badge: "WEDDING SPECIAL"
        },
        {
          id: 2,
          title: "Royal Women's Collection",
          description: "Designer Saree + Matching Accessories",
          products: [
            { id: 5, name: "Red Embellished Silk Saree", price: 4999, image: "/lovable-uploads/2372473d-64a9-48f6-99ec-5917a66a92eb.png" },
            { id: 13, name: "Traditional Juttis", price: 899, image: "/lovable-uploads/5f02022c-a6ed-4863-b35e-1b4a01f97feb.png" }
          ],
          totalPrice: 5898,
          offerPrice: 4499,
          savings: 1399,
          badge: "FESTIVAL OFFER"
        }
      ];
      setComboOffers(defaultOffers);
    }
  }, []);

  const handleAddComboToCart = (combo) => {
    combo.products.forEach(product => {
      addToCart({
        ...product,
        price: Math.floor(combo.offerPrice / combo.products.length),
        category: "Combo Offer",
        rating: 4.5,
        description: `Part of ${combo.title}`,
        inStock: true
      });
    });
    onClose();
  };

  if (comboOffers.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Active Offers</h2>
          <p className="text-gray-600 mb-6">There are currently no active combo offers available.</p>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 px-8">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-b p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <Gift className="w-8 h-8 mr-3" />
              Special Fashion Combo Offers
            </h2>
            <p className="text-purple-100 mt-2">Limited time deals - Mix & Match Fashion at Best Prices!</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comboOffers.map((combo) => (
              <div 
                key={combo.id} 
                className={`border-2 rounded-2xl p-6 transition-all hover:shadow-xl ${
                  selectedCombo === combo.id ? 'border-purple-400 bg-purple-50 shadow-lg' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{combo.title}</h3>
                    <p className="text-gray-600 mb-4 text-lg">{combo.description}</p>
                  </div>
                  {combo.badge && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-sm font-bold">
                      {combo.badge}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  {combo.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-1">{product.name}</p>
                        <p className="text-sm text-gray-500">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <span className="text-sm line-through text-gray-500 font-medium">₹{combo.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-purple-700">Combo Price:</span>
                    <span className="text-2xl font-bold text-purple-700">₹{combo.offerPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-green-600 font-medium">You Save:</span>
                    <span className="text-xl font-bold text-green-600">₹{combo.savings}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-700 ml-1 font-medium">4.5+ Rating</span>
                  </div>
                  <Button 
                    onClick={() => handleAddComboToCart(combo)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Add Combo to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h4 className="font-bold text-yellow-800 mb-4 text-xl">🎉 Additional Benefits:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Free shipping on all combo orders above ₹999
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  30-day easy returns & exchanges
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Gift wrapping available
                </li>
              </ul>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Earn loyalty points on every purchase
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Mix & match different categories
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOffers;
