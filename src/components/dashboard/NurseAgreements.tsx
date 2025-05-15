
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, File, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NurseAgreementsProps {
  userId: string;
}

interface DocumentAgreement {
  id: string;
  name: string;
  required: boolean;
  agreed: boolean;
}

export default function NurseAgreements({ userId }: NurseAgreementsProps) {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<{
    government_id: File | null;
    rn_license: File | null;
    resume: File | null;
    certifications: File[];
    insurance: File | null;
  }>({
    government_id: null,
    rn_license: null, 
    resume: null,
    certifications: [],
    insurance: null
  });

  const [nurseInfo, setNurseInfo] = useState({
    licenseState: '',
    licenseNumber: '',
  });
  
  const [agreements, setAgreements] = useState<DocumentAgreement[]>([
    { id: 'terms', name: 'Terms of Service', required: true, agreed: false },
    { id: 'privacy', name: 'Privacy Policy', required: true, agreed: false },
    { id: 'hipaa', name: 'HIPAA Consent', required: true, agreed: false },
    { id: 'contractor', name: 'Independent Contractor Agreement', required: true, agreed: false },
    { id: 'background', name: 'Background/Drug/Driving Consent', required: true, agreed: false },
    { id: 'insurance', name: 'Insurance Acknowledgment', required: true, agreed: false },
    { id: 'license', name: 'RN License Verification Form', required: true, agreed: false },
    { id: 'timesheet', name: 'Timesheet & Stripe Payment Terms', required: true, agreed: false }
  ]);
  
  const calculateCompletionPercentage = () => {
    const totalItems = 
      (documents.government_id ? 1 : 0) +
      (documents.rn_license ? 1 : 0) +
      (documents.resume ? 1 : 0) +
      (documents.insurance ? 1 : 0) +
      (nurseInfo.licenseState && nurseInfo.licenseNumber ? 1 : 0) +
      agreements.filter(a => a.agreed).length;
    
    const requiredItems = 
      1 + // government ID
      1 + // rn license
      1 + // resume
      1 + // license info
      agreements.filter(a => a.required).length;
      
    return Math.round((totalItems / requiredItems) * 100);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files) return;
    
    if (type === 'certifications') {
      setDocuments({
        ...documents,
        certifications: [...documents.certifications, ...Array.from(e.target.files)]
      });
    } else {
      setDocuments({
        ...documents,
        [type]: e.target.files[0] || null
      });
    }
  };
  
  const handleAgreementChange = (id: string, checked: boolean) => {
    setAgreements(prev => prev.map(agreement => 
      agreement.id === id ? { ...agreement, agreed: checked } : agreement
    ));
    
    if (checked) {
      saveAgreement(id);
    }
  };
  
  const saveAgreement = async (documentType: string) => {
    try {
      const { error } = await supabase
        .from('user_agreements')
        .insert({
          user_id: userId,
          document_type: documentType,
          ip_address: '127.0.0.1' // This would normally be the actual IP
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error saving agreement:', error);
      toast({
        title: "Error",
        description: "Failed to save your agreement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNurseInfo({
      ...nurseInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleUploadAll = async () => {
    setUploading(true);
    
    try {
      // Upload each document
      for (const [key, file] of Object.entries(documents)) {
        if (!file || (Array.isArray(file) && file.length === 0)) continue;
        
        if (key === 'certifications') {
          for (const certFile of documents.certifications) {
            await uploadFile(certFile, `${key}/${certFile.name}`);
          }
        } else {
          await uploadFile(file as File, `${key}/${(file as File).name}`);
        }
      }
      
      toast({
        title: "Success",
        description: "All documents uploaded successfully!",
      });
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload one or more files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const uploadFile = async (file: File, path: string) => {
    const { error } = await supabase.storage
      .from('nurse-documents')
      .upload(`${userId}/${path}`, file);
      
    if (error) throw error;
    
    // Save document reference in signed_documents table
    const { data } = await supabase.storage
      .from('nurse-documents')
      .getPublicUrl(`${userId}/${path}`);
    
    await supabase.from('signed_documents').insert({
      user_id: userId,
      document_type: path.split('/')[0],
      signed_pdf_url: data.publicUrl
    });
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-nurse-dark" />
          Signed Agreements & Uploads
        </CardTitle>
        <CardDescription>
          Complete your profile by uploading required documents and signing agreements
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Progress Tracker */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Onboarding Progress</span>
            <span>{calculateCompletionPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-nurse-dark h-2.5 rounded-full" 
              style={{ width: `${calculateCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Uploads */}
          <div>
            <h3 className="font-medium text-lg mb-4">Required Documents</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="government-id" className="flex items-center">
                  Government-issued ID
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="government-id"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'government_id')}
                  />
                </div>
                {documents.government_id && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {documents.government_id.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="rn-license" className="flex items-center">
                  RN License
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  <Input
                    name="licenseState"
                    value={nurseInfo.licenseState}
                    onChange={handleInfoChange}
                    placeholder="State"
                  />
                  <Input
                    name="licenseNumber"
                    value={nurseInfo.licenseNumber}
                    onChange={handleInfoChange}
                    placeholder="License Number"
                  />
                </div>
                <div className="mt-2">
                  <Input
                    id="rn-license"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'rn_license')}
                  />
                </div>
                {documents.rn_license && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {documents.rn_license.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="resume" className="flex items-center">
                  Resume
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'resume')}
                  />
                </div>
                {documents.resume && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {documents.resume.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="certifications" className="flex items-center">
                  Certifications
                  <span className="text-gray-500 text-xs ml-2">(multiple files allowed)</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="certifications"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileChange(e, 'certifications')}
                  />
                </div>
                {documents.certifications.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {documents.certifications.length} file(s) selected
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="insurance" className="flex items-center">
                  Malpractice Insurance
                  <span className="text-amber-500 ml-2 text-xs">(required before job)</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="insurance"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'insurance')}
                  />
                </div>
                {documents.insurance && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {documents.insurance.name}
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleUploadAll}
                disabled={uploading}
                className="w-full mt-4"
              >
                {uploading ? 'Uploading...' : 'Upload All Documents'}
              </Button>
            </div>
          </div>
          
          {/* Legal Agreements */}
          <div>
            <h3 className="font-medium text-lg mb-4">Legal Acknowledgments</h3>
            
            <div className="space-y-4">
              {agreements.map((agreement) => (
                <div key={agreement.id} className="flex items-start">
                  <Checkbox
                    id={agreement.id}
                    checked={agreement.agreed}
                    onCheckedChange={(checked) => 
                      handleAgreementChange(agreement.id, checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="ml-2">
                    <Label 
                      htmlFor={agreement.id}
                      className="font-medium cursor-pointer"
                    >
                      {agreement.name}
                      {agreement.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <p className="text-xs text-gray-500">
                      I have read and agree to the {agreement.name.toLowerCase()}
                    </p>
                    <button
                      type="button"
                      className="text-primary-500 hover:underline text-xs mt-1"
                    >
                      View document
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 mt-6">
                <div className="flex items-start">
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Verification Required</p>
                        <p className="text-yellow-700">
                          You'll need to complete all required documents and agreements
                          before being matched with clients. Our team will verify your 
                          credentials within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
