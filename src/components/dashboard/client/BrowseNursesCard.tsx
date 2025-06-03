// components/dashboard/client/BrowseNursesCard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  Phone,
  Mail,
  Award,
  Eye,
  MessageCircle,
  Clock,
  DollarSign,
  CheckCircle,
  Shield,
  BookOpen,
  Heart,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  User,
  Sparkles,
  Crown,
  Zap,
  Globe,
  Briefcase,
  Trophy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  browseNurses, 
  getLocalNurses,
  getNursesBySpecialization,
  getAvailableSpecializations,
  getAvailableLicenseTypes,
  contactNurse,
  type NurseWithDetails,
  type BrowseFilters 
} from '@/supabase/api/nurseBrowseService';

// Import enhanced date formatting
import { formatShortPremiumDate, formatRelativeTime } from '@/lib/dateFormatting';

interface BrowseNursesCardProps {
  clientId: string;
  onNurseContact?: (nurseId: string, conversationId: string) => void;
}

export default function BrowseNursesCard({ 
  clientId, 
  onNurseContact 
}: BrowseNursesCardProps) {
  const { user } = useAuth();
  const [nurses, setNurses] = useState<(NurseWithDetails & { distance?: number | null; isLocal?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BrowseFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Options for filters
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<string[]>([]);
  
  // Selected nurse for detailed view
  const [selectedNurse, setSelectedNurse] = useState<NurseWithDetails | null>(null);
  const [contactingNurse, setContactingNurse] = useState<string | null>(null);
  
  // Care location info
  const [careLocation, setCareLocation] = useState<any>(null);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load nurses
  useEffect(() => {
    if (clientId) {
      loadNurses();
    }
  }, [clientId, currentPage, filters, searchTerm]);

  const loadFilterOptions = async () => {
    try {
      const [specsResult, licensesResult] = await Promise.all([
        getAvailableSpecializations(),
        getAvailableLicenseTypes()
      ]);

      if (specsResult.data) setSpecializations(specsResult.data);
      if (licensesResult.data) setLicenseTypes(licensesResult.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadNurses = async () => {
    if (!clientId) {
      console.warn('No clientId provided, skipping nurse loading');
      setLoading(false);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(currentPage === 1);
      
      const offset = (currentPage - 1) * pageSize;
      const searchFilters = {
        ...filters,
        searchTerm: searchTerm || undefined
      };

      console.log('Loading nurses with filters:', searchFilters);

      const { data, count, careLocation: location, error } = await browseNurses(
        clientId,
        searchFilters,
        pageSize,
        offset
      );

      if (error) {
        console.error('Browse nurses error:', error);
        throw error;
      }

      console.log('Loaded nurses:', { count, dataLength: data?.length });

      setNurses(data || []);
      setTotalCount(count || 0);
      setCareLocation(location);
    } catch (error: any) {
      console.error('Error loading nurses:', error);
      toast({
        title: "Error loading nurses",
        description: error.message || "Failed to load nurses. Please try again.",
        variant: "destructive"
      });
      
      // Set empty state on error
      setNurses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<BrowseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleContactNurse = async (nurse: NurseWithDetails) => {
    try {
      setContactingNurse(nurse.id);
      
      const { data: conversation, error } = await contactNurse(clientId, nurse.id);
      
      if (error) throw error;

      toast({
        title: "✨ Conversation Started!",
        description: `You can now message ${nurse.first_name} ${nurse.last_name}`,
        duration: 4000
      });

      if (onNurseContact && conversation) {
        onNurseContact(nurse.id, conversation.id);
      }
    } catch (error: any) {
      console.error('Error contacting nurse:', error);
      toast({
        title: "Contact Failed",
        description: error.message || "Failed to start conversation",
        variant: "destructive"
      });
    } finally {
      setContactingNurse(null);
    }
  };

  const formatHourlyRate = (nurse: NurseWithDetails) => {
    const rate = nurse.nurse_preferences?.[0]?.desired_hourly_rate;
    return rate ? `$${rate}/hr` : 'Rate negotiable';
  };

  const getExperience = (nurse: NurseWithDetails) => {
    const experience = nurse.nurse_qualifications?.[0]?.years_experience;
    return experience ? `${experience} years` : 'Experience varies';
  };

  const getSpecializationsText = (nurse: NurseWithDetails) => {
    const specs = nurse.nurse_qualifications?.[0]?.specializations;
    if (!specs || specs.length === 0) return 'General nursing';
    return specs.slice(0, 2).join(', ') + (specs.length > 2 ? '...' : '');
  };

  const getLicenseStatus = (nurse: NurseWithDetails) => {
    const licenses = nurse.nurse_licenses || [];
    const verifiedLicense = licenses.find(l => l.verification_status === 'verified');
    
    if (verifiedLicense) {
      return { status: 'verified', text: 'Verified License', color: 'bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border-emerald-300' };
    } else if (licenses.length > 0) {
      return { status: 'pending', text: 'License Pending', color: 'bg-gradient-to-r from-yellow-100 to-amber-200 text-amber-800 border-amber-300' };
    } else {
      return { status: 'none', text: 'No License', color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300' };
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const NurseCard = ({ nurse }: { nurse: NurseWithDetails & { distance?: number | null; isLocal?: boolean } }) => {
    const licenseStatus = getLicenseStatus(nurse);
    
    return (
      <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
        <CardContent className="p-0">
          {/* Header with Profile Picture */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-xl flex-shrink-0">
                {nurse.profile_photo_url ? (
                  <img 
                    src={nurse.profile_photo_url} 
                    alt={`${nurse.first_name} ${nurse.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white font-bold text-2xl">
                    {nurse.first_name.charAt(0)}{nurse.last_name.charAt(0)}
                  </div>
                )}
                {/* Professional Badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full p-2 shadow-lg">
                  <Star className="h-3 w-3" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-white mb-1 truncate">
                  {nurse.first_name} {nurse.last_name}
                </h3>
                <div className="flex items-center text-blue-100 mb-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{nurse.city}, {nurse.state}</span>
                  {nurse.isLocal && (
                    <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
                      Local
                    </Badge>
                  )}
                </div>
                <Badge className={`${licenseStatus.color} border text-xs`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {licenseStatus.text}
                </Badge>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 opacity-20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute bottom-2 right-4 opacity-10">
              <Crown className="h-8 w-8" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Experience</p>
                  <p className="text-gray-600">{getExperience(nurse)}</p>
                </div>
              </div>
              <div className="flex items-center text-sm bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-3">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Rate</p>
                  <p className="text-gray-600">{formatHourlyRate(nurse)}</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-4">
              <div className="flex items-center text-sm mb-2">
                <Award className="h-4 w-4 mr-2 text-purple-600" />
                <span className="font-medium text-gray-800">Specializations</span>
              </div>
              <p className="text-gray-600 text-sm bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-lg">
                {getSpecializationsText(nurse)}
              </p>
            </div>

            {/* Bio Preview */}
            {nurse.bio && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg italic">
                  "{nurse.bio}"
                </p>
              </div>
            )}

            {/* Premium Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {nurse.nurse_certifications && nurse.nurse_certifications.length > 0 && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  {nurse.nurse_certifications.length} Certification{nurse.nurse_certifications.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {nurse.nurse_licenses && nurse.nurse_licenses.length > 0 && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Licensed
                </Badge>
              )}
              {nurse.nurse_qualifications?.[0]?.years_experience > 5 && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  <Trophy className="h-3 w-3 mr-1" />
                  Experienced
                </Badge>
              )}
            </div>

            {/* Enhanced Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNurse(nurse)}
                className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-all group-hover:shadow-md"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              <Button
                size="sm"
                onClick={() => handleContactNurse(nurse)}
                disabled={contactingNurse === nurse.id}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md transition-all"
              >
                {contactingNurse === nurse.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Contacting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const NurseDetailModal = ({ nurse }: { nurse: NurseWithDetails }) => {
    const licenseStatus = getLicenseStatus(nurse);
    
    return (
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Crown className="h-6 w-6 mr-2 text-indigo-600" />
            Nurse Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden">
            <div className="flex items-start space-x-6 relative z-10">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-8 ring-white shadow-2xl flex-shrink-0">
                {nurse.profile_photo_url ? (
                  <img 
                    src={nurse.profile_photo_url} 
                    alt={`${nurse.first_name} ${nurse.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white font-bold text-4xl">
                    {nurse.first_name.charAt(0)}{nurse.last_name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {nurse.first_name} {nurse.last_name}
                    </h2>
                    <div className="flex items-center text-blue-100 mb-3">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{nurse.street_address}, {nurse.city}, {nurse.state} {nurse.zip_code}</span>
                    </div>
                  </div>
                  <Badge className={`${licenseStatus.color} border text-lg px-4 py-2`}>
                    <Shield className="h-4 w-4 mr-2" />
                    {licenseStatus.text}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{getExperience(nurse)}</div>
                    <div className="text-blue-100 text-sm">Experience</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{formatHourlyRate(nurse)}</div>
                    <div className="text-blue-100 text-sm">Hourly Rate</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{nurse.phone_number}</div>
                    <div className="text-blue-100 text-sm">Phone</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="h-12 w-12" />
            </div>
            <div className="absolute bottom-4 left-8 opacity-10">
              <Crown className="h-16 w-16" />
            </div>
            <div className="absolute top-1/2 right-8 opacity-5">
              <Globe className="h-24 w-24" />
            </div>
          </div>

          {/* Enhanced Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg font-medium">Overview</TabsTrigger>
              <TabsTrigger value="qualifications" className="rounded-lg font-medium">Education</TabsTrigger>
              <TabsTrigger value="licenses" className="rounded-lg font-medium">Licenses</TabsTrigger>
              <TabsTrigger value="certifications" className="rounded-lg font-medium">Certifications</TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg font-medium">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="space-y-6">
                {/* Bio */}
                {nurse.bio && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        About {nurse.first_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-lg leading-relaxed">{nurse.bio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-green-700">{nurse.nurse_qualifications?.length || 0}</p>
                      <p className="text-green-600 font-medium">Qualifications</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-purple-700">{nurse.nurse_licenses?.length || 0}</p>
                      <p className="text-purple-600 font-medium">Licenses</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{nurse.nurse_certifications?.length || 0}</p>
                      <p className="text-blue-600 font-medium">Certifications</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qualifications" className="mt-8">
              {nurse.nurse_qualifications && nurse.nurse_qualifications.length > 0 ? (
                <div className="space-y-6">
                  {nurse.nurse_qualifications.map((qual, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Education Level</label>
                              <p className="text-gray-900 font-medium text-lg">{qual.education_level}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Institution</label>
                              <p className="text-gray-900 font-medium">{qual.school_name}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Experience</label>
                              <p className="text-gray-900 font-medium text-lg">{qual.years_experience} years</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Graduation Year</label>
                              <p className="text-gray-900 font-medium">{qual.graduation_year}</p>
                            </div>
                          </div>
                        </div>
                        
                        {qual.specializations && qual.specializations.length > 0 && (
                          <div className="mt-6">
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Specializations</label>
                            <div className="flex flex-wrap gap-2">
                              {qual.specializations.map((spec, i) => (
                                <Badge key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No education information available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="licenses" className="mt-8">
              {nurse.nurse_licenses && nurse.nurse_licenses.length > 0 ? (
                <div className="space-y-6">
                  {nurse.nurse_licenses.map((license, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">License Type</label>
                              <p className="text-gray-900 font-medium text-lg">{license.license_type}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Issuing State</label>
                              <p className="text-gray-900 font-medium">{license.issuing_state}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">License Number</label>
                              <p className="text-gray-900 font-mono font-medium">{license.license_number}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Expires</label>
                              <p className="text-gray-900 font-medium">
                                {formatShortPremiumDate(license.expiration_date)}
                              </p>
                            </div>
                          </div>
                          <Badge className={
                            license.verification_status === 'verified' 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border-emerald-300'
                              : 'bg-gradient-to-r from-yellow-100 to-amber-200 text-amber-800 border-amber-300'
                          }>
                            <Shield className="h-3 w-3 mr-1" />
                            {license.verification_status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No license information available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="certifications" className="mt-8">
              {nurse.nurse_certifications && nurse.nurse_certifications.length > 0 ? (
                <div className="grid gap-4">
                  {nurse.nurse_certifications.map((cert, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-lg text-gray-900">{cert.certification_name}</p>
                            {cert.is_malpractice_insurance && (
                              <Badge className="mt-2 bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300">
                                <Shield className="h-3 w-3 mr-1" />
                                Malpractice Insurance
                              </Badge>
                            )}
                          </div>
                          {cert.expiration_date && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Expires</p>
                              <p className="font-medium text-gray-900">
                                {formatShortPremiumDate(cert.expiration_date)}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No certifications available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preferences" className="mt-8">
              {nurse.nurse_preferences && nurse.nurse_preferences.length > 0 ? (
                <div className="space-y-6">
                  {nurse.nurse_preferences.map((pref, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Desired Rate</label>
                            <p className="text-gray-900 font-bold text-2xl">${pref.desired_hourly_rate}/hour</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Travel Radius</label>
                            <p className="text-gray-900 font-medium text-lg">{pref.travel_radius} miles</p>
                          </div>
                        </div>
                        
                        {pref.preferred_shifts && pref.preferred_shifts.length > 0 && (
                          <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Preferred Shifts</label>
                            <div className="flex flex-wrap gap-2">
                              {pref.preferred_shifts.map((shift, i) => (
                                <Badge key={i} className="bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {shift}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {pref.availability_types && pref.availability_types.length > 0 && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Availability</label>
                            <div className="flex flex-wrap gap-2">
                              {pref.availability_types.map((type, i) => (
                                <Badge key={i} className="bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border-emerald-300">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No preferences information available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Enhanced Contact Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => setSelectedNurse(null)}
              className="px-8 h-12"
            >
              Close
            </Button>
            <Button
              onClick={() => handleContactNurse(nurse)}
              disabled={contactingNurse === nurse.id}
              className="px-8 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg"
            >
              {contactingNurse === nurse.id ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Contacting...
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact {nurse.first_name}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
              <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding nurses near you...</h3>
            <p className="text-gray-600">Discovering qualified care professionals in your area</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3 flex items-center justify-center">
            <Crown className="h-8 w-8 mr-3 text-indigo-600" />
            Discover Premium Care Professionals
          </h2>
          <p className="text-gray-600 text-lg">Connect with verified, experienced nurses in your area</p>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b border-indigo-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Browse Nurses
                {careLocation && (
                  <Badge variant="outline" className="ml-3 bg-white text-indigo-700 border-indigo-300">
                    <MapPin className="h-3 w-3 mr-1" />
                    Near {careLocation.city}, {careLocation.state}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-indigo-50 hover:border-indigo-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <Badge className="ml-2 bg-indigo-600 text-white text-xs border-0">
                    {Object.keys(filters).length}
                  </Badge>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Enhanced Search */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12 text-base bg-white border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>
              {searchLoading && (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              )}
            </div>

            {/* Enhanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl mb-6 border border-indigo-100">
                <Select
                  value={filters.city || ''}
                  onValueChange={(value) => handleFilterChange({ city: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any City</SelectItem>
                    {careLocation && (
                      <SelectItem value={careLocation.city}>{careLocation.city}</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.minExperience?.toString() || ''}
                  onValueChange={(value) => handleFilterChange({ 
                    minExperience: value ? parseInt(value) : undefined 
                  })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Min Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.maxHourlyRate?.toString() || ''}
                  onValueChange={(value) => handleFilterChange({ 
                    maxHourlyRate: value ? parseInt(value) : undefined 
                  })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Max Rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rate</SelectItem>
                    <SelectItem value="30">Under $30/hr</SelectItem>
                    <SelectItem value="50">Under $50/hr</SelectItem>
                    <SelectItem value="75">Under $75/hr</SelectItem>
                    <SelectItem value="100">Under $100/hr</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="onlyVerified"
                    checked={filters.onlyVerified || false}
                    onChange={(e) => handleFilterChange({ onlyVerified: e.target.checked || undefined })}
                    className="rounded"
                  />
                  <label htmlFor="onlyVerified" className="text-sm font-medium">Verified Only</label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}

            {/* Enhanced Results Summary */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <span className="font-medium">
                🎯 {totalCount} qualified nurse{totalCount !== 1 ? 's' : ''} found
                {careLocation && (
                  <span className="ml-2">
                    • Showing results near {careLocation.city}, {careLocation.state}
                  </span>
                )}
              </span>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Nurses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nurses.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No nurses found
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Try adjusting your search criteria or filters to find more candidates.
              </p>
              <Button variant="outline" onClick={clearFilters} className="px-8">
                Clear all filters
              </Button>
            </div>
          ) : (
            nurses.map((nurse) => (
              <NurseCard key={nurse.id} nurse={nurse} />
            ))
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 h-12"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 ${currentPage === page ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0' : ''}`}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-6 h-12"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Nurse Detail Modal */}
      {selectedNurse && (
        <Dialog open={!!selectedNurse} onOpenChange={() => setSelectedNurse(null)}>
          <NurseDetailModal nurse={selectedNurse} />
        </Dialog>
      )}
    </>
  );
}