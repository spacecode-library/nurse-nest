// src/components/BackgroundCheckButton.tsx
// Fixed implementation with proper error handling and ID resolution
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  XCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getClientNurseBackgroundCheck,
  getBackgroundCheckResultSummary,
  initiateClientBackgroundCheck,
  type BackgroundCheckResult
} from '@/supabase/api/checkrService';

interface BackgroundCheckButtonProps {
  nurseId: string;
  clientId: string;  // Can be either user_id or profile_id - service will resolve
  jobPostingId?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  showFullText?: boolean;
  className?: string;
}

export const BackgroundCheckButton: React.FC<BackgroundCheckButtonProps> = ({
  nurseId,
  clientId,
  jobPostingId,
  size = 'sm',
  variant = 'outline',
  showFullText = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingBackgroundCheck();
  }, [nurseId, clientId]);

  const checkExistingBackgroundCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 BackgroundCheckButton - Checking existing background check:', { nurseId, clientId });
      
      const { data, error } = await getClientNurseBackgroundCheck(nurseId, clientId);
      
      if (error) {
        console.error('Error checking background check status:', error);
        setError('Failed to load background check status');
        return;
      }
      
      setBackgroundCheck(data);
      console.log('🔍 BackgroundCheckButton - Background check found:', data);
      
    } catch (error: any) {
      console.error('Error checking background check status:', error);
      setError(error.message || 'Failed to load background check status');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateBackgroundCheck = async () => {
    try {
      setInitiating(true);
      setError(null);
      
      console.log('🔍 BackgroundCheckButton - Initiating background check:', { nurseId, clientId, jobPostingId });
      
      // Create pending background check record
      const { data, error } = await initiateClientBackgroundCheck(
        nurseId,
        clientId,
        jobPostingId
      );

      if (error) {
        console.error('Error initiating background check:', error);
        throw new Error(error.message);
      }

      setBackgroundCheck(data);
      
      toast({
        title: "Background Check Initiated",
        description: "The nurse will be notified to provide required information.",
      });

      // Navigate to the dedicated background check page
      navigateToBackgroundCheckPage();

    } catch (error: any) {
      console.error('Error initiating background check:', error);
      setError(error.message);
      toast({
        title: "Background Check Failed",
        description: error.message || "Failed to initiate background check. Please try again.",
        variant: "destructive"
      });
    } finally {
      setInitiating(false);
    }
  };

  const navigateToBackgroundCheckPage = () => {
    const url = `/background-check/${nurseId}/${clientId}${jobPostingId ? `/${jobPostingId}` : ''}`;
    navigate(url);
  };

  const handleButtonClick = () => {
    if (error) {
      // Retry loading
      checkExistingBackgroundCheck();
      return;
    }

    if (backgroundCheck) {
      // Navigate to existing background check
      navigateToBackgroundCheckPage();
    } else {
      // Initiate new background check
      handleInitiateBackgroundCheck();
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (initiating) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (!backgroundCheck) return <Shield className="h-4 w-4" />;
    
    switch (backgroundCheck.status) {
      case 'completed':
        const summary = getBackgroundCheckResultSummary(backgroundCheck);
        return summary.clientStatus === 'passed' ? 
          <CheckCircle className="h-4 w-4 text-green-600" /> : 
          <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    if (loading || initiating) return 'default';
    if (error) return 'destructive';
    if (!backgroundCheck) return 'default';
    
    switch (backgroundCheck.status) {
      case 'completed':
        const summary = getBackgroundCheckResultSummary(backgroundCheck);
        return summary.clientStatus === 'passed' ? 'default' : 'destructive';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (error) return 'Retry';
    if (initiating) return 'Initiating...';
    
    if (!backgroundCheck) {
      return showFullText ? 'Request Background Check' : 'Background Check';
    }
    
    switch (backgroundCheck.status) {
      case 'completed':
        if (showFullText) {
          const summary = getBackgroundCheckResultSummary(backgroundCheck);
          return summary.clientStatus === 'passed' ? 'Background Check: Passed' : 'Background Check: Review Required';
        }
        return 'Background Check';
      case 'processing':
        return showFullText ? 'Background Check: Processing' : 'Processing';
      case 'pending':
        return showFullText ? 'Background Check: Pending' : 'Pending';
      case 'failed':
        return showFullText ? 'Background Check: Failed' : 'Failed';
      default:
        return showFullText ? 'Background Check' : 'Check';
    }
  };

  const getStatusBadge = () => {
    if (!backgroundCheck || !showFullText) return null;
    
    switch (backgroundCheck.status) {
      case 'completed':
        const summary = getBackgroundCheckResultSummary(backgroundCheck);
        return (
          <Badge 
            variant={summary.clientStatus === 'passed' ? 'default' : 'destructive'} 
            className="ml-2 text-xs"
          >
            {summary.clientStatus === 'passed' ? 'Passed' : 'Review Required'}
          </Badge>
        );
      case 'processing':
        return <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-800">Processing</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="ml-2 text-xs">Failed</Badge>;
      default:
        return null;
    }
  };

  const getButtonVariant = () => {
    if (error) return 'destructive';
    return variant;
  };

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleButtonClick}
      disabled={loading || initiating}
      className={`relative ${className}`}
    >
      {getStatusIcon()}
      <span className="ml-1">
        {getButtonText()}
      </span>
      {getStatusBadge()}
      {backgroundCheck && !error && (
        <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
      )}
    </Button>
  );
};