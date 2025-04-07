"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  CodeQuestion, 
  generateQuestion, 
  analyzeCode, 
  getTopics 
} from '../../lib/openai';
import CodeEditor, { LANGUAGES } from '../../components/CodeEditor';
import CodeAnalysis from '../../components/CodeAnalysis';

// Default difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedLanguageId, setSelectedLanguageId] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [topics, setTopics] = useState([{ id: 'loading', name: 'Loading...' }]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedDifficultyId, setSelectedDifficultyId] = useState(DIFFICULTY_LEVELS[0].id);
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CodeQuestion | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [authenticityScore, setAuthenticityScore] = useState<number | null>(null);
  const [plagiarismWarning, setPlagiarismWarning] = useState<string | undefined>(undefined);

  // Reset analysis results
  const resetResults = () => {
    setOutput('');
    setFeedback('');
    setAuthenticityScore(null);
    setPlagiarismWarning(undefined);
  };

  // Fetch a new question from OpenAI
  const fetchNewQuestion = useCallback(async () => {
    if (!selectedTopicId || !selectedLanguageId) return;
    
    setIsLoading(true);
    try {
      const question = await generateQuestion(
        selectedTopicId, 
        selectedDifficultyId,
        selectedLanguageId
      );
      setCurrentQuestion(question);
      setShowHints(false);
      resetResults();
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopicId, selectedDifficultyId, selectedLanguageId]);

  // Fetch topics on component mount
  useEffect(() => {
    async function fetchTopics() {
      const fetchedTopics = await getTopics();
      setTopics(fetchedTopics);
      if (fetchedTopics.length > 0) {
        setSelectedTopicId(fetchedTopics[0].id);
      }
    }
    fetchTopics();
  }, []);

  // Generate question when topic or difficulty changes
  useEffect(() => {
    if (selectedTopicId && selectedLanguageId) {
      fetchNewQuestion();
    }
  }, [selectedTopicId, selectedDifficultyId, selectedLanguageId, fetchNewQuestion]);

  // Handle language selection change
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const langId = e.target.value;
    setSelectedLanguageId(langId);
    const selectedLang = LANGUAGES.find(lang => lang.id === langId);
    if (selectedLang) {
      setCode(selectedLang.template);
    }
    resetResults();
    // Fetch a new question that matches the new language
    if (selectedTopicId && selectedDifficultyId) {
      fetchNewQuestion();
    }
  };

  // Submit code for analysis
  const handleSubmit = async () => {
    if (!currentQuestion) return;
    
    setIsLoading(true);
    resetResults();
    
    try {
      const result = await analyzeCode(code, selectedLanguageId, currentQuestion);
      setOutput(result.output);
      setFeedback(result.feedback);
      setAuthenticityScore(result.authenticityScore);
      setPlagiarismWarning(result.plagiarismWarning);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setFeedback('Error analyzing your code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected language and topic names
  const selectedLanguage = LANGUAGES.find(lang => lang.id === selectedLanguageId)?.name || '';
  const selectedTopic = topics.find(topic => topic.id === selectedTopicId)?.name || '';

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Code Learning Platform</h1>
      <p className="text-gray-600">Welcome {user?.firstName || 'Student'}! Practice your coding skills below.</p>
      
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-250px)]">
        <CodeEditor
          languageId={selectedLanguageId}
          code={code}
          topicId={selectedTopicId}
          difficultyId={selectedDifficultyId}
          currentQuestion={currentQuestion}
          showHints={showHints}
          isLoading={isLoading}
          onLanguageChange={handleLanguageChange}
          onTopicChange={(e) => setSelectedTopicId(e.target.value)}
          onDifficultyChange={(e) => setSelectedDifficultyId(e.target.value)}
          onCodeChange={(e) => setCode(e.target.value)}
          onSubmit={handleSubmit}
          onNewQuestion={fetchNewQuestion}
          onToggleHints={() => setShowHints(!showHints)}
          topics={topics}
          difficulties={DIFFICULTY_LEVELS}
        />
        
        <CodeAnalysis
          output={output}
          feedback={feedback}
          authenticityScore={authenticityScore}
          plagiarismWarning={plagiarismWarning}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          selectedTopic={selectedTopic}
        />
      </div>
    </div>
  );
} 