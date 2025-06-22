// src/components/admin/BackgroundChecksManagement.tsx
// Admin portal component for managing background checks
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  Filter, 
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getAllBackgroundChecks,
  updateBackgroundCheckAdminNotes,
  type BackgroundCheckResult
} from '@/supabase/api/checkrService';
import { supabase } from '@/integrations/supabase/client';

interface BackgroundCheckWithDetails extends BackgroundCheckResult {
  nurse_profiles?: {
    first_name: string;
    last_name: string;
  };
  client_profiles?: {
    first_name: string;
    last_name: string;
  };
}

export const BackgroundChecksManagement: React.FC = () => {
  const [backgroundChecks, setBackgroundChecks] = useState<BackgroundCheckWithDetails[]>([]);
  const [filteredChecks, setFilteredChecks] = useState<BackgroundCheckWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    passed: 0,
    expired: 0
  });

  useEffect(() => {
    fetchBackgroundChecks();
    fetchStats();
  }, []);

  useEffect(() => {
    filterBackgroundChecks();
  }, [backgroundChecks, searchTerm, statusFilter]);

  const fetchBackgroundChecks = async () => {
    try {
      setLoading(true);
      
      // Fetch background checks with related nurse and client info
      const { data, error } = await supabase
        .from('background_checks')
        .select(`
          *,
          nurse_profiles:nurse_id (first_name, last_name),
          client_profiles:client_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBackgroundChecks(data || []);
    } catch (error: any) {
      console.error('Error fetching background checks:', error);
      toast({
        title: "Error",
        description: "Failed to load background checks.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_background_check_stats');
      
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const statsData = data[0];
        setStats({
          total: parseInt(statsData.total_checks) || 0,
          pending: parseInt(statsData.pending_checks) || 0,
          processing: parseInt(statsData.processing_checks) || 0,
          completed: parseInt(statsData.completed_checks) || 0,
          failed: parseInt(statsData.failed_checks) || 0,
          passed: parseInt(statsData.passed_checks) || 0,
          expired: parseInt(statsData.expired_checks) || 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterBackgroundChecks = () => {
    let filtered = backgroundChecks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(check => 
        check.nurse_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.nurse_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.client_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.client_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.checkr_candidate_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.checkr_report_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(check => check.status === statusFilter);
    }

    setFilteredChecks(filtered);
  };

  const handleUpdateNotes = async (checkId: string, notes: string) => {
    try {
      const { data, error } = await updateBackgroundCheckAdminNotes(checkId, notes);
      
      if (error) {
        throw error;
      }

      // Update local state
      setBackgroundChecks(prev => 
        prev.map(check => 
          check.id === checkId ? { ...check, admin_notes: notes } : check
        )
      );

      toast({
        title: "Notes Updated",
        description: "Admin notes have been saved.",
      });
    } catch (error: any) {
      console.error('Error updating notes:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update admin notes.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string, result?: string, adjudication?: string) => {
    switch (status) {
      case 'completed':
        const isPassed = result === 'clear' || (result === 'consider' && adjudication === 'clear');
        return isPassed ? 
          <CheckCircle className="h-4 w-4 text-green-600" /> : 
          <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, result?: string, adjudication?: string) => {
    switch (status) {
      case 'completed':
        const isPassed = result === 'clear' || (result === 'consider' && adjudication === 'clear');
        return (
          <Badge variant={isPassed ? 'default' : 'destructive'}>
            {isPassed ? 'Passed' : 'Review Required'}
          </Badge>
        );
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const exportToCSV = () => {
    const csvData = filteredChecks.map(check => ({
      'Check ID': check.id,
      'Nurse Name': `${check.nurse_profiles?.first_name} ${check.nurse_profiles?.last_name}`,
      'Client Name': `${check.client_profiles?.first_name} ${check.client_profiles?.last_name}`,
      'Status': check.status,
      'Result': check.result || '',
      'Adjudication': check.adjudication || '',
      'Initiated': new Date(check.initiated_at).toLocaleDateString(),
      'Completed': check.completed_at ? new Date(check.completed_at).toLocaleDateString() : '',
      'Expires': check.expires_at ? new Date(check.expires_at).toLocaleDateString() : '',
      'Package': check.package_used,
      'Checkr Candidate ID': check.checkr_candidate_id || '',
      'Checkr Report ID': check.checkr_report_id || '',
      'Admin Notes': check.admin_notes || ''
    }));

    // Convert to CSV and download
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `background-checks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Background Checks Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchBackgroundChecks} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Checks</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by nurse name, client name, or Checkr ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Background Checks ({filteredChecks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChecks.map((check) => (
              <div
                key={check.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(check.status, check.result, check.adjudication)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {check.nurse_profiles?.first_name} {check.nurse_profiles?.last_name}
                          <span className="text-gray-500 mx-2">→</span>
                          {check.client_profiles?.first_name} {check.client_profiles?.last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Initiated: {new Date(check.initiated_at).toLocaleDateString()}</span>
                          {check.completed_at && (
                            <span>Completed: {new Date(check.completed_at).toLocaleDateString()}</span>
                          )}
                          {check.expires_at && (
                            <span>Expires: {new Date(check.expires_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>Package: {check.package_used}</span>
                          {check.checkr_candidate_id && (
                            <span>Candidate ID: {check.checkr_candidate_id}</span>
                          )}
                          {check.checkr_report_id && (
                            <span>Report ID: {check.checkr_report_id}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {check.admin_notes && (
                      <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                        <strong>Admin Notes:</strong> {check.admin_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(check.status, check.result, check.adjudication)}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/background-check/${check.nurse_id}/${check.client_id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredChecks.length === 0 && !loading && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No background checks found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria'
                    : 'Background checks will appear here when clients initiate them'
                  }
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading background checks...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};