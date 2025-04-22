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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getStatusColor, getStatusText, formatDate } from '@/lib/utils';
import { Loader2, ArrowLeft, Clock, CheckCircle, AlertCircle, File, FileText, Image } from 'lucide-react';

export default function ApplicationDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
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
  
  const personalInfo = application.form_data?.personalInfo || {};
  const educationInfo = application.form_data?.educationInfo || {};
  const programInfo = application.form_data?.programInfo || {};
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
  
  // Helper function to get file icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-5 w-5 text-slate-400" />;
    } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-slate-400" />;
    } else {
      return <File className="h-5 w-5 text-slate-400" />;
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
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Personal Information</h3>
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-slate-500">First Name</dt>
                      <dd className="mt-1 text-sm text-slate-900">{personalInfo.firstName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Last Name</dt>
                      <dd className="mt-1 text-sm text-slate-900">{personalInfo.lastName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-slate-900">{personalInfo.dob}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Phone Number</dt>
                      <dd className="mt-1 text-sm text-slate-900">{personalInfo.phone}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-slate-500">Address</dt>
                      <dd className="mt-1 text-sm text-slate-900">
                        {personalInfo.address}, {personalInfo.city}, {personalInfo.zipCode}
                      </dd>
                    </div>
                  </div>
                </div>
                
                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Education</h3>
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-slate-700">High School</h4>
                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-slate-500">School Name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{educationInfo.highSchool?.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Location</dt>
                        <dd className="mt-1 text-sm text-slate-900">{educationInfo.highSchool?.city}, {educationInfo.highSchool?.state}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">Date Range</dt>
                        <dd className="mt-1 text-sm text-slate-900">{educationInfo.highSchool?.startDate} to {educationInfo.highSchool?.endDate}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-500">GPA</dt>
                        <dd className="mt-1 text-sm text-slate-900">{educationInfo.highSchool?.gpa}</dd>
                      </div>
                    </div>
                  </div>
                  
                  {educationInfo.college?.attended && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-slate-700">College</h4>
                      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-slate-500">School Name</dt>
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
                          <dt className="text-sm font-medium text-slate-500">GPA</dt>
                          <dd className="mt-1 text-sm text-slate-900">{educationInfo.college?.gpa}</dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Program Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Program Information</h3>
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Program Type</dt>
                      <dd className="mt-1 text-sm text-slate-900 capitalize">{programInfo.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Intended Major</dt>
                      <dd className="mt-1 text-sm text-slate-900">
                        {programInfo.major === 'computerScience' ? 'Computer Science' :
                         programInfo.major === 'business' ? 'Business Administration' :
                         programInfo.major === 'psychology' ? 'Psychology' :
                         programInfo.major === 'biology' ? 'Biology' :
                         programInfo.major === 'engineering' ? 'Engineering' :
                         programInfo.major === 'arts' ? 'Liberal Arts' : programInfo.major}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Start Term</dt>
                      <dd className="mt-1 text-sm text-slate-900">
                        {programInfo.startTerm === 'fall2023' ? 'Fall 2023' :
                         programInfo.startTerm === 'spring2024' ? 'Spring 2024' :
                         programInfo.startTerm === 'fall2024' ? 'Fall 2024' : programInfo.startTerm}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Campus</dt>
                      <dd className="mt-1 text-sm text-slate-900 capitalize">
                        {programInfo.campus === 'main' ? 'Main Campus' :
                         programInfo.campus === 'downtown' ? 'Downtown Campus' :
                         programInfo.campus === 'online' ? 'Online' : programInfo.campus}
                      </dd>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-slate-500">Why do you want to study at our institution?</dt>
                    <dd className="mt-1 text-sm text-slate-900">{programInfo.question}</dd>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Documents Section */}
              <Card className="bg-slate-50">
                <CardContent className="p-4">
                  <h3 className="text-md font-medium text-slate-800">Documents</h3>
                  {isLoadingDocuments ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                    </div>
                  ) : documents && documents.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {documents.map((doc: any) => (
                        <li key={doc.id} className="flex items-start">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.file_name)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-slate-700">{doc.file_name}</p>
                            <p className="mt-1 text-xs text-slate-500">Uploaded on {formatDate(doc.uploaded_at)}</p>
                            <div className="mt-1">
                              {doc.url ? (
                                <a 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary-600 hover:text-primary-500"
                                >
                                  Download
                                </a>
                              ) : (
                                <span className="text-xs text-slate-500">No download link available</span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">No documents uploaded yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Notes Section */}
              <Card className="mt-6 bg-slate-50">
                <CardContent className="p-4">
                  <h3 className="text-md font-medium text-slate-800">Reviewer Notes</h3>
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add a note..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSaveNote}
                        disabled={saveNote.isPending || !notes.trim()}
                      >
                        {saveNote.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Note"
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* History entries that include notes */}
                  {isLoadingHistory ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                    </div>
                  ) : history && history.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {history
                        .filter((item: any) => item.notes)
                        .map((item: any) => (
                          <div key={item.id} className="border-t border-slate-200 pt-4">
                            <p className="text-sm text-slate-700">{item.notes}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-xs text-slate-500">Admin - {formatDate(item.created_at)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
              
              {/* Review Timeline */}
              <Card className="mt-6 bg-slate-50">
                <CardContent className="p-4">
                  <h3 className="text-md font-medium text-slate-800">Review Timeline</h3>
                  {isLoadingHistory ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                    </div>
                  ) : history && history.length > 0 ? (
                    <div className="mt-4 space-y-6">
                      {history.map((item: any, index: number) => (
                        <div key={item.id} className="relative flex gap-x-4">
                          {index < history.length - 1 && (
                            <div className="absolute left-0 top-0 flex w-6 justify-center -bottom-6">
                              <div className="w-px bg-slate-300"></div>
                            </div>
                          )}
                          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                            <div className={`h-1.5 w-1.5 rounded-full ${
                              index === 0 ? 'bg-slate-100 ring-1 ring-slate-300' : 'bg-green-100 ring-1 ring-green-300'
                            }`}></div>
                          </div>
                          <div className="flex-auto py-0.5 text-xs text-slate-500">
                            <span className="font-medium text-slate-900">{getStatusText(item.status)}</span>
                            {item.notes ? ` - ${item.notes}` : null}
                          </div>
                          <time className="flex-none py-0.5 text-xs text-slate-500">
                            {index === 0 ? 'Now' : formatDate(item.created_at)}
                          </time>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">No timeline available.</p>
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
