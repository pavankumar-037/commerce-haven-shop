export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      offers: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          image_url: string | null;
          start_date: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_email: string;
          items: Json;
          payment_method: string;
          payment_status: string;
          order_status: string;
          created_at: string;
          updated_at: string;
          // New schema columns
          order_number?: string;
          total_amount?: number;
          stripe_session_id?: string | null;
          // Old schema columns (optional for backward compatibility)
          customer_info?: Json;
          subtotal?: number;
          coupon_discount?: number;
          shipping_cost?: number;
          total?: number;
          applied_coupon?: Json;
        };
        Insert: {
          id?: string;
          user_email: string;
          items: Json;
          payment_method: string;
          payment_status?: string;
          order_status?: string;
          created_at?: string;
          updated_at?: string;
          // New schema columns
          order_number?: string;
          total_amount?: number;
          stripe_session_id?: string | null;
          // Old schema columns (optional for backward compatibility)
          customer_info?: Json;
          subtotal?: number;
          coupon_discount?: number;
          shipping_cost?: number;
          total?: number;
          applied_coupon?: Json;
        };
        Update: {
          id?: string;
          user_email?: string;
          items?: Json;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          created_at?: string;
          updated_at?: string;
          // New schema columns
          order_number?: string;
          total_amount?: number;
          stripe_session_id?: string | null;
          // Old schema columns (optional for backward compatibility)
          customer_info?: Json;
          subtotal?: number;
          coupon_discount?: number;
          shipping_cost?: number;
          total?: number;
          applied_coupon?: Json;
        };
        Relationships: [];
      };
      theme_settings: {
        Row: {
          accent_color: string | null;
          background_color: string | null;
          created_at: string | null;
          id: string;
          primary_color: string | null;
          secondary_color: string | null;
          updated_at: string | null;
        };
        Insert: {
          accent_color?: string | null;
          background_color?: string | null;
          created_at?: string | null;
          id?: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          updated_at?: string | null;
        };
        Update: {
          accent_color?: string | null;
          background_color?: string | null;
          created_at?: string | null;
          id?: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
