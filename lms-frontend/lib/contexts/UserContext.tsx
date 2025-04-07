"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUser, isAuthenticated, logout } from '../auth';
import { redirectWithReplace } from '../utils';

// Define the user type
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

// Define the context type
type UserContextType = {
  user: User | null;
  loading: boolean;
  requireAuth: (redirectUrl?: string) => Promise<boolean>;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  requireAuth: async () => false,
  isAuthenticated: false,
  logout: async () => {},
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      // Get user from local storage
      const userData = getUser();
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function to check if user is authenticated and redirect if not
  const requireAuth = async (redirectUrl = '/login'): Promise<boolean> => {
    // Wait for authentication state to resolve
    if (loading) {
      return new Promise((resolve) => {
        const checkAuth = () => {
          if (!loading) {
            if (!isAuthenticated()) {
              redirectWithReplace(redirectUrl);
              resolve(false);
            } else {
              resolve(true);
            }
          } else {
            setTimeout(checkAuth, 50);
          }
        };
        checkAuth();
      });
    }

    if (!isAuthenticated()) {
      redirectWithReplace(redirectUrl);
      return false;
    }

    return true;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      requireAuth, 
      isAuthenticated: isAuthenticated(),
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
} 