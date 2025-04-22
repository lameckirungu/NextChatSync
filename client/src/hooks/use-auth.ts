import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { login as authLogin, logout as authLogout, register as authRegister, forgotPassword as authForgotPassword, resetPassword as authResetPassword, getCurrentUser, User } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    data: user, 
    isLoading,
    refetch
  } = useQuery<User | null>({ 
    queryKey: ['/api/user'], 
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    const initAuth = async () => {
      await refetch();
      setIsInitialized(true);
    };
    
    initAuth();
  }, [refetch]);

  const register = async (email: string, password: string) => {
    try {
      await authRegister({
        email,
        password
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now log in.",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await authLogin({
        email,
        password
      });
      
      await refetch();
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive"
      });
      
      return null;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authForgotPassword(email);
      
      toast({
        title: "Reset email sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
      
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);
      
      toast({
        title: "Failed to send reset email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      await authResetPassword(password, token);
      
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully. You can now log in with your new password.",
      });
      
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  };
}
