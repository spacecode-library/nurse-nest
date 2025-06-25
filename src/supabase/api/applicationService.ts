// src/supabase/api/applicationService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { getNurseProfileById, getNurseProfileByUserId } from './nurseProfileService';
import { EmailService } from '../email/emailService';
import { useAuth } from '@/contexts/AuthContext';

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
  nurse_email?:string;
}

/**
 * Extended interface with job and nurse details
 */
export interface JobApplicationWithDetails extends JobApplication {
  job_postings?: {
    id: string;
    job_code: string;
    care_type: string;
    duration: string;
    preferred_time: string;
    benefits?: string;
    status: string;
    client_profiles?: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  nurse_profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url: string;
    phone_number: string;
    onboarding_completed: boolean;
  };

}

/**
 * Submit a job application
 * 
 * @param applicationData Application data to create
 * @returns Created application
 */
export async function submitApplication(applicationData: Omit<JobApplication, 'id' | 'status' | 'created_at' | 'updated_at' | 'nurse_email'>) {
  try {
  
    const emailService = new EmailService();
    // Check if the nurse has already applied for this job
    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id, status')
      .eq('nurse_id', applicationData.nurse_id)
      .eq('job_id', applicationData.job_id)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingApp?.id) {
      throw new Error('You have already applied for this job');
    }
    
    // Verify the job is still open
    const { data: job, error: jobError } = await supabase
      .from('job_postings')
      .select('status')
      .eq('id', applicationData.job_id)
      .single();
    
    if (jobError) {
      throw new Error('Job not found');
    }
    
    if (job.status !== 'open') {
      throw new Error('This job is no longer accepting applications');
    }
    
    // Submit new application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...applicationData,
        status: 'new' // Default status for all new applications
      })
      .select(`
        *,
        job_postings (
          id,
          job_code,
          care_type,
          duration,
          preferred_time,
          benefits,
          status,
          client_profiles (
            id,
            first_name,
            last_name
          )
        )
      `)
      .single();

      const { data: profile } = await getNurseProfileById(data.nurse_id);
 
      const nurseName = profile?.first_name + " " + profile?.last_name;
      const { data: { user },} = await supabase.auth.getUser()
       await emailService.sendNurseApplicationEmail(nurseName,data?.job_postings?.job_code,user?.email);

    if (error) throw error;
    
    // Create notification for client about new application
    if (data.job_postings?.client_profiles?.id) {
      // This would trigger a notification - implement based on your notification system
      console.log('New application notification should be sent to client');
    }
    
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
        job_postings (
          *,
          client_profiles (
            id,
            first_name,
            last_name
          )
        ),
        nurse_profiles!inner (
          id,
          first_name,
          last_name,
          profile_photo_url,
          phone_number,
          onboarding_completed
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
        nurse_profiles!inner (
          id,
          first_name,
          last_name,
          profile_photo_url,
          phone_number,
          onboarding_completed
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
        job_postings (
          *,
          client_profiles (
            id,
            first_name,
            last_name
          )
        )
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
 * @param notes Optional notes for status change
 * @returns Updated application
 */
export async function updateApplicationStatus(
  applicationId: string, 
  status: ApplicationStatus,
  notes?: string
) {
  try {
    // Get the application first to check current status and get job info
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings (
          id,
          status,
          client_id
        )
      `)
      .eq('id', applicationId)
      .single();
    
    if (appError) throw appError;
    
    // Special handling if status is 'hired'
    if (status === 'hired') {
      // Verify the job is still open
      if (application.job_postings.status !== 'open') {
        throw new Error('Cannot hire for a job that is not open');
      }
      
      // Update the job status to 'filled'
      const { error: jobError } = await supabase
        .from('job_postings')
        .update({ 
          status: 'filled',
          updated_at: new Date().toISOString()
        })
        .eq('id', application.job_postings.id);
      
      if (jobError) throw jobError;
      
      // Update all other applications for this job to 'declined'
      const { error: declineError } = await supabase
        .from('applications')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('job_id', application.job_postings.id)
        .neq('id', applicationId);
      
      if (declineError) throw declineError;
    }
    
    // Update the application status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select(`
        *,
        job_postings (
          *,
          client_profiles (
            id,
            first_name,
            last_name
          )
        ),
        nurse_profiles (
          id,
          first_name,
          last_name,
          profile_photo_url
        )
      `)
      .single();

    if (error) throw error;
    
    // Create notification for nurse about status change
    console.log(`Application status changed to ${status} - notification should be sent`);
    
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
        job_postings (
          *,
          client_profiles (
            id,
            first_name,
            last_name
          )
        ),
        nurse_profiles!inner (
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
    const { data, error } = await supabase
      .from('applications')
      .select('id, status')
      .eq('nurse_id', nurseId)
      .eq('job_id', jobId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return { 
      hasApplied: !!data, 
      applicationStatus: data?.status || null,
      error: null 
    };
  } catch (error) {
    console.error('Error checking if nurse has applied:', error);
    return { hasApplied: false, applicationStatus: null, error: error as PostgrestError };
  }
}

/**
 * Get application statistics for a nurse
 * 
 * @param nurseId Nurse ID
 * @returns Application statistics
 */
export async function getNurseApplicationStats(nurseId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status, created_at')
      .eq('nurse_id', nurseId);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { 
        stats: {
          total: 0,
          new: 0,
          shortlisted: 0,
          hired: 0,
          declined: 0,
          responseRate: 0,
          avgResponseTime: 0
        }, 
        error: null 
      };
    }
    
    // Count by status
    const statusCounts = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
    
    // Calculate response rate (non-new applications / total)
    const totalApps = data.length;
    const respondedApps = data.filter(app => app.status !== 'new').length;
    const responseRate = totalApps > 0 ? Math.round((respondedApps / totalApps) * 100) : 0;
    
    // Calculate average response time (mock for now)
    const avgResponseTime = Math.round(Math.random() * 48 + 12); // 12-60 hours
    
    return {
      stats: {
        total: totalApps,
        new: statusCounts.new || 0,
        shortlisted: statusCounts.shortlisted || 0,
        hired: statusCounts.hired || 0,
        declined: statusCounts.declined || 0,
        responseRate,
        avgResponseTime
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting nurse application stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Get application statistics for a client
 * 
 * @param clientId Client ID
 * @returns Application statistics
 */
export async function getClientApplicationStats(clientId: string) {
  try {
    // Get all applications for client's jobs
    const { data: jobsData, error: jobsError } = await supabase
      .from('job_postings')
      .select('id')
      .eq('client_id', clientId);
    
    if (jobsError) throw jobsError;
    
    if (!jobsData || jobsData.length === 0) {
      return { 
        stats: {
          totalApplications: 0,
          newApplications: 0,
          shortlistedApplications: 0,
          hiredApplications: 0,
          declinedApplications: 0,
          avgResponseTime: 0
        }, 
        error: null 
      };
    }
    
    const jobIds = jobsData.map(job => job.id);
    
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status, created_at, updated_at')
      .in('job_id', jobIds);

    if (error) throw error;
    
    if (!applications || applications.length === 0) {
      return { 
        stats: {
          totalApplications: 0,
          newApplications: 0,
          shortlistedApplications: 0,
          hiredApplications: 0,
          declinedApplications: 0,
          avgResponseTime: 0
        }, 
        error: null 
      };
    }
    
    // Count by status
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
    
    // Calculate average response time
    const respondedApps = applications.filter(app => 
      app.status !== 'new' && app.updated_at
    );
    
    let avgResponseTime = 0;
    if (respondedApps.length > 0) {
      const totalResponseTime = respondedApps.reduce((sum, app) => {
        const created = new Date(app.created_at);
        const updated = new Date(app.updated_at);
        const responseTime = (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        return sum + responseTime;
      }, 0);
      
      avgResponseTime = Math.round(totalResponseTime / respondedApps.length);
    }
    
    return {
      stats: {
        totalApplications: applications.length,
        newApplications: statusCounts.new || 0,
        shortlistedApplications: statusCounts.shortlisted || 0,
        hiredApplications: statusCounts.hired || 0,
        declinedApplications: statusCounts.declined || 0,
        avgResponseTime
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting client application stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Get application statistics for admin dashboard
 * 
 * @returns System-wide application statistics
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
    
    // Calculate conversion rate (hired / total)
    const totalApps = data.length;
    const hiredApps = statusCounts.hired || 0;
    const conversionRate = totalApps > 0 ? Math.round((hiredApps / totalApps) * 100) : 0;
    
    return {
      stats: {
        statusCounts,
        appsByMonth,
        totalApplications: totalApps,
        conversionRate
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting application stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}

/**
 * Bulk update application statuses (admin only)
 * 
 * @param applicationIds Array of application IDs
 * @param status New status
 * @returns Update result
 */
export async function bulkUpdateApplicationStatus(
  applicationIds: string[],
  status: ApplicationStatus
) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .in('id', applicationIds)
      .select('id, status');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error bulk updating application status:', error);
    return { data: null, error: error as PostgrestError };
  }
}