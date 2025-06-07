
import { supabase } from '@/integrations/supabase/client';

// Types
export interface DashboardStats {
  total_nurses: number;
  total_clients: number;
  total_job_postings: number;
  total_applications: number;
  total_active_contracts: number;
  total_timecards: number;
  pending_nurse_profiles: number;
  pending_client_profiles: number;
  new_applications: number;
  pending_timecards: number;
  pending_verifications: number;
  open_jobs: number;
}

export interface AdminUser {
  id: string;
  email: string;
  user_type: 'nurse' | 'client' | 'admin';
  account_status: string;
  created_at: string;
  profile_data: any;
}

export interface SystemMetrics {
  total_users: number;
  active_nurses: number;
  active_clients: number;
  total_revenue: number;
  monthly_growth: number;
  platform_health: string;
}

export interface LicenseVerification {
  id: string;
  nurse_id: string;
  license_number: string;
  state: string;
  expiration_date: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  client_id: string;
  status: string;
  hourly_rate: number;
  created_at: string;
}

export interface AdminTimecard {
  id: string;
  nurse_id: string;
  client_id: string;
  shift_date: string;
  hours_worked: number;
  status: string;
  created_at: string;
}

// Service functions
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
  
  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
  
  return data;
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('user_metadata')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data || [];
};

export const updateUserAccountStatus = async (userId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('user_metadata')
    .update({ account_status: status })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getPendingLicenseVerifications = async (): Promise<LicenseVerification[]> => {
  const { data, error } = await supabase
    .from('nurse_licenses')
    .select('*')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching pending verifications:', error);
    throw error;
  }
  
  return data || [];
};

export const updateLicenseVerificationStatus = async (
  licenseId: string, 
  status: 'verified' | 'rejected'
): Promise<void> => {
  const { error } = await supabase
    .from('nurse_licenses')
    .update({ verification_status: status })
    .eq('id', licenseId);
  
  if (error) {
    console.error('Error updating license verification:', error);
    throw error;
  }
};

export const getJobPostingsForReview = async (): Promise<JobPosting[]> => {
  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
  
  return data || [];
};

export const getTimecardsForAdmin = async (): Promise<AdminTimecard[]> => {
  const { data, error } = await supabase
    .from('timecards')
    .select('*')
    .eq('status', 'submitted')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching timecards:', error);
    throw error;
  }
  
  return data || [];
};

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_metadata')
    .select('user_type')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  
  return data?.user_type === 'admin';
};

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const { data, error } = await supabase.rpc('get_system_metrics');
  
  if (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
  
  return data;
};
