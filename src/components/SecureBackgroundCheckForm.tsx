// src/components/SecureBackgroundCheckForm.tsx
// Secure form for nurses to provide sensitive information for background checks
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  Lock, 
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  completeBackgroundCheckWithCandidateData,
  type BackgroundCheckCandidate,
  type BackgroundCheckResult
} from '@/supabase/api/checkrService';

interface SecureBackgroundCheckFormProps {
  backgroundCheckId: string;
  nurseInfo: {
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
  };
  onComplete: (result: BackgroundCheckResult) => void;
  onCancel?: () => void;
}

export const SecureBackgroundCheckForm: React.FC<SecureBackgroundCheckFormProps> = ({
  backgroundCheckId,
  nurseInfo,
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState<BackgroundCheckCandidate>({
    first_name: nurseInfo.first_name || '',
    last_name: nurseInfo.last_name || '',
    email: nurseInfo.email || '',
    phone: nurseInfo.phone_number || '',
    zipcode: '',
    dob: '',
    ssn: '',
    driver_license_number: '',
    driver_license_state: '',
    no_middle_name: true
  });

  const [showSsn, setShowSsn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [acknowledgeAccuracy, setAcknowledgeAccuracy] = useState(false);

  // US States for dropdown
  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (field: keyof BackgroundCheckCandidate, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatSSN = (ssn: string) => {
    // Remove all non-digits
    const numbers = ssn.replace(/\D/g, '');
    
    // Add dashes in appropriate places
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
    }
  };

  const handleSsnChange = (value: string) => {
    const formatted = formatSSN(value);
    if (formatted.replace(/\D/g, '').length <= 9) {
      handleInputChange('ssn', formatted);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const numbers = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    if (formatted.replace(/\D/g, '').length <= 10) {
      handleInputChange('phone', formatted);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.first_name.trim()) errors.push('First name is required');
    if (!formData.last_name.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.replace(/\D/g, '')) errors.push('Phone number is required');
    if (!formData.zipcode.trim() || formData.zipcode.length < 5) errors.push('Valid ZIP code is required');
    if (!formData.dob) errors.push('Date of birth is required');
    
    // Validate SSN format
    const ssnNumbers = formData.ssn.replace(/\D/g, '');
    if (ssnNumbers.length !== 9) errors.push('Valid Social Security Number is required');
    
    // Validate phone format
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length !== 10) errors.push('Valid phone number is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.push('Valid email address is required');
    
    // Validate ZIP code format
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(formData.zipcode)) errors.push('Valid ZIP code is required (12345 or 12345-6789)');
    
    // Validate date of birth (must be at least 18 years old)
    const today = new Date();
    const birthDate = new Date(formData.dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || 
        (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      errors.push('Must be at least 18 years old');
    }
    
    if (!consentGiven) errors.push('Consent for background check is required');
    if (!acknowledgeAccuracy) errors.push('Acknowledgment of information accuracy is required');
    
    return errors;
  };

  const handleSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        toast({
          title: "Form Validation Error",
          description: errors.join(', '),
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);

      // Prepare candidate data for Checkr
      const candidateData: BackgroundCheckCandidate = {
        ...formData,
        // Remove formatting from SSN and phone for API
        ssn: formData.ssn.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        no_middle_name: formData.no_middle_name
      };

      console.log('🔍 SecureBackgroundCheckForm - Submitting background check data');

      const { data, error } = await completeBackgroundCheckWithCandidateData(
        backgroundCheckId,
        candidateData
      );

      if (error) {
        console.error('Error completing background check:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from background check submission');
      }

      toast({
        title: "Background Check Submitted",
        description: "Your information has been securely submitted for processing. You'll be notified when results are available.",
      });

      onComplete(data);

    } catch (error: any) {
      console.error('Error submitting background check:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit background check. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return validateForm().length === 0;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Secure Background Check Information
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Please provide the information below to complete your background check. 
          All information is encrypted and handled securely according to federal privacy laws.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="last_name" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="zipcode" className="text-sm font-medium">
                ZIP Code *
              </Label>
              <Input
                id="zipcode"
                type="text"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                placeholder="12345 or 12345-6789"
                className="mt-1"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dob" className="text-sm font-medium">
              Date of Birth *
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="mt-1"
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <Label htmlFor="ssn" className="text-sm font-medium">
              Social Security Number *
            </Label>
            <div className="relative mt-1">
              <Input
                id="ssn"
                type={showSsn ? "text" : "password"}
                value={formData.ssn}
                onChange={(e) => handleSsnChange(e.target.value)}
                placeholder="XXX-XX-XXXX"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowSsn(!showSsn)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showSsn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Required for identity verification. This information is encrypted and not stored permanently.
            </p>
          </div>
        </div>

        {/* Driver's License (Optional) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Driver's License (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driver_license_number" className="text-sm font-medium">
                License Number
              </Label>
              <Input
                id="driver_license_number"
                type="text"
                value={formData.driver_license_number}
                onChange={(e) => handleInputChange('driver_license_number', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="driver_license_state" className="text-sm font-medium">
                Issuing State
              </Label>
              <select
                id="driver_license_state"
                value={formData.driver_license_state}
                onChange={(e) => handleInputChange('driver_license_state', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Middle Name Confirmation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="no_middle_name"
            checked={formData.no_middle_name}
            onCheckedChange={(checked) => handleInputChange('no_middle_name', !!checked)}
          />
          <Label htmlFor="no_middle_name" className="text-sm">
            I do not have a middle name
          </Label>
        </div>

        {/* Consent and Acknowledgments */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Consent and Acknowledgments
          </h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={setConsentGiven}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed">
                I consent to a background check being performed on me by Checkr, Inc. on behalf of Nurse Nest. 
                I understand that this will include verification of my identity, criminal history, and other relevant records. 
                I understand that this information will be used solely for determining eligibility for 
                healthcare assignments and will be handled in accordance with applicable privacy laws.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="accuracy"
                checked={acknowledgeAccuracy}
                onCheckedChange={setAcknowledgeAccuracy}
                className="mt-1"
              />
              <Label htmlFor="accuracy" className="text-sm leading-relaxed">
                I certify that all information provided is true and accurate to the best of my knowledge. 
                I understand that providing false information may result in immediate disqualification 
                and potential legal consequences. All information will be verified through official sources.
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Your sensitive information is encrypted using industry-standard security protocols. 
              Social Security Numbers are not stored permanently and are only transmitted securely to our background check provider.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Background Check...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Submit for Background Check
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isLoading}
                className="px-6"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            What happens next?
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Your information is securely transmitted to Checkr for verification</li>
            <li>• Background check typically completes within 1-2 business days</li>
            <li>• You'll be notified once the check is complete</li>
            <li>• Admin review will follow for final approval</li>
            <li>• Results are valid for one year from completion date</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};