// src/supabase/api/checkrService.ts
// Updated to use Supabase Edge Function instead of direct Checkr API calls
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Configuration - API key moved to Edge Function
const CHECKR_PACKAGE = "test_pro_criminal_and_mvr";

// Types
export interface BackgroundCheckCandidate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zipcode: string;
  dob: string; // YYYY-MM-DD format
  ssn: string; // Will be handled securely, not stored
  driver_license_number?: string;
  driver_license_state?: string;
  no_middle_name: boolean;
}

export interface BackgroundCheckResult {
  id: string;
  nurse_id: string;
  client_id: string;
  job_posting_id?: string;
  checkr_candidate_id?: string;
  checkr_report_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  result?: 'clear' | 'consider' | 'suspended';
  adjudication?: 'clear' | 'consider' | 'suspended';
  initiated_at: string;
  completed_at?: string;
  expires_at?: string;
  package_used: string;
  raw_response?: Record<string, any>;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BackgroundCheckResultSummary {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  clientStatus: 'pending' | 'passed' | 'failed';
  message: string;
  statusColor: string;
  statusIcon: string;
  initiated_at: string;
  completed_at?: string;
  expires_at?: string;
}

/**
 * Database background check row type
 */
interface DatabaseBackgroundCheck {
  id: string;
  nurse_id: string;
  client_id: string;
  job_posting_id?: string;
  checkr_candidate_id?: string;
  checkr_report_id?: string;
  status: string;
  result?: string;
  adjudication?: string;
  initiated_at: string;
  completed_at?: string;
  expires_at?: string;
  package_used: string;
  raw_response?: any;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Transform database row to typed BackgroundCheckResult
 */
function transformDatabaseBackgroundCheck(dbCheck: DatabaseBackgroundCheck): BackgroundCheckResult {
  return {
    ...dbCheck,
    status: (dbCheck.status as BackgroundCheckResult['status']) || 'pending',
    result: dbCheck.result as BackgroundCheckResult['result'],
    adjudication: dbCheck.adjudication as BackgroundCheckResult['adjudication'],
    raw_response: dbCheck.raw_response as Record<string, any>
  };
}

/**
 * Helper to resolve client profile ID from user ID
 */
async function resolveClientProfileId(clientIdentifier: string): Promise<string> {
  // First try to get by profile ID
  const { data: directProfile, error: directError } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('id', clientIdentifier)
    .maybeSingle();

  if (directProfile) {
    return directProfile.id;
  }

  // If not found, try by user_id
  const { data: userProfile, error: userError } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('user_id', clientIdentifier)
    .maybeSingle();

  if (userProfile) {
    return userProfile.id;
  }

  throw new Error(`Client profile not found for identifier: ${clientIdentifier}`);
}

/**
 * Helper to resolve nurse profile ID from user ID
 */
async function resolveNurseProfileId(nurseIdentifier: string): Promise<string> {
  // First try to get by profile ID
  const { data: directProfile, error: directError } = await supabase
    .from('nurse_profiles')
    .select('id')
    .eq('id', nurseIdentifier)
    .maybeSingle();

  if (directProfile) {
    return directProfile.id;
  }

  // If not found, try by user_id
  const { data: userProfile, error: userError } = await supabase
    .from('nurse_profiles')
    .select('id')
    .eq('user_id', nurseIdentifier)
    .maybeSingle();

  if (userProfile) {
    return userProfile.id;
  }

  throw new Error(`Nurse profile not found for identifier: ${nurseIdentifier}`);
}

/**
 * Debug helper to log current user info
 */
async function debugCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('🔍 Debug - Current user:', user?.id);
    
    if (user) {
      // Check what type of profile this user has
      const { data: nurseProfile } = await supabase
        .from('nurse_profiles')
        .select('id, first_name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();
        
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('id, first_name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();
        
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id, first_name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();
        
      console.log('🔍 Debug - User profiles:', {
        nurse: nurseProfile,
        client: clientProfile,
        admin: adminProfile
      });
    }
  } catch (error) {
    console.error('🔍 Debug - Error getting user info:', error);
  }
}

/**
 * UPDATED: Call Checkr API via Edge Function with better error handling
 */
async function callCheckrAPI(action: string, backgroundCheckId: string, candidateData: any) {
  try {
    console.log(`🔍 Debug - Calling Checkr API via Edge Function: ${action}`);
    console.log(`🔍 Debug - Request payload:`, { action, backgroundCheckId, candidateData });

    // Get the current session token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('🔍 Debug - Session error:', sessionError);
      throw new Error('No valid session found');
    }

    console.log('🔍 Debug - Session found, user:', session.user.id);

    const { data, error } = await supabase.functions.invoke('checkr-service', {
      body: {
        action,
        backgroundCheckId,
        candidateData
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    // Enhanced error logging
    if (error) {
      console.error('🔍 Debug - Edge function error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        context: error.context,
        details: error.details,
        fullError: error
      });
      
      // Try to get more details from the error
      let errorMessage = error.message || 'Edge function error';
      if (error.context?.response) {
        try {
          const responseText = await error.context.response.text();
          console.error('🔍 Debug - Edge function response body:', responseText);
          errorMessage = `Edge Function Error: ${responseText}`;
        } catch (e) {
          console.error('🔍 Debug - Could not read error response body');
        }
      }
      
      throw new Error(errorMessage);
    }

    console.log('🔍 Debug - Edge function response:', data);

    if (!data || !data.success) {
      console.error('🔍 Debug - API call failed with response:', data);
      throw new Error(data?.error || 'API call failed');
    }

    console.log(`✅ Debug - ${action} completed successfully`);
    return data.data;

  } catch (error: any) {
    console.error(`🔍 Debug - Error in ${action}:`, error);
    throw error;
  }
}

/**
 * UPDATED: Create a Checkr candidate via Edge Function
 */
async function createCheckrCandidate(candidateData: BackgroundCheckCandidate, backgroundCheckId: string) {
  try {
    console.log('🔍 Debug - Creating Checkr candidate via Edge Function');

    const result = await callCheckrAPI('createCandidate', backgroundCheckId, candidateData);

    console.log('✅ Debug - Checkr candidate created successfully');
    return { data: result.candidate, error: null };

  } catch (error: any) {
    console.error('🔍 Debug - Error creating Checkr candidate:', error);
    return { data: null, error };
  }
}

/**
 * UPDATED: Create a background check report via Edge Function
 */
async function createCheckrReport(candidateId: string, backgroundCheckId: string) {
  try {
    console.log('🔍 Debug - Creating Checkr report via Edge Function');

    const result = await callCheckrAPI('createReport', backgroundCheckId, {
      candidateId,
      package: CHECKR_PACKAGE
    });

    console.log('✅ Debug - Checkr report created successfully');
    return { data: result.report, error: null };

  } catch (error: any) {
    console.error('🔍 Debug - Error creating Checkr report:', error);
    return { data: null, error };
  }
}

/**
 * UPDATED: Get report status from Checkr via Edge Function
 */
async function getCheckrReportStatus(reportId: string, backgroundCheckId: string) {
  try {
    console.log('🔍 Debug - Getting Checkr report status via Edge Function');

    const result = await callCheckrAPI('getReport', backgroundCheckId, { reportId });

    console.log('✅ Debug - Checkr report status retrieved successfully');
    return { data: result.report, error: null };

  } catch (error: any) {
    console.error('🔍 Debug - Error getting Checkr report status:', error);
    return { data: null, error };
  }
}

/**
 * FIXED: Client-initiated background check
 */
export async function initiateClientBackgroundCheck(
  nurseIdentifier: string,
  clientIdentifier: string,
  jobPostingId?: string
): Promise<{ data: BackgroundCheckResult | null; error: Error | null }> {
  try {
    console.log('🔍 Debug - Starting background check initiation');
    console.log('🔍 Debug - Parameters:', { nurseIdentifier, clientIdentifier, jobPostingId });
    
    // Debug current user
    await debugCurrentUser();
    
    // Resolve the actual profile IDs
    const actualNurseId = await resolveNurseProfileId(nurseIdentifier);
    const actualClientId = await resolveClientProfileId(clientIdentifier);
    
    console.log('🔍 Debug - Resolved IDs:', { actualNurseId, actualClientId });
    
    // Verify the nurse exists and get details
    const { data: nurse, error: nurseError } = await supabase
      .from('nurse_profiles')
      .select('id, first_name, last_name, user_id')
      .eq('id', actualNurseId)
      .single();
      
    if (nurseError || !nurse) {
      console.error('🔍 Debug - Nurse lookup error:', nurseError);
      throw new Error(`Nurse not found: ${nurseError?.message || 'No data returned'}`);
    }
    
    console.log('🔍 Debug - Nurse found:', nurse);
    
    // Verify the client exists and get details
    const { data: client, error: clientError } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name, user_id')
      .eq('id', actualClientId)
      .single();
      
    if (clientError || !client) {
      console.error('🔍 Debug - Client lookup error:', clientError);
      throw new Error(`Client not found: ${clientError?.message || 'No data returned'}`);
    }
    
    console.log('🔍 Debug - Client found:', client);
    
    // Check current user authorization
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Authorization check: user must be the client or an admin
    if (user.id !== client.user_id) {
      // Check if user is admin
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!adminProfile) {
        throw new Error('Unauthorized: You can only create background checks for your own account');
      }
    }
    
    console.log('🔍 Debug - Authorization check passed');
    
    // Check for existing background check
    const { data: existingCheck } = await supabase
      .from('background_checks')
      .select('*')
      .eq('nurse_id', actualNurseId)
      .eq('client_id', actualClientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (existingCheck && existingCheck.status !== 'failed' && existingCheck.status !== 'cancelled') {
      console.log('🔍 Debug - Existing background check found:', existingCheck);
      return { data: transformDatabaseBackgroundCheck(existingCheck), error: null };
    }
    
    // Create the background check record
    const insertData = {
      nurse_id: actualNurseId,
      client_id: actualClientId,
      job_posting_id: jobPostingId || null,
      status: 'pending',
      package_used: CHECKR_PACKAGE,
      initiated_at: new Date().toISOString(),
      admin_notes: 'Waiting for nurse to provide required information'
    };
    
    console.log('🔍 Debug - Inserting background check with data:', insertData);
    
    const { data: backgroundCheck, error: dbError } = await supabase
      .from('background_checks')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('🔍 Debug - Database insert error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('🔍 Debug - Background check created successfully:', backgroundCheck);

    const transformedCheck = transformDatabaseBackgroundCheck(backgroundCheck as DatabaseBackgroundCheck);
    return { data: transformedCheck, error: null };

  } catch (error) {
    console.error('🔍 Debug - Error in initiateClientBackgroundCheck:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * FIXED: Get background check for a specific client-nurse pair
 */
export async function getClientNurseBackgroundCheck(
  nurseIdentifier: string, 
  clientIdentifier: string
): Promise<{ data: BackgroundCheckResult | null; error: PostgrestError | null }> {
  try {
    console.log('🔍 Debug - Getting background check for:', { nurseIdentifier, clientIdentifier });
    
    // Resolve the actual profile IDs
    const actualNurseId = await resolveNurseProfileId(nurseIdentifier);
    const actualClientId = await resolveClientProfileId(clientIdentifier);
    
    console.log('🔍 Debug - Resolved IDs for lookup:', { actualNurseId, actualClientId });
    
    const { data, error } = await supabase
      .from('background_checks')
      .select('*')
      .eq('nurse_id', actualNurseId)
      .eq('client_id', actualClientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('🔍 Debug - Error getting background check:', error);
      throw error;
    }
    
    console.log('🔍 Debug - Background check found:', data);
    
    const transformedData = data ? transformDatabaseBackgroundCheck(data as DatabaseBackgroundCheck) : null;
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('🔍 Debug - Error in getClientNurseBackgroundCheck:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * UPDATED: Complete background check with candidate data (called when nurse provides info)
 */
export async function completeBackgroundCheckWithCandidateData(
  backgroundCheckId: string,
  candidateData: BackgroundCheckCandidate
): Promise<{ data: BackgroundCheckResult | null; error: Error | null }> {
  try {
    console.log('🔍 Debug - Completing background check with candidate data:', backgroundCheckId);

    // Validate required candidate data
    if (!candidateData.first_name || !candidateData.last_name || !candidateData.email || 
        !candidateData.phone || !candidateData.zipcode || !candidateData.dob || !candidateData.ssn) {
      throw new Error('Missing required candidate information for background check');
    }

    // Get existing background check
    const { data: existingCheck, error: fetchError } = await supabase
      .from('background_checks')
      .select('*')
      .eq('id', backgroundCheckId)
      .single();

    if (fetchError || !existingCheck) {
      throw new Error('Background check not found');
    }

    try {
      // Create Checkr candidate via Edge Function
      const { data: candidate, error: candidateError } = await createCheckrCandidate(candidateData, backgroundCheckId);
      
      if (candidateError || !candidate) {
        throw new Error(candidateError?.message || 'Failed to create Checkr candidate');
      }

      // Create background check report via Edge Function
      const { data: report, error: reportError } = await createCheckrReport(candidate.id, backgroundCheckId);
      
      if (reportError || !report) {
        throw new Error(reportError?.message || 'Failed to create background check report');
      }

      // Update background check record with Checkr IDs
      const { data: updatedCheck, error: updateError } = await supabase
        .from('background_checks')
        .update({
          checkr_candidate_id: candidate.id,
          checkr_report_id: report.id,
          status: 'processing',
          admin_notes: 'Background check submitted to Checkr',
          raw_response: {
            candidate: candidate,
            report: report
          }
        })
        .eq('id', backgroundCheckId)
        .select()
        .single();

      if (updateError) throw updateError;

      const transformedCheck = transformDatabaseBackgroundCheck(updatedCheck as DatabaseBackgroundCheck);
      return { data: transformedCheck, error: null };

    } catch (checkrError) {
      // If Checkr API fails, update the background check record to failed
      await supabase
        .from('background_checks')
        .update({
          status: 'failed',
          admin_notes: `Checkr API error: ${(checkrError as Error).message}`
        })
        .eq('id', backgroundCheckId);

      throw checkrError;
    }

  } catch (error) {
    console.error('🔍 Debug - Error completing background check:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * UPDATED: Check and update background check status
 */
export async function updateBackgroundCheckStatus(backgroundCheckId: string): Promise<{ data: BackgroundCheckResult | null; error: Error | null }> {
  try {
    // Get the background check record
    const { data: backgroundCheck, error: fetchError } = await supabase
      .from('background_checks')
      .select('*')
      .eq('id', backgroundCheckId)
      .single();

    if (fetchError || !backgroundCheck) {
      throw new Error('Background check not found');
    }

    if (!backgroundCheck.checkr_report_id || backgroundCheck.status === 'completed') {
      const transformedCheck = transformDatabaseBackgroundCheck(backgroundCheck as DatabaseBackgroundCheck);
      return { data: transformedCheck, error: null };
    }

    // Get latest status from Checkr via Edge Function
    const { data: reportStatus, error: statusError } = await getCheckrReportStatus(backgroundCheck.checkr_report_id, backgroundCheckId);
    
    if (statusError || !reportStatus) {
      throw new Error(statusError?.message || 'Failed to get report status');
    }

    // Check if status has changed
    const isCompleted = reportStatus.status === 'complete';
    const newResult = reportStatus.result;
    const newAdjudication = reportStatus.adjudication;

    if (isCompleted && backgroundCheck.status !== 'completed') {
      // Update with completed status
      const { data: updatedCheck, error: updateError } = await supabase
        .from('background_checks')
        .update({
          status: 'completed',
          result: newResult,
          adjudication: newAdjudication,
          completed_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          raw_response: reportStatus,
          admin_notes: `Background check completed with result: ${newResult}`
        })
        .eq('id', backgroundCheckId)
        .select()
        .single();

      if (updateError) throw updateError;

      const transformedCheck = transformDatabaseBackgroundCheck(updatedCheck as DatabaseBackgroundCheck);
      return { data: transformedCheck, error: null };
    }

    const transformedCheck = transformDatabaseBackgroundCheck(backgroundCheck as DatabaseBackgroundCheck);
    return { data: transformedCheck, error: null };

  } catch (error) {
    console.error('🔍 Debug - Error updating background check status:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get display information for background check status
 */
export function getBackgroundCheckStatusDisplay(result?: string, adjudication?: string) {
  if (!result) {
    return {
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳',
      text: 'Pending'
    };
  }

  const isPassed = result === 'clear' || (result === 'consider' && adjudication === 'clear');
  
  if (isPassed) {
    return {
      color: 'bg-green-100 text-green-800',
      icon: '✅',
      text: 'Passed'
    };
  } else {
    return {
      color: 'bg-red-100 text-red-800',
      icon: '❌',
      text: 'Review Required'
    };
  }
}

/**
 * Get client-facing background check result
 */
export function getClientBackgroundCheckResult(result?: string, adjudication?: string) {
  if (!result) {
    return {
      status: 'pending',
      message: 'Background check in progress'
    };
  }

  const isPassed = result === 'clear' || (result === 'consider' && adjudication === 'clear');
  
  return {
    status: isPassed ? 'passed' : 'failed',
    message: isPassed ? 'Background check passed' : 'Background check requires further review'
  };
}

/**
 * Get background check result summary (comprehensive status)
 */
export function getBackgroundCheckResultSummary(backgroundCheck: BackgroundCheckResult | null): BackgroundCheckResultSummary {
  if (!backgroundCheck) {
    return {
      status: 'pending',
      clientStatus: 'pending',
      message: 'No background check initiated',
      statusColor: 'bg-gray-100 text-gray-800',
      statusIcon: '❓',
      initiated_at: '',
    };
  }

  const clientResult = getClientBackgroundCheckResult(backgroundCheck.result, backgroundCheck.adjudication);
  const statusDisplay = getBackgroundCheckStatusDisplay(backgroundCheck.result, backgroundCheck.adjudication);

  return {
    status: backgroundCheck.status,
    clientStatus: clientResult.status as 'pending' | 'passed' | 'failed',
    message: clientResult.message,
    statusColor: statusDisplay.color,
    statusIcon: statusDisplay.icon,
    initiated_at: backgroundCheck.initiated_at,
    completed_at: backgroundCheck.completed_at,
    expires_at: backgroundCheck.expires_at,
  };
}

/**
 * Check if nurse has valid background check for specific client
 */
export async function nurseHasValidBackgroundCheckForClient(
  nurseIdentifier: string, 
  clientIdentifier: string
): Promise<boolean> {
  try {
    const { data: backgroundCheck } = await getClientNurseBackgroundCheck(nurseIdentifier, clientIdentifier);
    
    if (!backgroundCheck || backgroundCheck.status !== 'completed') {
      return false;
    }

    // Check if expired
    if (backgroundCheck.expires_at) {
      const expiryDate = new Date(backgroundCheck.expires_at);
      const now = new Date();
      if (expiryDate < now) {
        return false;
      }
    }

    // Check if passed
    const result = getClientBackgroundCheckResult(backgroundCheck.result, backgroundCheck.adjudication);
    return result.status === 'passed';
  } catch (error) {
    console.error('🔍 Debug - Error checking nurse background check validity:', error);
    return false;
  }
}

/**
 * Get all background checks for admin view
 */
export async function getAllBackgroundChecks(): Promise<{ data: BackgroundCheckResult[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('background_checks')
      .select(`
        *,
        nurse_profiles:nurse_id (first_name, last_name),
        client_profiles:client_id (first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transformedData = data?.map(check => transformDatabaseBackgroundCheck(check as DatabaseBackgroundCheck)) || [];
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('🔍 Debug - Error getting all background checks:', error);
    return { data: [], error: error as Error };
  }
}

/**
 * Update admin notes for a background check
 */
export async function updateBackgroundCheckAdminNotes(
  backgroundCheckId: string,
  adminNotes: string
): Promise<{ data: BackgroundCheckResult | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('background_checks')
      .update({
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', backgroundCheckId)
      .select()
      .single();

    if (error) throw error;

    const transformedData = transformDatabaseBackgroundCheck(data as DatabaseBackgroundCheck);
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('🔍 Debug - Error updating admin notes:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get pending background checks for a specific nurse
 */
export async function getNursePendingBackgroundChecks(
  nurseIdentifier: string
): Promise<{ data: BackgroundCheckResult[]; error: Error | null }> {
  try {
    console.log('🔍 Debug - Getting pending background checks for nurse:', nurseIdentifier);

    // Get current user to verify authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Determine if nurseIdentifier is user_id or nurse_profile_id
    let nurseUserId = nurseIdentifier;
    
    // If it looks like a nurse profile ID, get the user_id
    const { data: nurseProfile } = await supabase
      .from('nurse_profiles')
      .select('user_id')
      .eq('id', nurseIdentifier)
      .maybeSingle();
    
    if (nurseProfile) {
      nurseUserId = nurseProfile.user_id;
    }

    // Authorization check: user must be the nurse, client who initiated, or admin
    if (user.id !== nurseUserId) {
      // Check if user is admin
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!adminProfile) {
        // Check if user is a client who has pending background checks with this nurse
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!clientProfile) {
          throw new Error('Unauthorized: You can only view your own background checks');
        }
      }
    }

    // Get nurse profile ID from user ID
    const { data: nurse, error: nurseError } = await supabase
      .from('nurse_profiles')
      .select('id')
      .eq('user_id', nurseUserId)
      .maybeSingle();

    if (nurseError || !nurse) {
      console.error('🔍 Debug - Nurse not found:', nurseError);
      return { data: [], error: null };
    }

    // Get pending background checks for this nurse
    const { data: backgroundChecks, error: fetchError } = await supabase
      .from('background_checks')
      .select(`
        *,
        client_profiles:client_id (
          id,
          first_name,
          last_name,
          client_type,
          user_id
        ),
        job_postings:job_posting_id (
          id,
          job_code,
          care_type,
          status
        )
      `)
      .eq('nurse_id', nurse.id)
      .in('status', ['pending', 'processing'])
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('🔍 Debug - Error fetching background checks:', fetchError);
      throw fetchError;
    }

    console.log('🔍 Debug - Found background checks:', backgroundChecks?.length || 0);

    // Transform the data
    const transformedData = backgroundChecks?.map(transformDatabaseBackgroundCheck).filter(Boolean) || [];
    
    return { data: transformedData, error: null };

  } catch (error) {
    console.error('🔍 Debug - Error in getNursePendingBackgroundChecks:', error);
    return { data: [], error: error as Error };
  }
}

/**
 * COMPREHENSIVE TEST: Debug Edge Function issues
 */
export async function debugEdgeFunction(): Promise<void> {
  console.log('🔍 Starting comprehensive Edge Function debugging...');
  
  try {
    // 1. Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ Authentication failed:', sessionError);
      return;
    }
    
    console.log('✅ Authentication successful, user:', session.user.id);
    
    // 2. Test basic Edge Function connectivity
    console.log('🔍 Testing basic Edge Function connectivity...');
    
    try {
      const response = await fetch('https://hjgspbyckknhoetrifko.supabase.co/functions/v1/checkr-service', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          backgroundCheckId: 'test-id',
          candidateData: { test: true }
        })
      });
      
      console.log('🔍 Raw response status:', response.status);
      console.log('🔍 Raw response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('🔍 Raw response body:', responseText);
      
      if (!response.ok) {
        console.error('❌ Edge Function returned error status:', response.status);
        console.error('❌ Error response:', responseText);
      } else {
        console.log('✅ Edge Function responded successfully');
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log('✅ Parsed JSON response:', jsonResponse);
        } catch (e) {
          console.warn('⚠️ Response is not valid JSON');
        }
      }
      
    } catch (fetchError) {
      console.error('❌ Raw fetch failed:', fetchError);
    }
    
    // 3. Test using Supabase client
    console.log('🔍 Testing via Supabase client...');
    
    try {
      const { data, error } = await supabase.functions.invoke('checkr-service', {
        body: {
          action: 'test',
          backgroundCheckId: 'test-id',
          candidateData: { test: true }
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('❌ Supabase client error:', error);
      } else {
        console.log('✅ Supabase client success:', data);
      }
      
    } catch (clientError) {
      console.error('❌ Supabase client exception:', clientError);
    }
    
  } catch (error) {
    console.error('❌ Debug function failed:', error);
  }
}

/**
 * TEST FUNCTION: Test Edge Function connectivity
 */
export async function testCheckrEdgeFunction(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 Testing Checkr Edge Function connectivity...');

    // Get the current session token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('No valid session found');
    }

    const { data, error } = await supabase.functions.invoke('checkr-service', {
      body: {
        action: 'test',
        backgroundCheckId: 'test-id',
        candidateData: { test: true }
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('🔍 Edge Function test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Edge Function test response:', data);
    return { success: true };

  } catch (error: any) {
    console.error('🔍 Edge Function test error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get background check details for nurse completion form
 */
export async function getNurseBackgroundCheckDetails(backgroundCheckId: string): Promise<{
  data: BackgroundCheckResult | null;
  error: Error | null;
}> {
  try {
    console.log('🔍 Debug - Getting background check details:', backgroundCheckId);

    // Use the background_check_details view which already has user info
    const { data, error } = await supabase
      .from('background_check_details')
      .select('*')
      .eq('id', backgroundCheckId)
      .single();

    if (error) {
      console.error('🔍 Debug - Error fetching background check:', error);
      throw error;
    }

    // Transform the data to match your expected format
    const transformedData = {
      ...data,
      nurse_profiles: data.nurse_first_name && data.nurse_last_name ? {
        id: data.nurse_id,
        first_name: data.nurse_first_name,
        last_name: data.nurse_last_name,
        user_accounts: {
          email: data.nurse_user_id // You may need to fetch this separately
        }
      } : null,
      client_profiles: data.client_first_name && data.client_last_name ? {
        id: data.client_id,
        first_name: data.client_first_name,
        last_name: data.client_last_name,
        client_type: data.client_status
      } : null,
      job_postings: data.job_code ? {
        id: data.job_posting_id,
        job_code: data.job_code,
        care_type: data.care_type
      } : null
    };

    console.log('🔍 Debug - Background check data retrieved successfully');
    return { data: transformedData, error: null };

  } catch (error: any) {
    console.error('🔍 Debug - Error in getNurseBackgroundCheckDetails:', error);
    return { 
      data: null, 
      error: new Error(error.message || 'Failed to fetch background check details') 
    };
  }
}