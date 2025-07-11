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
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from("orders").select("count").limit(0);
      if (error) {
        console.error("Supabase connection test failed:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Supabase connection test exception:", error);
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
        console.error("Supabase error creating order:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return {
          data: null,
          error: new Error(
            `Order creation failed: ${error.message} (Code: ${error.code})`,
          ),
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
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
