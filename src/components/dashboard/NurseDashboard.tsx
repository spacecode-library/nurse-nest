
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Timesheet } from "@/types/dashboard";
import TimesheetsCard from "./TimesheetsCard";
import NurseAgreements from "./NurseAgreements";

interface NurseDashboardProps {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
  };
}

export default function NurseDashboard({ profile }: NurseDashboardProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  // Mock data loading - in a real app, fetch from your database
  useEffect(() => {
    // Mock nurse timesheets
    const mockTimesheets: Timesheet[] = [
      {
        id: '201',
        date: '2025-05-09',
        clientName: 'Smith Family',
        totalHours: 12,
        status: 'Pending'
      },
      {
        id: '202',
        date: '2025-05-08',
        clientName: 'Johnson Clinic',
        totalHours: 8,
        status: 'Approved'
      },
      {
        id: '203',
        date: '2025-05-01',
        clientName: 'Williams Family',
        totalHours: 10,
        status: 'Paid'
      }
    ];
    setTimesheets(mockTimesheets);
  }, []);

  return (
    <>
      <NurseAgreements userId={profile.id} />
      <TimesheetsCard timesheets={timesheets} userRole="nurse" />
    </>
  );
}
