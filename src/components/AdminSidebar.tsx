
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Gift,
  Settings,
  Tag,
  Users
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      icon: Package,
      label: 'Products',
      path: '/admin/products'
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      path: '/admin/orders'
    },
    {
      icon: Gift,
      label: 'Combo Offers',
      path: '/admin/offers'
    },
    {
      icon: Tag,
      label: 'Coupons',
      path: '/admin/coupons'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/admin/customers'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings'
    }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                isActive ? 'bg-gray-800 text-white border-r-4 border-blue-500' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
