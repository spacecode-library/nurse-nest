// src/supabase/auth/authService.ts
import { supabase } from '@/integrations/supabase/client';
import { AuthError, PostgrestError, User } from '@supabase/supabase-js';

/**
 * User types supported by the application
 */
export type UserType = 'nurse' | 'client' | 'admin';

/**
 * Interface for sign-up metadata
 */
export interface SignUpMetadata {
  user_type: UserType;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

/**
 * Create initial nurse profile
 */
async function createInitialNurseProfile(userId: string, metadata: Partial<SignUpMetadata> = {}) {
  try {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .insert({
        user_id: userId,
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        phone_number: '', // Will be filled during onboarding
        profile_photo_url: '', // Will be filled during onboarding
        onboarding_completed: false,
        onboarding_completion_percentage: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Also create entry in user_metadata table
    await supabase
      .from('user_metadata')
      .insert({
        user_id: userId,
        user_type: 'nurse',
        account_status: 'pending'
      });

    return { data, error: null };
  } catch (error) {
    console.error('Error creating initial nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Create initial client profile
 */
async function createInitialClientProfile(userId: string, metadata: Partial<SignUpMetadata> = {}) {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .insert({
        user_id: userId,
        client_type: 'individual', // Default, will be updated during onboarding
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        phone_number: '', // Will be filled during onboarding
        relationship_to_recipient: null,
        onboarding_completed: false,
        onboarding_completion_percentage: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Also create entry in user_metadata table
    await supabase
      .from('user_metadata')
      .insert({
        user_id: userId,
        user_type: 'client',
        account_status: 'active'
      });

    return { data, error: null };
  } catch (error) {
    console.error('Error creating initial client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Register a new user with email and password
 */
export async function signUp(
  email: string, 
  password: string, 
  userType: 'nurse' | 'client' | 'admin', 
  metadata: Partial<SignUpMetadata> = {}
) {
  try {
    // Combine user type with other metadata
    const fullMetadata: SignUpMetadata = {
      user_type: userType,
      account_status: userType === 'nurse' ? 'pending' : 'active',
      ...metadata
    };

    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullMetadata,
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });

    if (error) throw error;

    // Wait for the user to be created before proceeding
    if (data.user && !data.session) {
      // User created but email not confirmed yet
      return { data, error: null };
    }

    if (data.user && data.session) {
      // User created and immediately signed in (email confirmation disabled)
      // Create initial profile based on user type
      if (userType === 'nurse') {
        await createInitialNurseProfile(data.user.id, metadata);
      } else if (userType === 'client') {
        await createInitialClientProfile(data.user.id, metadata);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // If user signs in after email verification, ensure profile exists
    if (data.user && data.session) {
      const userType = data.user.user_metadata?.user_type;
      
      if (userType === 'nurse') {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();
        
        if (!nurseProfile) {
          await createInitialNurseProfile(data.user.id, data.user.user_metadata);
        }
      } else if (userType === 'client') {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();
        
        if (!clientProfile) {
          await createInitialClientProfile(data.user.id, data.user.user_metadata);
        }
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error as AuthError };
  }
}

/**
 * Reset user's password
 */
export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Update user's password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Get the user role from metadata
 */
export async function getUserRole(): Promise<UserType | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    return data.user?.user_metadata?.user_type as UserType || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: { [key: string]: any }) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Get user type and status - Fixed version that doesn't require userId parameter
 */
export async function getUserTypeAndStatus(): Promise<{
  userType: UserType | null;
  accountStatus: string | null;
  onboardingCompleted: boolean;
  profileData: any;
  error: any;
}> {
  try {
    // First get the current authenticated user
    const { data: userData, error: userError } = await getCurrentUser();
    
    if (userError || !userData?.user) {
      return {
        userType: null,
        accountStatus: null,
        onboardingCompleted: false,
        profileData: null,
        error: userError || new Error('No authenticated user')
      };
    }

    const userId = userData.user.id;

    // Try to get user type from auth metadata first
    const userType = userData.user.user_metadata?.user_type as UserType;
    const accountStatus = userData.user.user_metadata?.account_status || 'active';

    if (userType) {
      let profileData = null;
      let onboardingCompleted = false;

      // Get profile data based on user type
      if (userType === 'nurse') {
        const { data: nurseProfile, error: profileError } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching nurse profile:', profileError);
        }
        
        profileData = nurseProfile;
        onboardingCompleted = nurseProfile?.onboarding_completed || false;
      } else if (userType === 'client') {
        const { data: clientProfile, error: profileError } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching client profile:', profileError);
        }
        
        profileData = clientProfile;
        onboardingCompleted = clientProfile?.onboarding_completed || false;
      } else if (userType === 'admin') {
        onboardingCompleted = true; // Admins don't need onboarding
      }

      return {
        userType,
        accountStatus,
        onboardingCompleted,
        profileData,
        error: null
      };
    }

    // Fallback: Try to get from user_metadata table
    const { data: metadataFromTable, error: metadataError } = await supabase
      .from('user_metadata')
      .select('user_type, account_status')
      .eq('user_id', userId)
      .single();

    if (metadataError) {
      console.error('Error fetching user metadata from table:', metadataError);
      return {
        userType: null,
        accountStatus: null,
        onboardingCompleted: false,
        profileData: null,
        error: metadataError
      };
    }

    if (metadataFromTable) {
      const tableUserType = metadataFromTable.user_type as UserType;
      const tableAccountStatus = metadataFromTable.account_status || 'active';

      // Update auth metadata to match table data
      await updateUserMetadata({
        user_type: tableUserType,
        account_status: tableAccountStatus
      });

      let profileData = null;
      let onboardingCompleted = false;

      // Get profile data based on user type
      if (tableUserType === 'nurse') {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = nurseProfile;
        onboardingCompleted = nurseProfile?.onboarding_completed || false;
      } else if (tableUserType === 'client') {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = clientProfile;
        onboardingCompleted = clientProfile?.onboarding_completed || false;
      } else if (tableUserType === 'admin') {
        onboardingCompleted = true;
      }

      return {
        userType: tableUserType,
        accountStatus: tableAccountStatus,
        onboardingCompleted,
        profileData,
        error: null
      };
    }

    return {
      userType: null,
      accountStatus: null,
      onboardingCompleted: false,
      profileData: null,
      error: new Error('No user metadata found')
    };
  } catch (error) {
    console.error('Error getting user type and status:', error);
    return {
      userType: null,
      accountStatus: null,
      onboardingCompleted: false,
      profileData: null,
      error: error as PostgrestError
    };
  }
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(userType: UserType) {
  try {
    const { data: userData, error: userError } = await getCurrentUser();
    
    if (userError || !userData?.user) {
      throw new Error('No authenticated user');
    }

    const userId = userData.user.id;

    // Update profile onboarding status
    if (userType === 'nurse') {
      const { error: profileError } = await supabase
        .from('nurse_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completion_percentage: 100,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;
    } else if (userType === 'client') {
      const { error: profileError } = await supabase
        .from('client_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completion_percentage: 100,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;
    }

    // Update auth metadata
    await updateUserMetadata({
      onboarding_completed: true
    });

    return { error: null };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { error: error as PostgrestError };
  }
}