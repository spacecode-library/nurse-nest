
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, Mail, Phone, MapPin, Clock, User, Building2, Heart, FileText, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Updated interface to match actual data structure
interface ClientProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  client_type?: string;
  onboarding_completed?: boolean;
  onboarding_completion_percentage?: number;
  relationship_to_recipient?: string;
  care_needs?: any;
  care_recipients?: any;
  care_location?: any;
}

export default function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'facility'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_profiles')
        .select(`
          *,
          profiles!inner(email, first_name, last_name, phone_number)
        `);
      
      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(client => ({
        id: client.id,
        first_name: client.profiles?.first_name,
        last_name: client.profiles?.last_name,
        phone_number: client.profiles?.phone_number,
        email: client.profiles?.email,
        client_type: client.client_type,
        onboarding_completed: client.onboarding_completed,
        onboarding_completion_percentage: client.onboarding_completion_percentage,
        relationship_to_recipient: client.relationship_to_recipient,
        care_needs: client.care_needs,
        care_recipients: client.care_recipients,
        care_location: client.care_location,
      }));
    },
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'individual' && client.client_type === 'individual') ||
      (filterType === 'facility' && client.client_type === 'facility');

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: clients.length,
    onboarded: clients.filter(c => c.onboarding_completed).length,
    pending: clients.filter(c => !c.onboarding_completed).length,
    individual: clients.filter(c => c.client_type === 'individual').length,
    facility: clients.filter(c => c.client_type === 'facility').length,
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <Button onClick={() => refetch()}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Onboarded</p>
                <p className="text-2xl font-bold text-green-600">{stats.onboarded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Individual</p>
                <p className="text-2xl font-bold">{stats.individual}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Facility</p>
                <p className="text-2xl font-bold">{stats.facility}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            size="sm"
          >
            All Clients
          </Button>
          <Button
            variant={filterType === 'individual' ? 'default' : 'outline'}
            onClick={() => setFilterType('individual')}
            size="sm"
          >
            Individual
          </Button>
          <Button
            variant={filterType === 'facility' ? 'default' : 'outline'}
            onClick={() => setFilterType('facility')}
            size="sm"
          >
            Facility
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No clients found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {client.first_name} {client.last_name}
                        </h3>
                        <Badge variant={client.client_type === 'individual' ? 'default' : 'secondary'}>
                          {client.client_type === 'individual' ? 'Individual' : 'Facility'}
                        </Badge>
                        <Badge variant={client.onboarding_completed ? 'default' : 'destructive'}>
                          {client.onboarding_completed ? 'Complete' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{client.email}</span>
                            </div>
                          )}
                          {client.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{client.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {client.onboarding_completion_percentage !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Onboarding Progress:</span>
                          <span className={`font-semibold ${getCompletionColor(client.onboarding_completion_percentage || 0)}`}>
                            {client.onboarding_completion_percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedClient.first_name} {selectedClient.last_name}
              </h2>
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                Close
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="care">Care Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Client Type</label>
                      <p className="font-semibold capitalize">{selectedClient.client_type || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Onboarding Status</label>
                      <p className={`font-semibold ${selectedClient.onboarding_completed ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedClient.onboarding_completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {selectedClient.relationship_to_recipient && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Relationship to Care Recipient</label>
                      <p className="font-semibold capitalize">{selectedClient.relationship_to_recipient}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="care" className="space-y-4">
                  {selectedClient.care_needs ? (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Care Needs</label>
                      <div className="bg-gray-50 p-3 rounded border">
                        {typeof selectedClient.care_needs === 'object' ? (
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(selectedClient.care_needs, null, 2)}
                          </pre>
                        ) : (
                          <p>{selectedClient.care_needs}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No care needs information available</p>
                  )}

                  {selectedClient.care_recipients && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Care Recipients</label>
                      <div className="bg-gray-50 p-3 rounded border">
                        <p>Recipients: {Array.isArray(selectedClient.care_recipients) ? selectedClient.care_recipients.length : 1}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  {selectedClient.care_location ? (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Care Location</label>
                      <div className="bg-gray-50 p-3 rounded border">
                        {typeof selectedClient.care_location === 'object' ? (
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(selectedClient.care_location, null, 2)}
                          </pre>
                        ) : (
                          <p>{selectedClient.care_location}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No location information available</p>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <p className="text-gray-500">Activity tracking coming soon...</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
