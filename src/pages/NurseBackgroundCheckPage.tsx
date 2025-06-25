// src/pages/NurseBackgroundCheckPage.tsx
// Page for nurses to complete their background check information
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Building2,
  FileText,
  Info,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SecureBackgroundCheckForm } from '@/components/SecureBackgroundCheckForm';
import { 
  getNurseBackgroundCheckDetails,
  type BackgroundCheckResult 
} from '@/supabase/api/checkrService';

const NurseBackgroundCheckPage: React.FC = () => {
  const { backgroundCheckId } = useParams<{ backgroundCheckId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (backgroundCheckId) {
      fetchBackgroundCheckDetails();
    }
  }, [backgroundCheckId]);

  const fetchBackgroundCheckDetails = async () => {
    if (!backgroundCheckId) return;

    try {
      setLoading(true);
      const { data, error } = await getNurseBackgroundCheckDetails(backgroundCheckId);
      
      if (error) {
        console.error('Error fetching background check details:', error);
        toast({
          title: "Error Loading Background Check",
          description: error.message || "Failed to load background check details.",
          variant: "destructive"
        });
        navigate('/dashboard/nurse');
        return;
      }

      setBackgroundCheck(data);
    } catch (error: any) {
      console.error('Error fetching background check details:', error);
      toast({
        title: "Error",
        description: "Failed to load background check details.",
        variant: "destructive"
      });
      navigate('/dashboard/nurse');
    } finally {
      setLoading(false);
    }
  };

  const handleFormComplete = (result: BackgroundCheckResult) => {
    setBackgroundCheck(result);
    setShowForm(false);
    toast({
      title: "Background Check Submitted",
      description: "Your information has been securely submitted for processing.",
    });
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard/nurse');
    }, 2000);
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
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading background check details...</span>
        </div>
      </div>
    );
  }

  if (!backgroundCheck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Background Check Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The requested background check could not be found or you don't have permission to access it.
            </p>
            <Button onClick={() => navigate('/dashboard/nurse')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/nurse')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
                <p className="text-gray-600">Complete your verification information</p>
              </div>
            </div>
            {getStatusBadge(backgroundCheck.status)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        
        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Background Check Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Current Status</h3>
                <p className="text-sm text-gray-600">
                  {backgroundCheck.status === 'pending' && 'Waiting for your information to proceed'}
                  {backgroundCheck.status === 'processing' && 'Your information is being verified'}
                  {backgroundCheck.status === 'completed' && 'Background check has been completed'}
                </p>
              </div>
              {getStatusBadge(backgroundCheck.status)}
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Requested By
                </h4>
                <p className="text-sm text-gray-600">
                  {(backgroundCheck as any).client_profiles?.first_name} {(backgroundCheck as any).client_profiles?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {(backgroundCheck as any).client_profiles?.client_type === 'individual' ? 'Individual Client' : 'Family Client'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Details
                </h4>
                <p className="text-sm text-gray-600">
                  Requested: {formatDate(backgroundCheck.initiated_at)}
                </p>
                {(backgroundCheck as any).job_postings && (
                  <p className="text-xs text-gray-500">
                    Job: {(backgroundCheck as any).job_postings.job_code} ({(backgroundCheck as any).job_postings.care_type})
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Section */}
        {backgroundCheck.status === 'pending' && !showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Background Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  To proceed with this job opportunity, you need to provide some additional information 
                  for a secure background verification. All information is encrypted and processed 
                  by our verified third-party partner.
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
                      <li>• Your sensitive information is encrypted and secure</li>
                      <li>• Only pass/fail results are shared with the client</li>
                      <li>• This verification is required to proceed with the job</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                <Shield className="h-4 w-4 mr-2" />
                Provide Information Securely
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Secure Form */}
        {backgroundCheck.status === 'pending' && showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Secure Information Form</CardTitle>
            </CardHeader>
            <CardContent>
              <SecureBackgroundCheckForm
                backgroundCheckId={backgroundCheck.id}
                nurseInfo={{
                  first_name: (backgroundCheck as any).nurse_profiles?.first_name || '',
                  last_name: (backgroundCheck as any).nurse_profiles?.last_name || '',
                  email: (backgroundCheck as any).nurse_profiles?.nurse_profiles_users?.email || '',
                  phone_number: (backgroundCheck as any).nurse_profiles?.phone_number || ''
                }}
                onComplete={handleFormComplete}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {backgroundCheck.status === 'processing' && (
          <Card>
            <CardHeader>
              <CardTitle>Background Check in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your background check is currently being processed. This typically takes 1-3 business days. 
                  You'll receive a notification when the results are available.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Completed Status */}
        {backgroundCheck.status === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Background Check Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your background check has been completed successfully. The client has been notified of the results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NurseBackgroundCheckPage;