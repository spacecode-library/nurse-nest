// components/dashboard/nurse/ContractsCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getNurseContracts, acceptContract } from '@/supabase/api/contractService';

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

  const handleAcceptContract = async (contractId: string) => {
    try {
      setAccepting(true);
      const { data, error } = await acceptContract(contractId, nurseId);
      if (error) throw error;

      toast({
        title: "Contract Accepted",
        description: "You have successfully accepted the contract. You can now start working!"
      });

      loadContracts();
      setSelectedContract(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ContractCard = ({ contract }: { contract: Contract }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {contract.job_postings.job_code}
            </h3>
            <p className="text-gray-600">{contract.job_postings.care_type}</p>
          </div>
          <Badge className={`${getStatusColor(contract.status)} flex items-center`}>
            {getStatusIcon(contract.status)}
            <span className="ml-1 capitalize">{contract.status}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            Client: {contract.client_profiles.first_name} {contract.client_profiles.last_name}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Duration: {contract.job_postings.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Schedule: {contract.job_postings.preferred_time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            Created: {new Date(contract.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedContract(contract)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Contract
          </Button>
          
          {contract.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => handleAcceptContract(contract.id)}
              disabled={accepting}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {accepting ? 'Accepting...' : 'Accept Contract'}
            </Button>
          )}
          
          {contract.status === 'active' && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Currently Working
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Contracts Yet
                </h3>
                <p className="text-gray-600">
                  Apply for jobs and get hired to see your contracts here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {contracts.filter(c => c.status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {contracts.filter(c => c.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {contracts.filter(c => c.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>

                {/* Contracts List */}
                <div className="grid gap-4">
                  {contracts.map((contract) => (
                    <ContractCard key={contract.id} contract={contract} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                  <label className="text-sm font-medium text-gray-600">Benefits</label>
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
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedContract.terms.replace(/\n/g, '<br/>') 
                    }}
                  />
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
                    // Download contract as text file
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
                      onClick={() => handleAcceptContract(selectedContract.id)}
                      disabled={accepting}
                    >
                      {accepting ? 'Accepting...' : 'Accept Contract'}
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