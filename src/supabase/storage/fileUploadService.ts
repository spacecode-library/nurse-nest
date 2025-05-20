// src/supabase/storage/fileUploadService.ts
import { supabase } from '@/integrations/supabase/client';
import { StorageError } from '@supabase/storage-js';

/**
 * Result interface for file uploads
 */
export interface UploadResult {
  url: string;
  error: StorageError | null;
}

/**
 * Available storage buckets in the application
 */
export type StorageBucket = 'profile-photos' | 'licenses' | 'resumes' | 'certifications' | 'contracts';

/**
 * Create required storage buckets if they don't exist
 * This should be run once during app initialization
 */
export async function initializeStorageBuckets() {
  try {
    // List of buckets to create
    const buckets: StorageBucket[] = [
      'profile-photos',
      'licenses',
      'resumes',
      'certifications',
      'contracts'
    ];

    // Create each bucket if it doesn't exist
    for (const bucket of buckets) {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucket);

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucket, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error(`Error creating ${bucket} bucket:`, error);
        } else {
          console.log(`Created ${bucket} bucket`);
        }
      }
    }

    return { error: null };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { error };
  }
}

/**
 * Upload a profile photo for a user
 * 
 * @param userId User ID
 * @param file File to upload
 * @returns URL of the uploaded file
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
    }

    // Set maximum file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Create a unique filename using the user ID and current timestamp
    const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    if (error instanceof StorageError) {
      return { url: '', error };
    } else {
      return { url: '', error: new StorageError((error as Error).message) };
    }
  }
}

/**
 * Upload a license document for a nurse
 * 
 * @param nurseId Nurse ID
 * @param file File to upload
 * @param licenseType Type of license (for organized storage)
 * @returns URL of the uploaded file
 */
export async function uploadLicenseDocument(
  nurseId: string, 
  file: File, 
  licenseType: string
): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, JPG, or PNG file.');
    }

    // Set maximum file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Create a unique filename
    const sanitizedLicenseType = licenseType.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${nurseId}/${sanitizedLicenseType}-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('licenses')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('licenses')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading license document:', error);
    if (error instanceof StorageError) {
      return { url: '', error };
    } else {
      return { url: '', error: new StorageError((error as Error).message) };
    }
  }
}

/**
 * Upload a resume for a nurse
 * 
 * @param nurseId Nurse ID
 * @param file File to upload
 * @returns URL of the uploaded file
 */
export async function uploadResume(nurseId: string, file: File): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or Word document.');
    }

    // Set maximum file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Create a unique filename
    const fileName = `${nurseId}/resume-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading resume:', error);
    if (error instanceof StorageError) {
      return { url: '', error };
    } else {
      return { url: '', error: new StorageError((error as Error).message) };
    }
  }
}

/**
 * Upload a certification file
 * 
 * @param nurseId Nurse ID
 * @param file File to upload
 * @param certificationName Name of certification
 * @returns URL of the uploaded file
 */
export async function uploadCertification(
  nurseId: string, 
  file: File, 
  certificationName: string
): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, JPG, or PNG file.');
    }

    // Set maximum file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Create a unique filename
    const sanitizedCertName = certificationName.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${nurseId}/${sanitizedCertName}-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('certifications')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certifications')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading certification:', error);
    if (error instanceof StorageError) {
      return { url: '', error };
    } else {
      return { url: '', error: new StorageError((error as Error).message) };
    }
  }
}

/**
 * Upload a contract document
 * 
 * @param contractId Contract ID
 * @param file File to upload
 * @returns URL of the uploaded file
 */
export async function uploadContract(contractId: string, file: File): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF file.');
    }

    // Set maximum file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Create a unique filename
    const fileName = `${contractId}/contract-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('contracts')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading contract:', error);
    if (error instanceof StorageError) {
      return { url: '', error };
    } else {
      return { url: '', error: new StorageError((error as Error).message) };
    }
  }
}

/**
 * Delete a file from storage
 * 
 * @param bucket Storage bucket name
 * @param filePath Path to file in the bucket
 */
export async function deleteFile(bucket: StorageBucket, filePath: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
    return { error };
  }
}

/**
 * Extract the file path from a publicURL
 * 
 * @param publicUrl The public URL of the file
 * @param bucket The bucket name
 * @returns The file path
 */
export function getPathFromUrl(publicUrl: string, bucket: StorageBucket): string {
  try {
    // Example URL: https://xxxxx.supabase.co/storage/v1/object/public/profile-photos/user-id/profile.jpg
    const bucketPath = `/storage/v1/object/public/${bucket}/`;
    const pathStartIndex = publicUrl.indexOf(bucketPath);
    
    if (pathStartIndex === -1) {
      throw new Error('Invalid URL format');
    }
    
    return publicUrl.substring(pathStartIndex + bucketPath.length);
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return '';
  }
}