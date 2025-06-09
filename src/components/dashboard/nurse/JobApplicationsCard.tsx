// components/dashboard/nurse/JobApplicationsCard.tsx - UPDATED WITH JOB CODE FORMAT
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
  Timer,
  MessageCircle,
  Bell,
  X,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client.js';

// Import API services
import { getOpenJobPostings, advancedJobSearch } from '@/supabase/api/jobPostingService';
import { getApplicationsByNurse, submitApplication } from '@/supabase/api/applicationService';

// Import Chat Component
import ChatWindow from '@/components/ChatWindow';
import { useAuth } from '@/contexts/AuthContext';

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
    name?: string;
    profile_photo_url?: string;
  };
}

interface Application {
  id: string;
  status: string;
  cover_message?: string;
  created_at: string;
  job_postings: JobPosting & {
    client_profiles: JobPosting['client_profiles'] & {
      name: string;
    };
  };
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
  const {user} = useAuth();
  // Chat related states
  const [activeChat, setActiveChat] = useState<{
    client: any;
    job: any;
    conversationId?: string;
  } | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});
  const [conversations, setConversations] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadJobs();
    loadMyApplications();
    if (showMyApplications) {
      subscribeToMessages();
    }
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
      
      // Process applications to ensure client name is set
      const processedApplications = (applications || []).map(app => ({
        ...app,
        job_postings: {
          ...app.job_postings,
          client_profiles: {
            ...app.job_postings.client_profiles,
            name: app.job_postings.client_profiles.name || 
                  `${app.job_postings.client_profiles.first_name} ${app.job_postings.client_profiles.last_name}`
          }
        }
      }));
      
      setMyApplications(processedApplications);
      
      // Load conversations and unread counts for applications
      if (showMyApplications) {
        await loadConversationsForApplications(processedApplications);
      }
    } catch (error: any) {
      console.error('Error loading applications:', error);
    }
  };

  const loadConversationsForApplications = async (apps: Application[]) => {
    try {
      const conversationPromises = apps.map(async (app) => {
        // Check if conversation exists for this application
        const { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('nurse_id', nurseId)
          .eq('client_id', app.job_postings.client_profiles.id)
          .eq('job_id', app.job_postings.id)
          .single();

        if (conversation) {
          // Get unread message count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conversation.id)
            .eq('recipient_id', nurseId)
            .eq('is_read', false);

          return {
            applicationId: app.id,
            conversation,
            unreadCount: unreadCount || 0
          };
        }
        return null;
      });

      const results = await Promise.all(conversationPromises);
      
      const newConversations: {[key: string]: any} = {};
      const newUnreadCounts: {[key: string]: number} = {};
      
      results.forEach((result) => {
        if (result) {
          newConversations[result.applicationId] = result.conversation;
          newUnreadCounts[result.applicationId] = result.unreadCount;
        }
      });
      
      setConversations(newConversations);
      setUnreadCounts(newUnreadCounts);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const subscribeToMessages = () => {
    // Subscribe to new messages for this nurse
    const subscription = supabase
      .channel(`nurse_messages:${nurseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${nurseId}`,
        },
        (payload) => {
          // Update unread count
          const conversationId = payload.new.conversation_id;
          
          // Find which application this conversation belongs to
          const applicationId = Object.keys(conversations).find(
            appId => conversations[appId]?.id === conversationId
          );
          
          if (applicationId) {
            setUnreadCounts(prev => ({
              ...prev,
              [applicationId]: (prev[applicationId] || 0) + 1
            }));
            
            // Show notification
            toast({
              title: "New Message",
              description: "You have a new message about your job application",
              action: (
                <Button size="sm" onClick={() => {
                  const app = myApplications.find(a => a.id === applicationId);
                  if (app) startChat(app);
                }}>
                  View
                </Button>
              ),
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const startChat = async (application: Application) => {
    try {
      let conversationId = conversations[application.id]?.id;
      
      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({
            client_id: application.job_postings.client_profiles.id,
            nurse_id: nurseId,
            job_id: application.job_postings.id
          })
          .select()
          .single();

        if (error) throw error;
        conversationId = newConv.id;
        
        // Update conversations state
        setConversations(prev => ({
          ...prev,
          [application.id]: newConv
        }));
      }

      setActiveChat({
        client: application.job_postings.client_profiles,
        job: application.job_postings,
        conversationId
      });

      // Mark messages as read
      if (unreadCounts[application.id] > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .eq('recipient_id', nurseId)
          .eq('is_read', false);
        
        setUnreadCounts(prev => ({
          ...prev,
          [application.id]: 0
        }));
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: "Chat Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
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
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{job.care_type}</h3>
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
            <><div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Benefits: {job.benefits}
            </div><p className="text-blue-600 font-medium text-base">Job Code: {job.job_code}</p></>

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
                  <DialogTitle>Apply for Job Code: {job.job_code}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Job Details:</h4>
                    <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                      <p><strong>Job Code:</strong> {job.job_code}</p>
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

  const ApplicationCard = ({ application }: { application: Application }) => {
    const hasUnreadMessages = unreadCounts[application.id] > 0;
    const hasConversation = conversations[application.id];

    return (
      <Card className={`hover:shadow-md transition-shadow ${hasUnreadMessages ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {application.job_postings.client_profiles.profile_photo_url ? (
                <img 
                  src={application.job_postings.client_profiles.profile_photo_url} 
                  alt="Client" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {application.job_postings.client_profiles.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {application.job_postings.care_type}
                  </h3>
                  <p className="text-blue-600 font-medium">Job Code: {application.job_postings.job_code}</p>
                  <p className="text-sm text-gray-500">
                    Client: {application.job_postings.client_profiles.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {hasUnreadMessages && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Bell className="h-3 w-3 mr-1" />
                      {unreadCounts[application.id]}
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(application.status)} flex items-center`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1 capitalize">{application.status}</span>
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Applied: {new Date(application.created_at).toLocaleDateString()}
                </div>
                {application.cover_message && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Cover Message:</p>
                    <p className="italic bg-gray-50 p-2 rounded-md">"{application.cover_message}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startChat(application)}
                  className={`${hasUnreadMessages ? 'text-blue-600 border-blue-600 bg-blue-50 animate-pulse' : 'text-gray-600'}`}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {hasConversation ? 'Continue Chat' : 'Start Chat'}
                  {hasUnreadMessages && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">
                      {unreadCounts[application.id]}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Job Details
                </Button>

                {application.status === 'hired' && (
                  <Button
                    size="sm"
                    className="bg-green-600 hidden hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {/* View Contrac */}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showMyApplications) {
    const totalUnreadMessages = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

    return (
      <div className="space-y-6">
        {/* Unread Messages Alert */}
        {totalUnreadMessages > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
                <span className="font-medium text-blue-900">
                  You have {totalUnreadMessages} unread message{totalUnreadMessages !== 1 ? 's' : ''} from clients
                </span>
                <ArrowRight className="h-4 w-4 ml-2 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Chat Modal */}
        {activeChat && (
          <Dialog open={!!activeChat} onOpenChange={() => setActiveChat(null)}>
            <DialogContent className="max-w-4xl h-[80vh] p-0">
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <DialogTitle>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat with {activeChat.client.name}
                    </div>
                    <p className="text-sm text-gray-600 font-normal">
                      Regarding: Job Code: {activeChat.job.job_code} - {activeChat.job.care_type}
                    </p>
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveChat(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <ChatWindow 
                  conversation={{
                    id: activeChat.conversationId,
                    client_id: activeChat.client.id,
                    nurse_id: nurseId,
                    job_id: activeChat.job.id,
                    otherParticipant: activeChat.client,
                    job_postings: activeChat.job
                  }}
                  currentUserId={user.id}
                  userType="nurse"
                />
              </div>
            </DialogContent>
          </Dialog>
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