"use client";

import { useState } from 'react';
import styles from './settings.module.css';
import { useAuth } from '../../../lib/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: '',
    timeZone: 'America/New_York',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit this data to your API
    console.log('Profile data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      bio: formData.bio,
    });
    alert('Profile updated successfully!');
  };

  const handleSubmitPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit this data to your API
    console.log('Preferences data:', {
      timeZone: formData.timeZone,
      emailNotifications: formData.emailNotifications,
      pushNotifications: formData.pushNotifications,
      marketingEmails: formData.marketingEmails,
    });
    alert('Preferences updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    // In a real app, you would submit this data to your API
    console.log('Password change data:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
    
    alert('Password changed successfully!');
  };

  return (
    <div className="code-learning-container">
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>Settings</h1>
        <p className={styles.settingsSubtitle}>Manage your account settings and preferences</p>
      </div>
      
      {/* Profile Section */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHeader}>
          <h2 className={styles.settingsCardTitle}>Profile Information</h2>
        </div>
        <div className={styles.settingsCardBody}>
          <form onSubmit={handleSubmitProfile}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={styles.formInput}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={styles.formInput}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.formInput}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="bio" className={styles.formLabel}>Bio</label>
              <textarea
                id="bio"
                name="bio"
                className={styles.formInput}
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
              <p className={styles.formHelp}>
                Tell us a little about yourself. This will be visible on your public profile.
              </p>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={`${styles.formButton} ${styles.primaryButton}`}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Preferences Section */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHeader}>
          <h2 className={styles.settingsCardTitle}>Preferences</h2>
        </div>
        <div className={styles.settingsCardBody}>
          <form onSubmit={handleSubmitPreferences}>
            <div className={styles.formGroup}>
              <label htmlFor="timeZone" className={styles.formLabel}>Time Zone</label>
              <select
                id="timeZone"
                name="timeZone"
                className={styles.formSelect}
                value={formData.timeZone}
                onChange={handleChange}
              >
                {timeZones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Notifications</label>
              
              <div className={styles.formCheckboxGroup}>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className={styles.formCheckbox}
                />
                <label htmlFor="emailNotifications">Email notifications</label>
              </div>
              
              <div className={styles.formCheckboxGroup}>
                <input
                  type="checkbox"
                  id="pushNotifications"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={handleChange}
                  className={styles.formCheckbox}
                />
                <label htmlFor="pushNotifications">Push notifications</label>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.formCheckboxGroup}>
                <input
                  type="checkbox"
                  id="marketingEmails"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleChange}
                  className={styles.formCheckbox}
                />
                <label htmlFor="marketingEmails">
                  Receive marketing emails about new features, courses, and promotions
                </label>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={`${styles.formButton} ${styles.primaryButton}`}>
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Account Security */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHeader}>
          <h2 className={styles.settingsCardTitle}>Account Security</h2>
        </div>
        <div className={styles.settingsCardBody}>
          <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.formLabel}>Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className={styles.formInput}
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.formLabel}>New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className={styles.formInput}
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <p className={styles.formHelp}>
                Password should be at least 8 characters and include at least one uppercase letter, number, and special character.
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmNewPassword" className={styles.formLabel}>Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                className={styles.formInput}
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={`${styles.formButton} ${styles.primaryButton}`}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHeader}>
          <h2 className={styles.settingsCardTitle}>Danger Zone</h2>
        </div>
        <div className={styles.settingsCardBody}>
          <p className={styles.formHelp}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={`${styles.formButton} ${styles.dangerButton}`}
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // In a real app, you would submit this request to your API
                  console.log('Account deletion requested');
                  alert('Account deletion request submitted.');
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 