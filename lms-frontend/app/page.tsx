"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-6">
          <svg 
            className="mx-auto h-24 w-24 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 14l9-5-9-5-9 5 9 5z" 
            />
          </svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">EduVantage LMS</h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Welcome to the Learning Management System That is Awesome
        </h2>
        
        <p className="text-lg mb-8 text-white">
          Discover a world of knowledge with our state-of-the-art learning platform.
          Expert instructors, engaging content, and a supportive community await you.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md bg-white text-indigo-600 hover:bg-indigo-50 flex items-center justify-center"
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md border border-indigo-200 text-white hover:bg-indigo-700 flex items-center justify-center"
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
            <div className="text-white mb-3">
              <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert-Led Courses</h3>
            <p className="text-white text-sm">Learn from industry professionals with real-world experience.</p>
          </div>
          
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
            <div className="text-white mb-3">
              <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
            <p className="text-white text-sm">Engage with dynamic content designed to keep you motivated.</p>
          </div>
          
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
            <div className="text-white mb-3">
              <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Supportive Community</h3>
            <p className="text-white text-sm">Join others on the same journey and grow together.</p>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 text-base text-white font-medium">
        &copy; {new Date().getFullYear()} EduVantage LMS. All rights reserved.
      </footer>
    </div>
  );
} 