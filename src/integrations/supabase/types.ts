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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buyer_details: {
        Row: {
          business_id: string | null
          company_name: string | null
          created_at: string
          primary_interest: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          company_name?: string | null
          created_at?: string
          primary_interest?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          company_name?: string | null
          created_at?: string
          primary_interest?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crop_listings: {
        Row: {
          created_at: string
          crop: string
          id: string
          notes: string | null
          price_per_unit: number | null
          quantity: number
          status: string
          transport_needed: boolean
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          quantity: number
          status?: string
          transport_needed?: boolean
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          quantity?: number
          status?: string
          transport_needed?: boolean
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farmer_details: {
        Row: {
          created_at: string
          farmer_id: string | null
          primary_crop: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          primary_crop?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          primary_crop?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      labourer_skills: {
        Row: {
          created_at: string
          id: string
          skill: Database["public"]["Enums"]["labour_skill"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill: Database["public"]["Enums"]["labour_skill"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill?: Database["public"]["Enums"]["labour_skill"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          full_name: string | null
          id: string
          language: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_bookings: {
        Row: {
          created_at: string
          distance_km: number
          drop_mandi: Database["public"]["Enums"]["mandi_destination"]
          estimated_cost: number
          id: string
          listing_id: string | null
          pickup_label: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          scheduled_at: string | null
          share_load: boolean
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
          vehicle: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          created_at?: string
          distance_km: number
          drop_mandi: Database["public"]["Enums"]["mandi_destination"]
          estimated_cost: number
          id?: string
          listing_id?: string | null
          pickup_label?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          scheduled_at?: string | null
          share_load?: boolean
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
          vehicle: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          created_at?: string
          distance_km?: number
          drop_mandi?: Database["public"]["Enums"]["mandi_destination"]
          estimated_cost?: number
          id?: string
          listing_id?: string | null
          pickup_label?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          scheduled_at?: string | null
          share_load?: boolean
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
          vehicle?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "crop_listings"
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
      app_role: "farmer" | "buyer" | "labourer"
      booking_status: "booked" | "out_for_pickup" | "at_mandi" | "sold"
      labour_skill:
        | "harvesting"
        | "sowing"
        | "ploughing"
        | "machine_operator"
        | "loading"
        | "pesticide_spraying"
        | "tractor_driving"
      mandi_destination:
        | "bandipalya_apmc"
        | "maddur_coconut"
        | "ramanagara_silk"
        | "chamarajanagar_turmeric"
      vehicle_type:
        | "tata_ace"
        | "mahindra_bolero"
        | "eicher_14ft"
        | "tractor_trailer"
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
      app_role: ["farmer", "buyer", "labourer"],
      booking_status: ["booked", "out_for_pickup", "at_mandi", "sold"],
      labour_skill: [
        "harvesting",
        "sowing",
        "ploughing",
        "machine_operator",
        "loading",
        "pesticide_spraying",
        "tractor_driving",
      ],
      mandi_destination: [
        "bandipalya_apmc",
        "maddur_coconut",
        "ramanagara_silk",
        "chamarajanagar_turmeric",
      ],
      vehicle_type: [
        "tata_ace",
        "mahindra_bolero",
        "eicher_14ft",
        "tractor_trailer",
      ],
    },
  },
} as const
