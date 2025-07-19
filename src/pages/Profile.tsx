import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Package,
  MessageCircle,
  Settings,
  Edit,
  Save,
  Phone,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ordersService, type Order } from "@/integrations/supabase/orders";
import {
  userMessagesService,
  type UserMessage,
} from "@/integrations/supabase/userMessages";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  dateJoined: string;
}

// Remove local interface as we're using the one from service

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadUserProfile(session.user);
      await loadUserOrders(session.user.email);
      await loadUserMessages(session.user.email);
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (user: any) => {
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split("@")[0],
      phone: user.user_metadata?.phone || "",
      address: user.user_metadata?.address || "",
      dateJoined: user.created_at,
    };

    setProfile(userProfile);
    setEditForm({
      name: userProfile.name,
      phone: userProfile.phone || "",
      address: userProfile.address || "",
    });
  };

  const loadUserOrders = async (email: string) => {
    try {
      const { data, error } = await ordersService.getOrdersByEmail(email);
      if (data && !error) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error loading user orders:", error);
    }
  };

  const loadUserMessages = async (email: string) => {
    // Load messages from localStorage for now (will be updated to use Supabase)
    const allMessages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]",
    );
    const userMessages = allMessages
      .filter((msg: any) => msg.email === email)
      .map((msg: any) => ({
        id: msg.id,
        subject: msg.subject || "General Inquiry",
        message: msg.message,
        createdAt: msg.createdAt,
        status: msg.status || "unread",
        adminReply: msg.adminReply,
      }));
    setMessages(userMessages);
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
        },
      });

      if (error) throw error;

      // Update local state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: editForm.name,
              phone: editForm.phone,
              address: editForm.address,
            }
          : null,
      );

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getOrderStatusColor = (status: string) => {
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

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-500";
      case "read":
        return "bg-blue-500";
      case "replied":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Profile not found. Please try logging in again.</p>
          <Link to="/auth">
            <Button className="mt-4">Go to Login</Button>
          </Link>
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">
            Manage your profile, orders, and messages
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() =>
                      isEditing ? handleUpdateProfile() : setIsEditing(true)
                    }
                    disabled={isEditing && !editForm.name.trim()}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{profile.email}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {profile.phone || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateJoined">Member Since</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {formatDate(profile.dateJoined)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-900">
                        {profile.address || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: profile.name,
                          phone: profile.phone || "",
                          address: profile.address || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order History ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Link to="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <Badge
                            className={`${getOrderStatusColor(order.order_status)} text-white`}
                          >
                            {order.order_status.charAt(0).toUpperCase() +
                              order.order_status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">
                            ₹{order.total.toFixed(2)}
                          </p>
                          <Link to="/track-order">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Track Order
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <div className="text-center">
                        <Link to="/orders">
                          <Button variant="outline">View All Orders</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    My Messages ({messages.length})
                  </CardTitle>
                  <Link to="/contact">
                    <Button>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send New Message
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Send us a message and we'll get back to you soon
                    </p>
                    <Link to="/contact">
                      <Button>Send Message</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{message.subject}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                          <Badge
                            className={`${getMessageStatusColor(message.status)} text-white`}
                          >
                            {message.status.charAt(0).toUpperCase() +
                              message.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {message.message.substring(0, 150)}...
                        </p>
                        {message.adminReply && (
                          <div className="bg-blue-50 p-3 rounded mt-2">
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Admin Reply:
                            </p>
                            <p className="text-sm text-blue-800">
                              {message.adminReply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
