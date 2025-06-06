// components/dashboard/NurseDashboard.tsx - REDESIGNED WITH SIDEBAR LAYOUT
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Building2,
  CreditCard,
  Loader2,
  Home,
  LogOut,
  Menu,
  Users,
  ClipboardCheck,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getNurseProfileByUserId } from '@/supabase/api/nurseProfileService';
import { getOpenJobPostings, advancedJobSearch } from '@/supabase/api/jobPostingService';
import { getApplicationsByNurse, hasApplied } from '@/supabase/api/applicationService';
import { getNurseTimecards, calculateNurseEarnings } from '@/supabase/api/timecardService';
import JobApplicationForm from '@/components/dashboard/nurse/JobApplicationForm';

// Import dashboard cards
import JobApplicationsCard from './nurse/JobApplicationsCard';
import TimecardsCard from './nurse/TimecardsCard';
import QuickActionsCard from './nurse/QuickActionsCard';
import NotificationsCard from './nurse/NotificationsCard';
import QuickApplyWidget from './nurse/QuickApplyWidget';

// Import NEW payment components
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
  
  // Add state for messages view
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
    pendingInvoices: 0, // Changed from pendingTimecards
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalHours: 0,
    newJobMatches: 0,
    profileViews: 0,
    responseRate: 0,
    // Payment related stats
    pendingPayments: 0,
    totalEarningsThisMonth: 0,
    averageHourlyRate: 0,
    paymentAccountStatus: 'not_started'
  });

  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]); // Changed from recentTimecards
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
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
      // Still navigate even if there's an error
      navigate('/');
    }
  };

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
        return; // Don't load dashboard data until profile picture is uploaded
      }

      const [jobsResult, applicationsResult, invoicesResult] = await Promise.all([
        getOpenJobPostings(50, 0),
        getApplicationsByNurse(profile.id, 50, 0),
        getNurseTimecards(profile.id, 20, 0), // Still uses timecards API but renamed in UI
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

      // Calculate completed work based on paid invoices instead of contracts
      const completedWork = invoices.filter(tc => tc.status === 'Paid').length;
      setEliteProgress(prev => ({
        ...prev,
        completedContracts: Math.floor(completedWork / 3), // 3 paid invoices = 1 "contract equivalent"
        isElite: completedWork >= 9, // 9 paid invoices for elite status
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
        pendingInvoices, // Updated terminology
        weeklyEarnings: weeklyEarnings?.totalEarnings || 0,
        monthlyEarnings: monthlyEarnings?.totalEarnings || 0,
        totalHours: monthlyEarnings?.totalHours || 0,
        newJobMatches: newJobs.length,
        profileViews: Math.floor(Math.random() * 50) + 10,
        responseRate,
        // Payment stats
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
    setShowMandatoryProfilePicture(false);
    handleRefresh();
  };

  const handleMandatoryPhotoUploaded = (newPhotoUrl: string) => {
    setNurseProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
    setShowMandatoryProfilePicture(false);
    // Now load the dashboard data
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
      id: 'invoicing', // Changed from 'timecards'
      label: 'Invoicing', // Changed from 'Timecards'
      icon: ClipboardCheck, // Changed from Clock
      isActive: activeTab === 'invoicing',
      badge: stats.pendingInvoices > 0 ? stats.pendingInvoices : null,
      badgeColor: 'bg-orange-500'
    }
    // Removed contracts tab as requested
  ];

  if (loading && !showMandatoryProfilePicture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Loading your dashboard...</h3>
              <p className="text-gray-600">Setting up your personalized care experience</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Messages Page if showMessagesPage is true
  if (showMessagesPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ConversationsList 
          nurseId={nurseProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
        />
      </div>
    );
  }

  // Show mandatory profile picture upload (this blocks the dashboard)
  if (showMandatoryProfilePicture && nurseProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Background dashboard preview (blurred) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600">Add a professional photo to get started</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Fixed Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-xl border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 h-full z-30 flex flex-col`}>
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Nurse Nest</h1>
                  <p className="text-sm text-gray-500">Professional Care Dashboard</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            {sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="absolute -right-3 top-6 bg-white shadow-lg rounded-full p-1 border"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={item.isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 ${
                  item.isActive 
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                } ${sidebarCollapsed ? 'px-3' : 'px-4'} transition-all duration-200`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className={`${item.badgeColor || 'bg-gray-500'} text-white text-xs border-0 shadow-sm ml-2`}>
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 ${item.badgeColor || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                    <span className="text-xs text-white font-semibold">{item.badge}</span>
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Fixed User Profile Section at Bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                {nurseProfile?.profile_photo_url ? (
                  <img 
                    src={nurseProfile.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {nurseProfile?.first_name?.charAt(0)}{nurseProfile?.last_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {nurseProfile?.first_name} {nurseProfile?.last_name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 truncate">Licensed Professional</p>
                  {eliteProgress.isElite && (
                    <Trophy className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                {nurseProfile?.profile_photo_url ? (
                  <img 
                    src={nurseProfile.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {nurseProfile?.first_name?.charAt(0)}{nurseProfile?.last_name?.charAt(0)}
                  </span>
                )}
                {eliteProgress.isElite && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 min-h-screen flex flex-col`}>
        {/* Fixed Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-0 z-20" style={{ 
          left: sidebarCollapsed ? '5rem' : '16rem',
          transition: 'left 300ms'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Professional Care Hub'}
                {activeTab === 'payment' && 'Payment Setup'}
                {activeTab === 'jobs' && 'Available Positions'}
                {activeTab === 'applications' && 'My Applications'}
                {activeTab === 'invoicing' && 'Invoice Management'} {/* Updated terminology */}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'overview' && 'Manage your applications, track your work, and discover opportunities'}
                {activeTab === 'payment' && 'Set up your payment account to receive earnings'}
                {activeTab === 'jobs' && 'Discover and apply for healthcare positions'}
                {activeTab === 'applications' && 'Track your job applications and responses'}
                {activeTab === 'invoicing' && 'Submit and track your work invoices'} {/* Updated */}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Messages Button */}
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowMessagesPage(true)}
                className={`${hasNewMessages 
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-0 animate-pulse shadow-lg" 
                  : "hover:bg-blue-50 hover:border-blue-300 text-gray-700"
                } transition-all duration-300`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
                {totalUnreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs border-0 min-w-[20px] h-5">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline"
                size="sm" 
                className="hover:bg-red-50 hover:border-red-300 text-gray-700 transition-all duration-300" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area with Top Padding */}
        <main className="flex-1 p-6 mt-24 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Alert Cards */}
              <div className="space-y-4">
                {/* Payment Setup Alert */}
                {stats.paymentAccountStatus !== 'active' && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div>
                          <p className="font-semibold text-orange-900">
                            💳 Complete your payment setup to receive earnings!
                          </p>
                          <p className="text-sm text-orange-700">
                            Set up your bank account to get paid instantly when invoices are approved
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                        onClick={() => setActiveTab('payment')}
                      >
                        Setup Now
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pending Payments Alert */}
                {stats.pendingPayments > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">
                            💰 You have {stats.pendingPayments} approved invoice{stats.pendingPayments !== 1 ? 's' : ''} ready for payment!
                          </p>
                          <p className="text-sm text-green-700">Money will be transferred as soon as client approves</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white shadow-sm"
                        onClick={() => setActiveTab('invoicing')}
                      >
                        View Status
                      </Button>
                    </div>
                  </div>
                )}

                {/* New Jobs Alert */}
                {stats.newJobMatches > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">
                            ✨ {stats.newJobMatches} new position{stats.newJobMatches !== 1 ? 's' : ''} match your expertise!
                          </p>
                          <p className="text-sm text-blue-700">Perfect opportunities await your application</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                        onClick={() => setActiveTab('jobs')}
                      >
                        View Positions
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

              {/* Enhanced Elite Progress Card */}
              {!eliteProgress.isElite && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-orange-900 mb-2">Path to Elite Status</h3>
                          <p className="text-orange-700 mb-4">
                            Complete {eliteProgress.nextMilestone} more work cycle{eliteProgress.nextMilestone !== 1 ? 's' : ''} to unlock Elite benefits
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-3xl font-bold text-orange-600">
                              {eliteProgress.completedContracts}/3
                            </span>
                            <span className="text-orange-700">Work Cycles Completed</span>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-[300px]">
                        <Progress
                          value={(eliteProgress.completedContracts / 3) * 100}
                          className="h-4 mb-4"
                        />
                        <div className="flex flex-wrap gap-2">
                          {eliteProgress.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="bg-white/80 text-orange-600 border-orange-300">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Applications', 
                    value: stats.activeApplications, 
                    icon: Send, 
                    bgColor: 'bg-blue-500',
                    textColor: 'text-blue-600',
                    bgLight: 'bg-blue-50'
                  },
                  { 
                    title: 'Messages', 
                    value: totalUnreadMessages, 
                    icon: MessageCircle, 
                    bgColor: 'bg-green-500',
                    textColor: 'text-green-600',
                    bgLight: 'bg-green-50',
                    pulse: hasNewMessages
                  },
                  { 
                    title: 'Weekly', 
                    value: `$${stats.weeklyEarnings}`, 
                    icon: DollarSign, 
                    bgColor: 'bg-purple-500',
                    textColor: 'text-purple-600',
                    bgLight: 'bg-purple-50'
                  },
                  { 
                    title: 'Pending Invoices', // Updated terminology
                    value: stats.pendingInvoices, 
                    icon: ClipboardCheck, // Updated icon
                    bgColor: 'bg-orange-500',
                    textColor: 'text-orange-600',
                    bgLight: 'bg-orange-50'
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className={`border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${stat.pulse ? 'animate-pulse ring-2 ring-blue-500/20' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recommended Jobs */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                        Recommended Positions
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('jobs')}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {availableJobs.length > 0 ? (
                      <div className="space-y-4">
                        {availableJobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{job.care_type}</h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {job.client_profiles?.first_name} {job.client_profiles?.last_name}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(job.status)} border shadow-sm`}>
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
                                className="border-gray-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              {appliedJobIds.has(job.id) ? (
                                <Button size="sm" variant="outline" disabled className="bg-green-50 text-green-600 border-green-300">
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
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Positions Available</h3>
                        <p className="text-gray-600 mb-4">Check back later for new opportunities</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('jobs')}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          Browse All Jobs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* My Applications */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">My Applications</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('applications')}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {myApplications.length > 0 ? (
                      <div className="space-y-4">
                        {myApplications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <div>
                              <p className="font-medium text-gray-900">
                                {app.job_postings?.care_type}
                              </p>
                              <p className="text-sm text-gray-500">
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
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Send className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-4">Apply to positions to track your progress</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('jobs')}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
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

          {activeTab === 'invoicing' && ( // Changed from 'timecards'
            <TimecardsCard
              nurseId={nurseProfile?.id || ''}
              onTimecardSubmitted={handleRefresh}
              stripeAccountStatus={nurseProfile?.stripe_account_status}
            />
          )}
        </main>
      </div>

      {/* Enhanced Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
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

      {/* Enhanced Invoice Submission Modal */}
      {showEnhancedTimecardForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
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