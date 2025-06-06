// components/dashboard/ClientDashboard.tsx - REDESIGNED WITH SIDEBAR LAYOUT
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MessageCircle,
  Sparkles,
  Crown,
  Zap,
  Heart,
  Trophy,
  Shield,
  Stethoscope,
  HeartHandshake,
  Building2,
  UserCircle2,
  CreditCard,
  BarChart3,
  ClipboardCheck,
  Award,
  Loader2,
  Receipt,
  Menu,
  LogOut
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

// Import NEW payment components
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Add state for messages page
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
      case 'open': return 'bg-medical-success/10 text-medical-success border-medical-success/20';
      case 'filled': return 'bg-medical-primary/10 text-medical-primary border-medical-primary/20';
      case 'expired': return 'bg-medical-neutral-100 text-medical-neutral-600 border-medical-neutral-300';
      case 'new': return 'bg-medical-blue-50 text-medical-blue-700 border-medical-blue-200';
      case 'favorited': return 'bg-medical-rose-50 text-medical-rose-700 border-medical-rose-200';
      case 'hired': return 'bg-medical-success-50 text-medical-success-700 border-medical-success-200';
      case 'declined': return 'bg-medical-error-50 text-medical-error-700 border-medical-error-200';
      case 'Submitted': return 'bg-medical-blue-50 text-medical-blue-700 border-medical-blue-200';
      case 'Approved': return 'bg-medical-success-50 text-medical-success-700 border-medical-success-200';
      case 'Rejected': return 'bg-medical-error-50 text-medical-error-700 border-medical-error-200';
      case 'Paid': return 'bg-medical-purple-50 text-medical-purple-700 border-medical-purple-200';
      default: return 'bg-medical-neutral-100 text-medical-neutral-600 border-medical-neutral-300';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Loading your dashboard...</h3>
              <p className="text-gray-600">Preparing your care management center</p>
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
        <ClientConversationsList 
          clientId={clientProfile?.id}
          userId={user?.id}
          onBack={() => setShowMessagesPage(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Enhanced Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-xl border-r border-gray-200 transition-all duration-300 relative flex flex-col`}>
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Nurse Nest</h1>
                  <p className="text-sm text-gray-500">Premium Care Management</p>
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
        <nav className="flex-1 p-4 space-y-2">
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

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {clientProfile?.first_name?.charAt(0)}{clientProfile?.last_name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {clientProfile?.first_name} {clientProfile?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {clientProfile?.client_type === 'family' ? 'Family Account' : 'Individual Account'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {clientProfile?.first_name?.charAt(0)}{clientProfile?.last_name?.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'jobs' && 'Job Management'}
                {activeTab === 'browse' && 'Browse Nurses'}
                {activeTab === 'applicants' && 'Review Applicants'}
                {activeTab === 'invoicing' && 'Invoice Management'}
                {activeTab === 'billing' && 'Billing & Payments'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'overview' && 'Your premium care management command center'}
                {activeTab === 'jobs' && 'Create and manage your job postings'}
                {activeTab === 'browse' && 'Find qualified healthcare professionals'}
                {activeTab === 'applicants' && 'Review and manage applications'}
                {activeTab === 'invoicing' && 'Review and approve invoices'}
                {activeTab === 'billing' && 'Manage payments and billing'}
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
                onClick={() => {
                  // Handle logout logic here
                    // Add your logout function here
                    window.location.href = '/';
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Alert Cards */}
              <div className="space-y-4">
                {!stats.paymentSetupComplete && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div>
                          <p className="font-semibold text-orange-900">
                            💳 Set up instant payments to approve invoices seamlessly!
                          </p>
                          <p className="text-sm text-orange-700">Add a payment method for automatic invoice processing</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                        onClick={() => setActiveTab('billing')}
                      >
                        Setup Now
                      </Button>
                    </div>
                  </div>
                )}

                {hasNewMessages && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">
                            💬 You have {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''} from nurses!
                          </p>
                          <p className="text-sm text-blue-700">Stay connected with your care team</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                        onClick={() => setShowMessagesPage(true)}
                      >
                        View Messages
                      </Button>
                    </div>
                  </div>
                )}

                {stats.pendingApprovals > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          {stats.paymentSetupComplete ? (
                            <Zap className="h-5 w-5 text-white" />
                          ) : (
                            <Clock className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">
                            {stats.paymentSetupComplete ? (
                              <>⚡ {stats.pendingApprovals} invoice{stats.pendingApprovals !== 1 ? 's' : ''} ready for instant approval!</>
                            ) : (
                              <>⏰ {stats.pendingApprovals} invoice{stats.pendingApprovals !== 1 ? 's' : ''} need your approval</>
                            )}
                          </p>
                          <p className="text-sm text-green-700">
                            {stats.paymentSetupComplete 
                              ? 'Click "Approve & Pay" for instant payment processing'
                              : 'Review and approve care hours'
                            }
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white shadow-sm"
                        onClick={() => setActiveTab('invoicing')}
                      >
                        {stats.paymentSetupComplete ? 'Approve & Pay' : 'Review'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Active Jobs', 
                    value: stats.activeJobs, 
                    icon: Briefcase, 
                    bgColor: 'bg-blue-500',
                    textColor: 'text-blue-600',
                    bgLight: 'bg-blue-50'
                  },
                  { 
                    title: 'Applications', 
                    value: stats.totalApplications, 
                    icon: Users, 
                    bgColor: 'bg-green-500',
                    textColor: 'text-green-600',
                    bgLight: 'bg-green-50'
                  },
                  { 
                    title: 'Total Paid', 
                    value: `$${Math.round(stats.totalPaid)}`, 
                    icon: DollarSign, 
                    bgColor: 'bg-purple-500',
                    textColor: 'text-purple-600',
                    bgLight: 'bg-purple-50'
                  },
                  { 
                    title: 'Pending Invoices', 
                    value: stats.pendingApprovals, 
                    icon: ClipboardCheck, 
                    bgColor: 'bg-orange-500',
                    textColor: 'text-orange-600',
                    bgLight: 'bg-orange-50'
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      {
                        id: 'post-job',
                        title: 'Post New Job',
                        description: 'Create a new job posting',
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
                        description: 'Check new applications',
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
                        description: 'Check payments & invoices',
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
                          className="h-auto p-6 flex flex-col items-center space-y-3 hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300"
                          onClick={action.action}
                        >
                          <div className={`p-4 rounded-full ${action.color} text-white shadow-lg`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{action.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Applications */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('applicants')}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {recentApplications.length > 0 ? (
                      <div className="space-y-4">
                        {recentApplications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                {app.nurse_profiles?.profile_photo_url ? (
                                  <img 
                                    src={app.nurse_profiles.profile_photo_url} 
                                    alt="Nurse" 
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-white font-semibold text-sm">
                                    {app.nurse_profiles?.first_name?.charAt(0)}{app.nurse_profiles?.last_name?.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {app.nurse_profiles?.first_name} {app.nurse_profiles?.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Applied {formatRelativeTime(app.created_at)}
                                </p>
                              </div>
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
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-4">Post a job to get started</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('jobs')}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          Post a Job
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Instant Payment Center */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {stats.paymentSetupComplete ? 'Instant Payment Center' : 'Pending Invoices'}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('invoicing')}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {pendingInvoices.length > 0 ? (
                      <div className="space-y-4">
                        {pendingInvoices.slice(0, 3).map((invoice) => (
                          <div key={invoice.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {invoice.nurse_profiles?.first_name} {invoice.nurse_profiles?.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatShortPremiumDate(invoice.shift_date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-gray-900">{invoice.total_hours} hrs</p>
                                <p className="text-sm text-gray-500">
                                  {formatCurrency((invoice.total_hours * 50 * 1.15))}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {stats.paymentSetupComplete ? (
                                <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0">
                                  <Zap className="h-4 w-4 mr-1" />
                                  Approve & Pay
                                </Button>
                              ) : (
                                <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                                  Quick Approve
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="border-gray-300">
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ClipboardCheck className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Invoices</h3>
                        <p className="text-gray-600">Invoices will appear here for verification</p>
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
            <div className="space-y-8">
              <PaymentMethodSetup
                clientId={clientProfile?.id || ''}
                clientEmail={user?.email || ''}
                clientName={`${clientProfile?.first_name} ${clientProfile?.last_name}`}
                onPaymentMethodAdded={handlePaymentMethodAdded}
              />

              <PaymentHistoryCard
                clientId={clientProfile?.id || ''}
              />

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Billing Analytics
                  </CardTitle>
                  <CardDescription>Your spending patterns and cost analysis</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-green-600 font-medium mb-2">This Month</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(stats.thisMonthSpend)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-blue-600 font-medium mb-2">Platform Fee (15%)</p>
                        <p className="text-3xl font-bold text-blue-700">{formatCurrency(stats.thisMonthSpend * 0.15)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <HeartHandshake className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-purple-600 font-medium mb-2">Nurse Payments (85%)</p>
                        <p className="text-3xl font-bold text-purple-700">{formatCurrency(stats.thisMonthSpend * 0.85)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}