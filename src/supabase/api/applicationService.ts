// src/supabase/api/applicationService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Application status types
 */
export type ApplicationStatus = 'new' | 'shortlisted' | 'hired' | 'declined';

/**
 * Interface for job application data
 */
export interface JobApplication {
  id?: string;
  nurse_id: string;
  job_id: string;
  status: ApplicationStatus;
  cover_message?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Submit a job application
 * 
 * @param applicationData Application data to create
 * @returns Created application
 */
export async function submitApplication(applicationData: Omit<JobApplication, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  try {
    // Check if the nurse has already applied for this job
    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('nurse_id', applicationData.nurse_id)
      .eq('job_id', applicationData.job_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingApp?.id) {
      throw new Error('You have already applied for this job');
    }
    
    // Submit new application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...applicationData,
        status: 'new' // Default status for all new applications
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { data: null, error: error instanceof Error ? error : new Error('An unexpected error occurred') };
  }
}

/**
 * Get an application by ID
 * 
 * @param applicationId Application ID
 * @returns Application data
 */
export async function getApplicationById(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings(*),
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `)
      .eq('id', applicationId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting application by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all applications for a job
 * 
 * @param jobId Job ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of applications
 */
export async function getApplicationsByJob(
  jobId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .eq('job_id', jobId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting applications by job:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get all applications for a nurse
 * 
 * @param nurseId Nurse ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of applications
 */
export async function getApplicationsByNurse(
  nurseId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings(*)
      `, { count: 'exact' })
      .eq('nurse_id', nurseId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting applications by nurse:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Update application status
 * 
 * @param applicationId Application ID
 * @param status New status
 * @returns Updated application
 */
export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  try {
    // Special handling if status is 'hired'
    if (status === 'hired') {
      // Get the job ID for this application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('job_id')
        .eq('id', applicationId)
        .single();
      
      if (appError) throw appError;
      
      // Update the job status to 'filled'
      const { error: jobError } = await supabase
        .from('job_postings')
        .update({ status: 'filled' })
        .eq('id', application.job_id);
      
      if (jobError) throw jobError;
      
      // Update all other applications for this job to 'declined'
      const { error: declineError } = await supabase
        .from('applications')
        .update({ status: 'declined' })
        .eq('job_id', application.job_id)
        .neq('id', applicationId);
      
      if (declineError) throw declineError;
    }
    
    // Update the application status
    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Withdraw an application (nurse only)
 * 
 * @param applicationId Application ID
 * @param nurseId Nurse ID (for validation)
 * @returns Success status
 */
export async function withdrawApplication(applicationId: string, nurseId: string) {
  try {
    // Verify that this application belongs to the nurse
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('nurse_id', nurseId)
      .single();
    
    if (appError) throw appError;
    
    // If the application is already hired, can't withdraw
    if (application.status === 'hired') {
      throw new Error('Cannot withdraw an accepted application. Please contact support.');
    }
    
    // Delete the application
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('nurse_id', nurseId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred') 
    };
  }
}

/**
 * Delete an application (admin only)
 * 
 * @param applicationId Application ID
 * @returns Success status
 */
export async function deleteApplication(applicationId: string) {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Get applications by status
 * 
 * @param status Status to filter by
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching applications
 */
export async function getApplicationsByStatus(
  status: ApplicationStatus,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings(*),
        nurse_profiles!inner(
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `, { count: 'exact' })
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting applications by status:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Check if a nurse has already applied to a job
 * 
 * @param nurseId Nurse ID
 * @param jobId Job ID
 * @returns Boolean indicating if nurse has already applied
 */
export async function hasApplied(nurseId: string, jobId: string) {
  try {
    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('nurse_id', nurseId)
      .eq('job_id', jobId);

    if (error) throw error;
    return { hasApplied: (count || 0) > 0, error: null };
  } catch (error) {
    console.error('Error checking if nurse has applied:', error);
    return { hasApplied: false, error: error as PostgrestError };
  }
}

/**
 * Get application statistics
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getApplicationStats() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status, created_at');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count by status
    const statusCounts = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
    
    // Count applications by month
    const appsByMonth: Record<string, number> = {};
    data.forEach(app => {
      const date = new Date(app.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      appsByMonth[month] = (appsByMonth[month] || 0) + 1;
    });
    
    return {
      stats: {
        statusCounts,
        appsByMonth,
        totalApplications: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting application stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}