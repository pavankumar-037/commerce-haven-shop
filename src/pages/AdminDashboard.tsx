
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/AdminSidebar';

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
    pendingOrders: 0
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Get admin user info
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }

    // Load dashboard stats
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-500';
      case 'Manager': return 'bg-blue-500';
      case 'Staff': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders processed",
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      description: "Total earnings",
      color: "text-purple-600"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      description: "Orders awaiting processing",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your CommerceHaven store efficiently</p>
          </div>
          <div className="flex items-center space-x-4">
            {adminUser && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-gray-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{adminUser.username}</span>
                        <Badge className={`${getRoleBadgeColor(adminUser.role)} text-white text-xs`}>
                          {adminUser.role}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Logged in: {new Date(adminUser.loginTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button onClick={handleLogout} variant="outline" className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/products')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
              <Button 
                onClick={() => navigate('/admin/orders')} 
                className="w-full justify-start"
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Store Front
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Access Levels</CardTitle>
              <CardDescription>
                Available roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-semibold text-red-600">Super Admin</span>
                    <p className="text-sm text-gray-500">Full system access</p>
                  </div>
                  <Badge className="bg-red-500 text-white">All Permissions</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-semibold text-blue-600">Manager</span>
                    <p className="text-sm text-gray-500">Products & Orders</p>
                  </div>
                  <Badge className="bg-blue-500 text-white">Limited Access</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-semibold text-green-600">Staff</span>
                    <p className="text-sm text-gray-500">View only access</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Read Only</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
