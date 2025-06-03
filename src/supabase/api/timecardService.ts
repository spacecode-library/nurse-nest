// src/supabase/api/timecardService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Timecard status types
 */
export type TimecardStatus = 'Submitted' | 'Approved' | 'Auto-Approved' | 'Rejected' | 'Paid';

/**
 * Interface for timecard data
 */
export interface Timecard {
  id?: string;
  nurse_id: string;
  client_id: string;
  week_start_date: string;
  week_end_date: string;
  job_code: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  rounded_start_time: string;
  rounded_end_time: string;
  break_minutes: number;
  total_hours: number;
  notes?: string;
  status: TimecardStatus;
  approved_by_client: boolean;
  auto_approved: boolean;
  timestamp_submitted?: string;
  timestamp_approved?: string;
  approval_deadline: string;
  timestamp_paid?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Round time to nearest 15 minutes
 * 
 * @param timeString Time string in format "HH:MM"
 * @returns Rounded time string in format "HH:MM"
 */
export function roundTimeToNearestQuarter(timeString: string): string {
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  // Convert to minutes since midnight
  let totalMinutes = hours * 60 + minutes;
  
  // Round to nearest 15 minutes
  const remainder = totalMinutes % 15;
  if (remainder < 7.5) {
    totalMinutes -= remainder;
  } else {
    totalMinutes += (15 - remainder);
  }
  
  // Convert back to hours and minutes
  const roundedHours = Math.floor(totalMinutes / 60);
  const roundedMinutes = totalMinutes % 60;
  
  // Format as "HH:MM"
  return `${roundedHours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate total hours between two time strings
 * 
 * @param startTime Start time string in format "HH:MM"
 * @param endTime End time string in format "HH:MM"
 * @param isOvernight Whether the shift spans midnight
 * @param breakMinutes Minutes for break
 * @returns Total hours (decimal)
 */
export function calculateTotalHours(
  startTime: string,
  endTime: string,
  isOvernight: boolean = false,
  breakMinutes: number = 0
): number {
  // Parse hours and minutes
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;
  
  // If overnight, add 24 hours (1440 minutes) to end time
  if (isOvernight && endMinutes < startMinutes) {
    endMinutes += 1440;
  }
  
  // Calculate duration in minutes, subtracting break time
  const durationMinutes = endMinutes - startMinutes - breakMinutes;
  
  // Convert to decimal hours and round to 2 decimal places
  return Math.round((durationMinutes / 60) * 100) / 100;
}

/**
 * Submit a new timecard
 * 
 * @param timecardData Timecard data to create
 * @returns Created timecard
 */
export async function submitTimecard(timecardData: Omit<Timecard, 'id' | 'rounded_start_time' | 'rounded_end_time' | 'total_hours' | 'status' | 'approved_by_client' | 'auto_approved' | 'timestamp_submitted' | 'timestamp_approved' | 'approval_deadline' | 'timestamp_paid' | 'created_at' | 'updated_at'>) {
  try {
    // Round start and end times to nearest 15 minutes
    const roundedStartTime = roundTimeToNearestQuarter(timecardData.start_time);
    const roundedEndTime = roundTimeToNearestQuarter(timecardData.end_time);
    
    // Calculate total hours
    const totalHours = calculateTotalHours(
      roundedStartTime,
      roundedEndTime,
      timecardData.is_overnight,
      timecardData.break_minutes
    );
    
    // Set approval deadline (24 hours from now)
    const now = new Date();
    const approvalDeadline = new Date(now);
    approvalDeadline.setHours(approvalDeadline.getHours() + 24);
    
    // Create timecard
    const { data, error } = await supabase
      .from('timecards')
      .insert({
        ...timecardData,
        rounded_start_time: roundedStartTime,
        rounded_end_time: roundedEndTime,
        total_hours: totalHours,
        status: 'Submitted',
        approved_by_client: false,
        auto_approved: false,
        timestamp_submitted: now.toISOString(),
        approval_deadline: approvalDeadline.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting timecard:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get a timecard by ID
 * 
 * @param timecardId Timecard ID
 * @returns Timecard data
 */
export async function getTimecardById(timecardId: string) {
  try {
    const { data, error } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!inner(
          id,
          first_name,
          last_name
        ),
        client_profiles!inner(
          id,
          first_name,
          last_name
        )
      `)
      .eq('id', timecardId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting timecard by ID:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get all timecards for a nurse
 *
 * @param nurseId Nurse ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of timecards with client profiles
 */
export async function getNurseTimecards(
  nurseId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    // First, get the timecards without any joins
    const { data: timecards, error: timecardsError, count } = await supabase
      .from('timecards')
      .select('*', { count: 'exact' })
      .eq('nurse_id', nurseId)
      .range(offset, offset + limit - 1)
      .order('shift_date', { ascending: false });

    if (timecardsError) throw timecardsError;

    if (!timecards || timecards.length === 0) {
      return { data: [], count: 0, error: null };
    }

    // Extract unique client IDs from the timecards
    const clientIds = [...new Set(
      timecards
        .map(timecard => timecard.client_id)
        .filter(id => id != null) // Remove null/undefined values
    )];

    // If no client IDs, return timecards without client profiles
    if (clientIds.length === 0) {
      const timecardsWithProfiles = timecards.map(timecard => ({
        ...timecard,
        client_profiles: null
      }));
      return { data: timecardsWithProfiles, count, error: null };
    }

    // Get client profiles for those IDs
    const { data: clientProfiles, error: profilesError } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name')
      .in('id', clientIds);

    if (profilesError) throw profilesError;

    // Create a map for quick lookup
    const profilesMap = new Map(
      (clientProfiles || []).map(profile => [profile.id, profile])
    );

    // Manually join the data
    const timecardsWithProfiles = timecards.map(timecard => ({
      ...timecard,
      client_profiles: timecard.client_id ? profilesMap.get(timecard.client_id) || null : null
    }));

    return { data: timecardsWithProfiles, count, error: null };

  } catch (error) {
    console.error('Error getting nurse timecards:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get all timecards for a client with enhanced nurse payment status and preferences
 * 
 * @param clientId Client ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of timecards with nurse payment readiness and hourly rates
 */
export async function getClientTimecards(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!timecards_nurse_id_fkey(
          id,
          first_name,
          last_name,
          stripe_account_id,
          stripe_account_status,
          stripe_charges_enabled,
          stripe_payouts_enabled,
          stripe_onboarding_completed_at
        ),
        client_profiles!timecards_client_id_fkey(
          id,
          stripe_customer_id
        )
      `, { count: 'exact' })
      .eq('client_id', clientId)
      .range(offset, offset + limit - 1)
      .order('shift_date', { ascending: false });

    if (error) throw error;

    // Fetch nurse preferences for all nurses in the timecards
    const nurseIds = [...new Set(data?.map(tc => tc.nurse_id).filter(Boolean))];
    
    let nursePreferences: any[] = [];
    if (nurseIds.length > 0) {
      const { data: preferences, error: preferencesError } = await supabase
        .from('nurse_preferences')
        .select('nurse_id, desired_hourly_rate')
        .in('nurse_id', nurseIds);
      
      if (preferencesError) {
        console.warn('Error fetching nurse preferences:', preferencesError);
      } else {
        nursePreferences = preferences || [];
      }
    }

    // Create a map for quick nurse preference lookup
    const preferencesMap = new Map(
      nursePreferences.map(pref => [pref.nurse_id, pref.desired_hourly_rate])
    );

    // Add nurse hourly rates to the data
    const enhancedData = data?.map(timecard => ({
      ...timecard,
      nurse_hourly_rate: preferencesMap.get(timecard.nurse_id) || 50 // Default to $50 if no preference found
    }));

    return { data: enhancedData, count, error: null };
  } catch (error) {
    console.error('Error getting client timecards:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Get pending timecards for a client
 * 
 * @param clientId Client ID
 * @param limit Maximum number of records to return
 * @param offset Offset for pagination
 * @returns List of pending timecards
 */
export async function getPendingTimecards(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!timecards_nurse_id_fkey(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('client_id', clientId)
      .eq('status', 'Submitted')
      .range(offset, offset + limit - 1)
      .order('timestamp_submitted', { ascending: true });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting pending timecards:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Approve a timecard
 * 
 * @param timecardId Timecard ID
 * @param clientId Client ID (for validation)
 * @returns Updated timecard
 */
export async function approveTimecard(timecardId: string, clientId: string) {
  try {
    // Verify that this timecard belongs to the client
    const { data: timecard, error: timecardError } = await supabase
      .from('timecards')
      .select('*')
      .eq('id', timecardId)
      .eq('client_id', clientId)
      .single();
    
    if (timecardError) throw timecardError;
    
    // Make sure the timecard is in 'Submitted' status
    if (timecard.status !== 'Submitted') {
      throw new Error(`Timecard cannot be approved because it is already ${timecard.status.toLowerCase()}`);
    }
    
    // Update the timecard
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('timecards')
      .update({
        status: 'Approved',
        approved_by_client: true,
        timestamp_approved: now,
        updated_at: now
      })
      .eq('id', timecardId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error approving timecard:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred') 
    };
  }
}

/**
 * Reject a timecard
 * 
 * @param timecardId Timecard ID
 * @param clientId Client ID (for validation)
 * @param reason Reason for rejection
 * @returns Updated timecard
 */
export async function rejectTimecard(timecardId: string, clientId: string, reason: string) {
  try {
    // Verify that this timecard belongs to the client
    const { data: timecard, error: timecardError } = await supabase
      .from('timecards')
      .select('*')
      .eq('id', timecardId)
      .eq('client_id', clientId)
      .single();
    
    if (timecardError) throw timecardError;
    
    // Make sure the timecard is in 'Submitted' status
    if (timecard.status !== 'Submitted') {
      throw new Error(`Timecard cannot be rejected because it is already ${timecard.status.toLowerCase()}`);
    }
    
    // Update the timecard
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('timecards')
      .update({
        status: 'Rejected',
        notes: reason,
        updated_at: now
      })
      .eq('id', timecardId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error rejecting timecard:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred') 
    };
  }
}

/**
 * Auto-approve timecards that are past their approval deadline
 * This would typically be called by a scheduled function
 * 
 * @returns Number of timecards auto-approved
 */
export async function autoApproveTimecards() {
  try {
    const now = new Date().toISOString();
    
    // Find timecards past their approval deadline
    const { data: timecards, error: findError } = await supabase
      .from('timecards')
      .select('id')
      .eq('status', 'Submitted')
      .lt('approval_deadline', now);
    
    if (findError) throw findError;
    
    if (!timecards || timecards.length === 0) {
      return { count: 0, error: null };
    }
    
    // Get array of timecard IDs
    const timecardIds = timecards.map(tc => tc.id);
    
    // Update all matching timecards
    const { error: updateError } = await supabase
      .from('timecards')
      .update({
        status: 'Auto-Approved',
        auto_approved: true,
        timestamp_approved: now,
        updated_at: now
      })
      .in('id', timecardIds);
    
    if (updateError) throw updateError;
    
    return { count: timecardIds.length, error: null };
  } catch (error) {
    console.error('Error auto-approving timecards:', error);
    return { count: 0, error: error as PostgrestError };
  }
}

/**
 * Mark a timecard as paid
 * 
 * @param timecardId Timecard ID
 * @returns Updated timecard
 */
export async function markTimecardAsPaid(timecardId: string) {
  try {
    // Verify that the timecard is either Approved or Auto-Approved
    const { data: timecard, error: timecardError } = await supabase
      .from('timecards')
      .select('status')
      .eq('id', timecardId)
      .single();
    
    if (timecardError) throw timecardError;
    
    if (timecard.status !== 'Approved' && timecard.status !== 'Auto-Approved') {
      throw new Error(`Timecard cannot be marked as paid because it is not approved (current status: ${timecard.status})`);
    }
    
    // Update the timecard
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('timecards')
      .update({
        status: 'Paid',
        timestamp_paid: now,
        updated_at: now
      })
      .eq('id', timecardId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking timecard as paid:', error);
    return { data: null, error: error as PostgrestError };
  }
}

export async function getTimecardsByStatus(
  status: TimecardStatus,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!timecards_nurse_id_fkey(
          id,
          first_name,
          last_name
        ),
        client_profiles!timecards_client_id_fkey(
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error getting timecards by status:', error);
    return { data: null, count: null, error: error as PostgrestError };
  }
}

/**
 * Calculate nurse earnings for a given period
 * 
 * @param nurseId Nurse ID
 * @param startDate Start date (YYYY-MM-DD)
 * @param endDate End date (YYYY-MM-DD)
 * @returns Earnings data
 */
export async function calculateNurseEarnings(nurseId: string, startDate: string, endDate: string) {
  try {
    // Get all paid timecards for the nurse within the date range
    const { data: timecards, error } = await supabase
      .from('timecards')
      .select('*')
      .eq('nurse_id', nurseId)
      .in('status', ['Approved', 'Auto-Approved', 'Paid'])
      .gte('shift_date', startDate)
      .lte('shift_date', endDate);
    
    if (error) throw error;
    
    if (!timecards || timecards.length === 0) {
      return { 
        earnings: { totalHours: 0, totalEarnings: 0, timecards: [] }, 
        error: null 
      };
    }
    
    // Calculate total hours and earnings
    let totalHours = 0;
    const simplifiedTimecards = timecards.map(tc => {
      totalHours += tc.total_hours;
      
      return {
        id: tc.id,
        shiftDate: tc.shift_date,
        hours: tc.total_hours,
        status: tc.status,
        jobCode: tc.job_code
      };
    });
    
    // For this example, we're using a placeholder hourly rate of $50
    // In a real app, you'd get the rate from the contract or user settings
    const hourlyRate = 50;
    const totalEarnings = totalHours * hourlyRate;
    
    return {
      earnings: {
        totalHours,
        totalEarnings,
        hourlyRate,
        timecards: simplifiedTimecards
      },
      error: null
    };
  } catch (error) {
    console.error('Error calculating nurse earnings:', error);
    return { earnings: null, error: error as PostgrestError };
  }
}

/**
 * Calculate client expenses for a given period using actual nurse hourly rates
 * 
 * @param clientId Client ID
 * @param startDate Start date (YYYY-MM-DD)
 * @param endDate End date (YYYY-MM-DD)
 * @returns Expenses data with individual nurse rates
 */
export async function calculateClientExpenses(clientId: string, startDate: string, endDate: string) {
  try {
    // Get all approved or paid timecards for the client within the date range
    // Include nurse preferences to get their hourly rate
    const { data: timecards, error } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!timecards_nurse_id_fkey(
          id,
          first_name,
          last_name
        )
      `)
      .eq('client_id', clientId)
      .in('status', ['Approved', 'Auto-Approved', 'Paid'])
      .gte('shift_date', startDate)
      .lte('shift_date', endDate);
    
    if (error) throw error;
    
    if (!timecards || timecards.length === 0) {
      return { 
        expenses: { 
          totalHours: 0, 
          subtotal: 0, 
          platformFee: 0, 
          total: 0, 
          timecards: [],
          averageHourlyRate: 0
        }, 
        error: null 
      };
    }

    // Get unique nurse IDs to fetch their hourly rates
    const uniqueNurseIds = [...new Set(timecards.map(tc => tc.nurse_id))];
    
    // Fetch nurse preferences to get hourly rates
    const { data: nursePreferences, error: preferencesError } = await supabase
      .from('nurse_preferences')
      .select('nurse_id, desired_hourly_rate')
      .in('nurse_id', uniqueNurseIds);

    if (preferencesError) {
      console.warn('Could not fetch nurse preferences, using default rate:', preferencesError);
    }

    // Create a map of nurse_id to hourly_rate for quick lookup
    const nurseRatesMap = new Map(
      (nursePreferences || []).map(pref => [pref.nurse_id, pref.desired_hourly_rate])
    );

    // Calculate total hours and expenses using individual nurse rates
    let totalHours = 0;
    let totalSubtotal = 0;
    const simplifiedTimecards = timecards.map(tc => {
      totalHours += tc.total_hours;
      
      // Get the nurse's hourly rate, fallback to $50 if not found
      const nurseHourlyRate = nurseRatesMap.get(tc.nurse_id) || 50;
      const timecardSubtotal = tc.total_hours * nurseHourlyRate;
      totalSubtotal += timecardSubtotal;
      
      return {
        id: tc.id,
        shiftDate: tc.shift_date,
        hours: tc.total_hours,
        status: tc.status,
        jobCode: tc.job_code,
        nurseName: `${tc.nurse_profiles.first_name} ${tc.nurse_profiles.last_name}`,
        hourlyRate: nurseHourlyRate,
        subtotal: timecardSubtotal
      };
    });

    // Calculate platform fee (15% of subtotal)
    const platformFee = totalSubtotal * 0.15;
    const total = totalSubtotal + platformFee;
    
    // Calculate average hourly rate across all timecards
    const averageHourlyRate = totalHours > 0 ? totalSubtotal / totalHours : 0;
    
    return {
      expenses: {
        totalHours,
        averageHourlyRate: Math.round(averageHourlyRate * 100) / 100, // Round to 2 decimal places
        subtotal: Math.round(totalSubtotal * 100) / 100,
        platformFee: Math.round(platformFee * 100) / 100,
        total: Math.round(total * 100) / 100,
        timecards: simplifiedTimecards
      },
      error: null
    };
  } catch (error) {
    console.error('Error calculating client expenses:', error);
    return { expenses: null, error: error as PostgrestError };
  }
}

/**
 * Get timecard statistics
 * This can be useful for admin dashboards or analytics
 * 
 * @returns Statistics object
 */
export async function getTimecardStats() {
  try {
    const { data, error } = await supabase
      .from('timecards')
      .select('status, total_hours, auto_approved, created_at');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { stats: null, error: null };
    }
    
    // Count by status
    const statusCounts = data.reduce((acc, tc) => {
      acc[tc.status] = (acc[tc.status] || 0) + 1;
      return acc;
    }, {} as Record<TimecardStatus, number>);
    
    // Count auto-approved timecards
    const autoApprovedCount = data.filter(tc => tc.auto_approved).length;
    
    // Calculate total hours
    const totalHours = data.reduce((sum, tc) => sum + tc.total_hours, 0);
    
    // Calculate average hours per timecard
    const averageHours = totalHours / data.length;
    
    // Count timecards by month
    const timecardsByMonth: Record<string, number> = {};
    data.forEach(tc => {
      const date = new Date(tc.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      timecardsByMonth[month] = (timecardsByMonth[month] || 0) + 1;
    });
    
    return {
      stats: {
        statusCounts,
        autoApprovedCount,
        autoApprovalRate: autoApprovedCount / data.length,
        totalHours,
        averageHours,
        timecardsByMonth,
        totalTimecards: data.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting timecard stats:', error);
    return { stats: null, error: error as PostgrestError };
  }
}