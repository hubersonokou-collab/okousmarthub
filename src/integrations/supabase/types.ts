export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      formations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean
          price: number
          sessions: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          sessions?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          sessions?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_phone: string | null
          details: Json | null
          id: string
          service_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_phone?: string | null
          details?: Json | null
          id?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_phone?: string | null
          details?: Json | null
          id?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          link: string | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          link?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          link?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      service_prices: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          price: number
          service_id: string
          variant_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price: number
          service_id: string
          variant_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price?: number
          service_id?: string
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requirements: {
        Row: {
          description: string | null
          display_order: number | null
          document_name: string
          id: string
          is_required: boolean | null
          service_id: string
        }
        Insert: {
          description?: string | null
          display_order?: number | null
          document_name: string
          id?: string
          is_required?: boolean | null
          service_id: string
        }
        Update: {
          description?: string | null
          display_order?: number | null
          document_name?: string
          id?: string
          is_required?: boolean | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requirements_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          icon: string
          id: string
          image_url: string | null
          is_active: boolean
          long_description: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_avatar: string | null
          author_name: string
          comment: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_name: string
          comment: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_name?: string
          comment?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_email: string | null
          id: string
          metadata: Json | null
          order_id: string
          payment_method: string | null
          paystack_access_code: string | null
          paystack_reference: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          payment_method?: string | null
          paystack_access_code?: string | null
          paystack_reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          payment_method?: string | null
          paystack_access_code?: string | null
          paystack_reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      web_solutions_orders: {
        Row: {
          business_type: string
          client_name: string
          created_at: string
          description: string | null
          email: string
          id: string
          invoice_number: string | null
          pack_type: string
          paid_amount: number | null
          payment_mode: string | null
          payment_status: string | null
          payment_terms: string | null
          phone: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          business_type: string
          client_name: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          invoice_number?: string | null
          pack_type: string
          paid_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          phone: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          business_type?: string
          client_name?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          invoice_number?: string | null
          pack_type?: string
          paid_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          phone?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      vocals: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          original_language: string | null
          original_text: string
          target_language: string
          translated_text: string
          user_id: string | null
          voice_used: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          original_language?: string | null
          original_text: string
          target_language: string
          translated_text: string
          user_id?: string | null
          voice_used?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          original_language?: string | null
          original_text?: string
          target_language?: string
          translated_text?: string
          user_id?: string | null
          voice_used?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      order_status: "pending" | "in_progress" | "completed" | "cancelled"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      order_status: ["pending", "in_progress", "completed", "cancelled"],
      transaction_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
