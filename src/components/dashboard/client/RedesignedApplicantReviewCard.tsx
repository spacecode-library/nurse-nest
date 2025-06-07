
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, FileText, DollarSign, Clock, Star } from 'lucide-react';

interface Application {
  id: string;
  nurse_id: string;
  job_id: string;
  status: string;
  cover_message?: string;
  created_at?: string;
  nurse_profiles?: {
    first_name: string;
    last_name: string;
  };
  job_postings?: {
    job_code: string;
  } | null;
}

interface RedesignedApplicantReviewCardProps {
  clientId: string;
  onApplicationUpdate: () => void;
}

export default function RedesignedApplicantReviewCard({ clientId, onApplicationUpdate }: RedesignedApplicantReviewCardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [clientId]);

  const fetchApplications = async () => {
    try {
      // Get job IDs for this client first
      const { data: jobs } = await supabase
        .from('job_postings')
        .select('id')
        .eq('client_id', clientId);

      if (!jobs || jobs.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const jobIds = jobs.map(job => job.id);

      const { data, error } = await supabase
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
        `)
        .in('job_id', jobIds);

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        const mappedApplications: Application[] = (data || [])
          .filter(app => app.job_postings && typeof app.job_postings === 'object' && app.job_postings !== null && 'job_code' in app.job_postings)
          .map(app => ({
            id: app.id,
            nurse_id: app.nurse_id,
            job_id: app.job_id,
            status: app.status,
            cover_message: app.cover_message,
            created_at: app.created_at,
            nurse_profiles: app.nurse_profiles,
            job_postings: app.job_postings as { job_code: string }
          }));
        setApplications(mappedApplications);
      }
    } catch (error) {
      console.error('Error in fetchApplications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-[#f1f5f9] rounded-2xl"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-[#3b82f6] to-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-light text-[#1e293b] mb-4">No applications yet? Here's how to get started:</h3>
          
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-[#9bcbff] flex-shrink-0 mt-1" />
              <p className="text-[#475569]">Make sure your job posting is complete</p>
            </div>
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-[#9bcbff] flex-shrink-0 mt-1" />
              <p className="text-[#475569]">Add specific details about your care needs</p>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-[#9bcbff] flex-shrink-0 mt-1" />
              <p className="text-[#475569]">Competitive pay attracts better candidates</p>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-[#9bcbff] flex-shrink-0 mt-1" />
              <p className="text-[#475569]">Most nurses apply within 24-48 hours</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onApplicationUpdate}
              className="bg-[#9bcbff] hover:bg-[#3b82f6] text-[#1e293b] hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Review My Job Posting
            </Button>
            <Button
              variant="outline"
              className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Browse Available Nurses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-light text-[#1e293b] mb-1">Your Nurse Applications</h2>
            <p className="text-[#475569]">Find and connect with amazing nurses who want to help</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64 border-[#e2e8f0] focus:border-[#9bcbff] rounded-xl"
              />
            </div>
            <select className="px-4 py-2 border border-[#e2e8f0] rounded-xl focus:border-[#9bcbff] focus:outline-none">
              <option>All Applications</option>
              <option>Pending</option>
              <option>Reviewed</option>
              <option>Accepted</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="border border-[#e2e8f0] hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#1e293b] mb-2">
                      {application.nurse_profiles?.first_name} {application.nurse_profiles?.last_name}
                    </h3>
                    <div className="text-sm text-[#475569] space-y-1">
                      <p>Job: {application.job_postings?.job_code}</p>
                      <p>Applied: {new Date(application.created_at || '').toLocaleDateString()}</p>
                      {application.cover_message && (
                        <p className="mt-2 text-[#475569]">{application.cover_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'pending' ? 'bg-[#f59e0b] text-white' :
                      application.status === 'accepted' ? 'bg-[#10b981] text-white' :
                      'bg-[#e2e8f0] text-[#64748b]'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-[#3b82f6] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
