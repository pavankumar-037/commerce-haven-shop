import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Home,
  Package,
  CreditCard,
  Truck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state;

  // Fallback if no order data is provided
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <Link to="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { orderId, paymentId, amount, method } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>
        </div>

        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold text-lg text-blue-600">
                  #{orderId?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  <strong>Save this Order ID:</strong> Use this for tracking
                  your order or contacting support.
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-xl text-green-600">
                  ₹{amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold capitalize">{method}</span>
              </div>
              {paymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-sm">{paymentId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-blue-800">Order Confirmed</p>
                  <p className="text-sm text-blue-600">
                    Your order has been received and is being processed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  Order processing (1-2 business days)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  Shipped (3-5 business days)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  Delivered (5-7 business days)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Track Your Order
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500 pt-4">
            <p>
              You will receive an email confirmation shortly with detailed
              tracking information.
            </p>
            <p className="mt-2">
              Need help? Contact our support team at support@commercehaven.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
