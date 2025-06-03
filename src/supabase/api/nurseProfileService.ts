// src/supabase/api/nurseProfileService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for nurse profile data
 */
export interface NurseProfile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_photo_url: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  created_at?: string;
  updated_at?: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  bio: string;
}

/**
 * Create a new nurse profile
 * 
 * @param profileData Profile data to create
 * @returns Created profile
 */
export async function createNurseProfile(profileData: Omit<NurseProfile, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a nurse profile by user ID
 * 
 * @param userId User ID
 * @returns Nurse profile data
 */
export async function getNurseProfileByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a nurse profile by profile ID
 * 
 * @param profileId Profile ID
 * @returns Nurse profile data
 */
export async function getNurseProfileById(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a nurse profile
 * 
 * @param profileId Profile ID
 * @param updates Updates to apply
 * @returns Updated profile
 */
export async function updateNurseProfile(profileId: string, updates: Partial<NurseProfile>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nurse_profiles')
      .update(updatedData)
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update onboarding progress
 * 
 * @param profileId Profile ID
 * @param percentage Completion percentage (0-100)
 * @param completed Whether onboarding is complete
 * @returns Updated profile
 */
export async function updateOnboardingProgress(
  profileId: string, 
  percentage: number, 
  completed = false
) {
  try {
    // Ensure percentage is between 0 and 100
    const validPercentage = Math.max(0, Math.min(100, percentage));
    
    const { data, error } = await supabase
      .from('nurse_profiles')
      .update({
        onboarding_completion_percentage: validPercentage,
        onboarding_completed: completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating onboarding progress:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all nurses (admin only)
 * 
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of nurse profiles
 */
export async function getAllNurseProfiles(limit: number = 10, offset: number = 0) {
  try {
    const { data, error, count } = await supabase
      .from('nurse_profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting all nurse profiles:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Search for nurses by name, specialty, or location (city, state, zip)
 * 
 * @param searchTerm Search term
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurse profiles
 */
export async function searchNurseProfiles(searchTerm: string, limit: number = 10, offset: number = 0) {
  try {
    // Remove any SQL injection attempts from the search term
    const sanitizedTerm = searchTerm.replace(/[;'"\\]/g, '');
    
    // Join nurse_profiles with nurse_qualifications to search by specialty
    const { data, error, count } = await supabase
      .from('nurse_profiles')
      .select(`
        *,
        nurse_qualifications!inner(specializations)
      `, { count: 'exact' })
      .or(`
        first_name.ilike.%${sanitizedTerm}%,
        last_name.ilike.%${sanitizedTerm}%,
        city.ilike.%${sanitizedTerm}%,
        state.ilike.%${sanitizedTerm}%,
        zip_code.ilike.%${sanitizedTerm}%,
        street_address.ilike.%${sanitizedTerm}%
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching nurse profiles:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get complete nurse profile with related data
 * 
 * @param profileId Profile ID
 * @returns Complete nurse profile with related data
 */
export async function getCompleteNurseProfile(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_profiles')
      .select(`
        *,
        nurse_licenses(*),
        nurse_certifications(*),
        nurse_qualifications(*),
        nurse_preferences(*)
      `)
      .eq('id', profileId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting complete nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a nurse profile (admin only)
 * 
 * @param profileId Profile ID
 * @returns Success status
 */
export async function deleteNurseProfile(profileId: string) {
  try {
    const { error } = await supabase
      .from('nurse_profiles')
      .delete()
      .eq('id', profileId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting nurse profile:', error);
    return { success: false, error: error as PostgrestError };
  }
}