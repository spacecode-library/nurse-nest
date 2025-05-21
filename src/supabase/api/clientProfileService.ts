// src/supabase/api/clientProfileService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Types of clients
 */
export type ClientType = 'individual' | 'family';

/**
 * Interface for client profile data
 */
export interface ClientProfile {
  id?: string;
  user_id: string;
  client_type: ClientType;
  first_name: string;
  last_name: string;
  phone_number: string;
  relationship_to_recipient?: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new client profile
 * 
 * @param profileData Profile data to create
 * @returns Created profile
 */
export async function createClientProfile(profileData: {
  user_id: string;
  client_type: "individual" | "family";
  first_name: string;
  last_name: string;
  phone_number: string;
  relationship_to_recipient?: string | null;
  onboarding_completed?: boolean;
  onboarding_completion_percentage?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a client profile by user ID
 * 
 * @param userId User ID
 * @returns Client profile data
 */
export async function getClientProfileByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a client profile by profile ID
 * 
 * @param profileId Profile ID
 * @returns Client profile data
 */
export async function getClientProfileById(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a client profile
 * 
 * @param profileId Profile ID
 * @param updates Updates to apply
 * @returns Updated profile
 */
export async function updateClientProfile(profileId: string, updates: Partial<ClientProfile>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('client_profiles')
      .update(updatedData)
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating client profile:', error);
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
      .from('client_profiles')
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
 * Get all clients (admin only)
 * 
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of client profiles
 */
export async function getAllClientProfiles(limit: number = 10, offset: number = 0) {
  try {
    const { data, error, count } = await supabase
      .from('client_profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting all client profiles:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Search for clients by name
 * 
 * @param searchTerm Search term
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching client profiles
 */
export async function searchClientProfiles(searchTerm: string, limit: number = 10, offset: number = 0) {
  try {
    // Remove any SQL injection attempts from the search term
    const sanitizedTerm = searchTerm.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('client_profiles')
      .select('*', { count: 'exact' })
      .or(`
        first_name.ilike.%${sanitizedTerm}%,
        last_name.ilike.%${sanitizedTerm}%
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching client profiles:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get complete client profile with related data
 * 
 * @param profileId Profile ID
 * @returns Complete client profile with related data
 */
export async function getCompleteClientProfile(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select(`
        *,
        care_recipients(*),
        care_locations(*),
        care_needs(*)
      `)
      .eq('id', profileId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting complete client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a client profile (admin only)
 * 
 * @param profileId Profile ID
 * @returns Success status
 */
export async function deleteClientProfile(profileId: string) {
  try {
    const { error } = await supabase
      .from('client_profiles')
      .delete()
      .eq('id', profileId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting client profile:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Filter clients by type
 * 
 * @param clientType Client type to filter by
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching client profiles
 */
export async function getClientsByType(
  clientType: ClientType,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('client_profiles')
      .select('*', { count: 'exact' })
      .eq('client_type', clientType)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting clients by type:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get statistics on client profiles
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getClientProfileStats() {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('client_type, created_at');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count client types
    const clientTypeCounts = data.reduce((acc, client) => {
      acc[client.client_type] = (acc[client.client_type] || 0) + 1;
      return acc;
    }, {} as Record<ClientType, number>);
    
    // Count clients by month
    const clientsByMonth: Record<string, number> = {};
    data.forEach(client => {
      const date = new Date(client.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      clientsByMonth[month] = (clientsByMonth[month] || 0) + 1;
    });
    
    return {
      stats: {
        clientTypeCounts,
        clientsByMonth,
        totalClients: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting client profile stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}