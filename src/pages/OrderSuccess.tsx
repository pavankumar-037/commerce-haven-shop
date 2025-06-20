
import { Link } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">Order Number</span>
            </div>
            <p className="font-mono text-lg font-semibold">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            You will receive an email confirmation shortly with tracking information.
          </p>

          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="w-full">
                View Order History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
