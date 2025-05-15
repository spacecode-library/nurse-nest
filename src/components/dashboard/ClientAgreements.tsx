
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientAgreementsProps {
  userId: string;
}

interface SignedDocument {
  id: string;
  document_type: string;
  signed_at: string;
}

export default function ClientAgreements({ userId }: ClientAgreementsProps) {
  const [documents, setDocuments] = useState<SignedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  
  const documentTypes = [
    { type: 'terms', name: 'Terms of Service' },
    { type: 'privacy', name: 'Privacy Policy' },
    { type: 'client-waiver', name: 'Client Acknowledgment & Waiver' },
    { type: 'refund-policy', name: 'Refund & Cancellation Policy' },
    { type: 'phi-consent', name: 'PHI Consent' },
    { type: 'screening-consent', name: 'Screening Initiation Consent' },
    { type: 'timesheet-policy', name: 'Timesheet Approval Policy' }
  ];
  
  useEffect(() => {
    fetchSignedDocuments();
  }, [userId]);
  
  const fetchSignedDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_agreements')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching signed documents:', error);
      toast({
        title: "Error",
        description: "Failed to load your signed documents.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const isDocumentSigned = (type: string) => {
    return documents.some(doc => doc.document_type === type);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-nurse-dark" />
          Vetting & Legal Acknowledgments
        </CardTitle>
        <CardDescription>
          Review your signed documents and agreements
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nurse-dark"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {documentTypes.map((doc) => (
              <div key={doc.type} className="p-3 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    {isDocumentSigned(doc.type) ? (
                      <p className="text-sm text-green-600">
                        Signed on {formatDate(documents.find(d => d.document_type === doc.type)?.agreed_at || '')}
                      </p>
                    ) : (
                      <p className="text-sm text-amber-600">Not yet signed</p>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">You haven't signed any documents yet.</p>
                <Button className="mt-4 bg-nurse-dark hover:bg-primary-600">
                  Complete Onboarding
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
