// components/dashboard/nurse/ProfilePictureUpload.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, CheckCircle, AlertCircle, User, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { updateNurseProfile } from '@/supabase/api/nurseProfileService';

interface ProfilePictureUploadProps {
  nurseId: string;
  userId: string;
  currentPhotoUrl?: string;
  onPhotoUploaded: (photoUrl: string) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
}

export default function ProfilePictureUpload({ 
  nurseId, 
  userId, 
  currentPhotoUrl, 
  onPhotoUploaded,
  onSkip,
  showSkipOption = false 
}: ProfilePictureUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhotoUrl || '');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a profile picture to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('nurse-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('nurse-documents')
        .getPublicUrl(filePath);

      // FIXED: Update nurse profile with correct field name
      await updateNurseProfile(nurseId, {
        profile_photo_url: publicUrl // Changed from profile_photo_url to profile_picture_url
      });

      toast({
        title: "✨ Profile picture uploaded!",
        description: "Your professional photo has been updated successfully.",
        variant: "default"
      });

      onPhotoUploaded(publicUrl);

    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(currentPhotoUrl || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 mx-auto">
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Professional Profile
            </CardTitle>
            <p className="text-gray-600">
              Add a professional photo to build trust with clients and showcase your expertise
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Current/Preview Photo Display */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-gray-200 shadow-lg">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {selectedFile && (
                    <button
                      onClick={clearSelection}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Area */}
              <div 
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {selectedFile ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {selectedFile ? (
                    <div>
                      <p className="text-green-600 font-semibold mb-2 break-all">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {dragActive ? 'Drop your photo here' : 'Upload your professional photo'}
                      </p>
                      <p className="text-gray-500 mb-4">
                        Drag & drop a photo here, or click to browse
                      </p>
                    </div>
                  )}

                  {/* FIXED: Made button more visible and prominent */}
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 px-6 py-2 font-medium"
                      disabled={uploading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {selectedFile ? 'Choose Different Photo' : 'Browse Photos'}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />

                  <p className="text-xs text-gray-500 mt-3">
                    Supported formats: JPG, PNG, GIF • Max size: 5MB
                  </p>
                </div>
              </div>

              {/* Photo Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Professional Photo Guidelines
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use a clear, high-quality headshot</li>
                  <li>• Ensure good lighting and professional appearance</li>
                  <li>• Face should be clearly visible and centered</li>
                  <li>• Avoid group photos, selfies, or casual images</li>
                  <li>• Professional attire recommended</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                {showSkipOption && onSkip ? (
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={onSkip}
                    disabled={uploading}
                    className="text-gray-500 hover:text-gray-700 order-2 sm:order-1"
                  >
                    Skip for now
                  </Button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSelection}
                      disabled={uploading}
                      className="border-gray-300 hover:border-gray-400"
                    >
                      Clear
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    onClick={uploadProfilePicture}
                    disabled={!selectedFile || uploading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-w-[140px] transition-all duration-300 shadow-lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}