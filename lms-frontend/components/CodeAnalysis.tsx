import React from 'react';

interface CodeAnalysisProps {
  output: string;
  feedback: string;
  authenticityScore: number | null;
  plagiarismWarning?: string;
  isLoading: boolean;
  selectedLanguage: string;
  selectedTopic: string;
}

export default function CodeAnalysis({
  output,
  feedback,
  authenticityScore,
  plagiarismWarning,
  isLoading,
  selectedLanguage,
  selectedTopic
}: CodeAnalysisProps) {
  return (
    <div className="code-analysis">
      <h2 className="analysis-title">Code Analysis</h2>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Output:</h3>
        <div className="output-container">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span className="ml-2 text-gray-500">Processing...</span>
            </div>
          ) : output ? (
            <pre>{output}</pre>
          ) : (
            <p className="text-gray-500">Code output will appear here after submission</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h3>
        <div className="output-container">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span className="ml-2 text-gray-500">Processing...</span>
            </div>
          ) : feedback ? (
            <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: feedback }} />
          ) : (
            <p className="text-gray-500">Feedback on your code will appear here after submission</p>
          )}
        </div>
      </div>
      
      {authenticityScore !== null && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Authenticity Score:</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${authenticityScore > 80 ? 'bg-green-600' : authenticityScore > 50 ? 'bg-yellow-500' : 'bg-red-600'}`} 
                style={{ width: `${authenticityScore}%` }}
              ></div>
            </div>
            <span className="ml-2 font-medium text-sm">{authenticityScore}%</span>
          </div>
        </div>
      )}
      
      {plagiarismWarning && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md mb-4 text-sm">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-medium">Plagiarism Detection Alert</div>
              <div>{plagiarismWarning}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="learning-resources">
        <h3 className="resources-title">Learning Resources:</h3>
        <ul className="resources-list">
          <li>
            <a href="#" className="resource-link">Documentation for {selectedLanguage}</a>
          </li>
          <li>
            <a href="#" className="resource-link">Best Practices for {selectedTopic}</a>
          </li>
          <li>
            <a href="#" className="resource-link">Common Mistakes to Avoid</a>
          </li>
          <li>
            <a href="#" className="resource-link">{selectedTopic} Tutorial</a>
          </li>
        </ul>
      </div>
    </div>
  );
} 