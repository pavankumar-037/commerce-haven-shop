import { Link, useLocation } from "react-router-dom";
import { AlertCircle, Home, RefreshCw, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentErrorData {
  orderId?: string;
  error?: string;
  paymentMethod?: string;
  amount?: number;
}

const PaymentError = () => {
  const location = useLocation();
  const errorData: PaymentErrorData = location.state || {};

  const {
    orderId,
    error = "Payment processing failed",
    paymentMethod,
    amount,
  } = errorData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 mb-2">
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600 space-y-2">
              <p>We encountered an issue processing your payment.</p>
              {error && (
                <p className="text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <strong>Error:</strong> {error}
                </p>
              )}
              <p className="text-sm">
                Please contact support if payment was deducted.
              </p>
            </div>

            {(orderId || paymentMethod || amount) && (
              <Card className="bg-gray-50">
                <CardContent className="p-4 space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-800">
                    Transaction Details:
                  </h4>
                  {orderId && (
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">
                        #{orderId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">{paymentMethod}</span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-semibold">
                        ₹{amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Link to="/checkout">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>

              <Link to="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>Call: +91-123-456-7890</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Email: support@commercehaven.com</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Our support team is available 24/7 to assist you.
                </p>
              </CardContent>
            </Card>

            <div className="text-xs text-gray-500">
              <p>
                If money was deducted from your account, it will be refunded
                within 5-7 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentError;
