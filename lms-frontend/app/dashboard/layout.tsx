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
  BellIcon, 
  InboxIcon,
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-blue-600">LMS Platform</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <item.icon
                    className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-2 py-2 mt-8 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 group"
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
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="w-full bg-white shadow">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden">
              <h1 className="text-lg font-bold text-blue-600">LMS Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <BellIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View messages</span>
                <InboxIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user?.firstName ? user.firstName[0] : user?.email?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-100">
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