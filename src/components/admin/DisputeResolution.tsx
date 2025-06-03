// src/components/admin/DisputeResolution.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  Scale,
  Timer,
  AlertCircle,
  Building2,
  Stethoscope,
  Gavel,
  ChevronRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface DisputeResolutionProps {
  disputes: any[];
  onViewDetails: (disputeId: string) => void;
  onResolve: (disputeId: string, resolution: 'approve_timecard' | 'deny_timecard' | 'partial_approval', notes: string, adjustedHours?: number) => void;
  onRefresh: () => void;
}

export default function DisputeResolution({ 
  disputes, 
  onViewDetails, 
  onResolve, 
  onRefresh 
}: DisputeResolutionProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [initiatedByFilter, setInitiatedByFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [showQuickResolve, setShowQuickResolve] = useState<string | null>(null);
  const [quickResolutionNotes, setQuickResolutionNotes] = useState('');
  const [quickAdjustedHours, setQuickAdjustedHours] = useState<number>(0);

  // Filter and sort disputes
  const filteredAndSortedDisputes = useMemo(() => {
    let filtered = disputes.filter(dispute => {
      // Status filter
      if (statusFilter !== 'all' && dispute.status !== statusFilter) return false;
      
      // Initiated by filter
      if (initiatedByFilter !== 'all' && dispute.initiated_by_type !== initiatedByFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nurseName = `${dispute.timecard?.nurse_profiles?.first_name || ''} ${dispute.timecard?.nurse_profiles?.last_name || ''}`.toLowerCase();
        const clientName = `${dispute.timecard?.client_profiles?.first_name || ''} ${dispute.timecard?.client_profiles?.last_name || ''}`.toLowerCase();
        const reason = dispute.dispute_reason?.toLowerCase() || '';
        
        return nurseName.includes(searchLower) || clientName.includes(searchLower) || reason.includes(searchLower);
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'nurse_name':
          aValue = `${a.timecard?.nurse_profiles?.first_name || ''} ${a.timecard?.nurse_profiles?.last_name || ''}`;
          bValue = `${b.timecard?.nurse_profiles?.first_name || ''} ${b.timecard?.nurse_profiles?.last_name || ''}`;
          break;
        case 'client_name':
          aValue = `${a.timecard?.client_profiles?.first_name || ''} ${a.timecard?.client_profiles?.last_name || ''}`;
          bValue = `${b.timecard?.client_profiles?.first_name || ''} ${b.timecard?.client_profiles?.last_name || ''}`;
          break;
        case 'amount':
          aValue = a.timecard?.payment_amount || 0;
          bValue = b.timecard?.payment_amount || 0;
          break;
        case 'hours':
          aValue = a.timecard?.total_hours || 0;
          bValue = b.timecard?.total_hours || 0;
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
  }, [disputes, statusFilter, initiatedByFilter, searchTerm, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = disputes.length;
    const pending = disputes.filter(d => d.status === 'pending').length;
    const investigating = disputes.filter(d => d.status === 'investigating').length;
    const resolved = disputes.filter(d => d.status.startsWith('resolved')).length;
    const clientInitiated = disputes.filter(d => d.initiated_by_type === 'client').length;
    const nurseInitiated = disputes.filter(d => d.initiated_by_type === 'nurse').length;
    
    // Calculate average resolution time for resolved disputes
    const resolvedDisputes = disputes.filter(d => d.resolved_at);
    const avgResolutionTime = resolvedDisputes.length > 0 
      ? resolvedDisputes.reduce((sum, d) => {
          const created = new Date(d.created_at);
          const resolved = new Date(d.resolved_at);
          return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        }, 0) / resolvedDisputes.length
      : 0;

    return { total, pending, investigating, resolved, clientInitiated, nurseInitiated, avgResolutionTime };
  }, [disputes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved_client': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved_nurse': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitiatedByColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      case 'nurse': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLevel = (dispute: any) => {
    // Calculate priority based on various factors
    const createdDate = new Date(dispute.created_at);
    const hoursOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
    const amount = dispute.timecard?.payment_amount || 0;
    
    if (hoursOld > 72 || amount > 500) return 'high';
    if (hoursOld > 48 || amount > 200) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickResolve = async (disputeId: string, resolution: 'approve_timecard' | 'deny_timecard' | 'partial_approval') => {
    if (!quickResolutionNotes.trim()) {
      return;
    }
    
    await onResolve(
      disputeId, 
      resolution, 
      quickResolutionNotes, 
      resolution === 'partial_approval' ? quickAdjustedHours : undefined
    );
    
    setShowQuickResolve(null);
    setQuickResolutionNotes('');
    setQuickAdjustedHours(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dispute Resolution Center</h2>
          <p className="text-slate-600 mt-1">Manage and resolve timecard disputes efficiently</p>
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-600">Total Disputes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
            <p className="text-sm text-slate-600">Pending</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.investigating}</p>
            <p className="text-sm text-slate-600">Investigating</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.resolved}</p>
            <p className="text-sm text-slate-600">Resolved</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{Math.round(stats.avgResolutionTime)}h</p>
            <p className="text-sm text-slate-600">Avg Resolution</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Gavel className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{((stats.resolved / stats.total) * 100).toFixed(0)}%</p>
            <p className="text-sm text-slate-600">Resolution Rate</p>
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
              <Label htmlFor="search">Search Disputes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name, reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved_client">Resolved (Client)</SelectItem>
                  <SelectItem value="resolved_nurse">Resolved (Nurse)</SelectItem>
                  <SelectItem value="resolved_admin">Resolved (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="initiated-by-filter">Initiated By</Label>
              <Select value={initiatedByFilter} onValueChange={setInitiatedByFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
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
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="nurse_name">Nurse Name</SelectItem>
                  <SelectItem value="client_name">Client Name</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
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

      {/* Disputes List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Active Disputes ({filteredAndSortedDisputes.length})</CardTitle>
              <CardDescription>Review and resolve timecard disputes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedDisputes.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedDisputes.map((dispute) => {
                const priority = getPriorityLevel(dispute);
                const isQuickResolving = showQuickResolve === dispute.id;
                
                return (
                  <div key={dispute.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-semibold text-slate-900">
                                Timecard Dispute #{dispute.id.slice(-8)}
                              </h4>
                              <Badge className={getStatusColor(dispute.status)}>
                                {dispute.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(priority)}>
                                {priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Reason: {dispute.dispute_reason}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {dispute.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowQuickResolve(isQuickResolving ? null : dispute.id)}
                              className="flex items-center space-x-1"
                            >
                              <Gavel className="h-4 w-4" />
                              <span>Quick Resolve</span>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(dispute.id)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Full Details</span>
                          </Button>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Nurse</p>
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">
                              {dispute.timecard?.nurse_profiles?.first_name} {dispute.timecard?.nurse_profiles?.last_name}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Client</p>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">
                              {dispute.timecard?.client_profiles?.first_name} {dispute.timecard?.client_profiles?.last_name}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Timecard</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{dispute.timecard?.total_hours}h</span>
                            </div>
                            <div className="text-xs text-slate-600">
                              {new Date(dispute.timecard?.shift_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Initiated By</p>
                          <div className="space-y-1">
                            <Badge className={getInitiatedByColor(dispute.initiated_by_type)}>
                              {dispute.initiated_by_type}
                            </Badge>
                            <div className="text-xs text-slate-600">
                              {new Date(dispute.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Resolution Form */}
                      {isQuickResolving && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                          <h5 className="font-medium text-blue-900">Quick Resolution</h5>
                          
                          <div>
                            <Label htmlFor={`notes-${dispute.id}`}>Resolution Notes</Label>
                            <Textarea
                              id={`notes-${dispute.id}`}
                              placeholder="Explain your decision..."
                              value={quickResolutionNotes}
                              onChange={(e) => setQuickResolutionNotes(e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`hours-${dispute.id}`}>Adjusted Hours (for partial approval)</Label>
                              <Input
                                id={`hours-${dispute.id}`}
                                type="number"
                                step="0.25"
                                value={quickAdjustedHours || dispute.timecard?.total_hours || 0}
                                onChange={(e) => setQuickAdjustedHours(parseFloat(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              onClick={() => handleQuickResolve(dispute.id, 'approve_timecard')}
                              disabled={!quickResolutionNotes.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve Timecard
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleQuickResolve(dispute.id, 'partial_approval')}
                              disabled={!quickResolutionNotes.trim() || quickAdjustedHours === dispute.timecard?.total_hours}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Partial Approval
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickResolve(dispute.id, 'deny_timecard')}
                              disabled={!quickResolutionNotes.trim()}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny Timecard
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowQuickResolve(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Evidence Preview */}
                      {(dispute.client_evidence || dispute.nurse_evidence) && (
                        <div className="border-t pt-4">
                          <h5 className="font-medium text-slate-700 mb-2">Evidence Summary</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dispute.client_evidence && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-green-700 mb-1">Client Evidence</p>
                                <p className="text-sm text-green-600 line-clamp-2">{dispute.client_evidence}</p>
                              </div>
                            )}
                            {dispute.nurse_evidence && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-blue-700 mb-1">Nurse Evidence</p>
                                <p className="text-sm text-blue-600 line-clamp-2">{dispute.nurse_evidence}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No disputes found</h3>
              <p className="text-sm">
                {disputes.length === 0 
                  ? "No active disputes at this time." 
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Action Summary */}
      {filteredAndSortedDisputes.filter(d => d.status === 'pending').length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Action Required
            </CardTitle>
            <CardDescription>
              You have {filteredAndSortedDisputes.filter(d => d.status === 'pending').length} pending disputes that need your attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-yellow-700">
                High priority disputes should be resolved within 24 hours to maintain platform trust.
              </div>
              <Button 
                onClick={() => setStatusFilter('pending')}
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                View Pending Only
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}