
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useCoupons } from '@/hooks/useCoupons';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { appliedCoupon, applyCoupon, removeCoupon } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getCartTotal();
  const couponDiscount = appliedCoupon ? applyCoupon(appliedCoupon.code, subtotal).discount : 0;
  const shippingCost = (subtotal - couponDiscount) > 999 ? 0 : 50;
  const total = subtotal - couponDiscount + shippingCost;

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful clothing to get started!</p>
          <Link to="/">
            <Button className="bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-6 last:border-b-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-6"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-xl font-bold text-orange-600">₹{item.price}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[50px]">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-lg font-semibold min-w-[80px] text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 border-t">
            {/* Coupon Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Have a coupon code?
              </h3>
              
              {!appliedCoupon ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className={couponError ? 'border-red-500' : ''}
                    />
                    {couponError && (
                      <p className="text-red-500 text-sm mt-1">{couponError}</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleApplyCoupon}
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 border-green-300"
                  >
                    Apply
                  </Button>
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
            </div>

            <div className="space-y-3 mb-6">
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
                <span className="text-orange-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">
                Proceed to Checkout
              </Button>
            </Link>
            
            <p className="text-center text-sm text-gray-600 mt-3">
              {(subtotal - couponDiscount) < 999 ? `Add ₹${(999 - (subtotal - couponDiscount)).toFixed(2)} more for free shipping!` : '🎉 You qualify for free shipping!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
