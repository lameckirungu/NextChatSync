import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Loader2, Search, UserPlus, MoreHorizontal, Shield, User } from 'lucide-react';

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: '', password: '', role: 'applicant' });
  
  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/users'],
  });
  
  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number, role: string }) => {
      return apiRequest('PUT', `/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({
        title: 'Role updated',
        description: 'User role has been updated successfully.',
      });
      
      // Refetch users list
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update role',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUserData) => {
      return apiRequest('POST', '/api/users', userData);
    },
    onSuccess: () => {
      toast({
        title: 'User created',
        description: 'New user has been created successfully.',
      });
      
      // Reset form and close dialog
      setNewUserData({ email: '', password: '', role: 'applicant' });
      setIsCreateUserOpen(false);
      
      // Refetch users list
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  const handleCreateUser = () => {
    // Simple validation
    if (!newUserData.email || !newUserData.email.includes('@') || !newUserData.password || newUserData.password.length < 6) {
      toast({
        title: 'Invalid input',
        description: 'Please provide a valid email and password (minimum 6 characters).',
        variant: 'destructive',
      });
      return;
    }
    
    createUserMutation.mutate(newUserData);
  };
  
  const handleRoleChange = (userId: number, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };
  
  // Filter users based on search term and role filter
  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
        <h1 className="text-2xl font-semibold text-slate-800">User Management</h1>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search by email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="applicant">Applicant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <AlertDialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-primary-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New User</AlertDialogTitle>
                <AlertDialogDescription>
                  Fill in the details below to create a new user account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 py-2">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Password must be at least 6 characters long.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="role" className="text-sm font-medium text-slate-700">
                    User Role
                  </label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="applicant">Applicant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* User statistics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-xl font-semibold mt-1">{users?.length || 0}</p>
              </div>
              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">All</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Admins</p>
                <p className="text-xl font-semibold mt-1">
                  {users?.filter((user: any) => user.role === 'admin').length || 0}
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Applicants</p>
                <p className="text-xl font-semibold mt-1">
                  {users?.filter((user: any) => user.role === 'applicant').length || 0}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Applicant</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Applications
                </th>
                <th scope="col" className="relative px-6 py-3 w-24">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {users?.length === 0 ? (
                      <div>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="mt-1">Your system doesn't have any users yet.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">No matching users</p>
                        <p className="mt-1">Try adjusting your search or filter criteria.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{user.email}</div>
                          <div className="text-sm text-slate-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Shield className="h-3 w-3 mr-1" /> Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <User className="h-3 w-3 mr-1" /> Applicant
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.applications_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Change User Role</AlertDialogTitle>
                            <AlertDialogDescription>
                              Change the role for {user.email}. This will modify their access level.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Select 
                              defaultValue={user.role} 
                              onValueChange={(value) => handleRoleChange(user.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="applicant">Applicant</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}