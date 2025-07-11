import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersService } from "@/integrations/supabase/orders";
import { toast } from "@/hooks/use-toast";
import { listTables } from "@/utils/testSupabase";

const Debug = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const connected = await ordersService.testConnection();
      setIsConnected(connected);
      toast({
        title: connected ? "Connection successful" : "Connection failed",
        variant: connected ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Connection test error:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const testOrderCreation = async () => {
    setLoading(true);
    try {
      const testOrderData = {
        userEmail: "test@example.com",
        customerInfo: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "1234567890",
          address: "123 Test St",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
        },
        items: [
          {
            id: 1,
            name: "Test Product",
            price: 99.99,
            quantity: 1,
            image: "/placeholder.svg",
          },
        ],
        subtotal: 99.99,
        couponDiscount: 0,
        shippingCost: 0,
        total: 99.99,
        paymentMethod: "test",
      };

      console.log("Testing order creation with:", testOrderData);

      const { data, error } = await ordersService.createOrder(testOrderData);

      if (error) {
        const errorMessage = error.message || "Unknown error";
        setTestResult(`Error: ${errorMessage}`);
        console.error("Full error details:", error);
        toast({
          title: "Order creation failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data) {
        setTestResult(`Success: Order created with ID ${data.id}`);
        toast({
          title: "Order creation successful",
          description: `Order ID: ${data.id}`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResult(`Exception: ${errorMessage}`);
      console.error("Order creation test error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Connection Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testConnection}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Testing..." : "Test Connection"}
              </Button>

              {isConnected !== null && (
                <div
                  className={`p-4 rounded ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {isConnected
                    ? "✅ Connection successful"
                    : "❌ Connection failed"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Creation Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testOrderCreation}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Test Order Creation"}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded ${testResult.startsWith("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {testResult}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Environment:</strong> {import.meta.env.MODE}
                </div>
                <div>
                  <strong>Supabase URL:</strong>{" "}
                  {import.meta.env.VITE_SUPABASE_URL || "Using hardcoded URL"}
                </div>
                <div>
                  <strong>Current URL:</strong> {window.location.href}
                </div>
                <div>
                  <strong>User Agent:</strong> {navigator.userAgent}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Debug;
