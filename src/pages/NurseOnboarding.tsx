import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload, CheckCircle, AlertCircle, HelpCircle, Shield, Stethoscope } from 'lucide-react';
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

  // Work Preferences (Step 3) - Removed workLocationType
  const [availabilityStartDate, setAvailabilityStartDate] = useState('');
  const [preferredShifts, setPreferredShifts] = useState<string[]>([]);
  const [travelDistance, setTravelDistance] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  // Documents (Step 4) - Removed license file upload, kept resume as required
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certFileName, setCertFileName] = useState('');

  // Document upload status (for Step 5) - Removed license upload status
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
                  setHasResumeUploaded(!!qualificationsData.resume_url);
                }
                
                const { data: licenseData } = await supabase
                  .from('nurse_licenses')
                  .select('license_type, license_number, issuing_state, expiration_date')
                  .eq('nurse_id', profileData.id)
                  .single();
                
                if (licenseData) {
                  setLicenseType(licenseData.license_type || '');
                  setLicenseNumber(licenseData.license_number || '');
                  setLicenseState(licenseData.issuing_state || '');
                  setLicenseExpiryDate(licenseData.expiration_date || '');
                }
                
                const { data: certData } = await supabase
                  .from('nurse_certifications')
                  .select('certification_name, certification_file_url')
                  .eq('nurse_id', profileData.id);
                
                if (certData) {
                  setCertifications(certData.map(cert => cert.certification_name));
                  setHasCertificationsUploaded(certData.some(cert => !!cert.certification_file_url));
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
          
          // Always set location_preferences to ['on-site'] since we removed the work location selection
          await saveNursePreferences({
            nurse_id: nurseProfileId,
            availability_types: ['full-time'],
            preferred_shifts: preferredShifts,
            location_preferences: ['on-site'], // Always on-site
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
          
          let resumeFilePath = '';
          let certFilePath = '';
          
          // Resume upload (now required)
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
              setHasResumeUploaded(true);
            }
          }
          
          // Certification upload (optional)
          if (certFile) {
            certFilePath = await uploadFile(certFile, 'certifications');
            await supabase
              .from('nurse_certifications')
              .update({ certification_file_url: certFilePath })
              .eq('nurse_id', nurseProfileId);
            setHasCertificationsUploaded(true);
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
        if (preferredShifts.length === 0) {
          toast({
            title: "Required fields missing",
            description: "Please select at least one shift type",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 3:
        // Resume is now required
        if (!resumeFile && !hasResumeUploaded) {
          toast({
            title: "Required document missing",
            description: "Please upload your resume or CV",
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
    setPreferredShifts(prev => 
      prev.includes(shift) 
        ? prev.filter(s => s !== shift) 
        : [...prev, shift]
    );
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
      
      return publicUrl;
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
        title: "🎉 Profile completed!",
        description: "Your profile has been successfully submitted for review. You'll be notified once approved by our team.",
        variant: "default"
      });
      
      // Redirect to dashboard router which will handle the pending approval state
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
      <div className="min-h-screen flex flex-col bg-medical-gradient-primary">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-medical-soft mx-auto flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-medical-primary border-t-transparent rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-6 w-6 text-medical-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-medical-text-primary">Loading your profile...</h3>
              <p className="text-medical-text-secondary">Setting up your professional onboarding experience</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-medical-gradient-primary">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-primary to-medical-accent rounded-full flex items-center justify-center shadow-medical-elevated">
                  <Stethoscope className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-text-primary via-medical-primary to-medical-accent bg-clip-text text-transparent mb-4">
                Professional Nurse Onboarding
              </h1>
              <p className="text-xl text-medical-text-secondary max-w-2xl mx-auto">
                Complete your professional profile to start connecting with clients who need quality nursing care
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      currentStep === index 
                        ? 'bg-medical-primary text-white border-medical-primary shadow-medical-soft'
                        : currentStep > index
                          ? 'bg-medical-success text-white border-medical-success'
                          : 'bg-white text-medical-text-secondary border-medical-border'
                    }`}>
                      {currentStep > index ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center px-2 transition-colors duration-300 ${
                      currentStep === index ? 'text-medical-primary font-semibold' : 'text-medical-text-secondary'
                    }`}>
                      {step}
                    </span>
                    {index < ONBOARDING_STEPS.length - 1 && (
                      <div className={`absolute h-0.5 w-full mt-6 transition-colors duration-300 ${
                        currentStep > index ? 'bg-medical-success' : 'bg-medical-border'
                      }`} style={{ 
                        left: `${(100 / ONBOARDING_STEPS.length) * (index + 0.5)}%`,
                        width: `${100 / ONBOARDING_STEPS.length}%`
                      }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-medical-border rounded-full"></div>
                <div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-medical-primary to-medical-accent rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Card className="border-0 shadow-medical-elevated bg-white">
              <CardContent className="pt-8 px-8">
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-medical-text-primary mb-2">Personal Information</h2>
                      <p className="text-medical-text-secondary">Let's start with your basic information</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-medical-text-primary font-medium">
                          First Name <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-medical-text-primary font-medium">
                          Last Name <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-medical-text-primary font-medium">
                        Phone Number <span className="text-medical-error">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(123) 456-7890"
                        className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-medical-text-primary font-medium">
                        Street Address <span className="text-medical-error">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main Street"
                        className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-medical-text-primary font-medium">
                          City <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-medical-text-primary font-medium">
                          State <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-medical-text-primary font-medium">
                          ZIP Code <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP Code"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-medical-text-primary mb-2">Professional Qualifications</h2>
                      <p className="text-medical-text-secondary">Tell us about your nursing credentials and experience</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="licenseType" className="text-medical-text-primary font-medium">
                            License Type <span className="text-medical-error">*</span>
                          </Label>
                          <div className="flex items-center group relative ml-2">
                            <HelpCircle className="h-4 w-4 text-medical-text-secondary cursor-help" />
                            <span className="absolute hidden group-hover:block bg-medical-text-primary text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                              Select the type of nursing license you currently hold
                            </span>
                          </div>
                        </div>
                        <Select value={licenseType} onValueChange={setLicenseType}>
                          <SelectTrigger className="border-medical-border focus:border-medical-primary">
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
                        <Label htmlFor="licenseNumber" className="text-medical-text-primary font-medium">
                          License Number <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="licenseNumber"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter license number"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="licenseState" className="text-medical-text-primary font-medium">
                          Issuing State <span className="text-medical-error">*</span>
                        </Label>
                        <Input
                          id="licenseState"
                          value={licenseState}
                          onChange={(e) => setLicenseState(e.target.value)}
                          placeholder="State"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="licenseExpiryDate" className="text-medical-text-primary font-medium">
                            Expiration Date <span className="text-medical-error">*</span>
                          </Label>
                          <div className="flex items-center group relative ml-2">
                            <HelpCircle className="h-4 w-4 text-medical-text-secondary cursor-help" />
                            <span className="absolute hidden group-hover:block bg-medical-text-primary text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                              License must be valid for at least 30 days from today
                            </span>
                          </div>
                        </div>
                        <Input
                          id="licenseExpiryDate"
                          type="date"
                          value={licenseExpiryDate}
                          onChange={(e) => setLicenseExpiryDate(e.target.value)}
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                          required
                        />
                        {licenseExpiryDate && !validateLicenseExpiry(licenseExpiryDate) && (
                          <div className="mt-2 text-medical-error text-sm flex items-center p-3 bg-medical-error/10 border border-medical-error/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            Your license expiration date must be at least 30 days in the future
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="specialty" className="text-medical-text-primary font-medium">
                          Primary Specialty <span className="text-medical-error">*</span>
                        </Label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                          <SelectTrigger className="border-medical-border focus:border-medical-primary">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {SPECIALTIES.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-medical-text-secondary">
                          This will be displayed as your primary specialty. You can add additional specialties later.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience" className="text-medical-text-primary font-medium">
                          Years of Experience
                        </Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          placeholder="Years of experience"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Label className="text-medical-text-primary font-medium">Professional Certifications</Label>
                        <div className="flex items-center group relative ml-2">
                          <HelpCircle className="h-4 w-4 text-medical-text-secondary cursor-help" />
                          <span className="absolute hidden group-hover:block bg-medical-text-primary text-white text-xs rounded p-2 -mt-14 ml-6 min-w-[200px] z-10">
                            Select all certifications you currently hold
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {COMMON_CERTIFICATIONS.map(cert => (
                          <div key={cert} className="flex items-center space-x-3 p-3 border border-medical-border rounded-lg hover:bg-medical-primary/5 transition-colors">
                            <Checkbox 
                              id={`cert-${cert}`}
                              checked={certifications.includes(cert)}
                              onCheckedChange={() => toggleCertification(cert)}
                              className="border-medical-border"
                            />
                            <Label 
                              htmlFor={`cert-${cert}`}
                              className="text-sm cursor-pointer flex-1 text-medical-text-primary"
                            >
                              {cert}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          value={customCertification}
                          onChange={(e) => setCustomCertification(e.target.value)}
                          placeholder="Add another certification"
                          className="flex-grow border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        />
                        <Button 
                          type="button" 
                          onClick={addCustomCertification}
                          disabled={!customCertification}
                          variant="outline"
                          className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {certifications.map(cert => (
                            <div 
                              key={cert}
                              className="bg-medical-primary/10 text-medical-primary rounded-full px-3 py-1 text-sm flex items-center border border-medical-primary/20"
                            >
                              {cert}
                              <Button 
                                type="button"
                                variant="ghost"
                                className="h-5 w-5 p-0 ml-2 hover:bg-medical-primary/20"
                                onClick={() => toggleCertification(cert)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-medical-primary/5 border border-medical-primary/20 rounded-xl">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-medical-primary mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-medical-primary mb-1">Verification Process</p>
                          <p className="text-medical-text-secondary">
                            Your license and certifications will be verified as part of our onboarding process. 
                            You will be able to upload supporting documents in the next step.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-medical-text-primary mb-2">Work Preferences</h2>
                      <p className="text-medical-text-secondary">Tell us about your availability and work preferences</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availabilityStartDate" className="text-medical-text-primary font-medium">
                        Availability Start Date
                      </Label>
                      <Input
                        id="availabilityStartDate"
                        type="date"
                        value={availabilityStartDate}
                        onChange={(e) => setAvailabilityStartDate(e.target.value)}
                        className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                      />
                      <p className="text-xs text-medical-text-secondary">When are you available to start working?</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-medical-text-primary font-medium">
                        Preferred Shifts <span className="text-medical-error">*</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SHIFT_TYPES.map(shift => (
                          <Button
                            key={shift}
                            type="button"
                            variant={preferredShifts.includes(shift) ? "default" : "outline"}
                            className={`transition-all ${
                              preferredShifts.includes(shift) 
                                ? "bg-medical-primary hover:bg-medical-primary/90 text-white shadow-medical-soft" 
                                : "border-medical-border hover:border-medical-primary hover:bg-medical-primary/5"
                            }`}
                            onClick={() => toggleShift(shift)}
                          >
                            {shift}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Removed Work Location Preference section - all work is on-site only */}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="travelDistance" className="text-medical-text-primary font-medium">
                          Maximum Travel Distance (miles)
                        </Label>
                        <Input
                          id="travelDistance"
                          type="number"
                          min="0"
                          value={travelDistance}
                          onChange={(e) => setTravelDistance(e.target.value)}
                          placeholder="Distance willing to travel"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        />
                        <p className="text-xs text-medical-text-secondary">How far are you willing to travel for on-site work?</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate" className="text-medical-text-primary font-medium">
                          Desired Hourly Rate ($)
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="Your desired hourly rate"
                          className="border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-medical-text-primary font-medium">
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell potential clients about your experience, specialties, and nursing philosophy..."
                        className="min-h-[120px] border-medical-border focus:border-medical-primary focus:ring-medical-primary/20"
                      />
                      <p className="text-xs text-medical-text-secondary">This will be visible on your public profile</p>
                    </div>

                    {/* Information box about work location */}
                    <div className="p-4 bg-medical-primary/5 border border-medical-primary/20 rounded-xl">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-medical-primary mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-medical-primary mb-1">Work Location</p>
                          <p className="text-medical-text-secondary">
                            All nursing positions are on-site at client locations. This ensures the highest quality of personalized care for our clients.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-medical-text-primary mb-2">Documents & Verification</h2>
                      <p className="text-medical-text-secondary">Upload your professional documents for verification</p>
                    </div>
                    
                    <div className="p-4 bg-medical-warning/10 border border-medical-warning/20 rounded-xl mb-6">
                      <div className="flex">
                        <HelpCircle className="h-5 w-5 text-medical-warning mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-medical-warning mb-1">Important Information</p>
                          <p className="text-medical-text-secondary">
                            All documents are securely stored and will only be used for verification purposes. 
                            Your qualifications will be verified before you can start accepting assignments.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Resume Upload - Now Required */}
                    <div className="border-2 border-medical-border rounded-xl p-6 bg-medical-primary/5">
                      <h3 className="font-semibold text-medical-text-primary mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-medical-primary" />
                        Resume or CV <span className="text-medical-error ml-1">*</span>
                      </h3>
                      <p className="text-sm text-medical-text-secondary mb-4">Upload your current resume or CV (Required)</p>
                      
                      <div className="flex items-center justify-center border-2 border-dashed border-medical-border rounded-lg p-8 bg-white hover:border-medical-primary transition-colors">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-medical-text-secondary mx-auto mb-3" />
                          
                          {resumeFileName ? (
                            <div>
                              <p className="text-medical-primary text-sm font-medium mb-1">
                                {resumeFileName}
                              </p>
                              <p className="text-xs text-medical-success mb-2 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                File selected
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-medical-text-secondary mb-3">
                              Drag & drop your resume or click to browse
                            </p>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('resumeFileUpload')?.click()}
                            className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
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
                          <p className="text-xs text-medical-text-secondary mt-2">PDF, DOC, DOCX (max 10MB)</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Certification Documents Upload - Optional */}
                    <div className="border-2 border-medical-border rounded-xl p-6 bg-white">
                      <h3 className="font-semibold text-medical-text-primary mb-2">Certification Documents</h3>
                      <p className="text-sm text-medical-text-secondary mb-4">Upload copies of your professional certifications (Optional)</p>
                      
                      <div className="flex items-center justify-center border-2 border-dashed border-medical-border rounded-lg p-8 hover:border-medical-primary transition-colors">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-medical-text-secondary mx-auto mb-3" />
                          
                          {certFileName ? (
                            <div>
                              <p className="text-medical-primary text-sm font-medium mb-1">
                                {certFileName}
                              </p>
                              <p className="text-xs text-medical-success mb-2 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                File selected
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-medical-text-secondary mb-3">
                              Drag & drop your certification documents or click to browse
                            </p>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('certFileUpload')?.click()}
                            className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
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
                          <p className="text-xs text-medical-text-secondary mt-2">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-medical-text-primary mb-2">Review & Submit</h2>
                      <p className="text-medical-text-secondary">Please review your information before final submission</p>
                    </div>
                    
                    <div className="p-6 bg-medical-primary/5 border border-medical-primary/20 rounded-xl mb-6">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-medical-primary mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-medical-primary mb-1">Almost there!</p>
                          <p className="text-medical-text-secondary">
                            Please review your information before final submission. You can go back to previous steps to make changes if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Personal Information Summary */}
                      <div className="border border-medical-border rounded-xl overflow-hidden">
                        <div className="bg-medical-primary/5 px-6 py-4 border-b border-medical-border">
                          <h3 className="font-semibold text-medical-text-primary">Personal Information</h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-medical-text-secondary">Name</p>
                              <p className="font-medium text-medical-text-primary">{firstName} {lastName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Phone</p>
                              <p className="font-medium text-medical-text-primary">{phoneNumber || 'Not provided'}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-medical-text-secondary">Address</p>
                              <p className="font-medium text-medical-text-primary">
                                {address ? `${address}, ${city}, ${state} ${zipCode}` : 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Credentials Summary */}
                      <div className="border border-medical-border rounded-xl overflow-hidden">
                        <div className="bg-medical-primary/5 px-6 py-4 border-b border-medical-border">
                          <h3 className="font-semibold text-medical-text-primary">Credentials & Experience</h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-medical-text-secondary">License Type</p>
                              <p className="font-medium text-medical-text-primary">{licenseType || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">License Number</p>
                              <p className="font-medium text-medical-text-primary">{licenseNumber || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Primary Specialty</p>
                              <p className="font-medium text-medical-text-primary">{specialty || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Experience</p>
                              <p className="font-medium text-medical-text-primary">{yearsOfExperience ? `${yearsOfExperience} years` : 'Not provided'}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-medical-text-secondary">Certifications</p>
                              <p className="font-medium text-medical-text-primary">
                                {certifications.length > 0 
                                  ? certifications.join(', ') 
                                  : 'None provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Documents Summary - Updated to show resume as required, removed license */}
                      <div className="border border-medical-border rounded-xl overflow-hidden">
                        <div className="bg-medical-primary/5 px-6 py-4 border-b border-medical-border">
                          <h3 className="font-semibold text-medical-text-primary">Documents</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full ${hasResumeUploaded || resumeFile ? 'bg-medical-success' : 'bg-medical-error'} mr-3`}></div>
                              <p className="font-medium text-medical-text-primary">Resume/CV: {hasResumeUploaded || resumeFile ? 'Uploaded' : 'Required - Not uploaded'}</p>
                            </div>
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full ${hasCertificationsUploaded || certFile ? 'bg-medical-success' : 'bg-medical-neutral-300'} mr-3`}></div>
                              <p className="font-medium text-medical-text-primary">Certifications: {hasCertificationsUploaded || certFile ? 'Uploaded' : 'Not uploaded (Optional)'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Work Preferences Summary - Updated to show on-site only */}
                      <div className="border border-medical-border rounded-xl overflow-hidden">
                        <div className="bg-medical-primary/5 px-6 py-4 border-b border-medical-border">
                          <h3 className="font-semibold text-medical-text-primary">Work Preferences</h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-medical-text-secondary">Available From</p>
                              <p className="font-medium text-medical-text-primary">{availabilityStartDate || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Work Location</p>
                              <p className="font-medium text-medical-text-primary">On-site only</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Desired Hourly Rate</p>
                              <p className="font-medium text-medical-text-primary">{hourlyRate ? `$${hourlyRate}/hour` : 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-medical-text-secondary">Travel Distance</p>
                              <p className="font-medium text-medical-text-primary">{travelDistance ? `${travelDistance} miles` : 'Not specified'}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-medical-text-secondary">Preferred Shifts</p>
                              <p className="font-medium text-medical-text-primary">
                                {preferredShifts.length > 0 
                                  ? preferredShifts.join(', ') 
                                  : 'None selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-medical-border">
                      <div className="flex items-start space-x-3 p-4 bg-medical-warning/10 border border-medical-warning/20 rounded-xl">
                        <Checkbox 
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => {
                            setTermsAccepted(checked === true);
                          }}
                          className="border-medical-border mt-1"
                        />
                        <Label htmlFor="terms" className="text-sm text-medical-text-primary leading-relaxed">
                          I confirm that all information provided is accurate and complete. I understand that my profile
                          will need to be reviewed and approved by our team before I can start accepting assignments. 
                          I acknowledge that providing false information may result in termination of my account.
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6 px-8 pb-8 bg-medical-neutral-50 border-t border-medical-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 0 ? () => navigate('/dashboard') : prevStep}
                  disabled={submitting}
                  className="border-medical-border hover:border-medical-primary hover:bg-medical-primary/5"
                >
                  {currentStep === 0 ? 'Cancel' : 'Previous'}
                </Button>
                
                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={submitting}
                    className="bg-gradient-to-r from-medical-primary to-medical-accent hover:shadow-medical-elevated text-white min-w-[120px]"
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
                    className="bg-gradient-to-r from-medical-success to-medical-accent hover:shadow-medical-elevated text-white min-w-[160px]"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <div className="text-center mt-8">
              <p className="text-sm text-medical-text-secondary">
                Need help with your profile setup? 
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-medical-primary hover:text-medical-primary/80 ml-1 font-medium transition-colors"
                >
                  Contact our support team
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}