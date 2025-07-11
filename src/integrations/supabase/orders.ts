import { supabase } from "./client";
import type { TablesInsert, Tables } from "./types";

export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;

export interface OrderData {
  userEmail: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  couponDiscount: number;
  shippingCost: number;
  total: number;
  appliedCoupon?: any;
  paymentMethod: string;
}

export const ordersService = {
  async createOrdersTable(): Promise<{ success: boolean; error?: string }> {
    console.log(
      "❌ Cannot create table from frontend code for security reasons",
    );
    console.log("💡 Please run the SQL script manually in Supabase dashboard:");
    console.log(`
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  customer_info jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  coupon_discount decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  applied_coupon jsonb,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.orders FOR ALL USING (true);
    `);

    return {
      success: false,
      error: "Table creation must be done manually in Supabase dashboard",
    };
  },

  async testConnection(): Promise<boolean> {
    try {
      // First test with a table we know exists (offers or theme_settings)
      console.log("Testing basic Supabase connection...");
      const { error: basicError } = await supabase
        .from("offers")
        .select("count")
        .limit(0);

      if (basicError) {
        console.error(
          "Basic Supabase connection failed:",
          JSON.stringify(
            {
              message: basicError.message,
              code: basicError.code,
              details: basicError.details,
              hint: basicError.hint,
            },
            null,
            2,
          ),
        );
        return false;
      }

      console.log("✅ Basic Supabase connection successful");

      // Now test orders table specifically
      console.log("Testing orders table access...");
      const { error: ordersError } = await supabase
        .from("orders")
        .select("count")
        .limit(0);

      if (ordersError) {
        console.error(
          "Orders table access failed:",
          JSON.stringify(
            {
              message: ordersError.message,
              code: ordersError.code,
              details: ordersError.details,
              hint: ordersError.hint,
            },
            null,
            2,
          ),
        );

        // Check if it's a missing table error
        if (
          ordersError.code === "PGRST106" ||
          ordersError.message?.includes("does not exist")
        ) {
          console.error("❌ ORDERS TABLE MISSING - This is the root cause!");
          console.error(
            "💡 Solution: Run the CREATE_ORDERS_TABLE.sql script in your Supabase dashboard",
          );
        }

        return false;
      }

      console.log("✅ Orders table access successful");
      return true;
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
      };
      console.error(
        "Supabase connection test exception:",
        JSON.stringify(errorDetails, null, 2),
      );
      return false;
    }
  },

  async createOrder(
    orderData: OrderData,
  ): Promise<{ data: Order | null; error: Error | null }> {
    try {
      // Validate required fields
      if (
        !orderData.userEmail ||
        !orderData.customerInfo ||
        !orderData.items ||
        orderData.items.length === 0
      ) {
        return { data: null, error: new Error("Missing required order data") };
      }

      console.log("Creating order with data:", {
        userEmail: orderData.userEmail,
        customerInfo: orderData.customerInfo,
        itemsCount: orderData.items.length,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
      });

      const orderInsert: OrderInsert = {
        user_email: orderData.userEmail,
        customer_info: orderData.customerInfo,
        items: orderData.items,
        subtotal: orderData.subtotal,
        coupon_discount: orderData.couponDiscount,
        shipping_cost: orderData.shippingCost,
        total: orderData.total,
        applied_coupon: orderData.appliedCoupon || null,
        payment_method: orderData.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
      };

      console.log("Attempting to insert order into Supabase...");

      const { data, error } = await supabase
        .from("orders")
        .insert(orderInsert)
        .select()
        .single();

      console.log("Supabase insert result:", { data, error });

      if (error) {
        const errorDetails = JSON.stringify(
          {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          },
          null,
          2,
        );

        console.error("Supabase error creating order:", errorDetails);

        // Check for specific error types
        if (error.code === "PGRST106") {
          console.error("❌ ORDERS TABLE MISSING!");
          console.error("💡 Run CREATE_ORDERS_TABLE.sql in Supabase dashboard");
        } else if (error.code === "PGRST301") {
          console.error("❌ PERMISSION DENIED - Check RLS policies");
        }

        return {
          data: null,
          error: new Error(
            `Order creation failed: ${error.message} (Code: ${error.code})`,
          ),
        };
      }

      return { data, error: null };
    } catch (error) {
      const errorDetails = JSON.stringify(
        {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          type: typeof error,
        },
        null,
        2,
      );

      console.error("Exception creating order:", errorDetails);

      // Fallback to localStorage if Supabase fails
      try {
        console.log("Attempting localStorage fallback for order creation...");
        const fallbackOrder = {
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_email: orderData.userEmail,
          customer_info: orderData.customerInfo,
          items: orderData.items,
          subtotal: orderData.subtotal,
          coupon_discount: orderData.couponDiscount,
          shipping_cost: orderData.shippingCost,
          total: orderData.total,
          applied_coupon: orderData.appliedCoupon || null,
          payment_method: orderData.paymentMethod,
          payment_status: "pending",
          order_status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Save to localStorage as fallback
        const existingOrders = JSON.parse(
          localStorage.getItem("orders") || "[]",
        );
        existingOrders.push(fallbackOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        console.log(
          "Order saved to localStorage as fallback:",
          fallbackOrder.id,
        );
        return { data: fallbackOrder as Order, error: null };
      } catch (fallbackError) {
        console.error("localStorage fallback also failed:", fallbackError);
        return {
          data: null,
          error:
            error instanceof Error
              ? error
              : new Error("Unknown error occurred"),
        };
      }
    }
  },

  async getOrders(): Promise<{ data: Order[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  },

  async getOrdersByEmail(
    email: string,
  ): Promise<{ data: Order[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user orders:", error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus: string,
    paymentStatus?: string,
  ): Promise<{ data: Order | null; error: Error | null }> {
    try {
      const updateData: any = { order_status: orderStatus };
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        console.error("Error updating order:", error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating order:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  },
};
