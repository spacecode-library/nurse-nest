// src/supabase/api/nurseLicenseService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * License verification status
 */
export type VerificationStatus = 'pending' | 'verified' | 'failed';

/**
 * Interface for nurse license data
 */
export interface NurseLicense {
  id?: string;
  nurse_id: string;
  license_type: string;
  license_number: string;
  issuing_state: string;
  expiration_date: string; // Format: YYYY-MM-DD
  license_photo_url?: string;
  verification_status: VerificationStatus;
  created_at?: string;
  updated_at?: string;
}

/**
 * Add a new nurse license
 * 
 * @param licenseData License data to create
 * @returns Created license
 */
export async function addNurseLicense(licenseData: Omit<NurseLicense, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Set default verification status if not provided
    const dataWithDefaults = {
      ...licenseData,
      verification_status: licenseData.verification_status || 'pending'
    };

    const { data, error } = await supabase
      .from('nurse_licenses')
      .insert(dataWithDefaults)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding nurse license:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all licenses for a nurse
 * 
 * @param nurseId Nurse ID
 * @returns List of licenses
 */
export async function getNurseLicenses(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .select('*')
      .eq('nurse_id', nurseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting nurse licenses:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a specific license by ID
 * 
 * @param licenseId License ID
 * @returns License data
 */
export async function getLicenseById(licenseId: string) {
  try {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .select('*')
      .eq('id', licenseId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting license by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update a nurse license
 * 
 * @param licenseId License ID
 * @param updates Updates to apply
 * @returns Updated license
 */
export async function updateNurseLicense(licenseId: string, updates: Partial<NurseLicense>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nurse_licenses')
      .update(updatedData)
      .eq('id', licenseId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating nurse license:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update license verification status
 * 
 * @param licenseId License ID
 * @param status New verification status
 * @returns Updated license
 */
export async function updateVerificationStatus(licenseId: string, status: VerificationStatus) {
  try {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .update({
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', licenseId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating license verification status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a nurse license
 * 
 * @param licenseId License ID
 * @returns Success status
 */
export async function deleteNurseLicense(licenseId: string) {
  try {
    const { error } = await supabase
      .from('nurse_licenses')
      .delete()
      .eq('id', licenseId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting nurse license:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Get all licenses pending verification (admin only)
 * 
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of pending licenses
 */
export async function getPendingLicenses(limit: number = 10, offset: number = 0) {
  try {
    const { data, error, count } = await supabase
      .from('nurse_licenses')
      .select('*, nurse_profiles!inner(id, first_name, last_name)', { count: 'exact' })
      .eq('verification_status', 'pending')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting pending licenses:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Check if a license is expired or about to expire
 * 
 * @param expirationDate License expiration date (YYYY-MM-DD)
 * @param warningDays Days before expiration to trigger warning (default: 30)
 * @returns Status object
 */
export function checkLicenseStatus(expirationDate: string, warningDays: number = 30) {
  const today = new Date();
  const expDate = new Date(expirationDate);
  
  // Check if the expiration date is valid
  if (isNaN(expDate.getTime())) {
    return { isValid: false, isExpired: true, daysUntilExpiration: 0, warning: true };
  }
  
  // Calculate days until expiration
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isValid: true,
    isExpired: diffDays < 0,
    daysUntilExpiration: diffDays,
    warning: diffDays >= 0 && diffDays <= warningDays
  };
}

/**
 * Verify a license with an external API (placeholder function)
 * In production, this would integrate with a real license verification API like Nursys
 * 
 * @param licenseNumber License number
 * @param state State of issuance
 * @returns Verification result
 */
export async function verifyLicenseWithExternalApi(licenseNumber: string, state: string) {
  try {
    // This is a placeholder for an actual API call
    // In development, we'll simulate a successful response
    // In production, you'd integrate with a real verification service
    
    console.log(`Simulating verification for license ${licenseNumber} in ${state}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a successful response
    return {
      success: true,
      data: {
        verified: true,
        status: 'active',
        expirationDate: '2025-12-31'
      },
      error: null
    };
    
    // When implementing a real integration, you'd make an HTTP request to the verification API
    // For example:
    /*
    const response = await fetch('https://api.nursys.com/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NURSYS_API_KEY}`
      },
      body: JSON.stringify({
        licenseNumber,
        state
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify license');
    }
    
    return {
      success: true,
      data,
      error: null
    };
    */
  } catch (error) {
    console.error('Error verifying license with external API:', error);
    return {
      success: false,
      data: null,
      error: error as Error
    };
  }
}