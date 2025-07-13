import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id');
      const sessionId = searchParams.get('session_id');
      const isCOD = searchParams.get('cod');

      if (orderId) {
        try {
          if (sessionId && !isCOD) {
            // Verify payment with Stripe
            const { data } = await supabase.functions.invoke('verify-payment', {
              body: { session_id: sessionId, order_id: orderId }
            });

            if (data?.success) {
              // Get order details
              const { data: order } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

              setOrderDetails(order);
              clearCart(); // Clear cart only after successful payment
            }
          } else {
            // COD order or direct order lookup
            const { data: order } = await supabase
              .from('orders')
              .select('*')
              .eq('id', orderId)
              .single();

            setOrderDetails(order);
            if (isCOD) {
              clearCart(); // Clear cart for COD orders
            }
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      }
      setLoading(false);
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">Please contact support if payment was deducted.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed and will be delivered soon.</p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{orderDetails.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>{new Date(orderDetails.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-orange-600">₹{orderDetails.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>{orderDetails.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`capitalize font-semibold ${
                  orderDetails.payment_status === 'completed' ? 'text-green-600' : 
                  orderDetails.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {orderDetails.payment_status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• You'll receive an email confirmation shortly</p>
              <p>• Track your order using the order ID above</p>
              <p>• Expected delivery: 3-5 business days</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/orders">
              <Button variant="outline" className="flex items-center">
                <Package className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link to={`/order-tracking?order=${orderDetails.order_number}`}>
              <Button variant="outline" className="flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;