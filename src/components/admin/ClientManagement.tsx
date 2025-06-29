// src/components/admin/ClientManagement.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Search, 
  Eye, 
  Filter,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Heart,
  Users,
  Briefcase,
  Star,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { AdminUser } from '@/supabase/api/adminService';

interface ClientManagementProps {
  users: AdminUser[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (clientId: string, name: string) => void;
  onRefresh: () => void;
}

export default function ClientManagement({ 
  users, 
  searchTerm, 
  onSearchChange, 
  onViewDetails, 
  onRefresh 
}: ClientManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientTypeFilter, setClientTypeFilter] = useState<string>('all');
  const [onboardingFilter, setOnboardingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = users.filter(user => {
      // Status filter
      if (statusFilter !== 'all' && user.account_status !== statusFilter) return false;
      
      // Client type filter
      if (clientTypeFilter !== 'all' && user.profile_data?.client_type !== clientTypeFilter) return false;
      
      // Onboarding filter
      if (onboardingFilter === 'completed' && !user.profile_data?.onboarding_completed) return false;
      if (onboardingFilter === 'pending' && user.profile_data?.onboarding_completed) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${user.profile_data?.first_name || ''} ${user.profile_data?.last_name || ''}`.toLowerCase();
        const email = user.email?.toLowerCase() || '';
        
        return fullName.includes(searchLower) || email.includes(searchLower);
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.profile_data?.first_name || ''} ${a.profile_data?.last_name || ''}`;
          bValue = `${b.profile_data?.first_name || ''} ${b.profile_data?.last_name || ''}`;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'client_type':
          aValue = a.profile_data?.client_type || '';
          bValue = b.profile_data?.client_type || '';
          break;
        case 'status':
          aValue = a.account_status;
          bValue = b.account_status;
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, statusFilter, clientTypeFilter, onboardingFilter, searchTerm, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const individual = users.filter(u => u.profile_data?.client_type === 'individual').length;
    const family = users.filter(u => u.profile_data?.client_type === 'family').length;
    const active = users.filter(u => u.account_status === 'active').length;
    const incomplete = users.filter(u => !u.profile_data?.onboarding_completed).length;
    const withCareNeeds = users.filter(u => u.profile_data?.care_needs).length;

    return { total, individual, family, active, incomplete, withCareNeeds };
  }, [users]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'deactivated': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'dormant': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'family': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserDisplayName = (user: AdminUser) => {
    if (user.profile_data?.first_name && user.profile_data?.last_name) {
      return `${user.profile_data.first_name} ${user.profile_data.last_name}`;
    }
    return 'Unknown User';
  };

  const getCompletionPercentage = (user: AdminUser) => {
    return user.profile_data?.onboarding_completion_percentage || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Client Management</h2>
          <p className="text-slate-600 mt-1">Monitor and manage care seekers on the platform</p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
         <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-600">Total Clients</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.individual}</p>
            <p className="text-sm text-slate-600">Individual</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.family}</p>
            <p className="text-sm text-slate-600">Family</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
            <p className="text-sm text-slate-600">Active</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.incomplete}</p>
            <p className="text-sm text-slate-600">Incomplete</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.withCareNeeds}</p>
            <p className="text-sm text-slate-600">Care Defined</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Search Clients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Account Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                  <SelectItem value="dormant">Dormant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client-type-filter">Client Type</Label>
              <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="onboarding-filter">Onboarding</Label>
              <Select value={onboardingFilter} onValueChange={setOnboardingFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Join Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="client_type">Type</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-order">Order</Label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Clients ({filteredAndSortedClients.length})</CardTitle>
              <CardDescription>Monitor client profiles and care requirements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedClients.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedClients.map((user) => (
                <div key={user.user_id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {getUserDisplayName(user)}
                          </h4>
                          <Badge className={getStatusColor(user.account_status)}>
                            {user.account_status}
                          </Badge>
                          {user.profile_data?.client_type && (
                            <Badge className={getClientTypeColor(user.profile_data.client_type)}>
                              {user.profile_data.client_type}
                            </Badge>
                          )}
                          {!user.profile_data?.onboarding_completed && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Setup Incomplete
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          
                          {user.profile_data?.phone_number && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.profile_data.phone_number}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {new Date(user.created_at || '').toLocaleDateString()}</span>
                          </div>
                          
                          {user.profile_data?.relationship_to_recipient && (
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{user.profile_data.relationship_to_recipient}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar for Incomplete Onboarding */}
                        {!user.profile_data?.onboarding_completed && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs text-slate-600 mb-1">
                                  <span>Profile Completion</span>
                                  <span>{getCompletionPercentage(user)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getCompletionPercentage(user)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Care Information */}
                        {user.profile_data?.care_needs && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {user.profile_data.care_needs.care_types?.slice(0, 3).map((type: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {type}
                                </Badge>
                              ))}
                              {user.profile_data.care_needs.care_types?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.profile_data.care_needs.care_types.length - 3} more
                                </Badge>
                              )}
                              {user.profile_data.care_needs.hours_per_week && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {user.profile_data.care_needs.hours_per_week}h/week
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Care Recipients */}
                        {user.profile_data?.care_recipients && user.profile_data.care_recipients.length > 0 && (
                          <div className="mt-3 flex items-center space-x-2 text-sm text-slate-600">
                            <Users className="h-4 w-4" />
                            <span>
                              Care for {user.profile_data.care_recipients.length} recipient{user.profile_data.care_recipients.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        {user.profile_data?.care_location && (
                          <div className="mt-2 flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {user.profile_data.care_location.city}, {user.profile_data.care_location.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(user.profile_data?.id || user.user_id, getUserDisplayName(user))}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No clients found</h3>
              <p className="text-sm">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}