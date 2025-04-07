"use client";

import { useEffect } from "react";
import Link from "next/link";
import { 
  HomeIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../lib/AuthContext";
import { logout } from "../../lib/auth";
import { redirectWithReplace } from "../../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpenIcon },
  { name: "Assessments", href: "/dashboard/assessments", icon: AcademicCapIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Community", href: "/dashboard/community", icon: UserGroupIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      redirectWithReplace('/login');
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await logout();
      redirectWithReplace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If loading, show a spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, don't show anything
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar visible">
        <div className="flex flex-col flex-grow pt-5 pb-5">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">LMS Platform</Link>
          </div>
          <div className="flex flex-col flex-grow px-4">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 group"
                >
                  <item.icon
                    className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 mt-6 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 group"
              >
                <ArrowLeftOnRectangleIcon
                  className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-500"
                  aria-hidden="true"
                />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-lg font-bold text-blue-600">LMS Platform</Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="notification-button-container">
                <span className="notification-label">View notifications</span>
                <button className="lms-notification-btn text-gray-600">
                  <span className="sr-only">View notifications</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>
              </div>
              <div className="notification-button-container">
                <span className="notification-label">View messages</span>
                <button className="lms-notification-btn text-gray-600">
                  <span className="sr-only">View messages</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="user-avatar bg-blue-600">
                      {user?.firstName ? user.firstName[0] : user?.email?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="user-info text-gray-700">
                    <div className="user-name text-gray-800">
                      {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'User'}
                    </div>
                    <div className="user-email text-gray-500">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 