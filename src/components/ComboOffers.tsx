
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
            { id: 3, name: "Black Embroidered Bandhgala Jacket", price: 3999, image: "/lovable-uploads/ae3e315a-93ba-47e1-800c-7c311334004f.png" }
          ],
          totalPrice: 6298,
          offerPrice: 4999,
          savings: 1299,
          badge: "WEDDING SPECIAL"
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
        description: `Part of ${combo.title}`
      });
    });
    onClose();
  };

  if (comboOffers.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-bold mb-4">No Active Offers</h2>
          <p className="text-gray-600 mb-4">There are currently no active combo offers available.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

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
                  {combo.badge && (
                    <Badge className="bg-red-500 text-white">
                      {combo.badge}
                    </Badge>
                  )}
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
