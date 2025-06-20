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
    title: "Premium Men's Ethnic Collection",
    description: "Complete Kurta Set + Bandhgala Jacket + Ethnic Mojaris",
    products: [
      { id: 1, name: "Cream Silk Kurta Pajama Set", price: 2299, image: "/lovable-uploads/c2e7033c-24d2-4791-8ec2-f68e1ea2b10d.png" },
      { id: 3, name: "Black Embroidered Bandhgala Jacket", price: 3999, image: "/lovable-uploads/ae3e315a-93ba-47e1-800c-7c311334004f.png" },
      { id: 39, name: "Gold Ethnic Mojaris", price: 899, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" }
    ],
    totalPrice: 7197,
    offerPrice: 4999,
    savings: 2198,
    badge: "WEDDING SPECIAL"
  },
  {
    id: 2,
    title: "Women's Elegant Saree Collection",
    description: "Designer Sarees with Matching Accessories",
    products: [
      { id: 6, name: "Red Embellished Silk Saree", price: 4999, image: "/lovable-uploads/2372473d-64a9-48f6-99ec-5917a66a92eb.png" },
      { id: 7, name: "Pink Floral Print Saree", price: 3299, image: "/lovable-uploads/40f75af7-ae2f-4195-b3e4-baa86dd15ae0.png" },
      { id: 8, name: "Embroidered Ethnic Juttis", price: 1299, image: "/lovable-uploads/393faa61-dd05-4565-aeb5-60c78d4e41d8.png" }
    ],
    totalPrice: 9597,
    offerPrice: 6999,
    savings: 2598,
    badge: "FESTIVE COLLECTION"
  },
  {
    id: 3,
    title: "Women's Western Style Combo",
    description: "Trendy Dresses with Designer Footwear",
    products: [
      { id: 11, name: "Green Floral Maxi Dress", price: 2299, image: "/lovable-uploads/96263624-bbc8-400e-8bef-222f59cba99a.png" },
      { id: 14, name: "Red Bodycon Dress", price: 2499, image: "/lovable-uploads/a8ceae1e-c31e-4874-9a53-b50afb591439.png" },
      { id: 10, name: "Golden Ethnic Heel Sandals", price: 1899, image: "/lovable-uploads/5f02022c-a6ed-4863-b35e-1b4a01f97feb.png" }
    ],
    totalPrice: 6697,
    offerPrice: 4699,
    savings: 1998,
    badge: "PARTY READY"
  },
  {
    id: 4,
    title: "Men's Formal Business Collection",
    description: "Professional Attire for Office & Business",
    products: [
      { id: 5, name: "Grey Formal Business Suit", price: 4999, image: "/lovable-uploads/ff04eeff-522e-4202-a3e2-ae9322175cc8.png" },
      { id: 2, name: "Peach Silk Traditional Kurta", price: 1899, image: "/lovable-uploads/7aa55311-3e54-4b8d-ab49-f69184926f1e.png" },
      { id: 36, name: "Black Formal Leather Shoes", price: 2299, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" }
    ],
    totalPrice: 9197,
    offerPrice: 6499,
    savings: 2698,
    badge: "OFFICE READY"
  },
  {
    id: 5,
    title: "Women's Casual Chic Bundle",
    description: "Stylish Tops & Comfortable Footwear",
    products: [
      { id: 16, name: "Blue Floral Top", price: 999, image: "/lovable-uploads/68ee88a9-24f0-4523-a557-ff040eeb4760.png" },
      { id: 19, name: "Pink Ruffle Top", price: 1199, image: "/lovable-uploads/b162e3a0-19f8-49d4-b866-a1142d29881a.png" },
      { id: 9, name: "Designer Ethnic Flats", price: 999, image: "/lovable-uploads/e1f8b2d5-5f8d-4ac1-bdc6-ab5c8b96cd7b.png" }
    ],
    totalPrice: 3197,
    offerPrice: 2299,
    savings: 898,
    badge: "CASUAL COMFORT"
  },
  {
    id: 6,
    title: "Kids Festive Special",
    description: "Complete Traditional Outfit for Kids",
    products: [
      { id: 4, name: "Orange Kids Kurta Set", price: 899, image: "/lovable-uploads/13f40017-ba63-4bd7-98ad-f45dc0850d29.png" },
      { id: 52, name: "Pink Girls Lehenga", price: 1299, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
      { id: 53, name: "Yellow Kids T-Shirt", price: 399, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&h=200&fit=crop" }
    ],
    totalPrice: 2597,
    offerPrice: 1799,
    savings: 798,
    badge: "KIDS SPECIAL"
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
