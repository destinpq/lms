"use client";

import { 
  ClockIcon, 
  StarIcon, 
  BookOpenIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.id as string;
  
  // Mock course data
  const course = {
    id: parseInt(courseId),
    title: "Introduction to Python Programming",
    description: "Learn Python fundamentals including data types, control structures, functions, and basic OOP concepts. This comprehensive course is designed for beginners with no prior programming experience. By the end, you'll be able to create your own Python applications and have a solid foundation for more advanced topics.",
    instructor: "Dr. Alan Johnson",
    instructorTitle: "Professor of Computer Science",
    instructorImage: "/placeholder-avatar.jpg",
    rating: 4.8,
    reviewCount: 354,
    students: 2456,
    duration: "8 weeks",
    level: "Beginner",
    lastUpdated: "March 2024",
    language: "English",
    tags: ["Programming", "Python", "Computer Science"],
    thumbnail: "/placeholder.jpg",
    progress: 45,
    modules: [
      {
        id: 1,
        title: "Getting Started with Python",
        description: "Introduction to Python, setting up your development environment, and running your first program.",
        duration: "45 minutes",
        isCompleted: true,
        contents: [
          {
            id: 101,
            title: "Welcome to Python Programming",
            type: "video",
            duration: "5 min",
            isCompleted: true,
          },
          {
            id: 102,
            title: "Setting Up Your Environment",
            type: "video",
            duration: "12 min",
            isCompleted: true,
          },
          {
            id: 103,
            title: "Hello World - Your First Python Program",
            type: "exercise",
            duration: "15 min",
            isCompleted: true,
          },
          {
            id: 104,
            title: "Module Quiz",
            type: "quiz",
            duration: "10 min",
            isCompleted: true,
          }
        ]
      },
      {
        id: 2,
        title: "Python Data Types and Variables",
        description: "Understanding different data types in Python and how to use variables effectively.",
        duration: "1 hour 15 minutes",
        isCompleted: true,
        contents: [
          {
            id: 201,
            title: "Numbers and Strings",
            type: "video",
            duration: "15 min",
            isCompleted: true,
          },
          {
            id: 202,
            title: "Lists and Tuples",
            type: "video",
            duration: "18 min",
            isCompleted: true,
          },
          {
            id: 203,
            title: "Dictionaries and Sets",
            type: "video",
            duration: "20 min",
            isCompleted: true,
          },
          {
            id: 204,
            title: "Data Types Practice",
            type: "exercise",
            duration: "15 min",
            isCompleted: true,
          },
          {
            id: 205,
            title: "Module Quiz",
            type: "quiz",
            duration: "10 min",
            isCompleted: true,
          }
        ]
      },
      {
        id: 3,
        title: "Control Flow in Python",
        description: "Learn about conditionals, loops, and how to control the flow of your Python programs.",
        duration: "1.5 hours",
        isCompleted: false,
        contents: [
          {
            id: 301,
            title: "If Statements and Boolean Logic",
            type: "video",
            duration: "18 min",
            isCompleted: true,
          },
          {
            id: 302,
            title: "For Loops",
            type: "video",
            duration: "15 min",
            isCompleted: true,
          },
          {
            id: 303,
            title: "While Loops",
            type: "video",
            duration: "12 min",
            isCompleted: false,
          },
          {
            id: 304,
            title: "Control Flow Exercises",
            type: "exercise",
            duration: "25 min",
            isCompleted: false,
          },
          {
            id: 305,
            title: "Module Quiz",
            type: "quiz",
            duration: "10 min",
            isCompleted: false,
          }
        ]
      },
      {
        id: 4,
        title: "Functions and Modules",
        description: "Creating reusable code with functions and organizing code with modules.",
        duration: "2 hours",
        isCompleted: false,
        contents: [
          {
            id: 401,
            title: "Defining and Calling Functions",
            type: "video",
            duration: "20 min",
            isCompleted: false,
          },
          {
            id: 402,
            title: "Function Parameters and Return Values",
            type: "video",
            duration: "25 min",
            isCompleted: false,
          },
          {
            id: 403,
            title: "Lambda Functions",
            type: "video",
            duration: "15 min",
            isCompleted: false,
          },
          {
            id: 404,
            title: "Working with Modules",
            type: "video",
            duration: "20 min",
            isCompleted: false,
          },
          {
            id: 405,
            title: "Functions Practice",
            type: "exercise",
            duration: "30 min",
            isCompleted: false,
          },
          {
            id: 406,
            title: "Module Quiz",
            type: "quiz",
            duration: "10 min",
            isCompleted: false,
          }
        ]
      },
    ]
  };

  // Calculate overall progress
  const totalContents = course.modules.flatMap(m => m.contents).length;
  const completedContents = course.modules.flatMap(m => m.contents).filter(c => c.isCompleted).length;
  const progressPercentage = Math.round((completedContents / totalContents) * 100);

  // Content type icons
  const contentTypeIcons = {
    video: PlayCircleIcon,
    document: DocumentTextIcon,
    exercise: BookOpenIcon,
    quiz: AcademicCapIcon,
    discussion: ChatBubbleLeftEllipsisIcon,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Course Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Course Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(course.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {course.rating} ({course.reviewCount} reviews)
                </span>
              </div>
              
              <p className="mt-4 text-gray-700">{course.description}</p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500">Instructor</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{course.instructor}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500">Level</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{course.level}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500">Duration</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{course.duration}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500">Language</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{course.language}</p>
                </div>
              </div>
            </div>
            
            {/* Progress Card */}
            <div className="w-full md:w-80 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900">Your Progress</h3>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{completedContents} of {totalContents} items completed</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Continue Learning
                </button>
                
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
              Curriculum
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
              Overview
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
              Q&A
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
              Notes
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
              Reviews
            </button>
          </nav>
        </div>
        
        {/* Modules Accordion */}
        <div className="p-6">
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Module header */}
                <div className={`p-4 flex items-center justify-between ${module.isCompleted ? 'bg-green-50' : moduleIndex === 2 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {module.isCompleted ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                    ) : moduleIndex === 2 ? (
                      <BookOpenIcon className="h-6 w-6 text-blue-500 mr-3" />
                    ) : (
                      <LockClosedIcon className="h-6 w-6 text-gray-400 mr-3" />
                    )}
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                </div>
                
                {/* Module contents */}
                <ul className="divide-y divide-gray-200">
                  {module.contents.map((content) => {
                    const ContentIcon = content.type === 'video' 
                      ? contentTypeIcons.video 
                      : content.type === 'exercise'
                      ? contentTypeIcons.exercise
                      : content.type === 'quiz'
                      ? contentTypeIcons.quiz
                      : contentTypeIcons.document;
                    
                    return (
                      <li 
                        key={content.id} 
                        className={`p-4 flex items-center ${
                          content.isCompleted 
                            ? 'bg-gray-50' 
                            : moduleIndex > 2
                            ? 'opacity-50'
                            : ''
                        }`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {content.isCompleted ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ContentIcon className={`h-5 w-5 ${moduleIndex > 2 ? 'text-gray-300' : 'text-gray-500'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${moduleIndex > 2 ? 'text-gray-400' : 'text-gray-900'}`}>
                            {content.title}
                          </h4>
                          <p className="text-xs text-gray-500 capitalize">
                            {content.type} • {content.duration}
                          </p>
                        </div>
                        
                        {moduleIndex <= 2 && (
                          <div className="ml-4">
                            <Link
                              href={`/dashboard/courses/${course.id}/content/${content.id}`}
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md ${
                                content.isCompleted 
                                  ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                              }`}
                            >
                              {content.isCompleted ? 'Review' : 'Start'}
                            </Link>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 