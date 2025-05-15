import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, Shield, Clock, MessageSquare, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
  };
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  onboarding_progress?: number;
  created_at: string;
}

interface VettingRequest {
  id: string;
  nurse_name: string;
  client_name: string;
  status: 'pending' | 'in_progress' | 'approved' | 'denied';
  services: string[];
  created_at: string;
  comment?: string;
}

export default function AdminDashboard({ profile }: AdminDashboardProps) {
  const [nurses, setNurses] = useState<UserProfile[]>([]);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [vettingRequests, setVettingRequests] = useState<VettingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nurses');
  
  // Mock data loading - in a real app, fetch from your database
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Mock nurse profiles
      const mockNurses = [
        {
          id: '101',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          role: 'nurse',
          onboarding_progress: 75,
          created_at: '2025-05-01T12:00:00Z'
        },
        {
          id: '102',
          first_name: 'Michael',
          last_name: 'Johnson',
          email: 'michael.j@example.com',
          role: 'nurse',
          onboarding_progress: 30,
          created_at: '2025-05-05T09:30:00Z'
        },
        {
          id: '103',
          first_name: 'Sarah',
          last_name: 'Williams',
          email: 'sarah.w@example.com',
          role: 'nurse',
          onboarding_progress: 100,
          created_at: '2025-04-28T14:15:00Z'
        },
      ];
      
      // Mock client profiles
      const mockClients = [
        {
          id: '201',
          first_name: 'Robert',
          last_name: 'Davis',
          email: 'robert.d@example.com',
          role: 'client',
          created_at: '2025-05-03T10:20:00Z'
        },
        {
          id: '202',
          first_name: 'Emily',
          last_name: 'Taylor',
          email: 'emily.t@example.com',
          role: 'client',
          created_at: '2025-05-07T15:45:00Z'
        }
      ];
      
      // Mock vetting requests
      const mockVettingRequests = [
        {
          id: '301',
          nurse_name: 'Jane Smith',
          client_name: 'Robert Davis',
          status: 'pending' as const,
          services: ['Basic Background Check', '5-Panel Drug Test', 'License Verification'],
          created_at: '2025-05-08T11:30:00Z'
        },
        {
          id: '302',
          nurse_name: 'Sarah Williams',
          client_name: 'Emily Taylor',
          status: 'in_progress' as const,
          services: ['Comprehensive Background Check', '10-Panel Drug Test'],
          created_at: '2025-05-06T09:15:00Z',
          comment: 'Waiting for drug test results'
        },
        {
          id: '303',
          nurse_name: 'Michael Johnson',
          client_name: 'Robert Davis',
          status: 'approved' as const,
          services: ['Basic Background Check', 'License Verification', 'Motor Vehicle Record'],
          created_at: '2025-05-02T16:45:00Z',
          comment: 'All checks completed successfully'
        }
      ];
      
      setNurses(mockNurses);
      setClients(mockClients);
      setVettingRequests(mockVettingRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleApproveVetting = (id: string) => {
    // In a real app, this would update the vetting status in your database
    setVettingRequests(vettingRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'approved', comment: 'Approved by admin' } 
        : request
    ));
    
    toast({
      title: "Vetting Approved",
      description: `Vetting request #${id} has been approved`,
    });
  };
  
  const handleDenyVetting = (id: string) => {
    // In a real app, this would update the vetting status in your database
    setVettingRequests(vettingRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'denied', comment: 'Denied by admin' } 
        : request
    ));
    
    toast({
      title: "Vetting Denied",
      description: `Vetting request #${id} has been denied`,
      variant: "destructive",
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nurse-dark"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Nurses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nurses.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {nurses.filter(n => n.onboarding_progress === 100).length} fully onboarded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {vettingRequests.length} active vetting requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vettingRequests.filter(v => v.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Needs your attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Vetting, Nurses, Clients */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="nurses" className="text-sm md:text-base">
            <User className="h-4 w-4 mr-2 hidden md:inline" /> 
            Nurses
          </TabsTrigger>
          <TabsTrigger value="clients" className="text-sm md:text-base">
            <User className="h-4 w-4 mr-2 hidden md:inline" /> 
            Clients
          </TabsTrigger>
          <TabsTrigger value="vetting" className="text-sm md:text-base">
            <Shield className="h-4 w-4 mr-2 hidden md:inline" /> 
            Vetting
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="nurses" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nurse Accounts</CardTitle>
              <CardDescription>
                Monitor and manage nurse onboarding status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nurse
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Onboarding
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nurses.map((nurse) => (
                      <tr key={nurse.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium">{nurse.first_name} {nurse.last_name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {nurse.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(nurse.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                              <div 
                                className={`h-2.5 rounded-full ${getProgressColor(nurse.onboarding_progress || 0)}`} 
                                style={{ width: `${nurse.onboarding_progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{nurse.onboarding_progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Client Accounts</CardTitle>
              <CardDescription>
                Manage client information and vetting requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active Requests
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium">{client.first_name} {client.last_name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {client.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {vettingRequests.filter(v => v.client_name === `${client.first_name} ${client.last_name}`).length}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vetting" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Vetting Requests</CardTitle>
              <CardDescription>
                Review and manage vetting requests from clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vettingRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="border rounded-md p-4"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-lg">
                            {request.nurse_name}
                          </h3>
                          <Badge className={`ml-2 ${getStatusBadgeColor(request.status)}`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Requested by: {request.client_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {formatDate(request.created_at)}
                        </p>
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Services:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.services.map((service, i) => (
                              <Badge key={i} variant="outline" className="bg-blue-50">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {request.comment && (
                          <div className="mt-3 text-sm">
                            <span className="font-medium">Comment:</span> {request.comment}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex items-start">
                        {request.status === 'pending' && (
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveVetting(request.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDenyVetting(request.id)}
                            >
                              Deny
                            </Button>
                          </div>
                        )}
                        {request.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Update Status
                          </Button>
                        )}
                        {(request.status === 'approved' || request.status === 'denied') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
