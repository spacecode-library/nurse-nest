// components/dashboard/nurse/JobApplicationsCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Eye, 
  Send, 
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import API services
import { getOpenJobPostings, advancedJobSearch } from '@/supabase/api/jobPostingService';
import { getApplicationsByNurse, submitApplication } from '@/supabase/api/applicationService';

interface JobPosting {
  id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  benefits?: string;
  status: string;
  created_at: string;
  client_profiles: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface Application {
  id: string;
  status: string;
  cover_message?: string;
  created_at: string;
  job_postings: JobPosting;
}

interface JobApplicationsCardProps {
  nurseId: string;
  onApplicationSubmitted: () => void;
  showMyApplications?: boolean;
}

export default function JobApplicationsCard({ 
  nurseId, 
  onApplicationSubmitted,
  showMyApplications = false 
}: JobApplicationsCardProps) {
  const [availableJobs, setAvailableJobs] = useState<JobPosting[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [careTypeFilter, setCareTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [coverMessage, setCoverMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
    loadMyApplications();
  }, [nurseId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data: jobs, error } = await getOpenJobPostings(50, 0);
      if (error) throw error;
      setAvailableJobs(jobs || []);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load available jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      const { data: applications, error } = await getApplicationsByNurse(nurseId, 50, 0);
      if (error) throw error;
      setMyApplications(applications || []);
    } catch (error: any) {
      console.error('Error loading applications:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchTerm) filters.keywords = searchTerm;
      if (careTypeFilter && careTypeFilter !== 'all') filters.careType = careTypeFilter;
      if (timeFilter && timeFilter !== 'all') filters.preferredTime = timeFilter;

      const { data: jobs, error } = await advancedJobSearch(filters, 50, 0);
      if (error) throw error;
      setAvailableJobs(jobs || []);
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search jobs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      setSubmitting(true);
      const { data, error } = await submitApplication({
        nurse_id: nurseId,
        job_id: selectedJob.id,
        cover_message: coverMessage.trim() || null
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: `Your application for ${selectedJob.job_code} has been submitted successfully!`
      });

      setSelectedJob(null);
      setCoverMessage('');
      loadMyApplications();
      onApplicationSubmitted();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Timer className="h-4 w-4" />;
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4" />;
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-amber-100 text-amber-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if nurse has already applied to a job
  const hasApplied = (jobId: string) => {
    return myApplications.some(app => app.job_postings.id === jobId);
  };

  const JobCard = ({ job }: { job: JobPosting }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{job.job_code}</h3>
            <p className="text-gray-600">{job.care_type}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {job.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            Client: {job.client_profiles.first_name} {job.client_profiles.last_name}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Duration: {job.duration} | Time: {job.preferred_time}
          </div>
          {job.benefits && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Benefits: {job.benefits}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedJob(job)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {hasApplied(job.id) ? (
            <Button variant="outline" size="sm" disabled>
              <CheckCircle className="h-4 w-4 mr-1" />
              Applied
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Send className="h-4 w-4 mr-1" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for {job.job_code}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Job Details:</h4>
                    <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                      <p><strong>Care Type:</strong> {job.care_type}</p>
                      <p><strong>Duration:</strong> {job.duration}</p>
                      <p><strong>Preferred Time:</strong> {job.preferred_time}</p>
                      {job.benefits && <p><strong>Benefits:</strong> {job.benefits}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Tell the client why you're a great fit for this position..."
                      value={coverMessage}
                      onChange={(e) => setCoverMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(null);
                        setCoverMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedJob(job);
                        handleApply();
                      }}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {application.job_postings.job_code}
            </h3>
            <p className="text-gray-600">{application.job_postings.care_type}</p>
          </div>
          <Badge className={`${getStatusColor(application.status)} flex items-center`}>
            {getStatusIcon(application.status)}
            <span className="ml-1 capitalize">{application.status}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Applied: {new Date(application.created_at).toLocaleDateString()}
          </div>
          {application.cover_message && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">Cover Message:</p>
              <p className="italic">"{application.cover_message}"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (showMyApplications) {
    return (
      <div className="space-y-6">
        {myApplications.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600">
              Start applying for jobs to see your applications here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Find Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={careTypeFilter} onValueChange={setCareTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Care Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Adult">Adult Care</SelectItem>
                <SelectItem value="Pediatric">Pediatric</SelectItem>
                <SelectItem value="Elderly">Elderly Care</SelectItem>
                <SelectItem value="Postpartum">Postpartum</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Preferred Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="Daytime">Daytime</SelectItem>
                <SelectItem value="Overnight">Overnight</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        ) : availableJobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Jobs Available
            </h3>
            <p className="text-gray-600">
              There are no open positions matching your criteria at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}