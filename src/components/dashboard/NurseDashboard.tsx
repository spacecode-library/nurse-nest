import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Eye,
  Star,
  Timer,
  DollarSign,
  Award,
  Send,
  Search,
  ChevronRight,
  ArrowUpRight,
  Activity,
  MapPin,
  Shield,
  Heart,
  UserCircle,
  Upload,
  X,
  Filter,
  Bell,
  Plus,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getNurseProfileByUserId } from '@/supabase/api/nurseProfileService';
import { getOpenJobPostings, advancedJobSearch } from '@/supabase/api/jobPostingService';
import { getApplicationsByNurse, hasApplied } from '@/supabase/api/applicationService';
import { getNurseTimecards, calculateNurseEarnings } from '@/supabase/api/timecardService';
import { getNurseContracts } from '@/supabase/api/contractService';
import JobApplicationForm from '@/components/dashboard/nurse/JobApplicationForm';

// Import dashboard cards
import JobApplicationsCard from './nurse/JobApplicationsCard';
import TimecardsCard from './nurse/TimecardsCard';
import ContractsCard from './nurse/ContractsCard';
import QuickActionsCard from './nurse/QuickActionsCard';
import NotificationsCard from './nurse/NotificationsCard';
import { supabase } from '@/integrations/supabase/client';

// Helper functions for date formatting
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

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    start: startOfWeek.toISOString().split('T')[0],
    end: endOfWeek.toISOString().split('T')[0]
  };
};

export default function NurseDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [nurseProfile, setNurseProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [eliteProgress, setEliteProgress] = useState({
    completedContracts: 0,
    isElite: false,
    nextMilestone: 3,
    benefits: ['Priority matching', 'Higher rates', 'Fast-track verification']
  });

  const [stats, setStats] = useState({
    activeApplications: 0,
    activeContracts: 0,
    pendingTimecards: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalHours: 0,
    newJobMatches: 0,
    profileViews: 0,
    responseRate: 0
  });

  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [recentTimecards, setRecentTimecards] = useState<any[]>([]);
  const [activeContracts, setActiveContracts] = useState<any[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Chat/Message related states
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Fetch unread messages count
  const fetchUnreadMessages = useCallback(async () => {
    if (!nurseProfile?.id) return;

    try {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', nurseProfile.id)
        .eq('is_read', false);

      if (error) throw error;
      setTotalUnreadMessages(count || 0);
      setHasNewMessages((count || 0) > 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, [nurseProfile?.id]);

  // Subscribe to real-time message notifications
  const subscribeToMessages = useCallback(() => {
    if (!nurseProfile?.id) return;

    const subscription = supabase
      .channel(`nurse_notifications:${nurseProfile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${nurseProfile.id}`,
        },
        (payload) => {
          setTotalUnreadMessages(prev => prev + 1);
          setHasNewMessages(true);

          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: 'You have a new message from a client about your job application',
              icon: '/favicon.ico'
            });
          }

          // Show toast notification
          toast({
            title: "💬 New Message",
            description: "You have a new message about your job application",
            action: (
              <Button
                size="sm"
                onClick={() => setActiveTab('applications')}
              >
                View
              </Button>
            ),
          });
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [nurseProfile?.id]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { data: profile } = await getNurseProfileByUserId(user.id);
      if (!profile) {
        window.location.href = '/onboarding/nurse';
        return;
      }
      setNurseProfile(profile);

      const [jobsResult, applicationsResult, timecardsResult, contractsResult] = await Promise.all([
        getOpenJobPostings(50, 0),
        getApplicationsByNurse(profile.id, 50, 0),
        getNurseTimecards(profile.id, 20, 0),
        getNurseContracts(profile.id, 20, 0)
      ]);

      const jobs = jobsResult.data || [];
      setAvailableJobs(jobs);

      const applicationChecks = await Promise.all(
        jobs.map(job => hasApplied(profile.id, job.id))
      );

      const appliedIds = new Set<string>();
      jobs.forEach((job, index) => {
        if (applicationChecks[index]?.hasApplied) {
          appliedIds.add(job.id);
        }
      });
      setAppliedJobIds(appliedIds);

      const applications = applicationsResult.data || [];
      setMyApplications(applications);
      const activeApps = applications.filter(app =>
        app.status === 'new' || app.status === 'shortlisted'
      ).length;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newJobs = jobs.filter(job => new Date(job.created_at) > yesterday);

      const timecards = timecardsResult.data || [];
      setRecentTimecards(timecards);
      const pendingTimecards = timecards.filter(tc => tc.status === 'Submitted').length;

      const contracts = contractsResult.data || [];
      const active = contracts.filter(c => c.status === 'active');
      setActiveContracts(active);

      const completedContracts = contracts.filter(c => c.status === 'completed').length;
      setEliteProgress(prev => ({
        ...prev,
        completedContracts,
        isElite: completedContracts >= 3,
        nextMilestone: completedContracts >= 3 ? 0 : 3 - completedContracts
      }));

      const weekDates = getWeekDates();
      const { earnings: weeklyEarnings } = await calculateNurseEarnings(
        profile.id,
        weekDates.start,
        weekDates.end
      );

      const currentMonth = new Date();
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const { earnings: monthlyEarnings } = await calculateNurseEarnings(
        profile.id,
        monthStart.toISOString().split('T')[0],
        monthEnd.toISOString().split('T')[0]
      );

      const totalApplications = applications.length;
      const respondedApps = applications.filter(app =>
        app.status !== 'new'
      ).length;
      const responseRate = totalApplications > 0 ? Math.round((respondedApps / totalApplications) * 100) : 0;

      setStats({
        activeApplications: activeApps,
        activeContracts: active.length,
        pendingTimecards,
        weeklyEarnings: weeklyEarnings?.totalEarnings || 0,
        monthlyEarnings: monthlyEarnings?.totalEarnings || 0,
        totalHours: monthlyEarnings?.totalHours || 0,
        newJobMatches: newJobs.length,
        profileViews: Math.floor(Math.random() * 50) + 10,
        responseRate
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

  // Initialize dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  // Initialize message functionality when nurse profile is loaded
  useEffect(() => {
    if (nurseProfile?.id) {
      fetchUnreadMessages();
      const unsubscribe = subscribeToMessages();
      
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Ensure the cleanup function is always synchronous
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [nurseProfile?.id, fetchUnreadMessages, subscribeToMessages]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    // Also refresh message count
    if (nurseProfile?.id) {
      fetchUnreadMessages();
    }
  }, [nurseProfile?.id, fetchUnreadMessages]);

  useEffect(() => {
    if (activeTab === 'overview') {
      const interval = setInterval(handleRefresh, 60000);
      return () => clearInterval(interval);
    }
  }, [activeTab, handleRefresh]);

  const handleJobSearch = async () => {
    try {
      const filters: any = {};

      if (searchTerm) filters.keywords = searchTerm;
      if (filterType && filterType !== 'all') filters.careType = filterType;

      const { data: jobs, error } = await advancedJobSearch(filters, 50, 0);
      if (error) throw error;

      setAvailableJobs(jobs || []);

      const applicationChecks = await Promise.all(
        (jobs || []).map(job => hasApplied(nurseProfile.id, job.id))
      );

      const appliedIds = new Set<string>();
      (jobs || []).forEach((job, index) => {
        if (applicationChecks[index]?.hasApplied) {
          appliedIds.add(job.id);
        }
      });
      setAppliedJobIds(appliedIds);

    } catch (error: any) {
      console.error('Error searching jobs:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search jobs. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'shortlisted': return 'bg-purple-500';
      case 'hired': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'Submitted': return 'bg-blue-500';
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      case 'Paid': return 'bg-emerald-500';
      case 'open': return 'bg-green-500';
      case 'filled': return 'bg-gray-500';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
              {eliteProgress.isElite && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Elite Nurse
                </Badge>
              )}
              {stats.newJobMatches > 0 && (
                <Badge variant="destructive">
                  {stats.newJobMatches} New Jobs
                </Badge>
              )}
              {/* New message notification badge */}
              {hasNewMessages && (
                <Badge className="bg-blue-600 text-white animate-pulse">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {totalUnreadMessages} New Message{totalUnreadMessages !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <NotificationsCard />
              
              {/* Messages button with unread count */}
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveTab('applications')}
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
                <Search className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Find Jobs</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {nurseProfile?.first_name}!
          </h2>
          <p className="text-gray-600">
            Track your applications, manage timecards, and discover new opportunities
          </p>

          <div className="mt-4 space-y-3">
            {/* New message alert */}
            {hasNewMessages && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
                  <span className="text-blue-900 font-medium">
                    You have {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''} from clients!
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-auto"
                    onClick={() => setActiveTab('applications')}
                  >
                    View Messages
                  </Button>
                </div>
              </div>
            )}

            {stats.newJobMatches > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-900 font-medium">
                    {stats.newJobMatches} new job{stats.newJobMatches !== 1 ? 's' : ''} match your preferences!
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => setActiveTab('jobs')}
                  >
                    View Jobs
                  </Button>
                </div>
              </div>
            )}

            {stats.pendingTimecards > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-amber-900 font-medium">
                    You have {stats.pendingTimecards} timecard{stats.pendingTimecards !== 1 ? 's' : ''} awaiting approval
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => setActiveTab('timecards')}
                  >
                    View Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!eliteProgress.isElite && (
          <Card className="mb-6 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Path to Elite Status</h3>
                    <p className="text-sm text-yellow-700">
                      Complete {eliteProgress.nextMilestone} more contract{eliteProgress.nextMilestone !== 1 ? 's' : ''} to unlock Elite benefits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">
                    {eliteProgress.completedContracts}/3
                  </p>
                </div>
              </div>
              <Progress
                value={(eliteProgress.completedContracts / 3) * 100}
                className="h-3 mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {eliteProgress.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-yellow-700 border-yellow-300">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 md:mb-8 overflow-x-auto pb-4">
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 min-w-max md:min-w-0">
            <Card className="border-l-4 border-l-purple-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Applications</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.activeApplications}</p>
                  </div>
                  <Send className="h-6 w-6 md:h-8 md:w-8 text-purple-500 opacity-50" />
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

            {/* Messages Card */}
            <Card className={`border-l-4 border-l-blue-500 min-w-[160px] md:min-w-0 ${hasNewMessages ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Messages</p>
                    <p className="text-xl md:text-2xl font-bold">{totalUnreadMessages}</p>
                  </div>
                  <MessageCircle className={`h-6 w-6 md:h-8 md:w-8 text-blue-500 opacity-50 ${hasNewMessages ? 'animate-pulse' : ''}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Pending</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.pendingTimecards}</p>
                  </div>
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Weekly</p>
                    <p className="text-xl md:text-2xl font-bold">${stats.weeklyEarnings}</p>
                  </div>
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Monthly</p>
                    <p className="text-xl md:text-2xl font-bold">${stats.monthlyEarnings}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-indigo-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-teal-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Hours</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.totalHours}h</p>
                  </div>
                  <Timer className="h-6 w-6 md:h-8 md:w-8 text-teal-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pink-500 min-w-[160px] md:min-w-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Response Rate</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.responseRate}%</p>
                  </div>
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-pink-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs md:text-sm">
              Jobs
              {stats.newJobMatches > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {stats.newJobMatches}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs md:text-sm">
              Applications
              {hasNewMessages && (
                <Badge className="ml-1 text-xs bg-blue-600 text-white animate-pulse">
                  {totalUnreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="timecards" className="text-xs md:text-sm">
              Timecards
              {stats.pendingTimecards > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {stats.pendingTimecards}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs md:text-sm">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <QuickActionsCard
              nurseId={nurseProfile?.id || ''}
              onRefresh={handleRefresh}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recommended Jobs</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('jobs')}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {availableJobs.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {availableJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{job.care_type}</h4>
                              <p className="text-sm text-gray-600">
                                {job.client_profiles?.first_name} {job.client_profiles?.last_name}
                              </p>
                            </div>
                            <Badge className="bg-green-500 text-white text-xs">
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {job.duration}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.preferred_time}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowApplicationModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {appliedJobIds.has(job.id) ? (
                              <Button size="sm" variant="outline" disabled>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Applied
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowApplicationModal(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                      <Briefcase className="h-12 w-12 mb-4 opacity-50" />
                      <p>No jobs available</p>
                      <Button variant="link" onClick={() => setActiveTab('jobs')}>
                        Browse all opportunities
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      My Applications
                      {hasNewMessages && (
                        <Badge className="ml-2 bg-blue-600 text-white animate-pulse">
                          {totalUnreadMessages} new
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('applications')}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {myApplications.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {myApplications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base">
                              {app.job_postings?.care_type}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              Applied {formatDate(app.created_at)}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(app.status)} text-white text-xs`}>
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                      <Send className="h-12 w-12 mb-4 opacity-50" />
                      <p>No applications yet</p>
                      <Button variant="link" onClick={() => setActiveTab('jobs')}>
                        Browse available jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <JobApplicationsCard
              nurseId={nurseProfile?.id || ''}
              onApplicationSubmitted={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="applications">
            <JobApplicationsCard
              nurseId={nurseProfile?.id || ''}
              onApplicationSubmitted={handleRefresh}
              showMyApplications={true}
            />
          </TabsContent>

          <TabsContent value="timecards">
            <TimecardsCard
              nurseId={nurseProfile?.id || ''}
              onTimecardSubmitted={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsCard
              nurseId={nurseProfile?.id || ''}
            />
          </TabsContent>
        </Tabs>
      </main>

      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto p-0">
            <JobApplicationForm
              job={selectedJob}
              nurseId={nurseProfile.id}
              onBack={() => {
                setShowApplicationModal(false);
                setSelectedJob(null);
              }}
              onApplicationSubmitted={() => {
                setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));
                handleRefresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}