"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, register, logout, getUser, setUser, setToken } from './auth';

// Define user type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('[AuthContext] Initial render');

  // Check if user is already logged in
  useEffect(() => {
    console.log('[AuthContext] useEffect - Checking for stored user');
    const currentUser = getUser();
    if (currentUser) {
      console.log('[AuthContext] Found stored user:', currentUser.email);
      setUserState(currentUser);
    } else {
      console.log('[AuthContext] No stored user found');
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log('[AuthContext] handleLogin called for:', email);
    try {
      const response = await login({ email, password });
      console.log('[AuthContext] Login successful, setting user state');
      setToken(response.accessToken);
      setUser(response.user);
      setUserState(response.user);
      console.log('[AuthContext] User state updated after login:', response.user.email);
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await register({ email, password, firstName, lastName });
      setToken(response.accessToken);
      setUser(response.user);
      setUserState(response.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserState(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Log whenever the user state changes
  useEffect(() => {
    console.log('[AuthContext] User state changed:', user ? `Logged in as ${user.email}` : 'No user');
  }, [user]);

  // Provide context value
  const value = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 