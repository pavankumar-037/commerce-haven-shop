import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Eye,
  LogOut,
  BarChart3,
  User,
  Clock,
  MessageCircle,
  Gift,
  Settings,
  Grid3X3,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    unreadMessages: 0,
    activeOffers: 0,
    productSections: 0,
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin/login");
      return;
    }

    // Get admin user info
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }

    // Load dashboard stats
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const products = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    const messages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]",
    );

    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + order.total,
      0,
    );
    const pendingOrders = orders.filter(
      (order: any) => order.status === "pending",
    ).length;
    const unreadMessages = messages.filter(
      (msg: any) => msg.status === "unread",
    ).length;

    // Get unique customers from orders
    const uniqueCustomers = new Set(
      orders.map((order: any) => order.customerEmail),
    ).size;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      totalCustomers: uniqueCustomers,
      unreadMessages,
      activeOffers: 3, // Mock data
      productSections: 4, // Mock data for sections
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-500";
      case "Manager":
        return "bg-blue-500";
      case "Staff":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const primaryStatCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2.5%",
      changeType: "positive",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders processed",
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12.3%",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      description: "Total earnings",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8.7%",
      changeType: "positive",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Registered customers",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5.1%",
      changeType: "positive",
    },
  ];

  const secondaryStatCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      description: "Orders awaiting processing",
      color: "text-amber-600",
      urgency: stats.pendingOrders > 0 ? "high" : "low",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageCircle,
      description: "New customer inquiries",
      color: "text-red-600",
      urgency: stats.unreadMessages > 0 ? "high" : "low",
    },
    {
      title: "Active Offers",
      value: stats.activeOffers,
      icon: Gift,
      description: "Running promotions",
      color: "text-green-600",
      urgency: "low",
    },
    {
      title: "Product Sections",
      value: stats.productSections,
      icon: Grid3X3,
      description: "Catalog categories",
      color: "text-blue-600",
      urgency: "low",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products",
      icon: Package,
      action: () => navigate("/admin/products"),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "View Orders",
      description: "Process and track orders",
      icon: ShoppingCart,
      action: () => navigate("/admin/orders"),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Customer Messages",
      description: "Respond to inquiries",
      icon: MessageCircle,
      action: () => navigate("/admin/messages"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
    },
    {
      title: "Offers Manager",
      description: "Create and manage offers",
      icon: Gift,
      action: () => navigate("/admin/offers-manager"),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Product Sections",
      description: "Manage categories",
      icon: Grid3X3,
      action: () => navigate("/admin/sections"),
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Coupons",
      description: "Discount codes",
      icon: Tag,
      action: () => navigate("/admin/coupons"),
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-8 bg-gray-50">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {adminUser && (
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {adminUser.username}
                        </span>
                        <Badge
                          className={`${getRoleBadgeColor(adminUser.role)} text-white text-xs`}
                        >
                          {adminUser.role}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(adminUser.loginTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {primaryStatCards.map((card, index) => (
            <Card key={index} className="shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {card.value}
                    </p>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${card.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                      >
                        {card.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Stats and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Secondary Stats */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Overview
            </h3>
            <div className="space-y-4">
              {secondaryStatCards.map((card, index) => (
                <Card
                  key={index}
                  className={`shadow-sm ${card.urgency === "high" ? "border-red-200 bg-red-50" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {card.value}
                          </p>
                          <p className="text-sm text-gray-600">{card.title}</p>
                        </div>
                      </div>
                      {card.urgency === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {action.title}
                          </h4>
                          {action.badge && (
                            <Badge
                              variant="destructive"
                              className="text-xs ml-2"
                            >
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Store Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Store Performance
              </CardTitle>
              <CardDescription>Key metrics and system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">System Status</p>
                  <p className="text-sm text-gray-600">
                    All systems operational
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Payment Gateway</p>
                  <p className="text-sm text-gray-600">Processing normally</p>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Inventory Sync</p>
                  <p className="text-sm text-gray-600">
                    Last updated 5 mins ago
                  </p>
                </div>
                <Badge className="bg-blue-500 text-white">Synced</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Admin Tools</CardTitle>
              <CardDescription>
                Administrative functions and utilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate("/admin/settings")}
                className="w-full justify-start"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Site Settings
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="w-full justify-start"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Store Front
              </Button>
              <Button
                onClick={() => window.open("/admin/dashboard", "_blank")}
                className="w-full justify-start"
                variant="outline"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
