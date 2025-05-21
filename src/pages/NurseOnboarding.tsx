import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/supabase/auth/authService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveNurseQualification } from '@/supabase/api/nurseQualificationService';
import { saveNursePreferences } from '@/supabase/api/nursePreferencesService';
import { addNurseCertification } from '@/supabase/api/nurseCertificationService';
import { addNurseLicense } from '@/supabase/api/nurseLicenseService';
import { 
  createNurseProfile, 
  getNurseProfileByUserId, 
  updateNurseProfile, 
  updateOnboardingProgress 
} from '@/supabase/api/nurseProfileService';
import { supabase } from '@/integrations/supabase/client';

// Constants for form options
const LICENSE_TYPES = [
  'Registered Nurse (RN)',
  'Licensed Practical Nurse (LPN)',
  'Nurse Practitioner (NP)',
  'Clinical Nurse Specialist (CNS)',
  'Certified Registered Nurse Anesthetist (CRNA)',
  'Certified Nurse Midwife (CNM)'
];

const SPECIALTIES = [
  'Medical-Surgical',
  'Intensive Care (ICU)',
  'Emergency (ER)',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Oncology',
  'Psychiatric/Mental Health',
  'Geriatrics',
  'Home Health',
  'Telemetry',
  'Operating Room (OR)',
  'Post-Anesthesia Care (PACU)',
  'Neonatal Intensive Care (NICU)',
  'Cardiovascular',
  'Orthopedics',
  'Neurology',
  'Rehabilitation',
  'Dialysis',
  'Hospice & Palliative Care',
  'Primary Care'
];

const COMMON_CERTIFICATIONS = [
  'Basic Life Support (BLS)',
  'Advanced Cardiac Life Support (ACLS)',
  'Pediatric Advanced Life Support (PALS)',
  'Trauma Nursing Core Course (TNCC)',
  'Certified Emergency Nurse (CEN)',
  'Critical Care Registered Nurse (CCRN)',
  'Medical-Surgical Nursing Certification (MEDSURG-BC)',
  'Oncology Certified Nurse (OCN)'
];

const SHIFT_TYPES = [
  'Day Shift',
  'Night Shift',
  'Evening Shift',
  'Weekend',
  'Weekday',
  'Per Diem',
  '12-Hour',
  '8-Hour'
];

// Define the onboarding steps
const ONBOARDING_STEPS = [
  'Personal Information',
  'Professional Qualifications',
  'Work Preferences',
  'Documents & Verification',
  'Review & Submit'
];

// Validation helper function for license expiry
const validateLicenseExpiry = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  // License should not be expired and should be valid for at least 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return expiry > thirtyDaysFromNow;
};

export default function NurseOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [nurseProfileId, setNurseProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Personal Information (Step 1)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Professional Qualifications (Step 2)
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [customCertification, setCustomCertification] = useState('');

  // Work Preferences (Step 3)
  const [availabilityStartDate, setAvailabilityStartDate] = useState('');
  const [preferredShifts, setPreferredShifts] = useState<string[]>([]);
  const [workLocationType, setWorkLocationType] = useState('');
  const [travelDistance, setTravelDistance] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  // Documents (Step 4)
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseFileName, setLicenseFileName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certFileName, setCertFileName] = useState('');

  // Document upload status (for Step 5)
  const [hasLicenseUploaded, setHasLicenseUploaded] = useState(false);
  const [hasResumeUploaded, setHasResumeUploaded] = useState(false);
  const [hasCertificationsUploaded, setHasCertificationsUploaded] = useState(false);

  // Calculate onboarding progress percentage
  const calculateProgress = (step: number): number => {
    const stepPercentage = 100 / ONBOARDING_STEPS.length;
    return Math.round(stepPercentage * (step + 1));
  };

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          const userId = data.user.id;
          setUserId(userId);
          
          const { data: profileData, error } = await getNurseProfileByUserId(userId);
          
          if (profileData) {
            setNurseProfileId(profileData.id);
            setFirstName(profileData.first_name || '');
            setLastName(profileData.last_name || '');
            setPhoneNumber(profileData.phone_number || '');
            setAddress(profileData.street_address || '');
            setCity(profileData.city || '');
            setState(profileData.state || '');
            setZipCode(profileData.zip_code || '');
            
            if (!profileData.onboarding_completed) {
              const percentage = profileData.onboarding_completion_percentage;
              if (percentage >= 80) setCurrentStep(4);
              else if (percentage >= 60) setCurrentStep(3);
              else if (percentage >= 40) setCurrentStep(2);
              else if (percentage >= 20) setCurrentStep(1);
              else setCurrentStep(0);
              
              if (percentage >= 20) {
                const { data: qualificationsData } = await supabase
                  .from('nurse_qualifications')
                  .select('specializations, years_experience, resume_url')
                  .eq('nurse_id', profileData.id)
                  .single();
                
                if (qualificationsData) {
                  setSpecialty(qualificationsData.specializations[0] || '');
                  setYearsOfExperience(qualificationsData.years_experience?.toString() || '');
                  setHasResumeUploaded(!!qualificationsData.resume_url); // Check resume upload
                }
                
                const { data: licenseData } = await supabase
                  .from('nurse_licenses')
                  .select('license_type, license_number, issuing_state, expiration_date, license_photo_url')
                  .eq('nurse_id', profileData.id)
                  .single();
                
                if (licenseData) {
                  setLicenseType(licenseData.license_type || '');
                  setLicenseNumber(licenseData.license_number || '');
                  setLicenseState(licenseData.issuing_state || '');
                  setLicenseExpiryDate(licenseData.expiration_date || '');
                  setHasLicenseUploaded(!!licenseData.license_photo_url); // Check license upload
                }
                
                const { data: certData } = await supabase
                  .from('nurse_certifications')
                  .select('certification_name, certification_file_url')
                  .eq('nurse_id', profileData.id);
                
                if (certData) {
                  setCertifications(certData.map(cert => cert.certification_name));
                  setHasCertificationsUploaded(certData.some(cert => !!cert.certification_file_url)); // Check certifications upload
                }
              }
              
              if (percentage >= 40) {
                const { data: preferencesData } = await supabase
                  .from('nurse_preferences')
                  .select('*')
                  .eq('nurse_id', profileData.id)
                  .single();
                
                if (preferencesData) {
                  setPreferredShifts(preferencesData.preferred_shifts || []);
                  setWorkLocationType(preferencesData.location_preferences[0] || '');
                  setTravelDistance(preferencesData.travel_radius?.toString() || '');
                  setHourlyRate(preferencesData.desired_hourly_rate?.toString() || '');
                }
                
                if (profileData.bio) {
                  setBio(profileData.bio);
                }
              }
            }
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndProfile();
  }, [navigate]);

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const progressPercentage = calculateProgress(currentStep);
      
      switch (currentStep) {
        case 0:
          if (nurseProfileId) {
            await updateNurseProfile(nurseProfileId, {
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber,
              street_address: address,
              city: city,
              state: state,
              zip_code: zipCode,
            });
            await updateOnboardingProgress(nurseProfileId, progressPercentage);
          } else if (userId) {
            const { data, error } = await createNurseProfile({
              user_id: userId,
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber,
              profile_photo_url: '',
              onboarding_completed: false,
              onboarding_completion_percentage: progressPercentage,
              street_address: address,
              city: city,
              state: state,
              zip_code: zipCode,
              bio: ''
            });
            
            if (error) throw error;
            if (data) {
              setNurseProfileId(data.id);
            }
          }
          break;
          
        case 1:
          if (!nurseProfileId) throw new Error("Nurse profile not found");
          
          const { data: existingLicense } = await supabase
            .from('nurse_licenses')
            .select('id')
            .eq('nurse_id', nurseProfileId)
            .maybeSingle();
            
          if (existingLicense?.id) {
            await supabase
              .from('nurse_licenses')
              .update({
                license_type: licenseType,
                license_number: licenseNumber,
                issuing_state: licenseState,
                expiration_date: licenseExpiryDate,
                verification_status: 'pending',
                updated_at: new Date().toISOString()
              })
              .eq('id', existingLicense.id);
          } else {
            await addNurseLicense({
              nurse_id: nurseProfileId,
              license_type: licenseType,
              license_number: licenseNumber,
              issuing_state: licenseState,
              expiration_date: licenseExpiryDate,
              verification_status: 'pending',
              license_photo_url: ''
            });
          }
          
          await saveNurseQualification({
            nurse_id: nurseProfileId,
            specializations: [specialty],
            years_experience: parseInt(yearsOfExperience) || 0,
            education_level: 'Not Specified',
            school_name: 'Not Specified',
            graduation_year: new Date().getFullYear(),
            resume_url: ''
          });
          
          const { data: existingCerts } = await supabase
            .from('nurse_certifications')
            .select('id, certification_name')
            .eq('nurse_id', nurseProfileId);
            
          if (existingCerts && existingCerts.length > 0) {
            const existingCertMap = existingCerts.reduce((map, cert) => {
              map[cert.certification_name] = cert.id;
              return map;
            }, {} as Record<string, string>);
            
            const certsToDelete = existingCerts
              .filter(cert => !certifications.includes(cert.certification_name))
              .map(cert => cert.id);
              
            if (certsToDelete.length > 0) {
              await supabase
                .from('nurse_certifications')
                .delete()
                .in('id', certsToDelete);
            }
            
            for (const cert of certifications) {
              if (!existingCertMap[cert]) {
                await addNurseCertification({
                  nurse_id: nurseProfileId,
                  certification_name: cert,
                  certification_file_url: '',
                  is_malpractice_insurance: cert.toLowerCase().includes('malpractice'),
                  expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
                });
              }
            }
          } else {
            for (const cert of certifications) {
              await addNurseCertification({
                nurse_id: nurseProfileId,
                certification_name: cert,
                certification_file_url: '',
                is_malpractice_insurance: cert.toLowerCase().includes('malpractice'),
                expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
              });
            }
          }
          
          await updateOnboardingProgress(nurseProfileId, progressPercentage);
          break;
          
        case 2:
          if (!nurseProfileId) throw new Error("Nurse profile not found");
          
          await saveNursePreferences({
            nurse_id: nurseProfileId,
            availability_types: ['full-time'],
            preferred_shifts: preferredShifts,
            location_preferences: [workLocationType],
            travel_radius: parseInt(travelDistance) || 0,
            desired_hourly_rate: parseFloat(hourlyRate) || 0
          });
          
          await updateNurseProfile(nurseProfileId, { 
            bio: bio
          });
          
          await updateOnboardingProgress(nurseProfileId, progressPercentage);
          break;
          
        case 3:
          if (!nurseProfileId) throw new Error("Nurse profile not found");
          
          let licenseFilePath = '';
          let resumeFilePath = '';
          let certFilePath = '';
          
          if (licenseFile) {
            licenseFilePath = await uploadFile(licenseFile, 'licenses');
            const { data: licenseData } = await supabase
              .from('nurse_licenses')
              .select('id')
              .eq('nurse_id', nurseProfileId)
              .single();
              
            if (licenseData) {
              await supabase
                .from('nurse_licenses')
                .update({ license_photo_url: licenseFilePath })
                .eq('id', licenseData.id);
              setHasLicenseUploaded(true); // Update upload status
            }
          }
          
          if (resumeFile) {
            resumeFilePath = await uploadFile(resumeFile, 'resumes');
            const { data: qualData } = await supabase
              .from('nurse_qualifications')
              .select('id')
              .eq('nurse_id', nurseProfileId)
              .single();
              
            if (qualData) {
              await supabase
                .from('nurse_qualifications')
                .update({ resume_url: resumeFilePath })
                .eq('id', qualData.id);
              setHasResumeUploaded(true); // Update upload status
            }
          }
          
          if (certFile) {
            certFilePath = await uploadFile(certFile, 'certifications');
            await supabase
              .from('nurse_certifications')
              .update({ certification_file_url: certFilePath })
              .eq('nurse_id', nurseProfileId);
            setHasCertificationsUploaded(true); // Update upload status
          }
          
          await updateOnboardingProgress(nurseProfileId, progressPercentage);
          break;
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      
      toast({
        title: "Progress saved",
        description: `Successfully saved your ${ONBOARDING_STEPS[currentStep]} information`,
        variant: "default"
      });
      
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error saving data",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!firstName || !lastName || !phoneNumber || !address || !city || !state || !zipCode) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 1:
        if (!licenseType || !licenseNumber || !licenseState || !licenseExpiryDate || !specialty) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields",
            variant: "destructive"
          });
          return false;
        }
        
        if (!validateLicenseExpiry(licenseExpiryDate)) {
          toast({
            title: "Invalid license expiration date",
            description: "Your license must be valid for at least 30 days from today",
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      
      case 2:
        if (preferredShifts.length === 0 || !workLocationType) {
          toast({
            title: "Required fields missing",
            description: "Please select at least one shift type and work location preference",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 3:
        if (!licenseFile && !hasLicenseUploaded) {
          toast({
            title: "Required document missing",
            description: "Please upload your nursing license",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const toggleCertification = (cert: string) => {
    setCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  const addCustomCertification = () => {
    if (customCertification && !certifications.includes(customCertification)) {
      setCertifications(prev => [...prev, customCertification]);
      setCustomCertification('');
    }
  };

  const toggleShift = (shift: string) => {
    setPreferredShifts(loop => 
      loop.includes(shift) 
        ? loop.filter(s => s !== shift) 
        : [...loop, shift]
    );
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFile(file);
      setLicenseFileName(file.name);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCertFile(file);
      setCertFileName(file.name);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('nurse-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('nurse-documents')
        .getPublicUrl(filePath);
      
      return publicUrl; // Return public URL
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || !termsAccepted || !userId || !nurseProfileId) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await updateOnboardingProgress(nurseProfileId, 100, true);
      
      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully submitted for verification.",
        variant: "default"
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      toast({
        title: "Profile submission failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Nurse Onboarding</h1>
            <p className="text-gray-600 mb-8 text-center">Complete your profile to start accepting assignments</p>
            
            <div className="mb-8">
              <div className="flex justify-between">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      currentStep === index 
                        ? 'bg-primary-600 text-white border-primary-600'
                        : currentStep > index
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-400 border-gray-300'
                    }`}>
                      {currentStep > index ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      currentStep === index ? 'text-primary-600 font-medium' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
                <div 
                  className="absolute top-0 left-0 h-1 bg-primary-600 transition-all duration-300"
                  style={{ width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP Code"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="licenseType">License Type <span className="text-red-500">*</span></Label>
                          <div className="flex items-center group relative">
                            <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                            <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                              Select the type of nursing license you currently hold
                            </span>
                          </div>
                        </div>
                        <Select value={licenseType} onValueChange={setLicenseType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LICENSE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number <span className="text-red-500">*</span></Label>
                        <Input
                          id="licenseNumber"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter license number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseState">Issuing State <span className="text-red-500">*</span></Label>
                        <Input
                          id="licenseState"
                          value={licenseState}
                          onChange={(e) => setLicenseState(e.target.value)}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="licenseExpiryDate">Expiration Date <span className="text-red-500">*</span></Label>
                          <div className="flex items-center group relative">
                            <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                            <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                              License must be valid for at least 30 days from today
                            </span>
                          </div>
                        </div>
                        <Input
                          id="licenseExpiryDate"
                          type="date"
                          value={licenseExpiryDate}
                          onChange={(e) => setLicenseExpiryDate(e.target.value)}
                          required
                        />
                        {licenseExpiryDate && !validateLicenseExpiry(licenseExpiryDate) && (
                          <div className="mt-2 text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Your license expiration date must be at least 30 days in the future
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Primary Specialty <span className="text-red-500">*</span></Label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {SPECIALTIES.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          This will be displayed as your primary specialty. You can add additional specialties in your profile later.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          placeholder="Years of experience"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Label>Certifications</Label>
                        <div className="flex items-center group relative">
                          <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                          <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                            Select all certifications you currently hold
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {COMMON_CERTIFICATIONS.map(cert => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cert-${cert}`}
                              checked={certifications.includes(cert)}
                              onCheckedChange={() => toggleCertification(cert)}
                            />
                            <Label 
                              htmlFor={`cert-${cert}`}
                              className="text-sm cursor-pointer"
                            >
                              {cert}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={customCertification}
                          onChange={(e) => setCustomCertification(e.target.value)}
                          placeholder="Add another certification"
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          onClick={addCustomCertification}
                          disabled={!customCertification}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {certifications.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {certifications.map(cert => (
                            <div 
                              key={cert}
                              className="bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm flex items-center"
                            >
                              {cert}
                              <Button 
                                type="button"
                                variant="ghost"
                                className="h-5 w-5 p-0 ml-1"
                                onClick={() => toggleCertification(cert)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Verification Process</p>
                          <p>Your license and certifications will be verified as part of the onboarding process. You will be able to upload supporting documents in a later step.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="availabilityStartDate">Availability Start Date</Label>
                      <Input
                        id="availabilityStartDate"
                        type="date"
                        value={availabilityStartDate}
                        onChange={(e) => setAvailabilityStartDate(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">When are you available to start working?</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Preferred Shifts <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SHIFT_TYPES.map(shift => (
                          <Button
                            key={shift}
                            type="button"
                            variant={preferredShifts.includes(shift) ? "default" : "outline"}
                            className={preferredShifts.includes(shift) ? "bg-primary-500" : ""}
                            onClick={() => toggleShift(shift)}
                          >
                            {shift}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="workLocationType">Work Location Preference <span className="text-red-500">*</span></Label>
                      <RadioGroup value={workLocationType} onValueChange={setWorkLocationType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="on-site" id="on-site" />
                          <Label htmlFor="on-site">On-site only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="remote" id="remote" />
                          <Label htmlFor="remote">Remote only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hybrid" id="hybrid" />
                          <Label htmlFor="hybrid">Hybrid (both on-site and remote)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="travel" id="travel" />
                          <Label htmlFor="travel">Travel nursing</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="travelDistance">Maximum Travel Distance (miles)</Label>
                      <Input
                        id="travelDistance"
                        type="number"
                        min="0"
                        value={travelDistance}
                        onChange={(e) => setTravelDistance(e.target.value)}
                        placeholder="Distance willing to travel"
                      />
                      <p className="text-xs text-gray-500">For on-site work, how far are you willing to travel?</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Desired Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="Your desired hourly rate"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell potential clients about your experience, specialties, and nursing philosophy..."
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-gray-500">This will be visible on your public profile</p>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex">
                        <HelpCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Important Information</p>
                          <p>All documents are securely stored and will only be used for verification purposes. Your license and certifications will be verified before you can start accepting assignments.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-800 mb-2">Nursing License <span className="text-red-500">*</span></h3>
                      <p className="text-sm text-gray-600 mb-4">Upload a clear copy of your current nursing license</p>
                      
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          
                          {licenseFileName ? (
                            <div>
                              <p className="text-primary-600 text-sm font-medium mb-1">
                                {licenseFileName}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                File selected
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mb-2">
                              Drag & drop your license document or click to browse
                            </p>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('licenseFileUpload')?.click()}
                          >
                            {licenseFileName ? 'Replace File' : 'Browse Files'}
                          </Button>
                          <input
                            type="file"
                            id="licenseFileUpload"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleLicenseUpload}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-800 mb-2">Resume or CV</h3>
                      <p className="text-sm text-gray-600 mb-4">Upload your current resume or CV for potential employers</p>
                      
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          
                          {resumeFileName ? (
                            <div>
                              <p className="text-primary-600 text-sm font-medium mb-1">
                                {resumeFileName}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                File selected
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mb-2">
                              Drag & drop your resume or click to browse
                            </p>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('resumeFileUpload')?.click()}
                          >
                            {resumeFileName ? 'Replace File' : 'Browse Files'}
                          </Button>
                          <input
                            type="file"
                            id="resumeFileUpload"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-800 mb-2">Certification Documents</h3>
                      <p className="text-sm text-gray-600 mb-4">Upload copies of your professional certifications</p>
                      
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          
                          {certFileName ? (
                            <div>
                              <p className="text-primary-600 text-sm font-medium mb-1">
                                {certFileName}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                File selected
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mb-2">
                              Drag & drop your certification documents or click to browse
                            </p>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('certFileUpload')?.click()}
                          >
                            {certFileName ? 'Replace File' : 'Browse Files'}
                          </Button>
                          <input
                            type="file"
                            id="certFileUpload"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertUpload}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-6">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Almost there!</p>
                          <p>Please review your information before final submission. You can go back to previous steps to make changes if needed.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Personal Information</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{firstName} {lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{phoneNumber || 'Not provided'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                              {address ? `${address}, ${city}, ${state} ${zipCode}` : 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Credentials & Experience</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">License Type</p>
                            <p className="font-medium">{licenseType || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">License Number</p>
                            <p className="font-medium">{licenseNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Specialty</p>
                            <p className="font-medium">{specialty || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Experience</p>
                            <p className="font-medium">{yearsOfExperience ? `${yearsOfExperience} years` : 'Not provided'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Certifications</p>
                            <p className="font-medium">
                              {certifications.length > 0 
                                ? certifications.join(', ') 
                                : 'None provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Documents</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${hasLicenseUploaded ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <p className="font-medium">Nursing License: {hasLicenseUploaded ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${hasResumeUploaded ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                            <p className="font-medium">Resume: {hasResumeUploaded ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${hasCertificationsUploaded ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                            <p className="font-medium">Certifications: {hasCertificationsUploaded ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Work Preferences</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Available From</p>
                            <p className="font-medium">{availabilityStartDate || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Work Location</p>
                            <p className="font-medium">{workLocationType || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Hourly Rate</p>
                            <p className="font-medium">{hourlyRate ? `$${hourlyRate}/hour` : 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Travel Distance</p>
                            <p className="font-medium">{travelDistance ? `${travelDistance} miles` : 'Not specified'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Preferred Shifts</p>
                            <p className="font-medium">
                              {preferredShifts.length > 0 
                                ? preferredShifts.join(', ') 
                                : 'None selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-6 border-t pt-6">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => {
                            setTermsAccepted(checked === true);
                          }}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I confirm that all information provided is accurate and complete. I understand that my profile
                          will need to be verified before I can accept assignments, and that providing false information
                          may result in termination of my account.
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 0 ? () => navigate('/dashboard') : prevStep}
                  disabled={submitting}
                >
                  {currentStep === 0 ? 'Cancel' : 'Previous'}
                </Button>
                
                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={submitting || !termsAccepted}
                    className="min-w-[120px]"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <div className="max-w-3xl mx-auto mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help with your profile setup? <span className="text-primary-600 cursor-pointer hover:underline">Contact support</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}