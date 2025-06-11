// src/supabase/api/contractService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Contract status types
 */
export type ContractStatus = 'pending' | 'active' | 'completed';

/**
 * Interface for contract data
 */
export interface Contract {
  id?: string;
  nurse_id: string;
  client_id: string;
  job_id: string;
  status: ContractStatus;
  terms: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new contract
 * 
 * @param contractData Contract data to create
 * @returns Created contract
 */
export async function createContract(contractData: Omit<Contract, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  try {
    // Check if a contract already exists for this nurse and job
    const { data: existingContract, error: checkError } = await supabase
      .from('contracts')
      .select('id')
      .eq('nurse_id', contractData.nurse_id)
      .eq('job_id', contractData.job_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingContract?.id) {
      throw new Error('A contract already exists for this nurse and job');
    }
    
    // Create the contract
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        ...contractData,
        status: 'active' 
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating contract:', error);
    return { data: null, error: error instanceof Error ? error : new Error('An unexpected error occurred') };
  }
}

/**
 * Get a contract by ID
 * 
 * @param contractId Contract ID
 * @returns Contract data
 */
export async function getContractById(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        nurse_profiles(id, first_name, last_name, profile_photo_url),
        client_profiles(id, first_name, last_name),
        job_postings(*)
      `)
      .eq('id', contractId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting contract by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all contracts for a nurse
 * 
 * @param nurseId Nurse ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of contracts
 */
export async function getNurseContracts(
  nurseId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('contracts')
      .select(`
        *,
        client_profiles(id, first_name, last_name),
        job_postings(*)
      `, { count: 'exact' })
      .eq('nurse_id', nurseId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting nurse contracts:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get all contracts for a client
 * 
 * @param clientId Client ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of contracts
 */
export async function getClientContracts(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('contracts')
      .select(`
        *,
        nurse_profiles(id, first_name, last_name, profile_photo_url),
        job_postings(*)
      `, { count: 'exact' })
      .eq('client_id', clientId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting client contracts:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get a contract by job ID
 * 
 * @param jobId Job ID
 * @returns Contract data
 */
export async function getContractByJobId(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        nurse_profiles(id, first_name, last_name, profile_photo_url),
        client_profiles(id, first_name, last_name),
        job_postings(*)
      `)
      .eq('job_id', jobId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting contract by job ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update contract status
 * 
 * @param contractId Contract ID
 * @param status New status
 * @returns Updated contract
 */
export async function updateContractStatus(contractId: string, status: ContractStatus) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contract status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update contract terms
 * 
 * @param contractId Contract ID
 * @param terms New terms
 * @returns Updated contract
 */
export async function updateContractTerms(contractId: string, terms: string) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .update({
        terms,
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contract terms:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a contract (admin only)
 * 
 * @param contractId Contract ID
 * @returns Success status
 */
export async function deleteContract(contractId: string) {
  try {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting contract:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Get contracts by status
 * 
 * @param status Status to filter by
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching contracts
 */
export async function getContractsByStatus(
  status: ContractStatus,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('contracts')
      .select(`
        *,
        nurse_profiles(id, first_name, last_name, profile_photo_url),
        client_profiles(id, first_name, last_name),
        job_postings(*)
      `, { count: 'exact' })
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting contracts by status:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Accept a contract (nurse side)
 * 
 * @param contractId Contract ID
 * @param nurseId Nurse ID (for validation)
 * @returns Updated contract
 */
export async function acceptContract(contractId: string, nurseId: string) {
  try {
    // Verify that this contract belongs to the nurse
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .eq('nurse_id', nurseId)
      .single();
    
    if (contractError) throw contractError;
    
    // Update the contract status
    const { data, error } = await supabase
      .from('contracts')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error accepting contract:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Complete a contract
 * 
 * @param contractId Contract ID
 * @param userId User ID (for validation - can be nurse or client)
 * @param userType User type ('nurse' or 'client')
 * @returns Updated contract
 */
export async function completeContract(contractId: string, userId: string, userType: 'nurse' | 'client') {
  try {
    // Verify that this contract belongs to the user
    const idField = userType === 'nurse' ? 'nurse_id' : 'client_id';
    
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .eq(idField, userId)
      .single();
    
    if (contractError) throw contractError;
    
    // Make sure the contract is active
    if (contract.status !== 'active') {
      throw new Error('Only active contracts can be completed');
    }
    
    // Update the contract status
    const { data, error } = await supabase
      .from('contracts')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error completing contract:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred') 
    };
  }
}

/**
 * Get contract statistics
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getContractStats() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('status, created_at');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count by status
    const statusCounts = data.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {} as Record<ContractStatus, number>);
    
    // Count contracts by month
    const contractsByMonth: Record<string, number> = {};
    data.forEach(contract => {
      const date = new Date(contract.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      contractsByMonth[month] = (contractsByMonth[month] || 0) + 1;
    });
    
    return {
      stats: {
        statusCounts,
        contractsByMonth,
        totalContracts: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting contract stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Generate standard contract terms template
 * 
 * @param jobDetails Job details
 * @param nurseDetails Nurse details
 * @param clientDetails Client details
 * @returns Contract terms template
 */
export function generateContractTermsTemplate(
  jobDetails: {
    title?: string;
    careType: string;
    duration: string;
    preferredTime: string;
  },
  nurseDetails: {
    firstName: string;
    lastName: string;
  },
  clientDetails: {
    firstName: string;
    lastName: string;
  }
): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `
# INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into as of ${formattedDate}, by and between:

**CLIENT:** ${clientDetails.firstName} ${clientDetails.lastName} ("Client")

**NURSE:** ${nurseDetails.firstName} ${nurseDetails.lastName} ("Contractor")

## 1. SERVICES

Contractor agrees to provide nursing services as an independent contractor for Client. Services include:

- Care Type: ${jobDetails.careType}
- Duration: ${jobDetails.duration}
- Preferred Schedule: ${jobDetails.preferredTime}

## 2. INDEPENDENT CONTRACTOR STATUS

The parties intend that Contractor is an independent contractor and not an employee of Client. Contractor is responsible for all income taxes, self-employment taxes, and insurance.

## 3. COMPENSATION

Client agrees to pay Contractor according to the rate agreed upon through the Nurse Nest platform. Payment will be processed through the Nurse Nest payment system, with 85% going to the Contractor and 15% retained by Nurse Nest as a platform fee.

## 4. CONFIDENTIALITY

Contractor agrees to maintain the confidentiality of all Client information and adhere to HIPAA requirements regarding protected health information.

## 5. TERMINATION

Either party may terminate this Agreement with 14 days' written notice. In the event of a material breach, either party may terminate immediately.

## 6. INSURANCE

Contractor warrants that they maintain professional liability insurance with coverage appropriate for the services rendered.

## 7. GOVERNING LAW

This Agreement shall be governed by the laws of the state where services are provided.

## 8. ENTIRE AGREEMENT

This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.

_By accepting this contract through the Nurse Nest platform, both parties indicate their agreement to these terms._
`;
}