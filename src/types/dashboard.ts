
// Type definitions for dashboard components

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  bio?: string; // Added optional bio field
}

export interface Purchase {
  id: string;
  type: string;
  status: "In Progress" | "Match Found" | "Refund Eligible";
  purchaseDate: string;
  expiresAt: string;
}

export interface Timesheet {
  id: string;
  date: string;
  nurseName?: string;
  clientName?: string;
  totalHours: number;
  status: "Pending" | "Approved" | "Paid";
}

export interface NurseSubmission {
  id: string;
  nurseId: string;
  nurseName: string;
  specialty: string;
  experience: number;
  availability: string;
  status: "New" | "Under Review" | "Approved" | "Rejected";
  submittedAt: string;
}

export interface VettingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}
