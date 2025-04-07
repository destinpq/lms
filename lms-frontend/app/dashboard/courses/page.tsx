import { ClockIcon, UsersIcon, StarIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Courses() {
  // Mock data - in a real application, these would come from API calls
  const courses = [
    {
      id: 1,
      title: "Introduction to Python Programming",
      description: "Learn Python fundamentals including data types, control structures, functions, and basic OOP concepts.",
      instructor: "Dr. Alan Johnson",
      rating: 4.8,
      students: 2456,
      duration: "8 weeks",
      level: "Beginner",
      tags: ["Programming", "Python", "Computer Science"],
      thumbnail: "/placeholder.jpg",
      progress: 45,
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      description: "Build responsive websites with HTML, CSS, and JavaScript. Learn modern frameworks and best practices.",
      instructor: "Sarah Miller",
      rating: 4.6,
      students: 1859,
      duration: "10 weeks",
      level: "Beginner",
      tags: ["Web Development", "HTML", "CSS", "JavaScript"],
      thumbnail: "/placeholder.jpg",
      progress: 72,
    },
    {
      id: 3,
      title: "Data Science Basics",
      description: "Introduction to data analysis, visualization, and machine learning with Python libraries.",
      instructor: "Dr. Michael Chen",
      rating: 4.9,
      students: 3241,
      duration: "12 weeks",
      level: "Intermediate",
      tags: ["Data Science", "Python", "Machine Learning"],
      thumbnail: "/placeholder.jpg",
      progress: 20,
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      description: "Master the fundamentals of user interface and user experience design for digital products.",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      students: 1547,
      duration: "6 weeks",
      level: "Beginner",
      tags: ["Design", "UI/UX", "Figma"],
      thumbnail: "/placeholder.jpg",
      progress: 0,
    },
    {
      id: 5,
      title: "Advanced JavaScript & React",
      description: "Dive deep into JavaScript ES6+ features and build modern applications with React.",
      instructor: "David Wilson",
      rating: 4.9,
      students: 2105,
      duration: "8 weeks",
      level: "Advanced",
      tags: ["JavaScript", "React", "Web Development"],
      thumbnail: "/placeholder.jpg",
      progress: 0,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-600">Browse all your enrolled courses and continue learning</p>
        </div>
        <Link
          href="/dashboard/courses/browse"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Catalog
        </Link>
      </div>

      {/* Search and filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search courses"
          />
        </div>
        <div className="inline-flex">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
            Filter
          </button>
        </div>
      </div>

      {/* Enrollment tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Enrolled
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Completed
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Wishlist
          </button>
        </nav>
      </div>

      {/* Course grid */}
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-300 relative">
              {/* This would be an actual image in production */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                Course Thumbnail
              </div>
              
              {/* Progress indicator for in-progress courses */}
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-3 py-1">
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-1 bg-blue-600 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {course.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {course.tags.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{course.tags.length - 2}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{course.description}</p>
              
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span>by {course.instructor}</span>
              </div>
              
              <div className="mt-3 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">({course.rating})</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {course.students.toLocaleString()}
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                    course.progress > 0 
                      ? 'text-white bg-blue-600 hover:bg-blue-700' 
                      : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                  }`}
                >
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 