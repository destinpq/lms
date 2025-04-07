import { getApiUrl } from './utils';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Get the API URL from environment variables
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password
      }),
    });

    // Handle different error statuses
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      } else if (response.status === 404) {
        throw new Error('Authentication service not available');
      } else {
        throw new Error(`Login failed with status: ${response.status}`);
      }
    }

    // Parse and validate the response
    const data = await response.json();
    if (!data.accessToken || !data.user) {
      throw new Error('Invalid response from server');
    }

    // Store authentication data
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${getApiUrl()}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 409) {
      throw new Error('User with this email already exists');
    }
    
    // Try to get detailed error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    } catch {
      // If we can't parse the error JSON, use a generic message
      throw new Error('Registration failed');
    }
  }

  const responseData = await response.json();
  setToken(responseData.accessToken);
  setUser(responseData.user);
  return responseData;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function getUser(): AuthResponse['user'] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function setUser(user: AuthResponse['user']): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function enrollInCourse(userId: string, courseId: number): Promise<boolean> {
  const response = await fetch(`${getApiUrl()}/users/${userId}/enroll`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    throw new Error('Failed to enroll in course');
  }

  return true;
}

export async function isEnrolledInCourse(userId: string, courseId: number): Promise<boolean> {
  try {
    const response = await fetch(`${getApiUrl()}/users/${userId}/courses/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error('Failed to check enrollment status');
    }

    return true;
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
} 