// src/components/AdminPortal.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  UserCheck,
  UserX,
  Search,
  Eye,
  Shield,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/supabase/auth/authService';
import {
  getDashboardStats,
  getAllUsers,
  updateUserAccountStatus,
  getPendingLicenseVerifications,
  updateLicenseVerificationStatus,
  getJobPostingsForReview,
  getTimecardsForAdmin,
  checkAdminStatus,
  getSystemMetrics,
  type DashboardStats,
  type AdminUser
} from '@/supabase/api/adminService';

import ContractAnalytics from '@/components/admin/ContractAnalytics';


export default function AdminPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'nurse' | 'client' | 'admin'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [timecards, setTimecards] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!data?.user) {
          navigate('/auth');
          return;
        }

        const { isAdmin } = await checkAdminStatus(data.user.id);
        if (!isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        await loadDashboardData();
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const { data: stats } = await getDashboardStats();
      setDashboardStats(stats);

      // Load system metrics
      const { data: metrics } = await getSystemMetrics();
      setSystemMetrics(metrics);

      // Load initial users
      await loadUsers();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  const loadUsers = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const userType = selectedUserType === 'all' ? undefined : selectedUserType;
      
      const { data, count } = await getAllUsers(userType, itemsPerPage, offset, searchTerm);
      
      if (data) {
        setUsers(data);
        setTotalUsers(count || 0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const loadPendingVerifications = async () => {
    try {
      const { data } = await getPendingLicenseVerifications(20, 0);
      setPendingVerifications(data || []);
    } catch (error) {
      console.error('Error loading pending verifications:', error);
    }
  };

  const loadJobPostings = async () => {
    try {
      const { data } = await getJobPostingsForReview();
      setJobPostings(data || []);
    } catch (error) {
      console.error('Error loading job postings:', error);
    }
  };

  const loadTimecards = async () => {
    try {
      const { data } = await getTimecardsForAdmin();
      setTimecards(data || []);
    } catch (error) {
      console.error('Error loading timecards:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'verifications') {
      loadPendingVerifications();
    } else if (activeTab === 'jobs') {
      loadJobPostings();
    } else if (activeTab === 'timecards') {
      loadTimecards();
    }
  }, [activeTab, currentPage, selectedUserType, searchTerm]);

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserAccountStatus(userId, newStatus as any);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleVerificationStatusChange = async (licenseId: string, status: 'verified' | 'failed') => {
    try {
      await updateLicenseVerificationStatus(licenseId, status);
      toast({
        title: "Success",
        description: `License ${status} successfully`,
      });
      await loadPendingVerifications();
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive"
      });
    }
  };

  const getUserDisplayName = (user: AdminUser) => {
    if (user.profile_data?.first_name && user.profile_data?.last_name) {
      return `${user.profile_data.first_name} ${user.profile_data.last_name}`;
    }
    return 'Unknown User';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'deactivated': return 'bg-gray-100 text-gray-800';
      case 'dormant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">Nurse Nest Administration Dashboard</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Main Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="timecards">Timecards</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Stats Cards */}
            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Nurses</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.pending_nurse_profiles}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Clients</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.pending_client_profiles}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">New Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.new_applications}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Timecards</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.pending_timecards}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.pending_verifications}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Open Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.open_jobs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('verifications')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review Pending Verifications
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('users')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('timecards')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Review Timecards
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-4">System Health</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database Status</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">API Performance</span>
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Storage Usage</span>
                        <Badge className="bg-yellow-100 text-yellow-800">75%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Users</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="userType">Filter by Type</Label>
                    <Select value={selectedUserType} onValueChange={(value: any) => setSelectedUserType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="nurse">Nurses</SelectItem>
                        <SelectItem value="client">Clients</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{getUserDisplayName(user)}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Badge variant="outline" className="capitalize">
                              {user.user_type}
                            </Badge>
                            <Badge className={getStatusBadgeColor(user.account_status)}>
                              {user.account_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={user.account_status} 
                          onValueChange={(value) => handleUserStatusChange(user.user_id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="deactivated">Deactivated</SelectItem>
                            <SelectItem value="dormant">Dormant</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage * itemsPerPage >= totalUsers}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            {/* License Verifications */}
            <Card>
              <CardHeader>
                <CardTitle>Pending License Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {verification.nurse_profiles?.first_name} {verification.nurse_profiles?.last_name}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p>{verification.license_type} - {verification.license_number}</p>
                            <p>State: {verification.issuing_state} | Expires: {verification.expiration_date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleVerificationStatusChange(verification.id, 'verified')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleVerificationStatusChange(verification.id, 'failed')}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingVerifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No pending verifications!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job Postings */}
            <Card>
              <CardHeader>
                <CardTitle>Job Postings Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{job.care_type} - {job.job_code}</p>
                          <div className="text-sm text-gray-500">
                            <p>Client: {job.client_profiles?.first_name} {job.client_profiles?.last_name}</p>
                            <p>Duration: {job.duration} | Time: {job.preferred_time}</p>
                            <p>Applications: {job.applications?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          job.status === 'open' ? 'bg-green-100 text-green-800' :
                          job.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {job.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {jobPostings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No job postings to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timecards" className="space-y-6">
            {/* Timecards */}
            <Card>
              <CardHeader>
                <CardTitle>Timecard Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timecards.map((timecard) => (
                    <div key={timecard.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {timecard.nurse_profiles?.first_name} {timecard.nurse_profiles?.last_name}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p>Client: {timecard.client_profiles?.first_name} {timecard.client_profiles?.last_name}</p>
                            <p>Date: {timecard.shift_date} | Hours: {timecard.total_hours}</p>
                            <p>Job Code: {timecard.job_code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          timecard.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                          timecard.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          timecard.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {timecard.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {timecards.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No timecards to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contracts" className="space-y-6">
            <ContractAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}