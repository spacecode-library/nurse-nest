
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeContracts: number;
  pendingApplications: number;
  pending_nurse_profiles: number;
  pending_client_profiles: number;
  new_applications: number;
  pending_timecards: number;
  pending_verifications: number;
  open_jobs: number;
}

export interface SystemMetrics {
  revenue: number;
  activeNurses: number;
  platformUtilization: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  user_type: string;
  user_id: string;
  account_status: string;
  profile_data?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    client_type?: string;
    onboarding_completed?: boolean;
    care_needs?: any;
    relationship_to_recipient?: string;
    care_recipients?: any;
    care_location?: any;
    onboarding_completion_percentage?: number;
    years_experience?: number;
    specializations?: any;
    license_info?: any;
  };
}

export interface LicenseVerification {
  id: string;
  nurse_id: string;
  license_number: string;
  state: string;
  expiry_date: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  hourly_rate: number;
  status: string;
  created_at: string;
}

export interface AdminTimecard {
  id: string;
  nurse_id: string;
  client_id: string;
  hours: number;
  date: string;
  status: string;
  created_at: string;
}

// Mock functions - replace with actual Supabase calls as needed
export const getDashboardStats = async (): Promise<{ data: DashboardStats }> => {
  return {
    data: {
      totalUsers: 0,
      totalJobs: 0,
      activeContracts: 0,
      pendingApplications: 0,
      pending_nurse_profiles: 0,
      pending_client_profiles: 0,
      new_applications: 0,
      pending_timecards: 0,
      pending_verifications: 0,
      open_jobs: 0
    }
  };
};

export const getSystemMetrics = async (): Promise<{ data: SystemMetrics }> => {
  return {
    data: {
      revenue: 0,
      activeNurses: 0,
      platformUtilization: 0
    }
  };
};

export const getUsers = async (): Promise<AdminUser[]> => {
  return [];
};

export const getAllUsers = async (
  userType?: string,
  limit: number = 20,
  offset: number = 0,
  searchTerm?: string
): Promise<{ data: AdminUser[], count: number }> => {
  return {
    data: [],
    count: 0
  };
};

export const updateUserAccountStatus = async (
  userId: string,
  status: string
): Promise<void> => {
  // Implementation would go here
};

export const getLicenseVerifications = async (): Promise<LicenseVerification[]> => {
  return [];
};

export const getPendingLicenseVerifications = async (
  limit: number = 20,
  offset: number = 0
): Promise<{ data: LicenseVerification[] }> => {
  return {
    data: []
  };
};

export const updateLicenseVerificationStatus = async (
  id: string,
  status: 'verified' | 'failed'
): Promise<void> => {
  // Implementation would go here
};

export const getJobPostings = async (): Promise<JobPosting[]> => {
  return [];
};

export const getJobPostingsForReview = async (): Promise<{ data: JobPosting[] }> => {
  return {
    data: []
  };
};

export const getTimecards = async (): Promise<AdminTimecard[]> => {
  return [];
};

export const getTimecardsForAdmin = async (): Promise<{ data: AdminTimecard[] }> => {
  return {
    data: []
  };
};

export const checkAdminStatus = async (userId: string): Promise<{ isAdmin: boolean }> => {
  // Mock implementation - in real app this would check admin_profiles table
  return {
    isAdmin: true // For development purposes, always return true
  };
};

export const updateLicenseStatus = async (
  id: string, 
  status: 'verified' | 'rejected'
): Promise<void> => {
  // Implementation would go here
};
