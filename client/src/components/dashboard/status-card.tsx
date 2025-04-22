import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusText } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

interface StatusCardProps {
  applicationId?: number;
  status: string;
  updatedAt?: string;
}

export function StatusCard({ applicationId, status, updatedAt }: StatusCardProps) {
  const statusColors = getStatusColor(status);
  const statusDisplay = getStatusText(status);
  
  const statusIcon = useMemo(() => {
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
  }, [status]);
  
  const statusMessage = useMemo(() => {
    switch (status) {
      case 'draft':
        return "Your application is in progress. Complete it and submit before the deadline.";
      case 'submitted':
        return "Your application has been submitted successfully.";
      case 'review':
        return "Your application is being reviewed by our admissions team.";
      case 'accepted':
        return "Congratulations! Your application has been accepted.";
      case 'rejected':
        return "We regret to inform you that your application has been rejected.";
      default:
        return "Application status unavailable.";
    }
  }, [status]);
  
  // Timeline steps
  const steps = [
    { name: 'Started', completed: true },
    { name: 'Submitted', completed: status !== 'draft' },
    { name: 'Review', completed: status === 'review' || status === 'accepted' || status === 'rejected' },
    { name: 'Decision', completed: status === 'accepted' || status === 'rejected' },
    { name: 'Enrolled', completed: false }, // Assume enrollment is a future step
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-full bg-${status === 'draft' ? 'slate' : status === 'submitted' || status === 'review' ? 'yellow' : status === 'accepted' ? 'green' : 'red'}-100 flex items-center justify-center`}>
              {statusIcon}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-slate-800">{statusDisplay}</h3>
            <p className="text-sm text-slate-500">{statusMessage}</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}>
              {statusDisplay}
            </span>
          </div>
        </div>
        
        {/* Status Timeline */}
        <div className="mt-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.name} className="flex items-center relative">
                <div className={`h-5 w-5 rounded-full ${step.completed ? 'bg-green-500' : 'bg-slate-200'} flex items-center justify-center z-10`}>
                  {step.completed && (
                    <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 ${index < steps.findIndex(s => !s.completed) - 1 ? 'bg-green-500' : index === steps.findIndex(s => !s.completed) - 1 ? 'bg-yellow-500' : 'bg-slate-200'} absolute top-2.5 left-5`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex text-xs mt-2">
            {steps.map((step, index) => (
              <div key={`label-${step.name}`} className={`${index === 0 ? 'w-12' : index === 1 ? 'w-28 ml-3' : 'w-16 ml-3'} text-center`}>{step.name}</div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex">
          {applicationId && (
            <Link href={`/dashboard/application?id=${applicationId}`}>
              <Button>
                {status === 'draft' ? 'Continue Application' : 'View Application'}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
