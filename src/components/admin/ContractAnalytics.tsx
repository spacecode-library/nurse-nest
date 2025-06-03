// components/admin/ContractAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Timer,
  Target
} from 'lucide-react';
import { getContractStats } from '@/supabase/api/contractService';
import { supabase } from '@/integrations/supabase/client';

interface ContractMetrics {
  totalContracts: number;
  pendingContracts: number;
  activeContracts: number;
  completedContracts: number;
  avgAcceptanceTime: number; // hours
  avgContractDuration: number; // days
  successRate: number; // percentage
  totalValue: number; // estimated contract value
  monthlyGrowth: number; // percentage
}

interface CareTypeMetrics {
  careType: string;
  contractCount: number;
  avgDuration: number;
  avgRate: number;
  successRate: number;
}

interface TimeSeriesData {
  month: string;
  created: number;
  completed: number;
  value: number;
}

export default function ContractAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [metrics, setMetrics] = useState<ContractMetrics>({
    totalContracts: 0,
    pendingContracts: 0,
    activeContracts: 0,
    completedContracts: 0,
    avgAcceptanceTime: 0,
    avgContractDuration: 0,
    successRate: 0,
    totalValue: 0,
    monthlyGrowth: 0
  });
  const [careTypeMetrics, setCareTypeMetrics] = useState<CareTypeMetrics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load basic contract stats
      const { stats: contractStats } = await getContractStats();
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '1month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Load detailed contract data
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          *,
          nurse_profiles(id, first_name, last_name),
          client_profiles(id, first_name, last_name),
          job_postings(id, job_code, care_type, duration, benefits)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      // Calculate metrics
      const totalContracts = contracts?.length || 0;
      const pendingContracts = contracts?.filter(c => c.status === 'pending').length || 0;
      const activeContracts = contracts?.filter(c => c.status === 'active').length || 0;
      const completedContracts = contracts?.filter(c => c.status === 'completed').length || 0;

      // Calculate average acceptance time (pending to active)
      const acceptedContracts = contracts?.filter(c => c.status === 'active' || c.status === 'completed') || [];
      const avgAcceptanceTime = acceptedContracts.length > 0 
        ? acceptedContracts.reduce((sum, contract) => {
            const created = new Date(contract.created_at);
            const updated = new Date(contract.updated_at);
            return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
          }, 0) / acceptedContracts.length
        : 0;

      // Calculate success rate (accepted / total created)
      const successRate = totalContracts > 0 ? (acceptedContracts.length / totalContracts) * 100 : 0;

      // Calculate care type metrics
      const careTypes = [...new Set(contracts?.map(c => c.job_postings?.care_type).filter(Boolean))];
      const careTypeStats = careTypes.map(careType => {
        const typeContracts = contracts?.filter(c => c.job_postings?.care_type === careType) || [];
        const typeSuccess = typeContracts.filter(c => c.status === 'active' || c.status === 'completed').length;
        
        return {
          careType,
          contractCount: typeContracts.length,
          avgDuration: 30, // Placeholder - would calculate from actual data
          avgRate: 50, // Placeholder - would calculate from job posting rates
          successRate: typeContracts.length > 0 ? (typeSuccess / typeContracts.length) * 100 : 0
        };
      });

      // Calculate time series data
      const months = [];
      const current = new Date(startDate);
      while (current <= endDate) {
        const monthKey = current.toISOString().slice(0, 7);
        const monthContracts = contracts?.filter(c => 
          c.created_at.startsWith(monthKey)
        ) || [];
        const monthCompleted = contracts?.filter(c => 
          c.updated_at?.startsWith(monthKey) && c.status === 'completed'
        ) || [];

        months.push({
          month: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          created: monthContracts.length,
          completed: monthCompleted.length,
          value: monthContracts.length * 1000 // Estimated value placeholder
        });

        current.setMonth(current.getMonth() + 1);
      }

      // Calculate monthly growth
      const currentMonth = months[months.length - 1]?.created || 0;
      const previousMonth = months[months.length - 2]?.created || 0;
      const monthlyGrowth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

      // Load top performers (most completed contracts)
      const { data: topNurses } = await supabase
        .from('contracts')
        .select(`
          nurse_id,
          nurse_profiles(first_name, last_name),
          job_postings(care_type)
        `)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      const nurseStats = (topNurses || []).reduce((acc, contract) => {
        const nurseId = contract.nurse_id;
        if (!acc[nurseId]) {
          acc[nurseId] = {
            id: nurseId,
            name: `${contract.nurse_profiles?.first_name} ${contract.nurse_profiles?.last_name}`,
            completedContracts: 0,
            careTypes: new Set()
          };
        }
        acc[nurseId].completedContracts++;
        if (contract.job_postings?.care_type) {
          acc[nurseId].careTypes.add(contract.job_postings.care_type);
        }
        return acc;
      }, {} as any);

      const topPerformersList = Object.values(nurseStats)
        .sort((a: any, b: any) => b.completedContracts - a.completedContracts)
        .slice(0, 10)
        .map((nurse: any) => ({
          ...nurse,
          careTypes: Array.from(nurse.careTypes)
        }));

      setMetrics({
        totalContracts,
        pendingContracts,
        activeContracts,
        completedContracts,
        avgAcceptanceTime: Math.round(avgAcceptanceTime),
        avgContractDuration: 30, // Placeholder
        successRate: Math.round(successRate),
        totalValue: totalContracts * 1000, // Placeholder
        monthlyGrowth: Math.round(monthlyGrowth)
      });

      setCareTypeMetrics(careTypeStats);
      setTimeSeriesData(months);
      setTopPerformers(topPerformersList);

    } catch (error) {
      console.error('Error loading contract analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading contract analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contract Analytics</h2>
          <p className="text-gray-600">Monitor contract performance and trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
                <p className="text-3xl font-bold">{metrics.totalContracts}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-4 w-4 mr-1 ${getGrowthColor(metrics.monthlyGrowth)}`} />
                  <span className={`text-sm ${getGrowthColor(metrics.monthlyGrowth)}`}>
                    {metrics.monthlyGrowth > 0 ? '+' : ''}{metrics.monthlyGrowth}% this month
                  </span>
                </div>
              </div>
              <FileText className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold">{metrics.successRate}%</p>
                <Badge className={getSuccessRateColor(metrics.successRate)}>
                  {metrics.successRate >= 80 ? 'Excellent' : metrics.successRate >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
              <Target className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Acceptance Time</p>
                <p className="text-3xl font-bold">{metrics.avgAcceptanceTime}h</p>
                <p className="text-sm text-gray-500">Time to nurse acceptance</p>
              </div>
              <Timer className="h-12 w-12 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Contracts</p>
                <p className="text-3xl font-bold">{metrics.activeContracts}</p>
                <p className="text-sm text-gray-500">Currently in progress</p>
              </div>
              <Activity className="h-12 w-12 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              Pending Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-600">{metrics.pendingContracts}</p>
              <p className="text-sm text-gray-600">Awaiting nurse acceptance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{metrics.activeContracts}</p>
              <p className="text-sm text-gray-600">Currently active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-500" />
              Completed Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{metrics.completedContracts}</p>
              <p className="text-sm text-gray-600">Successfully completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="care-types" className="space-y-6">
        <TabsList>
          <TabsTrigger value="care-types">Care Type Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="care-types">
          <Card>
            <CardHeader>
              <CardTitle>Contract Performance by Care Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careTypeMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{metric.careType}</h4>
                      <Badge className={getSuccessRateColor(metric.successRate)}>
                        {Math.round(metric.successRate)}% success
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Contracts</p>
                        <p className="font-semibold">{metric.contractCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Duration</p>
                        <p className="font-semibold">{metric.avgDuration} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Rate</p>
                        <p className="font-semibold">${metric.avgRate}/hr</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Contract Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple chart representation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contracts Created</h4>
                    <div className="space-y-2">
                      {timeSeriesData.slice(-6).map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{month.month}</span>
                          <div className="flex items-center">
                            <div 
                              className="bg-blue-500 h-2 mr-2 rounded"
                              style={{ width: `${(month.created / Math.max(...timeSeriesData.map(m => m.created))) * 100}px` }}
                            ></div>
                            <span className="text-sm font-semibold">{month.created}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Contracts Completed</h4>
                    <div className="space-y-2">
                      {timeSeriesData.slice(-6).map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{month.month}</span>
                          <div className="flex items-center">
                            <div 
                              className="bg-green-500 h-2 mr-2 rounded"
                              style={{ width: `${(month.completed / Math.max(...timeSeriesData.map(m => m.completed))) * 100}px` }}
                            ></div>
                            <span className="text-sm font-semibold">{month.completed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Nurses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{performer.name}</p>
                        <p className="text-sm text-gray-600">
                          Specializes in: {performer.careTypes.slice(0, 2).join(', ')}
                          {performer.careTypes.length > 2 && ` +${performer.careTypes.length - 2} more`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{performer.completedContracts}</p>
                      <p className="text-sm text-gray-600">Completed contracts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Review Pending Contracts
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              Resolve Contract Issues
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Analytics Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}