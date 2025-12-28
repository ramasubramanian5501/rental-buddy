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
      customers: {
        Row: {
          aadhaar_number: string | null
          active_rentals: number
          address: string | null
          company: string
          created_at: string
          email: string | null
          id: string
          name: string
          pan_number: string | null
          phone: string | null
          total_rentals: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          aadhaar_number?: string | null
          active_rentals?: number
          address?: string | null
          company: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          pan_number?: string | null
          phone?: string | null
          total_rentals?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          aadhaar_number?: string | null
          active_rentals?: number
          address?: string | null
          company?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          pan_number?: string | null
          phone?: string | null
          total_rentals?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          assigned_vehicle_id: string | null
          created_at: string
          id: string
          license_number: string | null
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_vehicle_id?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_vehicle_id?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_count: number
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          rent_count: number
          rent_per_hour: number
          size_unit: string
          size_value: string
          stock_count: number
          updated_at: string
        }
        Insert: {
          available_count?: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rent_count?: number
          rent_per_hour?: number
          size_unit?: string
          size_value: string
          stock_count?: number
          updated_at?: string
        }
        Update: {
          available_count?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rent_count?: number
          rent_per_hour?: number
          size_unit?: string
          size_value?: string
          stock_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      rental_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          rental_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          rental_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          rental_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_products_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          actual_return_date: string | null
          advance_amount: number
          advance_percent: number
          created_at: string
          customer_id: string
          driver_id: string | null
          id: string
          location: string | null
          location_lat: number | null
          location_lng: number | null
          remaining_amount: number
          rental_code: string
          return_date: string
          start_date: string
          status: string
          total_amount: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          actual_return_date?: string | null
          advance_amount?: number
          advance_percent?: number
          created_at?: string
          customer_id: string
          driver_id?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          remaining_amount?: number
          rental_code: string
          return_date: string
          start_date: string
          status?: string
          total_amount?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          actual_return_date?: string | null
          advance_amount?: number
          advance_percent?: number
          created_at?: string
          customer_id?: string
          driver_id?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          remaining_amount?: number
          rental_code?: string
          return_date?: string
          start_date?: string
          status?: string
          total_amount?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          assigned_driver_id: string | null
          capacity: string
          created_at: string
          id: string
          status: string
          updated_at: string
          vehicle_number: string
          vehicle_type: string
        }
        Insert: {
          assigned_driver_id?: string | null
          capacity: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          vehicle_number: string
          vehicle_type: string
        }
        Update: {
          assigned_driver_id?: string | null
          capacity?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicles_driver"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
