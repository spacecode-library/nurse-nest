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

interface Job {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  hourly_rate?: number;
  shift_type?: string;
  requirements?: string[];
  status: string;
  benefits?: string;
  care_type?: string;
  client_id?: string;
  created_at?: string;
  duration?: string;
  job_code?: string;
  preferred_time?: string;
  updated_at?: string;
}

interface Application {
  id: string;
  nurse_id: string;
  job_id: string;
  status: string;
  hourly_rate?: number;
  message?: string;
  cover_message?: string;
  created_at?: string;
  updated_at?: string;
  nurse_profiles?: {
    first_name: string;
    last_name: string;
  };
  job_postings?: {
    title: string;
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
        // Map the data to match our Job interface with proper fallbacks
        const mappedJobs: Job[] = jobsData.map(job => ({
          id: job.id,
          title: job.title || 'Untitled Job',
          description: job.description || '',
          location: job.location || '',
          hourly_rate: job.hourly_rate || 0,
          shift_type: job.shift_type || '',
          requirements: job.requirements || [],
          status: job.status || '',
          benefits: job.benefits,
          care_type: job.care_type,
          client_id: job.client_id,
          created_at: job.created_at,
          duration: job.duration,
          job_code: job.job_code,
          preferred_time: job.preferred_time,
          updated_at: job.updated_at
        }));
        setJobs(mappedJobs);
      }

      // Fetch applications with proper data mapping
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          nurse_profiles (
            first_name,
            last_name
          ),
          job_postings (
            title
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
        // Map the data to match our Application interface with proper error handling
        const mappedApplications: Application[] = applicationsData
          .filter(app => app.job_postings && typeof app.job_postings === 'object' && app.job_postings !== null && 'title' in app.job_postings)
          .map(app => ({
            id: app.id,
            nurse_id: app.nurse_id,
            job_id: app.job_id,
            status: app.status,
            hourly_rate: app.hourly_rate || 0,
            message: app.cover_message || '',
            cover_message: app.cover_message,
            created_at: app.created_at,
            updated_at: app.updated_at,
            nurse_profiles: app.nurse_profiles,
            job_postings: app.job_postings as { title: string }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2 xl:col-span-2 space-y-6">
              <JobManagementCard clientId={clientId} onJobCreated={handleJobCreated} />
              <ApplicantReviewCard clientId={clientId} onApplicationUpdate={handleApplicationUpdate} />
            </div>
            <div className="space-y-6">
              <ClientQuickActionsCard clientId={clientId} onRefresh={handleRefresh} />
              <BrowseNursesCard clientId={clientId} />
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
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2 xl:col-span-2 space-y-6">
              <JobManagementCard clientId={clientId} onJobCreated={handleJobCreated} />
              <ApplicantReviewCard clientId={clientId} onApplicationUpdate={handleApplicationUpdate} />
            </div>
            <div className="space-y-6">
              <ClientQuickActionsCard clientId={clientId} onRefresh={handleRefresh} />
              <BrowseNursesCard clientId={clientId} />
            </div>
          </div>
        );
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Client Dashboard</h1>
              <div className="hidden md:flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'jobs', label: 'My Jobs' },
                  { id: 'applications', label: 'Applications' },
                  { id: 'contracts', label: 'Contracts' },
                  { id: 'timecards', label: 'Timecards' },
                  { id: 'payments', label: 'Payments' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setActiveTab('post-job')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Post New Job
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
}
