import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersService, type Order } from "@/integrations/supabase/orders";
import { toast } from "@/hooks/use-toast";

interface OrderDisplay {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  useEffect(() => {
    loadAllOrders();
  }, []);

  const transformOrder = (order: Order): OrderDisplay => {
    const customerInfo = order.customer_info as any;
    const items = order.items as any[];

    return {
      id: order.id,
      date: order.created_at,
      status: order.order_status,
      total: order.total,
      items: items,
      customerEmail: customerInfo.email,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
    };
  };

  const loadAllOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await ordersService.getOrders();

      if (error) {
        console.error("Error loading orders:", error);
        toast({
          title: "Error loading orders",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const transformedOrders = data.map(transformOrder);
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error loading orders",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchOrdersByEmail = async () => {
    if (!emailFilter.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to search orders",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await ordersService.getOrdersByEmail(
        emailFilter.trim(),
      );

      if (error) {
        console.error("Error searching orders:", error);
        toast({
          title: "Error searching orders",
          description: "Failed to search orders by email",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const transformedOrders = data.map(transformOrder);
        setOrders(transformedOrders);
        if (transformedOrders.length === 0) {
          toast({
            title: "No orders found",
            description: `No orders found for email: ${emailFilter}`,
          });
        }
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      toast({
        title: "Error searching orders",
        description: "Failed to search orders by email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return CheckCircle;
      case "shipped":
        return Truck;
      case "confirmed":
        return CheckCircle;
      case "processing":
        return Package;
      case "pending":
        return Clock;
      case "cancelled":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          <Button
            onClick={loadAllOrders}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Track Your Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your email address to track orders..."
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={searchOrdersByEmail}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Search Orders
                </Button>
                <Button
                  onClick={loadAllOrders}
                  disabled={loading}
                  variant="outline"
                >
                  Show All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">
                {emailFilter
                  ? `No orders found for ${emailFilter}. Try a different email address.`
                  : "Start shopping to see your orders here!"}
              </p>
              <Link to="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Package className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <Badge
                          className={`${getStatusColor(order.status)} flex items-center gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <Badge
                          className={getPaymentStatusColor(order.paymentStatus)}
                        >
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 flex items-center justify-end">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-semibold flex items-center justify-end">
                          <DollarSign className="w-4 h-4 mr-1" />₹
                          {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer Email:</p>
                        <p className="font-medium">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method:</p>
                        <p className="font-medium capitalize">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/track-order?id=${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Package className="w-4 h-4 mr-2" />
                        Reorder Items
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Rate & Review
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
