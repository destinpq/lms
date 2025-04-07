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
    <nav className="header nav-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                EduVantage LMS
              </Link>
            </div>
            <div className="hidden sm-block sm-ml-6 space-x-4">
              <Link
                href="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className={`nav-link ${isActive('/courses') ? 'nav-link-active' : ''}`}
              >
                Courses
              </Link>
              <Link
                href="/profile"
                className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}
              >
                My Profile
              </Link>
            </div>
          </div>
          <div className="hidden sm-block sm-ml-6 flex items-center">
            <div className="ml-3 flex items-center space-x-4">
              <div className="text-sm text-white">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="btn-logout"
              >
                {isLogoutLoading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm-hidden">
            <button
              type="button"
              className="mobile-menu-btn"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-5"
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
      <div className="sm-hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className={`mobile-nav-link ${isActive('/dashboard') ? 'mobile-nav-link-active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={`mobile-nav-link ${isActive('/courses') ? 'mobile-nav-link-active' : ''}`}
          >
            Courses
          </Link>
          <Link
            href="/profile"
            className={`mobile-nav-link ${isActive('/profile') ? 'mobile-nav-link-active' : ''}`}
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLogoutLoading}
            className="mobile-nav-btn"
          >
            {isLogoutLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </nav>
  );
} 