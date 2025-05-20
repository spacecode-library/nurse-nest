// src/supabase/api/careLocationService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for care location data
 */
export interface CareLocation {
  id?: string;
  client_id: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  home_environment: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Add a new care location
 * 
 * @param locationData Location data to create
 * @returns Created location
 */
export async function addCareLocation(locationData: Omit<CareLocation, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('care_locations')
      .insert(locationData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding care location:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all care locations for a client
 * 
 * @param clientId Client ID
 * @returns List of care locations
 */
export async function getCareLocations(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('care_locations')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care locations:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a specific care location by ID
 * 
 * @param locationId Location ID
 * @returns Location data
 */
export async function getCareLocationById(locationId: string) {
  try {
    const { data, error } = await supabase
      .from('care_locations')
      .select('*')
      .eq('id', locationId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care location by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a care location
 * 
 * @param locationId Location ID
 * @param updates Updates to apply
 * @returns Updated location
 */
export async function updateCareLocation(locationId: string, updates: Partial<CareLocation>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('care_locations')
      .update(updatedData)
      .eq('id', locationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating care location:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a care location
 * 
 * @param locationId Location ID
 * @returns Success status
 */
export async function deleteCareLocation(locationId: string) {
  try {
    const { error } = await supabase
      .from('care_locations')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting care location:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Find care locations by city
 * 
 * @param city City to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching care locations
 */
export async function findLocationsByCity(
  city: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedCity = city.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_locations')
      .select('*, client_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .ilike('city', `%${sanitizedCity}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding locations by city:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find care locations by state
 * 
 * @param state State to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching care locations
 */
export async function findLocationsByState(
  state: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedState = state.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_locations')
      .select('*, client_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .ilike('state', `%${sanitizedState}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding locations by state:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find care locations by zip code
 * 
 * @param zipCode Zip code to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching care locations
 */
export async function findLocationsByZipCode(
  zipCode: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedZipCode = zipCode.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_locations')
      .select('*, client_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .ilike('zip_code', `%${sanitizedZipCode}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding locations by zip code:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find care locations by home environment
 * 
 * @param environment Home environment type to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching care locations
 */
export async function findLocationsByEnvironment(
  environment: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedEnvironment = environment.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_locations')
      .select('*, client_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .ilike('home_environment', `%${sanitizedEnvironment}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding locations by environment:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Check if a client already has a care location
 * 
 * @param clientId Client ID
 * @returns Boolean indicating if client has a care location
 */
export async function hasLocation(clientId: string) {
  try {
    const { count, error } = await supabase
      .from('care_locations')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (error) throw error;
    return { hasLocation: (count || 0) > 0, error: null };
  } catch (error) {
    console.error('Error checking if client has location:', error);
    return { hasLocation: false, error: error as PostgrestError };
  }
}

/**
 * Get statistics on care locations
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getCareLocationStats() {
  try {
    const { data, error } = await supabase
      .from('care_locations')
      .select('city, state, home_environment');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count locations by state
    const stateCount = data.reduce((acc, location) => {
      acc[location.state] = (acc[location.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count locations by environment type
    const environmentCount = data.reduce((acc, location) => {
      acc[location.home_environment] = (acc[location.home_environment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get top cities
    const cityCount = data.reduce((acc, location) => {
      acc[location.city] = (acc[location.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [city, count]) => {
        acc[city] = count;
        return acc;
      }, {} as Record<string, number>);
    
    return {
      stats: {
        stateCount,
        environmentCount,
        topCities,
        totalLocations: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting care location stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}