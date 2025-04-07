"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './assessments.module.css';

export default function Assessments() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data for assessments
  const pendingSubmissions = [
    {
      id: 1,
      title: "Basic Python Project",
      course: "Introduction to Python Programming",
      description: "Create a simple calculator application using Python",
      dueDate: "Apr 18, 2024",
      type: "Assignment"
    },
    {
      id: 2,
      title: "Data Visualization Exercise",
      course: "Data Science Basics",
      description: "Create data visualizations using matplotlib and pandas",
      dueDate: "Apr 20, 2024",
      type: "Assignment"
    }
  ];
  
  const upcomingAssessments = [
    {
      id: 3,
      title: "Control Flow in Python",
      course: "Introduction to Python Programming",
      description: "Quiz on control flow statements in Python",
      dueDate: "Apr 12, 2024",
      duration: "15 min",
      questions: 10,
      type: "Quiz"
    }
  ];
  
  const pastAssessments = [
    {
      id: 4,
      title: "Python Basics",
      course: "Introduction to Python Programming",
      type: "Quiz",
      score: 85,
      passing: 70,
      passed: true
    }
  ];

  return (
    <div className="code-learning-container">
      <div className={styles.assessmentsHeader}>
        <h1 className={styles.assessmentsTitle}>Assessments</h1>
        <p className={styles.assessmentsSubtitle}>Track your quizzes, tests, and assignments</p>
      </div>
      
      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Assessments
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "quizzes" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "assignments" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
      </div>
      
      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Pending Submissions</h2>
          
          {pendingSubmissions.map(assessment => (
            <div key={assessment.id} className={styles.assessmentItem}>
              <div className={styles.assessmentIconContainer}>
                <svg className={styles.assessmentIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              
              <div className={styles.assessmentContent}>
                <h3 className={styles.assessmentTitle}>{assessment.title}</h3>
                <p className={styles.assessmentCourse}>{assessment.course}</p>
                <p className={styles.assessmentDescription}>{assessment.description}</p>
              </div>
              
              <div className={styles.assessmentMeta}>
                <div className={styles.assessmentDueDate}>Due: {assessment.dueDate}</div>
                <div className={styles.assessmentType}>{assessment.type}</div>
                <div className={styles.assessmentAction}>
                  <Link href={`/dashboard/assessments/${assessment.id}`} className={styles.startButton}>
                    Start Assignment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
      
      {/* Upcoming Assessments */}
      {upcomingAssessments.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Upcoming Assessments</h2>
          
          {upcomingAssessments.map(assessment => (
            <div key={assessment.id} className={styles.assessmentItem}>
              <div className={styles.assessmentIconContainer}>
                <svg className={styles.assessmentIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 5V9" />
                  <path d="M12 15v4" />
                  <path d="M5 12H9" />
                  <path d="M15 12h4" />
                </svg>
              </div>
              
              <div className={styles.assessmentContent}>
                <h3 className={styles.assessmentTitle}>{assessment.title}</h3>
                <p className={styles.assessmentCourse}>{assessment.course}</p>
                <p className={styles.assessmentDescription}>{assessment.description}</p>
              </div>
              
              <div className={styles.assessmentMeta}>
                <div className={styles.assessmentDueDate}>Due: {assessment.dueDate}</div>
                <div className={styles.assessmentType}>{assessment.type} · {assessment.duration} · {assessment.questions} questions</div>
                <div className={styles.assessmentAction}>
                  <Link href={`/dashboard/courses/${assessment.id}`} className={styles.viewButton}>
                    View Course
                  </Link>
                  <Link href={`/dashboard/assessments/${assessment.id}`} className={styles.startButton}>
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
      
      {/* Past Assessments */}
      {pastAssessments.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Past Assessments</h2>
          
          {pastAssessments.map(assessment => (
            <div key={assessment.id} className={styles.assessmentItem}>
              <div className={styles.assessmentIconContainer}>
                <svg className={styles.assessmentIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 5V9" />
                  <path d="M12 15v4" />
                  <path d="M5 12H9" />
                  <path d="M15 12h4" />
                </svg>
              </div>
              
              <div className={styles.assessmentContent}>
                <h3 className={styles.assessmentTitle}>{assessment.title}</h3>
                <p className={styles.assessmentCourse}>{assessment.course}</p>
              </div>
              
              <div className={styles.assessmentMeta}>
                {assessment.passed && <div className={styles.passedBadge}>Passed</div>}
                <div className={styles.assessmentScore}>Score: {assessment.score}% (Passing: {assessment.passing}%)</div>
                <div className={styles.assessmentType}>{assessment.type}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
} 