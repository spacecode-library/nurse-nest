import React from 'react';

interface ClientManagementProps {
  users: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (clientId: any, name: any) => void;
  onRefresh: () => Promise<void>;
}

export default function ClientManagement({ 
  users, 
  searchTerm, 
  onSearchChange, 
  onViewDetails, 
  onRefresh 
}: ClientManagementProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Client Management</h2>
      {/* Component implementation */}
    </div>
  );
}

// src/components/admin/ClientManagement.tsx

// import React, { useState, useEffect, useMemo } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { 
//   Search, 
//   Eye, 
//   Building2, 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin,
//   Calendar,
//   Star,
//   Clock,
//   Shield,
//   Award,
//   RefreshCw,
//   Filter,
//   Users,
//   Heart,
//   Home,
//   CreditCard,
//   DollarSign
// } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { getClientsWithProfiles, type AdminUser } from '@/supabase/api/adminService';
// import { getDetailedClientProfile, type AdminClientProfile } from '@/supabase/api/enhancedAdminService';

// interface ClientManagementProps {
//   users: AdminUser[];
//   searchTerm: string;
//   onSearchChange: (value: string) => void;
//   onViewDetails: (clientId: string, name: string) => void;
//   onRefresh: () => Promise<void>;
// }

// interface EnhancedClientData extends AdminUser {
//   clientProfile?: AdminClientProfile;
//   loading?: boolean;
// }

// export default function ClientManagement({ 
//   users, 
//   searchTerm, 
//   onSearchChange, 
//   onViewDetails, 
//   onRefresh 
// }: ClientManagementProps) {
//   const [enhancedClients, setEnhancedClients] = useState<EnhancedClientData[]>([]);
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [filterClientType, setFilterClientType] = useState<string>('all');
//   const [sortBy, setSortBy] = useState<string>('created_at');
//   const [loading, setLoading] = useState(false);

//   // Filter clients from users
//   const clients = useMemo(() => 
//     users.filter(user => user.user_type === 'client'),
//     [users]
//   );

//   // Load detailed client profiles
//   useEffect(() => {
//     const loadClientProfiles = async () => {
//       if (clients.length === 0) return;
      
//       setLoading(true);
//       const enhancedData: EnhancedClientData[] = [];

//       try {
//         // Get clients with profiles using the admin service
//         const { data: clientsWithProfiles } = await getClientsWithProfiles();
        
//         for (const client of clients) {
//           try {
//             // Find matching client profile
//             const clientProfile = clientsWithProfiles?.find(cp => cp.user_id === client.id);
            
//             if (clientProfile) {
//               // Get detailed profile
//               const { data: detailedProfile } = await getDetailedClientProfile(clientProfile.id);
              
//               enhancedData.push({
//                 ...client,
//                 clientProfile: detailedProfile || undefined,
//                 loading: false
//               });
//             } else {
//               enhancedData.push({
//                 ...client,
//                 loading: false
//               });
//             }
//           } catch (error) {
//             console.error(`Error loading profile for client ${client.id}:`, error);
//             enhancedData.push({
//               ...client,
//               loading: false
//             });
//           }
//         }

//         setEnhancedClients(enhancedData);
//       } catch (error) {
//         console.error('Error loading client profiles:', error);
//         toast({
//           title: "Error",
//           description: "Failed to load client profiles",
//           variant: "destructive"
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadClientProfiles();
//   }, [clients]);

//   // Filter and sort clients
//   const filteredAndSortedClients = useMemo(() => {
//     let filtered = enhancedClients;

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(client => {
//         const searchLower = searchTerm.toLowerCase();
//         const fullName = `${client.clientProfile?.first_name || ''} ${client.clientProfile?.last_name || ''}`.toLowerCase();
//         return (
//           fullName.includes(searchLower) ||
//           client.email.toLowerCase().includes(searchLower) ||
//           client.clientProfile?.phone_number?.toLowerCase().includes(searchLower) ||
//           client.clientProfile?.care_locations?.some(loc => 
//             loc.city.toLowerCase().includes(searchLower) || 
//             loc.state.toLowerCase().includes(searchLower)
//           )
//         );
//       });
//     }

//     // Apply status filter
//     if (filterStatus !== 'all') {
//       filtered = filtered.filter(client => {
//         switch (filterStatus) {
//           case 'active':
//             return client.account_status === 'active' && client.clientProfile?.onboarding_completed;
//           case 'pending':
//             return client.account_status === 'pending' || !client.clientProfile?.onboarding_completed;
//           case 'suspended':
//             return client.account_status === 'suspended';
//           case 'incomplete':
//             return !client.clientProfile?.onboarding_completed;
//           default:
//             return true;
//         }
//       });
//     }

//     // Apply client type filter
//     if (filterClientType !== 'all') {
//       filtered = filtered.filter(client => 
//         client.clientProfile?.client_type === filterClientType
//       );
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           const nameA = `${a.clientProfile?.first_name || ''} ${a.clientProfile?.last_name || ''}`;
//           const nameB = `${b.clientProfile?.first_name || ''} ${b.clientProfile?.last_name || ''}`;
//           return nameA.localeCompare(nameB);
//         case 'created_at':
//           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//         case 'status':
//           return (a.account_status || '').localeCompare(b.account_status || '');
//         case 'spending':
//           const spendingA = a.clientProfile?.totalSpent || 0;
//           const spendingB = b.clientProfile?.totalSpent || 0;
//           return spendingB - spendingA;
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [enhancedClients, searchTerm, filterStatus, filterClientType, sortBy]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'suspended':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getClientTypeColor = (type: string) => {
//     switch (type) {
//       case 'individual':
//         return 'bg-blue-100 text-blue-800';
//       case 'family':
//         return 'bg-purple-100 text-purple-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Statistics
//   const stats = useMemo(() => {
//     const total = enhancedClients.length;
//     const active = enhancedClients.filter(c => c.account_status === 'active').length;
//     const pending = enhancedClients.filter(c => c.account_status === 'pending').length;
//     const totalSpent = enhancedClients.reduce((sum, c) => sum + (c.clientProfile?.totalSpent || 0), 0);
    
//     return { total, active, pending, totalSpent };
//   }, [enhancedClients]);

//   if (loading && enhancedClients.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
//           <p className="text-gray-600">Loading client profiles...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header and Stats */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
//           <p className="text-gray-600">Manage client accounts, profiles, and care requirements</p>
//         </div>
        
//         <div className="flex flex-wrap gap-4">
//           <div className="bg-blue-50 px-4 py-2 rounded-lg">
//             <div className="text-sm text-blue-600 font-medium">Total Clients</div>
//             <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
//           </div>
//           <div className="bg-green-50 px-4 py-2 rounded-lg">
//             <div className="text-sm text-green-600 font-medium">Active</div>
//             <div className="text-2xl font-bold text-green-700">{stats.active}</div>
//           </div>
//           <div className="bg-yellow-50 px-4 py-2 rounded-lg">
//             <div className="text-sm text-yellow-600 font-medium">Pending</div>
//             <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
//           </div>
//           <div className="bg-purple-50 px-4 py-2 rounded-lg">
//             <div className="text-sm text-purple-600 font-medium">Total Spent</div>
//             <div className="text-2xl font-bold text-purple-700">${stats.totalSpent.toLocaleString()}</div>
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="md:col-span-2">
//               <Label htmlFor="search">Search Clients</Label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="search"
//                   type="text"
//                   placeholder="Search by name, email, phone, or location..."
//                   value={searchTerm}
//                   onChange={(e) => onSearchChange(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label htmlFor="status-filter">Filter by Status</Label>
//               <Select value={filterStatus} onValueChange={setFilterStatus}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Statuses" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="incomplete">Incomplete Onboarding</SelectItem>
//                   <SelectItem value="suspended">Suspended</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div>
//               <Label htmlFor="type-filter">Client Type</Label>
//               <Select value={filterClientType} onValueChange={setFilterClientType}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="individual">Individual</SelectItem>
//                   <SelectItem value="family">Family</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div>
//               <Label htmlFor="sort-by">Sort By</Label>
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Sort by..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="created_at">Registration Date</SelectItem>
//                   <SelectItem value="name">Name</SelectItem>
//                   <SelectItem value="status">Account Status</SelectItem>
//                   <SelectItem value="spending">Total Spending</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between mt-4">
//             <div className="text-sm text-gray-600">
//               Showing {filteredAndSortedClients.length} of {enhancedClients.length} clients
//             </div>
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={onRefresh}
//               disabled={loading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Clients List */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredAndSortedClients.map((client) => (
//           <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//             <CardHeader className="pb-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
//                     <Building2 className="h-6 w-6 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">
//                       {client.clientProfile?.first_name || 'Unknown'} {client.clientProfile?.last_name || 'Client'}
//                     </h3>
//                     <div className="flex items-center space-x-2 text-sm text-gray-600">
//                       <Mail className="h-3 w-3" />
//                       <span>{client.email}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col items-end space-y-1">
//                   <Badge className={getStatusColor(client.account_status || 'unknown')}>
//                     {client.account_status || 'Unknown'}
//                   </Badge>
//                   {client.clientProfile?.client_type && (
//                     <Badge className={getClientTypeColor(client.clientProfile.client_type)}>
//                       {client.clientProfile.client_type}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </CardHeader>
            
//             <CardContent className="space-y-4">
//               {/* Contact Info */}
//               <div className="space-y-2">
//                 {client.clientProfile?.phone_number && (
//                   <div className="flex items-center space-x-2 text-sm">
//                     <Phone className="h-4 w-4 text-gray-400" />
//                     <span>{client.clientProfile.phone_number}</span>
//                   </div>
//                 )}
                
//                 {client.clientProfile?.care_locations?.[0] && (
//                   <div className="flex items-center space-x-2 text-sm">
//                     <MapPin className="h-4 w-4 text-gray-400" />
//                     <span>
//                       {client.clientProfile.care_locations[0].city}, {client.clientProfile.care_locations[0].state}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="flex items-center space-x-2 text-sm">
//                   <Calendar className="h-4 w-4 text-gray-400" />
//                   <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
//                 </div>
//               </div>
              
//               {/* Care Recipients */}
//               {client.clientProfile?.care_recipients && client.clientProfile.care_recipients.length > 0 && (
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Heart className="h-4 w-4 text-red-500" />
//                     <span className="text-sm font-medium">Care Recipients</span>
//                   </div>
//                   <div className="space-y-1">
//                     {client.clientProfile.care_recipients.slice(0, 2).map((recipient, index) => (
//                       <div key={index} className="text-sm text-gray-600">
//                         {recipient.first_name} {recipient.last_name} ({recipient.age} years)
//                       </div>
//                     ))}
//                     {client.clientProfile.care_recipients.length > 2 && (
//                       <div className="text-sm text-gray-500">
//                         +{client.clientProfile.care_recipients.length - 2} more
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
              
//               {/* Care Needs Summary */}
//               {client.clientProfile?.care_needs && (
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Shield className="h-4 w-4 text-blue-500" />
//                     <span className="text-sm font-medium">Care Types</span>
//                   </div>
//                   <div className="flex flex-wrap gap-1">
//                     {client.clientProfile.care_needs.care_types.slice(0, 3).map((type, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
//                         {type}
//                       </Badge>
//                     ))}
//                     {client.clientProfile.care_needs.care_types.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{client.clientProfile.care_needs.care_types.length - 3}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )}
              
//               {/* Quick Stats */}
//               {client.clientProfile && (
//                 <div className="grid grid-cols-3 gap-2 text-center">
//                   <div className="bg-gray-50 rounded-lg p-2">
//                     <div className="text-lg font-bold text-gray-900">
//                       {client.clientProfile.totalJobPostings || 0}
//                     </div>
//                     <div className="text-xs text-gray-600">Jobs Posted</div>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-2">
//                     <div className="text-lg font-bold text-gray-900">
//                       {client.clientProfile.hiredNurses || 0}
//                     </div>
//                     <div className="text-xs text-gray-600">Nurses Hired</div>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-2">
//                     <div className="text-lg font-bold text-gray-900">
//                       ${(client.clientProfile.totalSpent || 0).toLocaleString()}
//                     </div>
//                     <div className="text-xs text-gray-600">Total Spent</div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Payment Status */}
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-2">
//                   <CreditCard className="h-4 w-4 text-gray-400" />
//                   <span>Payment Methods:</span>
//                 </div>
//                 <Badge variant="outline">
//                   {client.clientProfile?.payment_methods_count || 0} active
//                 </Badge>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex space-x-2 pt-4">
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   onClick={() => onViewDetails(
//                     client.id, 
//                     `${client.clientProfile?.first_name} ${client.clientProfile?.last_name}`
//                   )}
//                   className="flex-1"
//                 >
//                   <Eye className="h-4 w-4 mr-2" />
//                   View Details
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       {/* Empty State */}
//       {filteredAndSortedClients.length === 0 && !loading && (
//         <Card>
//           <CardContent className="p-12 text-center">
//             <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
//             <p className="text-gray-600 mb-4">
//               {searchTerm || filterStatus !== 'all' || filterClientType !== 'all'
//                 ? 'Try adjusting your search criteria or filters.' 
//                 : 'No clients have registered yet.'}
//             </p>
//             {(searchTerm || filterStatus !== 'all' || filterClientType !== 'all') && (
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   onSearchChange('');
//                   setFilterStatus('all');
//                   setFilterClientType('all');
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
