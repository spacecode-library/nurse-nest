// components/dashboard/NurseDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MessageCircle,
  Sparkles,
  Trophy,
  Zap,
  Camera,
  Stethoscope,
  UserCheck,
  HeartHandshake,
  Building2
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
import ConversationsList from '@/components/ConversationList';
import { supabase } from '@/integrations/supabase/client';
import ContractNotifications from '@/components/ContractNotifications';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime,
  getWeekDates 
} from '@/lib/dateFormatting';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [nurseProfile, setNurseProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add state for messages view
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);

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
        .eq('recipient_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
      setTotalUnreadMessages(count || 0);
      setHasNewMessages((count || 0) > 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, [nurseProfile?.id, user?.id]);

  // Subscribe to real-time message notifications
  const subscribeToMessages = useCallback(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel(`nurse_notifications:${user.id}`)
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

          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: 'You have a new message from a client about your job application',
              icon: '/favicon.ico'
            });
          }

          toast({
            title: "💬 New Message",
            description: "You have a new message about your job application",
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
        app.status === 'new' || app.status === 'favorited'
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

      const weekDates = getWeekDates(Date());
      const { earnings: weeklyEarnings } = await calculateNurseEarnings(
        profile.id,
        weekDates.weekStart,
        weekDates.weekEnd,
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
    if (user?.id) {
      fetchUnreadMessages();
      const unsubscribe = subscribeToMessages();
      
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

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    if (user?.id) {
      fetchUnreadMessages();
    }
  }, [user?.id, fetchUnreadMessages]);

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    setNurseProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
    handleRefresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-medical-blue-50 text-medical-blue-700 border-medical-blue-200';
      case 'favorited': return 'bg-medical-rose-50 text-medical-rose-700 border-medical-rose-200';
      case 'hired': return 'bg-medical-success-50 text-medical-success-700 border-medical-success-200';
      case 'declined': return 'bg-medical-error-50 text-medical-error-700 border-medical-error-200';
      case 'Submitted': return 'bg-medical-blue-50 text-medical-blue-700 border-medical-blue-200';
      case 'Approved': return 'bg-medical-success-50 text-medical-success-700 border-medical-success-200';
      case 'Rejected': return 'bg-medical-error-50 text-medical-error-700 border-medical-error-200';
      case 'Paid': return 'bg-medical-purple-50 text-medical-purple-700 border-medical-purple-200';
      case 'open': return 'bg-medical-success-50 text-medical-success-700 border-medical-success-200';
      case 'filled': return 'bg-medical-neutral-100 text-medical-neutral-700 border-medical-neutral-300';
      default: return 'bg-medical-neutral-100 text-medical-neutral-700 border-medical-neutral-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-gradient-primary">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-medical-soft mx-auto flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-medical-primary border-t-transparent rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-medical-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-medical-text-primary">Loading your dashboard...</h3>
              <p className="text-medical-text-secondary">Setting up your personalized care experience</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Messages Page if showMessagesPage is true
  if (showMessagesPage) {
    return (
      <div className="min-h-screen bg-medical-gradient-primary">
        <ConversationsList 
          nurseId={nurseProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-gradient-primary">
      {/* Enhanced Medical-Grade Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-medical-border shadow-medical-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand & Profile Section */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="relative group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gradient-to-br from-medical-primary to-medical-accent shadow-medical-soft ring-2 ring-white">
                    {nurseProfile?.profile_photo_url ? (
                      <img 
                        src={nurseProfile.profile_photo_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-medical-primary to-medical-accent flex items-center justify-center">
                        <UserCircle className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                      </div>
                    )}
                  </div>
                  {eliteProgress.isElite && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-medical-accent to-medical-warning rounded-full flex items-center justify-center shadow-sm">
                      <Trophy className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg lg:text-xl font-semibold text-medical-text-primary">
                      Welcome, {nurseProfile?.first_name}
                    </h1>
                    <Shield className="h-4 w-4 text-medical-success" />
                  </div>
                  <p className="text-sm text-medical-text-secondary">Professional Care Dashboard</p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="hidden md:flex items-center space-x-3">
                {eliteProgress.isElite && (
                  <Badge className="bg-gradient-to-r from-medical-accent to-medical-warning text-white border-0 shadow-sm">
                    <Trophy className="h-3 w-3 mr-1" />
                    Elite Nurse
                  </Badge>
                )}
                {stats.newJobMatches > 0 && (
                  <Badge className="bg-medical-success text-white border-0 shadow-sm animate-pulse">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {stats.newJobMatches} New Jobs
                  </Badge>
                )}
                {hasNewMessages && (
                  <Badge className="bg-medical-primary text-white border-0 shadow-sm animate-pulse">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {totalUnreadMessages} Message{totalUnreadMessages !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <NotificationsCard />
              
              {/* Messages Button */}
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowMessagesPage(true)}
                className={`${hasNewMessages 
                  ? "bg-medical-primary hover:bg-medical-primary/90 text-white border-0 shadow-medical-soft animate-pulse" 
                  : "hover:bg-medical-primary/5 hover:border-medical-primary/30 text-medical-text-primary"
                } transition-all duration-300`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Messages</span>
                {totalUnreadMessages > 0 && (
                  <Badge className="ml-2 bg-medical-error text-white text-xs border-0 min-w-[20px] h-5">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="hidden lg:inline-flex hover:bg-medical-primary/5 hover:border-medical-primary/30 transition-all duration-300"
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button
                size="sm"
                className="bg-medical-primary hover:bg-medical-primary/90 text-white border-0 shadow-medical-soft transition-all duration-300"
                onClick={() => setActiveTab('jobs')}
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Find Jobs</span>
              </Button>
              
              <ContractNotifications
                userId={user?.id} 
                userType="nurse"
                profileId={nurseProfile?.id}
                onNotificationClick={(contractId) => {
                  setActiveTab('contracts');
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-medical-text-primary via-medical-primary to-medical-accent bg-clip-text text-transparent">
                  Your Professional Care Hub
                </h2>
                <p className="text-lg text-medical-text-secondary max-w-3xl">
                  Manage your applications, track contracts, and discover new opportunities in healthcare excellence
                </p>
              </div>
              
              {/* Professional Credentials */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-medical-soft border border-medical-border">
                  <Shield className="h-4 w-4 text-medical-success" />
                  <span className="text-sm font-medium text-medical-text-primary">Licensed Professional</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-medical-soft border border-medical-border">
                  <HeartHandshake className="h-4 w-4 text-medical-primary" />
                  <span className="text-sm font-medium text-medical-text-primary">HIPAA Compliant</span>
                </div>
                {eliteProgress.isElite && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-medical-accent to-medical-warning rounded-full px-4 py-2 shadow-medical-soft">
                    <Trophy className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Elite Status</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Picture Upload Section */}
            {!nurseProfile?.profile_photo_url && (
              <div className="w-full lg:w-auto">
                <ProfilePictureUpload
                  nurseId={nurseProfile?.id}
                  currentPhotoUrl={nurseProfile?.profile_photo_url}
                  onPhotoUpdated={handlePhotoUpdated}
                  className="max-w-sm mx-auto lg:mx-0"
                />
              </div>
            )}
          </div>

          {/* Enhanced Alert Cards */}
          <div className="mt-6 lg:mt-8 space-y-4">
            {hasNewMessages && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 border border-medical-primary/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-primary">
                        💬 You have {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''}!
                      </p>
                      <p className="text-sm text-medical-text-secondary">Stay connected with your care opportunities</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-medical-primary hover:bg-medical-primary/90 text-white shadow-medical-soft"
                    onClick={() => setShowMessagesPage(true)}
                  >
                    View Messages
                  </Button>
                </div>
              </div>
            )}

            {stats.newJobMatches > 0 && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-success/10 to-medical-accent/10 border border-medical-success/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-success rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-success">
                        ✨ {stats.newJobMatches} new position{stats.newJobMatches !== 1 ? 's' : ''} match your expertise!
                      </p>
                      <p className="text-sm text-medical-text-secondary">Perfect opportunities await your application</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-medical-success hover:bg-medical-success/90 text-white shadow-medical-soft"
                    onClick={() => setActiveTab('jobs')}
                  >
                    View Positions
                  </Button>
                </div>
              </div>
            )}

            {stats.pendingTimecards > 0 && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-warning/10 to-medical-accent/10 border border-medical-warning/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-warning rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-warning">
                        ⏰ You have {stats.pendingTimecards} timecard{stats.pendingTimecards !== 1 ? 's' : ''} awaiting approval
                      </p>
                      <p className="text-sm text-medical-text-secondary">Track your earnings progress</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-medical-warning hover:bg-medical-warning/90 text-white shadow-medical-soft"
                    onClick={() => setActiveTab('timecards')}
                  >
                    Check Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Elite Progress Card */}
        {!eliteProgress.isElite && (
          <Card className="mb-8 lg:mb-12 border-0 shadow-medical-elevated bg-gradient-to-br from-medical-accent/5 via-white to-medical-warning/5">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-medical-accent to-medical-warning rounded-full flex items-center justify-center shadow-medical-soft">
                    <Trophy className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-bold text-xl lg:text-2xl text-medical-warning mb-2">Path to Elite Status</h3>
                    <p className="text-medical-text-secondary mb-4">
                      Complete {eliteProgress.nextMilestone} more contract{eliteProgress.nextMilestone !== 1 ? 's' : ''} to unlock Elite benefits
                    </p>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm">
                      <span className="text-3xl lg:text-4xl font-bold text-medical-accent">
                        {eliteProgress.completedContracts}/3
                      </span>
                      <span className="text-medical-text-secondary">Contracts Completed</span>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-auto lg:min-w-[300px]">
                  <Progress
                    value={(eliteProgress.completedContracts / 3) * 100}
                    className="h-3 lg:h-4 mb-4"
                  />
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {eliteProgress.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="bg-white/80 text-medical-accent border-medical-accent/30">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Grid */}
        <div className="mb-8 lg:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
            {[
              { title: 'Applications', value: stats.activeApplications, icon: Send, gradient: 'from-medical-purple to-medical-primary', bgColor: 'bg-medical-purple' },
              { title: 'Contracts', value: stats.activeContracts, icon: FileText, gradient: 'from-medical-success to-medical-accent', bgColor: 'bg-medical-success' },
              { title: 'Messages', value: totalUnreadMessages, icon: MessageCircle, gradient: 'from-medical-primary to-medical-accent', bgColor: 'bg-medical-primary', pulse: hasNewMessages },
              { title: 'Pending', value: stats.pendingTimecards, icon: Clock, gradient: 'from-medical-warning to-medical-accent', bgColor: 'bg-medical-warning' },
              { title: 'Weekly', value: `$${stats.weeklyEarnings}`, icon: DollarSign, gradient: 'from-medical-success to-medical-primary', bgColor: 'bg-medical-success' },
              { title: 'Monthly', value: `$${stats.monthlyEarnings}`, icon: TrendingUp, gradient: 'from-medical-primary to-medical-accent', bgColor: 'bg-medical-primary' },
              { title: 'Hours', value: `${stats.totalHours}h`, icon: Timer, gradient: 'from-medical-accent to-medical-primary', bgColor: 'bg-medical-accent' },
              { title: 'Success Rate', value: `${stats.responseRate}%`, icon: Star, gradient: 'from-medical-rose to-medical-accent', bgColor: 'bg-medical-rose' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`border-0 shadow-medical-soft bg-white hover:shadow-medical-elevated transition-all duration-300 transform hover:-translate-y-1 ${stat.pulse ? 'animate-pulse ring-2 ring-medical-primary/20' : ''}`}>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full ${stat.bgColor} flex items-center justify-center shadow-medical-soft`}>
                        <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl lg:text-3xl font-bold text-medical-text-primary mb-1">{stat.value}</p>
                        <p className="text-xs lg:text-sm font-medium text-medical-text-secondary">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Medical-Grade Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-12 lg:h-14 bg-white/80 backdrop-blur-sm rounded-xl shadow-medical-soft border border-medical-border">
            <TabsTrigger value="overview" className="rounded-lg font-medium text-sm lg:text-base transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-lg font-medium text-sm lg:text-base transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              <span className="flex items-center space-x-2">
                <span>Jobs</span>
                {stats.newJobMatches > 0 && (
                  <Badge className="bg-medical-success text-white text-xs border-0 animate-pulse min-w-[20px] h-5">
                    {stats.newJobMatches}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-lg font-medium text-sm lg:text-base transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              Applications
            </TabsTrigger>
            <TabsTrigger value="timecards" className="rounded-lg font-medium text-sm lg:text-base transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              <span className="flex items-center space-x-2">
                <span className="hidden sm:inline">Timecards</span>
                <span className="sm:hidden">Time</span>
                {stats.pendingTimecards > 0 && (
                  <Badge className="bg-medical-warning text-white text-xs border-0 min-w-[20px] h-5">
                    {stats.pendingTimecards}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="rounded-lg font-medium text-sm lg:text-base transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              Contracts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <QuickActionsCard
              nurseId={nurseProfile?.id || ''}
              onRefresh={handleRefresh}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Enhanced Recommended Jobs Card */}
              <Card className="border-0 shadow-medical-elevated bg-gradient-to-br from-white to-medical-primary/5">
                <CardHeader className="bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 rounded-t-lg border-b border-medical-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl font-bold text-medical-text-primary">
                      <Sparkles className="h-5 w-5 mr-2 text-medical-primary" />
                      Recommended Positions
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('jobs')}
                      className="text-medical-primary hover:bg-medical-primary/10"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {availableJobs.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {availableJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-4 rounded-xl border border-medical-border hover:bg-gradient-to-r hover:from-medical-primary/5 hover:to-medical-accent/5 transition-all group cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-medical-text-primary group-hover:text-medical-primary transition-colors">{job.care_type}</h4>
                              <p className="text-sm text-medical-text-secondary flex items-center mt-1">
                                <Building2 className="h-3 w-3 mr-1" />
                                {job.client_profiles?.first_name} {job.client_profiles?.last_name}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(job.status)} border shadow-sm`}>
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-medical-text-secondary mb-3">
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
                              className="group-hover:bg-white transition-all hover:border-medical-primary hover:text-medical-primary"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {appliedJobIds.has(job.id) ? (
                              <Button size="sm" variant="outline" disabled className="bg-medical-success/10 text-medical-success border-medical-success/30">
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
                                className="bg-medical-primary hover:bg-medical-primary/90 text-white border-0 shadow-medical-soft"
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
                    <div className="flex flex-col items-center justify-center h-[300px] text-medical-text-secondary">
                      <div className="w-16 h-16 bg-medical-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-medical-neutral-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No positions available</p>
                      <Button variant="link" onClick={() => setActiveTab('jobs')} className="text-medical-primary hover:text-medical-primary/80">
                        Browse all opportunities
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced My Applications Card */}
              <Card className="border-0 shadow-medical-elevated bg-gradient-to-br from-white to-medical-purple/5">
                <CardHeader className="bg-gradient-to-r from-medical-purple/10 to-medical-rose/10 rounded-t-lg border-b border-medical-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl font-bold text-medical-text-primary">
                      My Applications
                      {hasNewMessages && (
                        <Badge className="ml-2 bg-medical-primary text-white border-0 animate-pulse">
                          {totalUnreadMessages} new
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('applications')}
                      className="text-medical-purple hover:bg-medical-purple/10"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {myApplications.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {myApplications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-medical-border hover:bg-gradient-to-r hover:from-medical-purple/5 hover:to-medical-rose/5 transition-all group">
                          <div className="flex-1">
                            <p className="font-medium text-medical-text-primary group-hover:text-medical-purple transition-colors">
                              {app.job_postings?.care_type}
                            </p>
                            <p className="text-sm text-medical-text-secondary">
                              Applied {formatRelativeTime(app.created_at)}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(app.status)} border shadow-sm`}>
                            {app.status === 'favorited' ? 'Favorite' : app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-medical-text-secondary">
                      <div className="w-16 h-16 bg-medical-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Send className="h-8 w-8 text-medical-neutral-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No applications yet</p>
                      <Button variant="link" onClick={() => setActiveTab('jobs')} className="text-medical-purple hover:text-medical-purple/80">
                        Browse available positions
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

      {/* Enhanced Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-medical-elevated max-h-[90vh] overflow-y-auto">
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