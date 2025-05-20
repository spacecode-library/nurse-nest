// src/supabase/api/careNeedsService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for care needs data
 */
export interface CareNeeds {
  id?: string;
  client_id: string;
  care_types: string[];
  care_schedule: string[];
  hours_per_week: number;
  special_skills: string[];
  health_conditions: string[];
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Add care needs for a client
 * 
 * @param needsData Care needs data to create
 * @returns Created care needs
 */
export async function addCareNeeds(needsData: Omit<CareNeeds, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('care_needs')
      .insert(needsData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding care needs:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get care needs for a client
 * 
 * @param clientId Client ID
 * @returns Care needs data
 */
export async function getCareNeeds(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('care_needs')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care needs:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get care needs by ID
 * 
 * @param needsId Care needs ID
 * @returns Care needs data
 */
export async function getCareNeedsById(needsId: string) {
  try {
    const { data, error } = await supabase
      .from('care_needs')
      .select('*')
      .eq('id', needsId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care needs by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update care needs
 * 
 * @param needsId Care needs ID
 * @param updates Updates to apply
 * @returns Updated care needs
 */
export async function updateCareNeeds(needsId: string, updates: Partial<CareNeeds>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('care_needs')
      .update(updatedData)
      .eq('id', needsId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating care needs:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete care needs
 * 
 * @param needsId Care needs ID
 * @returns Success status
 */
export async function deleteCareNeeds(needsId: string) {
  try {
    const { error } = await supabase
      .from('care_needs')
      .delete()
      .eq('id', needsId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting care needs:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Find clients by care type
 * 
 * @param careType Care type to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching clients with care needs
 */
export async function findClientsByCareType(
  careType: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedCareType = careType.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_needs')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .filter('care_types', 'cs', `{${sanitizedCareType}}`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding clients by care type:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find clients by care schedule
 * 
 * @param schedule Care schedule to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching clients with care needs
 */
export async function findClientsBySchedule(
  schedule: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedSchedule = schedule.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_needs')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .filter('care_schedule', 'cs', `{${sanitizedSchedule}}`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding clients by schedule:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find clients by hours per week
 * 
 * @param minHours Minimum hours per week
 * @param maxHours Maximum hours per week
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching clients with care needs
 */
export async function findClientsByHours(
  minHours: number,
  maxHours: number,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('care_needs')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .gte('hours_per_week', minHours)
      .lte('hours_per_week', maxHours)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding clients by hours:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find clients by required special skills
 * 
 * @param skill Special skill to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching clients with care needs
 */
export async function findClientsByRequiredSkill(
  skill: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedSkill = skill.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_needs')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .filter('special_skills', 'cs', `{${sanitizedSkill}}`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding clients by required skill:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find clients by health condition
 * 
 * @param condition Health condition to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching clients with care needs
 */
export async function findClientsByHealthCondition(
  condition: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedCondition = condition.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('care_needs')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .filter('health_conditions', 'cs', `{${sanitizedCondition}}`)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding clients by health condition:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Check if a client already has care needs defined
 * 
 * @param clientId Client ID
 * @returns Boolean indicating if client has care needs
 */
export async function hasCareNeeds(clientId: string) {
  try {
    const { count, error } = await supabase
      .from('care_needs')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (error) throw error;
    return { hasCareNeeds: (count || 0) > 0, error: null };
  } catch (error) {
    console.error('Error checking if client has care needs:', error);
    return { hasCareNeeds: false, error: error as PostgrestError };
  }
}

/**
 * Get statistics on care needs
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getCareNeedsStats() {
  try {
    const { data, error } = await supabase
      .from('care_needs')
      .select('care_types, care_schedule, hours_per_week, special_skills, health_conditions');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count by care type
    const careTypeCounts = getCategoryCounts(data.flatMap(item => item.care_types));
    
    // Count by schedule
    const scheduleCounts = getCategoryCounts(data.flatMap(item => item.care_schedule));
    
    // Count by special skills
    const skillCounts = getCategoryCounts(data.flatMap(item => item.special_skills));
    
    // Count by health conditions
    const conditionCounts = getCategoryCounts(data.flatMap(item => item.health_conditions));
    
    // Calculate hours statistics
    const hours = data.map(item => item.hours_per_week);
    const averageHours = hours.reduce((sum, hours) => sum + hours, 0) / hours.length;
    const minHours = Math.min(...hours);
    const maxHours = Math.max(...hours);
    
    return {
      stats: {
        careTypeCounts,
        scheduleCounts,
        skillCounts,
        conditionCounts,
        hours: {
          average: averageHours,
          min: minHours,
          max: maxHours
        },
        totalEntries: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting care needs stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Helper function to count categories
 * 
 * @param items Array of items
 * @returns Object with items as keys and counts as values
 */
function getCategoryCounts(items: string[]) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}