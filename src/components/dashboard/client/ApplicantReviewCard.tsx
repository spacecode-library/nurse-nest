// components/dashboard/client/ApplicantReviewCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Phone,
  Mail,
  Award,
  Eye,
  UserCheck,
  UserX,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob, updateApplicationStatus } from '@/supabase/api/applicationService';

interface Application {
  id: string;
  status: string;
  cover_message?: string;
  created_at: string;
  job_postings: {
    id: string;
    job_code: string;
    care_type: string;
  };
  nurse_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url: string;
    phone_number: string;
    onboarding_completed: boolean;
  };
}

interface ApplicantReviewCardProps {
  clientId: string;
  onApplicationUpdate: () => void;
}

export default function ApplicantReviewCard({ 
  clientId, 
  onApplicationUpdate 
}: ApplicantReviewCardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [nurseDetails, setNurseDetails] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [clientId]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, jobFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load client's job postings
      const { data: jobsData, error: jobsError } = await getClientJobPostings(clientId, 100, 0);
      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Load all applications for client's jobs
      const allApplications: Application[] = [];
      
      if (jobsData && jobsData.length > 0) {
        for (const job of jobsData) {
          const { data: jobApplications, error: appError } = await getApplicationsByJob(job.id, 100, 0);
          if (appError) {
            console.error(`Error loading applications for job ${job.id}:`, appError);
            continue;
          }
          
          if (jobApplications) {
            const applicationsWithJobInfo = jobApplications.map(app => ({
              ...app,
              job_postings: job
            }));
            allApplications.push(...applicationsWithJobInfo);
          }
        }
      }

      setApplications(allApplications);
    } catch (error: any) {
      console.error('Error loading applicant data:', error);
      toast({
        title: "Error",
        description: "Failed to load applicant data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        `${app.nurse_profiles.first_name} ${app.nurse_profiles.last_name}`.toLowerCase().includes(searchLower) ||
        app.job_postings.job_code.toLowerCase().includes(searchLower) ||
        app.job_postings.care_type.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by job
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.job_postings.id === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'shortlisted' | 'hired' | 'declined') => {
    try {
      const { error } = await updateApplicationStatus(applicationId, newStatus);
      if (error) throw error;

      toast({
        title: "Application Updated",
        description: `Application status changed to ${newStatus}`
      });

      loadData();
      onApplicationUpdate();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status",
        variant: "destructive"
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'shortlisted':
        return <Star className="h-4 w-4" />;
      case 'hired':
        return <UserCheck className="h-4 w-4" />;
      case 'declined':
        return <UserX className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={application.nurse_profiles.profile_photo_url || '/api/placeholder/64/64'}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {application.nurse_profiles.first_name} {application.nurse_profiles.last_name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Applied for: {application.job_postings.job_code} - {application.job_postings.care_type}
                </p>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center`}>
                {getStatusIcon(application.status)}
                <span className="ml-1 capitalize">{application.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Applied: {new Date(application.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                {application.nurse_profiles.onboarding_completed ? 'Verified Profile' : 'Profile Incomplete'}
              </div>
            </div>

            {application.cover_message && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 italic line-clamp-2">
                  "{application.cover_message}"
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedApplicant(application)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              
              {application.status === 'new' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(application.id, 'declined')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </>
              )}
              
              {application.status === 'shortlisted' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'hired')}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Hire
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(application.id, 'declined')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </>
              )}
              
              {application.status === 'hired' && (
                <Button
                  size="sm"
                  onClick={() => {
                    // Navigate to contract creation
                    toast({
                      title: "Contract Creation",
                      description: "Contract creation feature coming soon"
                    });
                  }}
                >
                  Create Contract
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const groupApplicationsByStatus = () => {
    const newApps = filteredApplications.filter(app => app.status === 'new');
    const shortlisted = filteredApplications.filter(app => app.status === 'shortlisted');
    const hired = filteredApplications.filter(app => app.status === 'hired');
    const declined = filteredApplications.filter(app => app.status === 'declined');

    return { newApps, shortlisted, hired, declined };
  };

  const { newApps, shortlisted, hired, declined } = groupApplicationsByStatus();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Applicant Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New Applications</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.job_code} - {job.care_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-gray-600 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time Metric */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Average Response Time: 18 hours</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Target: &lt;48 hours
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600">
                  When nurses apply for your jobs, their applications will appear here.
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Matching Applications
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more applications.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="new" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">
                    New ({newApps.length})
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted">
                    Shortlisted ({shortlisted.length})
                  </TabsTrigger>
                  <TabsTrigger value="hired">
                    Hired ({hired.length})
                  </TabsTrigger>
                  <TabsTrigger value="declined">
                    Declined ({declined.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                  <div className="space-y-4">
                    {newApps.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No new applications
                      </p>
                    ) : (
                      newApps.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="shortlisted" className="mt-6">
                  <div className="space-y-4">
                    {shortlisted.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No shortlisted candidates
                      </p>
                    ) : (
                      shortlisted.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                  <div className="space-y-4">
                    {hired.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No hired candidates
                      </p>
                    ) : (
                      hired.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="declined" className="mt-6">
                  <div className="space-y-4">
                    {declined.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No declined applications
                      </p>
                    ) : (
                      declined.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applicant Details Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nurse Profile</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedApplicant.nurse_profiles.profile_photo_url || '/api/placeholder/80/80'}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedApplicant.nurse_profiles.first_name} {selectedApplicant.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600">
                    Applied for: {selectedApplicant.job_postings.job_code}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedApplicant.nurse_profiles.phone_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Profile Status</label>
                  <p className="text-gray-900">
                    {selectedApplicant.nurse_profiles.onboarding_completed ? 'Verified' : 'Incomplete'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Application Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedApplicant.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedApplicant.status)}>
                    {selectedApplicant.status}
                  </Badge>
                </div>
              </div>

              {selectedApplicant.cover_message && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Cover Message</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedApplicant.cover_message}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplicant(null)}
                >
                  Close
                </Button>
                {selectedApplicant.status === 'new' && (
                  <>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedApplicant.id, 'shortlisted');
                        setSelectedApplicant(null);
                      }}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Shortlist
                    </Button>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedApplicant.id, 'hired');
                        setSelectedApplicant(null);
                      }}
                    >
                      Hire Now
                    </Button>
                  </>
                )}
                {selectedApplicant.status === 'shortlisted' && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedApplicant.id, 'hired');
                      setSelectedApplicant(null);
                    }}
                  >
                    Hire
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}