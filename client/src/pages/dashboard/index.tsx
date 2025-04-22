import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { StatusCard } from '@/components/dashboard/status-card';
import { ApplicationHistory } from '@/components/dashboard/application-history';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Calendar, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch user's applications
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['/api/applications'],
    enabled: !!user,
  });
  
  // Get most recent application
  const currentApplication = applications?.length > 0 
    ? applications[0] 
    : null;
  
  // Fetch application history for the current application
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: [`/api/applications/${currentApplication?.id}/history`],
    enabled: !!currentApplication?.id,
  });

  if (isLoadingApplications) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-slate-800">Student Dashboard</h1>
      
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-slate-800">Application Status</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Your current application progress and status.</p>
          </div>
          
          {currentApplication ? (
            <div className="border-t border-slate-200">
              <StatusCard 
                applicationId={currentApplication.id}
                status={currentApplication.status}
                updatedAt={currentApplication.updated_at}
              />
              
              {/* Application History */}
              <div className="mt-8 px-6 pb-5">
                {isLoadingHistory ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <ApplicationHistory history={history || []} />
                )}
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-200 px-4 py-5 sm:p-6">
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">You haven't started an application yet.</p>
                <Link href="/dashboard/application">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Start Application
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="absolute top-6 right-6 text-primary-400">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">Important Dates</h3>
            <div className="mt-8">
              <div className="flex items-center justify-between border-t border-slate-100 py-3">
                <div className="text-sm text-slate-500">Application Deadline</div>
                <div className="text-sm font-medium text-slate-900">June 30, 2023</div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 py-3">
                <div className="text-sm text-slate-500">Decision Date</div>
                <div className="text-sm font-medium text-slate-900">July 15, 2023</div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 py-3">
                <div className="text-sm text-slate-500">Enrollment Deadline</div>
                <div className="text-sm font-medium text-slate-900">August 1, 2023</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="absolute top-6 right-6 text-primary-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">Messages</h3>
            <div className="mt-8">
              <div className="border-t border-slate-100 py-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">AD</div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">Admissions Office</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {currentApplication?.status === 'submitted' || currentApplication?.status === 'review'
                        ? "Thank you for your application! We'll be in touch soon with next steps."
                        : "Complete your application to hear from our admissions team."}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(new Date())}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/messages">
                <a className="text-sm font-medium text-primary-600 hover:text-primary-500">View all messages</a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
