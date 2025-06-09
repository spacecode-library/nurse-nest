// // components/dashboard/client/ClientContractsCard.tsx
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { 
//   FileText, 
//   Calendar, 
//   User, 
//   Clock, 
//   CheckCircle,
//   AlertCircle,
//   Eye,
//   Download,
//   Plus,
//   RefreshCw
// } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { getClientContracts, createContract, generateContractTermsTemplate } from '@/supabase/api/contractService';

// interface Contract {
//   id: string;
//   status: string;
//   terms: string;
//   created_at: string;
//   updated_at: string;
//   nurse_profiles: {
//     id: string;
//     first_name: string;
//     last_name: string;
//     profile_photo_url: string;
//   };
//   job_postings: {
//     id: string;
//     job_code: string;
//     care_type: string;
//     duration: string;
//     preferred_time: string;
//     benefits?: string;
//   };
// }

// interface ClientContractsCardProps {
//   clientId: string;
//   onContractUpdate: () => void;
// }

// export default function ClientContractsCard({ 
//   clientId, 
//   onContractUpdate 
// }: ClientContractsCardProps) {
//   const [contracts, setContracts] = useState<Contract[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [availableHires, setAvailableHires] = useState<any[]>([]);

//   useEffect(() => {
//     loadContracts();
//     loadAvailableHires();
//   }, [clientId]);

//   const loadContracts = async () => {
//     try {
//       setLoading(true);
//       const { data: contractsData, error } = await getClientContracts(clientId, 50, 0);
//       if (error) throw error;
//       setContracts(contractsData || []);
//     } catch (error: any) {
//       console.error('Error loading contracts:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load contracts",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAvailableHires = async () => {
//     // In a real implementation, this would load hired applications that don't have contracts yet
//     // For now, we'll simulate this data
//     setAvailableHires([]);
//   };

//   const handleCreateContract = async (nurseId: string, jobId: string) => {
//     try {
//       // Generate contract terms
//       const nurse = { firstName: 'John', lastName: 'Doe' }; // This would come from the nurse data
//       const client = { firstName: 'Jane', lastName: 'Smith' }; // This would come from client data
//       const job = { 
//         title: 'Nurse Position',
//         careType: 'Adult Care',
//         duration: 'Long-term',
//         preferredTime: 'Daytime'
//       };

//       const terms = generateContractTermsTemplate(job, nurse, client);

//       const contractData = {
//         nurse_id: nurseId,
//         client_id: clientId,
//         job_id: jobId,
//         terms: terms
//       };

//       const { data, error } = await createContract(contractData);
//       if (error) throw error;

//       toast({
//         title: "Contract Created",
//         description: "Contract has been created and sent to the nurse for signature"
//       });

//       loadContracts();
//       setShowCreateDialog(false);
//       onContractUpdate();
//     } catch (error: any) {
//       toast({
//         title: "Creation Failed", 
//         description: error.message || "Failed to create contract",
//         variant: "destructive"
//       });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-amber-100 text-amber-800';
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="h-4 w-4" />;
//       case 'active':
//         return <CheckCircle className="h-4 w-4" />;
//       case 'completed':
//         return <CheckCircle className="h-4 w-4" />;
//       default:
//         return <AlertCircle className="h-4 w-4" />;
//     }
//   };

//   const ContractCard = ({ contract }: { contract: Contract }) => (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start space-x-4">
//           <img
//             src={contract.nurse_profiles.profile_photo_url || '/api/placeholder/48/48'}
//             alt="Nurse"
//             className="h-12 w-12 rounded-full object-cover"
//           />
          
//           <div className="flex-1">
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-900">
//                   {contract.nurse_profiles.first_name} {contract.nurse_profiles.last_name}
//                 </h3>
//                 <p className="text-gray-600">
//                   {contract.job_postings.job_code} - {contract.job_postings.care_type}
//                 </p>
//               </div>
//               <Badge className={`${getStatusColor(contract.status)} flex items-center`}>
//                 {getStatusIcon(contract.status)}
//                 <span className="ml-1 capitalize">{contract.status}</span>
//               </Badge>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
//               <div className="flex items-center">
//                 <Calendar className="h-4 w-4 mr-2" />
//                 Created: {new Date(contract.created_at).toLocaleDateString()}
//               </div>
//               <div className="flex items-center">
//                 <Clock className="h-4 w-4 mr-2" />
//                 {contract.job_postings.duration} | {contract.job_postings.preferred_time}
//               </div>
//             </div>

//             {contract.status === 'pending' && (
//               <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
//                 <div className="flex items-start">
//                   <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
//                   <div className="text-sm">
//                     <p className="font-medium text-amber-800">Waiting for Nurse Signature</p>
//                     <p className="text-amber-700">The contract has been sent to the nurse for review and signature.</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setSelectedContract(contract)}
//               >
//                 <Eye className="h-4 w-4 mr-1" />
//                 View Contract
//               </Button>
              
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   // Download contract
//                   const element = document.createElement('a');
//                   const file = new Blob([contract.terms], { type: 'text/plain' });
//                   element.href = URL.createObjectURL(file);
//                   element.download = `contract-${contract.job_postings.job_code}.txt`;
//                   document.body.appendChild(element);
//                   element.click();
//                   document.body.removeChild(element);
//                 }}
//               >
//                 <Download className="h-4 w-4 mr-1" />
//                 Download
//               </Button>

//               {contract.status === 'active' && (
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     // Navigate to timecard management or other active contract actions
//                     const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
//                     timecardsTab?.click();
//                   }}
//                 >
//                   Manage Work
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const groupContractsByStatus = () => {
//     const pending = contracts.filter(contract => contract.status === 'pending');
//     const active = contracts.filter(contract => contract.status === 'active');
//     const completed = contracts.filter(contract => contract.status === 'completed');

//     return { pending, active, completed };
//   };

//   const { pending, active, completed } = groupContractsByStatus();

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-2 text-gray-600">Loading contracts...</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Summary Card */}
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle className="flex items-center">
//                 <FileText className="h-5 w-5 mr-2" />
//                 Contract Management
//               </CardTitle>
//               {availableHires.length > 0 && (
//                 <Button onClick={() => setShowCreateDialog(true)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create Contract
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
//                 <p className="text-sm text-gray-600">Pending Signature</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-green-600">{active.length}</p>
//                 <p className="text-sm text-gray-600">Active Contracts</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-blue-600">{completed.length}</p>
//                 <p className="text-sm text-gray-600">Completed</p>
//               </div>
//             </div>

//             {/* Repeat Hire Feature */}
//             {completed.length > 0 && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex items-start">
//                   <RefreshCw className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-blue-900">Repeat Hire Available</p>
//                     <p className="text-sm text-blue-700">
//                       Quickly rehire nurses you've worked with before. Previous contract terms will auto-populate.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Contracts List */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Contracts</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {contracts.length === 0 ? (
//               <div className="text-center py-8">
//                 <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   No Contracts Yet
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   When you hire nurses, contracts will be created and appear here.
//                 </p>
//                 {availableHires.length > 0 && (
//                   <Button onClick={() => setShowCreateDialog(true)}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create First Contract
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <Tabs defaultValue="active" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="all">All Contracts</TabsTrigger>
//                   <TabsTrigger value="pending">
//                     Pending ({pending.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="active">
//                     Active ({active.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="completed">
//                     Completed ({completed.length})
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="all" className="mt-6">
//                   <div className="space-y-4">
//                     {contracts.map((contract) => (
//                       <ContractCard key={contract.id} contract={contract} />
//                     ))}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="pending" className="mt-6">
//                   <div className="space-y-4">
//                     {pending.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">
//                         No pending contracts
//                       </p>
//                     ) : (
//                       pending.map((contract) => (
//                         <ContractCard key={contract.id} contract={contract} />
//                       ))
//                     )}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="active" className="mt-6">
//                   <div className="space-y-4">
//                     {active.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">
//                         No active contracts
//                       </p>
//                     ) : (
//                       active.map((contract) => (
//                         <ContractCard key={contract.id} contract={contract} />
//                       ))
//                     )}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="completed" className="mt-6">
//                   <div className="space-y-4">
//                     {completed.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">
//                         No completed contracts
//                       </p>
//                     ) : (
//                       completed.map((contract) => (
//                         <ContractCard key={contract.id} contract={contract} />
//                       ))
//                     )}
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Contract Details Dialog */}
//       <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
//         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Contract Details</DialogTitle>
//           </DialogHeader>
//           {selectedContract && (
//             <div className="space-y-6">
//               {/* Contract Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Nurse</label>
//                   <p className="text-gray-900">
//                     {selectedContract.nurse_profiles.first_name} {selectedContract.nurse_profiles.last_name}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Status</label>
//                   <Badge className={getStatusColor(selectedContract.status)}>
//                     {selectedContract.status}
//                   </Badge>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Job Code</label>
//                   <p className="text-gray-900">{selectedContract.job_postings.job_code}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Care Type</label>
//                   <p className="text-gray-900">{selectedContract.job_postings.care_type}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Duration</label>
//                   <p className="text-gray-900">{selectedContract.job_postings.duration}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Schedule</label>
//                   <p className="text-gray-900">{selectedContract.job_postings.preferred_time}</p>
//                 </div>
//               </div>

//               {selectedContract.job_postings.benefits && (
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Benefits</label>
//                   <p className="text-gray-900">{selectedContract.job_postings.benefits}</p>
//                 </div>
//               )}

//               {/* Contract Terms */}
//               <div>
//                 <label className="text-sm font-medium text-gray-600 mb-2 block">
//                   Contract Terms
//                 </label>
//                 <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
//                   <div 
//                     className="prose prose-sm max-w-none whitespace-pre-wrap"
//                   >
//                     {selectedContract.terms}
//                   </div>
//                 </div>
//               </div>

//               {/* Contract Dates */}
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Created</label>
//                   <p className="text-gray-900">
//                     {new Date(selectedContract.created_at).toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Last Updated</label>
//                   <p className="text-gray-900">
//                     {new Date(selectedContract.updated_at).toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex justify-between items-center pt-4 border-t">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     // Download contract
//                     const element = document.createElement('a');
//                     const file = new Blob([selectedContract.terms], { 
//                       type: 'text/plain' 
//                     });
//                     element.href = URL.createObjectURL(file);
//                     element.download = `contract-${selectedContract.job_postings.job_code}.txt`;
//                     document.body.appendChild(element);
//                     element.click();
//                     document.body.removeChild(element);
//                   }}
//                 >
//                   <Download className="h-4 w-4 mr-2" />
//                   Download Contract
//                 </Button>

//                 <div className="space-x-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => setSelectedContract(null)}
//                   >
//                     Close
//                   </Button>
                  
//                   {selectedContract.status === 'active' && (
//                     <Button
//                       onClick={() => {
//                         // Navigate to timecard management
//                         setSelectedContract(null);
//                         const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
//                         timecardsTab?.click();
//                       }}
//                     >
//                       Manage Work
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }




// components/dashboard/client/ClientContractsCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Plus,
  RefreshCw,
  MessageCircle,
  DollarSign,
  Award,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Star,
  Timer,
  TrendingUp,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getClientContracts, 
  createContract, 
  generateContractTermsTemplate,
  updateContractStatus,
  completeContract
} from '@/supabase/api/contractService';
import { getApplicationsByJob } from '@/supabase/api/applicationService';
import { supabase } from '@/integrations/supabase/client';

interface Contract {
  id: string;
  status: string;
  terms: string;
  created_at: string;
  updated_at: string;
  nurse_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url: string;
    phone_number?: string;
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

interface ClientContractsCardProps {
  clientId: string;
  onContractUpdate: () => void;
}

export default function ClientContractsCard({ 
  clientId, 
  onContractUpdate 
}: ClientContractsCardProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [availableHires, setAvailableHires] = useState<any[]>([]);
  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    loadContracts();
    loadAvailableHires();
    loadClientProfile();
  }, [clientId]);

  const loadClientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (error) throw error;
      setClientProfile(data);
    } catch (error) {
      console.error('Error loading client profile:', error);
    }
  };

  const loadContracts = async () => {
    try {
      setLoading(true);
      const { data: contractsData, error } = await getClientContracts(clientId, 50, 0);
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

  const loadAvailableHires = async () => {
    try {
      // Get all jobs for this client
      const { data: jobs, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'filled');

      if (jobsError) throw jobsError;

      if (!jobs || jobs.length === 0) {
        setAvailableHires([]);
        return;
      }

      // Get hired applications that don't have contracts yet
      const hiresWithoutContracts = [];
      
      for (const job of jobs) {
        const { data: applications } = await getApplicationsByJob(job.id, 100, 0);
        const hiredApps = applications?.filter(app => app.status === 'hired') || [];
        
        for (const app of hiredApps) {
          // Check if contract already exists
          const existingContract = contracts.find(contract => 
            contract.nurse_profiles.id === app.nurse_profiles.id && 
            contract.job_postings.id === job.id
          );
          
          if (!existingContract) {
            hiresWithoutContracts.push({
              application: app,
              job: job
            });
          }
        }
      }
      
      setAvailableHires(hiresWithoutContracts);
    } catch (error) {
      console.error('Error loading available hires:', error);
    }
  };

  const handleCreateContract = async (hire: any) => {
    try {
      // Generate contract terms
      const contractTerms = generateContractTermsTemplate(
        {
          title: hire.job.care_type,
          careType: hire.job.care_type,
          duration: hire.job.duration,
          preferredTime: hire.job.preferred_time
        },
        {
          firstName: hire.application.nurse_profiles.first_name,
          lastName: hire.application.nurse_profiles.last_name
        },
        {
          firstName: clientProfile?.first_name || 'Client',
          lastName: clientProfile?.last_name || ''
        }
      );

      const contractData = {
        nurse_id: hire.application.nurse_profiles.id,
        client_id: clientId,
        job_id: hire.job.id,
        terms: contractTerms
      };

      const { data, error } = await createContract(contractData);
      if (error) throw error;

      toast({
        title: "Contract Created",
        description: "Contract has been created and sent to the nurse for signature"
      });

      loadContracts();
      loadAvailableHires();
      onContractUpdate();
    } catch (error: any) {
      toast({
        title: "Creation Failed", 
        description: error.message || "Failed to create contract",
        variant: "destructive"
      });
    }
  };

  const handleCompleteContract = async (contractId: string) => {
    try {
      const { data, error } = await completeContract(contractId, clientId, 'client');
      if (error) throw error;

      toast({
        title: "Contract Completed",
        description: "Contract has been marked as completed. Thank you for using Nurse Nest!"
      });

      loadContracts();
      onContractUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete contract",
        variant: "destructive"
      });
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

  const ContractCard = ({ contract }: { contract: Contract }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {contract.nurse_profiles.profile_photo_url ? (
              <img
                src={contract.nurse_profiles.profile_photo_url}
                alt="Nurse"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {contract.nurse_profiles.first_name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {contract.nurse_profiles.first_name} {contract.nurse_profiles.last_name}
                </h3>
                <p className="text-gray-600">
                  {contract.job_postings.job_code} - {contract.job_postings.care_type}
                </p>
              </div>
              <Badge className={`${getStatusColor(contract.status)} flex items-center border`}>
                {getStatusIcon(contract.status)}
                <span className="ml-1 capitalize">{contract.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Created: {new Date(contract.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {contract.job_postings.duration} | {contract.job_postings.preferred_time}
              </div>
              {contract.nurse_profiles.phone_number && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {contract.nurse_profiles.phone_number}
                </div>
              )}
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contract #{contract.id.slice(-6)}
              </div>
            </div>

            {/* Status-specific information */}
            {contract.status === 'pending' && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Waiting for Nurse Signature</p>
                    <p className="text-amber-700">The contract has been sent to the nurse for review and signature.</p>
                  </div>
                </div>
              </div>
            )}

            {contract.status === 'active' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Contract Active</p>
                    <p className="text-green-700">The nurse has accepted the contract and can now begin work.</p>
                  </div>
                </div>
              </div>
            )}

            {contract.status === 'completed' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <Award className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Contract Completed</p>
                    <p className="text-blue-700">This contract has been successfully completed. Thank you!</p>
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
                  // Download contract
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

              {contract.nurse_profiles.phone_number && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = `tel:${contract.nurse_profiles.phone_number}`;
                  }}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              )}

              {contract.status === 'active' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Navigate to timecard management
                      const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
                      timecardsTab?.click();
                    }}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Manage Hours
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCompleteContract(contract.id)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Award className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                </>
              )}
            </div>
          </div>
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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Contract Management
              </CardTitle>
              {availableHires.length > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  {availableHires.length} Contract{availableHires.length !== 1 ? 's' : ''} Ready
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
                <p className="text-sm text-gray-600">Pending Signature</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{active.length}</p>
                <p className="text-sm text-gray-600">Active Contracts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{completed.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{availableHires.length}</p>
                <p className="text-sm text-gray-600">Ready to Contract</p>
              </div>
            </div>

            {/* Contracts Ready to Create */}
            {availableHires.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Plus className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Ready to Create Contracts</p>
                    <p className="text-sm text-green-700 mb-3">
                      You have {availableHires.length} hired nurse{availableHires.length !== 1 ? 's' : ''} waiting for contract creation.
                    </p>
                    <div className="space-y-2">
                      {availableHires.map((hire, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border border-green-200">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {hire.application.nurse_profiles.first_name} {hire.application.nurse_profiles.last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {hire.job.job_code} - {hire.job.care_type}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCreateContract(hire)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create Contract
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Repeat Hire Feature */}
            {completed.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Repeat Hire Available</p>
                    <p className="text-sm text-blue-700">
                      Quickly rehire nurses you've worked with before. Previous contract terms will auto-populate.
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
            {contracts.length === 0 && availableHires.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Contracts Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  When you hire nurses, contracts will be created and appear here.
                </p>
                <Button onClick={() => {
                  // Navigate to applicants tab
                  const applicantsTab = document.querySelector('[value="applicants"]') as HTMLElement;
                  applicantsTab?.click();
                }}>
                  <Users className="h-4 w-4 mr-2" />
                  Review Applicants
                </Button>
              </div>
            ) : (
              <Tabs defaultValue={pending.length > 0 ? "pending" : "active"} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Contracts</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pending.length})
                    {pending.length > 0 && (
                      <Badge className="ml-2 bg-amber-600 text-white text-xs">
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
                        <Clock className="h-5 w-5 text-amber-600 mr-2" />
                        <span className="font-medium text-amber-900">
                          {pending.length} contract{pending.length !== 1 ? 's' : ''} awaiting nurse signature
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
                  <label className="text-sm font-medium text-gray-600">Nurse</label>
                  <p className="text-gray-900">
                    {selectedContract.nurse_profiles.first_name} {selectedContract.nurse_profiles.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedContract.status)}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900">{selectedContract.job_postings.job_code}</p>
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
                  
                  {selectedContract.nurse_profiles.phone_number && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.location.href = `tel:${selectedContract.nurse_profiles.phone_number}`;
                      }}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Nurse
                    </Button>
                  )}
                  
                  {selectedContract.status === 'active' && (
                    <Button
                      onClick={() => {
                        setSelectedContract(null);
                        // Navigate to timecard management
                        const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
                        timecardsTab?.click();
                      }}
                    >
                      Manage Work
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