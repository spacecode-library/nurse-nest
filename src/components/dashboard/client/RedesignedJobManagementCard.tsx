
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Briefcase, Plus } from 'lucide-react';

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

interface RedesignedJobManagementCardProps {
  clientId: string;
  onJobCreated: () => void;
}

export default function RedesignedJobManagementCard({ clientId, onJobCreated }: RedesignedJobManagementCardProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [clientId]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        const mappedJobs: Job[] = (data || []).map(job => ({
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
    } catch (error) {
      console.error('Error in fetchJobs:', error);
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

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-[#9bcbff] to-[#3b82f6] rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-light text-[#1e293b] mb-4">No jobs posted yet? No problem!</h3>
          
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#9bcbff] rounded-full flex items-center justify-center text-[#1e293b] font-bold text-sm flex-shrink-0 mt-1">1</div>
              <p className="text-[#475569]">Tell us what kind of care you need</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">2</div>
              <p className="text-[#475569]">We'll show you qualified nurses</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">3</div>
              <p className="text-[#475569]">Interview and hire your favorites</p>
            </div>
          </div>

          <Button
            onClick={onJobCreated}
            className="bg-[#9bcbff] hover:bg-[#3b82f6] text-[#1e293b] hover:text-white px-8 py-4 text-lg rounded-xl shadow-lg font-medium transition-all duration-300 transform hover:scale-105 mb-4"
          >
            Create My First Job
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-[#64748b]">
            Not sure what you need? <button className="text-[#3b82f6] hover:underline">Get help from our care experts</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-light mb-2">Your Nursing Jobs</h2>
        <p className="text-blue-100 mb-6">Manage your job postings and connect with qualified nurses</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-light mb-1">{jobs.filter(j => j.status === 'open').length}</div>
            <div className="text-blue-100">Active Jobs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-light mb-1">{jobs.filter(j => j.status === 'filled').length}</div>
            <div className="text-blue-100">Filled Positions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-light mb-1">{jobs.length}</div>
            <div className="text-blue-100">Total Posted</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="border border-[#e2e8f0] hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#1e293b] mb-2">{job.care_type}</h3>
                  <div className="text-sm text-[#475569] space-y-1">
                    <p>Duration: {job.duration}</p>
                    <p>Schedule: {job.preferred_time}</p>
                    <p>Job Code: {job.job_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'open' ? 'bg-[#10b981] text-white' :
                    job.status === 'filled' ? 'bg-[#3b82f6] text-white' :
                    'bg-[#e2e8f0] text-[#64748b]'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
