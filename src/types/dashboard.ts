
export interface Timesheet {
  id: string;
  date: string;
  clientName?: string;
  nurseName?: string;
  totalHours: number;
  status: 'Pending' | 'Approved' | 'Paid';
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role?: 'nurse' | 'client' | 'admin';
  created_at?: string;
  updated_at?: string;
}
