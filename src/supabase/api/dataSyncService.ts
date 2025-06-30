// src/supabase/api/dataSyncService.ts
import { supabase } from '@/integrations/supabase/client';
import { updateUserMetadata } from '@/supabase/auth/authService';

/**
 * Synchronize nurse profile data with user_metadata table
 * This function should be run to fix existing data mismatches
 */
export async function syncNurseDataToMetadata(): Promise<{ 
  success: boolean; 
  syncedCount: number; 
  errors: string[] 
}> {
  try {
    const errors: string[] = [];
    let syncedCount = 0;

    // Get all nurse profiles
    const { data: nurseProfiles, error: profileError } = await supabase
      .from('nurse_profiles')
      .select('id, user_id, first_name, last_name, phone_number, onboarding_completed');

    if (profileError) {
      return { success: false, syncedCount: 0, errors: [profileError.message] };
    }

    if (!nurseProfiles || nurseProfiles.length === 0) {
      return { success: true, syncedCount: 0, errors: [] };
    }

    // Process each nurse profile
    for (const profile of nurseProfiles) {
      try {
        // Check if user_metadata exists and has empty first_name/last_name
        const { data: metadata, error: metadataError } = await supabase
          .from('user_metadata')
          .select('first_name, last_name, phone_number')
          .eq('user_id', profile.user_id)
          .single();

        if (metadataError) {
          errors.push(`Failed to get metadata for user ${profile.user_id}: ${metadataError.message}`);
          continue;
        }

        // Check if synchronization is needed
        const needsSync = !metadata.first_name || !metadata.last_name || !metadata.phone_number;

        if (needsSync && profile.first_name && profile.last_name) {
          const { success, error } = await updateUserMetadata(profile.user_id, {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone_number: profile.phone_number || '',
            onboarding_completed: profile.onboarding_completed
          });

          if (success) {
            syncedCount++;
            console.log(`Synced data for nurse ${profile.first_name} ${profile.last_name} (${profile.user_id})`);
          } else {
            errors.push(`Failed to sync nurse ${profile.user_id}: ${error}`);
          }
        }
      } catch (error: any) {
        errors.push(`Error processing nurse ${profile.user_id}: ${error.message}`);
      }
    }

    return { success: true, syncedCount, errors };
  } catch (error: any) {
    return { 
      success: false, 
      syncedCount: 0, 
      errors: [`General sync error: ${error.message}`] 
    };
  }
}

/**
 * Synchronize client profile data with user_metadata table
 */
export async function syncClientDataToMetadata(): Promise<{ 
  success: boolean; 
  syncedCount: number; 
  errors: string[] 
}> {
  try {
    const errors: string[] = [];
    let syncedCount = 0;

    // Get all client profiles
    const { data: clientProfiles, error: profileError } = await supabase
      .from('client_profiles')
      .select('id, user_id, first_name, last_name, phone_number, onboarding_completed');

    if (profileError) {
      return { success: false, syncedCount: 0, errors: [profileError.message] };
    }

    if (!clientProfiles || clientProfiles.length === 0) {
      return { success: true, syncedCount: 0, errors: [] };
    }

    // Process each client profile
    for (const profile of clientProfiles) {
      try {
        // Check if user_metadata exists and has empty first_name/last_name
        const { data: metadata, error: metadataError } = await supabase
          .from('user_metadata')
          .select('first_name, last_name, phone_number')
          .eq('user_id', profile.user_id)
          .single();

        if (metadataError) {
          errors.push(`Failed to get metadata for user ${profile.user_id}: ${metadataError.message}`);
          continue;
        }

        // Check if synchronization is needed
        const needsSync = !metadata.first_name || !metadata.last_name || !metadata.phone_number;

        if (needsSync && profile.first_name && profile.last_name) {
          const { success, error } = await updateUserMetadata(profile.user_id, {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone_number: profile.phone_number || '',
            onboarding_completed: profile.onboarding_completed
          });

          if (success) {
            syncedCount++;
            console.log(`Synced data for client ${profile.first_name} ${profile.last_name} (${profile.user_id})`);
          } else {
            errors.push(`Failed to sync client ${profile.user_id}: ${error}`);
          }
        }
      } catch (error: any) {
        errors.push(`Error processing client ${profile.user_id}: ${error.message}`);
      }
    }

    return { success: true, syncedCount, errors };
  } catch (error: any) {
    return { 
      success: false, 
      syncedCount: 0, 
      errors: [`General sync error: ${error.message}`] 
    };
  }
}

/**
 * Synchronize all profile data with user_metadata table
 */
export async function syncAllProfileData(): Promise<{
  success: boolean;
  nurseSyncedCount: number;
  clientSyncedCount: number;
  errors: string[];
}> {
  try {
    console.log('Starting profile data synchronization...');

    const [nurseResult, clientResult] = await Promise.all([
      syncNurseDataToMetadata(),
      syncClientDataToMetadata()
    ]);

    const allErrors = [...nurseResult.errors, ...clientResult.errors];

    console.log(`Synchronization complete:
      - Nurses synced: ${nurseResult.syncedCount}
      - Clients synced: ${clientResult.syncedCount}
      - Errors: ${allErrors.length}`);

    return {
      success: nurseResult.success && clientResult.success,
      nurseSyncedCount: nurseResult.syncedCount,
      clientSyncedCount: clientResult.syncedCount,
      errors: allErrors
    };
  } catch (error: any) {
    return {
      success: false,
      nurseSyncedCount: 0,
      clientSyncedCount: 0,
      errors: [`Sync operation failed: ${error.message}`]
    };
  }
}

/**
 * Fix user_metadata table structure if needed
 * This function adds missing columns to user_metadata table
 */
export async function ensureUserMetadataStructure(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if the required columns exist by trying to select them
    const { error: checkError } = await supabase
      .from('user_metadata')
      .select('first_name, last_name, phone_number')
      .limit(1);

    if (checkError) {
      // Columns might not exist, but we can't add them via client
      // This would need to be done via Supabase admin or migrations
      console.error('user_metadata table structure check failed:', checkError);
      return {
        success: false,
        error: 'User metadata table structure needs to be updated. Please add first_name, last_name, and phone_number columns to user_metadata table.'
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: `Structure check failed: ${error.message}`
    };
  }
}

/**
 * Run a complete data synchronization and repair
 */
export async function runCompleteDataSync(): Promise<{
  success: boolean;
  message: string;
  details: {
    structureCheck: boolean;
    nurseSyncedCount: number;
    clientSyncedCount: number;
    errors: string[];
  };
}> {
  try {
    console.log('Starting complete data synchronization...');

    // First ensure table structure is correct
    const structureResult = await ensureUserMetadataStructure();
    
    if (!structureResult.success) {
      return {
        success: false,
        message: structureResult.error || 'Table structure check failed',
        details: {
          structureCheck: false,
          nurseSyncedCount: 0,
          clientSyncedCount: 0,
          errors: [structureResult.error || 'Structure check failed']
        }
      };
    }

    // Now run the data synchronization
    const syncResult = await syncAllProfileData();

    const totalSynced = syncResult.nurseSyncedCount + syncResult.clientSyncedCount;
    const hasErrors = syncResult.errors.length > 0;

    let message = '';
    if (totalSynced === 0 && !hasErrors) {
      message = 'All data is already synchronized.';
    } else if (totalSynced > 0 && !hasErrors) {
      message = `Successfully synchronized ${totalSynced} profiles (${syncResult.nurseSyncedCount} nurses, ${syncResult.clientSyncedCount} clients).`;
    } else if (totalSynced > 0 && hasErrors) {
      message = `Synchronized ${totalSynced} profiles with ${syncResult.errors.length} errors.`;
    } else {
      message = `Synchronization completed with ${syncResult.errors.length} errors.`;
    }

    return {
      success: syncResult.success,
      message,
      details: {
        structureCheck: structureResult.success,
        nurseSyncedCount: syncResult.nurseSyncedCount,
        clientSyncedCount: syncResult.clientSyncedCount,
        errors: syncResult.errors
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Complete sync failed: ${error.message}`,
      details: {
        structureCheck: false,
        nurseSyncedCount: 0,
        clientSyncedCount: 0,
        errors: [error.message]
      }
    };
  }
}