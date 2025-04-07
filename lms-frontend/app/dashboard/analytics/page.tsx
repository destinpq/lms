"use client";

import { useState } from 'react';
import styles from './analytics.module.css';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [courseFilter, setCourseFilter] = useState('all');
  
  // Mock data for analytics
  const stats = [
    {
      label: 'Total Course Progress',
      value: '68%',
      change: '+12%',
      isPositive: true
    },
    {
      label: 'Completed Lessons',
      value: '42',
      change: '+8',
      isPositive: true
    },
    {
      label: 'Completed Quizzes',
      value: '15',
      change: '+3',
      isPositive: true
    },
    {
      label: 'Assessment Score',
      value: '82%',
      change: '-3%',
      isPositive: false
    }
  ];

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'python1', name: 'Introduction to Python Programming' },
    { id: 'html2', name: 'Web Development Fundamentals' },
    { id: 'datascience1', name: 'Data Science Basics' },
    { id: 'uiux1', name: 'UI/UX Design Principles' }
  ];
  
  const timeRanges = [
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: '90d', name: 'Last 90 days' },
    { id: 'ytd', name: 'Year to date' },
    { id: 'all', name: 'All time' }
  ];

  return (
    <div className="code-learning-container">
      <div className={styles.analyticsHeader}>
        <h1 className={styles.analyticsTitle}>Analytics</h1>
        <p className={styles.analyticsSubtitle}>Track your learning progress and performance</p>
      </div>
      
      {/* Filters */}
      <div className={styles.filterContainer}>
        <label htmlFor="timeRange" className={styles.filterLabel}>Time Range:</label>
        <select
          id="timeRange"
          className={styles.filterSelect}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          {timeRanges.map(range => (
            <option key={range.id} value={range.id}>
              {range.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="courseFilter" className={styles.filterLabel}>Course:</label>
        <select
          id="courseFilter"
          className={styles.filterSelect}
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Key Stats */}
      <div className={styles.analyticsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.analyticsCard}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div 
              className={`${styles.statChange} ${
                stat.isPositive ? styles.statChangePositive : styles.statChangeNegative
              }`}
            >
              {stat.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                </svg>
              )}
              {stat.change} {timeRange === '7d' ? 'this week' : timeRange === '30d' ? 'this month' : 'this period'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Over Time Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartCardHeader}>
          <h2 className={styles.chartCardTitle}>Progress Over Time</h2>
        </div>
        <div className={styles.chartCardBody}>
          <div className={styles.placeholderChart}>
            Progress chart visualization would appear here
          </div>
        </div>
      </div>
      
      {/* Time Spent Per Course Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartCardHeader}>
          <h2 className={styles.chartCardTitle}>Time Spent Per Course</h2>
        </div>
        <div className={styles.chartCardBody}>
          <div className={styles.placeholderChart}>
            Time distribution chart would appear here
          </div>
        </div>
      </div>
      
      {/* Assessment Performance Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartCardHeader}>
          <h2 className={styles.chartCardTitle}>Assessment Performance</h2>
        </div>
        <div className={styles.chartCardBody}>
          <div className={styles.placeholderChart}>
            Assessment scores chart would appear here
          </div>
        </div>
      </div>
    </div>
  );
} 