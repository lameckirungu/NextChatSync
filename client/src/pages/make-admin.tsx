import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

export default function MakeAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      return toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
    }

    setLoading(true);
    try {
      // 1. Login to get user id
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        throw new Error('Login failed');
      }

      const userData = await loginRes.json();
      const userId = userData.user.id;

      // 2. Update user to admin
      const updateRes = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update role');
      }

      // 3. Success
      toast({
        title: 'Success',
        description: 'Your account has been updated to admin role',
      });

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Make Admin Account</CardTitle>
          <CardDescription className="text-center">
            This is a special page to help you set up an admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Make Admin'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}