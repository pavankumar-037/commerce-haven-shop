import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Tag,
  X,
  Smartphone,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useCoupons } from "@/hooks/useCoupons";
import { toast } from "@/hooks/use-toast";
import { ordersService, type OrderData } from "@/integrations/supabase/orders";
import { PaymentGateway } from "@/services/paymentGateway";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    useCoupon,
    validateCoupon,
  } = useCoupons();

  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    paymentMethod: "cod",
  });

  const subtotal = getCartTotal();
  const couponDiscount = appliedCoupon
    ? validateCoupon(appliedCoupon.code, subtotal).discount
    : 0;
  const shippingCost = subtotal - couponDiscount > 999 ? 0 : 50;
  const total = subtotal - couponDiscount + shippingCost;

  useEffect(() => {
    // Give time for cart to load from localStorage
    const timer = setTimeout(() => {
      console.log("Cart loading timeout reached, cartItems:", cartItems);
      setIsCartLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [cartItems]);

  useEffect(() => {
    console.log("Cart state changed:", {
      isCartLoaded,
      cartItemsLength: cartItems.length,
    });
    if (isCartLoaded && cartItems.length === 0) {
      console.log("Cart is empty, redirecting to cart page");
      navigate("/cart");
    }
  }, [cartItems, navigate, isCartLoaded]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);

      if (session?.user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session?.user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while cart is being loaded
  if (!isCartLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
          <div className="mt-4">
            <Button
              onClick={() => {
                console.log("Force loading cart, current items:", cartItems);
                setIsCartLoaded(true);
              }}
              variant="outline"
              size="sm"
            >
              Continue Anyway
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const result = applyCoupon(couponCode.trim(), subtotal);
    if (result.isValid) {
      toast({ title: result.message });
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({ title: "Coupon removed" });
  };

  const getPaymentMethodName = (method: string) => {
    const methodNames = {
      cod: "Cash on Delivery",
      card: "Credit/Debit Card",
      upi: "UPI Payment",
      netbanking: "Net Banking",
      stripe: "Stripe Payment",
      razorpay: "Razorpay Payment",
    };
    return methodNames[method as keyof typeof methodNames] || method;
  };

  const createOrderInDatabase = async (
    orderData: OrderData,
  ): Promise<string | null> => {
    try {
      console.log("Creating order in database with data:", orderData);

      // Test connection first
      const isConnected = await ordersService.testConnection();
      console.log("Supabase connection test result:", isConnected);

      const { data, error } = await ordersService.createOrder(orderData);

      if (error || !data) {
        console.error("Failed to create order:", { error, data });
        const errorMessage = error?.message || "Unknown error occurred";
        toast({
          title: "Failed to create order",
          description: `Error: ${errorMessage}`,
          variant: "destructive",
        });
        return null;
      }

      console.log("Order created successfully:", data);
      return data.id;
    } catch (error) {
      console.error("Exception creating order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to create order",
        description: `Exception: ${errorMessage}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handlePaymentSuccess = async (
    paymentResponse: any,
    orderId: string,
  ) => {
    try {
      // Update order status in database
      await ordersService.updateOrderStatus(orderId, "confirmed", "completed");

      // Use coupon if applied
      if (appliedCoupon) {
        useCoupon(appliedCoupon.id);
      }

      // Clear cart only after successful payment
      clearCart();

      toast({
        title: "Order placed successfully!",
        description:
          "Payment completed. You will receive a confirmation email shortly.",
      });

      // Navigate to success page
      navigate("/order-success", {
        state: {
          orderId,
          paymentId: paymentResponse.paymentId,
          amount: total,
          method: paymentResponse.method,
        },
      });
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast({
        title: "Payment successful but order update failed",
        description: "Please contact support with your payment ID",
        variant: "destructive",
      });
    }
  };

  const handlePaymentFailure = (error: any, orderId?: string) => {
    console.error("Payment failed:", error);

    setIsProcessing(false);

    // Navigate to payment error page with details
    navigate("/payment-error", {
      state: {
        orderId,
        error: error.message || "Payment processing failed",
        paymentMethod: formData.paymentMethod,
        amount: total,
      },
    });
  };

  const handleCODOrder = async () => {
    try {
      // Create order data for COD
      const orderData: OrderData = {
        userEmail: formData.email,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: cartItems,
        subtotal: Number(subtotal.toFixed(2)),
        couponDiscount: Number(couponDiscount.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        total: Number(total.toFixed(2)),
        appliedCoupon: appliedCoupon,
        paymentMethod: formData.paymentMethod,
      };

      // Create order in database first
      const orderId = await createOrderInDatabase(orderData);

      if (!orderId) {
        setIsProcessing(false);
        return;
      }

      // Process COD payment
      const codResponse = await PaymentGateway.processCODPayment(orderId);
      await handlePaymentSuccess(codResponse, orderId);
    } catch (error) {
      console.error("Error during COD checkout:", error);
      toast({
        title: "Order placement failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const processPayment = async (orderId: string) => {
    const customerInfo = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    };

    const paymentAmount = Math.round(total * 100); // Convert to paise

    try {
      switch (formData.paymentMethod) {
        case "cod":
          const codResponse = await PaymentGateway.processCODPayment(orderId);
          await handlePaymentSuccess(codResponse, orderId);
          break;

        case "upi":
          const upiResponse = await PaymentGateway.simulateModernUPIPayment({
            amount: paymentAmount,
            currency: "INR",
            orderId,
            customerInfo,
          });
          await handlePaymentSuccess(upiResponse, orderId);
          break;

        case "card":
          const cardResponse = await PaymentGateway.simulateSecureCardPayment({
            amount: paymentAmount,
            currency: "INR",
            orderId,
            customerInfo,
          });
          await handlePaymentSuccess(cardResponse, orderId);
          break;

        case "stripe":
          const stripeResponse = await PaymentGateway.processStripePayment({
            amount: paymentAmount,
            currency: "INR",
            orderId,
            customerInfo,
          });
          await handlePaymentSuccess(stripeResponse, orderId);
          break;

        case "netbanking":
          const netbankingResponse =
            await PaymentGateway.simulateNetBankingPayment({
              amount: paymentAmount,
              currency: "INR",
              orderId,
              customerInfo,
            });
          await handlePaymentSuccess(netbankingResponse, orderId);
          break;

        case "razorpay":
          await PaymentGateway.initiatePayment({
            amount: paymentAmount,
            currency: "INR",
            orderId,
            customerInfo,
            onSuccess: (response) => handlePaymentSuccess(response, orderId),
            onFailure: handlePaymentFailure,
          });
          break;

        default:
          throw new Error("Invalid payment method");
      }
    } catch (error) {
      handlePaymentFailure(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.phone
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Handle COD orders differently
    if (formData.paymentMethod === "cod") {
      setIsProcessing(true);
      handleCODOrder();
      return;
    }

    // Handle online payments with Stripe
    setIsProcessing(true);

    try {
      console.log("Creating payment session...", {
        total,
        userEmail: formData.email,
      });

      const { data, error } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            items: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            total: total,
            userEmail: formData.email,
            paymentMethod: getPaymentMethodName(formData.paymentMethod),
          },
        },
      );

      console.log("Payment session response:", { data, error });

      if (error) {
        console.error("Payment session error:", error);
        throw error;
      }

      if (data?.url) {
        // Store form data in session storage for later use
        sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
        sessionStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));

        console.log("Redirecting to Stripe checkout:", data.url);
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error("No payment URL received:", data);
        throw new Error("Payment session creation failed - no URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequireAuth = () => {
    setIsAuthRequired(true);
  };

  const handleAuthComplete = () => {
    setIsAuthRequired(false);
  };

  if (isAuthRequired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to continue with your order.</p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/auth")} className="w-full">
                Sign In / Sign Up
              </Button>
              <Button
                variant="outline"
                onClick={handleAuthComplete}
                className="w-full"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="ZIP code"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label
                        htmlFor="cod"
                        className="flex items-center cursor-pointer"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Cash on Delivery (COD)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label
                        htmlFor="upi"
                        className="flex items-center cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label
                        htmlFor="netbanking"
                        className="flex items-center cursor-pointer"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Net Banking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label
                        htmlFor="stripe"
                        className="flex items-center cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Stripe (Secure Payments)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label
                        htmlFor="razorpay"
                        className="flex items-center cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Razorpay (All Methods)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Coupon Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Coupon Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!appliedCoupon ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          className={couponError ? "border-red-500" : ""}
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 border-green-300"
                        >
                          Apply
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-sm">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-800">
                          Coupon "{appliedCoupon.code}" Applied!
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount:</span>
                        <span>-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span
                        className={shippingCost === 0 ? "text-green-600" : ""}
                      >
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-3">
                      <span>Total:</span>
                      <span className="text-orange-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
