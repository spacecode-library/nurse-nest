// components/dashboard/ClientDashboard.tsx - COMPLETE UPDATED VERSION WITH PAYMENT FIX
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
  Receipt
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getClientProfileByUserId } from '@/supabase/api/clientProfileService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob } from '@/supabase/api/applicationService';
import { getPendingTimecards, getClientTimecards, calculateClientExpenses } from '@/supabase/api/timecardService';
import { getClientContracts } from '@/supabase/api/contractService';
import { supabase } from '@/integrations/supabase/client';

// Import payment services
import { getClientPaymentMethods } from '@/supabase/api/stripeConnectService';

// Import dashboard cards
import JobManagementCard from './client/JobManagementCard';
import ApplicantReviewCard from './client/ApplicantReviewCard';
import TimecardApprovalCard from './client/TimecardApprovalCard';
import ClientContractsCard from './client/ClientContractsCard';
import ClientQuickActionsCard from './client/ClientQuickActionsCard';
import BrowseNursesCard from './client/BrowseNursesCard';

// Import NEW payment components
import PaymentMethodSetup from './client/PaymentMethodSetup';
import EnhancedTimecardApprovalCard from './client/EnhancedTimecardApprovalCard';
import PaymentHistoryCard from './client/PaymentHistoryCard';

import ClientConversationsList from '../ClientConversationList';
import ContractNotifications from '@/components/ContractNotifications';

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
    pendingApprovals: 0,
    favoritedCandidates: 0,
    // NEW: Payment related stats
    totalPaid: 0,
    thisMonthSpend: 0,
    lastMonthSpend: 0,
    avgHourlyRate: 0,
    paymentMethodsCount: 0,
    paymentSetupComplete: false,
    instantPaymentsEnabled: true
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

      // Process timecards
      const pendingCards = timecardsResult.data || [];
      setPendingTimecards(pendingCards);

      // Process contracts
      const contracts = contractsResult.data || [];
      const active = contracts.filter(c => c.status === 'active');
      setActiveContracts(active);

      // Calculate stats
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      
      // Calculate monthly spend from timecards
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
        '2020-01-01', // Far back date to get all expenses
        new Date().toISOString().split('T')[0]
      );

      // Calculate average response time (mock for now)
      const avgResponseTime = Math.round(Math.random() * 24 + 12); // 12-36 hours

      // Calculate average hourly rate
      const { data: paidTimecards } = await getClientTimecards(profile.id, 1000, 0);
      const avgHourlyRate = paidTimecards && paidTimecards.length > 0
        ? paidTimecards
            .filter(tc => tc.status === 'Paid' && tc.client_total_amount && tc.total_hours)
            .reduce((sum, tc, _, arr) => sum + (tc.client_total_amount / tc.total_hours / arr.length), 0)
        : 0;

      setStats({
        activeJobs,
        totalApplications,
        pendingTimecards: timecardsResult.count || 0,
        activeContracts: active.length,
        avgResponseTime,
        monthlySpend: currentMonthExpenses?.total || 0,
        newApplicants,
        pendingApprovals: pendingCards.length,
        favoritedCandidates,
        // FIXED: Payment stats with actual values
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
    // Also refresh message count
    if (user?.id) {
      fetchUnreadMessages();
    }
  }, [user?.id, fetchUnreadMessages]);

  // Enhanced refresh function for payment updates
  const handlePaymentMethodAdded = useCallback(() => {
    // Force immediate refresh when payment method is added
    setRefreshTrigger(prev => prev + 1);
    
    // Show success message
    toast({
      title: "Payment Method Added!",
      description: "You can now approve timecards with instant payment processing.",
      variant: "default"
    });
  }, []);

  // Handle nurse contact from browse nurses
  const handleNurseContact = useCallback((nurseId: string, conversationId: string) => {
    // Show messages page when a nurse is contacted
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
                <HeartHandshake className="w-6 h-6 text-medical-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-medical-text-primary">Loading your dashboard...</h3>
              <p className="text-medical-text-secondary">Preparing your care management center</p>
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
        <ClientConversationsList 
          clientId={clientProfile?.id}
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
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-medical-primary to-medical-accent shadow-medical-soft ring-2 ring-white flex items-center justify-center">
                    <Crown className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-medical-success to-medical-accent rounded-full flex items-center justify-center shadow-sm">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg lg:text-xl font-semibold text-medical-text-primary">
                      Care Dashboard
                    </h1>
                    <Shield className="h-4 w-4 text-medical-success" />
                    {/* NEW: Payment Status Indicator */}
                    {stats.paymentSetupComplete && (
                      <CreditCard className="h-4 w-4 text-medical-success" />
                    )}
                  </div>
                  <p className="text-sm text-medical-text-secondary">Premium Care Management</p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="hidden md:flex items-center space-x-3">
                <Badge variant="outline" className="bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 text-medical-primary border-medical-primary/20">
                  <Crown className="h-3 w-3 mr-1" />
                  {clientProfile?.client_type === 'family' ? 'Family Account' : 'Individual Account'}
                </Badge>
                {/* FIXED: Payment Setup Status Badge */}
                {stats.paymentSetupComplete && (
                  <Badge className="bg-medical-success text-white border-0 shadow-sm">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Instant Payment Ready
                  </Badge>
                )}
                {!stats.paymentSetupComplete && (
                  <Badge className="bg-medical-warning text-white border-0 shadow-sm animate-pulse">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Setup Payment
                  </Badge>
                )}
                {hasNewMessages && (
                  <Badge className="bg-medical-primary text-white border-0 animate-pulse shadow-medical-soft">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {totalUnreadMessages} Message{totalUnreadMessages !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Messages Button */}
              <Button 
                variant={hasNewMessages ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowMessagesPage(true)}
                className={`${hasNewMessages 
                  ? "bg-medical-primary hover:bg-medical-primary/90 text-white border-0 animate-pulse shadow-medical-soft" 
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
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Post Job</span>
              </Button>
              
              <ContractNotifications 
                userId={user?.id}
                userType="client"
                profileId={clientProfile?.id}
                onNotificationClick={(contractId) => {
                  setActiveTab('contracts');
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="text-center mb-6 lg:mb-8">
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-medical-text-primary via-medical-primary to-medical-accent bg-clip-text text-transparent">
                Welcome back, {clientProfile?.first_name}! ✨
              </h2>
              <p className="text-lg text-medical-text-secondary max-w-3xl mx-auto">
                Your premium care management command center
              </p>
              
              {/* Professional Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-medical-soft border border-medical-border">
                  <Shield className="h-4 w-4 text-medical-success" />
                  <span className="text-sm font-medium text-medical-text-primary">HIPAA Secure</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-medical-soft border border-medical-border">
                  <HeartHandshake className="h-4 w-4 text-medical-primary" />
                  <span className="text-sm font-medium text-medical-text-primary">Licensed Professionals</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-medical-soft border border-medical-border">
                  <Award className="h-4 w-4 text-medical-accent" />
                  <span className="text-sm font-medium text-medical-text-primary">Verified Care Network</span>
                </div>
                {/* FIXED: Payment Status Indicator */}
                {stats.paymentSetupComplete && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-medical-success to-medical-accent rounded-full px-4 py-2 shadow-medical-soft">
                    <Zap className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Instant Payments</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Enhanced Alert Cards */}
          <div className="space-y-4">
            {/* FIXED: Payment Setup Alert - Only shows when payment is NOT set up */}
            {!stats.paymentSetupComplete && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-warning/10 to-medical-error/10 border border-medical-warning/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-warning rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-warning">
                        💳 Set up instant payments to approve timecards seamlessly!
                      </p>
                      <p className="text-sm text-medical-text-secondary">Add a payment method for automatic timecard processing</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-medical-warning hover:bg-medical-warning/90 text-white shadow-medical-soft"
                    onClick={() => setActiveTab('billing')}
                  >
                    Setup Now
                  </Button>
                </div>
              </div>
            )}

            {/* New message alert */}
            {hasNewMessages && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 border border-medical-primary/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-primary">
                        💬 You have {totalUnreadMessages} new message{totalUnreadMessages !== 1 ? 's' : ''} from nurses!
                      </p>
                      <p className="text-sm text-medical-text-secondary">Stay connected with your care team</p>
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

            {stats.newApplicants > 0 && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-success/10 to-medical-accent/10 border border-medical-success/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-success rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-success">
                        🎉 You have {stats.newApplicants} new applicant{stats.newApplicants !== 1 ? 's' : ''} to review!
                      </p>
                      <p className="text-sm text-medical-text-secondary">Quality professionals ready to provide care</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-medical-success hover:bg-medical-success/90 text-white shadow-medical-soft"
                    onClick={() => setActiveTab('applicants')}
                  >
                    Review Now
                  </Button>
                </div>
              </div>
            )}

            {stats.pendingApprovals > 0 && (
              <div className="p-4 lg:p-6 bg-gradient-to-r from-medical-warning/10 to-medical-accent/10 border border-medical-warning/20 rounded-xl shadow-medical-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-warning rounded-full flex items-center justify-center">
                      {stats.paymentSetupComplete ? (
                        <Zap className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-medical-warning">
                        {stats.paymentSetupComplete ? (
                          <>⚡ {stats.pendingApprovals} timecard{stats.pendingApprovals !== 1 ? 's' : ''} ready for instant approval!</>
                        ) : (
                          <>⏰ {stats.pendingApprovals} timecard{stats.pendingApprovals !== 1 ? 's' : ''} need your approval</>
                        )}
                      </p>
                      <p className="text-sm text-medical-text-secondary">
                        {stats.paymentSetupComplete 
                          ? 'Click "Approve & Pay" for instant payment processing'
                          : 'Review and approve care hours'
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-medical-warning hover:bg-medical-warning/90 text-white shadow-medical-soft"
                    onClick={() => setActiveTab('timecards')}
                  >
                    {stats.paymentSetupComplete ? 'Approve & Pay' : 'Review'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="mb-8 lg:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
            {[
              { title: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, gradient: 'from-medical-primary to-medical-accent', bgColor: 'bg-medical-primary' },
              { title: 'Applications', value: stats.totalApplications, icon: Users, gradient: 'from-medical-purple to-medical-primary', bgColor: 'bg-medical-purple' },
              { title: 'New Today', value: stats.newApplicants, icon: Bell, gradient: 'from-medical-warning to-medical-accent', bgColor: 'bg-medical-warning' },
              { title: 'Messages', value: totalUnreadMessages, icon: MessageCircle, gradient: 'from-medical-success to-medical-accent', bgColor: 'bg-medical-success', pulse: hasNewMessages },
              { title: 'Pending', value: stats.pendingApprovals, icon: stats.paymentSetupComplete ? Zap : Clock, gradient: 'from-medical-warning to-medical-accent', bgColor: 'bg-medical-warning' },
              { title: 'Contracts', value: stats.activeContracts, icon: FileText, gradient: 'from-medical-success to-medical-primary', bgColor: 'bg-medical-success' },
              { title: 'This Month', value: `$${Math.round(stats.thisMonthSpend)}`, icon: TrendingUp, gradient: 'from-medical-primary to-medical-accent', bgColor: 'bg-medical-primary' },
              { title: 'Total Paid', value: `$${Math.round(stats.totalPaid)}`, icon: DollarSign, gradient: 'from-medical-rose to-medical-accent', bgColor: 'bg-medical-rose' },
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
          <TabsList className="grid w-full grid-cols-7 h-12 lg:h-14 bg-white/80 backdrop-blur-sm rounded-xl shadow-medical-soft border border-medical-border overflow-x-auto">
            <TabsTrigger value="overview" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft whitespace-nowrap">
              Overview
            </TabsTrigger>
            <TabsTrigger value="browse" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft whitespace-nowrap">
              Browse Nurses
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="applicants" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              <span className="flex items-center space-x-1 lg:space-x-2">
                <span>Applicants</span>
                {stats.newApplicants > 0 && (
                  <Badge className="bg-medical-success text-white text-xs border-0 animate-pulse min-w-[20px] h-5">
                    {stats.newApplicants}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="timecards" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              <span className="flex items-center space-x-1 lg:space-x-2">
                <span className="hidden sm:inline">Timecards</span>
                <span className="sm:hidden">Time</span>
                {stats.pendingApprovals > 0 && (
                  <Badge className={`${stats.paymentSetupComplete ? 'bg-medical-success animate-pulse' : 'bg-medical-warning'} text-white text-xs border-0 min-w-[20px] h-5`}>
                    {stats.pendingApprovals}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              Contracts
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg font-medium text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-medical-primary data-[state=active]:text-white data-[state=active]:shadow-medical-soft">
              <span className="flex items-center space-x-1 lg:space-x-2">
                <span>Billing</span>
                {!stats.paymentSetupComplete && (
                  <Badge className="bg-medical-warning text-white text-xs border-0 animate-pulse min-w-[20px] h-5">
                    !
                  </Badge>
                )}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <ClientQuickActionsCard 
              clientId={clientProfile?.id || ''} 
              onRefresh={handleRefresh}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Enhanced Recent Applications */}
              <Card className="border-0 shadow-medical-elevated bg-gradient-to-br from-white to-medical-purple/5">
                <CardHeader className="bg-gradient-to-r from-medical-purple/10 to-medical-rose/10 rounded-t-lg border-b border-medical-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl font-bold text-medical-text-primary">
                      Recent Applications
                      {hasNewMessages && (
                        <Badge className="ml-2 bg-medical-primary text-white border-0 animate-pulse">
                          {totalUnreadMessages} new
                        </Badge>
                      )}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('applicants')}
                      className="text-medical-purple hover:bg-medical-purple/10"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {recentApplications.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {recentApplications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-medical-border hover:bg-gradient-to-r hover:from-medical-purple/5 hover:to-medical-rose/5 transition-all group">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-medical-purple to-medical-primary flex items-center justify-center flex-shrink-0 shadow-medical-soft">
                              {app.nurse_profiles?.profile_photo_url ? (
                                <img 
                                  src={app.nurse_profiles.profile_photo_url} 
                                  alt="Nurse" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-medical-text-primary group-hover:text-medical-purple transition-colors">
                                {app.nurse_profiles?.first_name} {app.nurse_profiles?.last_name}
                              </p>
                              <p className="text-sm text-medical-text-secondary">
                                Applied {formatRelativeTime(app.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(app.status)} border shadow-sm`}>
                              {app.status === 'favorited' ? 'Favorite' : app.status}
                              {app.status === 'new' && (
                                <span className="ml-1 animate-pulse">●</span>
                              )}
                            </Badge>
                            <Button size="sm" variant="ghost" className="hover:bg-white transition-all">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-medical-text-secondary">
                      <div className="w-16 h-16 bg-medical-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-medical-neutral-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No recent applications</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('jobs')}
                        className="text-medical-purple hover:text-medical-purple/80"
                      >
                        Post a job to get started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Quick Timecard Approvals */}
              <Card className="border-0 shadow-medical-elevated bg-gradient-to-br from-white to-medical-warning/5">
                <CardHeader className="bg-gradient-to-r from-medical-warning/10 to-medical-accent/10 rounded-t-lg border-b border-medical-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-medical-text-primary">
                      {stats.paymentSetupComplete ? 'Instant Payment Center' : 'Pending Approvals'}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('timecards')}
                      className="text-medical-warning hover:bg-medical-warning/10"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {pendingTimecards.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {pendingTimecards.slice(0, 3).map((timecard) => (
                        <div key={timecard.id} className="p-4 rounded-xl border border-medical-border hover:bg-gradient-to-r hover:from-medical-warning/5 hover:to-medical-accent/5 transition-all group">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-medical-text-primary group-hover:text-medical-warning transition-colors">
                                {timecard.nurse_profiles?.first_name} {timecard.nurse_profiles?.last_name}
                              </p>
                              <p className="text-sm text-medical-text-secondary">
                                {formatShortPremiumDate(timecard.shift_date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-medical-text-primary">{timecard.total_hours} hrs</p>
                              <p className="text-sm text-medical-text-secondary">
                                {formatCurrency((timecard.total_hours * 50 * 1.15))}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-medical-text-secondary mb-3">
                            <span>Auto-approval in</span>
                            <span className="font-medium">
                              {Math.max(0, Math.floor((new Date(timecard.approval_deadline).getTime() - Date.now()) / 3600000))}h
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {stats.paymentSetupComplete ? (
                              <Button size="sm" className="flex-1 bg-gradient-to-r from-medical-success to-medical-accent hover:from-medical-success/90 hover:to-medical-accent/90 text-white border-0 shadow-medical-soft">
                                <Zap className="h-4 w-4 mr-1" />
                                Approve & Pay
                              </Button>
                            ) : (
                              <Button size="sm" className="flex-1 bg-medical-success hover:bg-medical-success/90 text-white border-0 shadow-medical-soft">
                                Quick Approve
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="hover:bg-white border-medical-border">
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-medical-text-secondary">
                      <div className="w-16 h-16 bg-medical-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-medical-neutral-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No pending timecards</p>
                      <p className="text-sm">Timecards will appear here for approval</p>
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
            {/* Use Enhanced Timecard Approval Card with payment integration */}
            <EnhancedTimecardApprovalCard 
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
            <div className="space-y-8">
              {/* FIXED: Payment Method Setup with enhanced callback */}
              <PaymentMethodSetup
                clientId={clientProfile?.id || ''}
                clientEmail={user?.email || ''}
                clientName={`${clientProfile?.first_name} ${clientProfile?.last_name}`}
                onPaymentMethodAdded={handlePaymentMethodAdded}
              />

              {/* Payment History */}
              <PaymentHistoryCard
                clientId={clientProfile?.id || ''}
              />

              {/* Enhanced Billing Summary Card */}
              <Card className="border-0 shadow-medical-elevated bg-gradient-to-br from-white to-medical-primary/5">
                <CardHeader className="bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 rounded-t-lg border-b border-medical-border">
                  <CardTitle className="text-xl font-bold text-medical-text-primary flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-medical-primary" />
                    Billing Analytics
                  </CardTitle>
                  <CardDescription>Your spending patterns and cost analysis</CardDescription>
                </CardHeader>
                <CardContent className="p-6 lg:p-8">
                  {/* Enhanced Billing Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-0 shadow-medical-soft bg-gradient-to-br from-medical-success/5 to-medical-success/10">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-medical-success rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-medical-success font-medium mb-2">This Month</p>
                        <p className="text-3xl font-bold text-medical-success">{formatCurrency(stats.thisMonthSpend)}</p>
                        {stats.lastMonthSpend > 0 && (
                          <p className="text-xs text-medical-success/70 mt-1">
                            {stats.thisMonthSpend > stats.lastMonthSpend ? '+' : ''}
                            {(((stats.thisMonthSpend - stats.lastMonthSpend) / stats.lastMonthSpend) * 100).toFixed(1)}% vs last month
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-medical-soft bg-gradient-to-br from-medical-primary/5 to-medical-primary/10">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-3">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-medical-primary font-medium mb-2">Platform Fee (15%)</p>
                        <p className="text-3xl font-bold text-medical-primary">{formatCurrency(stats.thisMonthSpend * 0.15)}</p>
                        <p className="text-xs text-medical-primary/70 mt-1">Includes processing & support</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-medical-soft bg-gradient-to-br from-medical-purple/5 to-medical-purple/10">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-medical-purple rounded-full flex items-center justify-center mx-auto mb-3">
                          <HeartHandshake className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-medical-purple font-medium mb-2">Nurse Payments (85%)</p>
                        <p className="text-3xl font-bold text-medical-purple">{formatCurrency(stats.thisMonthSpend * 0.85)}</p>
                        <p className="text-xs text-medical-purple/70 mt-1">Direct to caregivers</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Enhanced Benefits Section */}
                  <div className="bg-gradient-to-r from-medical-accent/10 to-medical-primary/10 border border-medical-accent/20 rounded-xl p-6">
                    <h4 className="font-semibold text-medical-accent mb-4 flex items-center text-lg">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Platform Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Zap className="h-4 w-4 text-medical-success" />
                          <span className="text-medical-text-primary">Instant payment processing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Shield className="h-4 w-4 text-medical-primary" />
                          <span className="text-medical-text-primary">HIPAA compliant security</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Award className="h-4 w-4 text-medical-accent" />
                          <span className="text-medical-text-primary">Licensed professional verification</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="h-4 w-4 text-medical-purple" />
                          <span className="text-medical-text-primary">24/7 communication platform</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-medical-warning" />
                          <span className="text-medical-text-primary">Automated timecard management</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Receipt className="h-4 w-4 text-medical-rose" />
                          <span className="text-medical-text-primary">Detailed billing & receipts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}