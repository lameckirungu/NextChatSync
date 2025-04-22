import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { ApplicationForm } from '@/components/forms/application-form';
import { Loader2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { getStatusText } from '@/lib/utils';

export default function Application() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Extract application ID from URL if present
  const params = new URLSearchParams(location.split('?')[1]);
  const applicationId = params.get('id');
  
  // Fetch application data if ID is provided
  const { data: application, isLoading } = useQuery({
    queryKey: [`/api/applications/${applicationId}`],
    enabled: !!applicationId && !!user,
  });
  
  // If no ID is provided, fetch user's applications to see if they have any
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['/api/applications'],
    enabled: !applicationId && !!user,
  });
  
  const [, navigate] = useLocation();
  
  // If user has applications but no ID is provided, redirect to the most recent one
  useEffect(() => {
    if (!applicationId && !isLoadingApplications && applications && applications.length > 0) {
      navigate(`/dashboard/application?id=${applications[0].id}`);
    }
  }, [applicationId, applications, isLoadingApplications, navigate]);
  
  if (isLoading || isLoadingApplications) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-slate-800">College Application</h1>
      
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-lg font-medium text-slate-800">Application Form</h2>
              {application && (
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === 'draft' ? 'bg-slate-100 text-slate-800' :
                    application.status === 'submitted' || application.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(application.status)}
                  </span>
                  <span className="text-sm text-slate-500">
                    {application.updated_at 
                      ? `Last saved: ${formatDateTime(application.updated_at)}`
                      : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Application Form Component */}
          <ApplicationForm 
            application={application} 
            onSaveDraft={() => {}} 
            onSubmit={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </div>
  );
}
