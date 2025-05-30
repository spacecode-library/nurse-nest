// src/supabase/api/stripeConnectService.ts
import Stripe from 'stripe';
import { supabase } from '@/integrations/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Create Express account for nurse
 */
export async function createNurseStripeAccount(nurseId: string, email: string) {
  try {
    // Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly', // Weekly payouts to nurses
            weekly_anchor: 'friday',
          },
        },
      },
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/nurse/stripe-refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/nurse/stripe-success`,
      type: 'account_onboarding',
    });

    // Update nurse profile
    const { error } = await supabase
      .from('nurse_profiles')
      .update({
        stripe_account_id: account.id,
        stripe_account_status: 'onboarding',
        stripe_onboarding_url: accountLink.url,
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
 * Check account status and update database
 */
export async function updateNurseStripeStatus(nurseId: string, accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    
    let status = 'onboarding';
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active';
    } else if (!account.details_submitted) {
      status = 'not_submitted';
    } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
      status = 'requirements_due';
    }

    const { error } = await supabase
      .from('nurse_profiles')
      .update({
        stripe_account_status: status,
      })
      .eq('id', nurseId);

    if (error) throw error;

    return { status, error: null };
  } catch (error) {
    console.error('Error updating Stripe status:', error);
    return { status: 'error', error: error as Error };
  }
}

/**
 * Calculate payment amounts with new fee structure
 */
export function calculatePaymentAmounts(nurseHourlyRate: number, totalHours: number) {
  const nurseGrossAmount = nurseHourlyRate * totalHours;
  const nurseFee = nurseGrossAmount * 0.05; // 5% from nurse
  const nurseNetAmount = nurseGrossAmount - nurseFee;
  
  const clientFee = nurseGrossAmount * 0.10; // 10% added to client
  const clientTotalAmount = nurseGrossAmount + clientFee;
  
  const platformTotalFee = nurseFee + clientFee;

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
 * Process timecard payment with automatic split
 */
export async function processTimecardPayment(
  timecardId: string,
  nurseStripeAccountId: string,
  clientPaymentMethodId: string,
  nurseHourlyRate: number,
  totalHours: number
) {
  try {
    const amounts = calculatePaymentAmounts(nurseHourlyRate, totalHours);

    // Create payment intent with automatic transfer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amounts.clientTotalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: clientPaymentMethodId,
      confirm: true,
      application_fee_amount: Math.round(amounts.platformTotalFee * 100), // Your total fee
      transfer_data: {
        destination: nurseStripeAccountId,
        amount: Math.round(amounts.nurseNetAmount * 100), // What nurse gets
      },
      metadata: {
        timecard_id: timecardId,
        nurse_rate: nurseHourlyRate.toString(),
        total_hours: totalHours.toString(),
      },
    });

    // Update timecard with payment details
    const { error } = await supabase
      .from('timecards')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        nurse_net_amount: amounts.nurseNetAmount,
        client_total_amount: amounts.clientTotalAmount,
        platform_fee_amount: amounts.platformTotalFee,
        status: 'Paid',
        timestamp_paid: new Date().toISOString(),
      })
      .eq('id', timecardId);

    if (error) throw error;

    return {
      paymentIntent,
      amounts,
      error: null,
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      paymentIntent: null,
      amounts: null,
      error: error as Error,
    };
  }
}

/**
 * Create setup intent for client payment method
 */
export async function createClientSetupIntent(clientId: string) {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: clientId, // Stripe customer ID
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