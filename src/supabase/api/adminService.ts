
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  user_type: 'nurse' | 'client' | 'admin';
  account_status: string;
  created_at: string;
  profile_data: Record<string, any>;
}

export interface DashboardStats {
  total_users: number;
  active_jobs: number;
  completed_contracts: number;
  revenue_this_month: number;
  pending_nurse_profiles: number;
  pending_client_profiles: number;
  new_applications: number;
  pending_timecards: number;
  pending_verifications: number;
  open_jobs: number;
}

export interface SystemMetrics {
  server_uptime: string;
  database_health: string;
  api_response_time: number;
  error_rate: number;
}

export interface LicenseVerification {
  id: string;
  nurse_id: string;
  license_number: string;
  state: string;
  expiration_date: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  verified_by?: string;
}

export interface JobPosting {
  id: string;
  client_id: string;
  title: string;
  location: string;
  pay_rate: number;
  status: 'active' | 'filled' | 'expired';
  created_at: string;
  applications_count?: number;
}

export interface AdminTimecard {
  id: string;
  nurse_id: string;
  client_id: string;
  hours_worked: number;
  hourly_rate: number;
  status: 'pending' | 'approved' | 'disputed';
  date_submitted: string;
  work_date: string;
}

export const adminService = {
  // Check admin status
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  // Get all users with admin privileges
  async getUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        created_at
      `);
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data?.map(user => ({
      id: user.id,
      email: user.email || '',
      user_type: 'nurse' as const,
      account_status: 'active',
      created_at: user.created_at,
      profile_data: {
        first_name: user.first_name,
        last_name: user.last_name
      }
    })) || [];
  },

  // Alias for backward compatibility
  async getAllUsers(): Promise<AdminUser[]> {
    return this.getUsers();
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [usersResult, jobsResult] = await Promise.all([
        supabase.from('nurse_profiles').select('id', { count: 'exact' }),
        supabase.from('job_postings').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      return {
        total_users: usersResult.count || 0,
        active_jobs: jobsResult.count || 0,
        completed_contracts: 0,
        revenue_this_month: 0,
        pending_nurse_profiles: 0,
        pending_client_profiles: 0,
        new_applications: 0,
        pending_timecards: 0,
        pending_verifications: 0,
        open_jobs: jobsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get system metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      server_uptime: '99.9%',
      database_health: 'Good',
      api_response_time: 120,
      error_rate: 0.01
    };
  },

  // Get license verifications
  async getLicenseVerifications(): Promise<LicenseVerification[]> {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching license verifications:', error);
      throw error;
    }

    return data?.map(license => ({
      id: license.id,
      nurse_id: license.nurse_id,
      license_number: license.license_number,
      state: license.state,
      expiration_date: license.expiration_date,
      verification_status: license.verification_status as 'pending' | 'verified' | 'rejected',
      verified_at: license.verified_at,
      verified_by: license.verified_by
    })) || [];
  },

  // Alias for backward compatibility
  async getPendingLicenseVerifications(): Promise<LicenseVerification[]> {
    const allVerifications = await this.getLicenseVerifications();
    return allVerifications.filter(v => v.verification_status === 'pending');
  },

  // Get job postings
  async getJobPostings(): Promise<JobPosting[]> {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching job postings:', error);
      throw error;
    }

    return data || [];
  },

  // Alias for backward compatibility
  async getJobPostingsForReview(): Promise<JobPosting[]> {
    return this.getJobPostings();
  },

  // Get timecards
  async getTimecards(): Promise<AdminTimecard[]> {
    const { data, error } = await supabase
      .from('timecards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching timecards:', error);
      throw error;
    }

    return data?.map(timecard => ({
      id: timecard.id,
      nurse_id: timecard.nurse_id,
      client_id: timecard.client_id,
      hours_worked: timecard.hours_worked,
      hourly_rate: timecard.hourly_rate,
      status: timecard.status as 'pending' | 'approved' | 'disputed',
      date_submitted: timecard.created_at,
      work_date: timecard.work_date
    })) || [];
  },

  // Alias for backward compatibility
  async getTimecardsForAdmin(): Promise<AdminTimecard[]> {
    return this.getTimecards();
  },

  // Update license verification status
  async updateLicenseVerification(licenseId: string, status: 'verified' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('nurse_licenses')
      .update({ 
        verification_status: status,
        verified_at: new Date().toISOString()
      })
      .eq('id', licenseId);
    
    if (error) {
      console.error('Error updating license verification:', error);
      throw error;
    }
  },

  // Alias for backward compatibility
  async updateLicenseVerificationStatus(licenseId: string, status: 'verified' | 'rejected'): Promise<void> {
    return this.updateLicenseVerification(licenseId, status);
  },

  // Update user account status
  async updateUserStatus(userId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('nurse_profiles')
      .update({ account_status: status })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Alias for backward compatibility
  async updateUserAccountStatus(userId: string, status: string): Promise<void> {
    return this.updateUserStatus(userId, status);
  }
};

// Export individual functions for backward compatibility
export const {
  checkAdminStatus,
  getUsers,
  getAllUsers,
  getDashboardStats,
  getSystemMetrics,
  getLicenseVerifications,
  getPendingLicenseVerifications,
  getJobPostings,
  getJobPostingsForReview,
  getTimecards,
  getTimecardsForAdmin,
  updateLicenseVerification,
  updateLicenseVerificationStatus,
  updateUserStatus,
  updateUserAccountStatus
} = adminService;
