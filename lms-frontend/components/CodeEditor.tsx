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
    <div className="w-full md:w-1/2 flex flex-col space-y-4 bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
          <select
            id="language"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={languageId}
            onChange={onLanguageChange}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
          <select
            id="topic"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={topicId}
            onChange={onTopicChange}
          >
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            id="difficulty"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={difficultyId}
            onChange={onDifficultyChange}
          >
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {hasLanguageMismatch && (
        <div className="bg-yellow-50 p-3 rounded-md mb-2 border border-yellow-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="font-medium text-yellow-800">Language Mismatch!</h3>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            The current question is for {currentQuestion?.language} but you have selected {languageId}. 
            <button 
              onClick={onNewQuestion}
              className="ml-2 font-medium underline hover:text-yellow-900 focus:outline-none"
            >
              Get a new question
            </button>
          </p>
        </div>
      )}
      
      {currentQuestion && (
        <div className="bg-blue-50 p-4 rounded-md mb-2">
          <h3 className="font-medium text-blue-800 mb-2">Challenge:</h3>
          <p className="text-blue-700">{currentQuestion.question}</p>
          
          {(currentQuestion.sampleInput || currentQuestion.sampleOutput) && (
            <div className="mt-2 text-sm">
              {currentQuestion.sampleInput && <p className="text-blue-600">{currentQuestion.sampleInput}</p>}
              {currentQuestion.sampleOutput && <p className="text-blue-600">{currentQuestion.sampleOutput}</p>}
            </div>
          )}
          
          {currentQuestion.hints.length > 0 && (
            <div className="mt-2">
              <button 
                className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
                onClick={onToggleHints}
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              
              {showHints && (
                <ul className="mt-1 list-disc list-inside text-sm text-blue-600">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <div className="mt-2 text-right">
            <button 
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              onClick={onNewQuestion}
            >
              New Question
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-grow relative">
        <textarea
          className="w-full h-full p-4 font-mono text-sm bg-gray-800 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={onCodeChange}
          spellCheck="false"
        />
      </div>
      
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Submit Code'}
      </button>
    </div>
  );
}

export { LANGUAGES }; 