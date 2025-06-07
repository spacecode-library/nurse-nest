
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
  // Mock data for now since the RPC function doesn't exist
  const mockStats: DashboardStats = {
    total_nurses: 0,
    total_clients: 0,
    total_job_postings: 0,
    total_applications: 0,
    total_active_contracts: 0,
    total_timecards: 0,
    pending_nurse_profiles: 0,
    pending_client_profiles: 0,
    new_applications: 0,
    pending_timecards: 0,
    pending_verifications: 0,
    open_jobs: 0
  };
  
  return mockStats;
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('user_metadata')
    .select('*')
    .order('user_id');
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  // Transform the data to match AdminUser interface
  const transformedData: AdminUser[] = (data || []).map(item => ({
    id: item.user_id,
    email: '', // Not available in this query
    user_type: item.user_type as 'nurse' | 'client' | 'admin',
    account_status: item.account_status,
    created_at: new Date().toISOString(), // Mock date
    profile_data: {}
  }));
  
  return transformedData;
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
  
  // Transform the data to match LicenseVerification interface
  const transformedData: LicenseVerification[] = (data || []).map(item => ({
    id: item.id,
    nurse_id: item.nurse_id,
    license_number: item.license_number,
    state: item.issuing_state, // Map issuing_state to state
    expiration_date: item.expiration_date,
    verification_status: item.verification_status as 'pending' | 'verified' | 'rejected',
    created_at: item.created_at
  }));
  
  return transformedData;
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
  
  // Transform the data to match JobPosting interface
  const transformedData: JobPosting[] = (data || []).map(item => ({
    id: item.id,
    title: item.care_type || 'Untitled Job', // Use care_type as title fallback
    client_id: item.client_id,
    status: item.status,
    hourly_rate: 0, // Mock hourly rate since it's not in the schema
    created_at: item.created_at
  }));
  
  return transformedData;
};

export const getTimecardsForAdmin = async (): Promise<AdminTimecard[]> => {
  const { data, error } = await supabase
    .from('timecards')
    .select('*')
    .eq('status', 'Submitted' as any)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching timecards:', error);
    throw error;
  }
  
  // Transform the data to match AdminTimecard interface
  const transformedData: AdminTimecard[] = (data || []).map(item => ({
    id: item.id,
    nurse_id: item.nurse_id,
    client_id: item.client_id,
    shift_date: item.shift_date,
    hours_worked: item.total_hours || 0, // Map total_hours to hours_worked
    status: item.status,
    created_at: item.created_at
  }));
  
  return transformedData;
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
  // Mock data for now since the RPC function doesn't exist
  const mockMetrics: SystemMetrics = {
    total_users: 0,
    active_nurses: 0,
    active_clients: 0,
    total_revenue: 0,
    monthly_growth: 0,
    platform_health: 'Good'
  };
  
  return mockMetrics;
};
