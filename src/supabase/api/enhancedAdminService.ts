// src/supabase/api/enhancedAdminService.ts
import { supabase } from '@/integrations/supabase/client';
import { adminAuthClient } from '@/integrations/supabase/admin';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Enhanced platform metrics interface
 */
export interface PlatformMetrics {
  totalUsers: number;
  totalNurses: number;
  totalClients: number;
  activeContracts: number;
  completedContracts: number;
  totalTransactions: number;
  totalRevenue: number;
  platformFees: number;
  nurseEarnings: number;
  pendingApprovals: number;
  disputedTimecards: number;
  averageHourlyRate: number;
  monthlyGrowth: {
    users: number;
    revenue: number;
    transactions: number;
  };
  topCareTypes: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
}

/**
 * Enhanced nurse profile for admin review
 */
export interface AdminNurseProfile {
  // Basic profile
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_photo_url?: string;
  bio?: string;
  city: string;
  state: string;
  zip_code: string;
  onboarding_completed: boolean;
  created_at: string;
  
  // Licenses and certifications
  licenses: Array<{
    id: string;
    license_type: string;
    license_number: string;
    issuing_state: string;
    expiration_date: string;
    verification_status: string;
    license_photo_url?: string;
  }>;
  
  certifications: Array<{
    id: string;
    certification_name: string;
    expiration_date?: string;
    is_malpractice_insurance: boolean;
    certification_file_url?: string;
  }>;
  
  // Qualifications and preferences
  qualifications?: {
    education_level: string;
    years_experience: number;
    specializations: string[];
    school_name: string;
    graduation_year: number;
    resume_url: string;
  };
  
  preferences?: {
    desired_hourly_rate: number;
    travel_radius: number;
    preferred_shifts: string[];
    availability_types: string[];
    location_preferences: string[];
  };
  
  // Activity metrics
  totalApplications: number;
  acceptedApplications: number;
  activeContracts: number;
  completedContracts: number;
  totalEarnings: number;
  averageRating?: number;
  
  // Payment setup
  stripe_account_status?: string;
  stripe_charges_enabled?: boolean;
  stripe_payouts_enabled?: boolean;
}

/**
 * Enhanced client profile for admin review
 */
export interface AdminClientProfile {
  // Basic profile
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  client_type: string;
  relationship_to_recipient?: string;
  onboarding_completed: boolean;
  created_at: string;
  
  // Care information
  care_recipients: Array<{
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
  
  care_locations: Array<{
    id: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    home_environment: string;
  }>;
  
  // Activity metrics
  totalJobPostings: number;
  activeJobPostings: number;
  totalApplicationsReceived: number;
  hiredNurses: number;
  totalSpent: number;
  averageHourlyRate: number;
  
  // Payment setup
  payment_setup_completed?: boolean;
  stripe_customer_id?: string;
  payment_methods_count: number;
}

/**
 * Timecard dispute with full context
 */
export interface TimecardDisputeDetails {
  dispute: {
    id: string;
    dispute_reason: string;
    status: string;
    initiated_by: string;
    initiated_by_type: string;
    client_evidence?: string;
    nurse_evidence?: string;
    admin_notes?: string;
    created_at: string;
  };
  
  timecard: {
    id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    total_hours: number;
    notes?: string;
    status: string;
    job_code: string;
    payment_amount?: number;
    hourly_rate_at_time?: number;
  };
  
  nurse: AdminNurseProfile;
  client: AdminClientProfile;
  
  conversations: Array<{
    id: string;
    message_content: string;
    sender_id: string;
    sender_type: 'nurse' | 'client';
    created_at: string;
  }>;
  
  paymentTransaction?: {
    id: string;
    payment_status: string;
    gross_amount_cents: number;
    nurse_net_amount_cents: number;
    platform_fee_cents: number;
    stripe_payment_intent_id?: string;
  };
}

/**
 * Get comprehensive platform metrics
 */
export async function getPlatformMetrics(): Promise<{ data: PlatformMetrics | null; error: PostgrestError | null }> {
  try {
    // Get user counts
    const [nurseCount, clientCount] = await Promise.all([
      supabase.from('nurse_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('client_profiles').select('*', { count: 'exact', head: true })
    ]);

    const totalNurses = nurseCount.count || 0;
    const totalClients = clientCount.count || 0;
    const totalUsers = totalNurses + totalClients;

    // Get contract metrics
    const { data: contracts } = await supabase
      .from('contracts')
      .select('status, created_at');

    const activeContracts = contracts?.filter(c => c.status === 'active').length || 0;
    const completedContracts = contracts?.filter(c => c.status === 'completed').length || 0;

    // Get payment transaction metrics
    const { data: transactions } = await supabase
      .from('payment_transactions')
      .select('*');

    const totalTransactions = transactions?.length || 0;
    const totalRevenue = transactions?.reduce((sum, t) => sum + (t.gross_amount_cents / 100), 0) || 0;
    const platformFees = transactions?.reduce((sum, t) => sum + (t.platform_fee_cents / 100), 0) || 0;
    const nurseEarnings = transactions?.reduce((sum, t) => sum + (t.nurse_net_amount_cents / 100), 0) || 0;

    // Get dispute and approval metrics
    const [disputeCount, pendingVerifications, pendingTimecards] = await Promise.all([
      supabase.from('timecard_disputes').select('*', { count: 'exact', head: true }),
      supabase.from('nurse_licenses').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      supabase.from('timecards').select('*', { count: 'exact', head: true }).eq('status', 'Submitted')
    ]);

    const disputedTimecards = disputeCount.count || 0;
    const pendingApprovals = (pendingVerifications.count || 0) + (pendingTimecards.count || 0);

    // Calculate average hourly rate
    const { data: timecards } = await supabase
      .from('timecards')
      .select('hourly_rate_at_time, total_hours')
      .not('hourly_rate_at_time', 'is', null);

    const averageHourlyRate = timecards?.length 
      ? timecards.reduce((sum, tc) => sum + tc.hourly_rate_at_time, 0) / timecards.length 
      : 0;

    // Calculate monthly growth (comparing last 30 days to previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [recentUsers, previousUsers, recentTransactions, previousTransactions] = await Promise.all([
      supabase.from('nurse_profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('nurse_profiles').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('payment_transactions').select('gross_amount_cents').gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('payment_transactions').select('gross_amount_cents').gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString())
    ]);

    const recentUserCount = recentUsers.count || 0;
    const previousUserCount = previousUsers.count || 0;
    const recentRevenue = recentTransactions.data?.reduce((sum, t) => sum + (t.gross_amount_cents / 100), 0) || 0;
    const previousRevenue = previousTransactions.data?.reduce((sum, t) => sum + (t.gross_amount_cents / 100), 0) || 0;

    const monthlyGrowth = {
      users: previousUserCount > 0 ? ((recentUserCount - previousUserCount) / previousUserCount) * 100 : 0,
      revenue: previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
      transactions: (recentTransactions.data?.length || 0) - (previousTransactions.data?.length || 0)
    };

    // Get top care types
    const { data: jobPostings } = await supabase
      .from('job_postings')
      .select('care_type');

    const careTypeCounts = jobPostings?.reduce((acc, job) => {
      acc[job.care_type] = (acc[job.care_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const topCareTypes = Object.entries(careTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({
        type,
        count,
        revenue: count * 500 // Estimated revenue per job
      }));

    const metrics: PlatformMetrics = {
      totalUsers,
      totalNurses,
      totalClients,
      activeContracts,
      completedContracts,
      totalTransactions,
      totalRevenue,
      platformFees,
      nurseEarnings,
      pendingApprovals,
      disputedTimecards,
      averageHourlyRate,
      monthlyGrowth,
      topCareTypes
    };

    return { data: metrics, error: null };
  } catch (error) {
    console.error('Error getting platform metrics:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get detailed nurse profile for admin review
 */
export async function getDetailedNurseProfile(nurseId: string): Promise<{ data: AdminNurseProfile | null; error: PostgrestError | null }> {
  try {
    // Get nurse profile
    const { data: nurseProfile, error: profileError } = await supabase
      .from('nurse_profiles')
      .select('*')
      .eq('id', nurseId)
      .single();

    if (profileError) throw profileError;

    // Get auth user for email
    const { data: authUser } = await supabase.auth.admin.getUserById(nurseProfile.user_id);
    const email = authUser?.user?.email || '';

    // Get licenses
    const { data: licenses } = await supabase
      .from('nurse_licenses')
      .select('*')
      .eq('nurse_id', nurseId);

    // Get certifications
    const { data: certifications } = await supabase
      .from('nurse_certifications')
      .select('*')
      .eq('nurse_id', nurseId);

    // Get qualifications
    const { data: qualifications } = await supabase
      .from('nurse_qualifications')
      .select('*')
      .eq('nurse_id', nurseId)
      .single();

    // Get preferences
    const { data: preferences } = await supabase
      .from('nurse_preferences')
      .select('*')
      .eq('nurse_id', nurseId)
      .single();

    // Get activity metrics
    const [applications, contracts, payments] = await Promise.all([
      supabase.from('applications').select('status').eq('nurse_id', nurseId),
      supabase.from('contracts').select('status').eq('nurse_id', nurseId),
      supabase.from('payment_transactions').select('nurse_net_amount_cents').eq('nurse_id', nurseId)
    ]);

    const totalApplications = applications.data?.length || 0;
    const acceptedApplications = applications.data?.filter(a => a.status === 'hired').length || 0;
    const activeContracts = contracts.data?.filter(c => c.status === 'active').length || 0;
    const completedContracts = contracts.data?.filter(c => c.status === 'completed').length || 0;
    const totalEarnings = payments.data?.reduce((sum, p) => sum + (p.nurse_net_amount_cents / 100), 0) || 0;

    const detailedProfile: AdminNurseProfile = {
      ...nurseProfile,
      email,
      licenses: licenses || [],
      certifications: certifications || [],
      qualifications: qualifications || undefined,
      preferences: preferences || undefined,
      totalApplications,
      acceptedApplications,
      activeContracts,
      completedContracts,
      totalEarnings
    };

    return { data: detailedProfile, error: null };
  } catch (error) {
    console.error('Error getting detailed nurse profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get detailed client profile for admin review
 */
export async function getDetailedClientProfile(clientId: string): Promise<{ data: AdminClientProfile | null; error: PostgrestError | null }> {
  try {
    // Get client profile
    const { data: clientProfile, error: profileError } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', clientId)
      .single();

    if (profileError) throw profileError;

    // Get auth user for email
    const { data: authUser } = await supabase.auth.admin.getUserById(clientProfile.user_id);
    const email = authUser?.user?.email || '';

    // Get care recipients
    const { data: careRecipients } = await supabase
      .from('care_recipients')
      .select('*')
      .eq('client_id', clientId);

    // Get care needs
    const { data: careNeeds } = await supabase
      .from('care_needs')
      .select('*')
      .eq('client_id', clientId)
      .single();

    // Get care locations
    const { data: careLocations } = await supabase
      .from('care_locations')
      .select('*')
      .eq('client_id', clientId);

    // Get activity metrics
    const [jobPostings, applications, payments] = await Promise.all([
      supabase.from('job_postings').select('status').eq('client_id', clientId),
      supabase.from('job_postings').select('id').eq('client_id', clientId).then(async ({ data: jobs }) => {
        if (!jobs?.length) return { data: [] };
        return supabase.from('applications').select('status').in('job_id', jobs.map(j => j.id));
      }),
      supabase.from('payment_transactions').select('gross_amount_cents, hourly_rate_cents').eq('client_id', clientId)
    ]);

    const totalJobPostings = jobPostings.data?.length || 0;
    const activeJobPostings = jobPostings.data?.filter(j => j.status === 'open').length || 0;
    const totalApplicationsReceived = applications.data?.length || 0;
    const hiredNurses = applications.data?.filter(a => a.status === 'hired').length || 0;
    const totalSpent = payments.data?.reduce((sum, p) => sum + (p.gross_amount_cents / 100), 0) || 0;
    const averageHourlyRate = payments.data?.length 
      ? payments.data.reduce((sum, p) => sum + (p.hourly_rate_cents / 100), 0) / payments.data.length 
      : 0;

    // Get payment method count
    const { count: paymentMethodsCount } = await supabase
      .from('client_payment_methods')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('is_active', true);

    const detailedProfile: AdminClientProfile = {
      ...clientProfile,
      email,
      care_recipients: careRecipients || [],
      care_needs: careNeeds || undefined,
      care_locations: careLocations || [],
      totalJobPostings,
      activeJobPostings,
      totalApplicationsReceived,
      hiredNurses,
      totalSpent,
      averageHourlyRate,
      payment_methods_count: paymentMethodsCount || 0
    };

    return { data: detailedProfile, error: null };
  } catch (error) {
    console.error('Error getting detailed client profile:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get timecard dispute with full context
 */
export async function getTimecardDisputeDetails(disputeId: string): Promise<{ data: TimecardDisputeDetails | null; error: PostgrestError | null }> {
  try {
    // Get dispute details
    const { data: dispute, error: disputeError } = await supabase
      .from('timecard_disputes')
      .select('*')
      .eq('id', disputeId)
      .single();

    if (disputeError) throw disputeError;

    // Get timecard details
    const { data: timecard, error: timecardError } = await supabase
      .from('timecards')
      .select('*')
      .eq('id', dispute.timecard_id)
      .single();

    if (timecardError) throw timecardError;

    // Get nurse and client profiles
    const [nurseProfile, clientProfile] = await Promise.all([
      getDetailedNurseProfile(timecard.nurse_id),
      getDetailedClientProfile(timecard.client_id)
    ]);

    if (!nurseProfile.data || !clientProfile.data) {
      throw new Error('Failed to load nurse or client profile');
    }

    // Get conversations between nurse and client
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('nurse_id', timecard.nurse_id)
      .eq('client_id', timecard.client_id);

    let messages: any[] = [];
    if (conversations?.length) {
      const conversationIds = conversations.map(c => c.id);
      const { data: messageData } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: true });

      messages = messageData?.map(msg => ({
        ...msg,
        sender_type: msg.sender_id === nurseProfile.data?.user_id ? 'nurse' : 'client'
      })) || [];
    }

    // Get payment transaction if exists
    const { data: paymentTransaction } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('timecard_id', timecard.id)
      .single();

    const disputeDetails: TimecardDisputeDetails = {
      dispute,
      timecard,
      nurse: nurseProfile.data,
      client: clientProfile.data,
      conversations: messages,
      paymentTransaction: paymentTransaction || undefined
    };

    return { data: disputeDetails, error: null };
  } catch (error) {
    console.error('Error getting timecard dispute details:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all timecard disputes
 */
export async function getAllTimecardDisputes(
  status?: string,
  limit: number = 20,
  offset: number = 0
) {
  try {
    let query = supabase
      .from('timecard_disputes')
      .select('*', { count: 'exact' });

    // Only filter by status if it's a valid dispute status
    const validStatuses = ['pending', 'investigating', 'resolved_client', 'resolved_nurse', 'resolved_admin'];
    if (status && validStatuses.includes(status)) {
      query = query.eq('status', status as 'pending' | 'investigating' | 'resolved_client' | 'resolved_nurse' | 'resolved_admin');
    }

    const { data: disputes, error: disputeError, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (disputeError) throw disputeError;

    if (!disputes?.length) {
      return { data: [], count: 0, error: null };
    }

    // Enrich disputes with timecard and profile info
    const enrichedDisputes = await Promise.all(
      disputes.map(async (dispute) => {
        const { data: timecard } = await supabase
          .from('timecards')
          .select(`
            *,
            nurse_profiles(id, first_name, last_name),
            client_profiles(id, first_name, last_name)
          `)
          .eq('id', dispute.timecard_id)
          .single();

        return {
          ...dispute,
          timecard
        };
      })
    );

    return { data: enrichedDisputes, count, error: null };
  } catch (error) {
    console.error('Error getting timecard disputes:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Approve nurse registration
 */
export async function approveNurseRegistration(nurseId: string, adminNotes?: string) {
  try {
    // Update nurse profile
    const { error: profileError } = await supabase
      .from('nurse_profiles')
      .update({
        onboarding_completed: true,
        onboarding_completion_percentage: 100,
        updated_at: new Date().toISOString()
      })
      .eq('id', nurseId);

    if (profileError) throw profileError;

    // Update user account status to active
    const { data: nurseProfile } = await supabase
      .from('nurse_profiles')
      .select('user_id')
      .eq('id', nurseId)
      .single();

    if (nurseProfile) {
      const { error: statusError } = await supabase
        .from('user_metadata')
        .update({ account_status: 'active' })
        .eq('user_id', nurseProfile.user_id);

      if (statusError) throw statusError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error approving nurse registration:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Deny nurse registration
 */
export async function denyNurseRegistration(nurseId: string, reason: string) {
  try {
    // Update user account status
    const { data: nurseProfile } = await supabase
      .from('nurse_profiles')
      .select('user_id')
      .eq('id', nurseId)
      .single();

    if (nurseProfile) {
      const { error: statusError } = await supabase
        .from('user_metadata')
        .update({ account_status: 'suspended' })
        .eq('user_id', nurseProfile.user_id);

      if (statusError) throw statusError;
    }

    // TODO: Send notification to nurse about denial with reason

    return { success: true, error: null };
  } catch (error) {
    console.error('Error denying nurse registration:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Resolve timecard dispute
 */
export async function resolveTimecardDispute(
  disputeId: string,
  resolution: 'approve_timecard' | 'deny_timecard' | 'partial_approval',
  adminNotes: string,
  adjustedHours?: number
) {
  try {
    // Update dispute status
    const { error: disputeError } = await supabase
      .from('timecard_disputes')
      .update({
        status: 'resolved_admin',
        admin_notes: adminNotes,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (disputeError) throw disputeError;

    // Get dispute and timecard details
    const { data: dispute } = await supabase
      .from('timecard_disputes')
      .select('timecard_id')
      .eq('id', disputeId)
      .single();

    if (dispute) {
      let timecardUpdate: any = {
        updated_at: new Date().toISOString()
      };

      switch (resolution) {
        case 'approve_timecard':
          timecardUpdate.status = 'Approved';
          timecardUpdate.timestamp_approved = new Date().toISOString();
          break;
        case 'deny_timecard':
          timecardUpdate.status = 'Rejected';
          timecardUpdate.rejection_reason = 'Admin resolved dispute - timecard denied';
          break;
        case 'partial_approval':
          if (adjustedHours) {
            timecardUpdate.total_hours = adjustedHours;
            timecardUpdate.status = 'Approved';
            timecardUpdate.timestamp_approved = new Date().toISOString();
            timecardUpdate.notes = `Admin adjusted hours to ${adjustedHours} due to dispute resolution`;
          }
          break;
      }

      const { error: timecardError } = await supabase
        .from('timecards')
        .update(timecardUpdate)
        .eq('id', dispute.timecard_id);

      if (timecardError) throw timecardError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error resolving timecard dispute:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Get platform activity feed
 */
export async function getPlatformActivityFeed(limit: number = 50) {
  try {
    // Get recent activities from various tables
    const [applications, timecards, contracts, payments] = await Promise.all([
      supabase
        .from('applications')
        .select(`
          id, status, created_at,
          nurse_profiles(first_name, last_name),
          job_postings(care_type, client_profiles(first_name, last_name))
        `)
        .order('created_at', { ascending: false })
        .limit(limit / 4),
      
      supabase
        .from('timecards')
        .select(`
          id, status, total_hours, created_at,
          nurse_profiles(first_name, last_name),
          client_profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit / 4),
      
      supabase
        .from('contracts')
        .select(`
          id, status, created_at,
          nurse_profiles(first_name, last_name),
          client_profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit / 4),
      
      supabase
        .from('payment_transactions')
        .select(`
          id, payment_status, gross_amount_cents, created_at,
          nurse_profiles(first_name, last_name),
          client_profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit / 4)
    ]);

    // Combine and format activities
    const activities = [
      ...(applications.data || []).map(app => ({
        id: `app_${app.id}`,
        type: 'application',
        title: `New Application: ${app.nurse_profiles?.first_name} ${app.nurse_profiles?.last_name}`,
        description: `Applied for ${app.job_postings?.care_type} position with ${app.job_postings?.client_profiles?.first_name}`,
        status: app.status,
        timestamp: app.created_at
      })),
      
      ...(timecards.data || []).map(tc => ({
        id: `tc_${tc.id}`,
        type: 'timecard',
        title: `Timecard ${tc.status}: ${tc.nurse_profiles?.first_name} ${tc.nurse_profiles?.last_name}`,
        description: `${tc.total_hours} hours for ${tc.client_profiles?.first_name}`,
        status: tc.status,
        timestamp: tc.created_at
      })),
      
      ...(contracts.data || []).map(contract => ({
        id: `contract_${contract.id}`,
        type: 'contract',
        title: `Contract ${contract.status}: ${contract.nurse_profiles?.first_name} & ${contract.client_profiles?.first_name}`,
        description: `Contract status changed to ${contract.status}`,
        status: contract.status,
        timestamp: contract.created_at
      })),
      
      ...(payments.data || []).map(payment => ({
        id: `payment_${payment.id}`,
        type: 'payment',
        title: `Payment ${payment.payment_status}: $${(payment.gross_amount_cents / 100).toFixed(2)}`,
        description: `Payment from ${payment.client_profiles?.first_name} to ${payment.nurse_profiles?.first_name}`,
        status: payment.payment_status,
        timestamp: payment.created_at
      }))
    ];

    // Sort by timestamp and return top activities
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return { data: sortedActivities, error: null };
  } catch (error) {
    console.error('Error getting platform activity feed:', error);
    return { data: [], error: error as PostgrestError };
  }
}
