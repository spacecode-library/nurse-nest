// components/dashboard/client/JobPostingForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Copy, Calendar, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createJobPosting } from '@/supabase/api/jobPostingService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';

interface JobPostingFormProps {
  clientId: string;
  onJobCreated: () => void;
  onCancel: () => void;
}

interface PreviousJob {
  id: string;
  job_code: string;
  care_type: string;
  duration: string;
  preferred_time: string;
  benefits?: string;
  created_at: string;
}

export default function JobPostingForm({ 
  clientId, 
  onJobCreated, 
  onCancel 
}: JobPostingFormProps) {
  const [loading, setLoading] = useState(false);
  const [previousJobs, setPreviousJobs] = useState<PreviousJob[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Form fields
  const [careType, setCareType] = useState('');
  const [duration, setDuration] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [benefits, setBenefits] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');

  useEffect(() => {
    loadPreviousJobs();
  }, [clientId]);

  const loadPreviousJobs = async () => {
    try {
      const { data: jobs, error } = await getClientJobPostings(clientId, 10, 0);
      if (error) throw error;
      setPreviousJobs(jobs || []);
    } catch (error: any) {
      console.error('Error loading previous jobs:', error);
    }
  };

  const handleTemplateSelect = (jobId: string) => {
    const template = previousJobs.find(job => job.id === jobId);
    if (template) {
      setCareType(template.care_type);
      setDuration(template.duration);
      setPreferredTime(template.preferred_time);
      setBenefits(template.benefits || '');
      setSelectedTemplate(jobId);
      
      toast({
        title: "Template Applied",
        description: "Job details have been pre-filled from your previous posting"
      });
    }
  };

  const clearTemplate = () => {
    setCareType('');
    setDuration('');
    setPreferredTime('');
    setBenefits('');
    setHourlyRate('');
    setStartDate('');
    setApplicationDeadline('');
    setSelectedTemplate('');
  };

  const validateForm = () => {
    const requiredFields = [
      { value: careType, name: 'Care Type' },
      { value: duration, name: 'Duration' },
      { value: preferredTime, name: 'Preferred Time' },
      { value: startDate, name: 'Start Date' },
      { value: applicationDeadline, name: 'Application Deadline' }
    ];

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.name} field`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const deadlineObj = new Date(applicationDeadline);
    const today = new Date();

    if (deadlineObj <= today) {
      toast({
        title: "Invalid Date",
        description: "Application deadline must be in the future",
        variant: "destructive"
      });
      return false;
    }

    if (startDateObj <= deadlineObj) {
      toast({
        title: "Invalid Date",
        description: "Start date must be after the application deadline",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const benefitsText = [
        benefits,
        hourlyRate ? `Hourly Rate: $${hourlyRate}` : '',
        `Start Date: ${new Date(startDate).toLocaleDateString()}`,
        `Application Deadline: ${new Date(applicationDeadline).toLocaleDateString()}`
      ].filter(Boolean).join(' | ');

      const jobData = {
        client_id: clientId,
        care_type: careType,
        duration: duration,
        preferred_time: preferredTime,
        benefits: benefitsText,
        status: 'open' as const
      };

      const { data, error } = await createJobPosting(jobData);
      
      if (error) throw error;

      toast({
        title: "Job Posted Successfully",
        description: `Your job posting ${data.job_code} is now live and accepting applications!`
      });

      onJobCreated();
    } catch (error: any) {
      console.error('Error creating job posting:', error);
      toast({
        title: "Failed to Create Job",
        description: error.message || "Failed to create job posting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Smart Form Feature - Template Selection */}
      {previousJobs.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Copy className="h-5 w-5 mr-2" />
              Smart Form - Use Previous Job Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-blue-700">
                Speed up job creation by using details from your previous postings:
              </p>
              <div className="grid gap-2">
                {previousJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedTemplate === job.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleTemplateSelect(job.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{job.job_code}</p>
                        <p className="text-sm text-gray-600">
                          {job.care_type} • {job.duration} • {job.preferred_time}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(job.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearTemplate}
                  className="text-blue-600"
                >
                  Clear Template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Job Information */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="careType">Care Type *</Label>
            <Select value={careType} onValueChange={setCareType}>
              <SelectTrigger>
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Adult Care">Adult Care</SelectItem>
                <SelectItem value="Pediatric Care">Pediatric Care</SelectItem>
                <SelectItem value="Elderly Care">Elderly Care</SelectItem>
                <SelectItem value="Postpartum Care">Postpartum Care</SelectItem>
                <SelectItem value="Special Needs Care">Special Needs Care</SelectItem>
                <SelectItem value="Overnight Care">Overnight Care</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short-term (1-4 weeks)">Short-term (1-4 weeks)</SelectItem>
                  <SelectItem value="Medium-term (1-3 months)">Medium-term (1-3 months)</SelectItem>
                  <SelectItem value="Long-term (3+ months)">Long-term (3+ months)</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredTime">Preferred Schedule *</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daytime (8 AM - 6 PM)">Daytime (8 AM - 6 PM)</SelectItem>
                  <SelectItem value="Evening (6 PM - 12 AM)">Evening (6 PM - 12 AM)</SelectItem>
                  <SelectItem value="Overnight (12 AM - 8 AM)">Overnight (12 AM - 8 AM)</SelectItem>
                  <SelectItem value="24/7 Care">24/7 Care</SelectItem>
                  <SelectItem value="Weekdays Only">Weekdays Only</SelectItem>
                  <SelectItem value="Weekends Only">Weekends Only</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="hourlyRate"
                type="number"
                placeholder="50.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="benefits">Additional Benefits & Requirements</Label>
            <Textarea
              id="benefits"
              placeholder="e.g., Malpractice insurance required, CPR certification preferred, travel reimbursement provided..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicationDeadline">Application Deadline *</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                When to stop accepting applications
              </p>
            </div>

            <div>
              <Label htmlFor="startDate">Preferred Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                When you need care to begin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {careType && duration && preferredTime && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Job Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p><strong>Care Type:</strong> {careType}</p>
              <p><strong>Duration:</strong> {duration}</p>
              <p><strong>Schedule:</strong> {preferredTime}</p>
              {hourlyRate && <p><strong>Hourly Rate:</strong> ${hourlyRate}</p>}
              {benefits && <p><strong>Benefits:</strong> {benefits}</p>}
              {startDate && <p><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>}
              {applicationDeadline && <p><strong>Deadline:</strong> {new Date(applicationDeadline).toLocaleDateString()}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !careType || !duration || !preferredTime}
        >
          {loading ? 'Creating Job...' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
}