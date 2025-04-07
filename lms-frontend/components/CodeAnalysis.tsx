import React from 'react';

interface CodeAnalysisProps {
  output: string;
  feedback: string;
  authenticityScore: number | null;
  plagiarismWarning: string | undefined;
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
    <div className="w-full md:w-1/2 flex flex-col space-y-4 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Code Analysis</h2>
      
      {authenticityScore !== null && (
        <div className={`mb-2 p-3 rounded-md ${authenticityScore >= 70 ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h3 className="text-md font-medium mb-1">Authenticity Check:</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  authenticityScore >= 90 ? 'bg-green-500' : 
                  authenticityScore >= 70 ? 'bg-green-400' : 
                  authenticityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${authenticityScore}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium">{authenticityScore}/100</span>
          </div>
          {plagiarismWarning && (
            <p className="mt-1 text-sm text-red-600">{plagiarismWarning}</p>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Output:</h3>
        <div className="bg-gray-100 p-4 rounded-md text-sm font-mono min-h-[100px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : output ? (
            output
          ) : (
            <span className="text-gray-400">Code output will appear here after submission</span>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Feedback:</h3>
        <div className="bg-gray-100 p-4 rounded-md text-sm min-h-[200px] whitespace-pre-line">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : feedback ? (
            feedback
          ) : (
            <span className="text-gray-400">Feedback on your code will appear here after submission</span>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Learning Resources:</h3>
        <ul className="list-disc pl-5 text-blue-600">
          <li><a href="#" className="hover:underline">Documentation for {selectedLanguage}</a></li>
          <li><a href="#" className="hover:underline">Best Practices for {selectedTopic}</a></li>
          <li><a href="#" className="hover:underline">Common Mistakes to Avoid</a></li>
          <li><a href="#" className="hover:underline">{selectedTopic} Tutorial</a></li>
        </ul>
      </div>
    </div>
  );
} 