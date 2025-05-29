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
  Heart, // Changed from Star to Heart for favorite
  Calendar, 
  Phone,
  Mail,
  Award,
  Eye,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  MessageCircle,
  X,
  FileText,
  CheckCircle,
  Loader2,
  MapPin,
  Sparkles // Added for premium feel
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client.js';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';
import { getApplicationsByJob, updateApplicationStatus } from '@/supabase/api/applicationService';
import { createContract, generateContractTermsTemplate } from '@/supabase/api/contractService';

// Import your chat components
import ChatWindow from '@/components/ChatWindow';
import { useAuth } from '@/contexts/AuthContext';

interface Application {
  id: string;
  status: string;
  cover_message?: string;
  created_at: string;
  job_postings: {
    id: string;
    job_code: string;
    care_type: string;
    title: string;
    duration: string;
    preferred_time: string;
    benefits?: string;
  };
  nurse_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    profile_photo_url: string;
    phone_number: string;
    onboarding_completed: boolean;
  };
}

interface ApplicantReviewCardProps {
  clientId: string;
  onApplicationUpdate: () => void;
}

// Enhanced date formatting function
const formatPremiumDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const longFormat = date.toLocaleDateString('en-US', options);
  const shortFormat = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  return `${longFormat} (${shortFormat})`;
};

const formatShortPremiumDate = (dateString: string) => {
  const date = new Date(dateString);
  const longFormat = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const shortFormat = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  return `${longFormat} (${shortFormat})`;
};

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
  const [activeChat, setActiveChat] = useState<{
    nurse: Application['nurse_profiles'];
    job: Application['job_postings'];
    conversationId?: string;
  } | null>(null);
  const [creatingContract, setCreatingContract] = useState(false);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
    loadClientProfile();
  }, [clientId]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, jobFilter]);

  const loadClientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (error) throw error;
      setClientProfile(data);
    } catch (error) {
      console.error('Error loading client profile:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: jobsData, error: jobsError } = await getClientJobPostings(clientId, 100, 0);
      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

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
              job_postings: job,
              nurse_profiles: {
                ...app.nurse_profiles,
                name: `${app.nurse_profiles.first_name} ${app.nurse_profiles.last_name}`
              }
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

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        `${app.nurse_profiles.first_name} ${app.nurse_profiles.last_name}`.toLowerCase().includes(searchLower) ||
        app.job_postings.job_code.toLowerCase().includes(searchLower) ||
        app.job_postings.care_type.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.job_postings.id === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'favorited' | 'hired' | 'declined') => {
    try {
      const { error } = await updateApplicationStatus(applicationId, newStatus);
      if (error) throw error;

      const statusMessages = {
        favorited: "Application marked as favorite! ⭐",
        hired: "Nurse hired successfully! 🎉",
        declined: "Application declined"
      };

      toast({
        title: "Application Updated",
        description: statusMessages[newStatus] || `Application status changed to ${newStatus}`
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

  const handleHireAndCreateContract = async (application: Application) => {
    try {
      setCreatingContract(true);

      const { error: statusError } = await updateApplicationStatus(application.id, 'hired');
      if (statusError) throw statusError;

      const { data: nurseDetails, error: nurseError } = await supabase
        .from('nurse_profiles')
        .select('*')
        .eq('id', application.nurse_profiles.id)
        .single();

      if (nurseError) throw nurseError;

      const contractTerms = generateContractTermsTemplate(
        {
          title: application.job_postings.care_type,
          careType: application.job_postings.care_type,
          duration: application.job_postings.duration,
          preferredTime: application.job_postings.preferred_time
        },
        {
          firstName: nurseDetails.first_name,
          lastName: nurseDetails.last_name
        },
        {
          firstName: clientProfile?.first_name || 'Client',
          lastName: clientProfile?.last_name || ''
        }
      );

      const { data: contract, error: contractError } = await createContract({
        nurse_id: application.nurse_profiles.id,
        client_id: clientId,
        job_id: application.job_postings.id,
        terms: contractTerms
      });

      if (contractError) throw contractError;

      toast({
        title: "🎉 Nurse Hired Successfully!",
        description: `Contract created and sent to ${application.nurse_profiles.name} for acceptance.`,
        duration: 5000
      });

      loadData();
      onApplicationUpdate();
      setSelectedApplicant(null);

    } catch (error: any) {
      console.error('Error hiring nurse and creating contract:', error);
      toast({
        title: "Hiring Failed",
        description: error.message || "Failed to complete hiring process",
        variant: "destructive"
      });
    } finally {
      setCreatingContract(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200';
      case 'favorited': // Changed from shortlisted
        return 'bg-gradient-to-r from-pink-50 to-rose-100 text-rose-800 border-rose-200';
      case 'hired':
        return 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'favorited': // Changed from shortlisted
        return <Heart className="h-4 w-4 fill-current" />;
      case 'hired':
        return <UserCheck className="h-4 w-4" />;
      case 'declined':
        return <UserX className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const ApplicationCard = ({ application }: { application: Application }) => {
    const hasUnreadMessages = false;
    const hasConversation = false;

    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        hasUnreadMessages ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Enhanced Profile Picture */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
              {application.nurse_profiles.profile_photo_url ? (
                <img 
                  src={application.nurse_profiles.profile_photo_url} 
                  alt="Nurse" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {application.nurse_profiles.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {application.nurse_profiles.first_name} {application.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600 font-medium">{application.job_postings.care_type}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    Job: {application.job_postings.job_code}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(application.status)} flex items-center border shadow-sm px-3 py-1`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2 capitalize font-medium">{application.status === 'favorited' ? 'Favorite' : application.status}</span>
                  </Badge>
                  {application.nurse_profiles.onboarding_completed && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Applied: {formatShortPremiumDate(application.created_at)}
                </div>
                {application.cover_message && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-800 mb-1">Cover Message:</p>
                    <p className="italic bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-400">
                      "{application.cover_message}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApplicant(application)}
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all text-blue-600"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                
                {application.status === 'new' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(application.id, 'favorited')}
                      className="hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-all"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Add to Favorites
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(application.id, 'declined')}
                      className="hover:bg-red-50 hover:border-red-300 text-red-600 transition-all"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                )}
                
                {(application.status === 'favorited') && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleHireAndCreateContract(application)}
                      disabled={creatingContract}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md transition-all"
                    >
                      {creatingContract ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Creating Contract...
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Hire & Create Contract
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(application.id, 'declined')}
                      className="hover:bg-red-50 hover:border-red-300 text-red-600 transition-all"
                      disabled={creatingContract}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                )}
                
                {application.status === 'hired' && (
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hired - Contract Created
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const contractsTab = document.querySelector('[value="contracts"]') as HTMLElement;
                        contractsTab?.click();
                      }}
                      className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Contract
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const groupApplicationsByStatus = () => {
    const newApps = filteredApplications.filter(app => app.status === 'new');
    const favorited = filteredApplications.filter(app => app.status === 'favorited'); // Changed from shortlisted
    const hired = filteredApplications.filter(app => app.status === 'hired');
    const declined = filteredApplications.filter(app => app.status === 'declined');

    return { newApps, favorited, hired, declined };
  };

  const { newApps, favorited, hired, declined } = groupApplicationsByStatus();

  // Rest of the component remains the same but with updated status references...
  // [Component continues with same structure but "shortlisted" replaced with "favorited"]

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Header with Premium Feel */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Sparkles className="h-8 w-8 mr-3 text-blue-600" />
            Applicant Review Center
          </h2>
          <p className="text-gray-600 text-lg">Discover and manage your perfect care professionals</p>
        </div>

        {/* Applications List with improved tabs */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-gray-900">Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 text-lg">
                  When nurses apply for your jobs, their applications will appear here.
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No Matching Applications
                </h3>
                <p className="text-gray-600 text-lg">
                  Try adjusting your filters to see more applications.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="new" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-8 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1">
                  <TabsTrigger value="all" className="rounded-lg font-medium">All ({filteredApplications.length})</TabsTrigger>
                  <TabsTrigger value="new" className="rounded-lg font-medium">
                    New ({newApps.length})
                    {newApps.length > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs animate-pulse shadow-sm">
                        {newApps.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="favorited" className="rounded-lg font-medium">
                    Favorites ({favorited.length})
                  </TabsTrigger>
                  <TabsTrigger value="hired" className="rounded-lg font-medium">
                    Hired ({hired.length})
                  </TabsTrigger>
                  <TabsTrigger value="declined" className="rounded-lg font-medium">
                    Declined ({declined.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6">
                    {filteredApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                  {newApps.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-900">
                          {newApps.length} new application{newApps.length !== 1 ? 's' : ''} awaiting your review
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-6">
                    {newApps.length === 0 ? (
                      <p className="text-center text-gray-500 py-8 text-lg">
                        No new applications
                      </p>
                    ) : (
                      newApps.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="favorited" className="mt-6">
                  <div className="grid gap-6">
                    {favorited.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No favorite candidates yet</p>
                        <p className="text-gray-400 text-sm mt-2">Mark applications as favorites to see them here</p>
                      </div>
                    ) : (
                      favorited.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                  <div className="grid gap-6">
                    {hired.length === 0 ? (
                      <div className="text-center py-12">
                        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hired candidates yet</p>
                      </div>
                    ) : (
                      hired.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="declined" className="mt-6">
                  <div className="grid gap-6">
                    {declined.length === 0 ? (
                      <div className="text-center py-12">
                        <UserX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No declined applications</p>
                      </div>
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

      {/* Enhanced Applicant Details Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Nurse Profile</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  {selectedApplicant.nurse_profiles.profile_photo_url ? (
                    <img
                      src={selectedApplicant.nurse_profiles.profile_photo_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedApplicant.nurse_profiles.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedApplicant.nurse_profiles.first_name} {selectedApplicant.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600 text-lg mb-1">
                    Applied for: {selectedApplicant.job_postings.job_code}
                  </p>
                  <Badge className={getStatusColor(selectedApplicant.status)}>
                    {selectedApplicant.status === 'favorited' ? 'Favorite' : selectedApplicant.status}
                  </Badge>
                </div>
              </div>

              {/* Rest of the dialog content with enhanced styling */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm border">
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                    <p className="text-gray-900 font-medium text-lg">{selectedApplicant.nurse_profiles.phone_number}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm border">
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Application Date</label>
                    <p className="text-gray-900 font-medium">
                      {formatPremiumDate(selectedApplicant.created_at)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm border">
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profile Status</label>
                    <div className="flex items-center mt-1">
                      {selectedApplicant.nurse_profiles.onboarding_completed ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm border">
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                    <Badge className={`${getStatusColor(selectedApplicant.status)} mt-1`}>
                      {selectedApplicant.status === 'favorited' ? 'Favorite' : selectedApplicant.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedApplicant.cover_message && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Cover Message</label>
                  <p className="text-gray-900 mt-2 text-lg leading-relaxed">
                    {selectedApplicant.cover_message}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="px-6 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
                {selectedApplicant.status === 'new' && (
                  <>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedApplicant.id, 'favorited');
                        setSelectedApplicant(null);
                      }}
                      className="px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </Button>
                    <Button
                      onClick={() => {
                        handleHireAndCreateContract(selectedApplicant);
                        setSelectedApplicant(null);
                      }}
                      disabled={creatingContract}
                      className="px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      {creatingContract ? 'Hiring...' : 'Hire Now'}
                    </Button>
                  </>
                )}
                {selectedApplicant.status === 'favorited' && (
                  <Button
                    onClick={() => {
                      handleHireAndCreateContract(selectedApplicant);
                      setSelectedApplicant(null);
                    }}
                    disabled={creatingContract}
                    className="px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {creatingContract ? 'Creating Contract...' : 'Hire & Create Contract'}
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