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
//   user_type: UserType;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
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
      ...metadata
    };

    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullMetadata,
        // emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;

    // Wait for the user to be created before proceeding
    if (data.user) {
      // Create user metadata first
      const { error: metaError } = await supabase
        .from('user_metadata')
        .insert({
          user_id: data.user.id,
          user_type: userType,
          account_status: userType === 'nurse' ? 'pending' : 'active'
        });

      if (metaError) {
        console.error('Error creating user metadata:', metaError);
      }

      // Create corresponding profile
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
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
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
 * Request a password reset email
 */
export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
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
 * Create initial nurse profile after registration
 */
async function createInitialNurseProfile(userId: string, metadata: any = {}) {
  try {
    const { first_name, last_name } = metadata;
    
    const { error } = await supabase
      .from('nurse_profiles')
      .insert({
        user_id: userId,
        first_name: first_name || '',
        last_name: last_name || '',
        phone_number: '',  // Will be filled during onboarding
        profile_photo_url: '',  // Will be filled during onboarding
        onboarding_completed: false,
        onboarding_completion_percentage: 0,
        // Add required fields with default values
        street_address: '',
        city: '',
        state: '',
        zip_code: ''
      });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error creating initial nurse profile:', error);
    return { error: error as PostgrestError };
  }
}

/**
 * Create initial client profile after registration
 */
async function createInitialClientProfile(userId: string, metadata: any = {}) {
  try {
    const { first_name, last_name } = metadata;
    
    const { error } = await supabase
      .from('client_profiles')
      .insert({
        user_id: userId,
        client_type: 'individual',  // Default, can be changed during onboarding
        first_name: first_name || '',
        last_name: last_name || '',
        phone_number: '',  // Will be filled during onboarding
        onboarding_completed: false,
        onboarding_completion_percentage: 0
      });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error creating initial client profile:', error);
    return { error: error as PostgrestError };
  }
}
