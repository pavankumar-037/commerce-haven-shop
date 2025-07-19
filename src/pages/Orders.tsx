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
  const [emailFilter, setEmailFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<OrderDisplay[]>([]);

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
        setFilteredOrders(transformedOrders);
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
          description: "Failed to fetch orders for this email",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const transformedOrders = data.map(transformOrder);
        setFilteredOrders(transformedOrders);
        toast({
          title: "Search completed",
          description: `Found ${transformedOrders.length} orders for ${emailFilter}`,
        });
      } else {
        setFilteredOrders([]);
        toast({
          title: "No orders found",
          description: `No orders found for ${emailFilter}`,
        });
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      toast({
        title: "Error searching orders",
        description: "Failed to search orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setEmailFilter("");
    setFilteredOrders(orders);
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
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
      case "confirmed":
        return CheckCircle;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Orders by Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter email address to search orders"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && searchOrdersByEmail()}
              />
              <Button onClick={searchOrdersByEmail} disabled={loading}>
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </Button>
              {emailFilter && (
                <Button variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {emailFilter
                  ? `No orders found for "${emailFilter}"`
                  : "You haven't placed any orders yet"}
              </p>
              {!emailFilter && (
                <Link to="/" className="inline-block mt-4">
                  <Button>Start Shopping</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.date)}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />₹
                          {order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {React.createElement(getStatusIcon(order.status), {
                        className: "w-3 h-3 mr-1",
                      })}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Customer Email:</span>
                          <p className="font-medium">{order.customerEmail}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Method:</span>
                          <p className="font-medium capitalize">
                            {order.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Status:</span>
                          <p className="font-medium capitalize">
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total: ₹{order.total.toFixed(2)}
                      </span>
                      <Link to="/track-order">
                        <Button variant="outline">Track Order</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
