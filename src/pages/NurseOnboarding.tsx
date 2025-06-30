import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, User, Briefcase, MapPin, Shield, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser, completeOnboarding, updateUserMetadata } from '@/supabase/auth/authService';
import { getNurseProfileByUserId, createNurseProfile, updateNurseProfile } from '@/supabase/api/nurseProfileService';
import { supabase } from '@/integrations/supabase/client';

// Types
interface OnboardingStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Personal Information",
    icon: <User className="h-5 w-5" />,
    description: "Tell us about yourself"
  },
  {
    id: 2,
    title: "Professional Qualifications",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Your education and experience"
  },
  {
    id: 3,
    title: "Licenses & Certifications",
    icon: <Shield className="h-5 w-5" />,
    description: "Your professional credentials"
  },
  {
    id: 4,
    title: "Employment Preferences",
    icon: <MapPin className="h-5 w-5" />,
    description: "Where and how you'd like to work"
  },
  {
    id: 5,
    title: "Additional Documents",
    icon: <FileText className="h-5 w-5" />,
    description: "Upload supporting documents"
  },
  {
    id: 6,
    title: "Review & Submit",
    icon: <CheckCircle className="h-5 w-5" />,
    description: "Review your application"
  }
];

export default function NurseOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [nurseProfileId, setNurseProfileId] = useState<string>('');

  // Step 1: Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Professional Qualifications
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');

  // Step 3: Licenses & Certifications
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issuingState, setIssuingState] = useState('');
  const [licenseExpiration, setLicenseExpiration] = useState('');
  const [certifications, setCertifications] = useState<Array<{
    name: string;
    file: File | null;
    fileUrl: string;
  }>>([]);

  // Step 4: Employment Preferences
  const [availabilityTypes, setAvailabilityTypes] = useState<string[]>([]);
  const [preferredShifts, setPreferredShifts] = useState<string[]>([]);
  const [locationPreferences, setLocationPreferences] = useState<string[]>([]);
  const [travelRadius, setTravelRadius] = useState('');
  const [desiredHourlyRate, setDesiredHourlyRate] = useState('');

  // Step 5: Additional Documents
  const [additionalDocs, setAdditionalDocs] = useState<Array<{
    name: string;
    file: File | null;
    fileUrl: string;
  }>>([]);

  // Step 6: Review & Submit
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Data for dropdowns
  const specializationOptions = ['Pediatric', 'Geriatric', 'Critical Care', 'Oncology', 'Emergency', 'Postpartum', 'Mental Health', 'Surgical', 'Home Health'];
  const educationLevelOptions = ['Associate', 'Bachelor', 'Master', 'Doctorate'];
  const licenseTypeOptions = ['RN', 'LPN', 'CNA', 'NP'];
  const availabilityOptions = ['Full-time', 'Part-time', 'Per diem', 'Contract'];
  const shiftOptions = ['Day', 'Night', 'Weekend', 'Flexible'];
  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Load existing user data and profile
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!data?.user) {
          navigate('/auth');
          return;
        }

        const userId = data.user.id;
        setUserId(userId);
        
        // Get metadata from auth user
        const metadata = data.user.user_metadata;
        if (metadata?.first_name) setFirstName(metadata.first_name);
        if (metadata?.last_name) setLastName(metadata.last_name);
        
        const { data: profileData, error } = await getNurseProfileByUserId(userId);
        
        if (profileData) {
          setNurseProfileId(profileData.id);
          setFirstName(profileData.first_name || metadata?.first_name || '');
          setLastName(profileData.last_name || metadata?.last_name || '');
          setPhoneNumber(profileData.phone_number || '');
          setProfilePhotoUrl(profileData.profile_photo_url || '');
          setCity(profileData.city || '');
          setState(profileData.state || '');
          setStreetAddress(profileData.street_address || '');
          setZipCode(profileData.zip_code || '');
          setBio(profileData.bio || '');
          
          if (!profileData.onboarding_completed) {
            const percentage = profileData.onboarding_completion_percentage || 0;
            const stepIndex = Math.floor((percentage / 100) * ONBOARDING_STEPS.length);
            setCurrentStep(Math.min(stepIndex, ONBOARDING_STEPS.length - 1));
          } else {
            // If already completed, redirect to dashboard
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [navigate]);

  const updateOnboardingProgress = async (profileId: string, percentage: number, completed: boolean = false) => {
    await updateNurseProfile(profileId, {
      onboarding_completion_percentage: percentage,
      onboarding_completed: completed,
      updated_at: new Date().toISOString()
    });
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Personal Information
        if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !city.trim() || !state || !streetAddress.trim() || !zipCode.trim()) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 1: // Professional Qualifications
        if (!specializations.length || !yearsExperience || !educationLevel || !schoolName || !graduationYear) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all professional qualification fields.",
            variant: "destructive"
          });
          return false;
        }
        if (!resume && !resumeUrl) {
          toast({
            title: "Resume Required",
            description: "Please upload your resume.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: // Licenses & Certifications
        if (!licenseType || !licenseNumber || !issuingState || !licenseExpiration) {
          toast({
            title: "License Information Required",
            description: "Please fill in all license information fields.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3: // Employment Preferences
        if (!availabilityTypes.length || !preferredShifts.length || !travelRadius || !desiredHourlyRate) {
          toast({
            title: "Employment Preferences Required",
            description: "Please fill in all employment preference fields.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 5: // Review & Submit
        if (!agreementAccepted) {
          toast({
            title: "Agreement Required",
            description: "Please accept the terms and conditions to proceed.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;
    
    setSubmitting(true);
    try {
      const progressPercentage = Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100);
      
      if (currentStep === 0) {
        // Save personal information
        let photoUrl = profilePhotoUrl;
        if (profilePhoto) {
          photoUrl = await uploadFile(profilePhoto, 'nurse-profiles', `${userId}/profile-photo-${Date.now()}`);
          setProfilePhotoUrl(photoUrl);
        }

        const profileData = {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          profile_photo_url: photoUrl,
          city,
          state,
          street_address: streetAddress,
          zip_code: zipCode,
          bio,
          onboarding_completion_percentage: progressPercentage
        };

        if (nurseProfileId) {
          await updateNurseProfile(nurseProfileId, profileData);
        } else {
          const { data: newProfile } = await createNurseProfile(profileData);
          if (newProfile) {
            setNurseProfileId(newProfile.id);
          }
        }

        // Update user metadata with the profile information (FIXED: removed userId parameter)
        await updateUserMetadata({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber
        });

      } else if (currentStep === 1) {
        // Save professional qualifications
        let resumeUrlToSave = resumeUrl;
        if (resume) {
          resumeUrlToSave = await uploadFile(resume, 'nurse-documents', `${userId}/resume-${Date.now()}`);
          setResumeUrl(resumeUrlToSave);
        }

        if (nurseProfileId) {
          await updateNurseProfile(nurseProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          // Save qualifications to separate table
          await supabase.from('nurse_qualifications').upsert({
            nurse_id: nurseProfileId,
            specializations,
            years_experience: parseInt(yearsExperience),
            education_level: educationLevel,
            school_name: schoolName,
            graduation_year: parseInt(graduationYear),
            resume_url: resumeUrlToSave
          });
        }
      } else if (currentStep === 2) {
        // Save licenses and certifications
        if (nurseProfileId) {
          await updateNurseProfile(nurseProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          // Save license
          await supabase.from('nurse_licenses').upsert({
            nurse_id: nurseProfileId,
            license_type: licenseType,
            license_number: licenseNumber,
            issuing_state: issuingState,
            expiration_date: licenseExpiration,
            verification_status: 'pending'
          });

          // Save certifications
          for (const cert of certifications) {
            let certFileUrl = cert.fileUrl;
            if (cert.file) {
              certFileUrl = await uploadFile(cert.file, 'nurse-documents', `${userId}/cert-${Date.now()}`);
            }

            await supabase.from('nurse_certifications').upsert({
              nurse_id: nurseProfileId,
              certification_name: cert.name,
              certification_file_url: certFileUrl
            });
          }
        }
      } else if (currentStep === 3) {
        // Save employment preferences
        if (nurseProfileId) {
          await updateNurseProfile(nurseProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          await supabase.from('nurse_preferences').upsert({
            nurse_id: nurseProfileId,
            availability_types: availabilityTypes,
            preferred_shifts: preferredShifts,
            location_preferences: locationPreferences,
            travel_radius: parseInt(travelRadius),
            desired_hourly_rate: parseFloat(desiredHourlyRate)
          });
        }
      } else if (currentStep === 4) {
        // Save additional documents
        if (nurseProfileId) {
          await updateNurseProfile(nurseProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          // Save additional documents
          for (const doc of additionalDocs) {
            let docFileUrl = doc.fileUrl;
            if (doc.file) {
              docFileUrl = await uploadFile(doc.file, 'nurse-documents', `${userId}/doc-${Date.now()}`);
            }

            await supabase.from('nurse_certifications').upsert({
              nurse_id: nurseProfileId,
              certification_name: doc.name,
              certification_file_url: docFileUrl,
              is_malpractice_insurance: doc.name.toLowerCase().includes('malpractice')
            });
          }
        }
      } else if (currentStep === 5) {
        // Complete onboarding
        if (nurseProfileId) {
          // First update the nurse profile to mark as completed
          await updateNurseProfile(nurseProfileId, {
            onboarding_completion_percentage: 100,
            onboarding_completed: true
          });

          // Now call completeOnboarding which will synchronize data with user_metadata (FIXED: destructuring)
          const { success, error } = await completeOnboarding('nurse');
          
          if (success) {
            toast({
              title: "Application Submitted!",
              description: "Your nurse application has been submitted for review. You'll be notified once it's approved.",
            });
            
            // Navigate to a waiting/pending page or dashboard
            navigate('/dashboard');
          } else {
            toast({
              title: "Error",
              description: error || "Failed to complete onboarding. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }
      }

      if (currentStep < ONBOARDING_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving step data:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', file: null, fileUrl: '' }]);
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addAdditionalDoc = () => {
    setAdditionalDocs([...additionalDocs, { name: '', file: null, fileUrl: '' }]);
  };

  const updateAdditionalDoc = (index: number, field: string, value: any) => {
    const updated = [...additionalDocs];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalDocs(updated);
  };

  const removeAdditionalDoc = (index: number) => {
    setAdditionalDocs(additionalDocs.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nurse Registration</h1>
            <p className="text-gray-600">Complete your profile to join our healthcare network</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={((currentStep + 1) / ONBOARDING_STEPS.length) * 100} 
              className="w-full h-2"
            />
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto">
            {ONBOARDING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16">{step.title}</span>
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ONBOARDING_STEPS[currentStep].icon}
                {ONBOARDING_STEPS[currentStep].title}
              </CardTitle>
              <p className="text-gray-600">{ONBOARDING_STEPS[currentStep].description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="profilePhoto">Profile Photo</Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                    />
                    {profilePhotoUrl && (
                      <img src={profilePhotoUrl} alt="Profile" className="mt-2 w-20 h-20 rounded-full object-cover" />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <Input
                      id="streetAddress"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Professional Qualifications */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Specializations *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {specializationOptions.map(spec => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={specializations.includes(spec)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSpecializations([...specializations, spec]);
                              } else {
                                setSpecializations(specializations.filter(s => s !== spec));
                              }
                            }}
                          />
                          <Label htmlFor={spec} className="text-sm">{spec}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearsExperience">Years of Experience *</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="Enter years of experience"
                      />
                    </div>
                    <div>
                      <Label htmlFor="educationLevel">Education Level *</Label>
                      <Select value={educationLevel} onValueChange={setEducationLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevelOptions.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter school name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="Enter graduation year"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resume">Resume *</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />
                    {resumeUrl && (
                      <p className="mt-2 text-sm text-green-600">Resume uploaded successfully</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Licenses & Certifications */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">License Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="licenseType">License Type *</Label>
                      <Select value={licenseType} onValueChange={setLicenseType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                        <SelectContent>
                          {licenseTypeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">License Number *</Label>
                      <Input
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="Enter license number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="issuingState">Issuing State *</Label>
                      <Select value={issuingState} onValueChange={setIssuingState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issuing state" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="licenseExpiration">Expiration Date *</Label>
                      <Input
                        id="licenseExpiration"
                        type="date"
                        value={licenseExpiration}
                        onChange={(e) => setLicenseExpiration(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Certifications (Optional)</h3>
                      <Button type="button" variant="outline" onClick={addCertification}>
                        Add Certification
                      </Button>
                    </div>
                    
                    {certifications.map((cert, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Certification name"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeCertification(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => updateCertification(index, 'file', e.target.files?.[0] || null)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Employment Preferences */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Availability Types *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availabilityOptions.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={availabilityTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAvailabilityTypes([...availabilityTypes, type]);
                              } else {
                                setAvailabilityTypes(availabilityTypes.filter(t => t !== type));
                              }
                            }}
                          />
                          <Label htmlFor={type} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Preferred Shifts *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {shiftOptions.map(shift => (
                        <div key={shift} className="flex items-center space-x-2">
                          <Checkbox
                            id={shift}
                            checked={preferredShifts.includes(shift)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPreferredShifts([...preferredShifts, shift]);
                              } else {
                                setPreferredShifts(preferredShifts.filter(s => s !== shift));
                              }
                            }}
                          />
                          <Label htmlFor={shift} className="text-sm">{shift}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="travelRadius">Travel Radius (miles) *</Label>
                      <Input
                        id="travelRadius"
                        type="number"
                        value={travelRadius}
                        onChange={(e) => setTravelRadius(e.target.value)}
                        placeholder="Enter travel radius"
                      />
                    </div>
                    <div>
                      <Label htmlFor="desiredHourlyRate">Desired Hourly Rate ($) *</Label>
                      <Input
                        id="desiredHourlyRate"
                        type="number"
                        step="0.01"
                        value={desiredHourlyRate}
                        onChange={(e) => setDesiredHourlyRate(e.target.value)}
                        placeholder="Enter desired hourly rate"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Additional Documents */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Additional Documents (Optional)</h3>
                    <Button type="button" variant="outline" onClick={addAdditionalDoc}>
                      Add Document
                    </Button>
                  </div>
                  
                  <p className="text-gray-600">
                    Upload any additional documents such as malpractice insurance, CPR certifications, or other relevant credentials.
                  </p>

                  {additionalDocs.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Document name (e.g., Malpractice Insurance)"
                          value={doc.name}
                          onChange={(e) => updateAdditionalDoc(index, 'name', e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeAdditionalDoc(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => updateAdditionalDoc(index, 'file', e.target.files?.[0] || null)}
                      />
                    </div>
                  ))}

                  {additionalDocs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No additional documents added yet.</p>
                      <p className="text-sm">Click "Add Document" to upload additional credentials.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Review Your Application</h3>
                  
                  {/* Personal Information Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Name:</strong> {firstName} {lastName}</p>
                      <p><strong>Phone:</strong> {phoneNumber}</p>
                      <p><strong>Address:</strong> {streetAddress}, {city}, {state} {zipCode}</p>
                    </div>
                  </div>

                  {/* Professional Information Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Professional Qualifications</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Specializations:</strong> {specializations.join(', ')}</p>
                      <p><strong>Experience:</strong> {yearsExperience} years</p>
                      <p><strong>Education:</strong> {educationLevel} from {schoolName} ({graduationYear})</p>
                    </div>
                  </div>

                  {/* License Information Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">License Information</h4>
                    <div className="text-sm">
                      <p><strong>License:</strong> {licenseType} #{licenseNumber}</p>
                      <p><strong>Issued by:</strong> {issuingState}</p>
                      <p><strong>Expires:</strong> {licenseExpiration}</p>
                    </div>
                  </div>

                  {/* Employment Preferences Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Employment Preferences</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Availability:</strong> {availabilityTypes.join(', ')}</p>
                      <p><strong>Preferred Shifts:</strong> {preferredShifts.join(', ')}</p>
                      <p><strong>Travel Radius:</strong> {travelRadius} miles</p>
                      <p><strong>Desired Rate:</strong> ${desiredHourlyRate}/hour</p>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border-t pt-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreement"
                        checked={agreementAccepted}
                        onCheckedChange={setAgreementAccepted}
                      />
                      <div className="text-sm">
                        <Label htmlFor="agreement" className="cursor-pointer">
                          I agree to the <a href="/terms" className="text-blue-600 hover:underline" target="_blank">Terms of Service</a> and{' '}
                          <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">Privacy Policy</a>. 
                          I understand that my application will be reviewed by administrators and I will be notified of the approval status.
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>1. Your application will be reviewed by our administrators</p>
                      <p>2. We'll verify your license and credentials</p>
                      <p>3. You'll receive an email notification about your approval status</p>
                      <p>4. Once approved, you can start browsing and applying for jobs</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              type="button"
              onClick={nextStep}
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Submit Application' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}