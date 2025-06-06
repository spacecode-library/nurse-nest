// components/dashboard/nurse/QuickApplyWidget.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getJobPostingByCode } from '@/supabase/api/jobPostingService';
import { submitApplication } from '@/supabase/api/applicationService';

interface QuickApplyWidgetProps {
  nurseId: string;
  onApplicationSubmitted?: () => void;
}

export default function QuickApplyWidget({ nurseId, onApplicationSubmitted }: QuickApplyWidgetProps) {
  const [jobCode, setJobCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!jobCode.trim()) {
      setSearchError('Please enter a job code');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setJobDetails(null);

    try {
      const { data: job, error } = await getJobPostingByCode(jobCode.trim().toUpperCase());
      
      if (error || !job) {
        setSearchError('Job not found. Please check the job code and try again.');
        return;
      }

      if (job.status !== 'open') {
        setSearchError('This job is no longer accepting applications.');
        return;
      }

      setJobDetails(job);
    } catch (error) {
      console.error('Error searching for job:', error);
      setSearchError('Failed to search for job. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = async () => {
    if (!jobDetails || !nurseId) return;

    setIsApplying(true);

    try {
      const { data, error } = await submitApplication({
        nurse_id: nurseId,
        job_id: jobDetails.id,
        cover_message: `Quick application submitted for job code: ${jobCode}`
      });

      if (error) {
        if (error.message?.includes('already applied')) {
          toast({
            title: "Already Applied",
            description: "You have already applied for this position.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "🎉 Application Submitted!",
        description: `Your application for ${jobDetails.care_type} has been sent successfully.`,
        variant: "default"
      });

      // Reset the widget
      setJobCode('');
      setJobDetails(null);
      setSearchError(null);

      // Notify parent component
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!jobDetails) {
        handleSearch();
      } else {
        handleApply();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'filled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Quick Apply with Job Code
        </CardTitle>
        <p className="text-blue-700 text-sm">
          Have a job code from a listing? Enter it below to apply instantly!
        </p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Search Input */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Enter job code (e.g., 77-KY6M9)"
              value={jobCode}
              onChange={(e) => {
                setJobCode(e.target.value.toUpperCase());
                setSearchError(null);
                setJobDetails(null);
              }}
              onKeyPress={handleKeyPress}
              className="border-blue-300 focus:border-blue-500 focus:ring-blue-500/20 text-center font-mono text-lg tracking-wider"
              disabled={isSearching || isApplying}
            />
          </div>
          
          {!jobDetails ? (
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !jobCode.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleApply}
              disabled={isApplying}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          )}
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{searchError}</span>
          </div>
        )}

        {/* Job Details */}
        {jobDetails && (
          <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{jobDetails.care_type}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  {jobDetails.client_profiles?.first_name} {jobDetails.client_profiles?.last_name}
                </p>
              </div>
              <Badge className={`${getStatusColor(jobDetails.status)} border shadow-sm`}>
                {jobDetails.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-3 w-3 mr-2" />
                <span>{jobDetails.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-3 w-3 mr-2" />
                <span>{jobDetails.preferred_time}</span>
              </div>
            </div>

            {jobDetails.benefits && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Benefits:</strong> {jobDetails.benefits}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Job Code: <span className="font-mono font-semibold">{jobDetails.job_code}</span>
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {!jobDetails && !searchError && jobCode && !isSearching && (
          <div className="text-center py-2">
            <p className="text-blue-600 text-sm">Press Enter or click Search to find this job</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}