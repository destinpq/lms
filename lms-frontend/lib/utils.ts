/**
 * Utility functions for the application
 */

/**
 * Navigate to a new path by replacing the current URL
 * This is a workaround for the router.push type issues in Next.js App Router
 * @param path The path to navigate to
 */
export function redirectWithReplace(path: string): void {
  console.log(`[Utils] Redirecting to ${path} using location.href`);
  
  // Add a small delay to ensure any state updates have propagated
  setTimeout(() => {
    try {
      window.location.href = path;
      console.log(`[Utils] Redirection to ${path} initiated`);
    } catch (error) {
      console.error(`[Utils] Error redirecting to ${path}:`, error);
    }
  }, 100);
}

/**
 * Format a date string to a human-readable format
 * @param date The date string to format
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format file size to human readable string
 * @param bytes Number of bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get the API URL from environment variables
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // For debugging
  console.log('API URL from env:', apiUrl);
  
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL not set, using fallback URL');
    return 'http://localhost:3001';
  }
  
  return apiUrl;
} 