import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getStatusColor, getStatusText, formatDate } from '@/lib/utils';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Applications() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Parse URL params
  const params = new URLSearchParams(location.split('?')[1]);
  const statusFilter = params.get('status') || '';
  const page = parseInt(params.get('page') || '1');
  const perPage = 10;
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusValue, setStatusValue] = useState(statusFilter);
  
  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (statusValue) newParams.set('status', statusValue);
    if (page > 1) newParams.set('page', page.toString());
    
    const newLocation = newParams.toString() ? `/admin/applications?${newParams.toString()}` : '/admin/applications';
    setLocation(newLocation);
  }, [statusValue, page, setLocation]);
  
  // Fetch applications
  const { data: allApplications, isLoading } = useQuery({
    queryKey: ['/api/applications'],
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  // Apply filters
  let filteredApplications = allApplications || [];
  
  if (statusFilter) {
    filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredApplications = filteredApplications.filter(app => {
      const firstName = app.form_data?.personalInfo?.firstName?.toLowerCase() || '';
      const lastName = app.form_data?.personalInfo?.lastName?.toLowerCase() || '';
      const email = app.form_data?.personalInfo?.email?.toLowerCase() || '';
      
      return firstName.includes(query) || lastName.includes(query) || email.includes(query);
    });
  }
  
  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / perPage);
  const paginatedApplications = filteredApplications.slice((page - 1) * perPage, page * perPage);
  
  // Handle pagination
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(params);
      newParams.set('page', newPage.toString());
      setLocation(`/admin/applications?${newParams.toString()}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-slate-800">Applications</h1>
      
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={statusValue}
                onValueChange={setStatusValue}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Applications Table */}
            {paginatedApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[250px]">Applicant</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-slate-200">
                    {paginatedApplications.map((application) => {
                      const personalInfo = application.form_data?.personalInfo || {};
                      const programInfo = application.form_data?.programInfo || {};
                      const statusColors = getStatusColor(application.status);
                      
                      return (
                        <TableRow key={application.id}>
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 flex-shrink-0 bg-slate-100 text-slate-700">
                                <AvatarFallback>
                                  {`${personalInfo.firstName?.[0] || ''}${personalInfo.lastName?.[0] || ''}`}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {personalInfo.firstName} {personalInfo.lastName}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {personalInfo.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              {programInfo.major === 'computerScience' ? 'Computer Science' :
                              programInfo.major === 'business' ? 'Business Administration' :
                              programInfo.major === 'psychology' ? 'Psychology' :
                              programInfo.major === 'biology' ? 'Biology' :
                              programInfo.major === 'engineering' ? 'Engineering' :
                              programInfo.major === 'arts' ? 'Liberal Arts' : programInfo.major}
                            </div>
                            <div className="text-sm text-slate-500 capitalize">
                              {programInfo.type}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap text-sm text-slate-500">
                            {application.status !== 'draft' ? formatDate(application.updated_at) : '-'}
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                              {getStatusText(application.status)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/applications/${application.id}`}>
                              <a className="text-primary-600 hover:text-primary-900">
                                {application.status === 'submitted' ? 'Review' : 'View'}
                              </a>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No applications found matching your criteria.
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 mt-4 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Showing <span className="font-medium">{(page - 1) * perPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * perPage, filteredApplications.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredApplications.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        variant="outline"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === page 
                              ? 'bg-primary-50 text-primary-600'
                              : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
