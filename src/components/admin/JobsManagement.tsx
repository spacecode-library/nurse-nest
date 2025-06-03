// src/components/admin/JobsManagement.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Search, 
  Eye, 
  Filter,
  Download,
  Copy,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Users,
  Heart,
  Building2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Star,
  Award,
  Home,
  Activity,
  User,
  Stethoscope,
  ClipboardList,
  Target,
  Timer,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AdminJobPosting, 
  JobStatistics,
  generateJobCopyText,
  generateJobExportData
} from '@/supabase/api/enhancedJobAdminService';

interface JobsManagementProps {
  jobs: AdminJobPosting[];
  statistics: JobStatistics | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (jobId: string, jobCode: string) => void;
  onRefresh: () => void;
}

export default function JobsManagement({ 
  jobs, 
  statistics,
  searchTerm, 
  onSearchChange, 
  onViewDetails, 
  onRefresh 
}: JobsManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [careTypeFilter, setCareTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  // Get unique care types for filter
  const uniqueCareTypes = useMemo(() => {
    return [...new Set(jobs.map(job => job.care_type))];
  }, [jobs]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Status filter
      if (statusFilter !== 'all' && job.status !== statusFilter) return false;
      
      // Care type filter
      if (careTypeFilter !== 'all' && job.care_type !== careTypeFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const jobCode = job.job_code.toLowerCase();
        const careType = job.care_type.toLowerCase();
        const clientName = `${job.client_profiles.first_name} ${job.client_profiles.last_name}`.toLowerCase();
        
        return jobCode.includes(searchLower) || careType.includes(searchLower) || clientName.includes(searchLower);
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'job_code':
          aValue = a.job_code;
          bValue = b.job_code;
          break;
        case 'care_type':
          aValue = a.care_type;
          bValue = b.care_type;
          break;
        case 'client_name':
          aValue = `${a.client_profiles.first_name} ${a.client_profiles.last_name}`;
          bValue = `${b.client_profiles.first_name} ${b.client_profiles.last_name}`;
          break;
        case 'applications':
          aValue = a.applications.length;
          bValue = b.applications.length;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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
  }, [jobs, statusFilter, careTypeFilter, searchTerm, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'filled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCopyJob = async (job: AdminJobPosting) => {
    try {
      const copyText = generateJobCopyText(job);
      await navigator.clipboard.writeText(copyText);
      toast({
        title: "Copied!",
        description: "Job details copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async (job: AdminJobPosting) => {
    try {
      const exportData = generateJobExportData(job);
      
      // Create a formatted text document for download
      const content = generateJobCopyText(job);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-${job.job_code}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Job details downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download job details",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async (action: 'copy' | 'download') => {
    if (selectedJobs.size === 0) {
      toast({
        title: "No Jobs Selected",
        description: "Please select jobs to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    const selectedJobData = jobs.filter(job => selectedJobs.has(job.id));
    
    if (action === 'copy') {
      const combinedText = selectedJobData.map(generateJobCopyText).join('\n\n' + '='.repeat(80) + '\n\n');
      try {
        await navigator.clipboard.writeText(combinedText);
        toast({
          title: "Copied!",
          description: `${selectedJobs.size} job(s) copied to clipboard`,
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Unable to copy to clipboard",
          variant: "destructive"
        });
      }
    } else if (action === 'download') {
      const combinedText = selectedJobData.map(generateJobCopyText).join('\n\n' + '='.repeat(80) + '\n\n');
      const blob = new Blob([combinedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `jobs-export-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: `${selectedJobs.size} job(s) downloaded successfully`,
      });
    }

    setSelectedJobs(new Set());
  };

  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const selectAllJobs = () => {
    if (selectedJobs.size === filteredAndSortedJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Jobs Management</h2>
          <p className="text-slate-600 mt-1">Monitor and manage job postings across the platform</p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.totalJobs}</p>
              <p className="text-sm text-slate-600">Total Jobs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.jobsPostedToday}</p>
              <p className="text-sm text-slate-600">Posted Today</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.activeJobs}</p>
              <p className="text-sm text-slate-600">Active Jobs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.filledJobs}</p>
              <p className="text-sm text-slate-600">Filled Jobs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.fillRate.toFixed(1)}%</p>
              <p className="text-sm text-slate-600">Fill Rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Stats Row */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.totalApplications}</p>
              <p className="text-sm text-slate-600">Total Applications</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="h-5 w-5 text-pink-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.averageApplicationsPerJob.toFixed(1)}</p>
              <p className="text-sm text-slate-600">Avg Apps/Job</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Timer className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.averageTimeToFill.toFixed(0)}h</p>
              <p className="text-sm text-slate-600">Avg Fill Time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{statistics.expiredJobs}</p>
              <p className="text-sm text-slate-600">Expired Jobs</p>
            </CardContent>
          </Card>
        </div>
      )}

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
              <Label htmlFor="search">Search Jobs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Job code, care type, client..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="care-type-filter">Care Type</Label>
              <Select value={careTypeFilter} onValueChange={setCareTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueCareTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
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
                  <SelectItem value="created_at">Date Posted</SelectItem>
                  <SelectItem value="job_code">Job Code</SelectItem>
                  <SelectItem value="care_type">Care Type</SelectItem>
                  <SelectItem value="client_name">Client Name</SelectItem>
                  <SelectItem value="applications">Applications</SelectItem>
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

            <div>
              <Label>Bulk Actions</Label>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('copy')}
                  disabled={selectedJobs.size === 0}
                  className="flex-1"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('download')}
                  disabled={selectedJobs.size === 0}
                  className="flex-1"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">
                Job Postings ({filteredAndSortedJobs.length})
                {selectedJobs.size > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {selectedJobs.size} selected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Monitor all job postings and applications</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllJobs}
              >
                {selectedJobs.size === filteredAndSortedJobs.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedJobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedJobs.has(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {/* Job Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {job.job_code} - {job.care_type}
                        </h4>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.applications.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>Client: {job.client_profiles.first_name} {job.client_profiles.last_name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Duration: {job.duration}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Care Details */}
                      <div className="mb-3">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Schedule:</span> {job.preferred_time}
                        </p>
                        {job.care_needs && (
                          <p className="text-sm text-slate-700">
                            <span className="font-medium">Hours/week:</span> {job.care_needs.hours_per_week}
                          </p>
                        )}
                        {job.care_locations && job.care_locations.length > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-slate-600">
                            <MapPin className="h-3 w-3" />
                            <span>{job.care_locations[0].city}, {job.care_locations[0].state}</span>
                          </div>
                        )}
                      </div>

                      {/* Applications Preview */}
                      {job.applications.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-slate-700 mb-2">Recent Applications:</h5>
                          <div className="space-y-2">
                            {job.applications.slice(0, 3).map((app) => (
                              <div key={app.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Stethoscope className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{app.nurse_profiles.first_name} {app.nurse_profiles.last_name}</p>
                                    <p className="text-xs text-slate-600">
                                      {app.nurse_profiles.city}, {app.nurse_profiles.state} • 
                                      {app.nurse_qualifications?.years_experience || 0} years exp
                                    </p>
                                  </div>
                                </div>
                                <Badge className={getApplicationStatusColor(app.status)}>
                                  {app.status}
                                </Badge>
                              </div>
                            ))}
                            {job.applications.length > 3 && (
                              <p className="text-xs text-slate-500 text-center">
                                +{job.applications.length - 3} more applications
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {job.benefits && (
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Benefits:</span> {job.benefits}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(job.id, job.job_code)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyJob(job)}
                        className="flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(job)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-sm">
                {jobs.length === 0 
                  ? "No job postings available at this time." 
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}