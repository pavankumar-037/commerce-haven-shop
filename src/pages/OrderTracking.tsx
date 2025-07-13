import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
      handleTrackOrder(orderParam);
    }
  }, [searchParams]);

  const handleTrackOrder = async (orderNum?: string) => {
    const searchOrderNumber = orderNum || orderNumber;
    if (!searchOrderNumber.trim()) return;
    
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', searchOrderNumber)
        .single();

      if (error || !order) {
        setOrderStatus(null);
        setOrderDetails(null);
      } else {
        setOrderStatus(order.order_status);
        setOrderDetails(order);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setOrderStatus(null);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Order Details</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter order number (e.g., ORD-20240115-001)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button 
              onClick={() => handleTrackOrder()}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </div>
        </div>

        {orderStatus && orderDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold ml-2">{orderDetails.order_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <span className="ml-2">{new Date(orderDetails.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold ml-2 text-orange-600">₹{orderDetails.total_amount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`ml-2 capitalize font-semibold ${
                    orderDetails.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {orderDetails.payment_status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['pending', 'confirmed', 'shipped', 'completed', 'delivered'].indexOf(orderStatus) >= 0 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Order Placed</p>
                  <p className="text-sm text-gray-600">Your order has been received</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['confirmed', 'shipped', 'completed', 'delivered'].indexOf(orderStatus) >= 0 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Order Confirmed</p>
                  <p className="text-sm text-gray-600">Your order is being prepared</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['shipped', 'completed', 'delivered'].indexOf(orderStatus) >= 0 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Order Shipped</p>
                  <p className="text-sm text-gray-600">Your order is on the way</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['completed', 'delivered'].indexOf(orderStatus) >= 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Order Delivered</p>
                  <p className="text-sm text-gray-600">Your order has been delivered</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {orderStatus === null && !loading && orderNumber && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No order found with this order number.</p>
            <p className="text-sm text-gray-500 mt-2">Please check the order number and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;