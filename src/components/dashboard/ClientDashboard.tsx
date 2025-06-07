
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import JobManagementCard from './client/JobManagementCard';
import ApplicantReviewCard from './client/ApplicantReviewCard';
import ClientContractsCard from './client/ClientContractsCard';
import PaymentHistoryCard from './client/PaymentHistoryCard';
import BrowseNursesCard from './client/BrowseNursesCard';
import ClientQuickActionsCard from './client/ClientQuickActionsCard';
import EnhancedTimecardApprovalCard from './client/EnhancedTimecardApprovalCard';
import PaymentMethodSetup from './client/PaymentMethodSetup';
import JobPostingForm from './client/JobPostingForm';
import { Plus, FileText, Users, Clock, CreditCard, Search, Home, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  status: string;
  benefits?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Application {
  id: string;
  nurse_id: string;
  job_id: string;
  status: string;
  cover_message?: string;
  created_at?: string;
  updated_at?: string;
  nurse_profiles?: {
    first_name: string;
    last_name: string;
  };
  job_postings?: {
    job_code: string;
  } | null;
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUserData();
    fetchData();
  }, []);

  const getCurrentUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch job postings with proper field mapping
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*');

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        toast({
          title: "Error",
          description: "Failed to load job postings",
          variant: "destructive"
        });
      } else if (jobsData) {
        const mappedJobs: Job[] = jobsData.map(job => ({
          id: job.id,
          job_code: job.job_code || 'No Code',
          care_type: job.care_type || 'General Care',
          duration: job.duration || 'Not specified',
          preferred_time: job.preferred_time || 'Flexible',
          status: job.status || 'open',
          benefits: job.benefits,
          client_id: job.client_id,
          created_at: job.created_at,
          updated_at: job.updated_at
        }));
        setJobs(mappedJobs);
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          nurse_profiles (
            first_name,
            last_name
          ),
          job_postings (
            job_code
          )
        `);

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive"
        });
      } else if (applicationsData) {
        const mappedApplications: Application[] = applicationsData
          .filter(app => app.job_postings && typeof app.job_postings === 'object' && app.job_postings !== null && 'job_code' in app.job_postings)
          .map(app => ({
            id: app.id,
            nurse_id: app.nurse_id,
            job_id: app.job_id,
            status: app.status,
            cover_message: app.cover_message,
            created_at: app.created_at,
            updated_at: app.updated_at,
            nurse_profiles: app.nurse_profiles,
            job_postings: app.job_postings as { job_code: string }
          }));
        setApplications(mappedApplications);
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleJobCreated = () => {
    fetchData();
    setActiveTab('overview');
  };

  const handleApplicationUpdate = () => {
    fetchData();
  };

  const renderTabContent = () => {
    const clientId = currentUser?.id || '';
    const clientEmail = currentUser?.email || '';
    const clientName = `${currentUser?.user_metadata?.first_name || ''} ${currentUser?.user_metadata?.last_name || ''}`.trim();

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-3xl p-8 md:p-12">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-light text-[#1e293b] mb-4">
                  Welcome back, {currentUser?.user_metadata?.first_name || 'there'}! 👋
                </h1>
                <div className="text-lg text-[#475569] mb-8">
                  {jobs.length === 0 ? (
                    <p>Ready to find your perfect nurse?</p>
                  ) : (
                    <p>You have {jobs.filter(j => j.status === 'open').length} active jobs, {applications.length} applications pending</p>
                  )}
                </div>
                <Button
                  onClick={() => setActiveTab('post-job')}
                  className="bg-[#9bcbff] hover:bg-[#3b82f6] text-[#1e293b] hover:text-white px-8 py-4 text-lg rounded-xl shadow-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {jobs.length === 0 ? 'Find My Perfect Nurse' : 'Post a New Job'}
                </Button>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div>
              <h2 className="text-2xl font-light text-[#1e293b] mb-6">What would you like to do today?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Button
                  onClick={() => setActiveTab('post-job')}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-3 border-2 border-[#e2e8f0] hover:border-[#9bcbff] hover:bg-[#f0f9ff] transition-all duration-300"
                >
                  <div className="p-3 rounded-full bg-[#9bcbff] text-[#1e293b]">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#1e293b]">Post a New Job</span>
                </Button>

                <Button
                  onClick={() => setActiveTab('applications')}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-3 border-2 border-[#e2e8f0] hover:border-[#3b82f6] hover:bg-[#f0f9ff] transition-all duration-300"
                >
                  <div className="p-3 rounded-full bg-[#3b82f6] text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#1e293b]">Review Applications</span>
                </Button>

                <Button
                  onClick={() => setActiveTab('timecards')}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-3 border-2 border-[#e2e8f0] hover:border-[#10b981] hover:bg-[#f0fdf4] transition-all duration-300"
                >
                  <div className="p-3 rounded-full bg-[#10b981] text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#1e293b]">Approve Hours</span>
                </Button>

                <Button
                  onClick={() => setActiveTab('payments')}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-3 border-2 border-[#e2e8f0] hover:border-[#f59e0b] hover:bg-[#fffbeb] transition-all duration-300"
                >
                  <div className="p-3 rounded-full bg-[#f59e0b] text-white">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#1e293b]">Manage Payments</span>
                </Button>
              </div>
            </div>

            {/* Progress Guide */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0]">
              <h3 className="text-xl font-medium text-[#1e293b] mb-6">Your Journey to Great Care:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white font-medium">✓</div>
                  <span className="text-[#475569]">1. Create your account</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#9bcbff] flex items-center justify-center text-[#1e293b] font-medium">2</div>
                  <span className="text-[#475569]">2. Post your first job ← You are here</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#64748b] font-medium">3</div>
                  <span className="text-[#64748b]">3. Review nurse applications</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#64748b] font-medium">4</div>
                  <span className="text-[#64748b]">4. Interview and hire</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#64748b] font-medium">5</div>
                  <span className="text-[#64748b]">5. Manage your care team</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'jobs':
        return <JobManagementCard clientId={clientId} onJobCreated={handleJobCreated} />;
      case 'applications':
        return <ApplicantReviewCard clientId={clientId} onApplicationUpdate={handleApplicationUpdate} />;
      case 'contracts':
        return <ClientContractsCard clientId={clientId} onContractUpdate={handleApplicationUpdate} />;
      case 'timecards':
        return <EnhancedTimecardApprovalCard clientId={clientId} onInvoiceAction={handleApplicationUpdate} />;
      case 'payments':
        return (
          <div className="space-y-6">
            <PaymentMethodSetup clientId={clientId} clientEmail={clientEmail} clientName={clientName} />
            <PaymentHistoryCard clientId={clientId} />
          </div>
        );
      case 'post-job':
        return <JobPostingForm clientId={clientId} onJobCreated={handleJobCreated} onCancel={() => setActiveTab('overview')} />;
      default:
        return renderTabContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-white to-[#e0f2fe]">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <h1 className="text-2xl font-light text-[#1e293b]">
                <span className="text-[#1e293b]">Nurse</span>
                <span className="text-[#9bcbff]">Nest</span>
              </h1>
              <div className="hidden md:flex space-x-8">
                {[
                  { id: 'overview', label: 'Dashboard', icon: Home },
                  { id: 'jobs', label: 'My Jobs', icon: Briefcase },
                  { id: 'applications', label: 'Applications', icon: Users },
                  { id: 'contracts', label: 'Contracts', icon: FileText },
                  { id: 'timecards', label: 'Timecards', icon: Clock },
                  { id: 'payments', label: 'Payments', icon: CreditCard }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-[#9bcbff] text-[#1e293b] shadow-md'
                          : 'text-[#475569] hover:text-[#1e293b] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setActiveTab('post-job')}
                className="bg-[#9bcbff] hover:bg-[#3b82f6] text-[#1e293b] hover:text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="px-6 py-4">
          <h1 className="text-xl font-light text-[#1e293b]">
            <span className="text-[#1e293b]">Nurse</span>
            <span className="text-[#9bcbff]">Nest</span>
          </h1>
        </div>
        
        {/* Mobile Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] z-50 md:hidden">
          <div className="grid grid-cols-5 h-16">
            {[
              { id: 'overview', label: 'Home', icon: Home },
              { id: 'applications', label: 'Nurses', icon: Users },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'payments', label: 'Pay', icon: CreditCard },
              { id: 'post-job', label: 'Post', icon: Plus }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-[#9bcbff] bg-[#f0f9ff]'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9bcbff] mx-auto mb-4"></div>
              <p className="text-[#475569]">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
}
