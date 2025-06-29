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
import { getCurrentUser } from '@/supabase/auth/authService';
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
      // Load platform metrics
      const { data: metrics } = await getPlatformMetrics();
      setPlatformMetrics(metrics);

      // Load activity feed
      const { data: activities } = await getPlatformActivityFeed(20);
      setActivityFeed(activities);

      // Load initial users
      await loadUsers();
      
      // Load disputes
      await loadDisputes();
      
      // Load jobs data
      await loadJobs();
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
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
          const { data: nurseData } = await getDetailedNurseProfile(itemId);
          setDetailData(nurseData);
          break;
        case 'client-detail':
          const { data: clientData } = await getDetailedClientProfile(itemId);
          setDetailData(clientData);
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
        await approveNurseRegistration(nurseId, notes);
        toast({
          title: "Nurse Approved",
          description: "Nurse registration has been approved successfully.",
        });
      } else {
        await denyNurseRegistration(nurseId, notes || 'Registration denied by admin');
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
                Nurses
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
              <PlatformDashboard 
                metrics={platformMetrics}
                activityFeed={activityFeed}
                onNavigate={navigateToDetail}
                onRefresh={loadInitialData}
              />
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
              <ClientManagement 
                users={users.filter(u => u.user_type === 'client')}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onViewDetails={(clientId, name) => navigateToDetail('client-detail', clientId, `Client: ${name}`)}
                onRefresh={loadUsers}
              />
            </TabsContent>

            <TabsContent value="jobs">
              <JobsManagement 
                jobs={jobs}
                statistics={jobStatistics}
                searchTerm={jobSearchTerm}
                onSearchChange={setJobSearchTerm}
                onViewDetails={(jobId, jobCode) => navigateToDetail('job-detail', jobId, `Job: ${jobCode}`)}
                onRefresh={loadJobs}
              />
            </TabsContent>

            <TabsContent value="disputes">
              <DisputeResolution 
                disputes={disputes}
                onViewDetails={(disputeId) => navigateToDetail('dispute-detail', disputeId, 'Dispute Resolution')}
                onResolve={handleDisputeResolution}
                onRefresh={loadDisputes}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsHub 
                metrics={platformMetrics}
                onRefresh={loadInitialData}
              />
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

            {selectedView === 'job-detail' && detailData && (
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

// Individual detail view components
function NurseDetailView({ 
  nurse, 
  onApproval, 
  onRefresh 
}: { 
  nurse: AdminNurseProfile; 
  onApproval: (nurseId: string, approve: boolean, notes?: string) => void;
  onRefresh: () => void;
}) {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalSection, setShowApprovalSection] = useState(!nurse.onboarding_completed);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Nurse Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                {nurse.profile_photo_url ? (
                  <img src={nurse.profile_photo_url} alt={nurse.first_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Users className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{nurse.first_name} {nurse.last_name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{nurse.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{nurse.phone_number}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{nurse.city}, {nurse.state}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={nurse.onboarding_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {nurse.onboarding_completed ? 'Approved' : 'Pending Approval'}
              </Badge>
              <p className="text-sm text-slate-600 mt-1">Joined {new Date(nurse.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Section */}
      {showApprovalSection && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
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
                onClick={() => onApproval(nurse.id, true, approvalNotes)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Nurse
              </Button>
              <Button 
                variant="outline"
                onClick={() => onApproval(nurse.id, false, approvalNotes)}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deny Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{nurse.totalApplications}</p>
                <p className="text-sm text-slate-600">Applications</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{nurse.acceptedApplications}</p>
                <p className="text-sm text-slate-600">Accepted</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{nurse.activeContracts}</p>
                <p className="text-sm text-slate-600">Active</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">${nurse.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Information */}
        <Card>
          <CardHeader>
            <CardTitle>Licenses & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nurse.licenses.map((license) => (
              <div key={license.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{license.license_type}</p>
                    <p className="text-sm text-slate-600">{license.license_number}</p>
                  </div>
                  <Badge className={getStatusColor(license.verification_status)}>
                    {license.verification_status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">
                  <p>State: {license.issuing_state}</p>
                  <p>Expires: {new Date(license.expiration_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            
            {nurse.certifications.map((cert) => (
              <div key={cert.id} className="p-3 border rounded-lg">
                <p className="font-medium">{cert.certification_name}</p>
                {cert.is_malpractice_insurance && (
                  <Badge className="bg-blue-100 text-blue-800 mt-1">Malpractice Insurance</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Qualifications & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nurse.qualifications && (
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <p className="text-sm text-slate-600">{nurse.qualifications.education_level}</p>
                <p className="text-sm text-slate-600">{nurse.qualifications.school_name} ({nurse.qualifications.graduation_year})</p>
                <p className="text-sm text-slate-600">{nurse.qualifications.years_experience} years experience</p>
                
                <h4 className="font-medium mt-3 mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {nurse.qualifications.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {nurse.preferences && (
              <div>
                <h4 className="font-medium mb-2">Preferences</h4>
                <p className="text-sm text-slate-600">Rate: ${nurse.preferences.desired_hourly_rate}/hr</p>
                <p className="text-sm text-slate-600">Travel: {nurse.preferences.travel_radius} miles</p>
                
                <div className="mt-2">
                  <p className="text-xs font-medium text-slate-700">Preferred Shifts:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {nurse.preferences.preferred_shifts.map((shift, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {shift}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      {nurse.bio && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{nurse.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ClientDetailView({ 
  client, 
  onRefresh 
}: { 
  client: AdminClientProfile; 
  onRefresh: () => void;
}) {
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
                <h2 className="text-2xl font-bold text-slate-800">{client.first_name} {client.last_name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone_number}</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {client.client_type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={client.onboarding_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {client.onboarding_completed ? 'Active' : 'Incomplete Setup'}
              </Badge>
              <p className="text-sm text-slate-600 mt-1">Joined {new Date(client.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{client.totalJobPostings}</p>
                <p className="text-sm text-slate-600">Jobs Posted</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{client.hiredNurses}</p>
                <p className="text-sm text-slate-600">Nurses Hired</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">${client.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Spent</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">${client.averageHourlyRate.toFixed(0)}</p>
                <p className="text-sm text-slate-600">Avg Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Recipients */}
        <Card>
          <CardHeader>
            <CardTitle>Care Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.care_recipients.map((recipient) => (
              <div key={recipient.id} className="p-3 border rounded-lg">
                <p className="font-medium">{recipient.first_name} {recipient.last_name}</p>
                <p className="text-sm text-slate-600">Age: {recipient.age}</p>
              </div>
            ))}
            {client.care_recipients.length === 0 && (
              <p className="text-sm text-slate-500 italic">No care recipients added</p>
            )}
          </CardContent>
        </Card>

        {/* Care Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Care Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.care_locations.map((location) => (
              <div key={location.id} className="p-3 border rounded-lg">
                <p className="font-medium">{location.street_address}</p>
                <p className="text-sm text-slate-600">{location.city}, {location.state} {location.zip_code}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {location.home_environment}
                </Badge>
              </div>
            ))}
            {client.care_locations.length === 0 && (
              <p className="text-sm text-slate-500 italic">No locations added</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Care Needs */}
      {client.care_needs && (
        <Card>
          <CardHeader>
            <CardTitle>Care Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Care Types</h4>
                <div className="flex flex-wrap gap-1">
                  {client.care_needs.care_types.map((type, index) => (
                    <Badge key={index} variant="outline">{type}</Badge>
                  ))}
                </div>
                
                <h4 className="font-medium mt-3 mb-2">Schedule</h4>
                <div className="flex flex-wrap gap-1">
                  {client.care_needs.care_schedule.map((schedule, index) => (
                    <Badge key={index} variant="outline">{schedule}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <p className="text-sm text-slate-600">Hours per week: {client.care_needs.hours_per_week}</p>
                
                <h4 className="font-medium mt-3 mb-2">Special Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {client.care_needs.special_skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
                
                <h4 className="font-medium mt-3 mb-2">Health Conditions</h4>
                <div className="flex flex-wrap gap-1">
                  {client.care_needs.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700">{condition}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {client.care_needs.additional_notes && (
              <div>
                <h4 className="font-medium mb-2">Additional Notes</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{client.care_needs.additional_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
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
  const [adjustedHours, setAdjustedHours] = useState(dispute.timecard.total_hours);
  const [showResolutionForm, setShowResolutionForm] = useState(dispute.dispute.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Dispute Header */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-red-800">Timecard Dispute</h2>
              <p className="text-red-600 mt-1">
                Initiated by {dispute.dispute.initiated_by_type} on {new Date(dispute.dispute.created_at).toLocaleDateString()}
              </p>
              <p className="text-slate-600 mt-1">Dispute ID: {dispute.dispute.id}</p>
            </div>
            <Badge className={dispute.dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
              {dispute.dispute.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Form */}
      {showResolutionForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Resolve Dispute</CardTitle>
            <CardDescription>Review the evidence and make a decision on this timecard dispute.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Explain your decision and reasoning..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="adjusted-hours">Adjusted Hours (if partial approval)</Label>
              <Input
                id="adjusted-hours"
                type="number"
                step="0.25"
                value={adjustedHours}
                onChange={(e) => setAdjustedHours(parseFloat(e.target.value))}
                className="mt-1 max-w-32"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => onResolve(dispute.dispute.id, 'approve_timecard', resolutionNotes)}
                className="bg-green-600 hover:bg-green-700"
                disabled={!resolutionNotes.trim()}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Timecard
              </Button>
              <Button 
                onClick={() => onResolve(dispute.dispute.id, 'partial_approval', resolutionNotes, adjustedHours)}
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={!resolutionNotes.trim() || adjustedHours === dispute.timecard.total_hours}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Partial Approval ({adjustedHours}h)
              </Button>
              <Button 
                variant="outline"
                onClick={() => onResolve(dispute.dispute.id, 'deny_timecard', resolutionNotes)}
                className="border-red-600 text-red-600 hover:bg-red-50"
                disabled={!resolutionNotes.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deny Timecard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nurse Information */}
        <Card>
          <CardHeader>
            <CardTitle>Nurse Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{dispute.nurse.first_name} {dispute.nurse.last_name}</p>
                <p className="text-sm text-slate-600">{dispute.nurse.email}</p>
                <p className="text-sm text-slate-600">{dispute.nurse.phone_number}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Total Earnings</p>
                  <p className="font-medium">${dispute.nurse.totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-600">Active Contracts</p>
                  <p className="font-medium">{dispute.nurse.activeContracts}</p>
                </div>
              </div>
            </div>

            {dispute.dispute.nurse_evidence && (
              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2">Nurse Evidence</h4>
                <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded-lg">{dispute.dispute.nurse_evidence}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{dispute.client.first_name} {dispute.client.last_name}</p>
                <p className="text-sm text-slate-600">{dispute.client.email}</p>
                <p className="text-sm text-slate-600">{dispute.client.phone_number}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Activity</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Total Spent</p>
                  <p className="font-medium">${dispute.client.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-600">Nurses Hired</p>
                  <p className="font-medium">{dispute.client.hiredNurses}</p>
                </div>
              </div>
            </div>

            {dispute.dispute.client_evidence && (
              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2">Client Evidence</h4>
                <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg">{dispute.dispute.client_evidence}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timecard Details */}
      <Card>
        <CardHeader>
          <CardTitle>Disputed Timecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Shift Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">{new Date(dispute.timecard.shift_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Start Time:</span>
                  <span className="font-medium">{dispute.timecard.start_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">End Time:</span>
                  <span className="font-medium">{dispute.timecard.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Hours:</span>
                  <span className="font-medium">{dispute.timecard.total_hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Job Code:</span>
                  <span className="font-medium">{dispute.timecard.job_code}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Financial Details</h4>
              <div className="space-y-2 text-sm">
                {dispute.timecard.hourly_rate_at_time && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hourly Rate:</span>
                    <span className="font-medium">${dispute.timecard.hourly_rate_at_time}/hr</span>
                  </div>
                )}
                {dispute.timecard.payment_amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Amount:</span>
                    <span className="font-medium">${dispute.timecard.payment_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge className={dispute.timecard.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {dispute.timecard.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Dispute Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Reason:</span>
                  <span className="font-medium">{dispute.dispute.dispute_reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Initiated By:</span>
                  <span className="font-medium capitalize">{dispute.dispute.initiated_by_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="font-medium">{new Date(dispute.dispute.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {dispute.timecard.notes && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Timecard Notes</h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{dispute.timecard.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversations */}
      {dispute.conversations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
            <CardDescription>Messages between nurse and client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dispute.conversations.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.sender_type === 'nurse' 
                      ? 'bg-blue-50 text-blue-900 ml-auto' 
                      : 'bg-green-50 text-green-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium capitalize">{message.sender_type}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message_content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}