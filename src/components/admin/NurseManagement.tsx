
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email?: string;
  created_at: string;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  } | null;
}

interface NurseManagementProps {
  users: AdminUser[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (nurseId: string, name: string) => void;
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
  const formatUser = (user: AdminUser) => {
    // Handle both direct properties and nested profiles
    const firstName = user.first_name || (user.profiles && typeof user.profiles === 'object' && 'first_name' in user.profiles ? user.profiles.first_name : '') || '';
    const lastName = user.last_name || (user.profiles && typeof user.profiles === 'object' && 'last_name' in user.profiles ? user.profiles.last_name : '') || '';
    const phoneNumber = user.phone_number || (user.profiles && typeof user.profiles === 'object' && 'phone_number' in user.profiles ? user.profiles.phone_number : '') || '';
    const email = user.email || (user.profiles && typeof user.profiles === 'object' && 'email' in user.profiles ? user.profiles.email : '') || '';
    
    return {
      ...user,
      firstName,
      lastName,
      phoneNumber,
      email,
      fullName: `${firstName} ${lastName}`.trim()
    };
  };

  const filteredUsers = users
    .map(formatUser)
    .filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Nurse Management</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search nurses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.fullName || 'Unknown Nurse'}</CardTitle>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.phoneNumber && (
                    <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                  )}
                </div>
                <Badge variant={user.onboarding_completed ? "default" : "secondary"}>
                  {user.onboarding_completed ? "Complete" : `${user.onboarding_completion_percentage}%`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(user.id, user.fullName)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApproval(user.id, true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onApproval(user.id, false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No nurses found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
