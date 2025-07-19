<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ordersService } from "@/integrations/supabase/orders";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  user_email?: string;
  customer_info: {
    email: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
  // Legacy format support
  customerInfo?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
}

const OrderTracking = () => {
  const [trackingData, setTrackingData] = useState({
    email: "",
    orderId: "",
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTrackingData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleTrackOrder = async () => {
    if (!trackingData.email.trim() || !trackingData.orderId.trim()) {
      setError("Please enter both email and order ID");
      return;
=======
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
>>>>>>> origin/main
    }
  }, [searchParams]);

<<<<<<< HEAD
    setIsSearching(true);

    try {
      // First check Supabase for orders
      const { data: supabaseOrders, error } =
        await ordersService.getOrdersByEmail(trackingData.email.trim());

      if (!error && supabaseOrders) {
        // Look for order by ID (support both full UUID and last 8 characters)
        const foundOrder = supabaseOrders.find((order) => {
          const orderIdUpper = trackingData.orderId.toUpperCase();
          const fullId = order.id.toUpperCase();
          const shortId = order.id.slice(-8).toUpperCase();

          return fullId === orderIdUpper || shortId === orderIdUpper;
        });

        if (foundOrder) {
          setOrder(foundOrder);
          setError("");
          setIsSearching(false);
          return;
        }
      }

      // Fallback to localStorage for legacy orders
      const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const foundLocalOrder = localOrders.find((o: Order) => {
        const customerEmail = o.customerInfo?.email || o.customer_info?.email;
        return (
          (o.id === trackingData.orderId ||
            o.id.slice(-8).toUpperCase() ===
              trackingData.orderId.toUpperCase()) &&
          customerEmail?.toLowerCase() === trackingData.email.toLowerCase()
        );
      });

      if (foundLocalOrder) {
        setOrder(foundLocalOrder);
        setError("");
      } else {
        setOrder(null);
        setError(
          "Order not found. Please check your email and order ID. You can use either the full order ID or just the last 8 characters.",
        );
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      toast({
        title: "Error tracking order",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getOrderStatus = (order: Order) => {
    return order.order_status || order.status || "pending";
  };

  const getOrderDate = (order: Order) => {
    return order.created_at || order.createdAt || new Date().toISOString();
  };

  const getCustomerInfo = (order: Order) => {
    return order.customer_info || order.customerInfo;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      {
        status: "pending",
        label: "Order Placed",
        description: "Your order has been received",
      },
      {
        status: "processing",
        label: "Processing",
        description: "We are preparing your order",
      },
      {
        status: "shipped",
        label: "Shipped",
        description: "Your order is on its way",
      },
      {
        status: "delivered",
        label: "Delivered",
        description: "Order delivered successfully",
      },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

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
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Enter your order ID (full ID or last 8 characters)"
                value={trackingData.orderId}
                onChange={(e) =>
                  handleInputChange("orderId", e.target.value.toUpperCase())
                }
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              onClick={handleTrackOrder}
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? "Searching..." : "Track Order"}
=======
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
>>>>>>> origin/main
            </Button>
          </div>
        </div>

<<<<<<< HEAD
        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Order Information</h4>
                    <p className="text-sm text-gray-600">
                      Order ID: #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(getOrderDate(order)).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <p className="text-sm text-gray-600">
                      {getCustomerInfo(order).firstName}{" "}
                      {getCustomerInfo(order).lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getCustomerInfo(order).email}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Current Status:</span>
                  <Badge
                    className={`${getStatusColor(getOrderStatus(order))} text-white`}
                  >
                    {React.createElement(getStatusIcon(getOrderStatus(order)), {
                      className: "w-4 h-4 mr-1",
                    })}
                    {getOrderStatus(order).charAt(0).toUpperCase() +
                      getOrderStatus(order).slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getTrackingSteps(getOrderStatus(order)).map(
                    (step, index) => (
                      <div
                        key={step.status}
                        className="flex items-start space-x-4"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.isCompleted
                              ? "bg-green-500 text-white"
                              : step.isCurrent
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                          }`}
                        >
                          {step.isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-semibold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${step.isCurrent ? "text-blue-600" : ""}`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
=======
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
>>>>>>> origin/main
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