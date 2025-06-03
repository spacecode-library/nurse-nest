// src/components/admin/PlatformDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Building2,
  Stethoscope,
  CreditCard,
  Shield
} from 'lucide-react';
import { PlatformMetrics } from '@/supabase/api/enhancedAdminService';

interface PlatformDashboardProps {
  metrics: PlatformMetrics | null;
  activityFeed: any[];
  onNavigate: (view: string, itemId: string, label: string) => void;
  onRefresh: () => void;
}

export default function PlatformDashboard({ 
  metrics, 
  activityFeed, 
  onNavigate, 
  onRefresh 
}: PlatformDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return Users;
      case 'timecard': return Clock;
      case 'contract': return FileText;
      case 'payment': return DollarSign;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string, status: string) => {
    switch (type) {
      case 'application':
        return status === 'hired' ? 'text-green-600' : 'text-blue-600';
      case 'timecard':
        return status === 'Approved' ? 'text-green-600' : status === 'Rejected' ? 'text-red-600' : 'text-yellow-600';
      case 'contract':
        return status === 'active' ? 'text-green-600' : 'text-blue-600';
      case 'payment':
        return status === 'succeeded' ? 'text-green-600' : 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading platform metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Platform Overview</h2>
          <p className="text-slate-600 mt-1">Real-time insights into your healthcare platform</p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-700">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(metrics.monthlyGrowth.revenue)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.monthlyGrowth.revenue)}`}>
                    {metrics.monthlyGrowth.revenue > 0 ? '+' : ''}{metrics.monthlyGrowth.revenue.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Fees */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 mb-1">Platform Fees (15%)</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(metrics.platformFees)}</p>
                <div className="flex items-center mt-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-600 ml-1">
                    {((metrics.platformFees / metrics.totalRevenue) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-purple-700">{metrics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <div className="flex space-x-4 text-xs">
                    <span className="text-blue-600">{metrics.totalNurses} nurses</span>
                    <span className="text-green-600">{metrics.totalClients} clients</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Contracts */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-600 mb-1">Active Contracts</p>
                <p className="text-3xl font-bold text-amber-700">{metrics.activeContracts}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-slate-600 ml-1">
                    {metrics.completedContracts} completed
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{metrics.totalTransactions}</p>
            <p className="text-sm text-slate-600">Total Transactions</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.averageHourlyRate)}</p>
            <p className="text-sm text-slate-600">Avg Hourly Rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{metrics.pendingApprovals}</p>
            <p className="text-sm text-slate-600">Pending Approvals</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{metrics.disputedTimecards}</p>
            <p className="text-sm text-slate-600">Active Disputes</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">Platform Activity</CardTitle>
                  <CardDescription>Recent actions across the platform</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {activityFeed.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {activityFeed.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      const colorClass = getActivityColor(activity.type, activity.status);
                      
                      return (
                        <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100`}>
                              <Icon className={`h-4 w-4 ${colorClass}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {activity.title}
                              </p>
                              <p className="text-sm text-slate-600 truncate">
                                {activity.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${colorClass.replace('text-', 'text-').replace('600', '700')} border-current`}
                                >
                                  {activity.status}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {new Date(activity.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Care Types & Quick Actions */}
        <div className="space-y-6">
          {/* Top Care Types */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold">Top Care Types</CardTitle>
              <CardDescription>Most requested services</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {metrics.topCareTypes.map((careType, index) => (
                  <div key={careType.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{careType.type}</p>
                        <p className="text-xs text-slate-600">{careType.count} jobs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{formatCurrency(careType.revenue)}</p>
                      <p className="text-xs text-slate-600">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => onNavigate('nurses', '', 'Nurse Management')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Review Nurses</p>
                      <p className="text-xs text-slate-600">Pending approvals</p>
                    </div>
                  </div>
                  {metrics.pendingApprovals > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {metrics.pendingApprovals}
                    </Badge>
                  )}
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => onNavigate('disputes', '', 'Dispute Resolution')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium">Resolve Disputes</p>
                      <p className="text-xs text-slate-600">Active timecard disputes</p>
                    </div>
                  </div>
                  {metrics.disputedTimecards > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {metrics.disputedTimecards}
                    </Badge>
                  )}
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => onNavigate('analytics', '', 'Analytics Hub')}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">View Analytics</p>
                    <p className="text-xs text-slate-600">Detailed platform insights</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">System Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">API Performance</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Payment Processing</span>
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Growth Rate</span>
                <Badge className={`${getGrowthColor(metrics.monthlyGrowth.users).replace('text-', 'bg-').replace('600', '100')} ${getGrowthColor(metrics.monthlyGrowth.users).replace('600', '800')}`}>
                  {metrics.monthlyGrowth.users > 0 ? '+' : ''}{metrics.monthlyGrowth.users.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}