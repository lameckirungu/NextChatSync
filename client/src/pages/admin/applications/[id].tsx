import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getStatusColor, getStatusText, formatDate, getFileIconByName } from '@/lib/utils';
import { Loader2, ArrowLeft, Clock, CheckCircle, AlertCircle, File, FileText, Image, Download, MessageCircle, Calendar } from 'lucide-react';

export default function ApplicationDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  
  // Extract application ID from URL
  const applicationId = location.split('/').pop();
  
  // Fetch application details
  const { data: application, isLoading: isLoadingApplication } = useQuery({
    queryKey: [`/api/applications/${applicationId}`],
    enabled: !!applicationId && !!user,
  });
  
  // Fetch application documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: [`/api/applications/${applicationId}/documents`],
    enabled: !!applicationId && !!user,
  });
  
  // Fetch application history
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: [`/api/applications/${applicationId}/history`],
    enabled: !!applicationId && !!user,
  });
  
  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string, notes?: string }) => {
      return apiRequest('PUT', `/api/applications/${applicationId}/status`, {
        status,
        notes
      });
    },
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: 'The application status has been updated successfully.',
      });
      
      // Refetch queries to update UI
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/history`] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      
      // Reset form
      setNotes('');
      setSelectedStatus('');
    },
    onError: (error) => {
      toast({
        title: 'Failed to update status',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  // Save review note
  const saveNote = useMutation({
    mutationFn: async (notes: string) => {
      return apiRequest('POST', `/api/applications/${applicationId}/notes`, { notes });
    },
    onSuccess: () => {
      toast({
        title: 'Note saved',
        description: 'Your review note has been saved successfully.',
      });
      
      // Refetch history to update UI
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/history`] });
      
      // Reset form
      setNotes('');
    },
    onError: (error) => {
      toast({
        title: 'Failed to save note',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({ status, notes: notes.trim() || undefined });
  };
  
  const handleSaveNote = () => {
    if (notes.trim()) {
      saveNote.mutate(notes);
    }
  };
  
  // Loading state
  if (isLoadingApplication) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  // Not found state
  if (!application) {
    return (
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/applications')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <h1 className="text-2xl font-semibold text-slate-800">Application Not Found</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-slate-800 mb-2">Application Not Found</h2>
            <p className="text-slate-600 mb-6">The application you are looking for does not exist or you do not have permission to view it.</p>
            <Button onClick={() => navigate('/admin/applications')}>
              Return to Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const formData = application.form_data || {};
  const personalInfo = formData.personalInfo || {};
  const educationInfo = formData.educationInfo || {};
  const programInfo = formData.programInfo || {};
  const medicalInfo = formData.medicalInfo || {};
  const interests = formData.interests || {};
  const accommodation = formData.accommodation || {};
  const statusColors = getStatusColor(application.status);
  
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-6 w-6 text-slate-600" />;
      case 'submitted':
      case 'review':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-slate-600" />;
    }
  };
  
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button variant="outline" onClick={() => navigate('/admin/applications')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-slate-800">Application Details</h1>
        </div>
        
        <div className="flex space-x-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="bg-green-600 hover:bg-green-700">
                Accept
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to accept this application? This will notify the applicant.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange('accepted')}>
                  {updateStatusMutation.isPending ? 'Processing...' : 'Accept Application'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="bg-red-600 hover:bg-red-700">
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this application? This will notify the applicant.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange('rejected')}>
                  {updateStatusMutation.isPending ? 'Processing...' : 'Reject Application'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                Request Info
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Additional Information</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the application to "Under Review" status and notify the applicant that additional information is needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Enter details about what additional information is needed..."
                className="mt-2 mb-4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange('review')}>
                  {updateStatusMutation.isPending ? 'Processing...' : 'Request Information'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-slate-800">{personalInfo.firstName} {personalInfo.lastName}</h2>
              <p className="mt-1 text-sm text-slate-500">Submitted on {formatDate(application.updated_at)}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} mt-2 sm:mt-0`}>
              {getStatusText(application.status)}
            </span>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="col-span-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 grid grid-cols-6 gap-2">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="program">Program</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="interests">Interests</TabsTrigger>
                  <TabsTrigger value="accommodation">Housing</TabsTrigger>
                </TabsList>
                
                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Personal Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">First Name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.firstName || personalInfo.surname}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Middle Name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.middleName || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Last Name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.lastName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">National ID</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.nationalIdNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Date of Birth</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.dateOfBirth || personalInfo.dob}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Gender</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.gender}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Phone Number</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.phoneNumber || personalInfo.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Email</dt>
                        <dd className="mt-1 text-sm text-slate-900">{personalInfo.email}</dd>
                      </div>
                      
                      {/* Contact Address */}
                      <div className="sm:col-span-2">
                        <h4 className="text-md font-medium text-slate-700 mt-2">Contact Address</h4>
                      </div>
                      {personalInfo.address && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-slate-500">Address</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {personalInfo.address}, {personalInfo.city}, {personalInfo.zipCode}
                          </dd>
                        </div>
                      )}
                      {personalInfo.contactAddress && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">P.O. Box</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.contactAddress.poBox}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Postal Code</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.contactAddress.postalCode}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Town</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.contactAddress.town}</dd>
                          </div>
                        </>
                      )}
                      
                      {/* Parent/Guardian Information */}
                      <div className="sm:col-span-2">
                        <h4 className="text-md font-medium text-slate-700 mt-4">Parent/Guardian Information</h4>
                      </div>
                      {personalInfo.parent && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Name</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.parent.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Phone Number</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.parent.phoneNumber}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Occupation</dt>
                            <dd className="mt-1 text-sm text-slate-900">{personalInfo.parent.occupation}</dd>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Education</h3>
                    
                    {/* Secondary School Information */}
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-slate-700">Secondary School</h4>
                      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-slate-500">School Name</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.name || educationInfo.highSchool?.name || 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-500">Location</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.location || 
                             (educationInfo.highSchool?.city && `${educationInfo.highSchool?.city}, ${educationInfo.highSchool?.state}`) || 
                             'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-500">Start Date</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.startDate || educationInfo.highSchool?.startDate || 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-500">End Date</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.endDate || educationInfo.highSchool?.endDate || 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-500">KCSE Grade</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.grade || educationInfo.highSchool?.gpa || 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-500">Index Number</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {educationInfo.secondarySchool?.indexNumber || 'N/A'}
                          </dd>
                        </div>
                      </div>
                    </div>
                    
                    {/* Previous College/University */}
                    {(educationInfo.college?.attended || educationInfo.previousInstitutions?.length > 0) && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-slate-700">Previous Institutions</h4>
                        
                        {educationInfo.college?.attended && (
                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Institution Name</dt>
                              <dd className="mt-1 text-sm text-slate-900">{educationInfo.college?.name}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Location</dt>
                              <dd className="mt-1 text-sm text-slate-900">{educationInfo.college?.city}, {educationInfo.college?.state}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Date Range</dt>
                              <dd className="mt-1 text-sm text-slate-900">{educationInfo.college?.startDate} to {educationInfo.college?.endDate}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">GPA/Grade</dt>
                              <dd className="mt-1 text-sm text-slate-900">{educationInfo.college?.gpa || 'N/A'}</dd>
                            </div>
                          </div>
                        )}
                        
                        {educationInfo.previousInstitutions?.map((institution: any, index: number) => (
                          <div key={index} className="mt-4 border-t border-slate-100 pt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Institution Name</dt>
                              <dd className="mt-1 text-sm text-slate-900">{institution.name}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Location</dt>
                              <dd className="mt-1 text-sm text-slate-900">{institution.location}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Date Range</dt>
                              <dd className="mt-1 text-sm text-slate-900">{institution.startDate} to {institution.endDate}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-slate-500">Qualification Obtained</dt>
                              <dd className="mt-1 text-sm text-slate-900">{institution.qualification || 'N/A'}</dd>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Program Tab */}
                <TabsContent value="program" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Program Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Admission Type</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.admissionType || 'Regular'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Academic Level</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.academicLevel || 'Undergraduate'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">First Choice Program</dt>
                        <dd className="mt-1 text-sm text-slate-900 font-medium">{programInfo.firstChoice}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Second Choice Program</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.secondChoice || 'None'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Third Choice Program</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.thirdChoice || 'None'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Preferred Campus</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.campus || 'Main Campus'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Mode of Study</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.modeOfStudy || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Entry Term</dt>
                        <dd className="mt-1 text-sm text-slate-900">{programInfo.entryTerm || 'N/A'}</dd>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Medical Tab */}
                <TabsContent value="medical" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Medical Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Blood Group</dt>
                        <dd className="mt-1 text-sm text-slate-900">{medicalInfo.bloodGroup || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Has Chronic Illness</dt>
                        <dd className="mt-1 text-sm text-slate-900">{medicalInfo.hasChronicIllness ? 'Yes' : 'No'}</dd>
                      </div>
                      
                      {medicalInfo.hasChronicIllness && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-slate-500">Chronic Illness Details</dt>
                          <dd className="mt-1 text-sm text-slate-900">{medicalInfo.chronicIllnessDetails || 'No details provided'}</dd>
                        </div>
                      )}
                      
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Needs Special Diet</dt>
                        <dd className="mt-1 text-sm text-slate-900">{medicalInfo.needsSpecialDiet ? 'Yes' : 'No'}</dd>
                      </div>
                      
                      {medicalInfo.needsSpecialDiet && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-slate-500">Special Diet Details</dt>
                          <dd className="mt-1 text-sm text-slate-900">{medicalInfo.specialDietDetails || 'No details provided'}</dd>
                        </div>
                      )}
                      
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Has Medical Insurance</dt>
                        <dd className="mt-1 text-sm text-slate-900">{medicalInfo.hasMedicalInsurance ? 'Yes' : 'No'}</dd>
                      </div>
                      
                      {medicalInfo.hasMedicalInsurance && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Insurance Provider</dt>
                            <dd className="mt-1 text-sm text-slate-900">{medicalInfo.insuranceProvider}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Policy Number</dt>
                            <dd className="mt-1 text-sm text-slate-900">{medicalInfo.insurancePolicyNumber}</dd>
                          </div>
                        </>
                      )}
                      
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-slate-500">Allergies</dt>
                        <dd className="mt-1 text-sm text-slate-900">{medicalInfo.allergies || 'None'}</dd>
                      </div>
                      
                      {/* Emergency Contact */}
                      <div className="sm:col-span-2">
                        <h4 className="text-md font-medium text-slate-700 mt-4">Emergency Contact</h4>
                      </div>
                      
                      {medicalInfo.emergencyContact && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Name</dt>
                            <dd className="mt-1 text-sm text-slate-900">{medicalInfo.emergencyContact.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Relationship</dt>
                            <dd className="mt-1 text-sm text-slate-900">{medicalInfo.emergencyContact.relationship}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Phone Number</dt>
                            <dd className="mt-1 text-sm text-slate-900">{medicalInfo.emergencyContact.phone}</dd>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Interests Tab */}
                <TabsContent value="interests" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Interests and Activities</h3>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Sports Interests</dt>
                        <dd className="mt-1 text-sm text-slate-900">{interests.sports || 'None specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Clubs & Societies Interests</dt>
                        <dd className="mt-1 text-sm text-slate-900">{interests.clubs || 'None specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Hobbies & Talents</dt>
                        <dd className="mt-1 text-sm text-slate-900">{interests.hobbies || 'None specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Career Goals</dt>
                        <dd className="mt-1 text-sm text-slate-900">{interests.careerGoals || 'None specified'}</dd>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Accommodation Tab */}
                <TabsContent value="accommodation" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Accommodation Preferences</h3>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Needs University Accommodation</dt>
                        <dd className="mt-1 text-sm text-slate-900">{accommodation.needsAccommodation ? 'Yes' : 'No'}</dd>
                      </div>
                      
                      {accommodation.needsAccommodation && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Room Preference</dt>
                            <dd className="mt-1 text-sm text-slate-900">{accommodation.roomPreference || 'Not specified'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-slate-500">Special Accommodation Requests</dt>
                            <dd className="mt-1 text-sm text-slate-900">{accommodation.specialRequest || 'None'}</dd>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Alternative Address</dt>
                        <dd className="mt-1 text-sm text-slate-900">
                          {accommodation.alternativeAddress || 'Not provided'}
                        </dd>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              {/* Documents Section */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Documents</h3>
                  
                  {isLoadingDocuments ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    </div>
                  ) : documents?.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      No documents uploaded
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents?.map((doc: any) => (
                        <div key={doc.id} className="p-3 border border-slate-200 rounded-md flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIconByName(doc.file_name)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{doc.file_name}</p>
                            <p className="text-xs text-slate-500">
                              {doc.document_type} • Uploaded {formatDate(doc.created_at)}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-shrink-0 ml-2" 
                            onClick={() => window.open(`/api/documents/${doc.id}`, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Review Notes Section */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Add Review Note</h3>
                  <Textarea
                    placeholder="Add notes about this application..."
                    className="mb-4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <Button 
                    onClick={handleSaveNote} 
                    className="w-full"
                    disabled={!notes.trim() || saveNote.isPending}
                  >
                    {saveNote.isPending ? 'Saving...' : 'Save Note'}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Application History */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Application History</h3>
                  
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    </div>
                  ) : history?.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      No history available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history?.map((item: any) => {
                        const statusColors = getStatusColor(item.status);
                        return (
                          <div key={item.id} className="border-l-2 border-slate-200 pl-4 py-2">
                            <div className="flex items-start">
                              <div className="mr-2 mt-0.5">
                                {item.status ? (
                                  getStatusIcon(item.status)
                                ) : (
                                  <MessageCircle className="h-5 w-5 text-slate-400" />
                                )}
                              </div>
                              <div className="flex-grow">
                                {item.status ? (
                                  <p className="text-sm font-medium text-slate-800">
                                    Status changed to <span className={statusColors.text}>{getStatusText(item.status)}</span>
                                  </p>
                                ) : (
                                  <p className="text-sm font-medium text-slate-800">Review note added</p>
                                )}
                                {item.notes && (
                                  <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(item.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}