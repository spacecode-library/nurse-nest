// src/components/dashboard/client/PaymentHistoryCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Download, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Filter,
  Search,
  Receipt,
  Clock,
  User,
  RefreshCw,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientTimecards } from '@/supabase/api/timecardService';
import { formatCurrency } from '@/supabase/api/stripeConnectService';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime 
} from '@/lib/dateFormatting';

interface PaymentRecord {
  id: string;
  timecard_id: string;
  amount: number;
  fee: number;
  total: number;
  status: string;
  created_at: string;
  nurse_name: string;
  job_code: string;
  hours: number;
  shift_date: string;
  stripe_payment_intent_id?: string;
}

interface PaymentHistoryCardProps {
  clientId: string;
}

export default function PaymentHistoryCard({ clientId }: PaymentHistoryCardProps) {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalStats, setTotalStats] = useState({
    totalSpent: 0,
    totalHours: 0,
    averageHourlyRate: 0,
    thisMonth: 0,
    lastMonth: 0
  });

  useEffect(() => {
    loadPaymentHistory();
  }, [clientId]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, dateFilter, statusFilter]);

  useEffect(() => {
    calculateStats();
  }, [payments]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Get all timecards with payment information
      const { data: timecards, error } = await getClientTimecards(clientId, 1000, 0);
      
      if (error) throw error;
      
      // Transform timecard data to payment records
      const paymentRecords: PaymentRecord[] = (timecards || [])
        .filter(tc => tc.status === 'Paid' && tc.client_total_amount)
        .map(tc => ({
          id: tc.id,
          timecard_id: tc.id,
          amount: tc.nurse_net_amount || 0,
          fee: tc.platform_fee_amount || 0,
          total: tc.client_total_amount || 0,
          status: 'paid',
          created_at: tc.timestamp_paid || tc.updated_at,
          nurse_name: `${tc.nurse_profiles.first_name} ${tc.nurse_profiles.last_name}`,
          job_code: tc.job_code,
          hours: tc.total_hours,
          shift_date: tc.shift_date,
          stripe_payment_intent_id: tc.stripe_payment_intent_id
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPayments(paymentRecords);
      
    } catch (error: any) {
      console.error('Error loading payment history:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.nurse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.job_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date(now);
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(payment => 
        new Date(payment.created_at) >= filterDate
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  };

  const calculateStats = () => {
    const totalSpent = payments.reduce((sum, p) => sum + p.total, 0);
    const totalHours = payments.reduce((sum, p) => sum + p.hours, 0);
    const averageHourlyRate = totalHours > 0 ? totalSpent / totalHours : 0;
    
    const now = new Date();
    const thisMonth = payments
      .filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.total, 0);
    
    const lastMonth = payments
      .filter(p => {
        const paymentDate = new Date(p.created_at);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
        return paymentDate.getMonth() === lastMonthDate.getMonth() && 
               paymentDate.getFullYear() === lastMonthDate.getFullYear();
      })
      .reduce((sum, p) => sum + p.total, 0);
    
    setTotalStats({
      totalSpent,
      totalHours,
      averageHourlyRate,
      thisMonth,
      lastMonth
    });
  };

  const downloadReceipt = async (payment: PaymentRecord) => {
    try {
      // Create a simple receipt
      const receiptData = {
        paymentId: payment.stripe_payment_intent_id || payment.id,
        date: formatPremiumDate(payment.created_at),
        nurseName: payment.nurse_name,
        jobCode: payment.job_code,
        shiftDate: formatPremiumDate(payment.shift_date),
        hours: payment.hours,
        nurseEarnings: payment.amount,
        platformFee: payment.fee,
        total: payment.total
      };
      
      // Convert to downloadable format (simplified)
      const content = `
NURSE NEST PAYMENT RECEIPT
========================

Payment ID: ${receiptData.paymentId}
Date: ${receiptData.date}

SERVICES PROVIDED
Nurse: ${receiptData.nurseName}
Job Code: ${receiptData.jobCode}
Shift Date: ${receiptData.shiftDate}
Hours Worked: ${receiptData.hours}

PAYMENT BREAKDOWN
Nurse Earnings: ${formatCurrency(receiptData.nurseEarnings)}
Platform Fee: ${formatCurrency(receiptData.platformFee)}
Total Charged: ${formatCurrency(receiptData.total)}

Thank you for using Nurse Nest!
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nurse-nest-receipt-${payment.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Receipt Downloaded",
        description: "Payment receipt saved to your downloads",
      });
      
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download receipt",
        variant: "destructive"
      });
    }
  };

  const PaymentCard = ({ payment }: { payment: PaymentRecord }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{payment.nurse_name}</h4>
              <p className="text-sm text-gray-600">{payment.job_code}</p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(payment.created_at)} • {payment.hours}h shift
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              {formatCurrency(payment.total)}
            </p>
            <p className="text-sm text-gray-600">
              Fee: {formatCurrency(payment.fee)}
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-300 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Shift: {formatShortPremiumDate(payment.shift_date)}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadReceipt(payment)}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(totalStats.totalSpent)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {totalStats.totalHours.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(totalStats.averageHourlyRate)}
              </p>
              <p className="text-sm text-gray-600">Avg Rate/Hour</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                {totalStats.thisMonth >= totalStats.lastMonth ? (
                  <ArrowUpRight className="h-6 w-6 text-white" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 text-white" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(totalStats.thisMonth)}
              </p>
              <p className="text-sm text-gray-600">This Month</p>
              {totalStats.lastMonth > 0 && (
                <p className="text-xs text-gray-500">
                  {totalStats.thisMonth >= totalStats.lastMonth ? '+' : ''}
                  {(((totalStats.thisMonth - totalStats.lastMonth) / totalStats.lastMonth) * 100).toFixed(1)}% vs last month
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Payment History</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={loadPaymentHistory}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by nurse name or job code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>

          {/* Payment List */}
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {payments.length === 0 ? 'No Payments Yet' : 'No Results Found'}
              </h3>
              <p className="text-gray-600">
                {payments.length === 0 
                  ? 'Your payment history will appear here after timecards are approved and paid.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}