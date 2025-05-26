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
  User
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
        title: "Conversation Started",
        description: `You can now message ${nurse.first_name} ${nurse.last_name}`
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
      return { status: 'verified', text: 'Verified License', color: 'bg-green-100 text-green-800' };
    } else if (licenses.length > 0) {
      return { status: 'pending', text: 'License Pending', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'none', text: 'No License', color: 'bg-red-100 text-red-800' };
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const NurseCard = ({ nurse }: { nurse: NurseWithDetails & { distance?: number | null; isLocal?: boolean } }) => {
    const licenseStatus = getLicenseStatus(nurse);
    
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Profile Photo */}
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {nurse.profile_photo_url ? (
                <img 
                  src={nurse.profile_photo_url} 
                  alt={`${nurse.first_name} ${nurse.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                  {nurse.first_name.charAt(0)}{nurse.last_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {nurse.first_name} {nurse.last_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {nurse.city}, {nurse.state}
                    {nurse.isLocal && (
                      <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                        Local
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className={`${licenseStatus.color} text-xs`}>
                  {licenseStatus.text}
                </Badge>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {getExperience(nurse)}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {formatHourlyRate(nurse)}
                </div>
                <div className="flex items-center text-gray-600 col-span-2">
                  <Award className="h-4 w-4 mr-2" />
                  {getSpecializationsText(nurse)}
                </div>
              </div>

              {/* Bio Preview */}
              {nurse.bio && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {nurse.bio}
                </p>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNurse(nurse)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleContactNurse(nurse)}
                  disabled={contactingNurse === nurse.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
          </div>
        </CardContent>
      </Card>
    );
  };

  const NurseDetailModal = ({ nurse }: { nurse: NurseWithDetails }) => {
    const licenseStatus = getLicenseStatus(nurse);
    
    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {nurse.first_name} {nurse.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {nurse.profile_photo_url ? (
                <img 
                  src={nurse.profile_photo_url} 
                  alt={`${nurse.first_name} ${nurse.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                  {nurse.first_name.charAt(0)}{nurse.last_name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {nurse.first_name} {nurse.last_name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {nurse.street_address}, {nurse.city}, {nurse.state} {nurse.zip_code}
                  </div>
                </div>
                <Badge className={`${licenseStatus.color}`}>
                  {licenseStatus.text}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Experience:</span>
                  <p className="text-gray-600">{getExperience(nurse)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Rate:</span>
                  <p className="text-gray-600">{formatHourlyRate(nurse)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Phone:</span>
                  <p className="text-gray-600">{nurse.phone_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {nurse.bio && (
            <div>
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-gray-700">{nurse.bio}</p>
            </div>
          )}

          {/* Qualifications */}
          {nurse.nurse_qualifications && nurse.nurse_qualifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Education & Experience
              </h3>
              {nurse.nurse_qualifications.map((qual, index) => (
                <Card key={index} className="mb-3">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Education:</span>
                        <p className="text-gray-600">{qual.education_level}</p>
                      </div>
                      <div>
                        <span className="font-medium">School:</span>
                        <p className="text-gray-600">{qual.school_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Experience:</span>
                        <p className="text-gray-600">{qual.years_experience} years</p>
                      </div>
                      <div>
                        <span className="font-medium">Graduated:</span>
                        <p className="text-gray-600">{qual.graduation_year}</p>
                      </div>
                    </div>
                    {qual.specializations && qual.specializations.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium">Specializations:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {qual.specializations.map((spec, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
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
          )}

          {/* Licenses */}
          {nurse.nurse_licenses && nurse.nurse_licenses.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Licenses
              </h3>
              <div className="grid gap-3">
                {nurse.nurse_licenses.map((license, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <span className="font-medium">Type:</span>
                            <p className="text-gray-600">{license.license_type}</p>
                          </div>
                          <div>
                            <span className="font-medium">State:</span>
                            <p className="text-gray-600">{license.issuing_state}</p>
                          </div>
                          <div>
                            <span className="font-medium">Number:</span>
                            <p className="text-gray-600 font-mono">{license.license_number}</p>
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span>
                            <p className="text-gray-600">
                              {new Date(license.expiration_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          license.verification_status === 'verified' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {license.verification_status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {nurse.nurse_certifications && nurse.nurse_certifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </h3>
              <div className="grid gap-2">
                {nurse.nurse_certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{cert.certification_name}</span>
                      {cert.is_malpractice_insurance && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                          Malpractice Insurance
                        </Badge>
                      )}
                    </div>
                    {cert.expiration_date && (
                      <span className="text-sm text-gray-600">
                        Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {nurse.nurse_preferences && nurse.nurse_preferences.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Work Preferences
              </h3>
              {nurse.nurse_preferences.map((pref, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="font-medium">Desired Rate:</span>
                        <p className="text-gray-600">${pref.desired_hourly_rate}/hour</p>
                      </div>
                      <div>
                        <span className="font-medium">Travel Radius:</span>
                        <p className="text-gray-600">{pref.travel_radius} miles</p>
                      </div>
                    </div>
                    
                    {pref.preferred_shifts && pref.preferred_shifts.length > 0 && (
                      <div className="mb-3">
                        <span className="font-medium">Preferred Shifts:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pref.preferred_shifts.map((shift, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {shift}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {pref.availability_types && pref.availability_types.length > 0 && (
                      <div>
                        <span className="font-medium">Availability:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pref.availability_types.map((type, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
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
          )}

          {/* Contact Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setSelectedNurse(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => handleContactNurse(nurse)}
              disabled={contactingNurse === nurse.id}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {contactingNurse === nurse.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Contacting...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
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
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Finding nurses near you...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Browse Nurses
                {careLocation && (
                  <Badge variant="outline" className="ml-3">
                    Near {careLocation.city}, {careLocation.state}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white text-xs">
                    {Object.keys(filters).length}
                  </Badge>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchLoading && (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <Select
                  value={filters.city || ''}
                  onValueChange={(value) => handleFilterChange({ city: value || undefined })}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="onlyVerified"
                    checked={filters.onlyVerified || false}
                    onChange={(e) => handleFilterChange({ onlyVerified: e.target.checked || undefined })}
                  />
                  <label htmlFor="onlyVerified" className="text-sm">Verified Only</label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
              <span>
                {totalCount} nurse{totalCount !== 1 ? 's' : ''} found
                {careLocation && (
                  <span className="ml-1">
                    • Showing results near {careLocation.city}, {careLocation.state}
                  </span>
                )}
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Nurses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nurses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No nurses found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            nurses.map((nurse) => (
              <NurseCard key={nurse.id} nurse={nurse} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Nurse Detail Modal */}
      {selectedNurse && (
        <Dialog open={!!selectedNurse} onOpenChange={() => setSelectedNurse(null)}>
          <NurseDetailModal nurse={selectedNurse} />
        </Dialog>
      )}
    </>
  );
}