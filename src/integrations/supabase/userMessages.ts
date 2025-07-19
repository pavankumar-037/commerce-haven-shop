import { supabase } from "./client";

export interface UserMessage {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "replied";
  admin_reply?: string;
  admin_reply_at?: string;
  admin_replied_by?: string;
  is_authenticated: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  user_id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_authenticated?: boolean;
}

export interface UpdateMessageData {
  status?: "unread" | "read" | "replied";
  admin_reply?: string;
  admin_replied_by?: string;
}

export const userMessagesService = {
  // Create a new message
  async createMessage(data: CreateMessageData) {
    try {
      const { data: result, error } = await supabase
        .from("user_messages")
        .insert([
          {
            user_id: data.user_id,
            name: data.name,
            email: data.email,
            subject: data.subject || "General Inquiry",
            message: data.message,
            is_authenticated: data.is_authenticated || false,
            status: "unread",
          },
        ])
        .select()
        .single();

      return { data: result, error };
    } catch (error) {
      console.error("Error creating message:", error);
      return { data: null, error };
    }
  },

  // Get all messages (for admin)
  async getAllMessages() {
    try {
      const { data, error } = await supabase
        .from("user_messages")
        .select("*")
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      console.error("Error fetching all messages:", error);
      return { data: null, error };
    }
  },

  // Get messages for a specific user
  async getUserMessages(userId?: string, email?: string) {
    try {
      let query = supabase.from("user_messages").select("*");

      if (userId) {
        query = query.eq("user_id", userId);
      } else if (email) {
        query = query.eq("email", email);
      } else {
        return { data: [], error: null };
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      return { data, error };
    } catch (error) {
      console.error("Error fetching user messages:", error);
      return { data: null, error };
    }
  },

  // Get messages by email (for non-authenticated users or admin lookup)
  async getMessagesByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from("user_messages")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      console.error("Error fetching messages by email:", error);
      return { data: null, error };
    }
  },

  // Update message status or add admin reply
  async updateMessage(id: string, updates: UpdateMessageData) {
    try {
      const updateData: any = { ...updates };

      if (updates.admin_reply) {
        updateData.admin_reply_at = new Date().toISOString();
        updateData.status = "replied";
      }

      const { data, error } = await supabase
        .from("user_messages")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating message:", error);
      return { data: null, error };
    }
  },

  // Mark message as read
  async markAsRead(id: string) {
    return this.updateMessage(id, { status: "read" });
  },

  // Delete a message
  async deleteMessage(id: string) {
    try {
      const { error } = await supabase
        .from("user_messages")
        .delete()
        .eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting message:", error);
      return { error };
    }
  },

  // Get unread message count
  async getUnreadCount() {
    try {
      const { count, error } = await supabase
        .from("user_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      return { count: count || 0, error };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { count: 0, error };
    }
  },

  // Search messages (for admin)
  async searchMessages(query: string, status?: string) {
    try {
      let supabaseQuery = supabase.from("user_messages").select("*");

      if (status && status !== "all") {
        supabaseQuery = supabaseQuery.eq("status", status);
      }

      if (query.trim()) {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${query}%,email.ilike.%${query}%,subject.ilike.%${query}%,message.ilike.%${query}%`,
        );
      }

      const { data, error } = await supabaseQuery.order("created_at", {
        ascending: false,
      });
      return { data, error };
    } catch (error) {
      console.error("Error searching messages:", error);
      return { data: null, error };
    }
  },
};
