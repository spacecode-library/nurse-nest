// src/components/dashboard/client/EnhancedInvoiceApprovalCard.tsx - UPDATED TERMINOLOGY
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Timer,
  User,
  AlertCircle,
  DollarSign,
  Eye,
  Bell,
  Coffee,
  Moon,
  Sun,
  Zap,
  CreditCard,
  Shield,
  RefreshCw,
  Loader2,
  Download,
  Receipt,
  FileText,
  Building2,
  ClipboardCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientTimecards, approveTimecard, rejectTimecard } from '@/supabase/api/timecardService';
import { 
  calculatePaymentAmounts, 
  processTimecardPayment, 
  getClientPaymentMethods,
  formatCurrency 
} from '@/supabase/api/stripeConnectService';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime,
  formatTimeOnly
} from '@/lib/dateFormatting';
import { supabase } from '@/integrations/supabase/client';

interface Invoice {
  updated_at: string;
  id: string;
  job_code: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  rounded_start_time: string;
  rounded_end_time: string;
  break_minutes: number;
  total_hours: number;
  status: string;
  is_overnight: boolean;
  notes?: string;
  timestamp_submitted: string;
  timestamp_paid?: string;
  approval_deadline: string;
  nurse_hourly_rate: number;
  nurse_net_amount?: number;
  client_total_amount?: number;
  platform_fee_amount?: number;
  stripe_payment_intent_id?: string;
  nurse_profiles: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    stripe_account_id?: string;
    stripe_account_status?: string;
    stripe_charges_enabled?: boolean;
    stripe_payouts_enabled?: boolean;
    stripe_onboarding_completed_at?: string;
  };
  client_profiles: {
    stripe_customer_id?: string;
  };
}

interface EnhancedInvoiceApprovalProps {
  clientId: string;
  onInvoiceAction: () => void;
}

export default function EnhancedInvoiceApprovalCard({ 
  clientId, 
  onInvoiceAction 
}: EnhancedInvoiceApprovalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    loadInvoices();
    loadPaymentMethods();
    loadClientProfile();
  }, [clientId]);

  const loadClientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (error) throw error;
      setClientProfile(data);
    } catch (error) {
      console.error('Error loading client profile:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data: invoicesData, error } = await getClientTimecards(clientId, 100, 0);
      if (error) throw error;
      setInvoices(invoicesData || []);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('stripe_customer_id')
        .eq('id', clientId)
        .single();

      if (clientProfile?.stripe_customer_id) {
        const { paymentMethods: methods } = await getClientPaymentMethods(clientProfile.stripe_customer_id);
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  // Enhanced receipt generation function
  const generateAndDownloadReceipt = async (invoice: Invoice) => {
    try {
      if (invoice.status !== 'Paid' || !invoice.client_total_amount) {
        toast({
          title: "Receipt Not Available",
          description: "Receipt is only available for paid invoices",
          variant: "destructive"
        });
        return;
      }

      const receiptData = {
        // Company Information
        companyName: 'Nurse Nest',
        companyAddress: '123 Healthcare Ave, Medical City, MC 12345',
        companyPhone: '(555) 123-CARE',
        companyEmail: 'support@nursenest.com',
        companyWebsite: 'www.nursenest.com',
        
        // Receipt Information
        receiptNumber: invoice.stripe_payment_intent_id || `NN-${invoice.id.substring(0, 8).toUpperCase()}`,
        paymentDate: formatPremiumDate(invoice.timestamp_paid || invoice.updated_at),
        
        // Client Information
        clientName: clientProfile ? `${clientProfile.first_name} ${clientProfile.last_name}` : 'Client',
        clientType: clientProfile?.client_type || 'Individual',
        
        // Service Information
        nurseName: `${invoice.nurse_profiles.first_name} ${invoice.nurse_profiles.last_name}`,
        jobCode: invoice.job_code,
        shiftDate: formatPremiumDate(invoice.shift_date),
        shiftTime: `${invoice.rounded_start_time} - ${invoice.rounded_end_time}`,
        isOvernight: invoice.is_overnight,
        totalHours: invoice.total_hours,
        breakMinutes: invoice.break_minutes,
        
        // Payment Breakdown
        hourlyRate: invoice.nurse_hourly_rate,
        nurseEarnings: invoice.nurse_net_amount || 0,
        platformFee: invoice.platform_fee_amount || 0,
        totalAmount: invoice.client_total_amount || 0,
        
        // Additional Information
        notes: invoice.notes,
        submittedDate: formatPremiumDate(invoice.timestamp_submitted),
        paymentMethod: 'Credit Card (Stripe)',
      };

      // Create professional receipt content
      const receiptContent = `
════════════════════════════════════════════════════════════════
                           ${receiptData.companyName}
              Professional Healthcare Staffing Platform
════════════════════════════════════════════════════════════════

${receiptData.companyAddress}
Phone: ${receiptData.companyPhone} | Email: ${receiptData.companyEmail}
Website: ${receiptData.companyWebsite}

────────────────────────────────────────────────────────────────
                           PAYMENT RECEIPT
────────────────────────────────────────────────────────────────

Receipt #: ${receiptData.receiptNumber}
Payment Date: ${receiptData.paymentDate}

BILLING INFORMATION:
Client: ${receiptData.clientName}
Account Type: ${receiptData.clientType}

SERVICE DETAILS:
────────────────────────────────────────────────────────────────
Professional Nurse: ${receiptData.nurseName}
Job Code: ${receiptData.jobCode}
Service Date: ${receiptData.shiftDate}
Shift Time: ${receiptData.shiftTime}${receiptData.isOvernight ? ' (Overnight Shift)' : ''}
Total Hours Worked: ${receiptData.totalHours} hours
Break Time: ${receiptData.breakMinutes} minutes
Hourly Rate: ${formatCurrency(receiptData.hourlyRate)}/hour

${receiptData.notes ? `
Service Notes:
"${receiptData.notes}"
` : ''}

PAYMENT BREAKDOWN:
────────────────────────────────────────────────────────────────
Base Service Fee (${receiptData.totalHours}h × ${formatCurrency(receiptData.hourlyRate)}/hr)
                                               ${formatCurrency(receiptData.totalHours * receiptData.hourlyRate)}

Nurse Payment (85% of base fee)               ${formatCurrency(receiptData.nurseEarnings)}
Platform Service Fee (15% of base fee)        ${formatCurrency(receiptData.platformFee)}

                                    ────────────────────
TOTAL AMOUNT CHARGED                           ${formatCurrency(receiptData.totalAmount)}
                                    ════════════════════

Payment Method: ${receiptData.paymentMethod}
Payment Status: PAID ✓
Transaction ID: ${receiptData.receiptNumber}

ADMINISTRATIVE DETAILS:
────────────────────────────────────────────────────────────────
Invoice Submitted: ${receiptData.submittedDate}
Payment Processed: ${receiptData.paymentDate}
Service Category: Healthcare Staffing
Tax Classification: Professional Services

PLATFORM SERVICES INCLUDED:
• Licensed nurse verification and background checks
• HIPAA-compliant communication platform
• 24/7 customer support and dispute resolution
• Secure payment processing and insurance coverage
• Professional liability and regulatory compliance

────────────────────────────────────────────────────────────────
Thank you for choosing ${receiptData.companyName} for your healthcare staffing needs.

For questions about this receipt, please contact our support team:
Email: ${receiptData.companyEmail}
Phone: ${receiptData.companyPhone}

This receipt serves as proof of payment for healthcare services rendered.
Please retain this document for your records.
────────────────────────────────────────────────────────────────

Generated on: ${new Date().toLocaleString()}
Receipt Format: Professional Healthcare Services Receipt v2.0
      `;

      // Create and download the receipt
      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nurse-nest-receipt-${receiptData.receiptNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "📄 Receipt Downloaded Successfully!",
        description: `Receipt ${receiptData.receiptNumber} has been saved to your downloads folder`,
        duration: 5000
      });

    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Receipt Generation Failed",
        description: "Unable to generate receipt. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Enhanced function to check if nurse is ready for payments
  const isNurseReadyForPayments = (nurseProfile: Invoice['nurse_profiles']): { ready: boolean; reason: string } => {
    if (!nurseProfile.stripe_account_id) {
      return { ready: false, reason: 'No payment account found' };
    }

    if (nurseProfile.stripe_account_status !== 'active') {
      return { ready: false, reason: 'Payment account not active' };
    }

    if (!nurseProfile.stripe_charges_enabled || !nurseProfile.stripe_payouts_enabled) {
      return { ready: false, reason: 'Payment capabilities not enabled' };
    }

    return { ready: true, reason: 'Ready for payments' };
  };

  const handleApproveWithPayment = async (invoiceId: string, invoice: Invoice) => {
    if (paymentMethods.length === 0) {
      toast({
        title: "Payment Method Required",
        description: "Please add a payment method before approving invoices.",
        variant: "destructive"
      });
      return;
    }

    if (!invoice.client_profiles.stripe_customer_id) {
      toast({
        title: "Client Setup Error",
        description: "Client Stripe customer not found. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    const { ready, reason } = isNurseReadyForPayments(invoice.nurse_profiles);
    
    if (!ready) {
      toast({
        title: "Nurse Payment Setup Required",
        description: `Cannot process payment: ${reason}. The nurse must complete their payment setup first.`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    try {
      setActionLoading(true);
      setPaymentProcessing(true);

      const { error: approvalError } = await approveTimecard(invoiceId, clientId);
      if (approvalError) throw approvalError;

      const nurseRate = invoice.nurse_hourly_rate || 50;
      const amounts = calculatePaymentAmounts(nurseRate, invoice.total_hours);

      const paymentResult = await processTimecardPayment(
        invoiceId,
        invoice.nurse_profiles.stripe_account_id!,
        invoice.client_profiles.stripe_customer_id,
        paymentMethods[0].id,
        nurseRate,
        invoice.total_hours
      );

      if (paymentResult.error) {
        toast({
          title: "⚠️ Invoice Approved, Payment Processing Failed",
          description: `Invoice approved but payment failed: ${paymentResult.error.message}`,
          variant: "destructive",
          duration: 8000
        });
      } else {
        toast({
          title: "✅ Invoice Approved & Payment Processed!",
          description: (
            <div className="space-y-1">
              <p>Invoice approved and payment processed successfully</p>
              <p className="text-sm">
                💳 Charged: {formatCurrency(amounts.clientTotalAmount)} | 
                👩‍⚕️ Nurse receives: {formatCurrency(amounts.nurseNetAmount)} | 
                📊 Rate: {formatCurrency(nurseRate)}/hr
              </p>
            </div>
          ),
          duration: 6000
        });
      }

      loadInvoices();
      setSelectedInvoice(null);
      onInvoiceAction();

    } catch (error: any) {
      console.error('Error in approval/payment process:', error);
      toast({
        title: "Process Failed",
        description: error.message || "Failed to approve invoice and process payment",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleReject = async (invoiceId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this invoice",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(true);
      const { error } = await rejectTimecard(invoiceId, clientId, reason);
      if (error) throw error;

      toast({
        title: "Invoice Rejected",
        description: "The nurse has been notified of the rejection",
        duration: 4000
      });

      loadInvoices();
      setSelectedInvoice(null);
      setRejectionReason('');
      onInvoiceAction();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject invoice",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300';
      case 'Approved':
      case 'Auto-Approved':
        return 'bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      case 'Paid':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <Timer className="h-4 w-4" />;
      case 'Approved':
      case 'Auto-Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Paid': return <DollarSign className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const nurseRate = invoice.nurse_hourly_rate || 50;
    const amounts = calculatePaymentAmounts(nurseRate, invoice.total_hours);
    const { ready: nursePaymentReady, reason: nursePaymentReason } = isNurseReadyForPayments(invoice.nurse_profiles);
    
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Enhanced Profile Picture with Payment Status Indicator */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
              {invoice.nurse_profiles.profile_photo_url ? (
                <img 
                  src={invoice.nurse_profiles.profile_photo_url} 
                  alt="Nurse" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {invoice.nurse_profiles.first_name.charAt(0)}{invoice.nurse_profiles.last_name.charAt(0)}
                </div>
              )}
              {/* Payment Status Indicator */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                nursePaymentReady ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {nursePaymentReady ? (
                  <DollarSign className="h-3 w-3 text-white" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-white" />
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors">
                    {invoice.nurse_profiles.first_name} {invoice.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600 font-medium">{invoice.job_code}</p>
                  {/* Payment Status and Rate Indicator */}
                  <div className="flex items-center mt-1 space-x-2">
                    {nursePaymentReady ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Payment Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Setup Required
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                      {formatCurrency(nurseRate)}/hr
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(invoice.status)} flex items-center border shadow-sm mb-2`}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-2 font-medium">{invoice.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Payment Warning for nurses not ready */}
              {!nursePaymentReady && invoice.status === 'Submitted' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Payment Setup Required</p>
                      <p className="text-xs text-red-700">{nursePaymentReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Payment Preview */}
              {invoice.status === 'Submitted' && nursePaymentReady && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Preview - {formatCurrency(nurseRate)}/hr × {invoice.total_hours}h
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <p className="text-green-700">You Pay</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.clientTotalAmount)}</p>
                      <p className="text-xs text-green-600">Rate + 10% fee</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-700">Nurse Gets</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.nurseNetAmount)}</p>
                      <p className="text-xs text-green-600">After 5% fee</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-700">Platform Fee</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.platformTotalFee)}</p>
                      <p className="text-xs text-green-600">15% total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAID STATUS: Show Receipt Download Option */}
              {invoice.status === 'Paid' && invoice.client_total_amount && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    Payment Completed - {formatPremiumDate(invoice.timestamp_paid || invoice.updated_at)}
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                    <div className="text-center">
                      <p className="text-purple-700">Total Paid</p>
                      <p className="font-bold text-purple-900">{formatCurrency(invoice.client_total_amount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-700">Nurse Received</p>
                      <p className="font-bold text-purple-900">{formatCurrency(invoice.nurse_net_amount || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-700">Service Fee</p>
                      <p className="font-bold text-purple-900">{formatCurrency(invoice.platform_fee_amount || 0)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateAndDownloadReceipt(invoice)}
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              )}

              {/* Shift Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm bg-gray-50 rounded-lg p-3">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">Shift Date</p>
                      <p className="text-gray-600">{formatShortPremiumDate(invoice.shift_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mr-2">
                      {invoice.is_overnight ? 
                        <Moon className="h-4 w-4 text-indigo-500" /> : 
                        <Sun className="h-4 w-4 text-amber-500" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {invoice.rounded_start_time} - {invoice.rounded_end_time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.total_hours} hours
                        {invoice.break_minutes > 0 && ` (${invoice.break_minutes}min break)`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-1">Shift Notes:</p>
                  <p className="text-sm text-indigo-800 italic">"{invoice.notes}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(invoice)}
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                
                {/* PAID STATUS: Show Receipt Download Button */}
                {invoice.status === 'Paid' && invoice.client_total_amount && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateAndDownloadReceipt(invoice)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-all"
                  >
                    <Receipt className="h-4 w-4 mr-1" />
                    Download Receipt
                  </Button>
                )}
                
                {invoice.status === 'Submitted' && (
                  <>
                    {nursePaymentReady ? (
                      <Button
                        size="sm"
                        onClick={() => handleApproveWithPayment(invoice.id, invoice)}
                        disabled={actionLoading || paymentProcessing || paymentMethods.length === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md transition-all min-w-[140px]"
                      >
                        {paymentProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-1" />
                            Approve & Pay
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        className="bg-gray-300 text-gray-500 cursor-not-allowed min-w-[140px]"
                        title={`Cannot process payment: ${nursePaymentReason}`}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Setup Required
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-red-600 border-red-300 hover:bg-red-50 transition-all"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dispute
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const pendingInvoices = invoices.filter(tc => tc.status === 'Submitted');
  const approvedInvoices = invoices.filter(tc => tc.status === 'Approved' || tc.status === 'Auto-Approved');
  const paidInvoices = invoices.filter(tc => tc.status === 'Paid');
  const rejectedInvoices = invoices.filter(tc => tc.status === 'Rejected');

  // Count nurses ready for payments
  const nursesReadyForPayment = pendingInvoices.filter(tc => 
    isNurseReadyForPayments(tc.nurse_profiles).ready
  ).length;

  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
              <ClipboardCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-gray-600 font-medium">Loading invoices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Summary Card with Payment Status */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b border-indigo-100">
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              Instant Payment Center
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Payment Method Status */}
            {paymentMethods.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <p className="font-semibold text-orange-900">💳 Payment Method Required</p>
                    <p className="text-sm text-orange-700">Add a payment method to enable instant payments when approving invoices</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Timer className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-1">{pendingInvoices.length}</p>
                  <p className="text-sm font-medium text-blue-600">Pending Approval</p>
                  {pendingInvoices.length > 0 && (
                    <p className="text-xs text-blue-500 mt-1">
                      {nursesReadyForPayment} ready for instant payment
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-1">{approvedInvoices.length}</p>
                  <p className="text-sm font-medium text-green-600">Approved</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-purple-700 mb-1">{paidInvoices.length}</p>
                  <p className="text-sm font-medium text-purple-600">Paid</p>
                  {paidInvoices.length > 0 && (
                    <p className="text-xs text-purple-500 mt-1">
                      {paidInvoices.length} receipt{paidInvoices.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-red-700 mb-1">{rejectedInvoices.length}</p>
                  <p className="text-sm font-medium text-red-600">Disputed</p>
                </CardContent>
              </Card>
            </div>
            
            {nursesReadyForPayment > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-semibold text-blue-900">⚡ Instant Payment Ready</p>
                    <p className="text-sm text-blue-700">
                      {nursesReadyForPayment} invoice{nursesReadyForPayment !== 1 ? 's' : ''} ready for instant approval and payment processing!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Invoices List */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Invoice History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardCheck className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No Invoices Yet
                </h3>
                <p className="text-gray-600 text-lg">
                  When your nurses submit invoices, they will appear here for instant approval and payment.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1">
                  <TabsTrigger value="pending" className="rounded-lg font-medium">
                    Pending ({pendingInvoices.length})
                    {pendingInvoices.length > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs animate-pulse">
                        {nursesReadyForPayment} ready
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-lg font-medium">
                    Approved ({approvedInvoices.length})
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="rounded-lg font-medium">
                    Paid ({paidInvoices.length})
                    {paidInvoices.length > 0 && (
                      <Badge className="ml-2 bg-purple-600 text-white text-xs">
                        <Receipt className="h-3 w-3 mr-1" />
                        Receipts
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="rounded-lg font-medium">
                    Disputed ({rejectedInvoices.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  <div className="space-y-6">
                    {pendingInvoices.length === 0 ? (
                      <div className="text-center py-12">
                        <Timer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No pending invoices</p>
                      </div>
                    ) : (
                      pendingInvoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  <div className="space-y-6">
                    {approvedInvoices.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No approved invoices</p>
                      </div>
                    ) : (
                      approvedInvoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="paid" className="mt-6">
                  {paidInvoices.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Receipt className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="font-semibold text-purple-900">
                            {paidInvoices.length} paid invoice{paidInvoices.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Badge className="bg-purple-600 text-white">
                          <FileText className="h-3 w-3 mr-1" />
                          Receipt available for download
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    {paidInvoices.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No paid invoices</p>
                      </div>
                    ) : (
                      paidInvoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  <div className="space-y-6">
                    {rejectedInvoices.length === 0 ? (
                      <div className="text-center py-12">
                        <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No disputed invoices</p>
                      </div>
                    ) : (
                      rejectedInvoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Invoice Details Dialog WITH RECEIPT DOWNLOAD */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => {
        setSelectedInvoice(null);
        setRejectionReason('');
        }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/50">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-indigo-600" />
                Instant Payment Review
            </DialogTitle>
            <DialogDescription>
                Review invoice details and process instant payment approval
            </DialogDescription>
            </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Payment processing notice if processing */}
              {paymentProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                    <div>
                      <p className="font-semibold text-blue-900">Processing Payment...</p>
                      <p className="text-sm text-blue-700">Approving invoice and processing payment automatically</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAID INVOICE: Receipt Download Section */}
              {selectedInvoice.status === 'Paid' && selectedInvoice.client_total_amount && (
                <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg flex items-center text-purple-900">
                        <Receipt className="h-5 w-5 mr-2" />
                        Payment Completed - Receipt Available
                      </h4>
                      <Badge className="bg-purple-600 text-white">
                        <FileText className="h-3 w-3 mr-1" />
                        Professional Receipt
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-sm text-purple-700 font-medium">Total Paid</p>
                        <p className="text-lg font-bold text-purple-900">{formatCurrency(selectedInvoice.client_total_amount)}</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-sm text-purple-700 font-medium">Payment Date</p>
                        <p className="text-sm font-bold text-purple-900">
                          {formatShortPremiumDate(selectedInvoice.timestamp_paid || selectedInvoice.updated_at)}
                        </p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-sm text-purple-700 font-medium">Receipt ID</p>
                        <p className="text-xs font-mono font-bold text-purple-900">
                          {selectedInvoice.stripe_payment_intent_id 
                            ? selectedInvoice.stripe_payment_intent_id.substring(0, 12) + '...'
                            : `NN-${selectedInvoice.id.substring(0, 8).toUpperCase()}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => generateAndDownloadReceipt(selectedInvoice)}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-lg h-12"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Professional Receipt
                    </Button>
                    
                    <p className="text-xs text-purple-600 text-center mt-2">
                      Professional receipt includes all payment details, service information, and company branding
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Payment Status Section */}
              {selectedInvoice.status === 'Submitted' && (
                <Card className={`border ${isNurseReadyForPayments(selectedInvoice.nurse_profiles).ready ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Payment Status
                    </h4>
                    {isNurseReadyForPayments(selectedInvoice.nurse_profiles).ready ? (
                      <div className="text-green-800">
                        <p className="font-medium">✅ Ready for instant payment</p>
                        <p className="text-sm">This nurse can receive payments immediately upon approval</p>
                      </div>
                    ) : (
                      <div className="text-red-800">
                        <p className="font-medium">⚠️ Payment setup required</p>
                        <p className="text-sm">{isNurseReadyForPayments(selectedInvoice.nurse_profiles).reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Dispute Section for pending invoices */}
              {selectedInvoice.status === 'Submitted' && (
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                  <CardContent className="p-6">
                    <div>
                      <label className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3 block">
                        Dispute Reason (if rejecting)
                      </label>
                      <Textarea
                        placeholder="Explain why you're disputing this invoice... (e.g., incorrect hours, unauthorized break time, etc.)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInvoice(null);
                    setRejectionReason('');
                  }}
                  className="px-8 h-12"
                >
                  Close
                </Button>
                
                {/* PAID INVOICE: Additional Receipt Download Button */}
                {selectedInvoice.status === 'Paid' && selectedInvoice.client_total_amount && (
                  <Button
                    variant="outline"
                    onClick={() => generateAndDownloadReceipt(selectedInvoice)}
                    className="px-8 h-12 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Receipt className="h-5 w-5 mr-2" />
                    Download Receipt
                  </Button>
                )}
                
                {selectedInvoice.status === 'Submitted' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedInvoice.id, rejectionReason)}
                      disabled={actionLoading}
                      className="px-8 h-12 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {actionLoading ? 'Disputing...' : 'Dispute Invoice'}
                    </Button>
                    {isNurseReadyForPayments(selectedInvoice.nurse_profiles).ready ? (
                      <Button
                        onClick={() => handleApproveWithPayment(selectedInvoice.id, selectedInvoice)}
                        disabled={actionLoading || paymentProcessing || paymentMethods.length === 0}
                        className="px-8 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg min-w-[180px]"
                      >
                        {paymentProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Approve & Pay Instantly
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="px-8 h-12 bg-gray-300 text-gray-500 cursor-not-allowed min-w-[180px]"
                        title={`Cannot process payment: ${isNurseReadyForPayments(selectedInvoice.nurse_profiles).reason}`}
                      >
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Payment Setup Required
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}