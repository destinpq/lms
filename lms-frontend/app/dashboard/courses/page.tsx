"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./courses.module.css";

export default function Courses() {
  const [activeTab, setActiveTab] = useState("enrolled");
  
  // Mock data - in a real application, these would come from API calls
  const courses = [
    {
      id: "Python+1",
      title: "Introduction to Python Programming",
      description: "Learn Python fundamentals including data types, control structures, functions, and basic OOP concepts.",
      instructor: "Dr. Alan Johnson",
      rating: 4.8,
      students: 2456,
      duration: "8 weeks",
      level: "Beginner",
      progress: 45,
    },
    {
      id: "HTML+2", 
      title: "Web Development Fundamentals",
      description: "Build responsive websites with HTML, CSS, and JavaScript. Learn modern frameworks and best practices.",
      instructor: "Sarah Miller",
      rating: 4.6,
      students: 1859,
      duration: "10 weeks",
      level: "Beginner",
      progress: 72,
    },
    {
      id: "Python+1",
      title: "Data Science Basics",
      description: "Introduction to data analysis, visualization, and machine learning with Python libraries.",
      instructor: "Dr. Michael Chen",
      rating: 4.9,
      students: 3241,
      duration: "12 weeks",
      level: "Intermediate",
      progress: 20,
    },
    {
      id: "UI/UX+1",
      title: "UI/UX Design Principles",
      description: "Master the fundamentals of user interface and user experience design for digital products.",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      students: 1547,
      duration: "6 weeks",
      level: "Beginner",
      progress: 0,
    },
  ];

  return (
    <div className="code-learning-container">
      <div className={styles.coursesHeader}>
        <div>
          <h1 className={styles.coursesTitle}>My Courses</h1>
          <p className={styles.coursesSubtitle}>Browse all your enrolled courses and continue learning</p>
        </div>
        <Link
          href="/dashboard/courses/browse"
          className={styles.continueButton}
        >
          Browse Catalog
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        className={styles.coursesSearch}
        placeholder="Search courses"
      />

      {/* Filter */}
      <button className={styles.filterButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        Filter
      </button>

      {/* Tabs */}
      <div className={styles.pillTabs}>
        <button 
          className={`${styles.pillTab} ${activeTab === "enrolled" ? styles.active : ""}`}
          onClick={() => setActiveTab("enrolled")}
        >
          Enrolled
        </button>
        <button 
          className={`${styles.pillTab} ${activeTab === "completed" ? styles.active : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button 
          className={`${styles.pillTab} ${activeTab === "wishlist" ? styles.active : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist
        </button>
      </div>

      {/* Courses list */}
      {courses.map((course, index) => (
        <div key={index} className={styles.courseListItem}>
          <div className={styles.courseProgressTop}>
            <span>Progress {course.progress}%</span>
            <span>{course.duration}</span>
          </div>
          
          <div className={styles.courseProgressContainer}>
            <div 
              className={styles.courseProgressBar} 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <p className={styles.courseInstructor}>by {course.instructor}</p>
          <div className={styles.courseMeta}>
            <span>({course.rating})</span>
            <span className={styles.courseStudents}>{course.students.toLocaleString()} students</span>
          </div>
          
          <div className={styles.courseAction}>
            <Link
              href={`/dashboard/courses/${course.id}`}
              className={styles.continueButton}
            >
              Continue Learning
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
} 