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

export default function NurseOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await getCurrentUser();
      console.log('Current user data:', data);
    //   if (data?.user) {
    //     setUserId(data.user.id);
    //   } else {
    //     // Redirect to login if not logged in
    //     // navigate('/auth');
    //   }
    };
    
    checkSession();
  }, [navigate]);

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    // Basic validation for each step
    switch (currentStep) {
      case 0: // Personal Information
        if (!firstName || !lastName || !phoneNumber) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 1: // Professional Qualifications
        if (!licenseType || !licenseNumber || !licenseState || !licenseExpiryDate || !specialty) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 2: // Work Preferences
        if (preferredShifts.length === 0 || !workLocationType) {
          toast({
            title: "Required fields missing",
            description: "Please select at least one shift type and work location preference",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 3: // Documents
        if (!licenseFile) {
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
    setPreferredShifts(prev => 
      prev.includes(shift) 
        ? prev.filter(s => s !== shift) 
        : [...prev, shift]
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('nurse-documents')
      .upload(filePath, file);
      
    if (error) {
      throw error;
    }
    
    return filePath;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || !termsAccepted || !userId) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Upload files first
      const licenseFilePath = licenseFile ? await uploadFile(licenseFile, 'licenses') : '';
      const resumeFilePath = resumeFile ? await uploadFile(resumeFile, 'resumes') : '';
      const certFilePath = certFile ? await uploadFile(certFile, 'certifications') : '';
      
      // Save license information
      await addNurseLicense({
        nurse_id: userId,
        license_type: licenseType,
        license_number: licenseNumber,
        issuing_state: licenseState,
        expiration_date: licenseExpiryDate,
        verification_status: 'pending'
      });
      
      // Save qualifications
      await saveNurseQualification({
        nurse_id: userId,
        specializations: [specialty],
        years_experience: parseInt(yearsOfExperience) || 0,
        education_level: '', // Not captured in form
        school_name: '', // Not captured in form
        graduation_year: 0, // Not captured in form
        resume_url: resumeFilePath
      });
      
      // Save work preferences
      await saveNursePreferences({
        nurse_id: userId,
        availability_types: ['full-time'], // Default to full-time
        preferred_shifts: preferredShifts,
        location_preferences: [workLocationType],
        travel_radius: parseInt(travelDistance) || 0,
        desired_hourly_rate: parseFloat(hourlyRate) || 0
      });
      
      // Save certifications
      for (const certification of certifications) {
        await addNurseCertification({
          nurse_id: userId,
          certification_name: certification,
          certification_file_url: certFilePath,
          is_malpractice_insurance: certification.toLowerCase().includes('malpractice'),
          expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
        });
      }
      
      // Update profile completion status in the database
      const { error } = await supabase
        .from('nurse_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completion_percentage: 100,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address: address,
          city: city,
          state: state,
          zip_code: zipCode,
          bio: bio
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully submitted for verification.",
        variant: "default"
      });
      
      // Redirect to the dashboard
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Nurse Onboarding</h1>
            <p className="text-gray-600 mb-8 text-center">Complete your profile to start accepting assignments</p>
            
            {/* Progress Steps */}
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
                {/* Step 1: Personal Information */}
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
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Professional Qualifications */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseType">License Type <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="licenseExpiryDate">Expiration Date <span className="text-red-500">*</span></Label>
                        <Input
                          id="licenseExpiryDate"
                          type="date"
                          value={licenseExpiryDate}
                          onChange={(e) => setLicenseExpiryDate(e.target.value)}
                          required
                        />
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          placeholder="Years of experience"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Certifications</Label>
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
                  </div>
                )}
                
                {/* Step 3: Work Preferences */}
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
                
                {/* Step 4: Documents & Verification */}
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
                    
                    {/* License Document Upload */}
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
                    
                    {/* Resume Upload */}
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
                    
                    {/* Certifications Upload */}
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
                
                {/* Step 5: Review & Submit */}
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
                    
                    {/* Personal Information Summary */}
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
                    
                    {/* Credentials Summary */}
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
                    
                    {/* Documents Summary */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Documents</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${licenseFileName ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <p className="font-medium">Nursing License: {licenseFileName ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${resumeFileName ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                            <p className="font-medium">Resume: {resumeFileName ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${certFileName ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                            <p className="font-medium">Certifications: {certFileName ? 'Uploaded' : 'Not uploaded'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preferences Summary */}
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
                    
                    {/* Terms and Conditions */}
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
                  >
                    Continue
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
            
            {/* Help button */}
            <div className="max-w-3xl mx-auto mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help with your profile setup? <span className="text-primary-600 cursor-pointer hover:underline">Contact support</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}