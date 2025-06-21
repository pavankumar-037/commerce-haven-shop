
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Gift,
  Calendar,
  Tag,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface ComboOffer {
  id: number;
  title: string;
  description: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
  }>;
  totalPrice: number;
  offerPrice: number;
  savings: number;
  badge: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

const AdminOffers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<ComboOffer[]>([]);
  const [products, setProducts] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ComboOffer | null>(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offerPrice: '',
    badge: '',
    validFrom: '',
    validTo: '',
    isActive: true
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Load existing offers and products
    loadOffers();
    loadProducts();
  }, [navigate]);

  const loadOffers = () => {
    const savedOffers = localStorage.getItem('adminOffers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      // Initialize with default offers
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
          badge: "WEDDING SPECIAL",
          isActive: true,
          validFrom: new Date().toISOString().split('T')[0],
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];
      setOffers(defaultOffers);
      localStorage.setItem('adminOffers', JSON.stringify(defaultOffers));
    }
  };

  const loadProducts = () => {
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
      setProducts(JSON.parse(adminProducts));
    }
  };

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => sum + product.price, 0);
  };

  const handleSaveOffer = () => {
    if (!formData.title || !formData.description || selectedProducts.length === 0 || !formData.offerPrice) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select products",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = calculateTotalPrice();
    const offerPrice = parseInt(formData.offerPrice);
    const savings = totalPrice - offerPrice;

    const offerData = {
      id: editingOffer ? editingOffer.id : Date.now(),
      title: formData.title,
      description: formData.description,
      products: selectedProducts,
      totalPrice,
      offerPrice,
      savings,
      badge: formData.badge,
      isActive: formData.isActive,
      validFrom: formData.validFrom,
      validTo: formData.validTo
    };

    let updatedOffers;
    if (editingOffer) {
      updatedOffers = offers.map(offer => 
        offer.id === editingOffer.id ? offerData : offer
      );
    } else {
      updatedOffers = [...offers, offerData];
    }

    setOffers(updatedOffers);
    localStorage.setItem('adminOffers', JSON.stringify(updatedOffers));

    // Reset form
    setFormData({
      title: '',
      description: '',
      offerPrice: '',
      badge: '',
      validFrom: '',
      validTo: '',
      isActive: true
    });
    setSelectedProducts([]);
    setShowOfferForm(false);
    setEditingOffer(null);

    toast({
      title: "Success",
      description: editingOffer ? "Offer updated successfully" : "Offer created successfully",
    });
  };

  const handleEditOffer = (offer: ComboOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      offerPrice: offer.offerPrice.toString(),
      badge: offer.badge,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      isActive: offer.isActive
    });
    setSelectedProducts(offer.products);
    setShowOfferForm(true);
  };

  const handleDeleteOffer = (offerId: number) => {
    const updatedOffers = offers.filter(offer => offer.id !== offerId);
    setOffers(updatedOffers);
    localStorage.setItem('adminOffers', JSON.stringify(updatedOffers));
    toast({
      title: "Success",
      description: "Offer deleted successfully",
    });
  };

  const toggleOfferStatus = (offerId: number) => {
    const updatedOffers = offers.map(offer => 
      offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
    );
    setOffers(updatedOffers);
    localStorage.setItem('adminOffers', JSON.stringify(updatedOffers));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Combo Offers Management</h1>
            <p className="text-gray-600">Create and manage seasonal combo offers</p>
          </div>
          <Button onClick={() => setShowOfferForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Offer
          </Button>
        </div>

        {/* Offers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {offers.map((offer) => (
            <Card key={offer.id} className={`${!offer.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <Badge className={offer.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{offer.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Products: </span>
                    {offer.products.length}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Total Price: </span>
                    <span className="line-through text-gray-500">₹{offer.totalPrice}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Offer Price: </span>
                    <span className="text-primary font-bold">₹{offer.offerPrice}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Savings: </span>
                    <span className="text-green-600 font-bold">₹{offer.savings}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditOffer(offer)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toggleOfferStatus(offer.id)}
                      className={offer.isActive ? 'text-red-600' : 'text-green-600'}
                    >
                      {offer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteOffer(offer.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Offer Form Modal */}
        {showOfferForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingOffer ? 'Edit Combo Offer' : 'Create New Combo Offer'}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowOfferForm(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Offer Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter offer title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter offer description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="badge">Badge Text</Label>
                      <Input
                        id="badge"
                        value={formData.badge}
                        onChange={(e) => setFormData({...formData, badge: e.target.value})}
                        placeholder="e.g. WEDDING SPECIAL"
                      />
                    </div>

                    <div>
                      <Label htmlFor="offerPrice">Offer Price *</Label>
                      <Input
                        id="offerPrice"
                        type="number"
                        value={formData.offerPrice}
                        onChange={(e) => setFormData({...formData, offerPrice: e.target.value})}
                        placeholder="Enter offer price"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={formData.validFrom}
                          onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validTo">Valid To</Label>
                        <Input
                          id="validTo"
                          type="date"
                          value={formData.validTo}
                          onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                        />
                      </div>
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">Selected Products:</h4>
                        <div className="space-y-2">
                          {selectedProducts.map(product => (
                            <div key={product.id} className="flex justify-between text-sm">
                              <span>{product.name}</span>
                              <span>₹{product.price}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 font-bold">
                            Total: ₹{calculateTotalPrice()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Selection */}
                  <div>
                    <h4 className="font-medium mb-4">Select Products *</h4>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {products.map(product => (
                        <div
                          key={product.id}
                          className={`border rounded p-3 cursor-pointer transition-colors ${
                            selectedProducts.find(p => p.id === product.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">₹{product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setShowOfferForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveOffer}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
