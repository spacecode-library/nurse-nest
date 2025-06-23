// src/components/dashboard/nurse/PendingBackgroundChecksCard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Building2,
  ArrowRight,
  RefreshCw,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getNursePendingBackgroundChecks,
  type BackgroundCheckResult 
} from '@/supabase/api/checkrService';
import { useAuth } from '@/contexts/AuthContext';

interface PendingBackgroundChecksCardProps {
  nurseId?: string;
  onBackgroundCheckComplete?: () => void;
}

const PendingBackgroundChecksCard: React.FC<PendingBackgroundChecksCardProps> = ({
  nurseId,
  onBackgroundCheckComplete
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [backgroundChecks, setBackgroundChecks] = useState<BackgroundCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingBackgroundChecks();
  }, [nurseId, user]);

  const fetchPendingBackgroundChecks = async () => {
    try {
      setLoading(true);
      
      // Use nurseId if provided, otherwise use current user
      const identifier = nurseId || user?.id;
      if (!identifier) {
        console.error('No nurse identifier available');
        return;
      }

      const { data, error } = await getNursePendingBackgroundChecks(identifier);
      
      if (error) {
        console.error('Error fetching pending background checks:', error);
        toast({
          title: "Error Loading Background Checks",
          description: error.message || "Failed to load pending background checks.",
          variant: "destructive"
        });
        return;
      }

      setBackgroundChecks(data || []);
    } catch (error: any) {
      console.error('Error fetching background checks:', error);
      toast({
        title: "Error",
        description: "Failed to load background checks.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingBackgroundChecks();
    setRefreshing(false);
  };

  const handleCompleteBackgroundCheck = (backgroundCheckId: string) => {
    navigate(`/background-check/${backgroundCheckId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Action Required
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Background Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Background Checks
            {backgroundChecks.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {backgroundChecks.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {backgroundChecks.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No Pending Background Checks
            </h3>
            <p className="text-sm text-gray-500">
              All background checks are up to date
            </p>
          </div>
        ) : (
          <>
            {/* Summary Alert */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Action Required:</strong> You have {backgroundChecks.length} pending background check{backgroundChecks.length > 1 ? 's' : ''} that need{backgroundChecks.length === 1 ? 's' : ''} your information to proceed.
              </AlertDescription>
            </Alert>

            {/* Background Check Items */}
            <div className="space-y-3">
              {backgroundChecks.map((check) => (
                <div
                  key={check.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(check.status)}
                          <h4 className="text-sm font-medium text-gray-900">
                            Background Check Request
                          </h4>
                          {getStatusBadge(check.status)}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>
                            {(check as any).client_profiles?.first_name} {(check as any).client_profiles?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Requested {getDaysAgo(check.initiated_at)}</span>
                        </div>
                      </div>

                      {/* Job Info */}
                      {(check as any).job_postings && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <FileText className="h-3 w-3" />
                          <span>Job: {(check as any).job_postings.job_code}</span>
                          <span className="text-gray-400">•</span>
                          <span>{(check as any).job_postings.care_type}</span>
                        </div>
                      )}

                      {/* Status Message */}
                      <div className="text-sm">
                        {check.status === 'pending' && (
                          <p className="text-amber-700">
                            <strong>Action needed:</strong> Please provide your information to complete the background check process.
                          </p>
                        )}
                        {check.status === 'processing' && (
                          <p className="text-blue-700">
                            <strong>In progress:</strong> Your background check is being processed. You'll be notified when complete.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-4">
                      {check.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteBackgroundCheck(check.id)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Complete Now
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      {check.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteBackgroundCheck(check.id)}
                        >
                          View Status
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <strong>Need help?</strong> Background checks are required by clients to verify your credentials. 
              The process is secure and typically completes within 1-3 business days. 
              Contact support if you have questions about the verification process.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingBackgroundChecksCard;