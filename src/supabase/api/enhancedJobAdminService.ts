// src/supabase/api/enhancedJobAdminService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Enhanced job posting interface for admin with all related data
 */
export interface AdminJobPosting {
  id: string;
  client_id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  benefits?: string;
  status: 'open' | 'filled' | 'expired';
  created_at: string;
  updated_at?: string;
  
  // Client information
  client_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    client_type: string;
    relationship_to_recipient?: string;
  };
  
  // Care details
  care_recipients?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    age: number;
  }>;
  
  care_needs?: {
    care_types: string[];
    care_schedule: string[];
    hours_per_week: number;
    special_skills: string[];
    health_conditions: string[];
    additional_notes?: string;
  };
  
  care_locations?: Array<{
    id: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    home_environment: string;
  }>;
  
  // Application data
  applications: Array<{
    id: string;
    status: string;
    cover_message?: string;
    created_at: string;
    nurse_profiles: {
      id: string;
      first_name: string;
      last_name: string;
      profile_photo_url?: string;
      phone_number: string;
      city: string;
      state: string;
      onboarding_completed: boolean;
    };
    nurse_qualifications?: {
      specializations: string[];
      years_experience: number;
      education_level: string;
    };
  }>;
  
  // Contract information if job is filled
  contract?: {
    id: string;
    status: string;
    terms: string;
    created_at: string;
    nurse_id: string;
  };
}

/**
 * Job statistics interface
 */
export interface JobStatistics {
  totalJobs: number;
  jobsPostedToday: number;
  activeJobs: number;
  filledJobs: number;
  expiredJobs: number;
  totalApplications: number;
  averageApplicationsPerJob: number;
  fillRate: number;
  averageTimeToFill: number; // in hours
  topCareTypes: Array<{
    care_type: string;
    count: number;
    fillRate: number;
  }>;
  jobsByStatus: {
    open: number;
    filled: number;
    expired: number;
  };
  recentActivity: Array<{
    job_id: string;
    job_code: string;
    action: string;
    timestamp: string;
    client_name: string;
  }>;
}

/**
 * Get comprehensive job statistics
 */
export async function getJobStatistics(): Promise<{ data: JobStatistics | null; error: PostgrestError | null }> {
  try {
    // Get all job postings with basic info
    const { data: jobs, error: jobsError } = await supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles(first_name, last_name),
        applications(id, status, created_at)
      `);

    if (jobsError) throw jobsError;

    if (!jobs || jobs.length === 0) {
      return {
        data: {
          totalJobs: 0,
          jobsPostedToday: 0,
          activeJobs: 0,
          filledJobs: 0,
          expiredJobs: 0,
          totalApplications: 0,
          averageApplicationsPerJob: 0,
          fillRate: 0,
          averageTimeToFill: 0,
          topCareTypes: [],
          jobsByStatus: { open: 0, filled: 0, expired: 0 },
          recentActivity: []
        },
        error: null
      };
    }

    const totalJobs = jobs.length;
    
    // Calculate today's jobs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jobsPostedToday = jobs.filter(job => {
      const jobDate = new Date(job.created_at);
      jobDate.setHours(0, 0, 0, 0);
      return jobDate.getTime() === today.getTime();
    }).length;

    // Count by status
    const activeJobs = jobs.filter(job => job.status === 'open').length;
    const filledJobs = jobs.filter(job => job.status === 'filled').length;
    const expiredJobs = jobs.filter(job => job.status === 'expired').length;

    // Application statistics
    const allApplications = jobs.flatMap(job => job.applications || []);
    const totalApplications = allApplications.length;
    const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;

    // Fill rate
    const fillRate = totalJobs > 0 ? (filledJobs / totalJobs) * 100 : 0;

    // Calculate average time to fill for filled jobs
    const filledJobsData = jobs.filter(job => job.status === 'filled');
    let averageTimeToFill = 0;
    if (filledJobsData.length > 0) {
      const totalFillTime = filledJobsData.reduce((sum, job) => {
        const created = new Date(job.created_at);
        const updated = new Date(job.updated_at || job.created_at);
        return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }, 0);
      averageTimeToFill = totalFillTime / filledJobsData.length;
    }

    // Top care types analysis
    const careTypeCounts = jobs.reduce((acc, job) => {
      const type = job.care_type;
      if (!acc[type]) {
        acc[type] = { total: 0, filled: 0 };
      }
      acc[type].total++;
      if (job.status === 'filled') {
        acc[type].filled++;
      }
      return acc;
    }, {} as Record<string, { total: number; filled: number }>);

    const topCareTypes = Object.entries(careTypeCounts)
      .map(([care_type, data]) => ({
        care_type,
        count: data.total,
        fillRate: data.total > 0 ? (data.filled / data.total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity (last 10 jobs)
    const recentActivity = jobs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(job => ({
        job_id: job.id,
        job_code: job.job_code,
        action: job.status === 'open' ? 'Posted' : job.status === 'filled' ? 'Filled' : 'Expired',
        timestamp: job.updated_at || job.created_at,
        client_name: `${job.client_profiles?.first_name || ''} ${job.client_profiles?.last_name || ''}`.trim()
      }));

    const statistics: JobStatistics = {
      totalJobs,
      jobsPostedToday,
      activeJobs,
      filledJobs,
      expiredJobs,
      totalApplications,
      averageApplicationsPerJob: Math.round(averageApplicationsPerJob * 10) / 10,
      fillRate: Math.round(fillRate * 10) / 10,
      averageTimeToFill: Math.round(averageTimeToFill * 10) / 10,
      topCareTypes,
      jobsByStatus: {
        open: activeJobs,
        filled: filledJobs,
        expired: expiredJobs
      },
      recentActivity
    };

    return { data: statistics, error: null };
  } catch (error) {
    console.error('Error getting job statistics:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get detailed job postings for admin with all related data
 */
export async function getDetailedJobPostings(
  status?: 'open' | 'filled' | 'expired',
  limit: number = 20,
  offset: number = 0,
  searchTerm?: string
): Promise<{ data: AdminJobPosting[] | null; count: number | null; error: PostgrestError | null }> {
  try {
    // Build the query
    let query = supabase
      .from('job_postings')
      .select(`
        *,
        client_profiles!inner(
          id,
          first_name,
          last_name,
          phone_number,
          client_type,
          relationship_to_recipient
        )
      `, { count: 'exact' });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply search filter
    if (searchTerm) {
      query = query.or(`
        job_code.ilike.%${searchTerm}%,
        care_type.ilike.%${searchTerm}%,
        client_profiles.first_name.ilike.%${searchTerm}%,
        client_profiles.last_name.ilike.%${searchTerm}%
      `);
    }

    const { data: jobs, error: jobsError, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (jobsError) throw jobsError;

    if (!jobs || jobs.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Get additional data for each job
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        // Get care recipients
        const { data: careRecipients } = await supabase
          .from('care_recipients')
          .select('*')
          .eq('client_id', job.client_id);

        // Get care needs
        const { data: careNeeds } = await supabase
          .from('care_needs')
          .select('*')
          .eq('client_id', job.client_id)
          .single();

        // Get care locations
        const { data: careLocations } = await supabase
          .from('care_locations')
          .select('*')
          .eq('client_id', job.client_id);

        // Get applications with nurse details
        const { data: applications } = await supabase
          .from('applications')
          .select(`
            *,
            nurse_profiles!inner(
              id,
              first_name,
              last_name,
              profile_photo_url,
              phone_number,
              city,
              state,
              onboarding_completed
            )
          `)
          .eq('job_id', job.id)
          .order('created_at', { ascending: false });

        // Get nurse qualifications for each application
        const applicationsWithQualifications = await Promise.all(
          (applications || []).map(async (app) => {
            const { data: qualifications } = await supabase
              .from('nurse_qualifications')
              .select('specializations, years_experience, education_level')
              .eq('nurse_id', app.nurse_profiles.id)
              .single();

            return {
              ...app,
              nurse_qualifications: qualifications
            };
          })
        );

        // Get contract if job is filled
        let contract = null;
        if (job.status === 'filled') {
          const { data: contractData } = await supabase
            .from('contracts')
            .select('*')
            .eq('job_id', job.id)
            .single();
          contract = contractData;
        }

        return {
          ...job,
          care_recipients: careRecipients || [],
          care_needs: careNeeds,
          care_locations: careLocations || [],
          applications: applicationsWithQualifications || [],
          contract
        } as AdminJobPosting;
      })
    );

    return { data: enrichedJobs, count, error: null };
  } catch (error) {
    console.error('Error getting detailed job postings:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get detailed job posting by ID
 */
export async function getDetailedJobById(jobId: string): Promise<{ data: AdminJobPosting | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await getDetailedJobPostings(undefined, 1, 0);
    if (error) throw error;
    
    const job = data?.find(j => j.id === jobId);
    return { data: job || null, error: null };
  } catch (error) {
    console.error('Error getting detailed job by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Generate job posting export data for PDF/copy functionality
 */
export function generateJobExportData(job: AdminJobPosting) {
  const clientName = `${job.client_profiles.first_name} ${job.client_profiles.last_name}`;
  const careRecipientNames = job.care_recipients?.map(r => `${r.first_name} ${r.last_name} (Age: ${r.age})`).join(', ') || 'Not specified';
  const careLocation = job.care_locations?.[0];
  const locationString = careLocation 
    ? `${careLocation.street_address}, ${careLocation.city}, ${careLocation.state} ${careLocation.zip_code}`
    : 'Location not specified';

  const exportData = {
    // Job Details
    jobCode: job.job_code,
    status: job.status.toUpperCase(),
    careType: job.care_type,
    duration: job.duration,
    preferredTime: job.preferred_time,
    benefits: job.benefits || 'None specified',
    datePosted: new Date(job.created_at).toLocaleDateString(),
    lastUpdated: job.updated_at ? new Date(job.updated_at).toLocaleDateString() : 'N/A',

    // Client Information
    clientName,
    clientType: job.client_profiles.client_type,
    clientPhone: job.client_profiles.phone_number,
    relationshipToRecipient: job.client_profiles.relationship_to_recipient || 'N/A',

    // Care Details
    careRecipients: careRecipientNames,
    location: locationString,
    homeEnvironment: careLocation?.home_environment || 'Not specified',
    
    // Care Requirements
    careTypes: job.care_needs?.care_types.join(', ') || 'Not specified',
    careSchedule: job.care_needs?.care_schedule.join(', ') || 'Not specified',
    hoursPerWeek: job.care_needs?.hours_per_week?.toString() || 'Not specified',
    specialSkills: job.care_needs?.special_skills.join(', ') || 'None',
    healthConditions: job.care_needs?.health_conditions.join(', ') || 'None specified',
    additionalNotes: job.care_needs?.additional_notes || 'None',

    // Applications
    totalApplications: job.applications.length,
    applications: job.applications.map(app => ({
      nurseName: `${app.nurse_profiles.first_name} ${app.nurse_profiles.last_name}`,
      status: app.status,
      location: `${app.nurse_profiles.city}, ${app.nurse_profiles.state}`,
      experience: app.nurse_qualifications?.years_experience || 0,
      specializations: app.nurse_qualifications?.specializations.join(', ') || 'None listed',
      appliedDate: new Date(app.created_at).toLocaleDateString(),
      coverMessage: app.cover_message || 'No cover message',
      phone: app.nurse_profiles.phone_number,
      onboardingComplete: app.nurse_profiles.onboarding_completed ? 'Yes' : 'No'
    })),

    // Contract Information (if filled)
    contract: job.contract ? {
      contractId: job.contract.id,
      status: job.contract.status,
      createdDate: new Date(job.contract.created_at).toLocaleDateString(),
      terms: job.contract.terms
    } : null
  };

  return exportData;
}

/**
 * Generate formatted text for copying to clipboard
 */
export function generateJobCopyText(job: AdminJobPosting): string {
  const exportData = generateJobExportData(job);
  
  return `
JOB POSTING DETAILS
===================

Job Information:
- Job Code: ${exportData.jobCode}
- Status: ${exportData.status}
- Care Type: ${exportData.careType}
- Duration: ${exportData.duration}
- Preferred Time: ${exportData.preferredTime}
- Benefits: ${exportData.benefits}
- Date Posted: ${exportData.datePosted}
- Last Updated: ${exportData.lastUpdated}

Client Information:
- Name: ${exportData.clientName}
- Type: ${exportData.clientType}
- Phone: ${exportData.clientPhone}
- Relationship to Recipient: ${exportData.relationshipToRecipient}

Care Details:
- Recipients: ${exportData.careRecipients}
- Location: ${exportData.location}
- Home Environment: ${exportData.homeEnvironment}

Care Requirements:
- Care Types: ${exportData.careTypes}
- Schedule: ${exportData.careSchedule}
- Hours per Week: ${exportData.hoursPerWeek}
- Special Skills Required: ${exportData.specialSkills}
- Health Conditions: ${exportData.healthConditions}
- Additional Notes: ${exportData.additionalNotes}

Applications (${exportData.totalApplications} total):
${exportData.applications.map((app, index) => `
${index + 1}. ${app.nurseName}
   - Status: ${app.status}
   - Location: ${app.location}
   - Experience: ${app.experience} years
   - Specializations: ${app.specializations}
   - Applied: ${app.appliedDate}
   - Phone: ${app.phone}
   - Onboarding Complete: ${app.onboardingComplete}
   - Cover Message: ${app.coverMessage}
`).join('')}

${exportData.contract ? `
Contract Information:
- Contract ID: ${exportData.contract.contractId}
- Status: ${exportData.contract.status}
- Created: ${exportData.contract.createdDate}
` : 'No contract created yet.'}

Generated on: ${new Date().toLocaleString()}
Platform: Nurse Nest Admin Portal
`.trim();
}