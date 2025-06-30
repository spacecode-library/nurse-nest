import { supabase } from '@/integrations/supabase/client';
import type { User, AuthError, AuthResponse } from '@supabase/supabase-js';

export type UserType = 'nurse' | 'client' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'deactivated' | 'dormant';

interface UserMetadata {
  user_type: UserType;
  account_status: AccountStatus;
  first_name: string;
  last_name: string;
  onboarding_completed: boolean;
}

interface UserTypeAndStatusResult {
  userType: UserType | null;
  accountStatus: AccountStatus | null;
  onboardingCompleted: boolean;
  profileData?: any;
  error?: any;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ data: { user: User | null } | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  } catch (err) {
    console.error('Error getting current user:', err);
    return { 
      data: null, 
      error: { 
        message: 'Failed to get current user',
        name: 'GetUserError'
      } as AuthError 
    };
  }
}

/**
 * Sign up a new user
 */
export async function signUp(
  email: string, 
  password: string, 
  userType: UserType, 
  metadata: { first_name: string; last_name: string }
): Promise<AuthResponse> {
  try {
    console.log('Starting signup process for:', { email, userType });
    
    // Set initial status - nurses start as 'pending', others as 'active'
    const initialStatus: AccountStatus = userType === 'nurse' ? 'pending' : 'active';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          account_status: initialStatus,
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          onboarding_completed: false
        }
      }
    });

    if (error) {
      console.error('Supabase auth signup error:', error);
      return { data: null, error };
    }

    if (data?.user) {
      console.log('User created successfully:', data.user.id);
      
      // Create user metadata record in database
      try {
        const { error: metadataError } = await supabase
          .from('user_metadata')
          .insert({
            user_id: data.user.id,
            user_type: userType,
            account_status: initialStatus,
            onboarding_completed: false,
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || ''
          });

        if (metadataError) {
          console.error('Error creating user metadata:', metadataError);
          // Don't fail the signup for this - metadata can be recreated
        }
      } catch (metaError) {
        console.error('Error in metadata creation:', metaError);
      }
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
    return { 
      data: null, 
      error: { 
        message: 'An unexpected error occurred during signup',
        name: 'UnexpectedError'
      } as AuthError 
    };
  }
}

/**
 * Sign in a user
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }

    console.log('Sign in successful for user:', data?.user?.id);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signIn:', err);
    return { 
      data: null, 
      error: { 
        message: 'An unexpected error occurred during sign in',
        name: 'UnexpectedError'
      } as AuthError 
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Error signing out:', err);
    return { 
      error: { 
        message: 'Failed to sign out',
        name: 'SignOutError'
      } as AuthError 
    };
  }
}

/**
 * Get user type and status from metadata
 */
export async function getUserTypeAndStatus(): Promise<UserTypeAndStatusResult> {
  try {
    const { data: userData } = await getCurrentUser();
    
    if (!userData?.user) {
      return {
        userType: null,
        accountStatus: null,
        onboardingCompleted: false,
        error: new Error('No authenticated user')
      };
    }

    const userId = userData.user.id;
    console.log('Getting user type and status for:', userId);

    // First try to get from auth user metadata
    const authMetadata = userData.user.user_metadata;
    if (authMetadata?.user_type) {
      const userType = authMetadata.user_type as UserType;
      const accountStatus = authMetadata.account_status || 'active';
      const onboardingCompleted = authMetadata.onboarding_completed || false;

      let profileData = null;

      // Get profile data based on user type to verify onboarding status
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
        // Use profile onboarding status if available, fallback to auth metadata
        const profileOnboardingCompleted = nurseProfile?.onboarding_completed;
        if (profileOnboardingCompleted !== undefined) {
          // Sync auth metadata with profile data if different
          if (profileOnboardingCompleted !== onboardingCompleted) {
            await updateUserMetadata({
              onboarding_completed: profileOnboardingCompleted
            });
          }
          return {
            userType,
            accountStatus: accountStatus as AccountStatus,
            onboardingCompleted: profileOnboardingCompleted,
            profileData,
            error: null
          };
        }
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
        // Use profile onboarding status if available, fallback to auth metadata
        const profileOnboardingCompleted = clientProfile?.onboarding_completed;
        if (profileOnboardingCompleted !== undefined) {
          // Sync auth metadata with profile data if different
          if (profileOnboardingCompleted !== onboardingCompleted) {
            await updateUserMetadata({
              onboarding_completed: profileOnboardingCompleted
            });
          }
          return {
            userType,
            accountStatus: accountStatus as AccountStatus,
            onboardingCompleted: profileOnboardingCompleted,
            profileData,
            error: null
          };
        }
      } else if (userType === 'admin') {
        return {
          userType,
          accountStatus: accountStatus as AccountStatus,
          onboardingCompleted: true, // Admins don't need onboarding
          profileData: null,
          error: null
        };
      }

      return {
        userType,
        accountStatus: accountStatus as AccountStatus,
        onboardingCompleted,
        profileData,
        error: null
      };
    }

    // Fallback: Try to get from user_metadata table
    const { data: metadataFromTable, error: metadataError } = await supabase
      .from('user_metadata')
      .select('user_type, account_status, onboarding_completed, first_name, last_name')
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
      const tableOnboardingCompleted = metadataFromTable.onboarding_completed || false;

      // Update auth metadata to match table data
      await updateUserMetadata({
        user_type: tableUserType,
        account_status: tableAccountStatus,
        onboarding_completed: tableOnboardingCompleted,
        first_name: metadataFromTable.first_name || '',
        last_name: metadataFromTable.last_name || ''
      });

      let profileData = null;

      // Get profile data based on user type
      if (tableUserType === 'nurse') {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = nurseProfile;
      } else if (tableUserType === 'client') {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = clientProfile;
      }

      return {
        userType: tableUserType,
        accountStatus: tableAccountStatus as AccountStatus,
        onboardingCompleted: tableOnboardingCompleted,
        profileData,
        error: null
      };
    }

    // No metadata found
    return {
      userType: null,
      accountStatus: null,
      onboardingCompleted: false,
      profileData: null,
      error: new Error('No user metadata found')
    };

  } catch (error) {
    console.error('Error in getUserTypeAndStatus:', error);
    return {
      userType: null,
      accountStatus: null,
      onboardingCompleted: false,
      profileData: null,
      error
    };
  }
}

/**
 * Update user metadata in auth and database
 */
export async function updateUserMetadata(metadata: Partial<UserMetadata>) {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData?.user) {
      return { error: new Error('No authenticated user') };
    }

    // Update auth metadata
    const { data, error: authError } = await supabase.auth.updateUser({
      data: metadata
    });

    if (authError) {
      console.error('Error updating auth metadata:', authError);
      return { error: authError };
    }

    // Update database metadata
    const { error: dbError } = await supabase
      .from('user_metadata')
      .upsert({
        user_id: userData.user.id,
        ...metadata,
        updated_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Error updating database metadata:', dbError);
      // Don't fail if this doesn't work - auth is the primary source
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in updateUserMetadata:', err);
    return { error: err };
  }
}

/**
 * Complete onboarding for a user - sets pending status for nurses, active for clients
 */
export async function completeOnboarding(userType: UserType) {
  try {
    // Set status based on user type
    const newStatus: AccountStatus = userType === 'nurse' ? 'pending' : 'active';
    
    const updateData = {
      onboarding_completed: true,
      account_status: newStatus
    };

    console.log(`Completing onboarding for ${userType} with status: ${newStatus}`);

    const { error } = await updateUserMetadata(updateData);
    
    if (error) {
      console.error('Error completing onboarding:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in completeOnboarding:', err);
    return { error: err };
  }
}

/**
 * Admin function to approve a nurse (change status from pending to active)
 */
export async function approveNurse(userId: string) {
  try {
    console.log('Approving nurse:', userId);

    // Update user metadata table
    const { error: metadataError } = await supabase
      .from('user_metadata')
      .update({ 
        account_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return { error: metadataError };
    }

    // Update auth metadata using admin API
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          account_status: 'active'
        }
      }
    );

    if (authError) {
      console.error('Error updating auth metadata:', authError);
      // Don't fail if this doesn't work - the metadata table is the source of truth
    }

    return { error: null };
  } catch (err) {
    console.error('Error in approveNurse:', err);
    return { error: err };
  }
}

/**
 * Admin function to deny a nurse (change status from pending to suspended)
 */
export async function denyNurse(userId: string, reason?: string) {
  try {
    console.log('Denying nurse:', userId, 'Reason:', reason);

    // Update user metadata table
    const { error: metadataError } = await supabase
      .from('user_metadata')
      .update({ 
        account_status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return { error: metadataError };
    }

    // Update auth metadata using admin API
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          account_status: 'suspended'
        }
      }
    );

    if (authError) {
      console.error('Error updating auth metadata:', authError);
      // Don't fail if this doesn't work - the metadata table is the source of truth
    }

    // TODO: Send notification to nurse about denial
    // You can add notification logic here

    return { error: null };
  } catch (err) {
    console.error('Error in denyNurse:', err);
    return { error: err };
  }
}

/**
 * Get pending nurses for admin approval
 */
export async function getPendingNurses() {
  try {
    const { data: pendingUsers, error } = await supabase
      .from('user_metadata')
      .select(`
        user_id,
        user_type,
        account_status,
        onboarding_completed,
        first_name,
        last_name,
        updated_at
      `)
      .eq('user_type', 'nurse')
      .eq('account_status', 'pending')
      .eq('onboarding_completed', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending nurses:', error);
      return { data: [], error };
    }

    return { data: pendingUsers || [], error: null };
  } catch (err) {
    console.error('Error in getPendingNurses:', err);
    return { data: [], error: err };
  }
}

/**
 * Password reset
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error in resetPassword:', err);
    return { 
      error: { 
        message: 'An unexpected error occurred during password reset',
        name: 'PasswordResetError'
      } as AuthError 
    };
  }
}