// src/components/dashboard/client/PaymentMethodSetup.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Lock,
  RefreshCw,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  createClientStripeCustomer, 
  createClientSetupIntent, 
  getClientPaymentMethods,
  formatCurrency 
} from '@/supabase/api/stripeConnectService';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  created: number;
}

interface PaymentMethodSetupProps {
  clientId: string;
  clientEmail: string;
  clientName: string;
  onPaymentMethodAdded?: () => void;
}

// Card form component that uses Stripe Elements
const CardSetupForm = ({ 
  setupIntent, 
  onSuccess, 
  onError, 
  onCancel 
}: {
  setupIntent: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setCardError(null);

    try {
      // Confirm the setup intent with the card element using confirmCardSetup
      const result = await stripe.confirmCardSetup(setupIntent, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
            // name: 'Customer Name',
            // email: 'customer@example.com',
          },
        },
      });

      // Check for error first
      if (result.error) {
        // Show error to customer (e.g., insufficient funds)
        setCardError(result.error.message || 'An error occurred while setting up your payment method.');
        onError(result.error.message || 'Setup failed');
        return;
      }

      // Check if we have a setupIntent (success case)
      if ('setupIntent' in result && result.setupIntent) {
        // The setup has succeeded
        console.log('Setup succeeded:', result.setupIntent);
        onSuccess();
        return;
      }

      // Unexpected state
      onError('Setup completed but status is unclear. Please refresh and check your payment methods.');
    } catch (err) {
      console.error('Error confirming setup:', err);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{cardError}</span>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start">
          <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm text-green-800">
              <strong>Secure:</strong> Your card information is encrypted and processed securely by Stripe. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !cardComplete || loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Add Payment Method
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function PaymentMethodSetup({ 
  clientId, 
  clientEmail, 
  clientName,
  onPaymentMethodAdded 
}: PaymentMethodSetupProps) {
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [setupIntent, setSetupIntent] = useState<string | null>(null);

  useEffect(() => {
    initializeCustomerAndPaymentMethods();
  }, [clientId]);

  const initializeCustomerAndPaymentMethods = async () => {
    try {
      setLoading(true);
      
      // Create or get existing Stripe customer
      const { customerId: stripeCustomerId, error: customerError } = 
        await createClientStripeCustomer(clientId, clientEmail, clientName);
      
      if (customerError) {
        throw customerError;
      }
      
      setCustomerId(stripeCustomerId);
      
      // Load existing payment methods
      if (stripeCustomerId) {
        await loadPaymentMethods(stripeCustomerId);
      }
    } catch (error) {
      console.error('Error initializing payment setup:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize payment setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async (stripeCustomerId: string) => {
    try {
      const { paymentMethods: methods, error } = await getClientPaymentMethods(stripeCustomerId);
      
      if (error) {
        throw error;
      }
      
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load payment methods.",
        variant: "destructive"
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!customerId) return;
    
    try {
      setSetupLoading(true);
      
      // Create setup intent
      const { clientSecret, error } = await createClientSetupIntent(customerId);
      
      if (error || !clientSecret) {
        throw error || new Error('Failed to create setup intent');
      }
      
      setSetupIntent(clientSecret);
      setShowAddModal(true);
    } catch (error) {
      console.error('Error creating setup intent:', error);
      toast({
        title: "Setup Error",
        description: "Failed to start payment method setup.",
        variant: "destructive"
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleSetupSuccess = async () => {
    try {
      // Reload payment methods
      if (customerId) {
        await loadPaymentMethods(customerId);
      }
      
      setShowAddModal(false);
      setSetupIntent(null);
      
      toast({
        title: "✅ Payment Method Added!",
        description: "Your payment method has been successfully added and is ready for use.",
        duration: 5000,
      });
      
      onPaymentMethodAdded?.();
    } catch (error) {
      console.error('Error reloading payment methods:', error);
      toast({
        title: "Warning",
        description: "Payment method added but failed to refresh list. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const handleSetupError = (errorMessage: string) => {
    toast({
      title: "Setup Failed",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      case 'discover': return '💳';
      default: return '💳';
    }
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const PaymentMethodCard = ({ method, isDefault = false }: { method: PaymentMethod; isDefault?: boolean }) => (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${
      isDefault 
        ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
            {getCardBrandIcon(method.card?.brand || 'card')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">
                {formatCardBrand(method.card?.brand || 'Card')} •••• {method.card?.last4}
              </p>
              {isDefault && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Star className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Expires {method.card?.exp_month}/{method.card?.exp_year}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment setup...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 mb-1">🔒 Secure Payment Processing</p>
                <p className="text-sm text-green-800">
                  Your payment information is secured by Stripe's bank-level encryption. 
                  We never store your card details on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods List */}
          {paymentMethods.length > 0 ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Payment Methods</h3>
              {paymentMethods.map((method, index) => (
                <PaymentMethodCard 
                  key={method.id} 
                  method={method} 
                  isDefault={index === 0} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Payment Methods Added
              </h3>
              <p className="text-gray-600 mb-4">
                Add a payment method to enable automatic timecard payments
              </p>
            </div>
          )}

          {/* Add Payment Method Button */}
          <Button
            onClick={handleAddPaymentMethod}
            disabled={setupLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg h-12"
          >
            {setupLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </>
            )}
          </Button>

          {/* Payment Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">💡 How Payments Work</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You approve timecards before any charges</li>
                  <li>• Payments are automatically processed when you approve</li>
                  <li>• You pay nurse rate + 10% platform fee</li>
                  <li>• Receipts are emailed after each payment</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Modal with Stripe Elements */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Add a secure payment method to enable automatic timecard payments
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {setupIntent ? (
              <Elements stripe={stripePromise}>
                <CardSetupForm
                  setupIntent={setupIntent}
                  onSuccess={handleSetupSuccess}
                  onError={handleSetupError}
                  onCancel={() => setShowAddModal(false)}
                />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600">Preparing secure form...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}