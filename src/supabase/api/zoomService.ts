// src/supabase/api/zoomService.ts
// Fixed Zoom integration using backend database functions to avoid CORS issues
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Video call interface for database operations
 */
export interface VideoCall {
  id?: string;
  conversation_id: string;
  zoom_meeting_id: string;
  zoom_meeting_password?: string | null;
  zoom_join_url: string;
  zoom_start_url: string;
  scheduled_at?: string | null;
  duration_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  initiated_by_user_id: string;
  meeting_topic?: string | null;
  actual_start_time?: string | null;
  actual_end_time?: string | null;
  recording_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Database video call type (what actually comes from Supabase)
 */
export interface DatabaseVideoCall {
  id: string;
  conversation_id: string;
  zoom_meeting_id: string;
  zoom_meeting_password: string | null;
  zoom_join_url: string;
  zoom_start_url: string;
  scheduled_at: string | null;
  duration_minutes: number;
  status: string; // This comes as generic string from DB
  initiated_by_user_id: string;
  meeting_topic: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  recording_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Transform database video call to typed VideoCall
 */
function transformDatabaseVideoCall(dbCall: DatabaseVideoCall): VideoCall {
  return {
    ...dbCall,
    status: (dbCall.status as VideoCall['status']) || 'scheduled',
  };
}

/**
 * Test Zoom integration using backend function
 */
export async function testZoomIntegration(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing Zoom integration...');
    
    const { data, error } = await supabase.rpc('get_zoom_access_token');
    
    if (error) {
      console.error('Test connection error:', error);
      return { success: false, error: error.message };
    }

    // Handle different response formats
    let response: any;
    
    if (typeof data === 'string') {
      try {
        response = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return { success: false, error: 'Invalid response format from database function' };
      }
    } else {
      response = data;
    }

    if (response?.success === true) {
      console.log('✅ Zoom integration is working!');
      return { success: true };
    } else {
      console.error('❌ Zoom integration failed:', response);
      return { success: false, error: response?.error || 'Failed to connect to Zoom API' };
    }
  } catch (error) {
    console.error('❌ Zoom integration test error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Create a video call record in database and Zoom meeting using backend function
 */
export async function createVideoCall(callData: {
  conversationId: string;
  initiatedByUserId: string;
  scheduledAt?: string;
  duration?: number;
  topic?: string;
}): Promise<{ data: VideoCall | null; error: PostgrestError | null }> {
  try {
    const {
      conversationId,
      initiatedByUserId,
      scheduledAt,
      duration = 60,
      topic = "Nurse Nest Video Consultation"
    } = callData;

    console.log('Creating video call with data:', callData);

    // Call the database function that creates both Zoom meeting and database record
    const { data, error } = await supabase.rpc('create_video_call_with_zoom', {
      p_conversation_id: conversationId,
      p_initiated_by_user_id: initiatedByUserId,
      p_meeting_topic: topic,
      p_scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      p_duration_minutes: duration
    });

    if (error) {
      console.error('Database function error:', error);
      throw new Error(`Database function failed: ${error.message}`);
    }

    // Handle different response formats
    let response: any;
    
    if (typeof data === 'string') {
      try {
        response = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from database function');
      }
    } else {
      response = data;
    }
    
    if (!response?.success) {
      console.error('Video call creation failed:', response);
      throw new Error(response?.error || 'Failed to create video call');
    }

    // Fetch the created video call record
    const { data: videoCall, error: fetchError } = await supabase
      .from('video_calls')
      .select('*')
      .eq('id', response.video_call_id)
      .single();

    if (fetchError) {
      console.error('Error fetching created video call:', fetchError);
      throw fetchError;
    }

    console.log('Video call created successfully:', videoCall);
    
    // Transform the database response to proper VideoCall type
    const transformedData = videoCall ? transformDatabaseVideoCall(videoCall as DatabaseVideoCall) : null;
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error creating video call:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Get video calls for a conversation
 */
export async function getConversationVideoCalls(conversationId: string): Promise<{ data: VideoCall[] | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await supabase
      .from('video_calls')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform all database responses to proper VideoCall types
    const transformedData = data ? data.map(call => transformDatabaseVideoCall(call as DatabaseVideoCall)) : null;
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error getting conversation video calls:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Update video call status
 */
export async function updateVideoCallStatus(
  callId: string, 
  status: VideoCall['status'], 
  additionalData?: Partial<VideoCall>
): Promise<{ data: VideoCall | null; error: PostgrestError | null }> {
  try {
    const updateData = {
      status,
      ...additionalData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('video_calls')
      .update(updateData)
      .eq('id', callId)
      .select()
      .single();

    if (error) throw error;
    
    // Transform the database response to proper VideoCall type
    const transformedData = data ? transformDatabaseVideoCall(data as DatabaseVideoCall) : null;
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error updating video call status:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Delete video call (both from database and Zoom) using backend function
 */
export async function deleteVideoCall(callId: string): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    console.log('Deleting video call:', callId);

    // Call the database function that deletes both Zoom meeting and database record
    const { data, error } = await supabase.rpc('delete_video_call_with_zoom', {
      p_video_call_id: callId
    });

    if (error) {
      console.error('Database function error:', error);
      throw new Error(`Database function failed: ${error.message}`);
    }

    // Handle different response formats
    let response: any;
    
    if (typeof data === 'string') {
      try {
        response = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from database function');
      }
    } else {
      response = data;
    }
    
    if (!response?.success) {
      console.error('Video call deletion failed:', response);
      throw new Error(response?.error || 'Failed to delete video call');
    }

    console.log('Video call deleted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting video call:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Join video call (update participant record)
 */
export async function joinVideoCall(callId: string, userId: string, participantType: 'host' | 'attendee' = 'attendee'): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    // Insert or update participant record
    const { error } = await supabase
      .from('call_participants')
      .upsert({
        video_call_id: callId,
        user_id: userId,
        participant_type: participantType,
        joined_at: new Date().toISOString()
      });

    if (error) throw error;
    
    // Update call status to active if this is the first participant
    await updateVideoCallStatus(callId, 'active', {
      actual_start_time: new Date().toISOString()
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error joining video call:', error);
    return { success: false, error: error as PostgrestError };
  }
}

/**
 * Leave video call (update participant record)
 */
export async function leaveVideoCall(callId: string, userId: string): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    // Update participant record with leave time
    const { error } = await supabase
      .from('call_participants')
      .update({
        left_at: new Date().toISOString()
      })
      .eq('video_call_id', callId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error leaving video call:', error);
    return { success: false, error: error as PostgrestError };
  }
}