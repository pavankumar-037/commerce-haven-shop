
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Search, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const OrderTracking = () => {
  const [trackingData, setTrackingData] = useState({
    email: '',
    orderId: ''
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTrackingData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleTrackOrder = () => {
    if (!trackingData.email.trim() || !trackingData.orderId.trim()) {
      setError('Please enter both email and order ID');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: Order) => 
        o.id === trackingData.orderId && 
        o.customerInfo.email.toLowerCase() === trackingData.email.toLowerCase()
      );

      if (foundOrder) {
        setOrder(foundOrder);
        setError('');
      } else {
        setOrder(null);
        setError('Order not found. Please check your email and order ID.');
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const getTrackingSteps = (status: Order['status']) => {
    const steps = [
      { status: 'pending', label: 'Order Placed', description: 'Your order has been received' },
      { status: 'processing', label: 'Processing', description: 'We are preparing your order' },
      { status: 'shipped', label: 'Shipped', description: 'Your order is on its way' },
      { status: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        {/* Tracking Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Enter Tracking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={trackingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Enter your order ID (e.g., ORD-001)"
                value={trackingData.orderId}
                onChange={(e) => handleInputChange('orderId', e.target.value.toUpperCase())}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button 
              onClick={handleTrackOrder}
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? 'Searching...' : 'Track Order'}
            </Button>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Order Information</h4>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Total: ₹{order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.firstName} {order.customerInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Current Status:</span>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {React.createElement(getStatusIcon(order.status), { className: "w-4 h-4 mr-1" })}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getTrackingSteps(order.status).map((step, index) => (
                    <div key={step.status} className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.isCompleted ? 'bg-green-500 text-white' : 
                        step.isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-300'
                      }`}>
                        {step.isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${step.isCurrent ? 'text-blue-600' : ''}`}>
                          {step.label}
                        </h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {!order && !isSearching && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Enter your details to track your order
            </h3>
            <p className="text-gray-500">
              You'll need your email address and order ID to track your order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
