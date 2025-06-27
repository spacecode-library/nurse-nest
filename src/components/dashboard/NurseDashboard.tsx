// components/dashboard/NurseDashboard.tsx - PRODUCTION READY VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
  Eye,
  Send,
  Search,
  ChevronRight,
  Activity,
  Shield,
  Upload,
  Bell,
  Plus,
  MessageCircle,
  Sparkles,
  Trophy,
  Zap,
  Stethoscope,
  HeartHandshake,
  Building2,
  CreditCard,
  Loader2,
  Home,
  LogOut,
  Menu,
  Users,
  ClipboardCheck,
  Receipt,
  DollarSign,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getNurseProfileByUserId } from '@/supabase/api/nurseProfileService';
import { getOpenJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByNurse, hasApplied } from '@/supabase/api/applicationService';
import { getNurseTimecards, calculateNurseEarnings } from '@/supabase/api/timecardService';

// Import Checkr integration
import { getNursePendingBackgroundChecks } from '@/supabase/api/checkrService';
import PendingBackgroundChecksCard from './nurse/PendingBackgroundChecksCard';

import JobApplicationForm from '@/components/dashboard/nurse/JobApplicationForm';

// Import dashboard cards
import JobApplicationsCard from './nurse/JobApplicationsCard';
import TimecardsCard from './nurse/TimecardsCard';
import QuickActionsCard from './nurse/QuickActionsCard';
import NotificationsCard from './nurse/NotificationsCard';
import QuickApplyWidget from './nurse/QuickApplyWidget';

// Import payment components
import StripeOnboardingCard from './nurse/StripeOnboardingCard';
import EnhancedTimecardSubmissionForm from './nurse/EnhancedTimecardSubmissionForm';

import ConversationsList from '@/components/ConversationList';
import { supabase } from '@/integrations/supabase/client';
import ProfilePictureUpload from './nurse/ProfilePictureUpload';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime,
  getWeekDates 
} from '@/lib/dateFormatting';

// Import payment utilities
import { formatCurrency } from '@/supabase/api/stripeConnectService';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [nurseProfile, setNurseProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Background checks state
  const [pendingBackgroundChecksCount, setPendingBackgroundChecksCount] = useState(0);
  
  // Messages and modals state
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showEnhancedTimecardForm, setShowEnhancedTimecardForm] = useState(false);
  const [showMandatoryProfilePicture, setShowMandatoryProfilePicture] = useState(false);

  const [eliteProgress, setEliteProgress] = useState({
    completedContracts: 0,
    isElite: false,
    nextMilestone: 3,
    benefits: ['Priority matching', 'Higher rates', 'Fast-track verification']
  });

  const [stats, setStats] = useState({
    activeApplications: 0,
    pendingInvoices: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalHours: 0,
    newJobMatches: 0,
    profileViews: 0,
    responseRate: 0,
    pendingPayments: 0,
    totalEarningsThisMonth: 0,
    averageHourlyRate: 0,
    paymentAccountStatus: 'not_started'
  });

  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Chat/Message related states
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  // Fetch pending background checks count
  const fetchPendingBackgroundChecksCount = useCallback(async () => {
    try {
      if (!nurseProfile?.id) return;
      
      const { data, error } = await getNursePendingBackgroundChecks(nurseProfile.id);
      if (!error && data) {
        setPendingBackgroundChecksCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching pending background checks count:', error);
    }
  }, [nurseProfile?.id]);

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

      // Check if profile picture is mandatory and missing
      if (!profile.profile_photo_url || profile.profile_photo_url.trim() === '') {
        setShowMandatoryProfilePicture(true);
        setLoading(false);
        return;
      }

      const [jobsResult, applicationsResult, invoicesResult] = await Promise.all([
        getOpenJobPostings(50, 0),
        getApplicationsByNurse(profile.id, 50, 0),
        getNurseTimecards(profile.id, 20, 0),
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

      const invoices = invoicesResult.data || [];
      setRecentInvoices(invoices);
      const pendingInvoices = invoices.filter(tc => tc.status === 'Submitted').length;
      const pendingPayments = invoices.filter(tc => tc.status === 'Approved' || tc.status === 'Auto-Approved').length;

      // Calculate completed work based on paid invoices
      const completedWork = invoices.filter(tc => tc.status === 'Paid').length;
      setEliteProgress(prev => ({
        ...prev,
        completedContracts: Math.floor(completedWork / 3),
        isElite: completedWork >= 9,
        nextMilestone: completedWork >= 9 ? 0 : Math.ceil((9 - completedWork) / 3)
      }));

      const weekDates = getWeekDates(new Date().toISOString());
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

      // Calculate average hourly rate from recent invoices
      const paidInvoices = invoices.filter(tc => tc.status === 'Paid' && tc.nurse_net_amount && tc.total_hours);
      const avgHourlyRate = paidInvoices.length > 0 
        ? paidInvoices.reduce((sum, tc) => sum + (tc.nurse_net_amount / tc.total_hours), 0) / paidInvoices.length
        : 0;

      setStats({
        activeApplications: activeApps,
        pendingInvoices,
        weeklyEarnings: weeklyEarnings?.totalEarnings || 0,
        monthlyEarnings: monthlyEarnings?.totalEarnings || 0,
        totalHours: monthlyEarnings?.totalHours || 0,
        newJobMatches: newJobs.length,
        profileViews: Math.floor(Math.random() * 50) + 10,
        responseRate,
        pendingPayments,
        totalEarningsThisMonth: monthlyEarnings?.totalEarnings || 0,
        averageHourlyRate: avgHourlyRate,
        paymentAccountStatus: profile.stripe_account_status || 'not_started'
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

  // Fetch background checks count when nurse profile is loaded
  useEffect(() => {
    if (nurseProfile?.id) {
      fetchPendingBackgroundChecksCount();
    }
  }, [nurseProfile?.id, fetchPendingBackgroundChecksCount]);

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
    if (nurseProfile?.id) {
      fetchPendingBackgroundChecksCount();
    }
  }, [user?.id, nurseProfile?.id, fetchUnreadMessages, fetchPendingBackgroundChecksCount]);

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    setNurseProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
    setShowMandatoryProfilePicture(false);
    handleRefresh();
  };

  const handleMandatoryPhotoUploaded = (newPhotoUrl: string) => {
    setNurseProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
    setShowMandatoryProfilePicture(false);
    fetchDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'favorited': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'hired': return 'bg-green-50 text-green-700 border-green-200';
      case 'declined': return 'bg-red-50 text-red-700 border-red-200';
      case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Paid': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'filled': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Sidebar navigation items
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      isActive: activeTab === 'overview',
      badge: null
    },
    {
      id: 'background-checks',
      label: 'Background Checks',
      icon: Shield,
      isActive: activeTab === 'background-checks',
      badge: pendingBackgroundChecksCount > 0 ? pendingBackgroundChecksCount : null,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: CreditCard,
      isActive: activeTab === 'payment',
      badge: stats.paymentAccountStatus !== 'active' ? '!' : null,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Search,
      isActive: activeTab === 'jobs',
      badge: stats.newJobMatches > 0 ? stats.newJobMatches : null,
      badgeColor: 'bg-green-500'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Send,
      isActive: activeTab === 'applications',
      badge: stats.activeApplications > 0 ? stats.activeApplications : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'invoicing',
      label: 'Invoicing',
      icon: ClipboardCheck,
      isActive: activeTab === 'invoicing',
      badge: stats.pendingInvoices > 0 ? stats.pendingInvoices : null,
      badgeColor: 'bg-orange-500'
    }
  ];

  if (loading && !showMandatoryProfilePicture) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm mx-auto flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-900">Loading Dashboard</h3>
              <p className="text-sm text-slate-600">Setting up your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Messages Page if showMessagesPage is true
  if (showMessagesPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConversationsList 
          nurseId={nurseProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
        />
      </div>
    );
  }

  // Show mandatory profile picture upload
  if (showMandatoryProfilePicture && nurseProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="absolute inset-0 bg-slate-50/80">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm mx-auto flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-slate-900">Complete Your Profile</h3>
                <p className="text-sm text-slate-600">Add a professional photo to get started</p>
              </div>
            </div>
          </div>
        </div>
        
        <ProfilePictureUpload
          nurseId={nurseProfile.id}
          userId={user?.id || ''}
          currentPhotoUrl={nurseProfile.profile_photo_url}
          onPhotoUploaded={handleMandatoryPhotoUploaded}
          showSkipOption={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-slate-200 transition-all duration-200 fixed left-0 top-0 h-full z-30 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-sm font-semibold text-slate-900">
                    Nurse<span className="text-sky-500">Nest</span>
                  </h1>
                  <p className="text-xs text-slate-500">Professional Dashboard</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="absolute -right-3 top-4 h-6 w-6 p-0 bg-white shadow-md rounded-full border border-slate-200"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={item.isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  item.isActive 
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                } ${sidebarCollapsed ? 'px-2' : 'px-3'} transition-colors`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'} flex-shrink-0`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge className={`${item.badgeColor || 'bg-slate-500'} text-white text-xs h-5 px-1.5`}>
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${item.badgeColor || 'bg-slate-500'} rounded-full flex items-center justify-center`}>
                    <span className="text-xs text-white font-medium">{item.badge}</span>
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                {nurseProfile?.profile_photo_url ? (
                  <img 
                    src={nurseProfile.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm">
                    {nurseProfile?.first_name?.charAt(0)}{nurseProfile?.last_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {nurseProfile?.first_name} {nurseProfile?.last_name}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-slate-500">Licensed Professional</p>
                  {eliteProgress.isElite && (
                    <Trophy className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden relative">
                {nurseProfile?.profile_photo_url ? (
                  <img 
                    src={nurseProfile.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm">
                    {nurseProfile?.first_name?.charAt(0)}{nurseProfile?.last_name?.charAt(0)}
                  </span>
                )}
                {eliteProgress.isElite && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-200 min-h-screen`}>
        {/* Fixed Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'background-checks' && 'Background Checks'}
                {activeTab === 'payment' && 'Payment Setup'}
                {activeTab === 'jobs' && 'Available Positions'}
                {activeTab === 'applications' && 'My Applications'}
                {activeTab === 'invoicing' && 'Invoice Management'}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {activeTab === 'overview' && 'Welcome back to your professional care hub'}
                {activeTab === 'background-checks' && 'Complete your background verification'}
                {activeTab === 'payment' && 'Set up payment processing'}
                {activeTab === 'jobs' && 'Discover new opportunities'}
                {activeTab === 'applications' && 'Track your job applications'}
                {activeTab === 'invoicing' && 'Submit and track work invoices'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowMessagesPage(true)}
                className={hasNewMessages 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : ""
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
                {totalUnreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs h-5 px-1.5">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline"
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Critical Alerts */}
              <div className="space-y-3">
                {pendingBackgroundChecksCount > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-900">
                            {pendingBackgroundChecksCount} pending background check{pendingBackgroundChecksCount !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-amber-700">Complete verification to apply for jobs</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => setActiveTab('background-checks')}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                )}

                {stats.paymentAccountStatus !== 'active' && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-900">Set up payment processing</p>
                          <p className="text-sm text-orange-700">Required to receive earnings</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setActiveTab('payment')}
                      >
                        Setup
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Apply Widget */}
              <QuickApplyWidget 
                nurseId={nurseProfile?.id || ''} 
                onApplicationSubmitted={handleRefresh}
              />

              {/* Elite Progress */}
              {!eliteProgress.isElite && (
                <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-900 mb-1">Elite Status Progress</h3>
                          <p className="text-sm text-orange-700 mb-3">
                            Complete {eliteProgress.nextMilestone} more cycles to unlock elite benefits
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-2xl font-bold text-orange-600">
                              {eliteProgress.completedContracts}/3
                            </span>
                            <span className="text-orange-700">Work Cycles</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-64">
                        <Progress
                          value={(eliteProgress.completedContracts / 3) * 100}
                          className="h-3 mb-3"
                        />
                        <div className="flex flex-wrap gap-1">
                          {eliteProgress.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-white/80 text-orange-600 border-orange-300">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    title: 'Active Applications', 
                    value: stats.activeApplications, 
                    icon: Send, 
                    color: 'text-blue-600',
                    bg: 'bg-blue-50'
                  },
                  { 
                    title: 'Unread Messages', 
                    value: totalUnreadMessages, 
                    icon: MessageCircle, 
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    highlight: hasNewMessages
                  },
                  { 
                    title: 'Weekly Earnings', 
                    value: `$${stats.weeklyEarnings}`, 
                    icon: DollarSign, 
                    color: 'text-purple-600',
                    bg: 'bg-purple-50'
                  },
                  { 
                    title: 'Pending Invoices', 
                    value: stats.pendingInvoices, 
                    icon: ClipboardCheck, 
                    color: 'text-orange-600',
                    bg: 'bg-orange-50'
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className={`border-0 shadow-sm ${stat.highlight ? 'ring-2 ring-blue-500/20' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                          </div>
                          <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended Jobs */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                        Recommended Positions
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('jobs')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {availableJobs.length > 0 ? (
                      <div className="space-y-3">
                        {availableJobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-slate-900">{job.care_type}</h4>
                                <p className="text-sm text-slate-500 flex items-center mt-1">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {job.client_profiles?.first_name} {job.client_profiles?.last_name}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(job.status)} text-xs`}>
                                {job.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {job.duration}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {job.preferred_time}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowApplicationModal(true);
                                }}
                                className="flex-1 h-8 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              {appliedJobIds.has(job.id) ? (
                                <Button size="sm" variant="outline" disabled className="flex-1 h-8 text-xs bg-green-50 text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Applied
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setShowApplicationModal(true);
                                  }}
                                  className="flex-1 h-8 text-xs"
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Apply
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Briefcase className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">No positions available</h3>
                        <p className="text-sm text-slate-600 mb-3">Check back later for new opportunities</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('jobs')}
                        >
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* My Applications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900">My Applications</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('applications')}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {myApplications.length > 0 ? (
                      <div className="space-y-3">
                        {myApplications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {app.job_postings?.care_type}
                              </p>
                              <p className="text-xs text-slate-500">
                                Applied {formatRelativeTime(app.created_at)}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(app.status)} text-xs`}>
                              {app.status === 'favorited' ? 'Favorite' : app.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Send className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">No applications yet</h3>
                        <p className="text-sm text-slate-600 mb-3">Apply to positions to track progress</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('jobs')}
                        >
                          Browse Positions
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'background-checks' && (
            <PendingBackgroundChecksCard 
              nurseId={nurseProfile?.id}
              onBackgroundCheckComplete={handleRefresh}
            />
          )}

          {activeTab === 'payment' && (
            <StripeOnboardingCard
              nurseId={nurseProfile?.id || ''}
              nurseEmail={user?.email || ''}
              currentAccountId={nurseProfile?.stripe_account_id}
              currentStatus={nurseProfile?.stripe_account_status}
              onStatusUpdate={handleRefresh}
            />
          )}

          {activeTab === 'jobs' && (
            <JobApplicationsCard
              nurseId={nurseProfile?.id || ''}
              onApplicationSubmitted={handleRefresh}
            />
          )}

          {activeTab === 'applications' && (
            <JobApplicationsCard
              nurseId={nurseProfile?.id || ''}
              onApplicationSubmitted={handleRefresh}
              showMyApplications={true}
            />
          )}

          {activeTab === 'invoicing' && (
            <TimecardsCard
              nurseId={nurseProfile?.id || ''}
              onTimecardSubmitted={handleRefresh}
              stripeAccountStatus={nurseProfile?.stripe_account_status}
            />
          )}
        </main>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <JobApplicationForm
              nurseEmail={user?.email}
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

      {/* Timecard Form Modal */}
      {showEnhancedTimecardForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <EnhancedTimecardSubmissionForm
              nurseId={nurseProfile?.id || ''}
              stripeAccountStatus={nurseProfile?.stripe_account_status}
              onSubmitted={() => {
                setShowEnhancedTimecardForm(false);
                handleRefresh();
              }}
              onCancel={() => setShowEnhancedTimecardForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}