import React, { ChangeEvent } from 'react';
import { CodeQuestion } from '../lib/openai';

interface Language {
  id: string;
  name: string;
  template: string;
}

const LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript', template: 'function solution() {\n  // Write your code here\n  return "Hello, World!";\n}' },
  { id: 'python', name: 'Python', template: 'def solution():\n  # Write your code here\n  return "Hello, World!"' },
  { id: 'java', name: 'Java', template: 'class Solution {\n  public static void main(String[] args) {\n    // Write your code here\n    System.out.println("Hello, World!");\n  }\n}' },
  { id: 'cpp', name: 'C++', template: '#include <iostream>\n\nint main() {\n  // Write your code here\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}' },
];

interface CodeEditorProps {
  languageId: string;
  code: string;
  topicId: string;
  difficultyId: string;
  currentQuestion: CodeQuestion | null;
  showHints: boolean;
  isLoading: boolean;
  onLanguageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTopicChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onDifficultyChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onCodeChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onNewQuestion: () => void;
  onToggleHints: () => void;
  topics: {id: string; name: string}[];
  difficulties: {id: string; name: string}[];
}

export default function CodeEditor({
  languageId,
  code,
  topicId,
  difficultyId,
  currentQuestion,
  showHints,
  isLoading,
  onLanguageChange,
  onTopicChange,
  onDifficultyChange,
  onCodeChange,
  onSubmit,
  onNewQuestion,
  onToggleHints,
  topics,
  difficulties
}: CodeEditorProps) {
  // Check if there's a language mismatch
  const hasLanguageMismatch = currentQuestion && 
    currentQuestion.language && 
    currentQuestion.language !== languageId;

  return (
    <div>
      <div className="code-controls">
        <div className="code-select-group">
          <label htmlFor="language" className="code-select-label">Language</label>
          <select
            id="language"
            className="code-select"
            value={languageId}
            onChange={onLanguageChange}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <div className="code-select-group">
          <label htmlFor="topic" className="code-select-label">Topic</label>
          <select
            id="topic"
            className="code-select"
            value={topicId}
            onChange={onTopicChange}
          >
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
        
        <div className="code-select-group">
          <label htmlFor="difficulty" className="code-select-label">Difficulty</label>
          <select
            id="difficulty"
            className="code-select"
            value={difficultyId}
            onChange={onDifficultyChange}
          >
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="notification-button-container mr-2">
          <span className="notification-label">View notifications</span>
          <button className="lms-notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
        
        <div className="notification-button-container">
          <span className="notification-label">View messages</span>
          <button className="lms-notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      {hasLanguageMismatch && (
        <div className="challenge-card" style={{backgroundColor: "#fff8e6", borderLeftColor: "#eab308"}}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="challenge-title" style={{color: "#854d0e", marginBottom: "0"}}>Language Mismatch!</h3>
          </div>
          <p className="challenge-description" style={{color: "#854d0e", marginBottom: "0"}}>
            The current question is for {currentQuestion?.language} but you have selected {languageId}. 
            <button 
              onClick={onNewQuestion}
              className="hints-button ml-2"
              style={{color: "#854d0e"}}
            >
              Get a new question
            </button>
          </p>
        </div>
      )}
      
      {currentQuestion && (
        <div className="challenge-card">
          <h3 className="challenge-title">Challenge:</h3>
          <p className="challenge-description">{currentQuestion.question}</p>
          
          {(currentQuestion.sampleInput || currentQuestion.sampleOutput) && (
            <div className="mt-2 text-sm">
              {currentQuestion.sampleInput && <p className="challenge-description">{currentQuestion.sampleInput}</p>}
              {currentQuestion.sampleOutput && <p className="challenge-description">{currentQuestion.sampleOutput}</p>}
            </div>
          )}
          
          {currentQuestion.hints.length > 0 && (
            <div className="mt-2">
              <button 
                className="hints-button"
                onClick={onToggleHints}
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              
              {showHints && (
                <ul className="hints-list">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <div className="text-right">
            <button 
              className="submit-button"
              style={{width: "auto", padding: "0.5rem 1rem", marginTop: "0.5rem"}}
              onClick={onNewQuestion}
            >
              New Question
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-grow relative">
        <textarea
          className="code-textarea"
          value={code}
          onChange={onCodeChange}
          spellCheck="false"
        />
      </div>
      
      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Submit Code'}
      </button>
    </div>
  );
}

export { LANGUAGES }; 