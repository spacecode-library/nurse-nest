export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          cover_message: string | null
          created_at: string | null
          id: string
          job_id: string | null
          nurse_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          cover_message?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          nurse_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          cover_message?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          nurse_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_locations: {
        Row: {
          city: string
          client_id: string | null
          created_at: string | null
          home_environment: string
          id: string
          state: string
          street_address: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          city: string
          client_id?: string | null
          created_at?: string | null
          home_environment: string
          id?: string
          state: string
          street_address: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          city?: string
          client_id?: string | null
          created_at?: string | null
          home_environment?: string
          id?: string
          state?: string
          street_address?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_locations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_needs: {
        Row: {
          additional_notes: string | null
          care_schedule: string[]
          care_types: string[]
          client_id: string | null
          created_at: string | null
          health_conditions: string[]
          hours_per_week: number
          id: string
          special_skills: string[]
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          care_schedule: string[]
          care_types: string[]
          client_id?: string | null
          created_at?: string | null
          health_conditions: string[]
          hours_per_week: number
          id?: string
          special_skills: string[]
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          care_schedule?: string[]
          care_types?: string[]
          client_id?: string | null
          created_at?: string | null
          health_conditions?: string[]
          hours_per_week?: number
          id?: string
          special_skills?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_needs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_recipients: {
        Row: {
          age: number
          client_id: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
        }
        Insert: {
          age: number
          client_id?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          updated_at?: string | null
        }
        Update: {
          age?: number
          client_id?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_recipients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          client_type: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed: boolean | null
          onboarding_completion_percentage: number | null
          phone_number: string
          relationship_to_recipient: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_type: string
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number: string
          relationship_to_recipient?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_type?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number?: string
          relationship_to_recipient?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          nurse_id: string | null
          status: string
          terms: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          nurse_id?: string | null
          status?: string
          terms: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          nurse_id?: string | null
          status?: string
          terms?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          benefits: string | null
          care_type: string
          client_id: string | null
          created_at: string | null
          duration: string
          id: string
          job_code: string
          preferred_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          care_type: string
          client_id?: string | null
          created_at?: string | null
          duration: string
          id?: string
          job_code: string
          preferred_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          care_type?: string
          client_id?: string | null
          created_at?: string | null
          duration?: string
          id?: string
          job_code?: string
          preferred_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          message_content: string
          notification_type: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_content: string
          notification_type: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_content?: string
          notification_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nurse_certifications: {
        Row: {
          certification_file_url: string | null
          certification_name: string
          created_at: string | null
          expiration_date: string | null
          id: string
          is_malpractice_insurance: boolean | null
          nurse_id: string | null
          updated_at: string | null
        }
        Insert: {
          certification_file_url?: string | null
          certification_name: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          is_malpractice_insurance?: boolean | null
          nurse_id?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_file_url?: string | null
          certification_name?: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          is_malpractice_insurance?: boolean | null
          nurse_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurse_certifications_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nurse_licenses: {
        Row: {
          created_at: string | null
          expiration_date: string
          id: string
          issuing_state: string
          license_number: string
          license_type: string
          nurse_id: string | null
          updated_at: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          expiration_date: string
          id?: string
          issuing_state: string
          license_number: string
          license_type: string
          nurse_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string | null
          expiration_date?: string
          id?: string
          issuing_state?: string
          license_number?: string
          license_type?: string
          nurse_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "nurse_licenses_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nurse_preferences: {
        Row: {
          availability_types: string[]
          created_at: string | null
          desired_hourly_rate: number
          id: string
          location_preferences: string[]
          nurse_id: string | null
          preferred_shifts: string[]
          travel_radius: number
          updated_at: string | null
        }
        Insert: {
          availability_types: string[]
          created_at?: string | null
          desired_hourly_rate: number
          id?: string
          location_preferences: string[]
          nurse_id?: string | null
          preferred_shifts: string[]
          travel_radius: number
          updated_at?: string | null
        }
        Update: {
          availability_types?: string[]
          created_at?: string | null
          desired_hourly_rate?: number
          id?: string
          location_preferences?: string[]
          nurse_id?: string | null
          preferred_shifts?: string[]
          travel_radius?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurse_preferences_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nurse_profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed: boolean | null
          onboarding_completion_percentage: number | null
          phone_number: string
          profile_photo_url: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number: string
          profile_photo_url: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number?: string
          profile_photo_url?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nurse_qualifications: {
        Row: {
          created_at: string | null
          education_level: string
          graduation_year: number
          id: string
          nurse_id: string | null
          resume_url: string
          school_name: string
          specializations: string[]
          updated_at: string | null
          years_experience: number
        }
        Insert: {
          created_at?: string | null
          education_level: string
          graduation_year: number
          id?: string
          nurse_id?: string | null
          resume_url: string
          school_name: string
          specializations: string[]
          updated_at?: string | null
          years_experience: number
        }
        Update: {
          created_at?: string | null
          education_level?: string
          graduation_year?: number
          id?: string
          nurse_id?: string | null
          resume_url?: string
          school_name?: string
          specializations?: string[]
          updated_at?: string | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "nurse_qualifications_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timecards: {
        Row: {
          approval_deadline: string
          approved_by_client: boolean | null
          auto_approved: boolean | null
          break_minutes: number | null
          client_id: string | null
          created_at: string | null
          end_time: string
          id: string
          is_overnight: boolean | null
          job_code: string
          notes: string | null
          nurse_id: string | null
          rounded_end_time: string
          rounded_start_time: string
          shift_date: string
          start_time: string
          status: string
          timestamp_approved: string | null
          timestamp_paid: string | null
          timestamp_submitted: string | null
          total_hours: number
          updated_at: string | null
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          approval_deadline: string
          approved_by_client?: boolean | null
          auto_approved?: boolean | null
          break_minutes?: number | null
          client_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          is_overnight?: boolean | null
          job_code: string
          notes?: string | null
          nurse_id?: string | null
          rounded_end_time: string
          rounded_start_time: string
          shift_date: string
          start_time: string
          status?: string
          timestamp_approved?: string | null
          timestamp_paid?: string | null
          timestamp_submitted?: string | null
          total_hours: number
          updated_at?: string | null
          week_end_date: string
          week_start_date: string
        }
        Update: {
          approval_deadline?: string
          approved_by_client?: boolean | null
          auto_approved?: boolean | null
          break_minutes?: number | null
          client_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          is_overnight?: boolean | null
          job_code?: string
          notes?: string | null
          nurse_id?: string | null
          rounded_end_time?: string
          rounded_start_time?: string
          shift_date?: string
          start_time?: string
          status?: string
          timestamp_approved?: string | null
          timestamp_paid?: string | null
          timestamp_submitted?: string | null
          total_hours?: number
          updated_at?: string | null
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timecards_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metadata: {
        Row: {
          account_status: string
          user_id: string
          user_type: string
        }
        Insert: {
          account_status?: string
          user_id: string
          user_type: string
        }
        Update: {
          account_status?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "nurse" | "client" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["nurse", "client", "admin"],
    },
  },
} as const
