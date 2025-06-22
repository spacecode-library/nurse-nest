// src/components/video/index.ts
// Export all video call related components

export { VideoCallScheduler } from '../VideoCallScheduler';
export { VideoCallHistory } from '../VideoCallHistory';

// Export types from the zoom service
export type { VideoCall, ZoomMeetingConfig } from '@/supabase/api/zoomService';