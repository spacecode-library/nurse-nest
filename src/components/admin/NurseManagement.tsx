// src/components/admin/NurseManagement.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  MapPin,
  Star,
  Award,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  Shield,
  FileText,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { AdminUser } from '@/supabase/api/adminService';

interface NurseManagementProps {
  users: AdminUser[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (nurseId: string, name: string) => void;
  onApproval: (nurseId: string, approve: boolean, notes?: string) => void;
  onRefresh: () => void;
}

export default function NurseManagement({ 
  users, 
  searchTerm, 
  onSearchChange, 
  onViewDetails, 
  onApproval, 
  onRefresh 
}: NurseManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onboardingFilter, setOnboardingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort nurses
  const filteredAndSortedNurses = useMemo(() => {
    let filtered = users.filter(user => {
      // Status filter
      if (statusFilter !== 'all' && user.account_status !== statusFilter) return false;
      
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
        case 'experience':
          aValue = a.profile_data?.years_experience || 0;
          bValue = b.profile_data?.years_experience || 0;
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
  }, [users, statusFilter, onboardingFilter, searchTerm, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter(u => !u.profile_data?.onboarding_completed).length;
    const active = users.filter(u => u.account_status === 'active').length;
    const suspended = users.filter(u => u.account_status === 'suspended').length;
    const needsVerification = users.filter(u => 
      u.profile_data?.license_info?.verification_status === 'pending'
    ).length;

    return { total, pending, active, suspended, needsVerification };
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

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserDisplayName = (user: AdminUser) => {
    if (user.profile_data?.first_name && user.profile_data?.last_name) {
      return `${user.profile_data.first_name} ${user.profile_data.last_name}`;
    }
    return 'Unknown User';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Nurse Management</h2>
          <p className="text-slate-600 mt-1">Review, approve, and manage healthcare professionals</p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-600">Total Nurses</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
            <p className="text-sm text-slate-600">Pending Approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
            <p className="text-sm text-slate-600">Active</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.suspended}</p>
            <p className="text-sm text-slate-600">Suspended</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.needsVerification}</p>
            <p className="text-sm text-slate-600">Need Verification</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search Nurses</Label>
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
                  <SelectItem value="experience">Experience</SelectItem>
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

      {/* Nurses List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Nurses ({filteredAndSortedNurses.length})</CardTitle>
              <CardDescription>Manage healthcare professional profiles and approvals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedNurses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedNurses.map((user) => (
                <div key={user.user_id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {getUserDisplayName(user)}
                          </h4>
                          <Badge className={getStatusColor(user.account_status)}>
                            {user.account_status}
                          </Badge>
                          {!user.profile_data?.onboarding_completed && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">
                              Needs Approval
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
                          
                          {user.profile_data?.years_experience && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{user.profile_data.years_experience} years exp.</span>
                            </div>
                          )}
                        </div>

                        {/* Specializations */}
                        {user.profile_data?.specializations && user.profile_data.specializations.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {user.profile_data.specializations.slice(0, 3).map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {user.profile_data.specializations.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.profile_data.specializations.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* License Status */}
                        {user.profile_data?.license_info && (
                          <div className="mt-3 flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {user.profile_data.license_info.license_type} - {user.profile_data.license_info.issuing_state}
                              </span>
                              <Badge className={getVerificationStatusColor(user.profile_data.license_info.verification_status || 'pending')}>
                                {user.profile_data.license_info.verification_status || 'pending'}
                              </Badge>
                            </div>
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

                      {!user.profile_data?.onboarding_completed && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            onClick={() => onApproval(user.profile_data?.id || user.user_id, true)}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApproval(user.profile_data?.id || user.user_id, false)}
                            className="border-red-600 text-red-600 hover:bg-red-50 flex items-center space-x-1"
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Deny</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No nurses found</h3>
              <p className="text-sm">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}