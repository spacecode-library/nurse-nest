// src/components/admin/AnalyticsHub.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Target,
  Award,
  Zap,
  Globe,
  CreditCard,
  Building2,
  Stethoscope,
  Heart,
  Shield,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { PlatformMetrics } from '@/supabase/api/enhancedAdminService';

interface AnalyticsHubProps {
  metrics: PlatformMetrics | null;
  onRefresh: () => void;
}

export default function AnalyticsHub({ metrics, onRefresh }: AnalyticsHubProps) {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState('overview');

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

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!metrics) return null;

    const conversionRate = metrics.totalUsers > 0 ? (metrics.activeContracts / metrics.totalUsers) * 100 : 0;
    const revenuePerUser = metrics.totalUsers > 0 ? metrics.totalRevenue / metrics.totalUsers : 0;
    const avgTransactionValue = metrics.totalTransactions > 0 ? metrics.totalRevenue / metrics.totalTransactions : 0;
    const platformTakeRate = metrics.totalRevenue > 0 ? (metrics.platformFees / metrics.totalRevenue) * 100 : 0;
    const nurseUtilization = metrics.totalNurses > 0 ? (metrics.activeContracts / metrics.totalNurses) * 100 : 0;

    return {
      conversionRate,
      revenuePerUser,
      avgTransactionValue,
      platformTakeRate,
      nurseUtilization
    };
  }, [metrics]);

  if (!metrics || !derivedMetrics) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Analytics Hub</h2>
          <p className="text-slate-600 mt-1">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-700">{formatCurrency(metrics.totalRevenue)}</p>
                    <div className="flex items-center mt-2">
                      {getGrowthIcon(metrics.monthlyGrowth.revenue)}
                      <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.monthlyGrowth.revenue)}`}>
                        {metrics.monthlyGrowth.revenue > 0 ? '+' : ''}{metrics.monthlyGrowth.revenue.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Active Users</p>
                    <p className="text-3xl font-bold text-blue-700">{metrics.totalUsers.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {getGrowthIcon(metrics.monthlyGrowth.users)}
                      <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.monthlyGrowth.users)}`}>
                        {metrics.monthlyGrowth.users > 0 ? '+' : ''}{metrics.monthlyGrowth.users.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Active Contracts</p>
                    <p className="text-3xl font-bold text-purple-700">{metrics.activeContracts}</p>
                    <div className="flex items-center mt-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-slate-600 ml-1">
                        {metrics.completedContracts} completed
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Avg Hourly Rate</p>
                    <p className="text-3xl font-bold text-amber-700">{formatCurrency(metrics.averageHourlyRate)}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-slate-600 ml-1">
                        Market competitive
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{derivedMetrics.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-slate-600">Conversion Rate</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(derivedMetrics.revenuePerUser)}</p>
                <p className="text-sm text-slate-600">Revenue per User</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(derivedMetrics.avgTransactionValue)}</p>
                <p className="text-sm text-slate-600">Avg Transaction</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{derivedMetrics.platformTakeRate.toFixed(1)}%</p>
                <p className="text-sm text-slate-600">Take Rate</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{derivedMetrics.nurseUtilization.toFixed(1)}%</p>
                <p className="text-sm text-slate-600">Nurse Utilization</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Care Types */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Top Care Types</CardTitle>
              <CardDescription>Most popular services by revenue and demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topCareTypes.map((careType, index) => (
                  <div key={careType.type} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{careType.type}</p>
                        <p className="text-sm text-slate-600">{careType.count} jobs posted</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(careType.revenue)}</p>
                      <p className="text-sm text-slate-600">Est. revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</p>
                  <p className="text-sm text-slate-600 mt-2">All-time platform revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Platform Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{formatCurrency(metrics.platformFees)}</p>
                  <p className="text-sm text-slate-600 mt-2">15% platform commission</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Nurse Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">{formatCurrency(metrics.nurseEarnings)}</p>
                  <p className="text-sm text-slate-600 mt-2">Total paid to nurses</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Month-over-month performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Monthly Growth</p>
                      <p className="text-sm text-green-600">Revenue increase</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {getGrowthIcon(metrics.monthlyGrowth.revenue)}
                        <span className={`text-2xl font-bold ml-1 ${getGrowthColor(metrics.monthlyGrowth.revenue)}`}>
                          {metrics.monthlyGrowth.revenue > 0 ? '+' : ''}{metrics.monthlyGrowth.revenue.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Transaction Volume</p>
                      <p className="text-sm text-blue-600">Monthly transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">{metrics.monthlyGrowth.transactions > 0 ? '+' : ''}{metrics.monthlyGrowth.transactions}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Key financial indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Average Transaction Value</span>
                    <span className="font-semibold">{formatCurrency(derivedMetrics.avgTransactionValue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Revenue per User</span>
                    <span className="font-semibold">{formatCurrency(derivedMetrics.revenuePerUser)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Platform Take Rate</span>
                    <span className="font-semibold">{derivedMetrics.platformTakeRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Total Transactions</span>
                    <span className="font-semibold">{metrics.totalTransactions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{metrics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{metrics.totalNurses.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Nurses</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{metrics.totalClients.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Clients</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{metrics.monthlyGrowth.users > 0 ? '+' : ''}{metrics.monthlyGrowth.users.toFixed(1)}%</p>
                <p className="text-sm text-slate-600">Monthly Growth</p>
              </CardContent>
            </Card>
          </div>

          {/* User Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Platform user breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Healthcare Professionals</p>
                        <p className="text-sm text-green-600">{metrics.totalNurses} registered nurses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">{((metrics.totalNurses / metrics.totalUsers) * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Care Seekers</p>
                        <p className="text-sm text-blue-600">{metrics.totalClients} active clients</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">{((metrics.totalClients / metrics.totalUsers) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Platform activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Active Contracts</span>
                    <span className="font-semibold">{metrics.activeContracts}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Completed Contracts</span>
                    <span className="font-semibold">{metrics.completedContracts}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Nurse Utilization</span>
                    <span className="font-semibold">{derivedMetrics.nurseUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Conversion Rate</span>
                    <span className="font-semibold">{derivedMetrics.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Platform Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">99.9%</p>
                <p className="text-sm text-slate-600">Uptime</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">124ms</p>
                <p className="text-sm text-slate-600">Avg Response</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">100%</p>
                <p className="text-sm text-slate-600">Payment Success</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">4.8</p>
                <p className="text-sm text-slate-600">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">System Uptime</span>
                    <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">API Performance</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Payment Processing</span>
                    <Badge className="bg-green-100 text-green-800">100% Success</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Active Disputes</span>
                    <Badge className={metrics.disputedTimecards > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                      {metrics.disputedTimecards}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Business metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Pending Approvals</span>
                    <Badge className={metrics.pendingApprovals > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                      {metrics.pendingApprovals}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Growth Rate</span>
                    <Badge className={getGrowthColor(metrics.monthlyGrowth.users).replace('text-', 'bg-').replace('600', '100') + ' ' + getGrowthColor(metrics.monthlyGrowth.users).replace('600', '800')}>
                      {metrics.monthlyGrowth.users > 0 ? '+' : ''}{metrics.monthlyGrowth.users.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Platform Efficiency</span>
                    <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">User Satisfaction</span>
                    <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


        </TabsContent>
      </Tabs>
    </div>
  );
}