// src/components/admin/ClientManagement.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  Building,
  Heart
} from 'lucide-react';

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
  // Filter to show only clients
  const clients = users.filter(user => user.user_type === 'client');

  const getStatusBadge = (user: any) => {
    if (user.account_status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (user.account_status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>;
    } else if (user.account_status === 'suspended') {
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  const getClientTypeIcon = (clientType?: string) => {
    if (clientType === 'family') {
      return <Users className="h-5 w-5 text-purple-600" />;
    }
    return <User className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Manage client profiles, care needs, and account status</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name, email, or location..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No clients match your search criteria." : "No clients have registered yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      {getClientTypeIcon(client.client_type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.full_name}
                        </h3>
                        {client.client_type && (
                          <Badge variant="outline" className="text-xs">
                            {client.client_type === 'family' ? 'Family' : 'Individual'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                        {client.profile_data?.phone_number && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{client.profile_data.phone_number}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(client)}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(client.id, client.full_name)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Additional Info Row */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Account Type:</span>
                        <span className="font-medium">
                          {client.client_type === 'family' ? 'Family Account' : 'Individual Account'}
                        </span>
                      </div>
                      
                      {client.relationship_to_recipient && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Relationship:</span>
                          <span className="font-medium">{client.relationship_to_recipient}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-gray-500">
                      ID: {client.id}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {client.account_status === 'active' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-6 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Profile Complete</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Payment Setup</span>
                      </div>
                      {client.has_active_jobs && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Active Jobs</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {clients.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="font-medium text-purple-800">Total Clients:</span>
                  <span className="ml-2 text-purple-600">{clients.length}</span>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Active:</span>
                  <span className="ml-2 text-purple-600">
                    {clients.filter(c => c.account_status === 'active').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Pending Setup:</span>
                  <span className="ml-2 text-purple-600">
                    {clients.filter(c => c.account_status === 'pending').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Individual:</span>
                  <span className="ml-2 text-purple-600">
                    {clients.filter(c => c.client_type === 'individual').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Family:</span>
                  <span className="ml-2 text-purple-600">
                    {clients.filter(c => c.client_type === 'family').length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}