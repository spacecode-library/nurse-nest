import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  FileText, 
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { 
  getNurseBackgroundCheck, 
  updateBackgroundCheckStatus, 
  updateBackgroundCheckNotes,
  getBackgroundCheckResultSummary 
} from '@/supabase/api/checkrService';
interface BackgroundCheckPanelProps {
  nurseId: string;
  nurseName: string;
  onStatusUpdate?: () => void;
}

export default function BackgroundCheckPanel({ 
  nurseId, 
  nurseName, 
  onStatusUpdate 
}: BackgroundCheckPanelProps) {
  const [backgroundCheck, setBackgroundCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadBackgroundCheck();
  }, [nurseId]);

  const loadBackgroundCheck = async () => {
    try {
      setLoading(true);
      const { data, error } = await getNurseBackgroundCheck(nurseId);
      
      if (error) {
        console.error('Error loading background check:', error);
        return;
      }
      
      setBackgroundCheck(data);
      setAdminNotes(data?.admin_notes || '');
    } catch (error) {
      console.error('Error loading background check:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!backgroundCheck?.id) return;
    
    try {
      setUpdating(true);
      const { data, error } = await updateBackgroundCheckStatus(backgroundCheck.id);
      
      if (error) {
        console.error('Error updating background check status:', error);
        return;
      }
      
      setBackgroundCheck(data);
      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating background check status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!backgroundCheck?.id) return;
    
    try {
      setUpdating(true);
      const { data, error } = await updateBackgroundCheckNotes(backgroundCheck.id, adminNotes);
      
      if (error) {
        console.error('Error updating admin notes:', error);
        return;
      }
      
      setBackgroundCheck({ ...backgroundCheck, admin_notes: adminNotes });
    } catch (error) {
      console.error('Error updating admin notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Background Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading background check information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!backgroundCheck) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-gray-400" />
            <span>Background Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              No background check has been initiated for {nurseName}. 
              Background checks are automatically started during the onboarding process.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const resultSummary = getBackgroundCheckResultSummary(
    backgroundCheck.result, 
    backgroundCheck.adjudication
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Background Check</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {backgroundCheck.status === 'processing' && (
              <Button
                onClick={handleRefreshStatus}
                disabled={updating}
                variant="outline"
                size="sm"
              >
                {updating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            )}
            
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Status Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{resultSummary.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {nurseName}
                </h3>
                <p className="text-sm text-gray-600">{resultSummary.message}</p>
              </div>
            </div>
            
            <Badge className={resultSummary.color}>
              {backgroundCheck.status.toUpperCase()}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Status</div>
              <div className="font-semibold text-gray-900 capitalize">
                {backgroundCheck.status}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Result</div>
              <div className={`font-semibold capitalize ${
                backgroundCheck.result === 'clear' ? 'text-green-600' :
                backgroundCheck.result === 'consider' ? 'text-yellow-600' :
                backgroundCheck.result === 'suspended' ? 'text-red-600' :
                'text-gray-400'
              }`}>
                {backgroundCheck.result || 'Pending'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Initiated</div>
              <div className="font-semibold text-gray-900 text-xs">
                {formatDate(backgroundCheck.initiated_at)}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="font-semibold text-gray-900 text-xs">
                {backgroundCheck.completed_at ? 
                  formatDate(backgroundCheck.completed_at) : 
                  'In Progress'
                }
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {backgroundCheck.status === 'processing' && (
            <Alert className="border-blue-200 bg-blue-50 mb-4">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Background check is currently processing. This typically takes 1-2 business days to complete.
                {backgroundCheck.checkr_report_id && (
                  <span className="block mt-1 text-xs">
                    Report ID: {backgroundCheck.checkr_report_id}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Result Details */}
          {backgroundCheck.result && (
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Background Check Results</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Result:</span>
                  <Badge className={
                    backgroundCheck.result === 'clear' ? 'bg-green-100 text-green-800' :
                    backgroundCheck.result === 'consider' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {backgroundCheck.result?.toUpperCase()}
                  </Badge>
                </div>
                
                {backgroundCheck.adjudication && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Adjudication:</span>
                    <span className="text-sm font-medium capitalize">
                      {backgroundCheck.adjudication}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Package Used:</span>
                  <span className="text-sm font-medium">
                    {backgroundCheck.package_used}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Detailed Information
            </h4>
            
            <div className="space-y-4">
              {/* Checkr IDs */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Checkr Integration</h5>
                <div className="text-xs space-y-1">
                  {backgroundCheck.checkr_candidate_id && (
                    <div>
                      <span className="text-gray-500">Candidate ID:</span>
                      <span className="ml-2 font-mono">{backgroundCheck.checkr_candidate_id}</span>
                    </div>
                  )}
                  {backgroundCheck.checkr_report_id && (
                    <div>
                      <span className="text-gray-500">Report ID:</span>
                      <span className="ml-2 font-mono">{backgroundCheck.checkr_report_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Response Preview */}
              {backgroundCheck.raw_response && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Report Summary</h5>
                  <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(backgroundCheck.raw_response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Admin Notes</h4>
          <div className="space-y-3">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this background check..."
              className="min-h-[80px]"
            />
            <Button
              onClick={handleUpdateNotes}
              disabled={updating || adminNotes === backgroundCheck.admin_notes}
              size="sm"
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Update Notes
            </Button>
          </div>
        </div>

        {/* Action Recommendations */}
        {backgroundCheck.status === 'completed' && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recommendation</h4>
            {backgroundCheck.result === 'clear' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Recommended for Approval:</strong> Background check passed with no issues. 
                  This nurse meets all safety requirements and can be approved for the platform.
                </AlertDescription>
              </Alert>
            )}
            
            {backgroundCheck.result === 'consider' && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Manual Review Required:</strong> Background check found items that require 
                  careful consideration. Please review the full report and make a judgment based on 
                  your organization's policies.
                </AlertDescription>
              </Alert>
            )}
            
            {backgroundCheck.result === 'suspended' && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Not Recommended for Approval:</strong> Background check identified significant 
                  issues that pose potential risks. Consider denying approval unless exceptional 
                  circumstances apply.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}