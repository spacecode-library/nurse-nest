// components/dashboard/nurse/ContractsCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  User,
  DollarSign,
  MapPin,
  Briefcase,
  X,
  Loader2,
  Shield,
  MessageCircle,
  Info,
  Award,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getNurseContracts, 
  acceptContract, 
  getContractById, 
  completeContract 
} from '@/supabase/api/contractService';

interface Contract {
  id: string;
  status: string;
  terms: string;
  created_at: string;
  updated_at: string;
  client_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    client_type?: string;
  };
  job_postings: {
    id: string;
    job_code: string;
    care_type: string;
    duration: string;
    preferred_time: string;
    benefits?: string;
  };
}

interface ContractsCardProps {
  nurseId: string;
}

export default function ContractsCard({ nurseId }: ContractsCardProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [acceptanceNotes, setAcceptanceNotes] = useState('');
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [contractToAccept, setContractToAccept] = useState<Contract | null>(null);

  useEffect(() => {
    loadContracts();
  }, [nurseId]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const { data: contractsData, error } = await getNurseContracts(nurseId, 50, 0);
      if (error) throw error;
      setContracts(contractsData || []);
    } catch (error: any) {
      console.error('Error loading contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load contracts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptContract = async (contract: Contract) => {
    setContractToAccept(contract);
    setShowAcceptanceDialog(true);
  };

  const confirmAcceptContract = async () => {
    if (!contractToAccept) return;

    try {
      setAccepting(true);
      const { data, error } = await acceptContract(contractToAccept.id, nurseId);
      if (error) throw error;

      toast({
        title: "Contract Accepted! 🎉",
        description: `You have successfully accepted the contract for ${contractToAccept.job_postings.job_code}. You can now start working!`,
        duration: 5000
      });

      loadContracts();
      setShowAcceptanceDialog(false);
      setContractToAccept(null);
      setAcceptanceNotes('');
    } catch (error: any) {
      console.error('Error accepting contract:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept contract",
        variant: "destructive"
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleCompleteContract = async (contractId: string) => {
    try {
      setCompleting(true);
      const { data, error } = await completeContract(contractId, nurseId, 'nurse');
      if (error) throw error;

      toast({
        title: "Contract Completed",
        description: "Contract has been marked as completed. Great work!",
        duration: 5000
      });

      loadContracts();
    } catch (error: any) {
      console.error('Error completing contract:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete contract",
        variant: "destructive"
      });
    } finally {
      setCompleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <Award className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const ContractCard = ({ contract }: { contract: Contract }) => (
    <Card className={`hover:shadow-md transition-shadow ${
      contract.status === 'pending' ? 'ring-2 ring-amber-500 ring-opacity-50' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {contract.job_postings.job_code}
              </h3>
              <Badge className={`${getStatusColor(contract.status)} flex items-center border`}>
                {getStatusIcon(contract.status)}
                <span className="ml-1 capitalize">{contract.status}</span>
              </Badge>
            </div>
            <p className="text-gray-600 mb-1">{contract.job_postings.care_type}</p>
            <p className="text-sm text-gray-500">
              Client: {contract.client_profiles.first_name} {contract.client_profiles.last_name}
            </p>
          </div>
          
          {contract.status === 'pending' && (
            <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
              <Clock className="h-4 w-4 mr-1" />
              Awaiting Your Acceptance
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Duration</p>
              <p>{contract.job_postings.duration}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Schedule</p>
              <p>{contract.job_postings.preferred_time}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Created</p>
              <p>{new Date(contract.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Client Type</p>
              <p className="capitalize">{contract.client_profiles.client_type || 'Individual'}</p>
            </div>
          </div>
        </div>

        {contract.job_postings.benefits && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <DollarSign className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Benefits & Compensation</p>
                <p className="text-sm text-green-700">{contract.job_postings.benefits}</p>
              </div>
            </div>
          </div>
        )}

        {contract.status === 'pending' && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 mb-1">Contract Awaiting Acceptance</h4>
                <p className="text-sm text-amber-700 mb-3">
                  Please review the contract terms carefully. Once accepted, you'll be committed to this position and can begin working.
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptContract(contract)}
                    disabled={accepting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {accepting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept Contract
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review Terms
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedContract(contract)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Contract
          </Button> */}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Download contract as text file
              const element = document.createElement('a');
              const file = new Blob([contract.terms], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = `contract-${contract.job_postings.job_code}.txt`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>

          {contract.status === 'active' && (
            <>
              <Button
                size="sm"
                onClick={() => {
                  // Navigate to timecards to submit hours
                  const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
                  timecardsTab?.click();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Clock className="h-4 w-4 mr-1" />
                Submit Hours
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCompleteContract(contract.id)}
                disabled={completing}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                {completing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-1" />
                    Mark Complete
                  </>
                )}
              </Button>
            </>
          )}

          {contract.status === 'completed' && (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
              <Award className="h-4 w-4 mr-1" />
              Contract Completed
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const groupContractsByStatus = () => {
    const pending = contracts.filter(contract => contract.status === 'pending');
    const active = contracts.filter(contract => contract.status === 'active');
    const completed = contracts.filter(contract => contract.status === 'completed');

    return { pending, active, completed };
  };

  const { pending, active, completed } = groupContractsByStatus();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading contracts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
                <p className="text-sm text-gray-600">Pending Acceptance</p>
                {pending.length > 0 && (
                  <Badge className="mt-1 bg-amber-100 text-amber-800 animate-pulse">
                    Action Required
                  </Badge>
                )}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{active.length}</p>
                <p className="text-sm text-gray-600">Active Contracts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{completed.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>

            {/* Progress towards Elite Status */}
            {completed.length < 3 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-900">
                      Elite Nurse Progress: {completed.length}/3 contracts completed
                    </p>
                    <p className="text-sm text-yellow-700">
                      Complete {3 - completed.length} more contract{3 - completed.length !== 1 ? 's' : ''} to unlock Elite benefits!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {completed.length >= 3 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-900">🎉 Congratulations! You're an Elite Nurse!</p>
                    <p className="text-sm text-yellow-700">
                      You now have access to priority matching and higher rates.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Contracts Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  When clients hire you, contracts will appear here for your acceptance.
                </p>
                <Button 
                  onClick={() => {
                    // Navigate to jobs tab to find work
                    const jobsTab = document.querySelector('[value="jobs"]') as HTMLElement;
                    jobsTab?.click();
                  }}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Find Job Opportunities
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Contracts</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pending.length})
                    {pending.length > 0 && (
                      <Badge className="ml-2 bg-amber-600 text-white text-xs animate-pulse">
                        {pending.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({active.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completed.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <ContractCard key={contract.id} contract={contract} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                  {pending.length > 0 && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                        <span className="font-medium text-amber-900">
                          You have {pending.length} contract{pending.length !== 1 ? 's' : ''} awaiting your acceptance
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {pending.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No pending contracts
                      </p>
                    ) : (
                      pending.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                  <div className="space-y-4">
                    {active.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No active contracts
                      </p>
                    ) : (
                      active.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  <div className="space-y-4">
                    {completed.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No completed contracts
                      </p>
                    ) : (
                      completed.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Acceptance Dialog */}
      <Dialog open={showAcceptanceDialog} onOpenChange={setShowAcceptanceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Accept Contract
            </DialogTitle>
          </DialogHeader>
          {contractToAccept && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">
                  {contractToAccept.job_postings.job_code} - {contractToAccept.job_postings.care_type}
                </h4>
                <p className="text-sm text-blue-700">
                  Client: {contractToAccept.client_profiles.first_name} {contractToAccept.client_profiles.last_name}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">By accepting this contract, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Provide professional nursing services as outlined in the contract terms</li>
                      <li>Maintain confidentiality and follow HIPAA guidelines</li>
                      <li>Complete the work according to the specified schedule and duration</li>
                      <li>Submit accurate timecards for payment processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="acceptanceNotes">Optional Notes (for client)</Label>
                <Textarea
                  id="acceptanceNotes"
                  placeholder="Add any comments or questions about the contract..."
                  value={acceptanceNotes}
                  onChange={(e) => setAcceptanceNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAcceptanceDialog(false);
                    setContractToAccept(null);
                    setAcceptanceNotes('');
                  }}
                  disabled={accepting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAcceptContract}
                  disabled={accepting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept Contract
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contract Details Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* Contract Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900">{selectedContract.job_postings.job_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedContract.status)}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="text-gray-900">
                    {selectedContract.client_profiles.first_name} {selectedContract.client_profiles.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Care Type</label>
                  <p className="text-gray-900">{selectedContract.job_postings.care_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-gray-900">{selectedContract.job_postings.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Schedule</label>
                  <p className="text-gray-900">{selectedContract.job_postings.preferred_time}</p>
                </div>
              </div>

              {selectedContract.job_postings.benefits && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Benefits & Compensation</label>
                  <p className="text-gray-900">{selectedContract.job_postings.benefits}</p>
                </div>
              )}

              {/* Contract Terms */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Contract Terms
                </label>
                <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none whitespace-pre-wrap"
                  >
                    {selectedContract.terms}
                  </div>
                </div>
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">
                    {new Date(selectedContract.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">
                    {new Date(selectedContract.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Download contract
                    const element = document.createElement('a');
                    const file = new Blob([selectedContract.terms], { 
                      type: 'text/plain' 
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = `contract-${selectedContract.job_postings.job_code}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Contract
                </Button>

                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContract(null)}
                  >
                    Close
                  </Button>
                  
                  {selectedContract.status === 'pending' && (
                    <Button
                      onClick={() => {
                        setSelectedContract(null);
                        handleAcceptContract(selectedContract);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept Contract
                    </Button>
                  )}
                  
                  {selectedContract.status === 'active' && (
                    <Button
                      onClick={() => {
                        setSelectedContract(null);
                        // Navigate to timecards
                        const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
                        timecardsTab?.click();
                      }}
                    >
                      Submit Hours
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}