"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { enrollInCourse, isEnrolledInCourse } from '../../../lib/auth';

// Define interfaces for type safety
interface Module {
  title: string;
  lessons: number;
  duration: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: string;
  duration: string;
  thumbnail: string;
  price: string;
  rating: number;
  students: number;
  modules: Module[];
}

// Sample course data (in a real app, this would come from an API)
const sampleCourses: Course[] = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructor: 'Jane Smith',
    level: 'Beginner',
    duration: '8 weeks',
    thumbnail: 'https://source.unsplash.com/random/1200x600?web',
    price: '$49.99',
    rating: 4.7,
    students: 1254,
    modules: [
      { title: 'Introduction to HTML', lessons: 5, duration: '1 week' },
      { title: 'CSS Fundamentals', lessons: 6, duration: '1 week' },
      { title: 'JavaScript Basics', lessons: 8, duration: '2 weeks' },
      { title: 'Responsive Design', lessons: 4, duration: '1 week' },
      { title: 'Building a Simple Website', lessons: 5, duration: '2 weeks' },
      { title: 'Final Project', lessons: 1, duration: '1 week' },
    ]
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into JS closures, prototypes, async/await, and more.',
    instructor: 'John Doe',
    level: 'Intermediate',
    duration: '6 weeks',
    thumbnail: 'https://source.unsplash.com/random/1200x600?javascript',
    price: '$69.99',
    rating: 4.8,
    students: 876,
    modules: [
      { title: 'JavaScript Review', lessons: 4, duration: '1 week' },
      { title: 'Closures and Scope', lessons: 5, duration: '1 week' },
      { title: 'Prototypes and Inheritance', lessons: 6, duration: '1 week' },
      { title: 'Asynchronous JavaScript', lessons: 7, duration: '2 weeks' },
      { title: 'Advanced Patterns', lessons: 5, duration: '1 week' },
    ]
  },
  {
    id: 3,
    title: 'React JS Masterclass',
    description: 'Build powerful single-page applications with React and Redux.',
    instructor: 'Sarah Johnson',
    level: 'Intermediate',
    duration: '10 weeks',
    thumbnail: 'https://source.unsplash.com/random/1200x600?react',
    price: '$79.99',
    rating: 4.9,
    students: 2103,
    modules: [
      { title: 'React Fundamentals', lessons: 6, duration: '2 weeks' },
      { title: 'Components and Props', lessons: 5, duration: '1 week' },
      { title: 'State and Lifecycle', lessons: 7, duration: '2 weeks' },
      { title: 'Hooks in Depth', lessons: 8, duration: '2 weeks' },
      { title: 'Redux State Management', lessons: 6, duration: '2 weeks' },
      { title: 'Final Project', lessons: 1, duration: '1 week' },
    ]
  },
  {
    id: 4,
    title: 'Data Science Foundations',
    description: 'Introduction to data analysis, visualization, and machine learning basics.',
    instructor: 'Michael Chen',
    level: 'Beginner',
    duration: '12 weeks',
    thumbnail: 'https://source.unsplash.com/random/1200x600?data',
    price: '$89.99',
    rating: 4.6,
    students: 1876,
    modules: [
      { title: 'Introduction to Python', lessons: 6, duration: '2 weeks' },
      { title: 'Data Manipulation with Pandas', lessons: 8, duration: '2 weeks' },
      { title: 'Data Visualization', lessons: 7, duration: '2 weeks' },
      { title: 'Statistical Analysis', lessons: 8, duration: '2 weeks' },
      { title: 'Machine Learning Basics', lessons: 9, duration: '3 weeks' },
      { title: 'Capstone Project', lessons: 1, duration: '1 week' },
    ]
  }
];

export default function CourseDetail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Local require auth function
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

      // In a real app, you would fetch course by ID from an API
      const foundCourse = sampleCourses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
      
      // Check if user is already enrolled
      if (user?.id) {
        const isEnrolled = await isEnrolledInCourse(user.id, courseId);
        setEnrolled(isEnrolled);
      }
      
      setIsPageLoading(false);
    };
    
    checkAuth();
  }, [requireAuth, courseId, user?.id, loading]);

  if (isPageLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user?.id) return;
    
    setEnrolling(true);
    try {
      // Enroll the user in the course
      const success = await enrollInCourse(user.id, courseId);
      if (success) {
        setEnrolled(true);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Course Header */}
      <div 
        className="w-full bg-cover bg-center h-80 flex items-end" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${course.thumbnail})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-white text-lg mb-4">{course.description}</p>
              <div className="flex items-center space-x-4 text-white">
                <div>Instructor: <span className="font-semibold">{course.instructor}</span></div>
                <div>Level: <span className="font-semibold">{course.level}</span></div>
                <div>Duration: <span className="font-semibold">{course.duration}</span></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold text-gray-900 mb-2">{course.price}</div>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{course.rating} ({course.students} students)</span>
              </div>
              {enrolled ? (
                <Link 
                  href={`/dashboard/courses/${course.id}/learn`}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Continue Learning
                </Link>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-indigo-400"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Module {index + 1}: {module.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {module.lessons} lessons • {module.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Instructor</h2>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={`https://source.unsplash.com/random/100x100?portrait`} 
                alt={course.instructor} 
                className="h-16 w-16 rounded-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{course.instructor}</h3>
              <p className="text-gray-600 mt-1">
                Experienced instructor with expertise in {course.title.toLowerCase()}. 
                Has taught over {course.students} students with consistently high ratings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Back to dashboard link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
} 