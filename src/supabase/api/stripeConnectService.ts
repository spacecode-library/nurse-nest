// src/supabase/api/stripeConnectService.ts
import Stripe from 'stripe';
import { supabase } from '@/integrations/supabase/client';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

/**
 * NURSE STRIPE ACCOUNT MANAGEMENT
 */

/**
 * Create Express account for nurse (based on successful test)
 */
export async function createNurseStripeAccount(nurseId: string, email: string) {
  try {
    // Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            weekly_anchor: 'friday',
          },
        },
      },
      metadata: {
        nurse_id: nurseId,
        platform: 'nurse_nest',
      },
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${import.meta.env.VITE_NEXT_PUBLIC_APP_URL}/nurse/stripe-refresh`,
      return_url: `${import.meta.env.VITE_NEXT_PUBLIC_APP_URL}/nurse/stripe-success`,
      type: 'account_onboarding',
    });

    // Update nurse profile with Stripe info
    const { error } = await supabase
      .from('nurse_profiles')
      .update({
        stripe_account_id: account.id,
        stripe_account_status: 'onboarding',
        stripe_onboarding_url: accountLink.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', nurseId);

    if (error) throw error;

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
      error: null,
    };
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    return {
      accountId: null,
      onboardingUrl: null,
      error: error as Error,
    };
  }
}

/**
 * Create new account link for existing Stripe account
 */
export async function createAccountLink(nurseId: string, accountId: string) {
  try {
    console.log('Creating account link for:', { nurseId, accountId });
    
    // Create new onboarding link for existing account
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${import.meta.env.VITE_NEXT_PUBLIC_APP_URL}/nurse/stripe-refresh`,
      return_url: `${import.meta.env.VITE_NEXT_PUBLIC_APP_URL}/nurse/stripe-success`,
      type: 'account_onboarding',
    });

    console.log('Stripe account link created:', accountLink.url);

    // Update nurse profile with new onboarding URL
    const { error } = await supabase
      .from('nurse_profiles')
      .update({
        stripe_onboarding_url: accountLink.url,
        stripe_account_status: 'onboarding',
        updated_at: new Date().toISOString(),
      })
      .eq('id', nurseId);

    if (error) {
      console.error('Error updating nurse profile:', error);
      throw error;
    }

    console.log('Nurse profile updated with new onboarding URL');

    return {
      onboardingUrl: accountLink.url,
      error: null,
    };
  } catch (error) {
    console.error('Error creating account link:', error);
    return {
      onboardingUrl: null,
      error: error as Error,
    };
  }
}

/**
 * Check and update nurse Stripe account status with full sync
 */
export async function updateNurseStripeStatus(nurseId: string, accountId: string) {
  try {
    console.log('Updating nurse Stripe status for:', { nurseId, accountId });
    
    const account = await stripe.accounts.retrieve(accountId);
    
    console.log('Retrieved Stripe account:', {
      id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      currently_due: account.requirements?.currently_due?.length || 0
    });
    
    let status = 'onboarding';
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active';
    } else if (!account.details_submitted) {
      status = 'not_submitted';
    } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
      status = 'requirements_due';
    }

    // Prepare update data with all Stripe fields
    const updateData: any = {
      stripe_account_status: status,
      stripe_charges_enabled: account.charges_enabled,
      stripe_payouts_enabled: account.payouts_enabled,
      updated_at: new Date().toISOString(),
    };

    // Set onboarding completion timestamp when account becomes active
    if (account.charges_enabled && account.payouts_enabled) {
      updateData.stripe_onboarding_completed_at = new Date().toISOString();
      console.log('Account is fully active, setting onboarding completion timestamp');
    }

    // Update requirements due (convert to array of strings)
    if (account.requirements?.currently_due) {
      updateData.stripe_requirements_due = account.requirements.currently_due;
    } else {
      updateData.stripe_requirements_due = [];
    }

    console.log('Updating nurse profile with:', updateData);

    // Update nurse profile with all current Stripe data
    const { error } = await supabase
      .from('nurse_profiles')
      .update(updateData)
      .eq('id', nurseId);

    if (error) {
      console.error('Error updating nurse profile:', error);
      throw error;
    }

    console.log('Successfully updated nurse profile with Stripe status:', status);

    return { 
      status, 
      accountData: {
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        onboarding_completed: account.charges_enabled && account.payouts_enabled
      },
      error: null 
    };
  } catch (error) {
    console.error('Error updating Stripe status:', error);
    return { status: 'error', error: error as Error };
  }
}

/**
 * CLIENT PAYMENT METHOD MANAGEMENT
 */

/**
 * Create or retrieve Stripe customer for client
 */
export async function createClientStripeCustomer(clientId: string, email: string, name: string) {
  try {
    // Check if client already has a Stripe customer ID
    const { data: clientProfile } = await supabase
      .from('client_profiles')
      .select('stripe_customer_id')
      .eq('id', clientId)
      .single();

    if (clientProfile?.stripe_customer_id) {
      return {
        customerId: clientProfile.stripe_customer_id,
        error: null,
      };
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        client_id: clientId,
        platform: 'nurse_nest',
      },
    });

    // Update client profile with customer ID
    const { error } = await supabase
      .from('client_profiles')
      .update({
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId);

    if (error) throw error;

    return {
      customerId: customer.id,
      error: null,
    };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return {
      customerId: null,
      error: error as Error,
    };
  }
}

/**
 * Create setup intent for client payment method
 */
export async function createClientSetupIntent(customerId: string) {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });

    return {
      clientSecret: setupIntent.client_secret,
      error: null,
    };
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return {
      clientSecret: null,
      error: error as Error,
    };
  }
}

/**
 * Get client's saved payment methods
 */
export async function getClientPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return {
      paymentMethods: paymentMethods.data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      paymentMethods: [],
      error: error as Error,
    };
  }
}

/**
 * PAYMENT PROCESSING
 */

/**
 * Calculate payment amounts with new fee structure
 */
export function calculatePaymentAmounts(nurseHourlyRate: number, totalHours: number) {
  const nurseGrossAmount = nurseHourlyRate * totalHours;
  const nurseFee = nurseGrossAmount * 0.05; // 5% from nurse
  const nurseNetAmount = nurseGrossAmount - nurseFee;
  
  const clientFee = nurseGrossAmount * 0.10; // 10% added to client
  const clientTotalAmount = nurseGrossAmount + clientFee;
  
  const platformTotalFee = nurseFee + clientFee; // Total 15%

  return {
    nurseGrossAmount: Math.round(nurseGrossAmount * 100) / 100,
    nurseNetAmount: Math.round(nurseNetAmount * 100) / 100,
    nurseFee: Math.round(nurseFee * 100) / 100,
    clientTotalAmount: Math.round(clientTotalAmount * 100) / 100,
    clientFee: Math.round(clientFee * 100) / 100,
    platformTotalFee: Math.round(platformTotalFee * 100) / 100,
  };
}

/**
 * Process timecard payment automatically when approved
 */
export async function processTimecardPayment(
  timecardId: string,
  nurseStripeAccountId: string,
  clientCustomerId: string,        // NEW: Required for Stripe
  clientPaymentMethodId: string,
  nurseHourlyRate: number,
  totalHours: number
) {
  try {
    const amounts = calculatePaymentAmounts(nurseHourlyRate, totalHours);

    // Validate minimum amount (Stripe requirement)
    if (amounts.clientTotalAmount < 0.50) {
      throw new Error(`Payment amount ($${amounts.clientTotalAmount.toFixed(2)}) is below Stripe's minimum of $0.50`);
    }

    // Verify nurse account is ready
    const account = await stripe.accounts.retrieve(nurseStripeAccountId);
    if (!account.charges_enabled || !account.payouts_enabled) {
      throw new Error('Nurse account is not ready to receive payments');
    }

    console.log('Processing payment:', {
      timecardId,
      nurseAccount: nurseStripeAccountId,
      clientCustomer: clientCustomerId,        // NEW: Log customer ID
      clientPaymentMethod: clientPaymentMethodId,
      amount: amounts.clientTotalAmount,
      rate: nurseHourlyRate,
      hours: totalHours
    });

    // Create payment intent with proper configuration including customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amounts.clientTotalAmount * 100), // Convert to cents
      currency: 'usd',
      customer: clientCustomerId,              // NEW: Include customer parameter
      payment_method: clientPaymentMethodId,
      confirm: true,
      
      // Platform fee (total 15%) - Stripe will automatically transfer the rest
      application_fee_amount: Math.round(amounts.platformTotalFee * 100),
      
      // Transfer to nurse account
      transfer_data: {
        destination: nurseStripeAccountId,
      },
      
      // Configure automatic payment methods to avoid redirect issues
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      
      // Use off_session for server-side payments
      off_session: true,
      
      metadata: {
        timecard_id: timecardId,
        nurse_rate: nurseHourlyRate.toString(),
        total_hours: totalHours.toString(),
        nurse_gross: amounts.nurseGrossAmount.toString(),
        nurse_net: amounts.nurseNetAmount.toString(),
        client_total: amounts.clientTotalAmount.toString(),
        platform_fee: amounts.platformTotalFee.toString(),
      },
    });

    console.log('Payment intent created successfully:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount
    });

    // Update timecard with payment details
    const { error: updateError } = await supabase
      .from('timecards')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        nurse_net_amount: amounts.nurseNetAmount,
        client_total_amount: amounts.clientTotalAmount,
        platform_fee_amount: amounts.platformTotalFee,
        hourly_rate_at_time: nurseHourlyRate,    // NEW: Store the rate used
        status: 'Paid',
        timestamp_paid: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', timecardId);

    if (updateError) throw updateError;

    console.log('Timecard updated successfully with payment details');

    return {
      paymentIntent,
      amounts,
      error: null,
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Payment error details:', {
        message: error.message,
        type: (error as any).type,
        code: (error as any).code,
        decline_code: (error as any).decline_code
      });
    }
    
    // Update timecard with payment failure
    await supabase
      .from('timecards')
      .update({
        payment_error: (error as Error).message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', timecardId);

    return {
      paymentIntent: null,
      amounts: null,
      error: error as Error,
    };
  }
}

/**
 * Retry failed payment
 */
export async function retryTimecardPayment(timecardId: string) {
  try {
    // Get timecard details with nurse and client info
    const { data: timecard, error: timecardError } = await supabase
      .from('timecards')
      .select(`
        *,
        nurse_profiles!inner(stripe_account_id),
        client_profiles!inner(stripe_customer_id)
      `)
      .eq('id', timecardId)
      .single();

    if (timecardError || !timecard) {
      throw new Error('Timecard not found');
    }

    // Get nurse's actual hourly rate from preferences
    const { data: nursePreferences, error: preferencesError } = await supabase
      .from('nurse_preferences')
      .select('desired_hourly_rate')
      .eq('nurse_id', timecard.nurse_id)
      .single();

    if (preferencesError) {
      console.warn('Error fetching nurse preferences for retry:', preferencesError);
    }

    const nurseHourlyRate = nursePreferences?.desired_hourly_rate || 50; // Fallback to $50

    // Get client's default payment method
    const { paymentMethods } = await getClientPaymentMethods(timecard.client_profiles.stripe_customer_id);
    
    if (paymentMethods.length === 0) {
      throw new Error('No payment method available for client');
    }

    // Use the default payment method (first one)
    const defaultPaymentMethod = paymentMethods[0];

    console.log('Retrying payment with:', {
      timecardId,
      nurseAccount: timecard.nurse_profiles.stripe_account_id,
      clientCustomer: timecard.client_profiles.stripe_customer_id,
      paymentMethod: defaultPaymentMethod.id,
      nurseHourlyRate,
      totalHours: timecard.total_hours
    });

    // Retry payment with updated signature and actual nurse rate
    return await processTimecardPayment(
      timecardId,
      timecard.nurse_profiles.stripe_account_id,
      timecard.client_profiles.stripe_customer_id,  // NEW: clientCustomerId parameter
      defaultPaymentMethod.id,
      nurseHourlyRate, // Use actual nurse rate instead of hardcoded 50
      timecard.total_hours
    );
  } catch (error) {
    console.error('Error retrying payment:', error);
    return {
      paymentIntent: null,
      amounts: null,
      error: error as Error,
    };
  }
}

/**
 * Check if nurse is ready to receive payments
 */
export async function isNurseReadyForPayments(nurseId: string): Promise<{ ready: boolean; reason?: string }> {
  try {
    const { data: nurseProfile, error } = await supabase
      .from('nurse_profiles')
      .select('stripe_account_id, stripe_account_status, stripe_charges_enabled, stripe_payouts_enabled')
      .eq('id', nurseId)
      .single();

    if (error) {
      console.error('Error fetching nurse profile:', error);
      return { ready: false, reason: 'Unable to verify nurse payment setup' };
    }

    if (!nurseProfile.stripe_account_id) {
      return { ready: false, reason: 'No payment account found' };
    }

    if (nurseProfile.stripe_account_status !== 'active') {
      return { ready: false, reason: 'Payment account not active' };
    }

    if (!nurseProfile.stripe_charges_enabled || !nurseProfile.stripe_payouts_enabled) {
      return { ready: false, reason: 'Payment account not fully enabled' };
    }

    return { ready: true };
  } catch (error) {
    console.error('Error checking nurse payment readiness:', error);
    return { ready: false, reason: 'Error checking payment setup' };
  }
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Get payment status display info
 */
export function getPaymentStatusInfo(status: string) {
  switch (status) {
    case 'succeeded':
      return { color: 'green', text: 'Payment Successful', icon: '✅' };
    case 'processing':
      return { color: 'blue', text: 'Processing Payment', icon: '⏳' };
    case 'requires_payment_method':
      return { color: 'orange', text: 'Payment Method Required', icon: '💳' };
    case 'requires_confirmation':
      return { color: 'orange', text: 'Confirmation Required', icon: '❓' };
    case 'canceled':
      return { color: 'red', text: 'Payment Canceled', icon: '❌' };
    case 'requires_action':
      return { color: 'orange', text: 'Action Required', icon: '⚠️' };
    default:
      return { color: 'gray', text: 'Unknown Status', icon: '❓' };
  }
}