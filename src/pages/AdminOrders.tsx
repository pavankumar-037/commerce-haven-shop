import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminSidebar from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import {
  ordersService,
  type Order as SupabaseOrder,
} from "@/integrations/supabase/orders";
import { supabase } from "@/integrations/supabase/client";

interface OrderDisplay {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  paymentMethod: string;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      if (!adminAuth) {
        navigate("/admin/login");
        return;
      }
    };

    checkAuth();
    loadOrders();
  }, [navigate]);

  const transformSupabaseOrder = (order: SupabaseOrder): OrderDisplay => {
    const customerInfo = order.customer_info as any;

    // Safe property access with fallbacks
    const firstName =
      customerInfo?.firstName || customerInfo?.first_name || "N/A";
    const lastName = customerInfo?.lastName || customerInfo?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown Customer";

    return {
      id: order.id,
      customerName: fullName,
      email: customerInfo?.email || "No email provided",
      phone: customerInfo?.phone || "No phone provided",
      total: order.total || 0,
      status: order.order_status || "pending",
      items: (order.items as any[]) || [],
      shippingAddress: {
        street:
          customerInfo?.address ||
          customerInfo?.street ||
          "No address provided",
        city: customerInfo?.city || "No city provided",
        state: customerInfo?.state || "No state provided",
        zipCode:
          customerInfo?.zipCode || customerInfo?.zip_code || "No zip provided",
      },
      createdAt: order.created_at || new Date().toISOString(),
      paymentMethod: order.payment_method || "cod",
    };
  };

  const loadOrders = async () => {
    try {
      setLoading(true);

      // Try to load from Supabase first
      const { data: supabaseData, error: supabaseError } =
        await ordersService.getOrders();

      if (!supabaseError && supabaseData) {
        const transformedOrders = supabaseData.map(transformSupabaseOrder);
        setOrders(transformedOrders);
        return;
      }

      // Fallback to direct Supabase call
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading orders:", error);

        // Fallback to localStorage orders
        const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const localOrdersDisplay = localOrders.map((order: any) => {
          // Safe property access for local orders
          const customerInfo = order.customerInfo || order.customer_info || {};
          const firstName =
            customerInfo.firstName || customerInfo.first_name || "N/A";
          const lastName =
            customerInfo.lastName || customerInfo.last_name || "";
          const fullName =
            `${firstName} ${lastName}`.trim() || "Unknown Customer";

          return {
            id: order.id || "unknown-id",
            customerName: fullName,
            email:
              customerInfo.email || order.user_email || "No email provided",
            phone: customerInfo.phone || "No phone provided",
            total: order.total || 0,
            status: order.status || order.order_status || "pending",
            items: order.items || [],
            shippingAddress: {
              street:
                customerInfo.address ||
                customerInfo.street ||
                "No address provided",
              city: customerInfo.city || "No city provided",
              state: customerInfo.state || "No state provided",
              zipCode:
                customerInfo.zipCode ||
                customerInfo.zip_code ||
                "No zip provided",
            },
            createdAt:
              order.createdAt || order.created_at || new Date().toISOString(),
            paymentMethod: order.paymentMethod || order.payment_method || "cod",
          };
        });

        setOrders(localOrdersDisplay);

        toast({
          title: "Loaded from local storage",
          description: "Using local orders data (Supabase connection failed)",
          variant: "default",
        });
        return;
      }

      if (data) {
        const transformedOrders = data.map((order: any) =>
          transformSupabaseOrder(order),
        );
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);

      // Final fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const localOrdersDisplay = localOrders.map((order: any) => {
        // Safe property access for local orders in catch block
        const customerInfo = order.customerInfo || order.customer_info || {};
        const firstName =
          customerInfo.firstName || customerInfo.first_name || "N/A";
        const lastName = customerInfo.lastName || customerInfo.last_name || "";
        const fullName =
          `${firstName} ${lastName}`.trim() || "Unknown Customer";

        return {
          id: order.id || "unknown-id",
          customerName: fullName,
          email: customerInfo.email || order.user_email || "No email provided",
          phone: customerInfo.phone || "No phone provided",
          total: order.total || 0,
          status: order.status || order.order_status || "pending",
          items: order.items || [],
          shippingAddress: {
            street:
              customerInfo.address ||
              customerInfo.street ||
              "No address provided",
            city: customerInfo.city || "No city provided",
            state: customerInfo.state || "No state provided",
            zipCode:
              customerInfo.zipCode ||
              customerInfo.zip_code ||
              "No zip provided",
          },
          createdAt:
            order.createdAt || order.created_at || new Date().toISOString(),
          paymentMethod: order.paymentMethod || order.payment_method || "cod",
        };
      });

      setOrders(localOrdersDisplay);

      toast({
        title: "Error loading orders",
        description: "Using local orders data as fallback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filteredOrders = orders.filter((order) => {
    // Safe property access for filtering
    const orderId = order.id || "";
    const customerName = order.customerName || "";
    const email = order.email || "";
    const status = order.status || "pending";

    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Try updating in Supabase first
      const { error } = await ordersService.updateOrderStatus(
        orderId,
        newStatus,
      );

      if (error) {
        // Fallback to updating local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );

        // Also update localStorage orders
        const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedLocalOrders = localOrders.map((order: any) =>
          order.id === orderId
            ? { ...order, status: newStatus, order_status: newStatus }
            : order,
        );
        localStorage.setItem("orders", JSON.stringify(updatedLocalOrders));

        toast({
          title: "Status updated locally",
          description:
            "Order status updated in local storage (Supabase failed)",
        });
      } else {
        // Update local state on success
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );

        toast({
          title: "Status updated",
          description: "Order status updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating status",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

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

  const getOrderTotal = (order: OrderDisplay) => {
    if (order.total && order.total > 0) {
      return order.total;
    }

    // Safely calculate total from items if no total is available
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((sum, item) => {
        const price = item?.price || 0;
        const quantity = item?.quantity || 0;
        return sum + price * quantity;
      }, 0);
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Management</h1>
            <Button
              onClick={refreshOrders}
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Total Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Pending</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter((o) => o.status === "pending").length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Shipped</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {orders.filter((o) => o.status === "shipped").length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Delivered</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter((o) => o.status === "delivered").length}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders by ID, customer name, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.items ? order.items.length : 0} items
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{getOrderTotal(order).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(order.status)} text-white`}
                        >
                          {React.createElement(getStatusIcon(order.status), {
                            className: "w-3 h-3 mr-1",
                          })}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Order Details - #
                                  {order.id.slice(-8).toUpperCase()}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="font-semibold mb-2">
                                        Customer Information
                                      </h3>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <strong>Name:</strong>{" "}
                                          {selectedOrder.customerName}
                                        </p>
                                        <p>
                                          <strong>Email:</strong>{" "}
                                          {selectedOrder.email}
                                        </p>
                                        <p>
                                          <strong>Phone:</strong>{" "}
                                          {selectedOrder.phone}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold mb-2">
                                        Shipping Address
                                      </h3>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          {selectedOrder.shippingAddress.street}
                                        </p>
                                        <p>
                                          {selectedOrder.shippingAddress.city},{" "}
                                          {selectedOrder.shippingAddress.state}{" "}
                                          {
                                            selectedOrder.shippingAddress
                                              .zipCode
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      Order Items
                                    </h3>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map(
                                        (item, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                                          >
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                              <p className="font-medium">
                                                {item.name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ₹
                                                {item.price}
                                              </p>
                                            </div>
                                            <p className="font-semibold">
                                              ₹
                                              {(
                                                item.price * item.quantity
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-lg font-semibold">
                                        Total Amount:
                                      </span>
                                      <span className="text-xl font-bold text-green-600">
                                        ₹
                                        {getOrderTotal(selectedOrder).toFixed(
                                          2,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                      <span>Payment Method:</span>
                                      <span className="capitalize">
                                        {selectedOrder.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                      <span>Order Date:</span>
                                      <span>
                                        {formatDate(selectedOrder.createdAt)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">
                                      Update Status
                                    </h3>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          selectedOrder.id,
                                          value,
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="confirmed">
                                          Confirmed
                                        </SelectItem>
                                        <SelectItem value="processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="shipped">
                                          Shipped
                                        </SelectItem>
                                        <SelectItem value="delivered">
                                          Delivered
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              updateOrderStatus(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
