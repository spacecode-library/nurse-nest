// src/supabase/api/adminService.ts
import { adminAuthClient } from '@/integrations/supabase/admin';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import axios from 'axios';

const servicekey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

/**
 * Admin profile interface
 */
export interface AdminProfile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Admin user interface for user management
 */
export interface AdminUser {
  user_id: string;
  user_type: 'nurse' | 'client' | 'admin';
  account_status: 'active' | 'suspended' | 'deactivated' | 'dormant' | 'pending';
  email?: string;
  created_at?: string;
  last_login?: string;
  profile_data?: {
    care_recipients?: any;
    relationship_to_recipient?: any;
    id?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    onboarding_completed?: boolean;
    onboarding_completion_percentage?: number;
    client_type?: string;
    role?: string;
    specializations?: string[];
    years_experience?: number;
    license_info?: {
      license_type?: string;
      license_number?: string;
      issuing_state?: string;
      expiration_date?: string;
      verification_status?: string;
    };
    care_needs?: any;
    care_location?: any;
  };
}

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  pending_nurse_profiles: number;
  pending_client_profiles: number;
  new_applications: number;
  pending_timecards: number;
  open_jobs: number;
  pending_verifications: number;
}

/**
 * Task interface for admin queue
 */
export interface AdminTask {
  id: string;
  type: 'profile_review' | 'verification' | 'dispute' | 'application_review';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
  related_id: string; // ID of the related entity (nurse, client, application, etc.)
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all users with their metadata and profile data
 */
export async function getAllUsers(
  userType: 'nurse' | 'client' | 'admin',
  limit: number = 20,
  offset: number = 0,
  searchTerm?: string
) {
  try {
    // First get the auth users to get email and other auth data
    const { data: authUsers, error: authError } = await adminAuthClient.listUsers({
      page: Math.floor(offset / limit) + 1,
      perPage: limit
    });

    if (authError) throw authError;

    if (!authUsers?.users || authUsers.users.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Get user metadata for each user
    const userIds = authUsers.users.map(user => user.id);
    const { data: userMetadata, error: metadataError } = await supabase
      .from('user_metadata')
      .select('*')
      .in('user_id', userIds);

    if (metadataError) throw metadataError;

    // Create a map of user metadata
    const metadataMap = (userMetadata || []).reduce((acc, meta) => {
      acc[meta.user_id] = meta;
      return acc;
    }, {} as Record<string, any>);

    // Get detailed profile information for each user
    const enrichedUsers = await Promise.all(
      authUsers.users.map(async (authUser) => {
        const metadata = metadataMap[authUser.id];
        if (!metadata) return null;

        // Filter by user type if specified
        if (userType && metadata.user_type !== userType) return null;

        let profileData: any = {
          id: authUser.id,
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          phone_number: metadata.phone_number || '',
          onboarding_completed: metadata.onboarding_completed || false,
          onboarding_completion_percentage: 0
        };

        if (metadata.user_type === 'nurse') {
          // Get nurse profile
          const { data: nurseProfile } = await supabase
            .from('nurse_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (nurseProfile) {
            // Use profile data as fallback if metadata doesn't have names
            profileData = { 
              ...profileData, 
              ...nurseProfile,
              // Prioritize metadata first_name/last_name (synchronized data), fallback to profile data
              first_name: metadata.first_name || nurseProfile.first_name || '',
              last_name: metadata.last_name || nurseProfile.last_name || '',
              phone_number: metadata.phone_number || nurseProfile.phone_number || ''
            };

            // Get license information
            const { data: licenseInfo } = await supabase
              .from('nurse_licenses')
              .select('*')
              .eq('nurse_id', nurseProfile.id)
              .single();

            if (licenseInfo) {
              profileData.license_info = licenseInfo;
            }

            // Get qualifications for specializations
            const { data: qualifications } = await supabase
              .from('nurse_qualifications')
              .select('specializations, years_experience')
              .eq('nurse_id', nurseProfile.id)
              .single();

            if (qualifications) {
              profileData.specializations = qualifications.specializations;
              profileData.years_experience = qualifications.years_experience;
            }
          }
        } else if (metadata.user_type === 'client') {
          // Get client profile
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (clientProfile) {
            // Use profile data as fallback if metadata doesn't have names
            profileData = { 
              ...profileData, 
              ...clientProfile,
              // Prioritize metadata first_name/last_name (synchronized data), fallback to profile data
              first_name: metadata.first_name || clientProfile.first_name || '',
              last_name: metadata.last_name || clientProfile.last_name || '',
              phone_number: metadata.phone_number || clientProfile.phone_number || ''
            };

            // Get care needs
            const { data: careNeeds } = await supabase
              .from('care_needs')
              .select('*')
              .eq('client_id', clientProfile.id)
              .single();

            if (careNeeds) {
              profileData.care_needs = careNeeds;
            }

            // Get care location
            const { data: careLocation } = await supabase
              .from('care_locations')
              .select('*')
              .eq('client_id', clientProfile.id)
              .single();

            if (careLocation) {
              profileData.care_location = careLocation;
            }

            // Get care recipients
            const { data: careRecipients } = await supabase
              .from('care_recipients')
              .select('*')
              .eq('client_id', clientProfile.id);

            if (careRecipients) {
              profileData.care_recipients = careRecipients;
            }
          }
        } else if (metadata.user_type === 'admin') {
          // Get admin profile
          try {
            const { data: adminProfile } = await supabase
              .from('admin_profiles' as any)
              .select('*')
              .eq('user_id', authUser.id)
              .single();

            if (adminProfile) {
              profileData = { 
                ...profileData, 
                ...adminProfile,
                // Prioritize metadata first_name/last_name, fallback to profile data
                first_name: metadata.first_name || adminProfile.first_name || '',
                last_name: metadata.last_name || adminProfile.last_name || ''
              };
            }
          } catch (error) {
            // Admin profile might not exist, use auth data and metadata
            profileData.first_name = metadata.first_name || authUser.user_metadata?.first_name || '';
            profileData.last_name = metadata.last_name || authUser.user_metadata?.last_name || '';
          }
        }

        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const fullName = `${profileData.first_name} ${profileData.last_name}`.toLowerCase();
          const email = authUser.email?.toLowerCase() || '';
          const phone = profileData.phone_number?.toLowerCase() || '';
          
          if (!fullName.includes(searchLower) && 
              !email.includes(searchLower) && 
              !phone.includes(searchLower)) {
            return null;
          }
        }

        return {
          user_id: authUser.id,
          email: authUser.email,
          user_type: metadata.user_type,
          account_status: metadata.account_status,
          created_at: authUser.created_at,
          last_login: authUser.last_sign_in_at,
          profile_data: profileData
        } as AdminUser;
      })
    );

    // Filter out null results and return
    const validUsers = enrichedUsers.filter(user => user !== null) as AdminUser[];
    
    return { 
      data: validUsers, 
      count: validUsers.length, 
      error: null 
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get detailed user information by ID
 */
export async function getUserDetails(userId: string) {
  try {
    // Get auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    if (authError) throw authError;

    // Get user metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('user_metadata')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (metadataError) throw metadataError;

    let detailedProfile: any = {};

    if (metadata.user_type === 'nurse') {
      // Get comprehensive nurse data
      const { data: nurseProfile } = await supabase
        .from('nurse_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (nurseProfile) {
        detailedProfile.profile = {
          ...nurseProfile,
          // Use metadata names if available (synchronized data)
          first_name: metadata.first_name || nurseProfile.first_name,
          last_name: metadata.last_name || nurseProfile.last_name,
          phone_number: metadata.phone_number || nurseProfile.phone_number
        };

        // Get all licenses
        const { data: licenses } = await supabase
          .from('nurse_licenses')
          .select('*')
          .eq('nurse_id', nurseProfile.id);

        // Get all certifications
        const { data: certifications } = await supabase
          .from('nurse_certifications')
          .select('*')
          .eq('nurse_id', nurseProfile.id);

        // Get qualifications
        const { data: qualifications } = await supabase
          .from('nurse_qualifications')
          .select('*')
          .eq('nurse_id', nurseProfile.id)
          .single();

        // Get preferences
        const { data: preferences } = await supabase
          .from('nurse_preferences')
          .select('*')
          .eq('nurse_id', nurseProfile.id)
          .single();

        // Get application history
        const { data: applications } = await supabase
          .from('applications')
          .select(`
            *,
            job_postings (
              job_code,
              care_type,
              status
            )
          `)
          .eq('nurse_id', nurseProfile.id);

        detailedProfile.licenses = licenses || [];
        detailedProfile.certifications = certifications || [];
        detailedProfile.qualifications = qualifications;
        detailedProfile.preferences = preferences;
        detailedProfile.applications = applications || [];
      }
    } else if (metadata.user_type === 'client') {
      // Get comprehensive client data
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (clientProfile) {
        detailedProfile.profile = {
          ...clientProfile,
          // Use metadata names if available (synchronized data)
          first_name: metadata.first_name || clientProfile.first_name,
          last_name: metadata.last_name || clientProfile.last_name,
          phone_number: metadata.phone_number || clientProfile.phone_number
        };

        // Get care recipients
        const { data: careRecipients } = await supabase
          .from('care_recipients')
          .select('*')
          .eq('client_id', clientProfile.id);

        // Get care needs
        const { data: careNeeds } = await supabase
          .from('care_needs')
          .select('*')
          .eq('client_id', clientProfile.id)
          .single();

        // Get care locations
        const { data: careLocations } = await supabase
          .from('care_locations')
          .select('*')
          .eq('client_id', clientProfile.id);

        // Get job postings
        const { data: jobPostings } = await supabase
          .from('job_postings')
          .select(`
            *,
            applications (
              id,
              status,
              nurse_profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq('client_id', clientProfile.id);

        detailedProfile.careRecipients = careRecipients || [];
        detailedProfile.careNeeds = careNeeds;
        detailedProfile.careLocations = careLocations || [];
        detailedProfile.jobPostings = jobPostings || [];
      }
    }

    return {
      data: {
        authUser: authUser.user,
        metadata,
        ...detailedProfile
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update user account status
 */
export async function updateUserAccountStatus(userId: string, status: 'active' | 'suspended' | 'deactivated' | 'dormant' | 'pending') {
  try {
    const { data, error } = await supabase
      .from('user_metadata')
      .update({ 
        account_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user account status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get pending license verifications
 */
export async function getPendingLicenseVerifications(
  limit: number = 20,
  offset: number = 0
) {
  try {
    const { data: licenses, error: licenseError, count } = await supabase
      .from('nurse_licenses')
      .select('*', { count: 'exact' })
      .eq('verification_status', 'pending')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: true });

    if (licenseError) throw licenseError;

    if (!licenses || licenses.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Get nurse profile data for each license
    const enrichedLicenses = await Promise.all(
      licenses.map(async (license) => {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('id, first_name, last_name, phone_number')
          .eq('id', license.nurse_id)
          .single();

        return {
          ...license,
          nurse_profiles: nurseProfile
        };
      })
    );

    return { data: enrichedLicenses, count, error: null };
  } catch (error) {
    console.error('Error getting pending license verifications:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Update license verification status
 */
export async function updateLicenseVerificationStatus(
  licenseId: string, 
  status: 'verified' | 'failed',
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .update({
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', licenseId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating license verification status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get job postings for admin review
 */
export async function getJobPostingsForReview(
  status?: 'open' | 'filled' | 'expired',
  limit: number = 20,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles (
          first_name,
          last_name,
          client_type
        ),
        applications (
          id,
          status,
          nurse_profiles (
            first_name,
            last_name
          )
        )
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count, error: null };
  } catch (error) {
    console.error('Error getting job postings for review:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: PostgrestError | null }> {
  try {
    const [
      pendingNurses,
      pendingClients,
      newApplications,
      pendingTimecards,
      openJobs,
      pendingVerifications
    ] = await Promise.all([
      // Pending nurse profiles (onboarding completed but status pending)
      supabase
        .from('user_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'nurse')
        .eq('account_status', 'pending')
        .eq('onboarding_completed', true),
      
      // Pending client profiles (shouldn't be many as clients auto-approve)
      supabase
        .from('user_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'client')
        .eq('account_status', 'pending'),
      
      // New applications in the last 7 days
      supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Pending timecards
      supabase
        .from('timecards')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Submitted'),
      
      // Open job postings
      supabase
        .from('job_postings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open'),
      
      // Pending license verifications
      supabase
        .from('nurse_licenses')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending')
    ]);

    const stats: DashboardStats = {
      pending_nurse_profiles: pendingNurses.count || 0,
      pending_client_profiles: pendingClients.count || 0,
      new_applications: newApplications.count || 0,
      pending_timecards: pendingTimecards.count || 0,
      open_jobs: openJobs.count || 0,
      pending_verifications: pendingVerifications.count || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Check if current user is admin
 */
export async function checkAdminStatus() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { isAdmin: false, error: 'No authenticated user' };
    }

    const { data: metadata, error: metadataError } = await supabase
      .from('user_metadata')
      .select('user_type, account_status')
      .eq('user_id', user.id)
      .single();

    if (metadataError || !metadata) {
      return { isAdmin: false, error: 'User metadata not found' };
    }

    const isAdmin = metadata.user_type === 'admin' && metadata.account_status === 'active';
    
    return { isAdmin, error: null };
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: error.message };
  }
}

/**
 * Create admin task
 */
export async function createAdminTask(task: Omit<AdminTask, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('admin_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating admin task:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get admin tasks
 */
export async function getAdminTasks(
  status?: 'pending' | 'in_progress' | 'completed',
  limit: number = 20,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('admin_tasks')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count, error: null };
  } catch (error) {
    console.error('Error getting admin tasks:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Update admin task
 */
export async function updateAdminTask(
  taskId: string, 
  updates: Partial<AdminTask>
) {
  try {
    const { data, error } = await supabase
      .from('admin_tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating admin task:', error);
    return { data: null, error: error as PostgrestError };
  }
}