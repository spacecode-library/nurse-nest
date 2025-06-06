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

      // Update nurse profile with new photo URL
      await updateNurseProfile(nurseId, {
        profile_photo_url: publicUrl
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white border-0 shadow-medical-elevated">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-medical-primary/5 to-medical-accent/5 border-b border-medical-border">

          <CardTitle className="text-2xl font-bold text-medical-text-primary mb-2">
            Complete Your Professional Profile
          </CardTitle>
          <p className="text-medical-text-secondary">
            Add a professional photo to build trust with clients and showcase your expertise
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Current/Preview Photo Display */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-medical-primary/10 to-medical-accent/10 border-4 border-medical-border shadow-medical-soft">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-medical-text-secondary" />
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-medical-error rounded-full flex items-center justify-center text-white hover:bg-medical-error/80 transition-colors shadow-medical-soft"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-medical-primary bg-medical-primary/5' 
                  : selectedFile 
                    ? 'border-medical-success bg-medical-success/5'
                    : 'border-medical-border bg-white hover:border-medical-primary hover:bg-medical-primary/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {selectedFile ? (
                    <CheckCircle className="h-12 w-12 text-medical-success" />
                  ) : (
                    <Upload className="h-12 w-12 text-medical-text-secondary" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-medical-success font-semibold mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-medical-text-secondary mb-4">
                      File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-medical-text-primary mb-2">
                      {dragActive ? 'Drop your photo here' : 'Upload your professional photo'}
                    </p>
                    <p className="text-medical-text-secondary mb-4">
                      Drag & drop a photo here, or click to browse
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white transition-all duration-300"
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {selectedFile ? 'Choose Different Photo' : 'Browse Photos'}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />

                <p className="text-xs text-medical-text-secondary mt-3">
                  Supported formats: JPG, PNG, GIF • Max size: 5MB
                </p>
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-medical-primary/5 border border-medical-primary/20 rounded-xl p-4">
              <h4 className="font-semibold text-medical-primary mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Professional Photo Guidelines
              </h4>
              <ul className="text-sm text-medical-text-secondary space-y-1">
                <li>• Use a clear, high-quality headshot</li>
                <li>• Ensure good lighting and professional appearance</li>
                <li>• Face should be clearly visible and centered</li>
                <li>• Avoid group photos, selfies, or casual images</li>
                <li>• Professional attire recommended</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              {showSkipOption && onSkip ? (
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={onSkip}
                  disabled={uploading}
                  className="text-medical-text-secondary hover:text-medical-text-primary"
                >
                  Skip for now
                </Button>
              ) : (
                <div></div>
              )}

              <div className="flex space-x-3">
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSelection}
                    disabled={uploading}
                    className="border-medical-border hover:border-medical-primary"
                  >
                    Clear
                  </Button>
                )}
                
                <Button
                  type="button"
                  onClick={uploadProfilePicture}
                  disabled={!selectedFile || uploading}
                  className="bg-gradient-to-r from-medical-primary to-medical-accent hover:shadow-medical-elevated text-white min-w-[120px] transition-all duration-300"
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
  );
}