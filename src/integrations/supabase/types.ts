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
      admin_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          permissions: string[] | null
          phone_number: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          permissions?: string[] | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          permissions?: string[] | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      client_payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          client_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          stripe_payment_method_id: string
          updated_at: string | null
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          stripe_payment_method_id: string
          updated_at?: string | null
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          stripe_payment_method_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_payment_methods_client_id_fkey"
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
          payment_setup_completed: boolean | null
          payment_setup_completed_at: string | null
          phone_number: string
          relationship_to_recipient: string | null
          stripe_customer_id: string | null
          stripe_default_payment_method: string | null
          stripe_setup_intent_id: string | null
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
          payment_setup_completed?: boolean | null
          payment_setup_completed_at?: string | null
          phone_number: string
          relationship_to_recipient?: string | null
          stripe_customer_id?: string | null
          stripe_default_payment_method?: string | null
          stripe_setup_intent_id?: string | null
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
          payment_setup_completed?: boolean | null
          payment_setup_completed_at?: string | null
          phone_number?: string
          relationship_to_recipient?: string | null
          stripe_customer_id?: string | null
          stripe_default_payment_method?: string | null
          stripe_setup_intent_id?: string | null
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
      conversations: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          last_message_at: string | null
          nurse_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          last_message_at?: string | null
          nurse_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          last_message_at?: string | null
          nurse_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_nurse_id_fkey"
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
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_content: string
          recipient_id: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content: string
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content?: string
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      notification_preferences: {
        Row: {
          auto_approval_warnings: boolean | null
          created_at: string | null
          dispute_notifications: boolean | null
          email_notifications: boolean | null
          id: string
          payment_confirmations: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          timecard_reminders: boolean | null
          timecard_submissions: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_approval_warnings?: boolean | null
          created_at?: string | null
          dispute_notifications?: boolean | null
          email_notifications?: boolean | null
          id?: string
          payment_confirmations?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          timecard_reminders?: boolean | null
          timecard_submissions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_approval_warnings?: boolean | null
          created_at?: string | null
          dispute_notifications?: boolean | null
          email_notifications?: boolean | null
          id?: string
          payment_confirmations?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          timecard_reminders?: boolean | null
          timecard_submissions?: boolean | null
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
          license_photo_url: string | null
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
          license_photo_url?: string | null
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
          license_photo_url?: string | null
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
            foreignKeyName: "fk_nurse_preferences_nurse"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
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
          bio: string | null
          city: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed: boolean | null
          onboarding_completion_percentage: number | null
          phone_number: string
          profile_photo_url: string | null
          state: string
          street_address: string
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_charges_enabled: boolean | null
          stripe_onboarding_completed_at: string | null
          stripe_onboarding_url: string | null
          stripe_payouts_enabled: boolean | null
          stripe_requirements_due: string[] | null
          updated_at: string | null
          user_id: string | null
          zip_code: string
        }
        Insert: {
          bio?: string | null
          city: string
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number: string
          profile_photo_url?: string | null
          state: string
          street_address: string
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_onboarding_completed_at?: string | null
          stripe_onboarding_url?: string | null
          stripe_payouts_enabled?: boolean | null
          stripe_requirements_due?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          zip_code: string
        }
        Update: {
          bio?: string | null
          city?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          onboarding_completed?: boolean | null
          onboarding_completion_percentage?: number | null
          phone_number?: string
          profile_photo_url?: string | null
          state?: string
          street_address?: string
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_onboarding_completed_at?: string | null
          stripe_onboarding_url?: string | null
          stripe_payouts_enabled?: boolean | null
          stripe_requirements_due?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string
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
      payment_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          timecard_id: string | null
          user_agent: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          timecard_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          timecard_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_audit_logs_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "payment_summary"
            referencedColumns: ["timecard_id"]
          },
          {
            foreignKeyName: "payment_audit_logs_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          client_id: string
          created_at: string | null
          currency: string | null
          failed_at: string | null
          failure_reason: string | null
          gross_amount_cents: number
          hourly_rate_cents: number
          hours_worked: number
          id: string
          nurse_id: string
          nurse_net_amount_cents: number
          payment_method_type: string | null
          payment_status: string
          platform_fee_cents: number
          processed_at: string | null
          stripe_charge_id: string | null
          stripe_fee_cents: number | null
          stripe_payment_intent_id: string
          stripe_transfer_id: string | null
          timecard_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          currency?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gross_amount_cents: number
          hourly_rate_cents: number
          hours_worked: number
          id?: string
          nurse_id: string
          nurse_net_amount_cents: number
          payment_method_type?: string | null
          payment_status: string
          platform_fee_cents: number
          processed_at?: string | null
          stripe_charge_id?: string | null
          stripe_fee_cents?: number | null
          stripe_payment_intent_id: string
          stripe_transfer_id?: string | null
          timecard_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          currency?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gross_amount_cents?: number
          hourly_rate_cents?: number
          hours_worked?: number
          id?: string
          nurse_id?: string
          nurse_net_amount_cents?: number
          payment_method_type?: string | null
          payment_status?: string
          platform_fee_cents?: number
          processed_at?: string | null
          stripe_charge_id?: string | null
          stripe_fee_cents?: number | null
          stripe_payment_intent_id?: string
          stripe_transfer_id?: string | null
          timecard_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "nurse_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "payment_summary"
            referencedColumns: ["timecard_id"]
          },
          {
            foreignKeyName: "payment_transactions_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_configurations: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
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
      stripe_webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          raw_event_data: Json | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_event_data?: Json | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_event_data?: Json | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      timecard_disputes: {
        Row: {
          admin_notes: string | null
          client_evidence: string | null
          created_at: string | null
          dispute_reason: string
          id: string
          initiated_by: string
          initiated_by_type: string
          nurse_evidence: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"] | null
          timecard_id: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          client_evidence?: string | null
          created_at?: string | null
          dispute_reason: string
          id?: string
          initiated_by: string
          initiated_by_type: string
          nurse_evidence?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          timecard_id: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          client_evidence?: string | null
          created_at?: string | null
          dispute_reason?: string
          id?: string
          initiated_by?: string
          initiated_by_type?: string
          nurse_evidence?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          timecard_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timecard_disputes_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "payment_summary"
            referencedColumns: ["timecard_id"]
          },
          {
            foreignKeyName: "timecard_disputes_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      timecard_notifications: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          id: string
          notification_type: string
          push_sent: boolean | null
          read_at: string | null
          recipient_id: string
          sent_at: string | null
          sms_sent: boolean | null
          timecard_id: string
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          notification_type: string
          push_sent?: boolean | null
          read_at?: string | null
          recipient_id: string
          sent_at?: string | null
          sms_sent?: boolean | null
          timecard_id: string
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          notification_type?: string
          push_sent?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sent_at?: string | null
          sms_sent?: boolean | null
          timecard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecard_notifications_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "payment_summary"
            referencedColumns: ["timecard_id"]
          },
          {
            foreignKeyName: "timecard_notifications_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      timecard_payments: {
        Row: {
          client_id: string
          contract_id: string
          created_at: string | null
          gross_amount: number
          id: string
          nurse_id: string
          nurse_payment: number
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          platform_fee: number
          processed_at: string | null
          timecard_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          contract_id: string
          created_at?: string | null
          gross_amount: number
          id?: string
          nurse_id: string
          nurse_payment: number
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          platform_fee: number
          processed_at?: string | null
          timecard_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          contract_id?: string
          created_at?: string | null
          gross_amount?: number
          id?: string
          nurse_id?: string
          nurse_payment?: number
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          platform_fee?: number
          processed_at?: string | null
          timecard_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timecard_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timecard_payments_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "payment_summary"
            referencedColumns: ["timecard_id"]
          },
          {
            foreignKeyName: "timecard_payments_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      timecards: {
        Row: {
          approval_deadline: string
          approved_by_client: boolean | null
          auto_approval_triggered: boolean | null
          auto_approved: boolean | null
          break_minutes: number | null
          client_fee_amount: number | null
          client_id: string | null
          client_total_amount: number | null
          contract_id: string | null
          created_at: string | null
          dispute_id: string | null
          end_time: string
          final_notice_sent_at: string | null
          hourly_rate_at_time: number | null
          id: string
          is_overnight: boolean | null
          job_code: string
          night_shift_allocation: Json | null
          notes: string | null
          nurse_fee_amount: number | null
          nurse_id: string | null
          nurse_net_amount: number | null
          original_submission: Json | null
          payment_amount: number | null
          payment_error: string | null
          payment_processed: boolean | null
          payment_processed_at: string | null
          payment_retry_count: number | null
          platform_fee: number | null
          platform_fee_amount: number | null
          rejection_reason: string | null
          reminder_sent_at: string | null
          rounded_end_time: string
          rounded_start_time: string
          shift_date: string
          start_time: string
          status: Database["public"]["Enums"]["timecard_status"] | null
          stripe_payment_intent_id: string | null
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
          auto_approval_triggered?: boolean | null
          auto_approved?: boolean | null
          break_minutes?: number | null
          client_fee_amount?: number | null
          client_id?: string | null
          client_total_amount?: number | null
          contract_id?: string | null
          created_at?: string | null
          dispute_id?: string | null
          end_time: string
          final_notice_sent_at?: string | null
          hourly_rate_at_time?: number | null
          id?: string
          is_overnight?: boolean | null
          job_code: string
          night_shift_allocation?: Json | null
          notes?: string | null
          nurse_fee_amount?: number | null
          nurse_id?: string | null
          nurse_net_amount?: number | null
          original_submission?: Json | null
          payment_amount?: number | null
          payment_error?: string | null
          payment_processed?: boolean | null
          payment_processed_at?: string | null
          payment_retry_count?: number | null
          platform_fee?: number | null
          platform_fee_amount?: number | null
          rejection_reason?: string | null
          reminder_sent_at?: string | null
          rounded_end_time: string
          rounded_start_time: string
          shift_date: string
          start_time: string
          status?: Database["public"]["Enums"]["timecard_status"] | null
          stripe_payment_intent_id?: string | null
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
          auto_approval_triggered?: boolean | null
          auto_approved?: boolean | null
          break_minutes?: number | null
          client_fee_amount?: number | null
          client_id?: string | null
          client_total_amount?: number | null
          contract_id?: string | null
          created_at?: string | null
          dispute_id?: string | null
          end_time?: string
          final_notice_sent_at?: string | null
          hourly_rate_at_time?: number | null
          id?: string
          is_overnight?: boolean | null
          job_code?: string
          night_shift_allocation?: Json | null
          notes?: string | null
          nurse_fee_amount?: number | null
          nurse_id?: string | null
          nurse_net_amount?: number | null
          original_submission?: Json | null
          payment_amount?: number | null
          payment_error?: string | null
          payment_processed?: boolean | null
          payment_processed_at?: string | null
          payment_retry_count?: number | null
          platform_fee?: number | null
          platform_fee_amount?: number | null
          rejection_reason?: string | null
          reminder_sent_at?: string | null
          rounded_end_time?: string
          rounded_start_time?: string
          shift_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["timecard_status"] | null
          stripe_payment_intent_id?: string | null
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
            foreignKeyName: "timecards_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
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
      payment_summary: {
        Row: {
          client_first_name: string | null
          client_last_name: string | null
          client_stripe_customer: string | null
          client_total_amount: number | null
          failure_reason: string | null
          job_code: string | null
          nurse_first_name: string | null
          nurse_last_name: string | null
          nurse_net_amount: number | null
          nurse_stripe_account: string | null
          payment_processed_at: string | null
          payment_status: string | null
          platform_fee_amount: number | null
          shift_date: string | null
          stripe_payment_intent_id: string | null
          timecard_id: string | null
          timecard_status: Database["public"]["Enums"]["timecard_status"] | null
          timestamp_paid: string | null
          total_hours: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      auto_approve_expired_timecards: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      auto_approve_overdue_timecards: {
        Args: Record<PropertyKey, never>
        Returns: {
          processed_count: number
          timecard_ids: string[]
        }[]
      }
      calculate_payment_amounts: {
        Args: { nurse_hourly_rate: number; total_hours: number }
        Returns: {
          nurse_gross_amount: number
          nurse_net_amount: number
          nurse_fee_amount: number
          client_total_amount: number
          client_fee_amount: number
          platform_total_fee: number
        }[]
      }
      calculate_timecard_payment: {
        Args: { p_timecard_id: string; p_hourly_rate?: number }
        Returns: Json
      }
      can_submit_timecard: {
        Args: {
          p_nurse_id: string
          p_client_id: string
          p_job_id: string
          p_shift_date: string
        }
        Returns: boolean
      }
      get_overdue_timecards: {
        Args: Record<PropertyKey, never>
        Returns: {
          timecard_id: string
          nurse_id: string
          client_id: string
          hours_overdue: number
          nurse_name: string
          client_name: string
        }[]
      }
      get_timecards_approaching_deadline: {
        Args: { hours_before_deadline?: number }
        Returns: {
          timecard_id: string
          nurse_id: string
          client_id: string
          hours_until_deadline: number
          nurse_name: string
          client_name: string
          client_user_id: string
        }[]
      }
      round_time_to_quarter: {
        Args: { time_input: string }
        Returns: string
      }
    }
    Enums: {
      dispute_status:
        | "pending"
        | "investigating"
        | "resolved_client"
        | "resolved_nurse"
        | "resolved_admin"
      timecard_status:
        | "Submitted"
        | "Approved"
        | "Auto-Approved"
        | "Rejected"
        | "Paid"
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
      dispute_status: [
        "pending",
        "investigating",
        "resolved_client",
        "resolved_nurse",
        "resolved_admin",
      ],
      timecard_status: [
        "Submitted",
        "Approved",
        "Auto-Approved",
        "Rejected",
        "Paid",
      ],
      user_role: ["nurse", "client", "admin"],
    },
  },
} as const
