// src/supabase/api/nursePreferencesService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for nurse preferences data
 */
export interface NursePreferences {
  id?: string;
  nurse_id: string;
  availability_types: string[];
  preferred_shifts: string[];
  location_preferences: string[];
  travel_radius: number;
  desired_hourly_rate: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Save nurse preferences
 * If preferences already exist for this nurse, they will be updated
 * 
 * @param preferencesData Preferences data
 * @returns Created or updated preferences
 */
export async function saveNursePreferences(preferencesData: Omit<NursePreferences, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Check if preferences already exist for this nurse
    const { data: existingData, error: checkError } = await supabase
      .from('nurse_preferences')
      .select('id')
      .eq('nurse_id', preferencesData.nurse_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingData?.id) {
      // Update existing preferences
      return updateNursePreferences(existingData.id, preferencesData);
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('nurse_preferences')
        .insert(preferencesData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error('Error saving nurse preferences:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get preferences for a specific nurse
 * 
 * @param nurseId Nurse ID
 * @returns Preferences data
 */
export async function getNursePreferences(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_preferences')
      .select('*')
      .eq('nurse_id', nurseId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse preferences:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update nurse preferences
 * 
 * @param preferencesId Preferences ID
 * @param updates Updates to apply
 * @returns Updated preferences
 */
export async function updateNursePreferences(preferencesId: string, updates: Partial<NursePreferences>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nurse_preferences')
      .update(updatedData)
      .eq('id', preferencesId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating nurse preferences:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Find nurses with specific availability types
 * 
 * @param availabilityTypes Availability types to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesByAvailability(
  availabilityTypes: string[],
  limit: number = 10,
  offset: number = 0
) {
  try {
    if (!availabilityTypes || availabilityTypes.length === 0) {
      throw new Error('At least one availability type must be provided');
    }
    
    // Convert array to string array for text[] SQL operation
    const availabilityQuery = availabilityTypes.map(a => `%${a}%`);
    
    const { data, error, count } = await supabase
      .from('nurse_preferences')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .or(availabilityQuery.map(a => `availability_types.ilike.${a}`).join(','))
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by availability:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find nurses by preferred shifts
 * 
 * @param shiftTypes Shift types to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesByShiftPreference(
  shiftTypes: string[],
  limit: number = 10,
  offset: number = 0
) {
  try {
    if (!shiftTypes || shiftTypes.length === 0) {
      throw new Error('At least one shift type must be provided');
    }
    
    // Convert array to string array for text[] SQL operation
    const shiftQuery = shiftTypes.map(s => `%${s}%`);
    
    const { data, error, count } = await supabase
      .from('nurse_preferences')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .or(shiftQuery.map(s => `preferred_shifts.ilike.${s}`).join(','))
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by shift preference:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find nurses by location preferences
 * 
 * @param locations Locations to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesByLocation(
  locations: string[],
  limit: number = 10,
  offset: number = 0
) {
  try {
    if (!locations || locations.length === 0) {
      throw new Error('At least one location must be provided');
    }
    
    // Convert array to string array for text[] SQL operation
    const locationQuery = locations.map(l => `%${l}%`);
    
    const { data, error, count } = await supabase
      .from('nurse_preferences')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .or(locationQuery.map(l => `location_preferences.ilike.${l}`).join(','))
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by location:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find nurses by hourly rate range
 * 
 * @param minRate Minimum hourly rate
 * @param maxRate Maximum hourly rate (optional)
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesByRateRange(
  minRate: number,
  maxRate?: number,
  limit: number = 10,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('nurse_preferences')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .gte('desired_hourly_rate', minRate);
    
    if (maxRate) {
      query = query.lte('desired_hourly_rate', maxRate);
    }
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('desired_hourly_rate', { ascending: true });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by rate range:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Advanced search for nurses by preferences
 * 
 * @param filters Preference filters
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function searchNursesByPreferences(
  filters: {
    availabilityTypes?: string[];
    preferredShifts?: string[];
    locationPreferences?: string[];
    maxTravelRadius?: number;
    minHourlyRate?: number;
    maxHourlyRate?: number;
  },
  limit: number = 10,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('nurse_preferences')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' });
    
    // Apply filters
    if (filters.availabilityTypes && filters.availabilityTypes.length > 0) {
      const availabilityQuery = filters.availabilityTypes.map(a => `%${a}%`);
      query = query.or(availabilityQuery.map(a => `availability_types.ilike.${a}`).join(','));
    }
    
    if (filters.preferredShifts && filters.preferredShifts.length > 0) {
      const shiftQuery = filters.preferredShifts.map(s => `%${s}%`);
      query = query.or(shiftQuery.map(s => `preferred_shifts.ilike.${s}`).join(','));
    }
    
    if (filters.locationPreferences && filters.locationPreferences.length > 0) {
      const locationQuery = filters.locationPreferences.map(l => `%${l}%`);
      query = query.or(locationQuery.map(l => `location_preferences.ilike.${l}`).join(','));
    }
    
    if (filters.maxTravelRadius) {
      query = query.lte('travel_radius', filters.maxTravelRadius);
    }
    
    if (filters.minHourlyRate) {
      query = query.gte('desired_hourly_rate', filters.minHourlyRate);
    }
    
    if (filters.maxHourlyRate) {
      query = query.lte('desired_hourly_rate', filters.maxHourlyRate);
    }
    
    // Apply pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching nurses by preferences:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get statistics on nurse preferences
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getNursePreferencesStats() {
  try {
    const { data, error } = await supabase
      .from('nurse_preferences')
      .select(`
        desired_hourly_rate,
        travel_radius,
        availability_types,
        preferred_shifts,
        location_preferences
      `);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Calculate rate statistics
    const rates = data.map(item => item.desired_hourly_rate);
    const averageRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    
    // Calculate travel radius statistics
    const radii = data.map(item => item.travel_radius);
    const averageRadius = radii.reduce((sum, radius) => sum + radius, 0) / radii.length;
    
    // Get unique values and counts
    const availabilityTypes = getUniqueItemsWithCounts(data.flatMap(item => item.availability_types));
    const preferredShifts = getUniqueItemsWithCounts(data.flatMap(item => item.preferred_shifts));
    const locationPreferences = getUniqueItemsWithCounts(data.flatMap(item => item.location_preferences));
    
    return {
      stats: {
        hourlyRate: {
          average: averageRate,
          min: minRate,
          max: maxRate
        },
        travelRadius: {
          average: averageRadius
        },
        availabilityTypes,
        preferredShifts,
        locationPreferences,
        totalNurses: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting nurse preferences stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Helper function to get unique items with counts
 * 
 * @param items Array of items
 * @returns Object with items as keys and counts as values
 */
function getUniqueItemsWithCounts(items: string[]) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}