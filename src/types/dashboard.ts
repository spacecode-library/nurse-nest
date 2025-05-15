
// Add or update the user role type to include 'admin'
export type UserRole = 'nurse' | 'client' | 'admin';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: UserRole;
  [key: string]: any; // For any additional properties
}

export interface Timesheet {
  id: string;
  date: string;
  nurseName?: string;
  clientName?: string;
  totalHours: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  [key: string]: any; // For any additional properties
}
