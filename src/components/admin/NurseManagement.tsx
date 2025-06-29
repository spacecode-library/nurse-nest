// src/components/admin/NurseManagement.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Shield,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NurseManagementProps {
  users: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (nurseId: any, name: any) => void;
  onApproval: (nurseId: string, approve: boolean, notes?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function NurseManagement({ 
  users, 
  searchTerm, 
  onSearchChange, 
  onViewDetails, 
  onApproval,
  onRefresh 
}: NurseManagementProps) {
  const [loading, setLoading] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState<{ [key: string]: string }>({});

  // Filter to show only nurses
  const nurses = users.filter(user => user.user_type === 'nurse');

  const handleApproval = async (nurseId: string, approve: boolean) => {
    setLoading(true);
    try {
      await onApproval(nurseId, approve, approvalNotes[nurseId]);
      toast({
        title: approve ? "Nurse Approved" : "Nurse Rejected",
        description: `The nurse has been ${approve ? 'approved' : 'rejected'} successfully.`,
      });
      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${approve ? 'approve' : 'reject'} nurse.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (user: any) => {
    if (user.account_status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (user.account_status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    } else if (user.account_status === 'suspended') {
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nurse Management</h2>
          <p className="text-gray-600">Manage nurse profiles, approvals, and verification status</p>
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
                placeholder="Search nurses by name, email, or license..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nurses List */}
      <div className="space-y-4">
        {nurses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No nurses found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No nurses match your search criteria." : "No nurses have registered yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          nurses.map((nurse) => (
            <Card key={nurse.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {nurse.full_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{nurse.email}</span>
                        </div>
                        {nurse.profile_data?.phone_number && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{nurse.profile_data.phone_number}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(nurse.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(nurse)}
                    
                    {nurse.account_status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproval(nurse.user_id, false)}
                          disabled={loading}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproval(nurse.user_id, true)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(nurse.id, nurse.full_name)}
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
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Verification Status:</span>
                        <Badge variant="outline" className="text-xs">
                          {nurse.account_status === 'active' ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      
                      {nurse.account_status === 'pending' && (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Awaiting approval</span>
                        </div>
                      )}
                    </div>

                    <div className="text-gray-500">
                      ID: {nurse.id}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {nurses.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="font-medium text-blue-800">Total Nurses:</span>
                  <span className="ml-2 text-blue-600">{nurses.length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Active:</span>
                  <span className="ml-2 text-blue-600">
                    {nurses.filter(n => n.account_status === 'active').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Pending:</span>
                  <span className="ml-2 text-blue-600">
                    {nurses.filter(n => n.account_status === 'pending').length}
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