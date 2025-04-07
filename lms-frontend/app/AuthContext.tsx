import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext<{
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
}>({
  user: null,
  setUser: () => {},
  handleLogin: async () => ({ success: false }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const handleLogin = async (email: string, password: string) => {
    console.log(`[AuthContext] handleLogin called for: ${email}`);
    
    try {
      // TEMPORARY AUTH BYPASS FOR TESTING
      // Remove this in production and use the real authentication flow below
      console.log('[AuthContext] Using temporary auth bypass for testing');
      const mockUser = {
        id: '1',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'student'
      };
      setUser(mockUser);
      localStorage.setItem('lms_user', JSON.stringify(mockUser));
      router.push('/dashboard');
      return { success: true };

      // REAL AUTHENTICATION FLOW - Commented out for now
      // Uncomment this when backend is ready
      /*
      const result = await login(email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('lms_user', JSON.stringify(result.user));
        router.push('/dashboard');
      }
      return result;
      */
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { 
        success: false, 
        message: 'Authentication failed. Please try again.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 