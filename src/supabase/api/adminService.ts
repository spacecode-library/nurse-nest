
import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  // User Management
  async getAllUsers() {
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

  // Application Management
  async getAllApplications() {
    const { data, error } = await supabase
      .from('job_applications')
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
  async getPlatformStats() {
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
  }
};
