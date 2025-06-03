// components/dashboard/nurse/JobApplicationForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Send,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { submitApplication, hasApplied } from '@/supabase/api/applicationService';

interface JobApplicationFormProps {
  job: any;
  nurseId: string;
  onBack: () => void;
  onApplicationSubmitted: () => void;
}

export default function JobApplicationForm({
  job,
  nurseId,
  onBack,
  onApplicationSubmitted
}: JobApplicationFormProps) {
  const [coverMessage, setCoverMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);

  useEffect(() => {
    checkApplicationStatus();
  }, [job.id, nurseId]);

  const checkApplicationStatus = async () => {
    try {
      setCheckingApplication(true);
      const { hasApplied: applied, applicationStatus: status, error } = await hasApplied(nurseId, job.id);
      
      if (error) {
        console.error('Error checking application status:', error);
        return;
      }
      
      setHasAlreadyApplied(applied);
      setApplicationStatus(status);
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (hasAlreadyApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this position",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await submitApplication({
        nurse_id: nurseId,
        job_id: job.id,
        cover_message: coverMessage.trim() || null
      });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully!",
        description: `Your application for ${job.job_code} has been sent to the client.`,
        duration: 5000
      });

      onApplicationSubmitted();
      setTimeout(() => {
        onBack();
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
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

  const getApplicationStatusColor = (status: string) => {
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

  const isJobOpen = job.status === 'open';
  const canApply = isJobOpen && !hasAlreadyApplied;

  if (checkingApplication) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <div className="text-sm text-gray-500">
          Job Application
        </div>
      </div>

      {/* Job Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-gray-900">{job.care_type}</CardTitle>
              <p className="text-gray-600 mt-1">Job Code: <span className="font-mono">{job.job_code}</span></p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusBadgeColor(job.status)}>
                {job.status}
              </Badge>
              {hasAlreadyApplied && applicationStatus && (
                <Badge className={getApplicationStatusColor(applicationStatus)}>
                  Applied - {applicationStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Job Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium">
                    {job.client_profiles?.first_name} {job.client_profiles?.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{job.duration}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Schedule</p>
                  <p className="font-medium">{job.preferred_time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-medium">
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-4">
              {job.benefits && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Benefits & Requirements
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{job.benefits}</p>
                  </div>
                </div>
              )}

              {/* Application Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Application Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Highlight relevant experience in your cover message</li>
                  <li>• Mention any specialized skills that match the requirements</li>
                  <li>• Keep your message professional and concise</li>
                  <li>• Express genuine interest in the position</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status Check */}
      {hasAlreadyApplied && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-amber-900">Application Already Submitted</h3>
                <p className="text-amber-700">
                  You applied to this position on {new Date(job.created_at).toLocaleDateString()}. 
                  Current status: <span className="font-medium capitalize">{applicationStatus}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Not Available */}
      {!isJobOpen && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-medium text-red-900">Position No Longer Available</h3>
                <p className="text-red-700">
                  This job posting is {job.status === 'filled' ? 'filled' : 'closed'} and no longer accepting applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Form */}
      {canApply && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Submit Your Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Message */}
            <div>
              <Label htmlFor="coverMessage" className="text-base font-medium">
                Cover Message <span className="text-gray-500">(Optional but recommended)</span>
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Tell the client why you're the perfect fit for this position. Highlight your relevant experience and skills.
              </p>
              <Textarea
                id="coverMessage"
                placeholder="Dear Client,

I am excited to apply for your [care type] position. With [X years] of experience in [relevant area], I am confident I can provide exceptional care...

Key qualifications:
• [Relevant certification or skill]
• [Specific experience]
• [Personal qualities]

I am available for the proposed schedule and look forward to discussing how I can support your care needs.

Best regards,
[Your name]"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                rows={12}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                {coverMessage.length}/1000 characters
              </p>
            </div>

            <Separator />

            {/* Application Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Application Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Position:</span>
                  <span className="ml-2 font-medium">{job.care_type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Job Code:</span>
                  <span className="ml-2 font-medium font-mono">{job.job_code}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cover Message:</span>
                  <span className="ml-2">{coverMessage ? 'Included' : 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Application Date:</span>
                  <span className="ml-2">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Before you apply:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Make sure your profile is complete and up-to-date</li>
                    <li>• Ensure your licenses and certifications are current</li>
                    <li>• You'll be notified when the client reviews your application</li>
                    <li>• Response time is typically within 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="min-w-[160px]"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back to Jobs Button for non-applicable jobs */}
      {!canApply && (
        <div className="flex justify-center">
          <Button onClick={onBack} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Available Jobs
          </Button>
        </div>
      )}
    </div>
  );
}