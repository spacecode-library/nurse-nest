
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
  account_status: 'active' | 'suspended' | 'deactivated' | 'dormant';
  email?: string;
  created_at?: string;
  last_login?: string;
  profile_data?: {
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
    care_recipients?: any;
    relationship_to_recipient?: string;
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
 * Create admin profile using direct insert
 */
export async function createAdminProfile(profileData: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Use direct insert instead of RPC function
    const { data, error } = await supabase
      .from('admin_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating admin profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get admin profile by user ID using raw SQL
 */
export async function getAdminProfileByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_profiles' as any)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting admin profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get dashboard statistics using individual queries
 */
export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: PostgrestError | null }> {
  try {
    // Get pending nurse profiles
    const { count: pendingNurses, error: nurseError } = await supabase
      .from('nurse_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('onboarding_completed', false);

    if (nurseError) throw nurseError;

    // Get pending client profiles
    const { count: pendingClients, error: clientError } = await supabase
      .from('client_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('onboarding_completed', false);

    if (clientError) throw clientError;

    // Get new applications
    const { count: newApplications, error: appError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    if (appError) throw appError;

    // Get pending timecards
    const { count: pendingTimecards, error: timecardError } = await supabase
      .from('timecards')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Submitted');

    if (timecardError) throw timecardError;

    // Get open jobs
    const { count: openJobs, error: jobError } = await supabase
      .from('job_postings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    if (jobError) throw jobError;

    // Get pending verifications
    const { count: pendingVerifications, error: verificationError } = await supabase
      .from('nurse_licenses')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    if (verificationError) throw verificationError;

    const stats: DashboardStats = {
      pending_nurse_profiles: pendingNurses || 0,
      pending_client_profiles: pendingClients || 0,
      new_applications: newApplications || 0,
      pending_timecards: pendingTimecards || 0,
      open_jobs: openJobs || 0,
      pending_verifications: pendingVerifications || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all users with pagination and filtering - Enhanced version
 */
export async function getAllUsers(
  userType?: 'nurse' | 'client' | 'admin',
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
          first_name: '',
          last_name: '',
          phone_number: '',
          onboarding_completed: false,
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
            profileData = { ...profileData, ...nurseProfile };

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
            profileData = { ...profileData, ...clientProfile };

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
              profileData = { ...profileData, ...adminProfile };
            }
          } catch (error) {
            // Admin profile might not exist, use auth data
            profileData.first_name = authUser.user_metadata?.first_name || '';
            profileData.last_name = authUser.user_metadata?.last_name || '';
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
        detailedProfile.profile = nurseProfile;

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
        detailedProfile.profile = clientProfile;

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

    const result = {
      authUser: authUser.user,
      metadata,
      ...(detailedProfile && typeof detailedProfile === 'object' ? detailedProfile : {})
    };

    return {
      data: result,
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
export async function updateUserAccountStatus(userId: string, status: 'active' | 'suspended' | 'deactivated' | 'dormant') {
  try {
    const { data, error } = await supabase
      .from('user_metadata')
      .update({ account_status: status })
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
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: jobs, error: jobError, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (jobError) throw jobError;

    if (!jobs || jobs.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Get client profile and applications for each job
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('id, first_name, last_name, client_type')
          .eq('id', job.client_id)
          .single();

        const { data: applications } = await supabase
          .from('applications')
          .select('id, status, created_at')
          .eq('job_id', job.id);

        return {
          ...job,
          client_profiles: clientProfile,
          applications: applications || []
        };
      })
    );

    return { data: enrichedJobs, count, error: null };
  } catch (error) {
    console.error('Error getting job postings for review:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get timecards for admin review/dispute resolution
 */
export async function getTimecardsForAdmin(
  status?: 'Submitted' | 'Approved' | 'Rejected' | 'Paid',
  limit: number = 20,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('timecards')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: timecards, error: timecardError, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (timecardError) throw timecardError;

    if (!timecards || timecards.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Get nurse and client profiles for each timecard
    const enrichedTimecards = await Promise.all(
      timecards.map(async (timecard) => {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('id, first_name, last_name')
          .eq('id', timecard.nurse_id)
          .single();

        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('id, first_name, last_name')
          .eq('id', timecard.client_id)
          .single();

        return {
          ...timecard,
          nurse_profiles: nurseProfile,
          client_profiles: clientProfile
        };
      })
    );

    return { data: enrichedTimecards, count, error: null };
  } catch (error) {
    console.error('Error getting timecards for admin:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Check if user is admin
 */
export async function checkAdminStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_metadata')
      .select('user_type')
      .eq('user_id', userId)
      .eq('user_type', 'admin')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return { isAdmin: !!data, error: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: error as PostgrestError };
  }
}

/**
 * Get system metrics for admin dashboard
 */
export async function getSystemMetrics() {
  try {
    // Get user registrations by month
    const { data: registrationData, error: regError } = await supabase
      .from('nurse_profiles')
      .select('created_at');

    if (regError) throw regError;

    // Get applications by status
    const { data: applicationData, error: appError } = await supabase
      .from('applications')
      .select('status, created_at');

    if (appError) throw appError;

    // Get timecard statistics
    const { data: timecardData, error: timeError } = await supabase
      .from('timecards')
      .select('status, total_hours, created_at');

    if (timeError) throw timeError;

    // Process data for charts/metrics
    const metrics = {
      userRegistrations: registrationData?.length || 0,
      applicationStats: applicationData || [],
      timecardStats: timecardData || [],
      totalHours: timecardData?.reduce((sum, tc) => sum + tc.total_hours, 0) || 0
    };

    return { data: metrics, error: null };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return { data: null, error: error as PostgrestError };
  }
}
