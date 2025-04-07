"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Sample course data (in a real app, this would come from an API)
const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    thumbnail: 'https://source.unsplash.com/random/300x200?web'
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    thumbnail: 'https://source.unsplash.com/random/300x200?javascript'
  },
  {
    id: 3,
    title: 'React JS Masterclass',
    thumbnail: 'https://source.unsplash.com/random/300x200?react'
  },
  {
    id: 4,
    title: 'Data Science Foundations',
    thumbnail: 'https://source.unsplash.com/random/300x200?data'
  }
];

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<typeof sampleCourses>([]);
  const [enrolledCount, setEnrolledCount] = useState(0);

  // Local requireAuth function
  const requireAuth = useCallback(async () => {
    if (!loading && !user) {
      router.push('/login');
      return false;
    }
    return true;
  }, [loading, user, router]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const isAuth = await requireAuth();
      if (!isAuth) return;
      
      if (user?.id) {
        try {
          // Fetch user data from API
          const response = await fetch(`/api/users/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.enrolledCourses) {
              setEnrolledCount(data.user.enrolledCourses.length);
              
              // Get the courses the user is enrolled in
              const userCourses = sampleCourses.filter(course => 
                data.user.enrolledCourses.includes(course.id)
              );
              setEnrolledCourses(userCourses);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    checkAuth();
  }, [requireAuth, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not provided'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.id}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your account details and preferences.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Account type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Standard</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Enrolled courses</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{enrolledCount}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Completed courses</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Certificates earned</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {enrolledCourses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Enrolled Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <div className="mt-auto pt-4">
                      <Link 
                        href={`/dashboard/courses/${course.id}/learn`}
                        className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 