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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {mockOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here!
            </p>
            <Link to="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">
                        Order {order.id}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm">
                      Reorder Items
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
