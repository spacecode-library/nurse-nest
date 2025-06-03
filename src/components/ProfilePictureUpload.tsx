// components/ProfilePictureUpload.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  User, 
  Loader2,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePictureUploadProps {
  nurseId: string;
  currentPhotoUrl?: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
  className?: string;
}

export default function ProfilePictureUpload({ 
  nurseId, 
  currentPhotoUrl, 
  onPhotoUpdated,
  className = "" 
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, or GIF)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload a profile photo",
          variant: "destructive"
        });
        return;
      }
  
      console.log('Authenticated user:', user.id);
  
      // Generate unique filename
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
  
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
  
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
  
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);
  
      // **FIX: Use user_id instead of id**
      const { error: updateError } = await supabase
        .from('nurse_profiles')
        .update({ profile_photo_url: publicUrl })
        .eq('user_id', user.id); // Changed from .eq('id', nurseId)
  
      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
  
      toast({
        title: "✨ Profile Photo Updated!",
        description: "Your new profile photo has been uploaded successfully",
        duration: 4000
      });
  
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
        duration: 4000
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    try {
      setUploading(true);

      // Update nurse profile to remove photo URL
      const { error } = await supabase
        .from('nurse_profiles')
        .update({ profile_photo_url: null })
        .eq('id', nurseId);

      if (error) throw error;

      toast({
        title: "Photo Removed",
        description: "Your profile photo has been removed",
      });

      onPhotoUpdated('');
    } catch (error: any) {
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {/* Current Profile Picture Display */}
      <Card className="border-0 shadow-medical-soft bg-gradient-to-br from-white to-medical-primary/5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center text-lg font-semibold text-medical-text-primary">
            <Sparkles className="h-5 w-5 mr-2 text-medical-primary" />
            Professional Photo
            <Badge className="ml-2 bg-medical-primary/10 text-medical-primary text-xs border-medical-primary/20">
              Recommended
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {/* Profile Picture Display */}
          <div className="relative mx-auto w-32 h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-medical-soft bg-gradient-to-br from-medical-primary to-medical-accent">
              {currentPhotoUrl ? (
                <img
                  src={currentPhotoUrl}
                  alt="Professional Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            
            {/* Professional Badge */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-medical-success to-medical-accent text-white rounded-full p-2 shadow-medical-soft">
              <Star className="h-4 w-4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-medical-primary hover:bg-medical-primary/90 text-white border-0 shadow-medical-soft transition-all duration-300"
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {currentPhotoUrl ? 'Update Photo' : 'Add Photo'}
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-lg bg-gradient-to-br from-white to-medical-neutral-50">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-medical-text-primary flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-medical-primary" />
                    Upload Professional Photo
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-medical-primary bg-medical-primary/5' 
                        : 'border-medical-border hover:border-medical-primary/50 hover:bg-medical-primary/5'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {previewUrl ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-32 h-32">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-medical-soft"
                          />
                        </div>
                        <p className="text-sm text-medical-text-secondary font-medium">
                          {selectedFile?.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                          className="text-medical-text-secondary hover:bg-medical-primary/5"
                        >
                          Choose Different Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-12 w-12 text-medical-text-secondary mx-auto mb-4" />
                        <p className="text-lg font-medium text-medical-text-primary mb-2">
                          Drop your photo here, or click to browse
                        </p>
                        <p className="text-sm text-medical-text-secondary mb-4">
                          JPG, PNG or GIF (max 5MB)
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white hover:bg-medical-primary/5 border-medical-border"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />

                  {/* Medical Professional Guidelines */}
                  <div className="bg-medical-primary/5 p-4 rounded-xl border border-medical-primary/20">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-medical-primary mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-medical-primary mb-1">Professional Photo Guidelines:</p>
                        <ul className="text-sm text-medical-text-secondary space-y-0.5">
                          <li>• Clear, professional headshot</li>
                          <li>• Face clearly visible and well-lit</li>
                          <li>• Neutral background preferred</li>
                          <li>• Professional healthcare attire</li>
                          <li>• Confident, approachable expression</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUploadDialog(false);
                        clearSelection();
                      }}
                      disabled={uploading}
                      className="hover:bg-medical-primary/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={uploadPhoto}
                      disabled={!selectedFile || uploading}
                      className="bg-medical-primary hover:bg-medical-primary/90 text-white shadow-medical-soft"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {currentPhotoUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={removePhoto}
                disabled={uploading}
                className="w-full text-medical-error border-medical-error/30 hover:bg-medical-error/5"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Remove Photo
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Professional Benefits */}
          <div className="text-left bg-gradient-to-r from-medical-success/10 to-medical-accent/10 p-3 rounded-xl border border-medical-success/20">
            <div className="flex items-start">
              <Star className="h-4 w-4 text-medical-success mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-medical-success mb-1">Professional Benefits:</p>
                <ul className="text-xs text-medical-text-secondary space-y-0.5">
                  <li>• 3x more client engagement</li>
                  <li>• Builds trust and credibility</li>
                  <li>• Higher application success rate</li>
                  <li>• Stand out from other candidates</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}