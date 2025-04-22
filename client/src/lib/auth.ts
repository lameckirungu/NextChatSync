import { apiRequest } from "./queryClient";
import { queryClient } from "./queryClient";

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface RegisterParams {
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const register = async (data: RegisterParams): Promise<User> => {
  const response = await apiRequest('POST', '/api/auth/register', data);
  const json = await response.json();
  return json.user;
};

export const login = async (data: LoginParams): Promise<User> => {
  const response = await apiRequest('POST', '/api/auth/login', data);
  const json = await response.json();
  
  // Set the user in the session
  queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  
  return json.user;
};

export const logout = async (): Promise<void> => {
  await apiRequest('POST', '/api/auth/logout');
  queryClient.setQueryData(['/api/user'], null);
  queryClient.invalidateQueries();
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiRequest('POST', '/api/auth/forgot-password', { email });
};

export const resetPassword = async (password: string, token: string): Promise<void> => {
  await apiRequest('POST', '/api/auth/reset-password', { password, token });
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/user', {
      credentials: 'include'
    });
    
    if (response.status === 401) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
