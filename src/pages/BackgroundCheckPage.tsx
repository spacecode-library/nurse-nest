// src/pages/BackgroundCheckPage.tsx
// Complete background check page with all functionality integrated
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Loader2,
  RefreshCw,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SecureBackgroundCheckForm } from '@/components/SecureBackgroundCheckForm';
import { 
  getClientNurseBackgroundCheck,
  getBackgroundCheckResultSummary,
  updateBackgroundCheckStatus,
  updateBackgroundCheckAdminNotes,
  type BackgroundCheckResult
} from '@/supabase/api/checkrService';
import { supabase } from '@/integrations/supabase/client';

interface NurseInfo {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  city?: string;
  state?: string;
  user_id: string;
  nurse_qualifications?: Array<{
    specializations: string[];
    years_experience: number;
  }>;
  nurse_licenses?: Array<{
    license_type: string;
    issuing_state: string;
    verification_status: string;
  }>;
}

interface ClientInfo {
  id: string;
  first_name: string;
  last_name: string;
  client_type: string;
  user_id: string;
}

// Helper functions to resolve IDs (same logic as in checkrService)
async function resolveClientProfileId(clientIdentifier: string): Promise<string> {
  // First try to get by profile ID
  const { data: directProfile, error: directError } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('id', clientIdentifier)
    .maybeSingle();

  if (directProfile) {
    return directProfile.id;
  }

  // If not found, try by user_id
  const { data: userProfile, error: userError } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('user_id', clientIdentifier)
    .maybeSingle();

  if (userProfile) {
    return userProfile.id;
  }

  throw new Error(`Client profile not found for identifier: ${clientIdentifier}`);
}

async function resolveNurseProfileId(nurseIdentifier: string): Promise<string> {
  // First try to get by profile ID
  const { data: directProfile, error: directError } = await supabase
    .from('nurse_profiles')
    .select('id')
    .eq('id', nurseIdentifier)
    .maybeSingle();

  if (directProfile) {
    return directProfile.id;
  }

  // If not found, try by user_id
  const { data: userProfile, error: userError } = await supabase
    .from('nurse_profiles')
    .select('id')
    .eq('user_id', nurseIdentifier)
    .maybeSingle();

  if (userProfile) {
    return userProfile.id;
  }

  throw new Error(`Nurse profile not found for identifier: ${nurseIdentifier}`);
}

export const BackgroundCheckPage: React.FC = () => {
  const { nurseId, clientId, jobPostingId } = useParams<{
    nurseId: string;
    clientId: string;
    jobPostingId?: string;
  }>();
  const navigate = useNavigate();

  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheckResult | null>(null);
  const [nurseInfo, setNurseInfo] = useState<NurseInfo | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNurseForm, setShowNurseForm] = useState(false);
  const [userRole, setUserRole] = useState<'nurse' | 'client' | 'admin' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);
  
  // Store resolved IDs
  const [resolvedNurseId, setResolvedNurseId] = useState<string | null>(null);
  const [resolvedClientId, setResolvedClientId] = useState<string | null>(null);

  useEffect(() => {
    if (nurseId && clientId) {
      fetchData();
    }
  }, [nurseId, clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view this page.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Resolve the actual profile IDs first
      let actualNurseId: string;
      let actualClientId: string;
      
      try {
        actualNurseId = await resolveNurseProfileId(nurseId!);
        actualClientId = await resolveClientProfileId(clientId!);
        setResolvedNurseId(actualNurseId);
        setResolvedClientId(actualClientId);
      } catch (error: any) {
        console.error('Error resolving profile IDs:', error);
        toast({
          title: "Profile Not Found",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Determine user role
      const [nurseProfile, clientProfile, adminProfile] = await Promise.all([
        supabase.from('nurse_profiles').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('client_profiles').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('admin_profiles').select('id').eq('user_id', user.id).maybeSingle()
      ]);

      let role: 'nurse' | 'client' | 'admin' | null = null;
      if (adminProfile.data) role = 'admin';
      else if (clientProfile.data) role = 'client';
      else if (nurseProfile.data) role = 'nurse';

      setUserRole(role);

      // Fetch background check using the original IDs (checkrService handles resolution)
      const { data: bgCheck, error: bgError } = await getClientNurseBackgroundCheck(nurseId!, clientId!);
      if (bgError) {
        console.error('Error fetching background check:', bgError);
      } else {
        setBackgroundCheck(bgCheck);
        setAdminNotes(bgCheck?.admin_notes || '');
      }

      // Fetch nurse info using resolved ID
      const { data: nurse, error: nurseError } = await supabase
        .from('nurse_profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone_number,
          user_id,
          nurse_qualifications(specializations, years_experience),
          nurse_licenses(license_type, issuing_state, verification_status)
        `)
        .eq('id', actualNurseId)
        .single();

      if (nurseError) {
        console.error('Error fetching nurse info:', nurseError);
        toast({
          title: "Error",
          description: "Failed to load nurse information.",
          variant: "destructive"
        });
      } else {
        // Get email from auth.users if available
        if (nurse) {
          const { data: authUser } = await supabase.auth.admin.getUserById(nurse.user_id);
          setNurseInfo({
            ...nurse,
            email: authUser.user?.email
          });
        }
      }

      // Fetch client info using resolved ID
      const { data: client, error: clientError } = await supabase
        .from('client_profiles')
        .select('id, first_name, last_name, client_type, user_id')
        .eq('id', actualClientId)
        .single();

      if (clientError) {
        console.error('Error fetching client info:', clientError);
        toast({
          title: "Error", 
          description: "Failed to load client information.",
          variant: "destructive"
        });
      } else {
        setClientInfo(client);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load background check information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!backgroundCheck?.id) return;
    
    try {
      setRefreshing(true);
      const { data, error } = await updateBackgroundCheckStatus(backgroundCheck.id);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setBackgroundCheck(data);
        toast({
          title: "Status Updated",
          description: "Background check status has been refreshed.",
        });
      }
    } catch (error: any) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh background check status.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleFormComplete = (result: BackgroundCheckResult) => {
    setBackgroundCheck(result);
    setShowNurseForm(false);
    toast({
      title: "Background Check Submitted",
      description: "Your information has been submitted for processing.",
    });
  };

  const handleUpdateAdminNotes = async () => {
    if (!backgroundCheck?.id) return;

    try {
      setUpdatingNotes(true);
      const { data, error } = await updateBackgroundCheckAdminNotes(backgroundCheck.id, adminNotes);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setBackgroundCheck(data);
        toast({
          title: "Notes Updated",
          description: "Admin notes have been saved.",
        });
      }
    } catch (error: any) {
      console.error('Error updating notes:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update admin notes.",
        variant: "destructive"
      });
    } finally {
      setUpdatingNotes(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        const summary = backgroundCheck ? getBackgroundCheckResultSummary(backgroundCheck) : null;
        return (
          <Badge variant={summary?.clientStatus === 'passed' ? 'default' : 'destructive'}>
            {summary?.clientStatus === 'passed' ? 'Passed' : 'Review Required'}
          </Badge>
        );
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading background check information...</p>
        </div>
      </div>
    );
  }

  if (!nurseInfo || !clientInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Information Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the requested nurse or client information. Please check the URL and try again.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
              <p className="text-gray-600">
                {nurseInfo.first_name} {nurseInfo.last_name} • {clientInfo.first_name} {clientInfo.last_name}
              </p>
            </div>
          </div>

          {backgroundCheck && userRole === 'admin' && (
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          )}
        </div>

        {/* Participants Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nurse Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                Nurse Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {nurseInfo.first_name} {nurseInfo.last_name}</p>
                {nurseInfo.email && <p><strong>Email:</strong> {nurseInfo.email}</p>}
                {nurseInfo.phone_number && <p><strong>Phone:</strong> {nurseInfo.phone_number}</p>}
                {nurseInfo.nurse_qualifications?.[0] && (
                  <>
                    <p><strong>Experience:</strong> {nurseInfo.nurse_qualifications[0].years_experience} years</p>
                    <p><strong>Specializations:</strong> {nurseInfo.nurse_qualifications[0].specializations.join(', ')}</p>
                  </>
                )}
                {nurseInfo.nurse_licenses?.[0] && (
                  <p><strong>License:</strong> {nurseInfo.nurse_licenses[0].license_type} ({nurseInfo.nurse_licenses[0].issuing_state})</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {clientInfo.first_name} {clientInfo.last_name}</p>
                <p><strong>Type:</strong> {clientInfo.client_type}</p>
                {jobPostingId && <p><strong>Job Posting ID:</strong> {jobPostingId}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Background Check Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Background Check Status
              </div>
              {backgroundCheck && getStatusBadge(backgroundCheck.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {backgroundCheck ? (
              <div className="space-y-4">
                {/* Status Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Initiated</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(backgroundCheck.initiated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {backgroundCheck.completed_at && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Completed</Label>
                      <p className="text-sm text-gray-900">
                        {new Date(backgroundCheck.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {backgroundCheck.expires_at && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Expires</Label>
                      <p className="text-sm text-gray-900">
                        {new Date(backgroundCheck.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {backgroundCheck.status === 'pending' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Background check is pending. The nurse needs to provide additional information to proceed.
                    </AlertDescription>
                  </Alert>
                )}

                {backgroundCheck.status === 'processing' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Background check is being processed.
                      This typically takes 1-3 business days to complete.
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

                {backgroundCheck.status === 'completed' && (
                  <Alert variant={getBackgroundCheckResultSummary(backgroundCheck).clientStatus === 'passed' ? 'default' : 'destructive'}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {getBackgroundCheckResultSummary(backgroundCheck).message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Nurse Form for Completing Background Check */}
                {backgroundCheck.status === 'pending' && userRole === 'nurse' && currentUser?.id === nurseInfo.user_id && (
                  <div className="mt-6">
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        To complete your background check, please provide the required information below.
                        All information is securely encrypted and processed by our verified partner.
                      </AlertDescription>
                    </Alert>
                    
                    {!showNurseForm ? (
                      <Button onClick={() => setShowNurseForm(true)} className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Complete Background Check Information
                      </Button>
                    ) : (
                      <SecureBackgroundCheckForm
                        backgroundCheckId={backgroundCheck.id}
                        nurseInfo={{
                          firstName: nurseInfo.first_name,
                          lastName: nurseInfo.last_name,
                          email: nurseInfo.email || '',
                          phone: nurseInfo.phone_number || ''
                        }}
                        onComplete={handleFormComplete}
                        onCancel={() => setShowNurseForm(false)}
                      />
                    )}
                  </div>
                )}

                {/* Admin Notes Section */}
                {userRole === 'admin' && (
                  <div className="mt-6 p-4 border rounded-lg">
                    <Label htmlFor="adminNotes" className="text-sm font-medium">
                      Admin Notes
                    </Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add administrative notes..."
                      className="mt-2"
                      rows={3}
                    />
                    <Button
                      onClick={handleUpdateAdminNotes}
                      disabled={updatingNotes}
                      className="mt-2"
                      size="sm"
                    >
                      {updatingNotes ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Notes'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Background Check Found</h3>
                <p className="text-gray-600 mb-4">
                  No background check has been initiated for this nurse-client pair.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Privacy Notice:</strong> Background check results are confidential and only show 
            pass/fail status. Detailed information is not shared to protect privacy.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};