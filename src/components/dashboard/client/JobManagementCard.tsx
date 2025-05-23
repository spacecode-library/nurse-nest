// components/dashboard/client/JobManagementCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Copy,
  MoreVertical,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle
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

interface JobWithApplications extends JobPosting {
  applications?: any[];
  applicationCount?: number;
  newApplications?: number;
  lastApplicationDate?: string;
}

interface JobManagementCardProps {
  clientId: string;
  onJobCreated: () => void;
}

export default function JobManagementCard({ 
  clientId, 
  onJobCreated 
}: JobManagementCardProps) {
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobWithApplications | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [clientId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data: jobsData, error } = await getClientJobPostings(clientId, 100, 0);
      if (error) throw error;

      if (!jobsData || jobsData.length === 0) {
        setJobs([]);
        return;
      }

      // Load applications for each job to get enhanced data
      const jobsWithApplications = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const { data: applications, count, error: appError } = await getApplicationsByJob(job.id, 100, 0);
            
            if (appError) {
              console.error(`Error loading applications for job ${job.id}:`, appError);
              return {
                ...job,
                applications: [],
                applicationCount: 0,
                newApplications: 0,
                lastApplicationDate: null
              };
            }

            // Count new applications (from last 24 hours)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const newApplications = applications?.filter(app => 
              new Date(app.created_at) > yesterday && app.status === 'new'
            ).length || 0;

            // Get last application date
            const lastApplicationDate = applications && applications.length > 0 
              ? applications[0].created_at 
              : null;

            return {
              ...job,
              applications: applications || [],
              applicationCount: count || 0,
              newApplications,
              lastApplicationDate
            };
          } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            return {
              ...job,
              applications: [],
              applicationCount: 0,
              newApplications: 0,
              lastApplicationDate: null
            };
          }
        })
      );

      setJobs(jobsWithApplications);
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

  const handleJobCreated = () => {
    setShowCreateForm(false);
    loadJobs();
    onJobCreated();
    toast({
      title: "Job Created Successfully",
      description: "Your job posting is now live and accepting applications!"
    });
  };

  const handleStatusChange = async (jobId: string, newStatus: 'open' | 'filled' | 'expired') => {
    try {
      setActionLoading(jobId);
      const { error } = await updateJobStatus(jobId, newStatus);
      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Job status changed to ${newStatus}`
      });

      loadJobs();
      onJobCreated(); // Refresh parent dashboard
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update job status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const confirmMessage = job.applicationCount > 0 
      ? `Are you sure you want to delete this job? This will also delete ${job.applicationCount} application(s). This action cannot be undone.`
      : 'Are you sure you want to delete this job posting? This action cannot be undone.';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(jobId);
      const { error } = await deleteJobPosting(jobId);
      if (error) throw error;

      toast({
        title: "Job Deleted",
        description: "Job posting has been removed"
      });

      loadJobs();
      setSelectedJob(null);
      onJobCreated(); // Refresh parent dashboard
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete job posting",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicateJob = async (job: JobPosting) => {
    try {
      setActionLoading(job.id);
      // This will be handled by the JobPostingForm with pre-filled data
      setSelectedJob(job);
      setShowCreateForm(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to duplicate job",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'filled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="h-4 w-4" />;
      case 'filled':
        return <Users className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.care_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.duration.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'applications':
          return (b.applicationCount || 0) - (a.applicationCount || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'care_type':
          return a.care_type.localeCompare(b.care_type);
        default:
          return 0;
      }
    });

  const JobCard = ({ job }: { job: JobWithApplications }) => (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{job.care_type}</h3>
              <Badge className={`${getStatusColor(job.status)} flex items-center text-xs`}>
                {getStatusIcon(job.status)}
                <span className="ml-1 capitalize">{job.status}</span>
              </Badge>
              {job.newApplications > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {job.newApplications} New
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Code: <span className="font-mono ml-1">{job.job_code}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Duration: {job.duration}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Schedule: {job.preferred_time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Applications: {job.applicationCount || 0}
                {job.lastApplicationDate && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Last: {new Date(job.lastApplicationDate).toLocaleDateString()})
                  </span>
                )}
              </div>
            </div>

            {job.benefits && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Benefits:</span> {job.benefits}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {job.applicationCount || 0}
              </p>
              <p className="text-xs text-gray-500">Applications</p>
            </div>
            
            {job.applicationCount > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {Math.round(((job.applications?.filter(app => app.status === 'hired').length || 0) / job.applicationCount) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedJob(job)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDuplicateJob(job)}
            disabled={actionLoading === job.id}
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          
          {job.status === 'open' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(job.id, 'filled')}
                disabled={actionLoading === job.id}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Mark Filled
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(job.id, 'expired')}
                disabled={actionLoading === job.id}
                className="text-gray-600 border-gray-600 hover:bg-gray-50"
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
              disabled={actionLoading === job.id}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Reopen
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteJob(job.id)}
            disabled={actionLoading === job.id}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        
        {actionLoading === job.id && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-700">Processing...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const groupJobsByStatus = () => {
    const openJobs = filteredAndSortedJobs.filter(job => job.status === 'open');
    const filledJobs = filteredAndSortedJobs.filter(job => job.status === 'filled');
    const expiredJobs = filteredAndSortedJobs.filter(job => job.status === 'expired');

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs by type, code, or duration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open Jobs</SelectItem>
                  <SelectItem value="filled">Filled Jobs</SelectItem>
                  <SelectItem value="expired">Closed/Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="applications">Applications</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="care_type">Care Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings ({filteredAndSortedJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Job Postings Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first job posting to start finding qualified nurses for your care needs.
                </p>
                <Button onClick={() => setShowCreateForm(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Job
                </Button>
              </div>
            ) : filteredAndSortedJobs.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Matching Jobs
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All Jobs ({filteredAndSortedJobs.length})
                  </TabsTrigger>
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
                  <div className="space-y-4">
                    {filteredAndSortedJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="open" className="mt-6">
                  <div className="space-y-4">
                    {openJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
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
                  <div className="space-y-4">
                    {filledJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
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
                  <div className="space-y-4">
                    {expiredJobs.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details - {selectedJob?.job_code}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              {/* Job Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900 font-mono">{selectedJob.job_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedJob.status)} flex items-center w-fit`}>
                    {getStatusIcon(selectedJob.status)}
                    <span className="ml-1 capitalize">{selectedJob.status}</span>
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
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Applications ({selectedJob.applicationCount || 0})
                </h4>
                {(selectedJob.applicationCount || 0) === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400 mt-1">Applications will appear here when nurses apply</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedJob.applications?.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">
                            {app.nurse_profiles.first_name} {app.nurse_profiles.last_name}
                          </span>
                          <p className="text-sm text-gray-500">
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                    {(selectedJob.applicationCount || 0) > 5 && (
                      <p className="text-xs text-gray-500 text-center">
                        And {(selectedJob.applicationCount || 0) - 5} more applications...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedJob.applicationCount || 0}</p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedJob.applications?.filter(app => app.status === 'hired').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Hired</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {(selectedJob.applicationCount || 0) > 0 
                      ? Math.round(((selectedJob.applications?.filter(app => app.status === 'hired').length || 0) / (selectedJob.applicationCount || 1)) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDuplicateJob(selectedJob)}
                    disabled={actionLoading === selectedJob.id}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Job
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteJob(selectedJob.id)}
                    disabled={actionLoading === selectedJob.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Job
                  </Button>
                </div>

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
                      disabled={actionLoading === selectedJob.id}
                    >
                      Mark as Filled
                    </Button>
                  )}
                  
                  {selectedJob.status !== 'open' && (
                    <Button
                      onClick={() => handleStatusChange(selectedJob.id, 'open')}
                      disabled={actionLoading === selectedJob.id}
                    >
                      Reopen Job
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedJob && selectedJob.id ? 'Duplicate Job Posting' : 'Create New Job Posting'}
            </DialogTitle>
          </DialogHeader>
          <JobPostingForm 
            clientId={clientId}
            templateJob={selectedJob || undefined}
            onJobCreated={handleJobCreated}
            onCancel={() => {
              setShowCreateForm(false);
              setSelectedJob(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}