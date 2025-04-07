"use client";

import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>This is a simple test page to check if routing works.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go to Dashboard
        </button>
        
        <button 
          onClick={() => window.location.href = '/'}
          style={{ marginLeft: '10px', padding: '10px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
} 