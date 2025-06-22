// src/pages/BackgroundCheckPage.tsx
// Complete background check page with all functionality integrated
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

      // Fetch background check
      const { data: bgCheck, error: bgError } = await getClientNurseBackgroundCheck(nurseId!, clientId!);
      if (bgError) {
        console.error('Error fetching background check:', bgError);
      } else {
        setBackgroundCheck(bgCheck);
        setAdminNotes(bgCheck?.admin_notes || '');
      }

      // Fetch nurse info
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
        .eq('id', nurseId!)
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

      // Fetch client info
      const { data: client, error: clientError } = await supabase
        .from('client_profiles')
        .select('id, first_name, last_name, client_type, user_id')
        .eq('id', clientId!)
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
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const canProvideInformation = () => {
    return userRole === 'nurse' && 
           backgroundCheck?.status === 'pending' && 
           nurseInfo?.user_id === currentUser?.id;
  };

  const canViewDetails = () => {
    return userRole === 'admin' || 
           (userRole === 'client' && clientInfo?.user_id === currentUser?.id) ||
           (userRole === 'nurse' && nurseInfo?.user_id === currentUser?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading background check information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
          </div>
          
          {backgroundCheck && canViewDetails() && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          )}
        </div>

        {/* Participants Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nurse Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                Nurse Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nurseInfo ? (
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
              ) : (
                <p className="text-gray-500">Loading nurse information...</p>
              )}
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
              {clientInfo ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {clientInfo.first_name} {clientInfo.last_name}</p>
                  <p><strong>Type:</strong> {clientInfo.client_type}</p>
                  {jobPostingId && <p><strong>Job Posting ID:</strong> {jobPostingId}</p>}
                </div>
              ) : (
                <p className="text-gray-500">Loading client information...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Background Check Status */}
        <Card>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{backgroundCheck.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Initiated</p>
                    <p className="font-semibold">
                      {new Date(backgroundCheck.initiated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {backgroundCheck.completed_at && (
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="font-semibold">
                        {new Date(backgroundCheck.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status-specific content */}
                {backgroundCheck.status === 'pending' && canProvideInformation() && !showNurseForm && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Action Required:</strong> Please provide your personal information to complete the background check process.
                      <Button
                        onClick={() => setShowNurseForm(true)}
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Provide Information
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {backgroundCheck.status === 'processing' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>In Progress:</strong> Your background check is being processed. This typically takes 1-2 business days.
                    </AlertDescription>
                  </Alert>
                )}

                {backgroundCheck.status === 'completed' && (
                  <Alert className={`border-${backgroundCheck.result === 'clear' ? 'green' : 'red'}-200 bg-${backgroundCheck.result === 'clear' ? 'green' : 'red'}-50`}>
                    {backgroundCheck.result === 'clear' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={`text-${backgroundCheck.result === 'clear' ? 'green' : 'red'}-800`}>
                      <strong>Completed:</strong> {getBackgroundCheckResultSummary(backgroundCheck).message}
                    </AlertDescription>
                  </Alert>
                )}

                {backgroundCheck.status === 'failed' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Failed:</strong> There was an issue processing the background check. Please contact support.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No background check found for this nurse-client pair.</p>
                {userRole === 'client' && (
                  <Button
                    onClick={() => navigate(`/dashboard/client`)}
                    className="mt-4"
                  >
                    Initiate Background Check
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nurse Form */}
        {showNurseForm && nurseInfo && backgroundCheck && (
          <SecureBackgroundCheckForm
            backgroundCheckId={backgroundCheck.id}
            nurseInfo={nurseInfo}
            onComplete={handleFormComplete}
            onCancel={() => setShowNurseForm(false)}
          />
        )}

        {/* Detailed Information (Admin/Client View) */}
        {backgroundCheck && canViewDetails() && !showNurseForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detailed Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="notes">Admin Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Package Used</p>
                      <p className="text-sm text-gray-600">{backgroundCheck.package_used}</p>
                    </div>
                    {backgroundCheck.expires_at && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expires</p>
                        <p className="text-sm text-gray-600">
                          {new Date(backgroundCheck.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {backgroundCheck.result && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Result</p>
                        <p className="text-sm text-gray-600">{backgroundCheck.result}</p>
                      </div>
                    )}
                    {backgroundCheck.adjudication && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Adjudication</p>
                        <p className="text-sm text-gray-600">{backgroundCheck.adjudication}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  {userRole === 'admin' && (
                    <div className="space-y-4">
                      {backgroundCheck.checkr_candidate_id && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Checkr Candidate ID</p>
                          <p className="text-sm font-mono text-gray-600">{backgroundCheck.checkr_candidate_id}</p>
                        </div>
                      )}
                      {backgroundCheck.checkr_report_id && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Checkr Report ID</p>
                          <p className="text-sm font-mono text-gray-600">{backgroundCheck.checkr_report_id}</p>
                        </div>
                      )}
                      {backgroundCheck.raw_response && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Raw Response</p>
                          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-64">
                            {JSON.stringify(backgroundCheck.raw_response, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  {userRole !== 'admin' && (
                    <p className="text-gray-500 text-center py-4">
                      Technical details are only available to administrators.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  {userRole === 'admin' ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="admin-notes" className="text-sm font-medium text-gray-700">
                          Admin Notes
                        </label>
                        <textarea
                          id="admin-notes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Add internal notes about this background check..."
                        />
                      </div>
                      <Button
                        onClick={handleUpdateAdminNotes}
                        disabled={updatingNotes || adminNotes === backgroundCheck.admin_notes}
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
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Admin Notes</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border min-h-[100px]">
                        {backgroundCheck.admin_notes || 'No admin notes available.'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};