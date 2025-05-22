// components/dashboard/ClientDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Users, 
  Clock, 
  DollarSign, 
  FileText, 
  Bell, 
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Timer,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import API services
import { getClientProfileByUserId } from '@/supabase/api/clientProfileService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getClientTimecards } from '@/supabase/api/timecardService';
import { getClientContracts } from '@/supabase/api/contractService';

// Import sub-components
import ClientQuickActionsCard from './client/ClientQuickActionsCard';
import JobManagementCard from './client/JobManagementCard';
import ApplicantReviewCard from './client/ApplicantReviewCard';
import ClientContractsCard from './client/ClientContractsCard';
import TimecardApprovalCard from './client/TimecardApprovalCard';


interface ClientProfile {
  id: string;
  first_name: string;
  last_name: string;
  client_type: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
}

interface DashboardStats {
  openJobs: number;
  newApplications: number;
  pendingTimecards: number;
  activeContracts: number;
  avgResponseTime: number; // in hours
  totalSpent: number;
}

export default function ClientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    openJobs: 0,
    newApplications: 0,
    pendingTimecards: 0,
    activeContracts: 0,
    avgResponseTime: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load client profile
      const { data: profileData, error: profileError } = await getClientProfileByUserId(user!.id);
      if (profileError) throw profileError;
      
      if (!profileData) {
        // User doesn't have a client profile, redirect to onboarding
        navigate('/onboarding/client');
        return;
      }

      setProfile(profileData);

      // Load dashboard statistics
      await loadDashboardStats(profileData.id);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async (clientId: string) => {
    try {
      // Load job postings
      const { data: jobs } = await getClientJobPostings(clientId, 100, 0);
      const openJobs = jobs?.filter(job => job.status === 'open').length || 0;

      // Load timecards
      const { data: timecards } = await getClientTimecards(clientId, 100, 0);
      const pendingTimecards = timecards?.filter(tc => tc.status === 'Submitted').length || 0;

      // Calculate total spent from paid timecards
      const totalSpent = timecards?.filter(tc => 
        tc.status === 'Paid'
      ).reduce((sum, tc) => {
        const nurseEarnings = tc.total_hours * 50; // $50/hour placeholder
        const platformFee = nurseEarnings * 0.15; // 15% platform fee
        return sum + nurseEarnings + platformFee;
      }, 0) || 0;

      // Load contracts
      const { data: contracts } = await getClientContracts(clientId, 100, 0);
      const activeContracts = contracts?.filter(contract => 
        contract.status === 'active'
      ).length || 0;

      // Mock data for applications and response time
      // In production, you'd calculate these from actual data
      const newApplications = Math.floor(Math.random() * 10) + 5;
      const avgResponseTime = 18; // 18 hours average response time

      setStats({
        openJobs,
        newApplications,
        pendingTimecards,
        activeContracts,
        avgResponseTime,
        totalSpent
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadDashboardData()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-4">
            Please complete your client profile to access the dashboard.
          </p>
          <Button onClick={() => navigate('/onboarding/client')}>
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  const getResponseTimeColor = (hours: number) => {
    if (hours <= 24) return 'text-green-600';
    if (hours <= 48) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile.first_name}!
                </h1>
                <p className="text-gray-600">
                  {profile.onboarding_completed ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Profile Complete • {profile.client_type} Client
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      Profile {profile.onboarding_completion_percentage}% Complete
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.openJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Timecards</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingTimecards}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeContracts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Timer className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className={`text-2xl font-bold ${getResponseTimeColor(stats.avgResponseTime)}`}>
                    {stats.avgResponseTime}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <ClientQuickActionsCard clientId={profile.id} onRefresh={loadDashboardData} />

        {/* Main Dashboard Content */}
        <div className="mt-8">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="jobs" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Management
              </TabsTrigger>
              <TabsTrigger value="applicants" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Applicant Review
              </TabsTrigger>
              <TabsTrigger value="timecards" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Timecard Approval
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-6">
              <JobManagementCard 
                clientId={profile.id} 
                onJobCreated={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="applicants" className="mt-6">
              <ApplicantReviewCard 
                clientId={profile.id} 
                onApplicationUpdate={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="timecards" className="mt-6">
              <TimecardApprovalCard 
                clientId={profile.id} 
                onTimecardAction={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <ClientContractsCard 
                clientId={profile.id}
                onContractUpdate={loadDashboardData}
              />
            </TabsContent>


            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Analytics Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      Detailed analytics and reporting features will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}