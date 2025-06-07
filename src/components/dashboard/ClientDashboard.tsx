
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, DollarSign, User, MessageCircle, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import ClientConversationList from "@/components/ClientConversationList";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  hourly_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  nurse_id: string;
  job_id: string;
  status: string;
  hourly_rate: number;
  message: string;
  created_at: string;
  nurse_profiles: {
    first_name: string;
    last_name: string;
    specialties: string[];
    experience_years: number;
    hourly_rate: number;
  };
  jobs: {
    title: string;
  };
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConversations, setShowConversations] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchApplications();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          nurse_profiles (
            first_name,
            last_name,
            specialties,
            experience_years,
            hourly_rate
          ),
          jobs (
            title
          )
        `)
        .eq('jobs.client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-brand-green" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-brand-amber" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-brand-gray" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-brand-red" />;
      default:
        return <Clock className="h-4 w-4 text-brand-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'completed':
        return 'status-pending';
      case 'cancelled':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showConversations) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-secondary text-brand-navy">Messages & Conversations</h2>
          <Button 
            onClick={() => setShowConversations(false)}
            variant="outline"
            className="btn-secondary"
          >
            Back to Dashboard
          </Button>
        </div>
        <ClientConversationList 
          userId={user?.id || ''}
          onBack={() => setShowConversations(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-brand">
          <CardHeader className="card-header-brand">
            <CardTitle className="heading-secondary text-brand-navy flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-blue" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-light text-brand-navy mb-2">
              {activeJobs.filter(job => job.status === 'active').length}
            </div>
            <p className="text-body text-brand-gray">Currently posted</p>
          </CardContent>
        </Card>

        <Card className="card-brand">
          <CardHeader className="card-header-brand">
            <CardTitle className="heading-secondary text-brand-navy flex items-center gap-2">
              <User className="h-5 w-5 text-brand-blue" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-light text-brand-navy mb-2">
              {applications.length}
            </div>
            <p className="text-body text-brand-gray">Total received</p>
          </CardContent>
        </Card>

        <Card className="card-brand">
          <CardHeader className="card-header-brand">
            <CardTitle className="heading-secondary text-brand-navy flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-brand-blue" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-light text-brand-navy mb-2">3</div>
            <p className="text-body text-brand-gray">Unread messages</p>
            <Button 
              onClick={() => setShowConversations(true)}
              className="btn-primary mt-3 w-full"
            >
              View Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-brand">
        <CardHeader className="card-header-brand">
          <CardTitle className="heading-secondary text-brand-navy">Quick Actions</CardTitle>
          <CardDescription className="text-body text-brand-gray">
            Manage your nursing jobs and applications
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary">
              Post New Job
            </Button>
            <Button className="btn-secondary">
              Review Applications
            </Button>
            <Button className="btn-secondary">
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card className="card-brand">
        <CardHeader className="card-header-brand">
          <CardTitle className="heading-secondary text-brand-navy">Recent Job Postings</CardTitle>
          <CardDescription className="text-body text-brand-gray">
            Your latest nursing job opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {activeJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-body text-brand-gray mb-4">No jobs posted yet</p>
              <Button className="btn-primary">
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-brand-navy">{job.title}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className={`${getStatusColor(job.status)} text-sm`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-body text-brand-gray mb-3 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-small text-brand-gray">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${job.hourly_rate}/hour
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(job.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {activeJobs.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" className="btn-secondary">
                    View All Jobs
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="card-brand">
        <CardHeader className="card-header-brand">
          <CardTitle className="heading-secondary text-brand-navy">Recent Applications</CardTitle>
          <CardDescription className="text-body text-brand-gray">
            Nurses who have applied to your jobs
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-body text-brand-gray">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-brand-navy">
                        {application.nurse_profiles.first_name} {application.nurse_profiles.last_name}
                      </h4>
                      <p className="text-small text-brand-gray">
                        Applied for: {application.jobs.title}
                      </p>
                    </div>
                    <span className={`${getStatusColor(application.status)} text-sm`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-small text-brand-gray mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {application.nurse_profiles.experience_years} years exp.
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${application.hourly_rate}/hour
                    </div>
                  </div>
                  
                  {application.message && (
                    <p className="text-body text-brand-gray line-clamp-2 mb-3">
                      "{application.message}"
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="btn-primary">
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="btn-secondary">
                      Message
                    </Button>
                  </div>
                </div>
              ))}
              
              {applications.length > 5 && (
                <div className="text-center">
                  <Button variant="outline" className="btn-secondary">
                    View All Applications
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
