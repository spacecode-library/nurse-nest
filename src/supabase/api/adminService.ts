
import { adminAuthClient } from '@/integrations/supabase/admin';
import { supabase } from '@/integrations/supabase/client';

interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  created_at: string;
  updated_at: string;
  identities: Identity[];
  factors: Factor[];
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

interface UserMetadata {
  avatar_url: string;
  email: string;
  email_change_count: number;
  email_confirmed_at: string;
  full_name: string;
  iss: string;
  name: string;
  phone: string;
  provider_id: string;
  sub: string;
  user_name: string;
  user_type: string;
}

interface Identity {
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  created_at: string;
  updated_at: string;
}

interface IdentityData {
  email: string;
  sub: string;
}

interface Factor {
  id: string;
  user_id: string;
  friendly_name: string;
  factor_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id?: string;
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  onboarding_completed?: boolean;
  onboarding_completion_percentage?: number;
  client_type?: string;
  role?: string;
  user_type?: string;
  account_status?: string;
  created_at?: string;
  specializations?: string[];
  experience_years?: number;
  hourly_rate?: number;
  bio?: string;
  relationship_to_recipient?: string;
  care_recipients?: any[];
  care_locations?: any[];
  care_needs?: any[];
  licenses?: any[];
  certifications?: any[];
  qualifications?: any[];
  preferences?: any[];
  profile_data?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    relationship_to_recipient?: string;
    [key: string]: any;
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeNurses: number;
  pendingApplications: number;
  monthlyRevenue: number;
  pending_nurse_profiles?: number;
  pending_client_profiles?: number;
  new_applications?: number;
  pending_timecards?: number;
  pending_verifications?: number;
  open_jobs?: number;
}

export const getAllUsers = async (page: number = 1, perPage: number = 50, filter = '', sortBy = 'created_at') => {
  try {
    const { data, error } = await adminAuthClient.listUsers({
      page,
      perPage
    });
    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data.users,
      count: data.users.length,
    };
  } catch (error) {
    console.error('Error listing users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const { error } = await adminAuthClient.deleteUser(userId);
    if (error) {
      throw error;
    }
    return {
      success: true,
      message: `User ${userId} deleted successfully.`,
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const createUser = async (email: string, password?: string) => {
  try {
    const { data, error } = await adminAuthClient.createUser({
      email: email,
      password: password || 'random-password',
      user_metadata: {
        user_type: 'client',
      },
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getUserDetails = async (userId: string) => {
  try {
    console.log('Getting user details for:', userId);
    
    // Get auth user
    const { data: authUser, error: authError } = await adminAuthClient.getUserById(userId);
    
    if (authError) throw authError;
    if (!authUser) throw new Error('User not found');

    // Get user metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('user_metadata')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (metadataError) throw metadataError;

    let detailedProfile: AdminUser = {
      user_id: userId,
      email: authUser.user.email,
      created_at: authUser.user.created_at,
      user_type: metadata.user_type,
      account_status: 'active'
    };

    if (metadata.user_type === 'nurse') {
      // Get comprehensive nurse data
      const { data: nurseProfile, error: nurseError } = await supabase
        .from('nurse_profiles')
        .select(`
          *,
          nurse_licenses(*),
          nurse_certifications(*),
          nurse_qualifications(*),
          nurse_preferences(*)
        `)
        .eq('user_id', userId)
        .single();

      if (nurseError) {
        console.error('Error fetching nurse profile:', nurseError);
      } else if (nurseProfile) {
        detailedProfile = {
          ...detailedProfile,
          ...nurseProfile,
          role: 'nurse',
          specializations: nurseProfile.specialization ? [nurseProfile.specialization] : [],
          experience_years: Number(nurseProfile.experience_years) || 0,
          hourly_rate: Number(nurseProfile.hourly_rate) || 0,
          bio: nurseProfile.bio,
          licenses: nurseProfile.nurse_licenses,
          certifications: nurseProfile.nurse_certifications,
          qualifications: nurseProfile.nurse_qualifications,
          preferences: nurseProfile.nurse_preferences,
          profile_data: {
            first_name: nurseProfile.first_name,
            last_name: nurseProfile.last_name,
            phone_number: nurseProfile.phone_number
          }
        };
      }
    } else if (metadata.user_type === 'client') {
      // Get comprehensive client data
      const { data: clientProfile, error: clientError } = await supabase
        .from('client_profiles')
        .select(`
          *,
          care_recipients(*),
          care_locations(*),
          care_needs(*)
        `)
        .eq('user_id', userId)
        .single();

      if (clientError) {
        console.error('Error fetching client profile:', clientError);
      } else if (clientProfile) {
        detailedProfile = {
          ...detailedProfile,
          ...clientProfile,
          role: 'client',
          care_recipients: clientProfile.care_recipients || [],
          care_locations: clientProfile.care_locations,
          care_needs: clientProfile.care_needs,
          profile_data: {
            first_name: clientProfile.first_name,
            last_name: clientProfile.last_name,
            phone_number: clientProfile.phone_number,
            relationship_to_recipient: clientProfile.relationship_to_recipient
          }
        };
      }
    }

    const result = {
      authUser: authUser.user,
      metadata,
      ...detailedProfile
    };

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const updateUserName = async (userId: string, newName: string) => {
  try {
    // Update the user's name in the auth system
    const { data, error } = await adminAuthClient.updateUserById(
      userId,
      { user_metadata: { full_name: newName } }
    );

    if (error) {
      throw error;
    }

    // Update the user's name in the user_metadata table
    const { error: metadataError } = await supabase
      .from('user_metadata')
      .update({ user_type: 'client' })
      .eq('user_id', userId);

    if (metadataError) {
      throw metadataError;
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error updating user name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Mock implementations for missing functions
export const getDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; error?: string }> => {
  return {
    success: true,
    data: {
      totalUsers: 0,
      activeNurses: 0,
      pendingApplications: 0,
      monthlyRevenue: 0,
      pending_nurse_profiles: 0,
      pending_client_profiles: 0,
      new_applications: 0,
      pending_timecards: 0,
      pending_verifications: 0,
      open_jobs: 0
    }
  };
};

export const updateUserAccountStatus = async (userId: string, status: string) => {
  return { success: true };
};

export const getPendingLicenseVerifications = async () => {
  return { success: true, data: [] };
};

export const updateLicenseVerificationStatus = async (licenseId: string, status: string) => {
  return { success: true };
};

export const getJobPostingsForReview = async () => {
  return { success: true, data: [] };
};

export const getTimecardsForAdmin = async () => {
  return { success: true, data: [] };
};

export const checkAdminStatus = async (userId: string) => {
  return { success: true, isAdmin: false };
};

export const getSystemMetrics = async () => {
  return { success: true, data: {} };
};
