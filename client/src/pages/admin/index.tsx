import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ClipboardList, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  // Fetch all applications for statistics
  const { data: applications, isLoading } = useQuery({
    queryKey: ['/api/applications'],
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Calculate statistics
  const totalApplications = applications?.length || 0;
  const pendingReview = applications?.filter(app => app.status === 'submitted' || app.status === 'review').length || 0;
  const accepted = applications?.filter(app => app.status === 'accepted').length || 0;
  const rejected = applications?.filter(app => app.status === 'rejected').length || 0;
  const drafts = applications?.filter(app => app.status === 'draft').length || 0;
  
  // Status distribution for pie chart
  const statusData = [
    { name: 'Draft', value: drafts, color: '#94a3b8' },
    { name: 'Submitted/Review', value: pendingReview, color: '#fbbf24' },
    { name: 'Accepted', value: accepted, color: '#22c55e' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
  ];
  
  // Applications by major (transform data from applications)
  const applicationsByMajor = applications?.reduce((acc, app) => {
    const major = app.form_data?.programInfo?.major || 'Unknown';
    acc[major] = (acc[major] || 0) + 1;
    return acc;
  }, {});
  
  const majorData = applicationsByMajor ? Object.keys(applicationsByMajor).map(key => ({
    name: key === 'computerScience' ? 'Computer Science' :
          key === 'business' ? 'Business Administration' :
          key === 'psychology' ? 'Psychology' :
          key === 'biology' ? 'Biology' :
          key === 'engineering' ? 'Engineering' :
          key === 'arts' ? 'Liberal Arts' : key,
    value: applicationsByMajor[key],
  })) : [];

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
      
      <div className="mt-6">
        {/* Application Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClipboardList className="h-6 w-6 text-slate-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Applications</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{totalApplications}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 bg-slate-50 px-5 py-3 rounded-md">
                <div className="text-sm">
                  <Link href="/admin/applications">
                    <a className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                      View all
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Pending Review</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{pendingReview}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 bg-slate-50 px-5 py-3 rounded-md">
                <div className="text-sm">
                  <Link href="/admin/applications?status=submitted">
                    <a className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                      Review next
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Accepted</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{accepted}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 bg-slate-50 px-5 py-3 rounded-md">
                <div className="text-sm">
                  <Link href="/admin/applications?status=accepted">
                    <a className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                      View accepted
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Rejected</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{rejected}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 bg-slate-50 px-5 py-3 rounded-md">
                <div className="text-sm">
                  <Link href="/admin/applications?status=rejected">
                    <a className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                      View rejected
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Applications by Status</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Applications']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Applications by Major</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={majorData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
