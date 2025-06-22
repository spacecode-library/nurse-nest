// src/components/ClientBackgroundCheckInitiator.tsx
// Client-initiated background check component with real-time updates
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  initiateClientBackgroundCheck,
  getClientNurseBackgroundCheck,
  getClientBackgroundCheckResult,
  updateBackgroundCheckStatus,
  type BackgroundCheckResult 
} from '@/supabase/api/checkrService';

interface ClientBackgroundCheckInitiatorProps {
  nurseId: string;
  clientId: string;
  nurseName: string;
  jobPostingId?: string;
  onBackgroundCheckComplete?: (result: 'passed' | 'failed') => void;
}

export const ClientBackgroundCheckInitiator: React.FC<ClientBackgroundCheckInitiatorProps> = ({
  nurseId,
  clientId,
  nurseName,
  jobPostingId,
  onBackgroundCheckComplete
}) => {
  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);

  useEffect(() => {
    fetchExistingBackgroundCheck();
  }, [nurseId, clientId]);

  const fetchExistingBackgroundCheck = async () => {
    try {
      setLoading(true);
      const { data, error } = await getClientNurseBackgroundCheck(nurseId, clientId);
      
      if (error) {
        console.error('Error fetching background check:', error);
        return;
      }

      setBackgroundCheck(data);

      // If there's an active background check, poll for updates
      if (data && ['pending', 'processing'].includes(data.status)) {
        pollForUpdates(data.id);
      }
    } catch (error) {
      console.error('Error fetching background check:', error);
    } finally {
      setLoading(false);
    }
  };

  const pollForUpdates = async (backgroundCheckId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await updateBackgroundCheckStatus(backgroundCheckId);
        
        if (error) {
          console.error('Error updating background check status:', error);
          return;
        }

        if (data) {
          setBackgroundCheck(data);
          
          // Stop polling if completed
          if (data.status === 'completed') {
            clearInterval(pollInterval);
            
            // Notify parent component of result
            const clientResult = getClientBackgroundCheckResult(data.result, data.adjudication);
            onBackgroundCheckComplete?.(clientResult.status as 'passed' | 'failed');
            
            toast({
              title: "Background Check Complete",
              description: `Background check for ${nurseName} has been completed.`,
              variant: clientResult.status === 'passed' ? 'default' : 'destructive'
            });
          }
        }
      } catch (error) {
        console.error('Error polling background check:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Clear interval after 1 hour
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 3600000);
  };

  const handleInitiateBackgroundCheck = async () => {
    try {
      setInitiating(true);
      
      // For client-initiated checks, we need the nurse to provide their sensitive information
      // This should trigger a notification to the nurse to provide their SSN and DOB
      // For now, we'll show an informational message
      
      toast({
        title: "Background Check Request Sent",
        description: `${nurseName} will be notified to provide required information for the background check.`,
        variant: "default"
      });

      // TODO: Send notification to nurse to provide SSN and DOB
      // TODO: Create a secure form for the nurse to submit their information
      // For demo purposes, we'll create a pending background check
      
      const { data, error } = await initiateClientBackgroundCheck(
        nurseId,
        clientId,
        jobPostingId
        // candidateData would be provided by the nurse through a secure form
      );

      if (error) {
        throw new Error(error.message);
      }

      setBackgroundCheck(data);
      
      if (data && ['pending', 'processing'].includes(data.status)) {
        pollForUpdates(data.id);
      }

    } catch (error: any) {
      console.error('Error initiating background check:', error);
      toast({
        title: "Background Check Failed",
        description: error.message || "Failed to initiate background check. Please try again.",
        variant: "destructive"
      });
    } finally {
      setInitiating(false);
    }
  };

  const getStatusBadge = (status: BackgroundCheckResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>;
      case 'failed':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getResultDisplay = (result?: string, adjudication?: string) => {
    if (!result) return null;

    const clientResult = getClientBackgroundCheckResult(result, adjudication);
    
    return (
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          {clientResult.status === 'passed' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
          <span className={`font-medium ${
            clientResult.status === 'passed' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {clientResult.message}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Background Check for {nurseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!backgroundCheck ? (
          // No background check exists
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Request a background check to verify this nurse's credentials and history. 
                The nurse will be notified to provide required information securely.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Background Check Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Criminal history search</li>
                <li>• Motor vehicle record check</li>
                <li>• Identity verification</li>
                <li>• Employment eligibility verification</li>
              </ul>
            </div>

            <Button
              onClick={handleInitiateBackgroundCheck}
              disabled={initiating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {initiating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Requesting Background Check...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Request Background Check
                </>
              )}
            </Button>
          </div>
        ) : (
          // Background check exists
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Background Check Status</p>
                <div className="mt-1">
                  {getStatusBadge(backgroundCheck.status)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Initiated</p>
                <p className="text-sm font-medium">
                  {new Date(backgroundCheck.initiated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {backgroundCheck.status === 'completed' && getResultDisplay(backgroundCheck.result, backgroundCheck.adjudication)}

            {['pending', 'processing'].includes(backgroundCheck.status) && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Background check is in progress. This typically takes 1-3 business days to complete.
                  You'll be notified when results are available.
                </AlertDescription>
              </Alert>
            )}

            {backgroundCheck.status === 'failed' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Background check failed to complete. Please contact support for assistance.
                </AlertDescription>
              </Alert>
            )}

            {backgroundCheck.completed_at && (
              <div className="text-sm text-gray-600">
                <p>Completed: {new Date(backgroundCheck.completed_at).toLocaleDateString()}</p>
                {backgroundCheck.expires_at && (
                  <p>Expires: {new Date(backgroundCheck.expires_at).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>
        )}

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Privacy Notice:</strong> Background check results are confidential and only show 
            pass/fail status. Detailed information is not shared to protect privacy.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};