// components/dashboard/ClientDashboard.tsx - PRODUCTION READY VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Eye,
  DollarSign,
  Home,
  Plus,
  Search,
  ChevronRight,
  Activity,
  Building2,
  CreditCard,
  ClipboardCheck,
  Loader2,
  Menu,
  LogOut,
  MessageCircle,
  Sparkles,
  Zap,
  HeartHandshake,
  Star,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getClientProfileByUserId } from '@/supabase/api/clientProfileService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob } from '@/supabase/api/applicationService';
import { getPendingTimecards, getClientTimecards, calculateClientExpenses } from '@/supabase/api/timecardService';
import { supabase } from '@/integrations/supabase/client';

// Import payment services
import { getClientPaymentMethods } from '@/supabase/api/stripeConnectService';

// Import dashboard cards
import JobManagementCard from './client/JobManagementCard';
import ApplicantReviewCard from './client/ApplicantReviewCard';
import BrowseNursesCard from './client/BrowseNursesCard';

// Import payment components
import PaymentMethodSetup from './client/PaymentMethodSetup';
import EnhancedTimecardApprovalCard from './client/EnhancedTimecardApprovalCard';
import PaymentHistoryCard from './client/PaymentHistoryCard';

import ClientConversationsList from '../ClientConversationList';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime 
} from '@/lib/dateFormatting';

// Import payment utilities
import { formatCurrency } from '@/supabase/api/stripeConnectService';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Messages page state
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingInvoices: 0,
    newApplicants: 0,
    pendingApprovals: 0,
    favoritedCandidates: 0,
    totalPaid: 0,
    thisMonthSpend: 0,
    lastMonthSpend: 0,
    avgHourlyRate: 0,
    paymentMethodsCount: 0,
    paymentSetupComplete: false,
    instantPaymentsEnabled: true
  });

  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

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

  // Fetch unread messages count
  const fetchUnreadMessages = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
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

          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: 'You have a new message from a nurse about your job posting',
              icon: '/favicon.ico'
            });
          }

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

  // Function to update payment setup status in database
  const updatePaymentSetupStatus = useCallback(async (profileId: string, isComplete: boolean) => {
    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          payment_setup_completed: isComplete,
          payment_setup_completed_at: isComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (error) {
        console.error('Error updating payment setup status:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error updating payment setup status:', error);
      return false;
    }
  }, []);

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

      // Check payment methods if client has stripe customer ID
      let paymentMethodsCount = 0;
      let hasValidPaymentMethods = false;
      
      if (profile.stripe_customer_id) {
        try {
          const { paymentMethods, error: pmError } = await getClientPaymentMethods(profile.stripe_customer_id);
          if (!pmError && paymentMethods) {
            paymentMethodsCount = paymentMethods.length;
            hasValidPaymentMethods = paymentMethods.some(pm => pm.card && pm.card.last4);
          }
        } catch (error) {
          console.warn('Error fetching payment methods:', error);
        }
      }

      // Determine payment setup completion status
      const paymentSetupComplete = hasValidPaymentMethods && (profile.payment_setup_completed || false);
      
      // Update payment setup status in database if it has changed
      if (hasValidPaymentMethods && !profile.payment_setup_completed) {
        const updateSuccess = await updatePaymentSetupStatus(profile.id, true);
        if (updateSuccess) {
          profile.payment_setup_completed = true;
        }
      } else if (!hasValidPaymentMethods && profile.payment_setup_completed) {
        const updateSuccess = await updatePaymentSetupStatus(profile.id, false);
        if (updateSuccess) {
          profile.payment_setup_completed = false;
        }
      }

      // Fetch all data in parallel
      const [jobsResult, invoicesResult] = await Promise.all([
        getClientJobPostings(profile.id, 20, 0),
        getPendingTimecards(profile.id, 10, 0),
      ]);

      // Process jobs data
      const jobs = jobsResult.data || [];
      setRecentJobs(jobs);
      
      // Get applications for all jobs
      let totalApplications = 0;
      let newApplicants = 0;
      let favoritedCandidates = 0;
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
            if (app.status === 'favorited') {
              favoritedCandidates++;
            }
          });
        }
      });
      
      // Sort applications by date and take recent ones
      const sortedApplications = allApplications
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
      setRecentApplications(sortedApplications);

      // Process invoices
      const pendingCards = invoicesResult.data || [];
      setPendingInvoices(pendingCards);

      // Calculate stats
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      
      // Calculate monthly spend from invoices
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0);
      
      const { expenses: currentMonthExpenses } = await calculateClientExpenses(
        profile.id,
        monthStart.toISOString().split('T')[0],
        monthEnd.toISOString().split('T')[0]
      );

      const { expenses: lastMonthExpenses } = await calculateClientExpenses(
        profile.id,
        lastMonthStart.toISOString().split('T')[0],
        lastMonthEnd.toISOString().split('T')[0]
      );

      // Get all-time expenses for total paid
      const { expenses: allTimeExpenses } = await calculateClientExpenses(
        profile.id,
        '2020-01-01',
        new Date().toISOString().split('T')[0]
      );

      // Calculate average hourly rate
      const { data: paidInvoices } = await getClientTimecards(profile.id, 1000, 0);
      const avgHourlyRate = paidInvoices && paidInvoices.length > 0
        ? paidInvoices
            .filter(tc => tc.status === 'Paid' && tc.client_total_amount && tc.total_hours)
            .reduce((sum, tc, _, arr) => sum + (tc.client_total_amount / tc.total_hours / arr.length), 0)
        : 0;

      setStats({
        activeJobs,
        totalApplications,
        pendingInvoices: invoicesResult.count || 0,
        newApplicants,
        pendingApprovals: pendingCards.length,
        favoritedCandidates,
        totalPaid: allTimeExpenses?.total || 0,
        thisMonthSpend: currentMonthExpenses?.total || 0,
        lastMonthSpend: lastMonthExpenses?.total || 0,
        avgHourlyRate: avgHourlyRate || 0,
        paymentMethodsCount,
        paymentSetupComplete: hasValidPaymentMethods && (profile.payment_setup_completed || false),
        instantPaymentsEnabled: true
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
  }, [user?.id, updatePaymentSetupStatus]);

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
    if (user?.id) {
      fetchUnreadMessages();
    }
  }, [user?.id, fetchUnreadMessages]);

  // Enhanced refresh function for payment updates
  const handlePaymentMethodAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    
    toast({
      title: "Payment Method Added!",
      description: "You can now approve invoices with instant payment processing.",
      variant: "default"
    });
  }, []);

  // Handle nurse contact from browse nurses
  const handleNurseContact = useCallback((nurseId: string, conversationId: string) => {
    setShowMessagesPage(true);
    toast({
      title: "Conversation Started",
      description: "You can now chat with the nurse about your care needs."
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'filled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'favorited': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'hired': return 'bg-green-50 text-green-700 border-green-200';
      case 'declined': return 'bg-red-50 text-red-700 border-red-200';
      case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Paid': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
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
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      isActive: activeTab === 'jobs',
      badge: recentJobs.filter(job => job.status === 'open').length > 0 ? recentJobs.filter(job => job.status === 'open').length : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'browse',
      label: 'Browse Nurses',
      icon: Search,
      isActive: activeTab === 'browse',
      badge: null
    },
    {
      id: 'applicants',
      label: 'Applicants',
      icon: Users,
      isActive: activeTab === 'applicants',
      badge: stats.newApplicants > 0 ? stats.newApplicants : null,
      badgeColor: 'bg-green-500'
    },
    {
      id: 'invoicing',
      label: 'Invoicing',
      icon: ClipboardCheck,
      isActive: activeTab === 'invoicing',
      badge: stats.pendingApprovals > 0 ? stats.pendingApprovals : null,
      badgeColor: stats.paymentSetupComplete ? 'bg-emerald-500' : 'bg-orange-500'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      isActive: activeTab === 'billing',
      badge: !stats.paymentSetupComplete ? '!' : null,
      badgeColor: 'bg-red-500'
    }
  ];

  if (loading) {
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
              <p className="text-sm text-slate-600">Preparing your care management center...</p>
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
        <ClientConversationsList 
          clientId={clientProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
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
                <HeartHandshake className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-sm font-semibold text-slate-900">
                    Nurse<span className="text-sky-500">Nest</span>
                  </h1>
                  <p className="text-xs text-slate-500">Care Management</p>
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
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {clientProfile?.first_name?.charAt(0)}{clientProfile?.last_name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {clientProfile?.first_name} {clientProfile?.last_name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {clientProfile?.client_type === 'family' ? 'Family Account' : 'Individual Account'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {clientProfile?.first_name?.charAt(0)}{clientProfile?.last_name?.charAt(0)}
                </span>
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
                {activeTab === 'jobs' && 'Job Management'}
                {activeTab === 'browse' && 'Browse Nurses'}
                {activeTab === 'applicants' && 'Review Applicants'}
                {activeTab === 'invoicing' && 'Invoice Management'}
                {activeTab === 'billing' && 'Billing & Payments'}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {activeTab === 'overview' && 'Your care management command center'}
                {activeTab === 'jobs' && 'Create and manage job postings'}
                {activeTab === 'browse' && 'Find qualified healthcare professionals'}
                {activeTab === 'applicants' && 'Review and manage applications'}
                {activeTab === 'invoicing' && 'Review and approve invoices'}
                {activeTab === 'billing' && 'Manage payments and billing'}
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
              {/* Welcome Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Welcome back, {clientProfile?.first_name}!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active Jobs</p>
                      <p className="text-xl font-semibold text-slate-900">{stats.activeJobs}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Pending Applications</p>
                      <p className="text-xl font-semibold text-slate-900">{stats.totalApplications}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Paid</p>
                      <p className="text-xl font-semibold text-slate-900">${Math.round(stats.totalPaid)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="space-y-3">
                {!stats.paymentSetupComplete && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-900">Set up instant payments</p>
                          <p className="text-sm text-orange-700">Add a payment method for automatic invoice processing</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setActiveTab('billing')}
                      >
                        Setup
                      </Button>
                    </div>
                  </div>
                )}

                {hasNewMessages && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">
                            {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''} from nurses
                          </p>
                          <p className="text-sm text-blue-700">Stay connected with your care team</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setShowMessagesPage(true)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )}

                {stats.pendingApprovals > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          {stats.paymentSetupComplete ? (
                            <Zap className="h-4 w-4 text-white" />
                          ) : (
                            <Clock className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-green-900">
                            {stats.pendingApprovals} invoice{stats.pendingApprovals !== 1 ? 's' : ''} ready for approval
                          </p>
                          <p className="text-sm text-green-700">
                            {stats.paymentSetupComplete 
                              ? 'Click "Approve & Pay" for instant processing'
                              : 'Review and approve care hours'
                            }
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => setActiveTab('invoicing')}
                      >
                        {stats.paymentSetupComplete ? 'Approve & Pay' : 'Review'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
                    <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      {
                        id: 'post-job',
                        title: 'Post New Job',
                        description: 'Create a job posting',
                        icon: Plus,
                        color: 'bg-blue-500 hover:bg-blue-600',
                        action: () => setActiveTab('jobs')
                      },
                      {
                        id: 'browse-nurses',
                        title: 'Browse Nurses',
                        description: 'Find qualified nurses',
                        icon: Search,
                        color: 'bg-emerald-500 hover:bg-emerald-600',
                        action: () => setActiveTab('browse')
                      },
                      {
                        id: 'review-applicants',
                        title: 'Review Applicants',
                        description: 'Check applications',
                        icon: Users,
                        color: 'bg-green-500 hover:bg-green-600',
                        action: () => setActiveTab('applicants')
                      },
                      {
                        id: 'verify-invoices',
                        title: 'Verify Invoices',
                        description: 'Review pending hours',
                        icon: ClipboardCheck,
                        color: 'bg-orange-500 hover:bg-orange-600',
                        action: () => setActiveTab('invoicing')
                      },
                      {
                        id: 'view-billing',
                        title: 'View Billing',
                        description: 'Check payments',
                        icon: CreditCard,
                        color: 'bg-indigo-500 hover:bg-indigo-600',
                        action: () => setActiveTab('billing')
                      }
                    ].map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all border-slate-200 hover:border-slate-300"
                          onClick={action.action}
                        >
                          <div className={`p-3 rounded-full ${action.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-slate-900 text-sm">{action.title}</p>
                            <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900">Recent Applications</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('applicants')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {recentApplications.length > 0 ? (
                      <div className="space-y-3">
                        {recentApplications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                                {app.nurse_profiles?.profile_photo_url ? (
                                  <img 
                                    src={app.nurse_profiles.profile_photo_url} 
                                    alt="Nurse" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-medium text-sm">
                                    {app.nurse_profiles?.first_name?.charAt(0)}{app.nurse_profiles?.last_name?.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 text-sm">
                                  {app.nurse_profiles?.first_name} {app.nurse_profiles?.last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Applied {formatRelativeTime(app.created_at)}
                                </p>
                              </div>
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
                          <Users className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">No applications yet</h3>
                        <p className="text-sm text-slate-600 mb-3">Post a job to get started</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('jobs')}
                        >
                          Post a Job
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Center */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {stats.paymentSetupComplete ? 'Instant Payment Center' : 'Pending Invoices'}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('invoicing')}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {pendingInvoices.length > 0 ? (
                      <div className="space-y-3">
                        {pendingInvoices.slice(0, 3).map((invoice) => (
                          <div key={invoice.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-slate-900 text-sm">
                                  {invoice.nurse_profiles?.first_name} {invoice.nurse_profiles?.last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatShortPremiumDate(invoice.shift_date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">{invoice.total_hours} hrs</p>
                                <p className="text-xs text-slate-500">
                                  {formatCurrency((invoice.total_hours * 50 * 1.15))}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {stats.paymentSetupComplete ? (
                                <Button size="sm" className="flex-1 h-8 text-xs bg-green-500 hover:bg-green-600 text-white">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Approve & Pay
                                </Button>
                              ) : (
                                <Button size="sm" className="flex-1 h-8 text-xs bg-green-500 hover:bg-green-600 text-white">
                                  Quick Approve
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ClipboardCheck className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">No pending invoices</h3>
                        <p className="text-sm text-slate-600">Invoices will appear here for verification</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'browse' && (
            <BrowseNursesCard 
              clientId={clientProfile?.id || ''} 
              onNurseContact={handleNurseContact}
            />
          )}

          {activeTab === 'jobs' && (
            <JobManagementCard 
              clientId={clientProfile?.id || ''} 
              onJobCreated={handleRefresh}
            />
          )}

          {activeTab === 'applicants' && (
            <ApplicantReviewCard 
              clientId={clientProfile?.id || ''} 
              onApplicationUpdate={handleRefresh}
            />
          )}

          {activeTab === 'invoicing' && (
            <EnhancedTimecardApprovalCard 
              clientId={clientProfile?.id || ''} 
              onInvoiceAction={handleRefresh}
            />
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <PaymentMethodSetup
                clientId={clientProfile?.id || ''}
                clientEmail={user?.email || ''}
                clientName={`${clientProfile?.first_name} ${clientProfile?.last_name}`}
                onPaymentMethodAdded={handlePaymentMethodAdded}
              />

              <PaymentHistoryCard
                clientId={clientProfile?.id || ''}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}