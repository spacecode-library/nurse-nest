// src/supabase/api/notificationService.ts
// Notification service for background check events
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'background_check' | 'general' | 'reminder';
  action_url?: string;
  metadata?: Record<string, any>;
}

/**
 * Send notification to user about background check request
 */
export async function notifyNurseBackgroundCheckRequest(
  nurseUserId: string,
  clientName: string,
  backgroundCheckId: string
) {
  try {
    const notification: NotificationData = {
      user_id: nurseUserId,
      title: 'Background Check Request',
      message: `${clientName} has requested a background check. Please provide your information to continue.`,
      type: 'background_check',
      action_url: `/background-check-form/${backgroundCheckId}`,
      metadata: {
        backgroundCheckId,
        clientName,
        type: 'request'
      }
    };

    // Store notification in database
    const { error: dbError } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        action_url: notification.action_url,
        metadata: notification.metadata,
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Error storing notification:', dbError);
    }

    // Send email notification (if Postmark is configured)
    await sendEmailNotification(nurseUserId, notification);

    // Send SMS notification (if Twilio is configured)
    await sendSMSNotification(nurseUserId, notification);

    // Send real-time notification
    await sendRealTimeNotification(notification);

  } catch (error) {
    console.error('Error sending background check request notification:', error);
  }
}

/**
 * Send notification when background check is completed
 */
export async function notifyBackgroundCheckCompleted(
  nurseUserId: string,
  clientUserId: string,
  result: 'passed' | 'failed',
  backgroundCheckId: string
) {
  try {
    // Notify nurse
    const nurseNotification: NotificationData = {
      user_id: nurseUserId,
      title: 'Background Check Complete',
      message: `Your background check has been completed with result: ${result}.`,
      type: 'background_check',
      action_url: `/background-check-result/${backgroundCheckId}`,
      metadata: {
        backgroundCheckId,
        result,
        type: 'completion'
      }
    };

    // Notify client
    const clientNotification: NotificationData = {
      user_id: clientUserId,
      title: 'Background Check Complete',
      message: `The background check you requested has been completed.`,
      type: 'background_check',
      action_url: `/background-check-result/${backgroundCheckId}`,
      metadata: {
        backgroundCheckId,
        result,
        type: 'completion'
      }
    };

    // Send notifications to both parties
    await Promise.all([
      sendNotification(nurseNotification),
      sendNotification(clientNotification)
    ]);

  } catch (error) {
    console.error('Error sending background check completion notifications:', error);
  }
}

/**
 * Send reminder notification for pending background check
 */
export async function sendBackgroundCheckReminder(
  nurseUserId: string,
  clientName: string,
  backgroundCheckId: string,
  daysSinceRequest: number
) {
  try {
    const notification: NotificationData = {
      user_id: nurseUserId,
      title: 'Background Check Reminder',
      message: `Reminder: ${clientName} is still waiting for your background check information (${daysSinceRequest} days ago).`,
      type: 'reminder',
      action_url: `/background-check-form/${backgroundCheckId}`,
      metadata: {
        backgroundCheckId,
        clientName,
        daysSinceRequest,
        type: 'reminder'
      }
    };

    await sendNotification(notification);

  } catch (error) {
    console.error('Error sending background check reminder:', error);
  }
}

/**
 * Generic notification sender
 */
async function sendNotification(notification: NotificationData) {
  // Store in database
  const { error: dbError } = await supabase
    .from('notifications')
    .insert({
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      action_url: notification.action_url,
      metadata: notification.metadata,
      is_read: false,
      created_at: new Date().toISOString()
    });

  if (dbError) {
    console.error('Error storing notification:', dbError);
  }

  // Send via multiple channels
  await Promise.all([
    sendEmailNotification(notification.user_id, notification),
    sendSMSNotification(notification.user_id, notification),
    sendRealTimeNotification(notification)
  ]);
}

/**
 * Send email notification using Postmark
 */
async function sendEmailNotification(userId: string, notification: NotificationData) {
  try {
    // Get user email from auth
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    if (!authUser.user?.email) return;

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('nurse_profiles')
      .select('first_name, last_name')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) return;

    const emailData = {
      to: authUser.user.email,
      subject: notification.title,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nurse Nest</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">${notification.title}</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi ${profile.first_name},
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            
            ${notification.action_url ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.REACT_APP_BASE_URL || 'https://nursenest.com'}${notification.action_url}" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Take Action
                </a>
              </div>
            ` : ''}
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The Nurse Nest Team
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Nurse Nest. All rights reserved.
            </p>
          </div>
        </div>
      `,
      textBody: `
        ${notification.title}
        
        Hi ${profile.first_name},
        
        ${notification.message}
        
        ${notification.action_url ? `
        Take action: ${process.env.REACT_APP_BASE_URL || 'https://nursenest.com'}${notification.action_url}
        ` : ''}
        
        Best regards,
        The Nurse Nest Team
      `
    };

    // Here you would integrate with your email service (Postmark, SendGrid, etc.)
    // For now, we'll just log it
    console.log('📧 Email notification would be sent:', emailData);

  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Send SMS notification using Twilio
 */
async function sendSMSNotification(userId: string, notification: NotificationData) {
  try {
    // Get user phone number
    const { data: profile } = await supabase
      .from('nurse_profiles')
      .select('phone_number')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile?.phone_number) return;

    const smsData = {
      to: profile.phone_number,
      body: `${notification.title}: ${notification.message}${notification.action_url ? ` Visit: nursenest.com${notification.action_url}` : ''}`
    };

    // Here you would integrate with Twilio
    // For now, we'll just log it
    console.log('📱 SMS notification would be sent:', smsData);

  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
}

/**
 * Send real-time notification using Supabase realtime
 */
async function sendRealTimeNotification(notification: NotificationData) {
  try {
    // Send real-time notification via Supabase channel
    await supabase.channel(`user_${notification.user_id}`)
      .send({
        type: 'broadcast',
        event: 'notification',
        payload: notification
      });

  } catch (error) {
    console.error('Error sending real-time notification:', error);
  }
}

/**
 * Database trigger function to automatically send notifications
 * This should be created in your Supabase SQL editor
 */
export const createNotificationTriggers = `
-- Function to send background check request notification
CREATE OR REPLACE FUNCTION notify_background_check_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger for new pending background checks
  IF NEW.status = 'pending' AND OLD.status IS NULL THEN
    -- This would call your Edge Function or webhook to send notifications
    PERFORM net.http_post(
      url := 'https://your-edge-function-url.supabase.co/background-check-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := json_build_object(
        'type', 'request',
        'background_check_id', NEW.id,
        'nurse_id', NEW.nurse_id,
        'client_id', NEW.client_id
      )::text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for background check requests
DROP TRIGGER IF EXISTS background_check_request_trigger ON background_checks;
CREATE TRIGGER background_check_request_trigger
  AFTER INSERT ON background_checks
  FOR EACH ROW
  EXECUTE FUNCTION notify_background_check_request();

-- Function to send background check completion notification
CREATE OR REPLACE FUNCTION notify_background_check_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- This would call your Edge Function or webhook to send notifications
    PERFORM net.http_post(
      url := 'https://your-edge-function-url.supabase.co/background-check-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := json_build_object(
        'type', 'completion',
        'background_check_id', NEW.id,
        'nurse_id', NEW.nurse_id,
        'client_id', NEW.client_id,
        'result', NEW.result,
        'adjudication', NEW.adjudication
      )::text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for background check completion
DROP TRIGGER IF EXISTS background_check_completion_trigger ON background_checks;
CREATE TRIGGER background_check_completion_trigger
  AFTER UPDATE ON background_checks
  FOR EACH ROW
  EXECUTE FUNCTION notify_background_check_completion();
`;

/**
 * Cron job function to send reminders for pending background checks
 * This should be called by a scheduled function
 */
export async function sendPendingBackgroundCheckReminders() {
  try {
    console.log('🔄 Checking for pending background check reminders...');

    // Get pending background checks older than 24 hours
    const { data: pendingChecks, error } = await supabase
      .from('background_checks')
      .select(`
        id,
        nurse_id,
        client_id,
        initiated_at,
        nurse_profiles:nurse_id (user_id, first_name),
        client_profiles:client_id (first_name, last_name)
      `)
      .eq('status', 'pending')
      .lt('initiated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      throw error;
    }

    for (const check of pendingChecks || []) {
      const daysSinceRequest = Math.floor(
        (Date.now() - new Date(check.initiated_at).getTime()) / (24 * 60 * 60 * 1000)
      );

      // Send reminders at 1, 3, 7, and 14 days
      if ([1, 3, 7, 14].includes(daysSinceRequest)) {
        await sendBackgroundCheckReminder(
          check.nurse_profiles.user_id,
          `${check.client_profiles.first_name} ${check.client_profiles.last_name}`,
          check.id,
          daysSinceRequest
        );
      }
    }

    console.log(`✅ Processed ${pendingChecks?.length || 0} pending background checks`);

  } catch (error) {
    console.error('❌ Error sending background check reminders:', error);
  }
}