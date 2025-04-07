"use client";

import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../lib/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

// Sample course data (in a real app, this would come from an API or database)
const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructor: 'Jane Smith',
    level: 'Beginner',
    duration: '8 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?web'
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into JS closures, prototypes, async/await, and more.',
    instructor: 'John Doe',
    level: 'Intermediate',
    duration: '6 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?javascript'
  },
  {
    id: 3,
    title: 'React JS Masterclass',
    description: 'Build powerful single-page applications with React and Redux.',
    instructor: 'Sarah Johnson',
    level: 'Intermediate',
    duration: '10 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?react'
  },
  {
    id: 4,
    title: 'Data Science Foundations',
    description: 'Introduction to data analysis, visualization, and machine learning basics.',
    instructor: 'Michael Chen',
    level: 'Beginner',
    duration: '12 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?data'
  },
  {
    id: 5,
    title: 'Full Stack Web Development',
    description: 'Master frontend and backend development to build complete web applications.',
    instructor: 'David Wilson',
    level: 'Intermediate',
    duration: '16 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?fullstack'
  },
  {
    id: 6,
    title: 'Machine Learning Fundamentals',
    description: 'Understand machine learning algorithms and their applications.',
    instructor: 'Emily Zhang',
    level: 'Advanced',
    duration: '14 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?machinelearning'
  },
  {
    id: 7,
    title: 'UI/UX Design Essentials',
    description: 'Create intuitive and beautiful user interfaces with modern design principles.',
    instructor: 'Sophia Rodriguez',
    level: 'Beginner',
    duration: '8 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?uiux'
  },
  {
    id: 8,
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps using React Native and JavaScript.',
    instructor: 'James Taylor',
    level: 'Intermediate',
    duration: '10 weeks',
    thumbnail: 'https://source.unsplash.com/random/300x200?reactnative'
  }
];

export default function Courses() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Local requireAuth function wrapped in useCallback
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
      await requireAuth();
    };
    
    checkAuth();
  }, [requireAuth]);

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
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse All Courses</h2>
            <div>
              <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="h-48 w-full object-cover"
                />
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">By {course.instructor}</p>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>{course.level}</span>
                    <span>{course.duration}</span>
                  </div>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="mt-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 