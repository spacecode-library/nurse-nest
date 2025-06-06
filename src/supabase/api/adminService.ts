
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  totalNurses: number;
  totalClients: number;
  totalJobs: number;
}

export interface AdminUser {
  user_id: string;
  account_status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const adminService = {
  // User Management
  async getAllUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('user_metadata')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('user_metadata')
      .update({ account_status: status })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserAccountStatus(userId: string, status: string) {
    return this.updateUserStatus(userId, status);
  },

  // Nurse Management
  async getAllNurses() {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .select(`
        *,
        user_metadata!inner (
          account_status
        ),
        profiles!inner (
          email,
          first_name,
          last_name
        ),
        nurse_licenses (*),
        nurse_certifications (*),
        nurse_preferences (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateNurseStatus(nurseId: string, status: string) {
    const { data, error } = await supabase
      .from('user_metadata')
      .update({ account_status: status })
      .eq('user_id', nurseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Client Management
  async getAllClients() {
    const { data, error } = await supabase
      .from('client_profiles')
      .select(`
        *,
        user_metadata!inner (
          account_status
        ),
        profiles!inner (
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Job Management
  async getAllJobs() {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner (
          user_id,
          profiles!inner (
            first_name,
            last_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Application Management - Fixed table name
  async getAllApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings!inner (
          title,
          client_profiles!inner (
            profiles!inner (
              first_name,
              last_name
            )
          )
        ),
        nurse_profiles!inner (
          profiles!inner (
            first_name,
            last_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Analytics
  async getPlatformStats(): Promise<DashboardStats> {
    try {
      const [usersResult, nursesResult, clientsResult, jobsResult] = await Promise.all([
        supabase.from('user_metadata').select('*', { count: 'exact', head: true }),
        supabase.from('nurse_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('client_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('job_postings').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalNurses: nursesResult.count || 0,
        totalClients: clientsResult.count || 0,
        totalJobs: jobsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        totalUsers: 0,
        totalNurses: 0,
        totalClients: 0,
        totalJobs: 0
      };
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return this.getPlatformStats();
  },

  async checkAdminStatus(userId: string) {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async getPendingLicenseVerifications() {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .select(`
        *,
        nurse_profiles!inner (
          profiles!inner (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateLicenseVerificationStatus(licenseId: string, status: string) {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .update({ verification_status: status })
      .eq('id', licenseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getJobPostingsForReview() {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner (
          profiles!inner (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTimecardsForAdmin() {
    const { data, error } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!inner (
          profiles!inner (
            first_name,
            last_name
          )
        ),
        client_profiles!inner (
          profiles!inner (
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSystemMetrics() {
    return this.getPlatformStats();
  }
};
