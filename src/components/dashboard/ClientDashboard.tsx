// components/dashboard/ClientDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  UserCheck,
  Eye,
  Star,
  Timer,
  DollarSign,
  Home,
  Plus,
  Filter,
  Search,
  ChevronRight,
  Activity,
  Copy,
  MoreVertical,
  X,
  Bell,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getClientProfileByUserId } from '@/supabase/api/clientProfileService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob } from '@/supabase/api/applicationService';
import { getPendingTimecards, getClientTimecards, calculateClientExpenses } from '@/supabase/api/timecardService';
import { getClientContracts } from '@/supabase/api/contractService';
import { supabase } from '@/integrations/supabase/client';

// Import dashboard cards
import JobManagementCard from './client/JobManagementCard';
import ApplicantReviewCard from './client/ApplicantReviewCard';
import TimecardApprovalCard from './client/TimecardApprovalCard';
import ClientContractsCard from './client/ClientContractsCard';
import ClientQuickActionsCard from './client/ClientQuickActionsCard';
import BrowseNursesCard from './client/BrowseNursesCard';

import ClientConversationsList from '../ClientConversationList';
import ContractNotifications from '@/components/ContractNotifications';



// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleDateString('en-US', options);
};

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long',
    month: 'short', 
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add state for messages page
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingTimecards: 0,
    activeContracts: 0,
    avgResponseTime: 0,
    monthlySpend: 0,
    newApplicants: 0,
    pendingApprovals: 0
  });

  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [pendingTimecards, setPendingTimecards] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [activeContracts, setActiveContracts] = useState<any[]>([]);

  // Chat/Message related states
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Fetch unread messages count
  const fetchUnreadMessages = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get unread count from messages where client is recipient
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id) // Use user.id since messages are linked to auth users
        .eq('is_read', false);

      if (error) throw error;
      setTotalUnreadMessages(count || 0);
      setHasNewMessages((count || 0) > 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, [user?.id]);

  // Subscribe to real-time message notifications
  const subscribeToMessages = useCallback(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel(`client_notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          setTotalUnreadMessages(prev => prev + 1);
          setHasNewMessages(true);

          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: 'You have a new message from a nurse about your job posting',
              icon: '/favicon.ico'
            });
          }

          // Show toast notification
          toast({
            title: "💬 New Message",
            description: "You have a new message from a nurse",
            action: (
              <Button
                size="sm"
                onClick={() => setShowMessagesPage(true)}
              >
                View
              </Button>
            ),
          });
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user?.id]);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get client profile
      const { data: profile } = await getClientProfileByUserId(user.id);
      if (!profile) {
        window.location.href = '/onboarding/client';
        return;
      }
      setClientProfile(profile);

      // Fetch all data in parallel
      const [jobsResult, timecardsResult, contractsResult] = await Promise.all([
        getClientJobPostings(profile.id, 20, 0),
        getPendingTimecards(profile.id, 10, 0),
        getClientContracts(profile.id, 20, 0)
      ]);

      // Process jobs data
      const jobs = jobsResult.data || [];
      setRecentJobs(jobs);
      
      // Get applications for all jobs
      let totalApplications = 0;
      let newApplicants = 0;
      const applicationsPromises = jobs.map(job => getApplicationsByJob(job.id, 50, 0));
      const applicationsResults = await Promise.all(applicationsPromises);
      
      const allApplications: any[] = [];
      applicationsResults.forEach(result => {
        if (result.data) {
          allApplications.push(...result.data);
          totalApplications += result.count || 0;
          // Count new applications from last 24 hours
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          result.data.forEach(app => {
            if (new Date(app.created_at) > yesterday && app.status === 'new') {
              newApplicants++;
            }
          });
        }
      });
      
      // Sort applications by date and take recent ones
      const sortedApplications = allApplications
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
      setRecentApplications(sortedApplications);

      // Process timecards
      const pendingCards = timecardsResult.data || [];
      setPendingTimecards(pendingCards);

      // Process contracts
      const contracts = contractsResult.data || [];
      const active = contracts.filter(c => c.status === 'active');
      setActiveContracts(active);

      // Calculate stats
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      
      // Calculate monthly spend from recent timecards
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      const { expenses } = await calculateClientExpenses(
        profile.id,
        monthStart.toISOString().split('T')[0],
        monthEnd.toISOString().split('T')[0]
      );

      // Calculate average response time (mock for now)
      const avgResponseTime = Math.round(Math.random() * 24 + 12); // 12-36 hours

      setStats({
        activeJobs,
        totalApplications,
        pendingTimecards: timecardsResult.count || 0,
        activeContracts: active.length,
        avgResponseTime,
        monthlySpend: expenses?.total || 0,
        newApplicants,
        pendingApprovals: pendingCards.length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Please refresh the page to try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  // Initialize message functionality when client profile is loaded
  useEffect(() => {
    if (user?.id) {
      fetchUnreadMessages();
      const unsubscribe = subscribeToMessages();
      
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [user?.id, fetchUnreadMessages, subscribeToMessages]);

  // Function to trigger dashboard refresh
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    // Also refresh message count
    if (user?.id) {
      fetchUnreadMessages();
    }
  }, [user?.id, fetchUnreadMessages]);

  // Handle nurse contact from browse nurses
  const handleNurseContact = useCallback((nurseId: string, conversationId: string) => {
    // Show messages page when a nurse is contacted
    setShowMessagesPage(true);
    toast({
      title: "Conversation Started",
      description: "You can now chat with the nurse about your care needs."
    });
  }, []);

  // Auto-refresh every 30 seconds when on overview tab
  // useEffect(() => {
  //   if (activeTab === 'overview') {
  //     const interval = setInterval(handleRefresh, 30000);
  //     return () => clearInterval(interval);
  //   }
  // }, [activeTab, handleRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'filled': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'new': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-purple-500';
      case 'hired': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'Submitted': return 'bg-blue-500';
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      case 'Paid': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show Messages Page if showMessagesPage is true
  if (showMessagesPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientConversationsList 
          clientId={clientProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <Badge variant="outline" className="hidden md:inline-flex">
                {clientProfile?.client_type === 'family' ? 'Family Account' : 'Individual Account'}
              </Badge>
              {/* New message notification badge */}
              {hasNewMessages && (
                <Badge className="bg-blue-600 text-white animate-pulse">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {totalUnreadMessages} New Message{totalUnreadMessages !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Messages Button */}
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowMessagesPage(true)}
                className={hasNewMessages ? "bg-blue-600 hover:bg-blue-700 animate-pulse" : ""}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Messages</span>
                {totalUnreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="hidden md:inline-flex"
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                size="sm" 
                className="bg-primary-500 hover:bg-primary-600" 
                onClick={() => setActiveTab('jobs')}
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Post Job</span>
              </Button>
              <ContractNotifications 
                userId={user?.id}
                userType="client"
                profileId={clientProfile?.id}
                onNotificationClick={(contractId) => {
                  // Navigate to contracts tab and highlight specific contract
                  setActiveTab('contracts');
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {clientProfile?.first_name}!
          </h2>
          <p className="text-gray-600">
            Here's an overview of your care management activities
          </p>
          
          <div className="mt-4 space-y-3">
            {/* New message alert */}
            {hasNewMessages && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
                  <span className="text-blue-900 font-medium">
                    You have {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''} from nurses!
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-auto"
                    onClick={() => setShowMessagesPage(true)}
                  >
                    View Messages
                  </Button>
                </div>
              </div>
            )}

            {stats.newApplicants > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-900 font-medium">
                    You have {stats.newApplicants} new applicant{stats.newApplicants !== 1 ? 's' : ''} to review!
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-auto"
                    onClick={() => setActiveTab('applicants')}
                  >
                    Review Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="mb-6 md:mb-8 overflow-x-auto pb-4">
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 min-w-max md:min-w-0">
            <Card className="border-l-4 border-l-blue-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Active Jobs</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.activeJobs}</p>
                  </div>
                  <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Applications</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.totalApplications}</p>
                  </div>
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">New Today</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.newApplicants}</p>
                  </div>
                  <Bell className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Messages Card */}
            <Card className={`border-l-4 border-l-green-500 min-w-[160px] md:min-w-0 ${hasNewMessages ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Messages</p>
                    <p className="text-xl md:text-2xl font-bold">{totalUnreadMessages}</p>
                  </div>
                  <MessageCircle className={`h-6 w-6 md:h-8 md:w-8 text-green-500 opacity-50 ${hasNewMessages ? 'animate-pulse' : ''}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Pending</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Contracts</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.activeContracts}</p>
                  </div>
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Response Time</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.avgResponseTime}h</p>
                  </div>
                  <Timer className="h-6 w-6 md:h-8 md:w-8 text-indigo-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Monthly Spend</p>
                    <p className="text-xl md:text-2xl font-bold">${Math.round(stats.monthlySpend)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="browse" className="text-xs md:text-sm">
              Browse Nurses
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs md:text-sm">Jobs</TabsTrigger>
            <TabsTrigger value="applicants" className="text-xs md:text-sm">
              Applicants
              {stats.newApplicants > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {stats.newApplicants}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="timecards" className="text-xs md:text-sm">
              Timecards
              {stats.pendingApprovals > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs md:text-sm">Contracts</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs md:text-sm">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <ClientQuickActionsCard 
              clientId={clientProfile?.id || ''} 
              onRefresh={handleRefresh}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      Recent Applications
                      {hasNewMessages && (
                        <Badge className="ml-2 bg-blue-600 text-white animate-pulse">
                          {totalUnreadMessages} new
                        </Badge>
                      )}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('applicants')}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentApplications.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {recentApplications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Users className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm md:text-base">
                                {app.nurse_profiles?.first_name} {app.nurse_profiles?.last_name}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500">
                                Applied {formatDate(app.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(app.status)} text-white text-xs`}>
                              {app.status}
                              {app.status === 'new' && (
                                <span className="ml-1 animate-pulse">●</span>
                              )}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                      <Users className="h-12 w-12 mb-4 opacity-50" />
                      <p>No recent applications</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('jobs')}
                      >
                        Post a job to get started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Timecard Approvals */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pending Approvals</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('timecards')}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingTimecards.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {pendingTimecards.slice(0, 3).map((timecard) => (
                        <div key={timecard.id} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm md:text-base">
                                {timecard.nurse_profiles?.first_name} {timecard.nurse_profiles?.last_name}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500">
                                {formatShortDate(timecard.shift_date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm md:text-base">{timecard.total_hours} hrs</p>
                              <p className="text-xs md:text-sm text-gray-500">
                                ${(timecard.total_hours * 50 * 1.15).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Auto-approval in</span>
                            <span>
                              {Math.max(0, Math.floor((new Date(timecard.approval_deadline).getTime() - Date.now()) / 3600000))}h
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              Quick Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                      <Clock className="h-12 w-12 mb-4 opacity-50" />
                      <p>No pending timecards</p>
                      <p className="text-sm mt-2">Timecards will appear here for approval</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="browse">
            <BrowseNursesCard 
              clientId={clientProfile?.id || ''} 
              onNurseContact={handleNurseContact}
            />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagementCard 
              clientId={clientProfile?.id || ''} 
              onJobCreated={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantReviewCard 
              clientId={clientProfile?.id || ''} 
              onApplicationUpdate={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="timecards">
            <TimecardApprovalCard 
              clientId={clientProfile?.id || ''} 
              onTimecardAction={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="contracts">
            <ClientContractsCard 
              clientId={clientProfile?.id || ''} 
              onContractUpdate={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>Manage your payments and billing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">${Math.round(stats.monthlySpend)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Platform Fee (15%)</p>
                      <p className="text-2xl font-bold">${Math.round(stats.monthlySpend * 0.15)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Nurse Payments (85%)</p>
                      <p className="text-2xl font-bold">${Math.round(stats.monthlySpend * 0.85)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center text-gray-500 py-8">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Detailed billing breakdown coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}