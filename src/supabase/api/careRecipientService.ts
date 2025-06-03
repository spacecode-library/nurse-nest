// src/supabase/api/careRecipientService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for care recipient data
 */
export interface CareRecipient {
  id?: string;
  client_id: string;
  first_name: string;
  last_name: string;
  age: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Add a new care recipient
 * 
 * @param recipientData Recipient data to create
 * @returns Created recipient
 */
export async function addCareRecipient(recipientData: Omit<CareRecipient, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('care_recipients')
      .insert(recipientData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding care recipient:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all care recipients for a client
 * 
 * @param clientId Client ID
 * @returns List of care recipients
 */
export async function getCareRecipients(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('care_recipients')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care recipients:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a specific care recipient by ID
 * 
 * @param recipientId Recipient ID
 * @returns Recipient data
 */
export async function getCareRecipientById(recipientId: string) {
  try {
    const { data, error } = await supabase
      .from('care_recipients')
      .select('*')
      .eq('id', recipientId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting care recipient by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a care recipient
 * 
 * @param recipientId Recipient ID
 * @param updates Updates to apply
 * @returns Updated recipient
 */
export async function updateCareRecipient(recipientId: string, updates: Partial<CareRecipient>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('care_recipients')
      .update(updatedData)
      .eq('id', recipientId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating care recipient:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a care recipient
 * 
 * @param recipientId Recipient ID
 * @returns Success status
 */
export async function deleteCareRecipient(recipientId: string) {
  try {
    const { error } = await supabase
      .from('care_recipients')
      .delete()
      .eq('id', recipientId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting care recipient:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Get client profile associated with a care recipient
 * 
 * @param recipientId Recipient ID
 * @returns Client profile data
 */
export async function getClientForRecipient(recipientId: string) {
  try {
    // First get the care recipient to find the client_id
    const { data: recipient, error: recipientError } = await supabase
      .from('care_recipients')
      .select('client_id')
      .eq('id', recipientId)
      .single();

    if (recipientError) throw recipientError;
    
    // Then get the client profile
    const { data: client, error: clientError } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', recipient.client_id)
      .single();

    if (clientError) throw clientError;
    
    return { data: client, error: null };
  } catch (error) {
    console.error('Error getting client for recipient:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Check if a client has any care recipients
 * 
 * @param clientId Client ID
 * @returns Boolean indicating if client has care recipients
 */
export async function hasRecipients(clientId: string) {
  try {
    const { count, error } = await supabase
      .from('care_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (error) throw error;
    return { hasRecipients: (count || 0) > 0, error: null };
  } catch (error) {
    console.error('Error checking if client has recipients:', error);
    return { hasRecipients: false, error: error as PostgrestError };
  }
}

/**
 * Find care recipients by age range
 * 
 * @param minAge Minimum age
 * @param maxAge Maximum age
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching care recipients
 */
export async function findRecipientsByAgeRange(
  minAge: number,
  maxAge: number,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('care_recipients')
      .select('*, client_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .gte('age', minAge)
      .lte('age', maxAge)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding recipients by age range:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get statistics on care recipients
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getCareRecipientStats() {
  try {
    const { data, error } = await supabase
      .from('care_recipients')
      .select('age');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Calculate age statistics
    const ages = data.map(item => item.age);
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    
    // Count recipients by age group
    const ageGroups = {
      'Under 18': 0,
      '18-30': 0,
      '31-50': 0,
      '51-70': 0,
      'Over 70': 0
    };
    
    ages.forEach(age => {
      if (age < 18) ageGroups['Under 18']++;
      else if (age <= 30) ageGroups['18-30']++;
      else if (age <= 50) ageGroups['31-50']++;
      else if (age <= 70) ageGroups['51-70']++;
      else ageGroups['Over 70']++;
    });
    
    return {
      stats: {
        age: {
          average: averageAge,
          min: minAge,
          max: maxAge
        },
        ageGroups,
        totalRecipients: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting care recipient stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}