// src/components/BackgroundCheckDashboard.tsx
// Complete background check dashboard page with proper integration
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  FileText,
  User,
  Calendar,
  Building,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  initiateBackgroundCheckRequest,
  getClientNurseBackgroundCheck,
  getBackgroundCheckResultSummary,
  updateBackgroundCheckStatus,
  updateBackgroundCheckNotes,
  type BackgroundCheckResult 
} from '@/supabase/api/checkrService';

interface BackgroundCheckDashboardProps {
  nurseId: string;
  clientId: string;
  nurseName: string;
  nurseEmail?: string;
  jobPostingId?: string;
  onBack?: () => void;
  onBackgroundCheckComplete?: (result: 'passed' | 'failed') => void;
}

export const BackgroundCheckDashboard: React.FC<BackgroundCheckDashboardProps> = ({
  nurseId,
  clientId,
  nurseName,
  nurseEmail,
  jobPostingId,
  onBack,
  onBackgroundCheckComplete
}) => {
  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  useEffect(() => {
    fetchBackgroundCheck();
  }, [nurseId, clientId]);

  useEffect(() => {
    // Set up polling for active background checks
    if (backgroundCheck && ['pending', 'processing'].includes(backgroundCheck.status)) {
      const pollInterval = setInterval(() => {
        handleRefreshStatus();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(pollInterval);
    }
  }, [backgroundCheck]);

  const fetchBackgroundCheck = async () => {
    try {
      setLoading(true);
      const { data, error } = await getClientNurseBackgroundCheck(nurseId, clientId);
      
      if (error) {
        console.error('Error fetching background check:', error);
        return;
      }

      setBackgroundCheck(data);
      setAdminNotes(data?.admin_notes || '');
    } catch (error) {
      console.error('Error fetching background check:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateBackgroundCheck = async () => {
    try {
      setInitiating(true);
      
      // Use the simple initiation function that creates a pending request
      const { data, error } = await initiateBackgroundCheckRequest(
        nurseId,
        clientId,
        jobPostingId
      );

      if (error) {
        throw new Error(error.message);
      }

      setBackgroundCheck(data);
      
      toast({
        title: "Background Check Requested",
        description: `Background check request has been initiated for ${nurseName}. The process will begin once the nurse provides required information.`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error initiating background check:', error);
      toast({
        title: "Request Failed",
        description: error.message || "Failed to initiate background check request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setInitiating(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!backgroundCheck) return;
    
    try {
      setRefreshing(true);
      const { data, error } = await updateBackgroundCheckStatus(backgroundCheck.id);
      
      if (error) {
        console.error('Error updating background check status:', error);
        return;
      }

      if (data) {
        setBackgroundCheck(data);
        
        // Notify parent if completed
        if (data.status === 'completed' && backgroundCheck.status !== 'completed') {
          const result = getBackgroundCheckResultSummary(data.result, data.adjudication);
          const isPassed = result.status === 'approved';
          
          onBackgroundCheckComplete?.(isPassed ? 'passed' : 'failed');
          
          toast({
            title: "Background Check Complete",
            description: `Background check for ${nurseName} has been completed.`,
            variant: isPassed ? 'default' : 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing background check:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!backgroundCheck) return;
    
    try {
      setUpdatingNotes(true);
      const { data, error } = await updateBackgroundCheckNotes(backgroundCheck.id, adminNotes);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setBackgroundCheck(data);
        toast({
          title: "Notes Updated",
          description: "Admin notes have been updated successfully."
        });
      }
    } catch (error: any) {
      console.error('Error updating notes:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update notes.",
        variant: "destructive"
      });
    } finally {
      setUpdatingNotes(false);
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

    const summary = getBackgroundCheckResultSummary(result, adjudication);
    
    return (
      <Card className={`border-2 ${
        summary.status === 'approved' ? 'border-green-200 bg-green-50' : 
        summary.status === 'failed' ? 'border-red-200 bg-red-50' : 
        'border-yellow-200 bg-yellow-50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{summary.icon}</div>
            <div>
              <h3 className={`font-semibold ${
                summary.status === 'approved' ? 'text-green-800' : 
                summary.status === 'failed' ? 'text-red-800' : 
                'text-yellow-800'
              }`}>
                {summary.message}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {summary.status === 'approved' 
                  ? 'This nurse has passed all background check requirements.'
                  : summary.status === 'failed'
                  ? 'This background check requires further review before proceeding.'
                  : 'Background check results require administrative review.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
                <p className="text-gray-600">Verification for {nurseName}</p>
              </div>
            </div>
            
            {backgroundCheck && ['pending', 'processing'].includes(backgroundCheck.status) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStatus}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Nurse Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Nurse Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Full Name</Label>
                  <p className="font-medium">{nurseName}</p>
                </div>
                {nurseEmail && (
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="font-medium">{nurseEmail}</p>
                  </div>
                )}
                {jobPostingId && (
                  <div>
                    <Label className="text-sm text-gray-600">Job Reference</Label>
                    <p className="font-medium">#{jobPostingId.slice(-8)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!backgroundCheck ? (
            /* No Background Check - Initiation Form */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Request Background Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Request a comprehensive background verification for this nurse. 
                    The nurse will be notified to provide required information securely through our platform.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Background Check Includes:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">Criminal history search</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">Motor vehicle record check</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">Identity verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">Employment eligibility verification</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">Important Information</h4>
                      <ul className="text-sm text-amber-800 mt-2 space-y-1">
                        <li>• Background checks typically complete within 1-3 business days</li>
                        <li>• You will only see pass/fail results for privacy protection</li>
                        <li>• The nurse will be notified and must provide consent</li>
                        <li>• Detailed reports are only available to administrators</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleInitiateBackgroundCheck}
                  disabled={initiating}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                >
                  {initiating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Initiating Background Check...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-3" />
                      Request Background Check
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Background Check Exists - Status Display */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Background Check Status
                    </div>
                    {getStatusBadge(backgroundCheck.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Initiated</Label>
                      <p className="font-medium">
                        {new Date(backgroundCheck.initiated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {backgroundCheck.completed_at && (
                      <div>
                        <Label className="text-sm text-gray-600">Completed</Label>
                        <p className="font-medium">
                          {new Date(backgroundCheck.completed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {backgroundCheck.expires_at && (
                      <div>
                        <Label className="text-sm text-gray-600">Expires</Label>
                        <p className="font-medium">
                          {new Date(backgroundCheck.expires_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {backgroundCheck.status === 'completed' && backgroundCheck.result && (
                    <div className="mt-6">
                      {getResultDisplay(backgroundCheck.result, backgroundCheck.adjudication)}
                    </div>
                  )}

                  {['pending', 'processing'].includes(backgroundCheck.status) && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Background check is currently {backgroundCheck.status}. 
                        {backgroundCheck.status === 'pending' 
                          ? ' The nurse needs to provide required information to proceed.'
                          : ' This typically takes 1-3 business days to complete.'
                        } You'll be notified when results are available.
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
                </CardContent>
              </Card>

              {/* Admin Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                    Notes & Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="admin-notes">Internal Notes</Label>
                    <Textarea
                      id="admin-notes"
                      placeholder="Add any notes or comments about this background check..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateNotes}
                    disabled={updatingNotes || adminNotes === backgroundCheck.admin_notes}
                    variant="outline"
                  >
                    {updatingNotes ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Notes'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Privacy Notice */}
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Privacy & Compliance:</strong> All background checks are conducted in compliance with 
              applicable laws and regulations. Results are confidential and only show pass/fail status to 
              protect individual privacy. Detailed information is available only to authorized administrators.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};