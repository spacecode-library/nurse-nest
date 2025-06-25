// src/types/index.ts
// Updated types with proper React imports and enhanced admin types

import React, { ReactNode } from 'react';

// Export common types
export interface AdminNurseProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_photo_url: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  created_at: string;
  updated_at: string;
  // Fixed qualifications type to include proper React types
  qualifications?: {
    education_level: string;
    years_experience: number;
    specializations: string[];
    school_name: string;
    graduation_year: number;
    resume_url: string;
    // Add methods that React components expect
    length: number;
    map(callback: (qual: any, index: number) => React.ReactElement): ReactNode;
  };
  licenses?: Array<{
    id: string;
    license_type: string;
    license_number: string;
    issuing_state: string;
    expiration_date: string;
    verification_status: 'pending' | 'verified' | 'failed';
  }>;
  preferences?: {
    availability_types: string[];
    preferred_shifts: string[];
    location_preferences: string[];
    travel_radius: number;
    desired_hourly_rate: number;
  };
  background_checks?: Array<{
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    result?: 'clear' | 'consider' | 'suspended';
    adjudication?: 'clear' | 'consider' | 'suspended';
    initiated_at: string;
    completed_at?: string;
    client_id: string;
  }>;
}

export interface AdminClientProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  client_type: 'individual' | 'family';
  relationship_to_recipient?: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  created_at: string;
  updated_at: string;
  care_recipients?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    age: number;
  }>;
  care_locations?: Array<{
    id: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    home_environment: string;
  }>;
  care_needs?: Array<{
    id: string;
    care_types: string[];
    care_schedule: string[];
    hours_per_week: number;
    special_skills: string[];
    health_conditions: string[];
    additional_notes?: string;
  }>;
  job_postings?: Array<{
    id: string;
    job_code: string;
    care_type: string;
    duration: string;
    preferred_time: string;
    status: 'open' | 'filled' | 'expired';
    benefits?: string;
    created_at: string;
  }>;
}

// Video call types
export interface VideoCallParticipant {
  id: string;
  video_call_id: string;
  user_id: string;
  participant_type: 'host' | 'attendee';
  joined_at?: string;
  left_at?: string;
  total_duration_minutes?: number;
  created_at: string;
}

export interface VideoCallWithParticipants {
  id: string;
  conversation_id: string;
  zoom_meeting_id: string;
  zoom_meeting_password?: string;
  zoom_join_url: string;
  zoom_start_url: string;
  scheduled_at?: string;
  duration_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  initiated_by_user_id: string;
  meeting_topic?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
  participants?: VideoCallParticipant[];
}

// Background check types
export interface BackgroundCheckWithDetails {
  id: string;
  nurse_id: string;
  client_id: string;
  job_posting_id?: string;
  checkr_candidate_id?: string;
  checkr_report_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  result?: 'clear' | 'consider' | 'suspended';
  adjudication?: 'clear' | 'consider' | 'suspended';
  initiated_at: string;
  completed_at?: string;
  expires_at?: string;
  package_used: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  nurse_profile?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  client_profile?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  job_posting?: {
    job_code: string;
    care_type: string;
    status: string;
  };
}

// Conversation types
export interface ConversationWithDetails {
  id: string;
  client_id: string;
  nurse_id: string;
  job_id?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  client_profile?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  nurse_profile?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  job_posting?: {
    job_code: string;
    care_type: string;
    duration: string;
    preferred_time: string;
    status: string;
  };
  unread_count?: number;
  last_message?: {
    message_content: string;
    created_at: string;
    sender_id: string;
  };
}

// Form validation types
export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Notification types
export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

// User authentication types
export interface UserProfile {
  id: string;
  email: string;
  user_type: 'nurse' | 'client' | 'admin';
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: string;
  last_login?: string;
  account_status: 'active' | 'suspended' | 'deactivated' | 'dormant';
}

// File upload types
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface FileUploadError {
  code: string;
  message: string;
  details?: any;
}

// Dashboard metrics types
export interface DashboardMetrics {
  total_nurses: number;
  total_clients: number;
  active_jobs: number;
  pending_applications: number;
  completed_background_checks: number;
  active_video_calls: number;
  revenue_this_month: number;
  growth_percentage: number;
}

// Export utility type helpers
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Status type unions for better type safety
export type BackgroundCheckStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type BackgroundCheckResult = 'clear' | 'consider' | 'suspended';
export type VideoCallStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type JobPostingStatus = 'open' | 'filled' | 'expired';
export type ApplicationStatus = 'new' | 'shortlisted' | 'hired' | 'declined';
export type UserType = 'nurse' | 'client' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'deactivated' | 'dormant';