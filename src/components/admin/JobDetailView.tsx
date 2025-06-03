// src/components/admin/JobDetailView.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Building2,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Users,
  Heart,
  Home,
  Copy,
  Download,
  Stethoscope,
  Award,
  Mail,
  User,
  FileText,
  Star,
  CheckCircle,
  AlertCircle,
  Timer,
  Target,
  Activity
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AdminJobPosting,
  generateJobCopyText,
  generateJobExportData
} from '@/supabase/api/enhancedJobAdminService';

interface JobDetailViewProps {
  job: AdminJobPosting;
  onRefresh: () => void;
}

export default function JobDetailView({ job, onRefresh }: JobDetailViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'filled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCopyJob = async () => {
    try {
      const copyText = generateJobCopyText(job);
      await navigator.clipboard.writeText(copyText);
      toast({
        title: "Copied!",
        description: "Job details copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownloadJob = async () => {
    try {
      const content = generateJobCopyText(job);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-${job.job_code}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Job details downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download job details",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{job.job_code}</h2>
                <p className="text-lg text-slate-600">{job.care_type}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  {job.updated_at && (
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>Updated {new Date(job.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(job.status)}>
                {job.status.toUpperCase()}
              </Badge>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyJob}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadJob}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Basic Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Care Type:</span>
                    <span className="font-medium">{job.care_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{job.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Preferred Time:</span>
                    <span className="font-medium">{job.preferred_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <Badge className={getStatusColor(job.status)} variant="outline">
                      {job.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Posted:</span>
                    <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  {job.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <span className="font-medium">{new Date(job.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Applications:</span>
                    <span className="font-medium">{job.applications.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {job.benefits && (
              <div>
                <h4 className="font-medium mb-3">Benefits Offered</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{job.benefits}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{job.client_profiles.first_name} {job.client_profiles.last_name}</p>
                <p className="text-sm text-slate-600">{job.client_profiles.phone_number}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Client Type:</span>
                <Badge variant="outline">{job.client_profiles.client_type}</Badge>
              </div>
              {job.client_profiles.relationship_to_recipient && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Relationship:</span>
                  <span className="font-medium">{job.client_profiles.relationship_to_recipient}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Recipients */}
      {job.care_recipients && job.care_recipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Care Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {job.care_recipients.map((recipient) => (
                <div key={recipient.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    <p className="font-medium">{recipient.first_name} {recipient.last_name}</p>
                  </div>
                  <p className="text-sm text-slate-600">Age: {recipient.age} years</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Care Locations */}
      {job.care_locations && job.care_locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Care Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {job.care_locations.map((location) => (
                <div key={location.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{location.street_address}</p>
                      <p className="text-sm text-slate-600">{location.city}, {location.state} {location.zip_code}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {location.home_environment}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Care Requirements */}
      {job.care_needs && (
        <Card>
          <CardHeader>
            <CardTitle>Care Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Care Types</h4>
                <div className="flex flex-wrap gap-1">
                  {job.care_needs.care_types.map((type, index) => (
                    <Badge key={index} variant="outline">{type}</Badge>
                  ))}
                </div>
                
                <h4 className="font-medium mt-4 mb-3">Schedule</h4>
                <div className="flex flex-wrap gap-1">
                  {job.care_needs.care_schedule.map((schedule, index) => (
                    <Badge key={index} variant="outline">{schedule}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hours per week:</span>
                    <span className="font-medium">{job.care_needs.hours_per_week}</span>
                  </div>
                </div>
                
                <h4 className="font-medium mt-4 mb-3">Special Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {job.care_needs.special_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {job.care_needs.health_conditions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Health Conditions</h4>
                <div className="flex flex-wrap gap-1">
                  {job.care_needs.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700">{condition}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {job.care_needs.additional_notes && (
              <div>
                <h4 className="font-medium mb-3">Additional Notes</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{job.care_needs.additional_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({job.applications.length})</CardTitle>
          <CardDescription>Nurses who have applied for this position</CardDescription>
        </CardHeader>
        <CardContent>
          {job.applications.length > 0 ? (
            <div className="space-y-4">
              {job.applications.map((application) => (
                <div key={application.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{application.nurse_profiles.first_name} {application.nurse_profiles.last_name}</p>
                        <p className="text-sm text-slate-600">{application.nurse_profiles.city}, {application.nurse_profiles.state}</p>
                      </div>
                    </div>
                    <Badge className={getApplicationStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{application.nurse_profiles.phone_number}</span>
                    </div>
                    
                    {application.nurse_qualifications && (
                      <>
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{application.nurse_qualifications.years_experience} years experience</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{application.nurse_qualifications.education_level}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {application.nurse_qualifications?.specializations && application.nurse_qualifications.specializations.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-700 mb-1">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {application.nurse_qualifications.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Calendar className="h-3 w-3" />
                      <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {application.nurse_profiles.onboarding_completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-xs">
                        {application.nurse_profiles.onboarding_completed ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>

                  {application.cover_message && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium text-slate-700 mb-1">Cover Message:</p>
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{application.cover_message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications received yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Information (if filled) */}
      {job.contract && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
            <CardDescription>Details about the signed contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Contract ID:</span>
                  <span className="font-medium">{job.contract.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge variant="outline">{job.contract.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="font-medium">{new Date(job.contract.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Contract Terms</h4>
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{job.contract.terms}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}