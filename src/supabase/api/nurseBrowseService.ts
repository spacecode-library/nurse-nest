// src/supabase/api/nurseBrowseService.ts
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export interface NurseWithDetails {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_photo_url: string | null;
  onboarding_completed: boolean;
  onboarding_completion_percentage: number;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  bio: string | null;
  created_at: string;
  updated_at: string | null;
  nurse_qualifications?: {
    id: string;
    education_level: string;
    years_experience: number;
    specializations: string[];
    school_name: string;
    graduation_year: number;
  }[];
  nurse_licenses?: {
    id: string;
    license_type: string;
    license_number: string;
    issuing_state: string;
    expiration_date: string;
    verification_status: string;
  }[];
  nurse_certifications?: {
    id: string;
    certification_name: string;
    expiration_date: string | null;
    is_malpractice_insurance: boolean;
  }[];
  nurse_preferences?: {
    id: string;
    desired_hourly_rate: number;
    travel_radius: number;
    preferred_shifts: string[];
    availability_types: string[];
    location_preferences: string[];
  }[];
}

export interface BrowseFilters {
  searchTerm?: string;
  city?: string;
  state?: string;
  maxDistance?: number; // in miles
  specializations?: string[];
  minExperience?: number;
  maxHourlyRate?: number;
  minHourlyRate?: number;
  licenseTypes?: string[];
  availabilityTypes?: string[];
  preferredShifts?: string[];
  onlyVerified?: boolean;
  onlyAvailable?: boolean;
}

/**
 * Get client's care location
 */
export async function getClientCareLocation(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('care_locations')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting client care location:', error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Browse nurses with location-based filtering and other criteria
 */
export async function browseNurses(
  clientId: string,
  filters: BrowseFilters = {},
  limit: number = 20,
  offset: number = 0
) {
  try {
    // First get the client's care location
    const { data: careLocation, error: locationError } = await getClientCareLocation(clientId);
    
    if (locationError) {
      console.warn('Could not get client care location:', locationError);
    }

    // Start building the query - simplified approach
    let query = supabase
      .from('nurse_profiles')
      .select('*', { count: 'exact' });

    // Apply onboarding filter - only show completed profiles
    query = query.eq('onboarding_completed', true);

    // Apply search filter if provided
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.replace(/[;'"\\]/g, '').trim();
      if (searchTerm) {
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`
        );
      }
    }

    // Apply location filters
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.state) {
      query = query.eq('state', filters.state);
    }

    // Execute the main query
    const { data: nurses, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!nurses || nurses.length === 0) {
      return { 
        data: [], 
        count: 0, 
        totalCount: count || 0,
        careLocation,
        error: null 
      };
    }

    // Now fetch related data for each nurse
    const nursesWithDetails = await Promise.all(
      nurses.map(async (nurse) => {
        try {
          // Fetch related data in parallel
          const [qualifications, licenses, certifications, preferences] = await Promise.all([
            supabase
              .from('nurse_qualifications')
              .select('*')
              .eq('nurse_id', nurse.id),
            supabase
              .from('nurse_licenses')
              .select('*')
              .eq('nurse_id', nurse.id),
            supabase
              .from('nurse_certifications')
              .select('*')
              .eq('nurse_id', nurse.id),
            supabase
              .from('nurse_preferences')
              .select('*')
              .eq('nurse_id', nurse.id)
          ]);

          return {
            ...nurse,
            nurse_qualifications: qualifications.data || [],
            nurse_licenses: licenses.data || [],
            nurse_certifications: certifications.data || [],
            nurse_preferences: preferences.data || []
          };
        } catch (error) {
          console.error(`Error fetching details for nurse ${nurse.id}:`, error);
          return {
            ...nurse,
            nurse_qualifications: [],
            nurse_licenses: [],
            nurse_certifications: [],
            nurse_preferences: []
          };
        }
      })
    );

    // Post-process results to apply additional filters
    let filteredNurses = nursesWithDetails;

    // Filter by specializations
    if (filters.specializations && filters.specializations.length > 0) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_qualifications?.some(qual => 
          qual.specializations.some(spec => 
            filters.specializations!.some(filterSpec => 
              spec.toLowerCase().includes(filterSpec.toLowerCase())
            )
          )
        )
      );
    }

    // Filter by experience
    if (filters.minExperience) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_qualifications?.some(qual => 
          qual.years_experience >= filters.minExperience!
        )
      );
    }

    // Filter by hourly rate
    if (filters.minHourlyRate || filters.maxHourlyRate) {
      filteredNurses = filteredNurses.filter(nurse => {
        const rate = nurse.nurse_preferences?.[0]?.desired_hourly_rate;
        if (!rate) return true; // Include nurses without rate preference
        
        if (filters.minHourlyRate && rate < filters.minHourlyRate) return false;
        if (filters.maxHourlyRate && rate > filters.maxHourlyRate) return false;
        return true;
      });
    }

    // Filter by license types
    if (filters.licenseTypes && filters.licenseTypes.length > 0) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_licenses?.some(license => 
          filters.licenseTypes!.includes(license.license_type)
        )
      );
    }

    // Filter by availability types
    if (filters.availabilityTypes && filters.availabilityTypes.length > 0) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_preferences?.some(pref => 
          pref.availability_types.some(availType => 
            filters.availabilityTypes!.includes(availType)
          )
        )
      );
    }

    // Filter by preferred shifts
    if (filters.preferredShifts && filters.preferredShifts.length > 0) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_preferences?.some(pref => 
          pref.preferred_shifts.some(shift => 
            filters.preferredShifts!.includes(shift)
          )
        )
      );
    }

    // Filter by verification status
    if (filters.onlyVerified) {
      filteredNurses = filteredNurses.filter(nurse => 
        nurse.nurse_licenses?.some(license => 
          license.verification_status === 'verified'
        )
      );
    }

    // Add distance calculation and location prioritization
    const nursesWithDistance = filteredNurses.map(nurse => {
      let distance = null;
      let isLocal = false;

      if (careLocation) {
        distance = calculateDistance(
          careLocation.city,
          careLocation.state,
          nurse.city,
          nurse.state
        );
        isLocal = nurse.city.toLowerCase() === careLocation.city.toLowerCase() &&
                 nurse.state.toLowerCase() === careLocation.state.toLowerCase();
      }

      return {
        ...nurse,
        distance,
        isLocal
      };
    });

    // Sort by location relevance (local first, then by distance)
    nursesWithDistance.sort((a, b) => {
      // Prioritize local nurses
      if (a.isLocal && !b.isLocal) return -1;
      if (!a.isLocal && b.isLocal) return 1;
      
      // Then sort by distance if available
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      
      // Finally sort by creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return { 
      data: nursesWithDistance, 
      count: filteredNurses.length, 
      totalCount: count || 0,
      careLocation,
      error: null 
    };

  } catch (error) {
    console.error('Error browsing nurses:', error);
    return { 
      data: null, 
      count: 0, 
      totalCount: 0,
      careLocation: null,
      error: error as PostgrestError 
    };
  }
}

/**
 * Get nurses by specific specialization
 */
export async function getNursesBySpecialization(
  specialization: string,
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  return browseNurses(clientId, { specializations: [specialization] }, limit, offset);
}

/**
 * Get nurses in same city as client
 */
export async function getLocalNurses(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  try {
    const { data: careLocation } = await getClientCareLocation(clientId);
    
    if (!careLocation) {
      // If no care location, just return all nurses
      return browseNurses(clientId, {}, limit, offset);
    }

    // Filter by client's city and state
    return browseNurses(clientId, {
      city: careLocation.city,
      state: careLocation.state
    }, limit, offset);

  } catch (error) {
    console.error('Error getting local nurses:', error);
    // Fallback to all nurses if there's an error
    return browseNurses(clientId, {}, limit, offset);
  }
}

/**
 * Simple distance calculation based on city/state
 * This is a basic approximation - in production, you'd use actual geocoding
 */
function calculateDistance(
  city1: string, 
  state1: string, 
  city2: string, 
  state2: string
): number {
  // Same city = 0 miles
  if (city1.toLowerCase() === city2.toLowerCase() && 
      state1.toLowerCase() === state2.toLowerCase()) {
    return 0;
  }
  
  // Same state, different city = approximate 50 miles
  if (state1.toLowerCase() === state2.toLowerCase()) {
    return 50;
  }
  
  // Different state = approximate 200 miles
  return 200;
}

/**
 * Get available specializations for filtering
 */
export async function getAvailableSpecializations() {
  try {
    const { data, error } = await supabase
      .from('nurse_qualifications')
      .select('specializations');

    if (error) throw error;

    // Flatten and deduplicate specializations
    const allSpecializations = data
      ?.flatMap(qual => qual.specializations || [])
      .filter(Boolean) || [];

    const uniqueSpecializations = [...new Set(allSpecializations)];
    
    return { data: uniqueSpecializations.sort(), error: null };
  } catch (error) {
    console.error('Error getting specializations:', error);
    return { data: [], error: error as PostgrestError };
  }
}

/**
 * Get available license types for filtering
 */
export async function getAvailableLicenseTypes() {
  try {
    const { data, error } = await supabase
      .from('nurse_licenses')
      .select('license_type')
      .not('license_type', 'is', null);

    if (error) throw error;

    const uniqueLicenseTypes = [...new Set(data?.map(l => l.license_type) || [])];
    
    return { data: uniqueLicenseTypes.sort(), error: null };
  } catch (error) {
    console.error('Error getting license types:', error);
    return { data: [], error: error as PostgrestError };
  }
}

/**
 * Contact a nurse (create conversation)
 */
export async function contactNurse(
  clientId: string, 
  nurseId: string, 
  jobId?: string
) {
  try {
    // Check if conversation already exists
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('client_id', clientId)
      .eq('nurse_id', nurseId);

    if (jobId) {
      query = query.eq('job_id', jobId);
    } else {
      query = query.is('job_id', null);
    }

    const { data: existing } = await query.single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        client_id: clientId,
        nurse_id: nurseId,
        job_id: jobId || null
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating conversation:', error);
    return { data: null, error: error as PostgrestError };
  }
}