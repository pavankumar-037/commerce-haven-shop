
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useCoupons } from '@/hooks/useCoupons';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { appliedCoupon, applyCoupon, removeCoupon, useCoupon } = useCoupons();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod'
  });

  const subtotal = getCartTotal();
  const couponDiscount = appliedCoupon ? applyCoupon(appliedCoupon.code, subtotal).discount : 0;
  const shippingCost = (subtotal - couponDiscount) > 999 ? 0 : 50;
  const total = subtotal - couponDiscount + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const result = applyCoupon(couponCode.trim(), subtotal);
    if (result.isValid) {
      toast({ title: result.message });
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({ title: "Coupon removed" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.state || 
        !formData.zipCode || !formData.phone) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create order
    const order = {
      id: Date.now().toString(),
      items: cartItems,
      customerInfo: formData,
      subtotal: Number(subtotal.toFixed(2)),
      couponDiscount: Number(couponDiscount.toFixed(2)),
      shippingCost: Number(shippingCost.toFixed(2)),
      total: Number(total.toFixed(2)),
      appliedCoupon: appliedCoupon,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod: formData.paymentMethod
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

    // Use coupon if applied
    if (appliedCoupon) {
      useCoupon(appliedCoupon.id);
    }

    // Clear cart
    clearCart();

    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly."
    });

    // Navigate to success page
    navigate('/order-success', { state: { order } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="w-4 h-4 mr-2" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Coupon Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        className={couponError ? 'border-red-500' : ''}
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 border-green-300"
                      >
                        Apply
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">
                        Coupon "{appliedCoupon.code}" Applied!
                      </p>
                      <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  size="lg" 
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
