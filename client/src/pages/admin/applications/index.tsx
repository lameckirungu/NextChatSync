import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusText, formatDate } from '@/lib/utils';
import { Loader2, Search, Filter, ChevronRight } from 'lucide-react';

export default function AdminApplications() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch all applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['/api/applications'],
  });

  // Filter applications based on search term and status filter
  const filteredApplications = applications?.filter((app: any) => {
    const matchesSearch = searchTerm === '' || 
      (app.form_data?.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.form_data?.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.form_data?.personalInfo?.nationalIdNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle navigation to application details
  const goToApplication = (id: number) => {
    navigate(`/admin/applications/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Applications</h1>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search by name or ID..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="pl-10 w-full sm:w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Application statistics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <p className="text-xl font-semibold mt-1">{applications?.length || 0}</p>
              </div>
              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">All</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Submitted</p>
                <p className="text-xl font-semibold mt-1">
                  {applications?.filter((app: any) => app.status === 'submitted').length || 0}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Under Review</p>
                <p className="text-xl font-semibold mt-1">
                  {applications?.filter((app: any) => app.status === 'review').length || 0}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Accepted</p>
                <p className="text-xl font-semibold mt-1">
                  {applications?.filter((app: any) => app.status === 'accepted').length || 0}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rejected</p>
                <p className="text-xl font-semibold mt-1">
                  {applications?.filter((app: any) => app.status === 'rejected').length || 0}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Program
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Documents
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredApplications?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {applications?.length === 0 ? (
                      <div>
                        <p className="text-lg font-medium">No applications found</p>
                        <p className="mt-1">There are no applications submitted yet.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">No matching applications</p>
                        <p className="mt-1">Try adjusting your search or filter criteria.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredApplications?.map((application: any) => {
                  const personalInfo = application.form_data?.personalInfo || {};
                  const programInfo = application.form_data?.programInfo || {};
                  const statusColors = getStatusColor(application.status);
                  
                  return (
                    <tr 
                      key={application.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => goToApplication(application.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {personalInfo.firstName} {personalInfo.lastName}
                            </div>
                            <div className="text-sm text-slate-500">
                              ID: {personalInfo.nationalIdNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{programInfo.firstChoice || 'Not specified'}</div>
                        <div className="text-xs text-slate-500">{programInfo.admissionType || 'Regular'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {application.status !== 'draft' ? formatDate(application.updated_at) : 'Not submitted'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {application.documents_count || 0} document(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ChevronRight className="h-5 w-5 text-slate-400 inline-block" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}