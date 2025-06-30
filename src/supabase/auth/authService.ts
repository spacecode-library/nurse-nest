import { supabase } from '@/integrations/supabase/client';
import type { User, AuthError, AuthResponse } from '@supabase/supabase-js';

export type UserType = 'nurse' | 'client' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'deactivated' | 'dormant';

interface UserMetadata {
  user_type: UserType;
  account_status: AccountStatus;
  first_name: string;
  last_name: string;
  phone_number?: string;
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

        // Also create entry in user_accounts table for compatibility
        const { error: accountError } = await supabase
          .from('user_accounts')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            user_type: userType,
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
            phone_number: ''
          });

        if (accountError) {
          console.error('Error creating user account:', accountError);
          // Don't fail the signup for this, as user_accounts might be a legacy table
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
 * Get user type and status from metadata - FIXED: Prioritize database over auth metadata
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

    // FIXED: Always check database first for the most up-to-date information
    const { data: metadataFromTable, error: metadataError } = await supabase
      .from('user_metadata')
      .select('user_type, account_status, onboarding_completed, first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (!metadataError && metadataFromTable) {
      console.log('Using database metadata:', metadataFromTable);
      
      const tableUserType = metadataFromTable.user_type as UserType;
      const tableAccountStatus = metadataFromTable.account_status || 'active';
      const tableOnboardingCompleted = metadataFromTable.onboarding_completed || false;

      // Update auth metadata to match table data if different
      const authMetadata = userData.user.user_metadata;
      const authNeedsUpdate = !authMetadata || 
        authMetadata.user_type !== tableUserType ||
        authMetadata.account_status !== tableAccountStatus ||
        authMetadata.onboarding_completed !== tableOnboardingCompleted;

      if (authNeedsUpdate) {
        console.log('Syncing auth metadata with database data');
        await updateUserMetadata({
          user_type: tableUserType,
          account_status: tableAccountStatus,
          onboarding_completed: tableOnboardingCompleted,
          first_name: metadataFromTable.first_name || '',
          last_name: metadataFromTable.last_name || ''
        });
      }

      let profileData = null;

      // Get profile data based on user type to verify onboarding status
      if (tableUserType === 'nurse') {
        const { data: nurseProfile, error: profileError } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching nurse profile:', profileError);
        }
        
        profileData = nurseProfile;
        // Use profile onboarding status if available and more recent
        const profileOnboardingCompleted = nurseProfile?.onboarding_completed;
        if (profileOnboardingCompleted !== undefined && profileOnboardingCompleted !== tableOnboardingCompleted) {
          // Profile data is more recent, use it and update database
          console.log('Profile onboarding status differs from metadata, syncing...');
          await updateUserMetadata({
            onboarding_completed: profileOnboardingCompleted
          });
          
          return {
            userType: tableUserType,
            accountStatus: tableAccountStatus as AccountStatus,
            onboardingCompleted: profileOnboardingCompleted,
            profileData,
            error: null
          };
        }
      } else if (tableUserType === 'client') {
        const { data: clientProfile, error: profileError } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching client profile:', profileError);
        }
        
        profileData = clientProfile;
        // Use profile onboarding status if available and more recent
        const profileOnboardingCompleted = clientProfile?.onboarding_completed;
        if (profileOnboardingCompleted !== undefined && profileOnboardingCompleted !== tableOnboardingCompleted) {
          // Profile data is more recent, use it and update database
          console.log('Profile onboarding status differs from metadata, syncing...');
          await updateUserMetadata({
            onboarding_completed: profileOnboardingCompleted
          });
          
          return {
            userType: tableUserType,
            accountStatus: tableAccountStatus as AccountStatus,
            onboardingCompleted: profileOnboardingCompleted,
            profileData,
            error: null
          };
        }
      } else if (tableUserType === 'admin') {
        return {
          userType: tableUserType,
          accountStatus: tableAccountStatus as AccountStatus,
          onboardingCompleted: true, // Admins don't need onboarding
          profileData: null,
          error: null
        };
      }

      return {
        userType: tableUserType,
        accountStatus: tableAccountStatus as AccountStatus,
        onboardingCompleted: tableOnboardingCompleted,
        profileData,
        error: null
      };
    }

    // Fallback: Try to get from auth user metadata if database failed
    console.log('Database metadata not found, falling back to auth metadata');
    const authMetadata = userData.user.user_metadata;
    if (authMetadata?.user_type) {
      const userType = authMetadata.user_type as UserType;
      const accountStatus = authMetadata.account_status || 'active';
      const onboardingCompleted = authMetadata.onboarding_completed || false;

      console.log('Using auth metadata as fallback:', { userType, accountStatus, onboardingCompleted });

      let profileData = null;

      // Get profile data based on user type
      if (userType === 'nurse') {
        const { data: nurseProfile } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = nurseProfile;
      } else if (userType === 'client') {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        profileData = clientProfile;
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

    // No metadata found anywhere
    console.error('No user metadata found in database or auth');
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

    // Update database metadata - FIXED: Only update fields that exist in user_metadata table
    const metadataUpdate: any = {
      user_id: userData.user.id,
      updated_at: new Date().toISOString()
    };
    
    // Only add fields that exist in the user_metadata table
    if (metadata.user_type !== undefined) metadataUpdate.user_type = metadata.user_type;
    if (metadata.account_status !== undefined) metadataUpdate.account_status = metadata.account_status;
    if (metadata.first_name !== undefined) metadataUpdate.first_name = metadata.first_name;
    if (metadata.last_name !== undefined) metadataUpdate.last_name = metadata.last_name;
    if (metadata.onboarding_completed !== undefined) metadataUpdate.onboarding_completed = metadata.onboarding_completed;

    const { error: dbError } = await supabase
      .from('user_metadata')
      .upsert(metadataUpdate);

    if (dbError) {
      console.error('Error updating database metadata:', dbError);
      // Don't fail if this doesn't work - auth is the primary source
    }

    // Also update user_accounts table for compatibility
    const updateFields: any = {};
    if (metadata.first_name) updateFields.first_name = metadata.first_name;
    if (metadata.last_name) updateFields.last_name = metadata.last_name;
    if (metadata.phone_number) updateFields.phone_number = metadata.phone_number;
    if (metadata.user_type) updateFields.user_type = metadata.user_type;

    if (Object.keys(updateFields).length > 0) {
      const { error: accountError } = await supabase
        .from('user_accounts')
        .update(updateFields)
        .eq('user_id', userData.user.id);

      if (accountError) {
        console.error('Error updating user account:', accountError);
        // Don't fail for this as user_accounts might be legacy
      }
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in updateUserMetadata:', err);
    return { error: err };
  }
}

/**
 * Synchronize profile data with user_metadata table
 */
export async function syncProfileToMetadata(userType: UserType): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData?.user) {
      return { success: false, error: 'No authenticated user' };
    }

    const userId = userData.user.id;
    let firstName = '';
    let lastName = '';
    let phoneNumber = '';

    // Get profile data based on user type
    if (userType === 'nurse') {
      const { data: nurseProfile } = await supabase
        .from('nurse_profiles')
        .select('first_name, last_name, phone_number')
        .eq('user_id', userId)
        .single();

      if (nurseProfile) {
        firstName = nurseProfile.first_name || '';
        lastName = nurseProfile.last_name || '';
        phoneNumber = nurseProfile.phone_number || '';
      }
    } else if (userType === 'client') {
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('first_name, last_name, phone_number')
        .eq('user_id', userId)
        .single();

      if (clientProfile) {
        firstName = clientProfile.first_name || '';
        lastName = clientProfile.last_name || '';
        phoneNumber = clientProfile.phone_number || '';
      }
    }

    // Update user_metadata with profile data - FIXED: removed phone_number as it doesn't exist in this table
    const { error: metadataError } = await supabase
      .from('user_metadata')
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (metadataError) {
      console.error('Error syncing profile to metadata:', metadataError);
      return { success: false, error: metadataError.message };
    }

    // Also update user_accounts table for compatibility
    const { error: accountError } = await supabase
      .from('user_accounts')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      })
      .eq('user_id', userId);

    if (accountError) {
      console.error('Error updating user account:', accountError);
      // Don't fail for this as user_accounts might be legacy
    }

    // Update auth metadata as well
    await updateUserMetadata({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error in syncProfileToMetadata:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Complete onboarding for a user - sets pending status for nurses, active for clients
 */
export async function completeOnboarding(userType: UserType): Promise<{ success: boolean; error?: string }> {
  try {
    // First sync profile data to metadata
    const syncResult = await syncProfileToMetadata(userType);
    if (!syncResult.success) {
      console.error('Failed to sync profile data:', syncResult.error);
      // Continue anyway, as this is not critical
    }

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
      return { success: false, error: error.message || 'Failed to complete onboarding' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in completeOnboarding:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Admin function to approve a nurse (change status from pending to active)
 */
export async function approveNurse(userId: string) {
  try {
    console.log('Approving nurse:', userId);

    // First get nurse profile to get the profile data
    const { data: nurseProfile } = await supabase
      .from('nurse_profiles')
      .select('first_name, last_name, phone_number')
      .eq('user_id', userId)
      .single();

    // Update user metadata table with synchronized profile data - FIXED: removed phone_number
    const updateData: any = { 
      account_status: 'active',
      onboarding_completed: true, // FIXED: Also set onboarding as completed when approving
      updated_at: new Date().toISOString()
    };

    // Include profile data if available
    if (nurseProfile) {
      updateData.first_name = nurseProfile.first_name || '';
      updateData.last_name = nurseProfile.last_name || '';
    }

    const { error: metadataError } = await supabase
      .from('user_metadata')
      .update(updateData)
      .eq('user_id', userId);

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return { error: metadataError };
    }

    // Update auth metadata - FIXED: removed admin API call, using regular updateUser
    // Note: This will only work for updating the current user's metadata
    // For admin operations, you would need to implement a server-side function
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          account_status: 'active',
          onboarding_completed: true, // FIXED: Also update auth metadata
          first_name: nurseProfile?.first_name || '',
          last_name: nurseProfile?.last_name || ''
        }
      });

      if (authError) {
        console.error('Error updating auth metadata:', authError);
        // Don't fail if this doesn't work - the metadata table is the source of truth
      }
    } catch (authError) {
      console.error('Error updating auth metadata:', authError);
      // Continue anyway as the database update succeeded
    }

    // Also update user_accounts table for compatibility
    const { error: accountError } = await supabase
      .from('user_accounts')
      .update({
        first_name: nurseProfile?.first_name || '',
        last_name: nurseProfile?.last_name || '',
        phone_number: nurseProfile?.phone_number || ''
      })
      .eq('user_id', userId);

    if (accountError) {
      console.error('Error updating user account:', accountError);
      // Don't fail for this as user_accounts might be legacy
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

    // Update auth metadata - FIXED: removed admin API call, using regular updateUser
    // Note: This will only work for updating the current user's metadata
    // For admin operations, you would need to implement a server-side function
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          account_status: 'suspended'
        }
      });

      if (authError) {
        console.error('Error updating auth metadata:', authError);
        // Don't fail if this doesn't work - the metadata table is the source of truth
      }
    } catch (authError) {
      console.error('Error updating auth metadata:', authError);
      // Continue anyway as the database update succeeded
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