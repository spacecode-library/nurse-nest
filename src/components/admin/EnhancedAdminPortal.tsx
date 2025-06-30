// src/components/admin/EnhancedAdminPortal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  UserCheck,
  UserX,
  Search,
  Eye,
  Shield,
  DollarSign,
  TrendingUp,
  Activity,
  MessageSquare,
  XCircle,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Award,
  Building2,
  CreditCard,
  AlertCircleIcon,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser, approveNurse, denyNurse } from '@/supabase/auth/authService';
import { checkAdminStatus } from '@/supabase/api/adminService';
import {
  getPlatformMetrics,
  getDetailedNurseProfile,
  getDetailedClientProfile,
  getTimecardDisputeDetails,
  getAllTimecardDisputes,
  approveNurseRegistration,
  denyNurseRegistration,
  resolveTimecardDispute,
  getPlatformActivityFeed,
  type PlatformMetrics,
  type AdminNurseProfile,
  type AdminClientProfile,
  type TimecardDisputeDetails
} from '@/supabase/api/enhancedAdminService';
import {
  getJobStatistics,
  getDetailedJobPostings,
  getDetailedJobById,
  type JobStatistics,
  type AdminJobPosting
} from '@/supabase/api/enhancedJobAdminService';
import { getAllUsers, updateUserAccountStatus, type AdminUser } from '@/supabase/api/adminService';

// Import specialized components
import PlatformDashboard from './PlatformDashboard';
import NurseManagement from './NurseManagement';
import ClientManagement from './ClientManagement';
import DisputeResolution from './DisputeResolution';
import AnalyticsHub from './AnalyticsHub';
import JobsManagement from './JobsManagement';
import JobDetailView from './JobDetailView';

interface BreadcrumbItem {
  label: string;
  value?: string;
}

export default function EnhancedAdminPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ label: 'Dashboard' }]);
  
  // Platform metrics state
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  
  // Jobs state
  const [jobStatistics, setJobStatistics] = useState<JobStatistics | null>(null);
  const [jobs, setJobs] = useState<AdminJobPosting[]>([]);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  
  // Navigation and detail view states
  const [selectedView, setSelectedView] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [detailData, setDetailData] = useState<any>(null);
  
  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 20;

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!data?.user) {
          navigate('/auth');
          return;
        }

        const { isAdmin } = await checkAdminStatus(data.user.id);
        if (!isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        await loadInitialData();
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const loadInitialData = async () => {
    try {
      // Load platform metrics if available
      try {
        const { data: metrics } = await getPlatformMetrics();
        setPlatformMetrics(metrics);
      } catch (error) {
        console.log('Platform metrics not available, using basic data');
        // Create basic metrics from user data
        setPlatformMetrics({
          totalRevenue: 0,
          revenueGrowth: 0,
          totalUsers: 0,
          userGrowth: 0,
          activeJobs: 0,
          jobGrowth: 0,
          completedJobs: 0,
          jobCompletionRate: 0,
          averageRating: 0,
          totalDisputes: 0,
          resolvedDisputes: 0,
          disputeResolutionRate: 0,
          topPerformingNurses: [],
          recentActivity: []
        });
      }

      // Load activity feed if available
      try {
        const { data: activities } = await getPlatformActivityFeed(20);
        setActivityFeed(activities || []);
      } catch (error) {
        console.log('Activity feed not available');
        setActivityFeed([]);
      }

      // Load initial users
      await loadUsers();
      
      // Load disputes if available
      try {
        await loadDisputes();
      } catch (error) {
        console.log('Disputes not available');
        setDisputes([]);
      }
      
      // Load jobs data if available
      try {
        await loadJobs();
      } catch (error) {
        console.log('Jobs data not available');
        setJobs([]);
        setJobStatistics({
          totalJobs: 0,
          activeJobs: 0,
          completedJobs: 0,
          averageJobValue: 0,
          jobCompletionRate: 0,
          topClients: [],
          recentJobs: []
        });
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load some dashboard data",
        variant: "destructive"
      });
    }
  };

  const loadUsers = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;  
      const { data, count } = await getAllUsers(undefined, itemsPerPage, offset, searchTerm);
      
      if (data) {
        setUsers(data);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadDisputes = async () => {
    try {
      const { data } = await getAllTimecardDisputes(undefined, 20, 0);
      setDisputes(data || []);
    } catch (error) {
      console.error('Error loading disputes:', error);
      setDisputes([]);
    }
  };

  const loadJobs = async () => {
    try {
      // Load job statistics
      const { data: stats } = await getJobStatistics();
      setJobStatistics(stats);

      // Load detailed job postings
      const { data: jobsData } = await getDetailedJobPostings(undefined, 50, 0, jobSearchTerm);
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    }
  };

  // Navigation helper
  const navigateToDetail = (view: string, itemId: string, label: string) => {
    setSelectedView(view);
    setSelectedItemId(itemId);
    setDetailData(null);
    setBreadcrumbs([
      { label: 'Dashboard' },
      { label: getTabLabel(activeTab) },
      { label }
    ]);
    loadDetailData(view, itemId);
  };

  const navigateBack = () => {
    setSelectedView('');
    setSelectedItemId('');
    setDetailData(null);
    setBreadcrumbs([{ label: 'Dashboard' }, { label: getTabLabel(activeTab) }]);
  };

  const getTabLabel = (tab: string) => {
    const labels = {
      dashboard: 'Dashboard',
      nurses: 'Nurse Management',
      clients: 'Client Management',
      jobs: 'Jobs Management',
      disputes: 'Dispute Resolution',
      analytics: 'Analytics'
    };
    return labels[tab as keyof typeof labels] || tab;
  };

  const loadDetailData = async (view: string, itemId: string) => {
    try {
      setLoading(true);
      
      switch (view) {
        case 'nurse-detail':
          try {
            const { data: nurseData } = await getDetailedNurseProfile(itemId);
            setDetailData(nurseData);
          } catch (error) {
            console.error('Error loading nurse detail:', error);
            // Fallback to basic user data
            const user = users.find(u => u.user_id === itemId || u.profile_data?.id === itemId);
            setDetailData(user);
          }
          break;
        case 'client-detail':
          try {
            const { data: clientData } = await getDetailedClientProfile(itemId);
            setDetailData(clientData);
          } catch (error) {
            console.error('Error loading client detail:', error);
            const user = users.find(u => u.user_id === itemId || u.profile_data?.id === itemId);
            setDetailData(user);
          }
          break;
        case 'dispute-detail':
          const { data: disputeData } = await getTimecardDisputeDetails(itemId);
          setDetailData(disputeData);
          break;
        case 'job-detail':
          const { data: jobData } = await getDetailedJobById(itemId);
          setDetailData(jobData);
          break;
      }
    } catch (error) {
      console.error('Error loading detail data:', error);
      toast({
        title: "Error",
        description: "Failed to load detail information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNurseApproval = async (nurseId: string, approve: boolean, notes?: string) => {
    try {
      if (approve) {
        // Use our authService function
        await approveNurse(nurseId);
        toast({
          title: "Nurse Approved",
          description: "Nurse registration has been approved successfully.",
        });
      } else {
        // Use our authService function
        await denyNurse(nurseId, notes || 'Registration denied by admin');
        toast({
          title: "Nurse Denied",
          description: "Nurse registration has been denied.",
        });
      }
      
      await loadUsers();
      if (selectedView === 'nurse-detail') {
        await loadDetailData('nurse-detail', selectedItemId);
      }
    } catch (error) {
      console.error('Error handling nurse approval:', error);
      toast({
        title: "Error",
        description: "Failed to update nurse status",
        variant: "destructive"
      });
    }
  };

  const handleDisputeResolution = async (
    disputeId: string, 
    resolution: 'approve_timecard' | 'deny_timecard' | 'partial_approval',
    notes: string,
    adjustedHours?: number
  ) => {
    try {
      await resolveTimecardDispute(disputeId, resolution, notes, adjustedHours);
      toast({
        title: "Dispute Resolved",
        description: "Timecard dispute has been resolved successfully.",
      });
      
      await loadDisputes();
      if (selectedView === 'dispute-detail') {
        await loadDetailData('dispute-detail', selectedItemId);
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      toast({
        title: "Error",
        description: "Failed to resolve dispute",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading && !platformMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">Loading Admin Portal...</h3>
            <p className="text-slate-600">Preparing comprehensive platform insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Nurse Nest Admin</h1>
                  <p className="text-sm text-slate-600">Platform Command Center</p>
                </div>
              </div>
              
              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="h-4 w-4" />}
                    <span className={index === breadcrumbs.length - 1 ? 'font-medium text-slate-800' : 'hover:text-slate-800 cursor-pointer'}>
                      {crumb.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedView && (
                <Button variant="outline" onClick={navigateBack} size="sm">
                  Back
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                size="sm"
              >
                Main Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedView ? (
          // Main admin interface
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 h-12 bg-white rounded-lg shadow-sm border border-slate-200">
              <TabsTrigger value="dashboard" className="rounded-md font-medium transition-all">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="nurses" className="rounded-md font-medium transition-all">
                <span className="flex items-center space-x-2">
                  <span>Nurses</span>
                  {users.filter(u => u.user_type === 'nurse' && u.account_status === 'pending' && u.profile_data?.onboarding_completed).length > 0 && (
                    <Badge className="bg-orange-600 text-white text-xs animate-pulse">
                      {users.filter(u => u.user_type === 'nurse' && u.account_status === 'pending' && u.profile_data?.onboarding_completed).length}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="rounded-md font-medium transition-all">
                Clients
              </TabsTrigger>
              <TabsTrigger value="jobs" className="rounded-md font-medium transition-all">
                Jobs
              </TabsTrigger>
              <TabsTrigger value="disputes" className="rounded-md font-medium transition-all">
                <span className="flex items-center space-x-2">
                  <span>Disputes</span>
                  {disputes.filter(d => d.status === 'pending').length > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {disputes.filter(d => d.status === 'pending').length}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-md font-medium transition-all">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              {platformMetrics && PlatformDashboard ? (
                <PlatformDashboard 
                  metrics={platformMetrics}
                  activityFeed={activityFeed}
                  onNavigate={navigateToDetail}
                  onRefresh={loadInitialData}
                />
              ) : (
                <BasicDashboard 
                  users={users}
                  disputes={disputes}
                  onNavigate={navigateToDetail}
                  onRefresh={loadInitialData}
                />
              )}
            </TabsContent>

            <TabsContent value="nurses">
              <NurseManagement 
                users={users.filter(u => u.user_type === 'nurse')}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onViewDetails={(nurseId, name) => navigateToDetail('nurse-detail', nurseId, `Nurse: ${name}`)}
                onApproval={handleNurseApproval}
                onRefresh={loadUsers}
              />
            </TabsContent>

            <TabsContent value="clients">
              {ClientManagement ? (
                <ClientManagement 
                  users={users.filter(u => u.user_type === 'client')}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onViewDetails={(clientId, name) => navigateToDetail('client-detail', clientId, `Client: ${name}`)}
                  onRefresh={loadUsers}
                />
              ) : (
                <BasicClientManagement 
                  users={users.filter(u => u.user_type === 'client')}
                  onRefresh={loadUsers}
                />
              )}
            </TabsContent>

            <TabsContent value="jobs">
              {JobsManagement ? (
                <JobsManagement 
                  jobs={jobs}
                  statistics={jobStatistics}
                  searchTerm={jobSearchTerm}
                  onSearchChange={setJobSearchTerm}
                  onViewDetails={(jobId, jobCode) => navigateToDetail('job-detail', jobId, `Job: ${jobCode}`)}
                  onRefresh={loadJobs}
                />
              ) : (
                <BasicJobsManagement onRefresh={loadJobs} />
              )}
            </TabsContent>

            <TabsContent value="disputes">
              {DisputeResolution ? (
                <DisputeResolution 
                  disputes={disputes}
                  onViewDetails={(disputeId) => navigateToDetail('dispute-detail', disputeId, 'Dispute Resolution')}
                  onResolve={handleDisputeResolution}
                  onRefresh={loadDisputes}
                />
              ) : (
                <BasicDisputeManagement 
                  disputes={disputes}
                  onRefresh={loadDisputes}
                />
              )}
            </TabsContent>

            <TabsContent value="analytics">
              {AnalyticsHub ? (
                <AnalyticsHub 
                  metrics={platformMetrics}
                  onRefresh={loadInitialData}
                />
              ) : (
                <BasicAnalytics 
                  users={users}
                  disputes={disputes}
                />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // Detail views
          <div className="space-y-6">
            {selectedView === 'nurse-detail' && detailData && (
              <NurseDetailView 
                nurse={detailData}
                onApproval={handleNurseApproval}
                onRefresh={() => loadDetailData('nurse-detail', selectedItemId)}
              />
            )}

            {selectedView === 'client-detail' && detailData && (
              <ClientDetailView 
                client={detailData}
                onRefresh={() => loadDetailData('client-detail', selectedItemId)}
              />
            )}

            {selectedView === 'dispute-detail' && detailData && (
              <DisputeDetailView 
                dispute={detailData}
                onResolve={handleDisputeResolution}
                onRefresh={() => loadDetailData('dispute-detail', selectedItemId)}
              />
            )}

            {selectedView === 'job-detail' && detailData && JobDetailView && (
              <JobDetailView 
                job={detailData}
                onRefresh={() => loadDetailData('job-detail', selectedItemId)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Basic Dashboard Component (fallback)
function BasicDashboard({ 
  users, 
  disputes, 
  onNavigate, 
  onRefresh 
}: { 
  users: AdminUser[]; 
  disputes: any[]; 
  onNavigate: (view: string, itemId: string, label: string) => void;
  onRefresh: () => void;
}) {
  const pendingNurses = users.filter(u => u.user_type === 'nurse' && u.account_status === 'pending' && u.profile_data?.onboarding_completed);
  const activeNurses = users.filter(u => u.user_type === 'nurse' && u.account_status === 'active');
  const totalClients = users.filter(u => u.user_type === 'client');
  const pendingDisputes = disputes.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-600">Platform overview and key metrics</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Nurses</p>
                <h3 className="text-3xl font-bold">{users.filter(u => u.user_type === 'nurse').length}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Clients</p>
                <h3 className="text-3xl font-bold">{totalClients.length}</h3>
              </div>
              <Building2 className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                <h3 className="text-3xl font-bold">{pendingNurses.length}</h3>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Active Disputes</p>
                <h3 className="text-3xl font-bold">{pendingDisputes.length}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Pending Nurse Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingNurses.length > 0 ? (
              <div className="space-y-3">
                {pendingNurses.slice(0, 5).map((nurse) => (
                  <div key={nurse.user_id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{nurse.profile_data?.first_name} {nurse.profile_data?.last_name}</p>
                      <p className="text-sm text-gray-600">{nurse.email}</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      Pending
                    </Badge>
                  </div>
                ))}
                {pendingNurses.length > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{pendingNurses.length - 5} more pending approvals
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-600">No pending approvals</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.profile_data?.first_name} {user.profile_data?.last_name}</p>
                    <p className="text-sm text-gray-600">{user.user_type} • {new Date(user.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline">
                    {user.account_status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Basic fallback components
function BasicClientManagement({ users, onRefresh }: { users: AdminUser[]; onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Management</CardTitle>
        <CardDescription>View and manage client accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Client Management</h3>
          <p className="text-gray-600 mb-4">Total Clients: {users.length}</p>
          <Button onClick={onRefresh} variant="outline">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BasicJobsManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs Management</CardTitle>
        <CardDescription>Manage job postings and applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Jobs Management</h3>
          <p className="text-gray-600 mb-4">Job management functionality coming soon</p>
          <Button onClick={onRefresh} variant="outline">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BasicDisputeManagement({ disputes, onRefresh }: { disputes: any[]; onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Management</CardTitle>
        <CardDescription>Handle timecard disputes and resolutions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Dispute Management</h3>
          <p className="text-gray-600 mb-4">Total Disputes: {disputes.length}</p>
          <Button onClick={onRefresh} variant="outline">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BasicAnalytics({ users, disputes }: { users: AdminUser[]; disputes: any[] }) {
  const nurses = users.filter(u => u.user_type === 'nurse');
  const clients = users.filter(u => u.user_type === 'client');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>Basic platform statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">{nurses.length}</h3>
              <p className="text-sm text-gray-600">Total Nurses</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">{clients.length}</h3>
              <p className="text-sm text-gray-600">Total Clients</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">
                {nurses.filter(n => n.account_status === 'pending').length}
              </h3>
              <p className="text-sm text-gray-600">Pending Approvals</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="text-2xl font-bold text-red-600">{disputes.length}</h3>
              <p className="text-sm text-gray-600">Total Disputes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual detail view components (simplified versions)
function NurseDetailView({ 
  nurse, 
  onApproval, 
  onRefresh 
}: { 
  nurse: AdminNurseProfile | AdminUser; 
  onApproval: (nurseId: string, approve: boolean, notes?: string) => void;
  onRefresh: () => void;
}) {
  const [approvalNotes, setApprovalNotes] = useState('');
  const isAdminUser = 'user_id' in nurse;
  const isPending = isAdminUser ? nurse.account_status === 'pending' : !nurse.onboarding_completed;

  return (
    <div className="space-y-6">
      {/* Nurse Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isAdminUser 
                    ? `${nurse.profile_data?.first_name || ''} ${nurse.profile_data?.last_name || ''}` 
                    : `${nurse.first_name} ${nurse.last_name}`}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{isAdminUser ? nurse.email : nurse.email}</span>
                  </div>
                  {(isAdminUser ? nurse.profile_data?.phone_number : nurse.phone_number) && (
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{isAdminUser ? nurse.profile_data?.phone_number : nurse.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={isPending ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                {isPending ? 'Pending Approval' : 'Approved'}
              </Badge>
              <p className="text-sm text-slate-600 mt-1">
                Joined {new Date(isAdminUser ? nurse.created_at || '' : nurse.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Section */}
      {isPending && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Nurse Approval Required
            </CardTitle>
            <CardDescription>
              Review all nurse information and approve or deny their registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="approval-notes">Admin Notes</Label>
              <Textarea
                id="approval-notes"
                placeholder="Add any notes about this approval decision..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => onApproval(isAdminUser ? nurse.user_id : nurse.id, true, approvalNotes)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Nurse
              </Button>
              <Button 
                variant="outline"
                onClick={() => onApproval(isAdminUser ? nurse.user_id : nurse.id, false, approvalNotes)}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deny Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Email: {isAdminUser ? nurse.email : nurse.email}</p>
                {(isAdminUser ? nurse.profile_data?.phone_number : nurse.phone_number) && (
                  <p>Phone: {isAdminUser ? nurse.profile_data?.phone_number : nurse.phone_number}</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Account Status</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Status: {isAdminUser ? nurse.account_status : (nurse.onboarding_completed ? 'Active' : 'Pending')}</p>
                <p>User Type: Nurse</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientDetailView({ 
  client, 
  onRefresh 
}: { 
  client: AdminClientProfile | AdminUser; 
  onRefresh: () => void;
}) {
  const isAdminUser = 'user_id' in client;

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isAdminUser 
                    ? `${client.profile_data?.first_name || ''} ${client.profile_data?.last_name || ''}` 
                    : `${client.first_name} ${client.last_name}`}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{isAdminUser ? client.email : client.email}</span>
                  </div>
                  {(isAdminUser ? client.profile_data?.phone_number : client.phone_number) && (
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{isAdminUser ? client.profile_data?.phone_number : client.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Email: {isAdminUser ? client.email : client.email}</p>
                {(isAdminUser ? client.profile_data?.phone_number : client.phone_number) && (
                  <p>Phone: {isAdminUser ? client.profile_data?.phone_number : client.phone_number}</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Account Details</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Status: {isAdminUser ? client.account_status : 'Active'}</p>
                <p>User Type: Client</p>
                <p>Joined: {new Date(isAdminUser ? client.created_at || '' : client.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DisputeDetailView({ 
  dispute, 
  onResolve, 
  onRefresh 
}: { 
  dispute: TimecardDisputeDetails; 
  onResolve: (disputeId: string, resolution: 'approve_timecard' | 'deny_timecard' | 'partial_approval', notes: string, adjustedHours?: number) => void;
  onRefresh: () => void;
}) {
  const [resolutionNotes, setResolutionNotes] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Details</CardTitle>
        <CardDescription>Dispute ID: {dispute.dispute.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Resolution Notes</h4>
            <Textarea
              placeholder="Add resolution notes..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => onResolve(dispute.dispute.id, 'approve_timecard', resolutionNotes)}
              className="bg-green-600 hover:bg-green-700"
              disabled={!resolutionNotes.trim()}
            >
              Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onResolve(dispute.dispute.id, 'deny_timecard', resolutionNotes)}
              disabled={!resolutionNotes.trim()}
            >
              Deny
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}