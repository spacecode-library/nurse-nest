// components/dashboard/client/JobPostingForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Copy, Calendar, DollarSign, Clock, CheckCircle, Info, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createJobPosting } from '@/supabase/api/jobPostingService';
import { getClientJobPostings } from '@/supabase/api/jobPostingService';

interface JobPostingFormProps {
  clientId: string;
  templateJob?: any; // Job to use as template for duplication
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

const CARE_TYPES = [
  'Adult Care',
  'Pediatric Care',
  'Newborn Night Nurse',
  'Post-Partum Care',
  'Elderly Care', 
  'Dementia/Alzheimer\'s Care',
  'Medication Management',
  'Diabetes Management',
  'Respiratory Care (Oxygen/Tracheostomy Management)',
  'IV Therapy',
  'Feeding Tube Management',
  'Wound Care',
  'Post-Surgical Care',
  'Stroke Recovery Care',
  'Catheter Care',
  'Ostomy Care',
  'Hospice/Palliative Care',
  'ADL Care (Activities of Daily Living)',
  'Rehabilitation',
  'Special Needs Care'
];

export default function JobPostingForm({ 
  clientId, 
  templateJob,
  onJobCreated, 
  onCancel 
}: JobPostingFormProps) {
  const [loading, setLoading] = useState(false);
  const [previousJobs, setPreviousJobs] = useState<PreviousJob[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Form fields
  const [careType, setCareType] = useState('');
  const [duration, setDuration] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [benefits, setBenefits] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [urgentHiring, setUrgentHiring] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPreviousJobs();
    
    // Pre-fill form if templateJob is provided
    if (templateJob) {
      setCareType(templateJob.care_type || '');
      setDuration(templateJob.duration || '');
      setPreferredTime(templateJob.preferred_time || '');
      setBenefits(templateJob.benefits || '');
      setSelectedTemplate(templateJob.id);
      
      // Set default dates for duplicated job
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setApplicationDeadline(tomorrow.toISOString().split('T')[0]);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setStartDate(nextWeek.toISOString().split('T')[0]);
      
      toast({
        title: "Template Applied",
        description: "Job details have been pre-filled from your previous posting"
      });
    } else {
      // Set default dates for new job
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setApplicationDeadline(nextWeek.toISOString().split('T')[0]);
      
      const twoWeeks = new Date();
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      setStartDate(twoWeeks.toISOString().split('T')[0]);
    }
  }, [clientId, templateJob]);

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
    setSpecialRequirements('');
    setUrgentHiring(false);
    setSelectedTemplate('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!careType.trim()) newErrors.careType = 'Care type is required';
    if (!duration.trim()) newErrors.duration = 'Duration is required';
    if (!preferredTime.trim()) newErrors.preferredTime = 'Preferred schedule is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';

    // Date validation
    const startDateObj = new Date(startDate);
    const deadlineObj = new Date(applicationDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineObj <= today) {
      newErrors.applicationDeadline = 'Application deadline must be in the future';
    }

    if (startDateObj <= deadlineObj) {
      newErrors.startDate = 'Start date must be after the application deadline';
    }

    // Hourly rate validation
    if (hourlyRate && (isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0)) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Build benefits text
      const benefitsText = [
        benefits,
        hourlyRate ? `Hourly Rate: $${hourlyRate}` : '',
        specialRequirements ? `Special Requirements: ${specialRequirements}` : '',
        `Start Date: ${new Date(startDate).toLocaleDateString()}`,
        `Application Deadline: ${new Date(applicationDeadline).toLocaleDateString()}`,
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
        title: "Job Posted Successfully!",
        description: `Your job posting ${data.job_code} is now live and accepting applications!`,
        duration: 5000
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

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const isFormValid = careType && duration && preferredTime && startDate && applicationDeadline;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Smart Form Feature - Template Selection */}
      {!templateJob && previousJobs.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Copy className="h-5 w-5 mr-2" />
              Quick Start - Use Previous Job Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-blue-700">
                Save time by using details from your previous successful postings:
              </p>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {previousJobs.slice(0, 5).map((job) => (
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
                  Clear Template & Start Fresh
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template indicator for duplicated jobs */}
      {templateJob && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Copy className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Duplicating job: {templateJob.job_code} - {templateJob.care_type}
              </span>
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
              <SelectTrigger className={errors.careType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                {CARE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.careType && (
              <p className="text-sm text-red-600 mt-1">{errors.careType}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Short-term (1-4 weeks)">Short-term (1-4 weeks)</SelectItem>
                  <SelectItem value="Medium-term (1-3 months)">Medium-term (1-3 months)</SelectItem>
                  <SelectItem value="Long-term (3+ months)">Long-term (3+ months)</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-600 mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredTime">Preferred Schedule *</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger className={errors.preferredTime ? 'border-red-500' : ''}>
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
                  <SelectItem value="Split Shift">Split Shift</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredTime && (
                <p className="text-sm text-red-600 mt-1">{errors.preferredTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`pl-10 ${errors.hourlyRate ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.hourlyRate && (
                <p className="text-sm text-red-600 mt-1">{errors.hourlyRate}</p>
              )}
            </div>

          </div>

          <div>
            <Label htmlFor="benefits">Benefits & General Requirements</Label>
            <Textarea
              id="benefits"
              placeholder="e.g., flexible scheduling, travel reimbursement..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="specialRequirements">Special Skills & Certifications Required</Label>
            <Textarea
              id="specialRequirements"
              placeholder="e.g., CPR certification required, IV therapy experience preferred.."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Timeline & Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicationDeadline">Application Deadline *</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.applicationDeadline ? 'border-red-500' : ''}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                When to stop accepting applications
              </p>
              {errors.applicationDeadline && (
                <p className="text-sm text-red-600 mt-1">{errors.applicationDeadline}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startDate">Preferred Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.startDate ? 'border-red-500' : ''}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                When you need care to begin
              </p>
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>
          </div>

          {urgentHiring && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Urgent Hiring Enabled</p>
                  <p className="text-sm text-amber-700">
                    Your job will be marked as urgent and get priority placement. You'll receive applications faster and can expedite the hiring process.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Toggle */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={togglePreview}
          disabled={!isFormValid}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? 'Hide Preview' : 'Preview Job Posting'}
        </Button>
      </div>

      {/* Preview */}
      {showPreview && isFormValid && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Job Posting Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{careType}</h3>
                  <p className="text-gray-600">Posted by [Your Name]</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white">Open</Badge>
                  {urgentHiring && (
                    <Badge variant="destructive" className="ml-2">Urgent</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><strong>Duration:</strong> {duration}</div>
                <div><strong>Schedule:</strong> {preferredTime}</div>
                {hourlyRate && <div><strong>Hourly Rate:</strong> ${hourlyRate}</div>}
                <div><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</div>
              </div>

              {benefits && (
                <div className="mb-4">
                  <strong className="text-sm">Benefits & Requirements:</strong>
                  <p className="text-sm text-gray-700 mt-1">{benefits}</p>
                </div>
              )}

              {specialRequirements && (
                <div className="mb-4">
                  <strong className="text-sm">Special Requirements:</strong>
                  <p className="text-sm text-gray-700 mt-1">{specialRequirements}</p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Application Deadline: {new Date(applicationDeadline).toLocaleDateString()}</span>
                <span>Job Code: Will be auto-generated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Your job posting will be visible to verified nurses immediately</li>
                <li>• You'll receive email notifications when nurses apply</li>
                <li>• Platform fee: 15% of total payment (included in quotes to nurses)</li>
                <li>• You can edit or close the job posting anytime after creation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          disabled={loading || !isFormValid}
          className="min-w-[140px]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {urgentHiring ? 'Post Urgent Job' : 'Post Job'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}