
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeContracts: number;
  pendingApplications: number;
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
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return {
    totalUsers: 0,
    totalJobs: 0,
    activeContracts: 0,
    pendingApplications: 0
  };
};

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  return {
    revenue: 0,
    activeNurses: 0,
    platformUtilization: 0
  };
};

export const getUsers = async (): Promise<AdminUser[]> => {
  return [];
};

export const getLicenseVerifications = async (): Promise<LicenseVerification[]> => {
  return [];
};

export const getJobPostings = async (): Promise<JobPosting[]> => {
  return [];
};

export const getTimecards = async (): Promise<AdminTimecard[]> => {
  return [];
};

export const updateLicenseStatus = async (
  id: string, 
  status: 'verified' | 'rejected'
): Promise<void> => {
  // Implementation would go here
};
