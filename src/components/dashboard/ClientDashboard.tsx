
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Activity,
  FileText,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();

  // Fetch job postings
  const { data: jobPostings, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobPostings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch applications for user's jobs
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          nurse_profiles (
            first_name,
            last_name
          ),
          job_postings (
            care_type
          )
        `)
        .in('job_id', jobPostings?.map(job => job.id) || []);
      
      if (error) throw error;
      return data;
    },
    enabled: !!jobPostings?.length
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600">Manage your nursing care requests and applications</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create New Job Posting
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobPostings?.filter(job => job.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobPostings?.filter(job => job.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications?.filter(app => app.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
          <CardDescription>Manage and track your nursing job requests</CardDescription>
        </CardHeader>
        <CardContent>
          {jobPostings && jobPostings.length > 0 ? (
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{job.care_type}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{job.preferred_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Job #{job.job_code}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Applications ({applications?.filter(app => app.job_id === job.id).length || 0})
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">Create your first job posting to find qualified nurses</p>
              <Button>Create Job Posting</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Review and manage nurse applications</CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <h4 className="font-medium">
                          {application.nurse_profiles?.first_name} {application.nurse_profiles?.last_name}
                        </h4>
                        <Badge className={getApplicationStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Applied for: {application.job_postings?.care_type || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.cover_message}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Applications will appear here once nurses apply to your jobs</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
