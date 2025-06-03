// src/supabase/api/nurseQualificationService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for nurse qualification data
 */
export interface NurseQualification {
  id?: string;
  nurse_id: string;
  specializations: string[];
  years_experience: number;
  education_level: string;
  school_name: string;
  graduation_year: number;
  resume_url: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create or update nurse qualifications
 * If a qualification record already exists for the nurse, it will be updated
 * 
 * @param qualificationData Qualification data
 * @returns Created or updated qualification
 */
export async function saveNurseQualification(qualificationData: Omit<NurseQualification, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Check if a qualification record already exists for this nurse
    const { data: existingData, error: checkError } = await supabase
      .from('nurse_qualifications')
      .select('id')
      .eq('nurse_id', qualificationData.nurse_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingData?.id) {
      // Update existing record
      return updateNurseQualification(existingData.id, qualificationData);
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('nurse_qualifications')
        .insert(qualificationData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error('Error saving nurse qualification:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get qualification for a specific nurse
 * 
 * @param nurseId Nurse ID
 * @returns Qualification data
 */
export async function getNurseQualification(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_qualifications')
      .select('*')
      .eq('nurse_id', nurseId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse qualification:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update nurse qualification
 * 
 * @param qualificationId Qualification ID
 * @param updates Updates to apply
 * @returns Updated qualification
 */
export async function updateNurseQualification(qualificationId: string, updates: Partial<NurseQualification>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nurse_qualifications')
      .update(updatedData)
      .eq('id', qualificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating nurse qualification:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete nurse qualification
 * 
 * @param qualificationId Qualification ID
 * @returns Success status
 */
export async function deleteNurseQualification(qualificationId: string) {
  try {
    const { error } = await supabase
      .from('nurse_qualifications')
      .delete()
      .eq('id', qualificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting nurse qualification:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Find nurses with specific specializations
 * 
 * @param specializations Array of specialization to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesBySpecialization(
  specializations: string[],
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Convert array to string array for text[] SQL operation
    const specializationQuery = specializations.map(s => `%${s}%`);
    
    // Use LIKE with array operator to find partial matches
    const { data, error, count } = await supabase
      .from('nurse_qualifications')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .or(specializationQuery.map(s => `specializations.ilike.${s}`).join(','))
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by specialization:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find nurses with minimum years of experience
 * 
 * @param minYears Minimum years of experience
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function findNursesByExperience(
  minYears: number,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('nurse_qualifications')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .gte('years_experience', minYears)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding nurses by experience:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Advanced search for nurses with filters
 * 
 * @param filters Search filters
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching nurses
 */
export async function searchNursesByQualifications(
  filters: {
    specializations?: string[];
    minExperience?: number;
    educationLevel?: string;
    keywords?: string;
  },
  limit: number = 10,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('nurse_qualifications')
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
    if (filters.specializations && filters.specializations.length > 0) {
      const specializationQuery = filters.specializations.map(s => `%${s}%`);
      query = query.or(specializationQuery.map(s => `specializations.ilike.${s}`).join(','));
    }
    
    if (filters.minExperience) {
      query = query.gte('years_experience', filters.minExperience);
    }
    
    if (filters.educationLevel) {
      query = query.eq('education_level', filters.educationLevel);
    }
    
    if (filters.keywords) {
      const sanitizedKeywords = filters.keywords.replace(/[;'"\\]/g, '');
      query = query.or(`
        school_name.ilike.%${sanitizedKeywords}%,
        nurse_profiles.first_name.ilike.%${sanitizedKeywords}%,
        nurse_profiles.last_name.ilike.%${sanitizedKeywords}%
      `);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching nurses by qualifications:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get all available specializations from the database
 * This is useful for populating dropdown menus
 * 
 * @returns Array of unique specializations
 */
export async function getAllSpecializations() {
  try {
    const { data, error } = await supabase
      .from('nurse_qualifications')
      .select('specializations');

    if (error) throw error;
    
    // Extract and flatten all specializations
    const allSpecializations = data.flatMap(item => item.specializations);
    
    // Get unique values
    const uniqueSpecializations = [...new Set(allSpecializations)];
    
    return { specializations: uniqueSpecializations, error: null };
  } catch (error) {
    console.error('Error getting all specializations:', error);
    return { specializations: [], error: error as PostgrestError };
  }
}