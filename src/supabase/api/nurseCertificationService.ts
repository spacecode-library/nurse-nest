// src/supabase/api/nurseCertificationService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Interface for nurse certification data
 */
export interface NurseCertification {
  id?: string;
  nurse_id: string;
  certification_name: string;
  certification_file_url: string;
  is_malpractice_insurance: boolean;
  expiration_date?: string; // Format: YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
}

/**
 * Add a new certification for a nurse
 * 
 * @param certificationData Certification data to create
 * @returns Created certification
 */
export async function addNurseCertification(certificationData: Omit<NurseCertification, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .insert(certificationData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding nurse certification:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all certifications for a nurse
 * 
 * @param nurseId Nurse ID
 * @returns List of certifications
 */
export async function getNurseCertifications(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .select('*')
      .eq('nurse_id', nurseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse certifications:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a specific certification by ID
 * 
 * @param certificationId Certification ID
 * @returns Certification data
 */
export async function getCertificationById(certificationId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .select('*')
      .eq('id', certificationId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting certification by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Check if a nurse has malpractice insurance
 * 
 * @param nurseId Nurse ID
 * @returns Boolean indicating if nurse has malpractice insurance
 */
export async function hasMalpracticeInsurance(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .select('id')
      .eq('nurse_id', nurseId)
      .eq('is_malpractice_insurance', true)
      .limit(1)
      .single();

    if (error) {
      // If there's an error because no records were found, return false
      if (error.code === 'PGRST116') {
        return { hasMalpractice: false, error: null };
      }
      throw error;
    }
    
    return { hasMalpractice: true, error: null };
  } catch (error) {
    console.error('Error checking malpractice insurance:', error);
    return { hasMalpractice: false, error: error as PostgrestError };
  }
}

/**
 * Get malpractice insurance details for a nurse
 * 
 * @param nurseId Nurse ID
 * @returns Malpractice insurance certification
 */
export async function getMalpracticeInsurance(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .select('*')
      .eq('nurse_id', nurseId)
      .eq('is_malpractice_insurance', true)
      .limit(1)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting malpractice insurance:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a certification
 * 
 * @param certificationId Certification ID
 * @param updates Updates to apply
 * @returns Updated certification
 */
export async function updateNurseCertification(certificationId: string, updates: Partial<NurseCertification>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nurse_certifications')
      .update(updatedData)
      .eq('id', certificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating nurse certification:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a certification
 * 
 * @param certificationId Certification ID
 * @returns Success status
 */
export async function deleteNurseCertification(certificationId: string) {
  try {
    const { error } = await supabase
      .from('nurse_certifications')
      .delete()
      .eq('id', certificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting nurse certification:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Check for expired certifications
 * 
 * @param nurseId Nurse ID
 * @param warningDays Days before expiration to trigger warning (default: 30)
 * @returns List of expired or soon-to-expire certifications
 */
export async function checkExpiredCertifications(nurseId: string, warningDays: number = 30) {
  try {
    const { data, error } = await supabase
      .from('nurse_certifications')
      .select('*')
      .eq('nurse_id', nurseId)
      .not('expiration_date', 'is', null);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { expired: [], warning: [], error: null };
    }
    
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + warningDays);
    
    const expired = data.filter(cert => {
      const expDate = new Date(cert.expiration_date as string);
      return expDate < today;
    });
    
    const warning = data.filter(cert => {
      const expDate = new Date(cert.expiration_date as string);
      return expDate >= today && expDate <= warningDate;
    });
    
    return { expired, warning, error: null };
  } catch (error) {
    console.error('Error checking expired certifications:', error);
    return { expired: [], warning: [], error: error as PostgrestError };
  }
}