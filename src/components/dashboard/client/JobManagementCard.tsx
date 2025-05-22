// components/dashboard/client/JobManagementCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientJobPostings, updateJobStatus, deleteJobPosting } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob } from '@/supabase/api/applicationService';
import JobPostingForm from './JobPostingForm';

interface JobPosting {
  id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  benefits?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface JobManagementCardProps {
  clientId: string;
  onJobCreated: () => void;
}

export default function JobManagementCard({ 
  clientId, 
  onJobCreated 
}: JobManagementCardProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobApplications, setJobApplications] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, [clientId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data: jobsData, error } = await getClientJobPostings(clientId, 50, 0);
      if (error) throw error;
      setJobs(jobsData || []);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadJobApplications = async (jobId: string) => {
    try {
      const { data: applications, error } = await getApplicationsByJob(jobId, 50, 0);
      if (error) throw error;
      setJobApplications(applications || []);
    } catch (error: any) {
      console.error('Error loading applications:', error);
    }
  };

  const handleJobCreated = () => {
    setShowCreateForm(false);
    loadJobs();
    onJobCreated();
  };

  const handleStatusChange = async (jobId: string, newStatus: 'open' | 'filled' | 'expired') => {
    try {
      const { error } = await updateJobStatus(jobId, newStatus);
      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Job status changed to ${newStatus}`
      });

      loadJobs();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await deleteJobPosting(jobId);
      if (error) throw error;

      toast({
        title: "Job Deleted",
        description: "Job posting has been removed"
      });

      loadJobs();
      setSelectedJob(null);
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete job posting",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const JobCard = ({ job }: { job: JobPosting }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{job.job_code}</h3>
            <p className="text-gray-600">{job.care_type}</p>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Duration: {job.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule: {job.preferred_time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedJob(job);
              loadJobApplications(job.id);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {job.status === 'open' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(job.id, 'filled')}
              >
                Mark Filled
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(job.id, 'expired')}
              >
                Close Job
              </Button>
            </>
          )}
          
          {job.status !== 'open' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(job.id, 'open')}
            >
              Reopen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const groupJobsByStatus = () => {
    const openJobs = jobs.filter(job => job.status === 'open');
    const filledJobs = jobs.filter(job => job.status === 'filled');
    const expiredJobs = jobs.filter(job => job.status === 'expired');

    return { openJobs, filledJobs, expiredJobs };
  };

  const { openJobs, filledJobs, expiredJobs } = groupJobsByStatus();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading job postings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Management
              </CardTitle>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{openJobs.length}</p>
                <p className="text-sm text-gray-600">Open Positions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filledJobs.length}</p>
                <p className="text-sm text-gray-600">Filled Positions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{expiredJobs.length}</p>
                <p className="text-sm text-gray-600">Closed/Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Job Postings Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first job posting to start finding qualified nurses.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Job
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="open" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="open">
                    Open ({openJobs.length})
                  </TabsTrigger>
                  <TabsTrigger value="filled">
                    Filled ({filledJobs.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired">
                    Closed ({expiredJobs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="open" className="mt-6">
                  <div className="grid gap-4">
                    {openJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No open job postings
                      </p>
                    ) : (
                      openJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="filled" className="mt-6">
                  <div className="grid gap-4">
                    {filledJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No filled positions
                      </p>
                    ) : (
                      filledJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="expired" className="mt-6">
                  <div className="grid gap-4">
                    {expiredJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No closed/expired jobs
                      </p>
                    ) : (
                      expiredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details - {selectedJob?.job_code}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              {/* Job Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900">{selectedJob.job_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedJob.status)}>
                    {selectedJob.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Care Type</label>
                  <p className="text-gray-900">{selectedJob.care_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-gray-900">{selectedJob.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Schedule</label>
                  <p className="text-gray-900">{selectedJob.preferred_time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Posted</label>
                  <p className="text-gray-900">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedJob.benefits && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Benefits & Requirements</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedJob.benefits}</p>
                </div>
              )}

              {/* Applications Summary */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Applications ({jobApplications.length})
                </h4>
                {jobApplications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No applications yet</p>
                ) : (
                  <div className="space-y-2">
                    {jobApplications.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {app.nurse_profiles.first_name} {app.nurse_profiles.last_name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                    {jobApplications.length > 5 && (
                      <p className="text-xs text-gray-500">
                        And {jobApplications.length - 5} more applications...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteJob(selectedJob.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>

                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </Button>
                  
                  {selectedJob.status === 'open' && (
                    <Button
                      onClick={() => handleStatusChange(selectedJob.id, 'filled')}
                    >
                      Mark as Filled
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Creation Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
          </DialogHeader>
          <JobPostingForm 
            clientId={clientId}
            onJobCreated={handleJobCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}