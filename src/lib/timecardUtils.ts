// src/lib/timecardUtils.ts
import { format, addDays, startOfWeek, endOfWeek, differenceInHours } from 'date-fns';

/**
 * Time formatting and calculation utilities for timecards
 */

export interface TimecardCalculation {
  totalHours: number;
  grossPay: number;
  netPay: number;
  platformFee: number;
  clientCost: number;
}

export interface WeekPeriod {
  start: Date;
  end: Date;
  startString: string;
  endString: string;
}

/**
 * Format time for display in timecard
 */
export function formatTimecardTime(timeString: string): string {
  const time = new Date(`2000-01-01T${timeString}`);
  return format(time, 'h:mm a');
}

/**
 * Format date for timecard display
 */
export function formatTimecardDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Format short date for timecard display
 */
export function formatShortTimecardDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Get week period for a given date
 */
export function getWeekPeriod(date: Date | string): WeekPeriod {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const start = startOfWeek(targetDate, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(targetDate, { weekStartsOn: 0 }); // Saturday
  
  return {
    start,
    end,
    startString: format(start, 'yyyy-MM-dd'),
    endString: format(end, 'yyyy-MM-dd')
  };
}

/**
 * Calculate timecard financial breakdown
 */
export function calculateTimecardFinancials(
  hours: number, 
  hourlyRate: number, 
  platformFeeRate: number = 0.15
): TimecardCalculation {
  const grossPay = hours * hourlyRate;
  const platformFee = grossPay * platformFeeRate;
  const netPay = grossPay * (1 - platformFeeRate);
  const clientCost = grossPay + platformFee;
  
  return {
    totalHours: Number(hours.toFixed(2)),
    grossPay: Number(grossPay.toFixed(2)),
    netPay: Number(netPay.toFixed(2)),
    platformFee: Number(platformFee.toFixed(2)),
    clientCost: Number(clientCost.toFixed(2))
  };
}

/**
 * Validate timecard submission data
 */
export interface TimecardValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTimecardSubmission(data: {
  jobCode: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  isOvernight: boolean;
  breakMinutes: number;
  totalHours: number;
}): TimecardValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!data.jobCode) errors.push('Job code is required');
  if (!data.shiftDate) errors.push('Shift date is required');
  if (!data.startTime) errors.push('Start time is required');
  if (!data.endTime) errors.push('End time is required');

  // Date validation
  const shiftDate = new Date(data.shiftDate);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  if (shiftDate > today) {
    errors.push('Shift date cannot be in the future');
  }

  if (shiftDate < thirtyDaysAgo) {
    errors.push('Shift date cannot be more than 30 days old');
  }

  // Hours validation
  if (data.totalHours <= 0) {
    errors.push('Total hours must be greater than 0');
  }

  if (data.totalHours > 24) {
    errors.push('Total hours cannot exceed 24');
  }

  if (data.totalHours > 16) {
    warnings.push('Shift longer than 16 hours - please verify times are correct');
  }

  // Break time validation
  if (data.breakMinutes < 0) {
    errors.push('Break time cannot be negative');
  }

  if (data.breakMinutes > 480) { // 8 hours
    errors.push('Break time cannot exceed 8 hours');
  }

  if (data.totalHours > 6 && data.breakMinutes === 0) {
    warnings.push('Consider adding break time for shifts longer than 6 hours');
  }

  // Time logic validation
  if (data.startTime === data.endTime && !data.isOvernight) {
    errors.push('Start and end times cannot be the same for non-overnight shifts');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate timecard summary text
 */
export function generateTimecardSummary(timecard: {
  jobCode: string;
  shiftDate: string;
  totalHours: number;
  status: string;
  nurseName?: string;
  clientName?: string;
}): string {
  const date = formatShortTimecardDate(timecard.shiftDate);
  const hours = timecard.totalHours === 1 ? '1 hour' : `${timecard.totalHours} hours`;
  
  return `${timecard.jobCode} - ${date} - ${hours} (${timecard.status})`;
}

/**
 * Get status color class for timecard status
 */
export function getTimecardStatusColor(status: string): string {
  switch (status) {
    case 'Submitted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Approved':
    case 'Auto-Approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Paid':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get status icon for timecard status
 */
export function getTimecardStatusIcon(status: string): string {
  switch (status) {
    case 'Submitted':
      return 'Timer';
    case 'Approved':
    case 'Auto-Approved':
      return 'CheckCircle';
    case 'Rejected':
      return 'XCircle';
    case 'Paid':
      return 'DollarSign';
    default:
      return 'AlertCircle';
  }
}

/**
 * Calculate time until deadline
 */
export function getTimeUntilDeadline(deadline: string): {
  timeLeft: string;
  isApproaching: boolean;
  isOverdue: boolean;
} {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const hoursLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursLeft <= 0) {
    return {
      timeLeft: 'Overdue',
      isApproaching: false,
      isOverdue: true
    };
  }

  let timeLeft: string;
  if (hoursLeft < 1) {
    timeLeft = `${Math.round(hoursLeft * 60)}m left`;
  } else if (hoursLeft < 24) {
    timeLeft = `${Math.round(hoursLeft)}h left`;
  } else {
    timeLeft = `${Math.round(hoursLeft / 24)}d left`;
  }

  return {
    timeLeft,
    isApproaching: hoursLeft <= 2,
    isOverdue: false
  };
}

/**
 * Group timecards by week
 */
export function groupTimecardsByWeek(timecards: Array<{ shift_date: string; [key: string]: any }>) {
  const grouped: Record<string, Array<any>> = {};
  
  timecards.forEach(timecard => {
    const week = getWeekPeriod(timecard.shift_date);
    const weekKey = `${week.startString}_${week.endString}`;
    
    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }
    
    grouped[weekKey].push(timecard);
  });
  
  return grouped;
}

/**
 * Calculate weekly totals
 */
export function calculateWeeklyTotals(
  timecards: Array<{ total_hours: number; [key: string]: any }>,
  hourlyRate: number
) {
  const totalHours = timecards.reduce((sum, tc) => sum + tc.total_hours, 0);
  const financials = calculateTimecardFinancials(totalHours, hourlyRate);
  
  return {
    totalHours,
    timecardCount: timecards.length,
    ...financials
  };
}

/**
 * Export timecard data to CSV format
 */
export function exportTimecardsToCSV(timecards: Array<{
  job_code: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  status: string;
  nurse_name?: string;
  client_name?: string;
}>): string {
  const headers = [
    'Job Code',
    'Shift Date', 
    'Start Time',
    'End Time',
    'Total Hours',
    'Status',
    'Nurse Name',
    'Client Name'
  ];
  
  const rows = timecards.map(tc => [
    tc.job_code,
    tc.shift_date,
    tc.start_time,
    tc.end_time,
    tc.total_hours.toString(),
    tc.status,
    tc.nurse_name || '',
    tc.client_name || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format hours for display
 */
export function formatHours(hours: number): string {
  if (hours === 1) return '1 hour';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  return `${hours} hours`;
}

/**
 * Create timecard notification message
 */
export function createTimecardNotification(
  type: 'submitted' | 'approved' | 'rejected' | 'auto_approved',
  timecard: {
    job_code: string;
    shift_date: string;
    total_hours: number;
    client_name?: string;
    nurse_name?: string;
  }
): { title: string; message: string } {
  const date = formatShortTimecardDate(timecard.shift_date);
  const hours = formatHours(timecard.total_hours);
  
  switch (type) {
    case 'submitted':
      return {
        title: 'Timecard Submitted',
        message: `Your timecard for ${timecard.job_code} on ${date} (${hours}) has been submitted for approval.`
      };
    
    case 'approved':
      return {
        title: 'Timecard Approved',
        message: `Your timecard for ${timecard.job_code} on ${date} (${hours}) has been approved by ${timecard.client_name}.`
      };
    
    case 'rejected':
      return {
        title: 'Timecard Disputed',
        message: `Your timecard for ${timecard.job_code} on ${date} (${hours}) has been disputed by ${timecard.client_name}. Please review and resubmit if necessary.`
      };
    
    case 'auto_approved':
      return {
        title: 'Timecard Auto-Approved',
        message: `Your timecard for ${timecard.job_code} on ${date} (${hours}) has been automatically approved after 24 hours.`
      };
    
    default:
      return {
        title: 'Timecard Update',
        message: `Your timecard for ${timecard.job_code} on ${date} has been updated.`
      };
  }
}