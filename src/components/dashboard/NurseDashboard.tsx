// components/dashboard/NurseDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Bell, 
  Award, 
  Plus,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import API services
import { getNurseProfileByUserId } from '@/supabase/api/nurseProfileService';
import { getApplicationsByNurse } from '@/supabase/api/applicationService';
import { getNurseTimecards } from '@/supabase/api/timecardService';
import { getNurseContracts } from '@/supabase/api/contractService';
import { getOpenJobPostings } from '@/supabase/api/jobPostingService';

// Import sub-components
import QuickActionsCard from './nurse/QuickActionsCard';
import JobApplicationsCard from './nurse/JobApplicationsCard';
import TimecardsCard from './nurse/TimecardsCard';
import ContractsCard from './nurse/ContractsCard';
import NotificationsCard from './nurse/NotificationsCard';
import LoyaltyProgressCard from './nurse/LoyaltyProgressCard';

interface NurseProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
}

interface DashboardStats {
  activeApplications: number;
  pendingTimecards: number;
  activeContracts: number;
  totalEarnings: number;
  completedContracts: number;
}

export default function NurseDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeApplications: 0,
    pendingTimecards: 0,
    activeContracts: 0,
    totalEarnings: 0,
    completedContracts: 0
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

      // Load nurse profile
      const { data: profileData, error: profileError } = await getNurseProfileByUserId(user!.id);
      if (profileError) throw profileError;
      
      if (!profileData) {
        // User doesn't have a nurse profile, redirect to onboarding
        navigate('/onboarding/nurse');
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

  const loadDashboardStats = async (nurseId: string) => {
    try {
      // Load applications
      const { data: applications } = await getApplicationsByNurse(nurseId, 100, 0);
      const activeApplications = applications?.filter(app => 
        app.status === 'new' || app.status === 'shortlisted'
      ).length || 0;

      // Load timecards
      const { data: timecards } = await getNurseTimecards(nurseId, 100, 0);
      const pendingTimecards = timecards?.filter(tc => 
        tc.status === 'Submitted'
      ).length || 0;

      // Calculate earnings from approved/paid timecards
      const totalEarnings = timecards?.filter(tc => 
        tc.status === 'Approved' || tc.status === 'Auto-Approved' || tc.status === 'Paid'
      ).reduce((sum, tc) => sum + (tc.total_hours * 50), 0) || 0; // Using $50/hour as placeholder

      // Load contracts
      const { data: contracts } = await getNurseContracts(nurseId, 100, 0);
      const activeContracts = contracts?.filter(contract => 
        contract.status === 'active'
      ).length || 0;
      const completedContracts = contracts?.filter(contract => 
        contract.status === 'completed'
      ).length || 0;

      setStats({
        activeApplications,
        pendingTimecards,
        activeContracts,
        totalEarnings,
        completedContracts
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
            Please complete your nurse profile to access the dashboard.
          </p>
          <Button onClick={() => navigate('/onboarding/nurse')}>
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                src={profile.profile_photo_url || '/api/placeholder/64/64'}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile.first_name}!
                </h1>
                <p className="text-gray-600">
                  {profile.onboarding_completed ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Profile Complete
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
              <NotificationsCard />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedContracts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActionsCard nurseId={profile.id} onRefresh={loadDashboardData} />

        {/* Main Dashboard Content */}
        <div className="mt-8">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="jobs" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Search
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                My Applications
              </TabsTrigger>
              <TabsTrigger value="timecards" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Timecards
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Loyalty Program
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-6">
              <JobApplicationsCard 
                nurseId={profile.id} 
                onApplicationSubmitted={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* This will be handled by JobApplicationsCard component */}
                  <JobApplicationsCard 
                    nurseId={profile.id} 
                    onApplicationSubmitted={loadDashboardData}
                    showMyApplications={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timecards" className="mt-6">
              <TimecardsCard 
                nurseId={profile.id} 
                onTimecardSubmitted={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <ContractsCard nurseId={profile.id} />
            </TabsContent>

            <TabsContent value="loyalty" className="mt-6">
              <LoyaltyProgressCard 
                completedContracts={stats.completedContracts}
                nurseId={profile.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}