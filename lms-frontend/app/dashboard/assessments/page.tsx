import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Assessments() {
  // Mock data - in a real application, these would come from API calls
  const assessments = [
    {
      id: 1,
      title: "Python Basics Quiz",
      course: "Introduction to Python Programming",
      courseId: 1,
      type: "quiz",
      timeLimit: 20,
      questionsCount: 15,
      dueDate: "Apr 10, 2024",
      status: "completed",
      score: 85,
      passingScore: 70,
    },
    {
      id: 2,
      title: "Web Development Fundamentals Test",
      course: "Web Development Fundamentals",
      courseId: 2,
      type: "quiz",
      timeLimit: 45,
      questionsCount: 30,
      dueDate: "Apr 15, 2024",
      status: "failed",
      score: 65,
      passingScore: 70,
    },
    {
      id: 3,
      title: "Basic Python Project",
      course: "Introduction to Python Programming",
      courseId: 1,
      type: "assignment",
      timeLimit: null,
      dueDate: "Apr 18, 2024",
      status: "pending",
      description: "Create a simple calculator application using Python",
    },
    {
      id: 4,
      title: "Data Visualization Exercise",
      course: "Data Science Basics",
      courseId: 3,
      type: "assignment",
      timeLimit: null,
      dueDate: "Apr 20, 2024",
      status: "pending",
      description: "Create data visualizations using matplotlib and pandas",
    },
    {
      id: 5,
      title: "Control Flow in Python Quiz",
      course: "Introduction to Python Programming",
      courseId: 1,
      type: "quiz",
      timeLimit: 15,
      questionsCount: 10,
      dueDate: "Apr 12, 2024",
      status: "upcoming",
    },
  ];

  // Group by status
  const pendingAssessments = assessments.filter(a => a.status === "pending");
  const upcomingAssessments = assessments.filter(a => a.status === "upcoming");
  const completedAssessments = assessments.filter(a => ["completed", "failed"].includes(a.status));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
      <p className="mt-1 text-gray-600">Track your quizzes, tests, and assignments</p>

      {/* Assessment Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            All Assessments
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Quizzes
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Assignments
          </button>
        </nav>
      </div>

      {/* Pending Assessments */}
      {pendingAssessments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Pending Submissions</h2>
          <div className="mt-4 space-y-4">
            {pendingAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                        <p className="text-sm text-gray-500">{assessment.course}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-red-600">Due: {assessment.dueDate}</span>
                      <span className="text-xs text-gray-500 mt-1">Assignment</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{assessment.description}</p>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/dashboard/assessments/${assessment.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Assignment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Assessments */}
      {upcomingAssessments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Assessments</h2>
          <div className="mt-4 space-y-4">
            {upcomingAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-8 w-8 text-indigo-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                        <p className="text-sm text-gray-500">{assessment.course}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-red-600">Due: {assessment.dueDate}</span>
                      <span className="text-xs text-gray-500 mt-1">Quiz • {assessment.timeLimit} min • {assessment.questionsCount} questions</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/dashboard/courses/${assessment.courseId}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
                    >
                      View Course
                    </Link>
                    <Link
                      href={`/dashboard/assessments/${assessment.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Assessments */}
      {completedAssessments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Past Assessments</h2>
          <div className="mt-4 space-y-4">
            {completedAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {assessment.type === "quiz" ? (
                        <AcademicCapIcon className={`h-8 w-8 ${assessment.status === "completed" ? "text-green-500" : "text-red-500"}`} />
                      ) : (
                        <DocumentTextIcon className="h-8 w-8 text-green-500" />
                      )}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                        <p className="text-sm text-gray-500">{assessment.course}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {assessment.status === "completed" ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Passed</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircleIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Failed</span>
                        </div>
                      )}
                      {assessment.type === "quiz" && (
                        <span className="text-xs text-gray-500 mt-1">
                          Score: {assessment.score}% (Passing: {assessment.passingScore}%)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {assessment.type === "quiz" && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${assessment.status === "completed" ? "bg-green-600" : "bg-red-600"}`} 
                          style={{ width: `${assessment.score}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/dashboard/assessments/${assessment.id}/results`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 