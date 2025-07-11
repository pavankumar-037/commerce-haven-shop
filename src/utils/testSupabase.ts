import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  console.log("Testing Supabase connection...");

  try {
    // Test 1: Simple query to check if we can connect
    console.log("Test 1: Basic connection");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("orders")
      .select("count")
      .limit(0);

    if (connectionError) {
      console.error("Connection test failed:", {
        message: connectionError.message,
        code: connectionError.code,
        details: connectionError.details,
        hint: connectionError.hint,
        fullError: connectionError,
      });

      // Check if it's a table not found error
      if (
        connectionError.code === "PGRST106" ||
        connectionError.message.includes("does not exist")
      ) {
        console.error(
          "❌ ORDERS TABLE DOES NOT EXIST - This is the root cause!",
        );
        return {
          success: false,
          error: new Error(
            "Orders table does not exist in Supabase. Please run the migration.",
          ),
        };
      }

      return { success: false, error: connectionError };
    }

    console.log("✅ Connection successful");

    // Test 2: Try to insert a simple test record
    console.log("Test 2: Insert test");
    const testOrder = {
      user_email: "test@example.com",
      customer_info: {
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
      coupon_discount: 0,
      shipping_cost: 0,
      total: 99.99,
      applied_coupon: null,
      payment_method: "test",
      payment_status: "pending",
      order_status: "pending",
    };

    const { data: insertData, error: insertError } = await supabase
      .from("orders")
      .insert(testOrder)
      .select()
      .single();

    if (insertError) {
      console.error("Insert test failed:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        fullError: insertError,
      });
      return { success: false, error: insertError };
    }

    console.log("✅ Insert successful:", insertData);

    // Test 3: Clean up - delete the test record
    if (insertData) {
      await supabase.from("orders").delete().eq("id", insertData.id);
      console.log("✅ Test record cleaned up");
    }

    return { success: true, data: insertData };
  } catch (error) {
    console.error("Test exception:", error);
    return { success: false, error };
  }
};

// Make it available globally for browser console testing
(window as any).testSupabase = testSupabaseConnection;
