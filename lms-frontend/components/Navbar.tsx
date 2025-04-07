"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/auth';
import { redirectWithReplace } from '../lib/utils';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user: currentUser } = useAuth();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await logout();
      redirectWithReplace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  // Function to check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                EduVantage LMS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full
                  ${isActive('/dashboard')
                    ? 'border-white text-white'
                    : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300'
                  }`}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full
                  ${isActive('/courses')
                    ? 'border-white text-white'
                    : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300'
                  }`}
              >
                Courses
              </Link>
              <Link
                href="/profile"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full
                  ${isActive('/profile')
                    ? 'border-white text-white'
                    : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300'
                  }`}
              >
                My Profile
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-4">
              <div className="text-sm text-white">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="px-3 py-1.5 border border-white text-xs font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none"
              >
                {isLogoutLoading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
              ${isActive('/dashboard')
                ? 'bg-indigo-700 border-white text-white'
                : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:border-indigo-300 hover:text-white'
              }`}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
              ${isActive('/courses')
                ? 'bg-indigo-700 border-white text-white'
                : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:border-indigo-300 hover:text-white'
              }`}
          >
            Courses
          </Link>
          <Link
            href="/profile"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
              ${isActive('/profile')
                ? 'bg-indigo-700 border-white text-white'
                : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:border-indigo-300 hover:text-white'
              }`}
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLogoutLoading}
            className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-indigo-200 hover:bg-indigo-700 hover:border-indigo-300 hover:text-white"
          >
            {isLogoutLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </nav>
  );
} 