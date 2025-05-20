// src/supabase/api/jobPostingService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Job posting status types
 */
export type JobStatus = 'open' | 'filled' | 'expired';

/**
 * Interface for job posting data
 */
export interface JobPosting {
  id?: string;
  client_id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  benefits?: string;
  status: JobStatus;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new job posting
 * 
 * @param jobData Job posting data to create
 * @returns Created job posting
 */
export async function createJobPosting(jobData: Omit<JobPosting, 'id' | 'job_code' | 'created_at' | 'updated_at'>) {
  try {
    // Generate a unique job code
    const jobCode = generateJobCode();
    
    const fullJobData = {
      ...jobData,
      job_code: jobCode,
      status: jobData.status || 'open'
    };
    
    const { data, error } = await supabase
      .from('job_postings')
      .insert(fullJobData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating job posting:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a job posting by ID
 * 
 * @param jobId Job ID
 * @returns Job posting data
 */
export async function getJobPostingById(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting job posting by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a job posting by job code
 * 
 * @param jobCode Job code
 * @returns Job posting data
 */
export async function getJobPostingByCode(jobCode: string) {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `)
      .eq('job_code', jobCode)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting job posting by code:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all job postings for a client
 * 
 * @param clientId Client ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of job postings
 */
export async function getClientJobPostings(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('job_postings')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting client job postings:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get all open job postings
 * 
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of open job postings
 */
export async function getOpenJobPostings(
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting open job postings:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Update a job posting
 * 
 * @param jobId Job ID
 * @param updates Updates to apply
 * @returns Updated job posting
 */
export async function updateJobPosting(jobId: string, updates: Partial<JobPosting>) {
  try {
    // Add a timestamp for tracking updates
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('job_postings')
      .update(updatedData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating job posting:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update job posting status
 * 
 * @param jobId Job ID
 * @param status New status
 * @returns Updated job posting
 */
export async function updateJobStatus(jobId: string, status: JobStatus) {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating job status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete a job posting
 * 
 * @param jobId Job ID
 * @returns Success status
 */
export async function deleteJobPosting(jobId: string) {
  try {
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Search for job postings by care type
 * 
 * @param careType Care type to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching job postings
 */
export async function searchJobsByCareType(
  careType: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedCareType = careType.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .ilike('care_type', `%${sanitizedCareType}%`)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching jobs by care type:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Search for job postings by preferred time
 * 
 * @param preferredTime Preferred time to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching job postings
 */
export async function searchJobsByPreferredTime(
  preferredTime: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedPreferredTime = preferredTime.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .ilike('preferred_time', `%${sanitizedPreferredTime}%`)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching jobs by preferred time:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Search for job postings by duration
 * 
 * @param duration Duration to search for
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching job postings
 */
export async function searchJobsByDuration(
  duration: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // Sanitize input
    const sanitizedDuration = duration.replace(/[;'"\\]/g, '');
    
    const { data, error, count } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .ilike('duration', `%${sanitizedDuration}%`)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error searching jobs by duration:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Advanced search for job postings
 * 
 * @param filters Search filters
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching job postings
 */
export async function advancedJobSearch(
  filters: {
    careType?: string;
    preferredTime?: string;
    duration?: string;
    status?: JobStatus;
    keywords?: string;
  },
  limit: number = 10,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' });
    
    // Apply status filter (default to open)
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'open');
    }
    
    // Apply care type filter
    if (filters.careType) {
      const sanitizedCareType = filters.careType.replace(/[;'"\\]/g, '');
      query = query.ilike('care_type', `%${sanitizedCareType}%`);
    }
    
    // Apply preferred time filter
    if (filters.preferredTime) {
      const sanitizedPreferredTime = filters.preferredTime.replace(/[;'"\\]/g, '');
      query = query.ilike('preferred_time', `%${sanitizedPreferredTime}%`);
    }
    
    // Apply duration filter
    if (filters.duration) {
      const sanitizedDuration = filters.duration.replace(/[;'"\\]/g, '');
      query = query.ilike('duration', `%${sanitizedDuration}%`);
    }
    
    // Apply keyword search
    if (filters.keywords) {
      const sanitizedKeywords = filters.keywords.replace(/[;'"\\]/g, '');
      query = query.or(`
        care_type.ilike.%${sanitizedKeywords}%,
        duration.ilike.%${sanitizedKeywords}%,
        preferred_time.ilike.%${sanitizedKeywords}%,
        benefits.ilike.%${sanitizedKeywords}%
      `);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Order by creation date (most recent first)
    query = query.order('created_at', { ascending: false });
    
    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error performing advanced job search:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Find job postings with matching care recipients
 * This is more complex and requires joining multiple tables
 * 
 * @param nurseId Nurse ID to match with
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns Matching job postings
 */
export async function findMatchingJobs(
  nurseId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // First, get the nurse's qualifications and preferences
    const { data: nurseData, error: nurseError } = await supabase
      .from('nurse_profiles')
      .select(`
        id,
        nurse_qualifications(specializations),
        nurse_preferences(
          availability_types,
          preferred_shifts,
          location_preferences,
          travel_radius
        )
      `)
      .eq('id', nurseId)
      .single();
    
    if (nurseError) throw nurseError;
    
    // Extract qualifications and preferences
    const specializations = nurseData?.nurse_qualifications?.[0]?.specializations || [];
    const availabilityTypes = nurseData?.nurse_preferences?.[0]?.availability_types || [];
    const preferredShifts = nurseData?.nurse_preferences?.[0]?.preferred_shifts || [];
    const locationPreferences = nurseData?.nurse_preferences?.[0]?.location_preferences || [];
    
    // Now find job postings that match
    // This is a simplified matching algorithm - in a real app, this would be more sophisticated
    const { data, error, count } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .or(specializations.map(s => `care_type.ilike.%${s}%`).join(','))
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, count, error: null };
  } catch (error) {
    console.error('Error finding matching jobs:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get job posting statistics
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getJobPostingStats() {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('status, care_type, preferred_time, duration, created_at');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count by status
    const statusCounts = data.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<JobStatus, number>);
    
    // Count by care type
    const careTypeCounts = data.reduce((acc, job) => {
      acc[job.care_type] = (acc[job.care_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by preferred time
    const preferredTimeCounts = data.reduce((acc, job) => {
      acc[job.preferred_time] = (acc[job.preferred_time] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by duration
    const durationCounts = data.reduce((acc, job) => {
      acc[job.duration] = (acc[job.duration] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count jobs by month
    const jobsByMonth: Record<string, number> = {};
    data.forEach(job => {
      const date = new Date(job.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      jobsByMonth[month] = (jobsByMonth[month] || 0) + 1;
    });
    
    return {
      stats: {
        statusCounts,
        careTypeCounts,
        preferredTimeCounts,
        durationCounts,
        jobsByMonth,
        totalJobs: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting job posting stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Generate a unique job code
 * Format: NN-XXXXX (where N = number, X = alphanumeric)
 * 
 * @returns Unique job code
 */
function generateJobCode(): string {
  const prefix = Math.floor(10 + Math.random() * 90).toString(); // 10-99
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = prefix + '-';
  
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}