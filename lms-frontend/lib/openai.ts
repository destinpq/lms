import axios from 'axios';

// Types for OpenAI interactions
export interface CodeQuestion {
  id: string;
  question: string;
  hints: string[];
  sampleInput?: string;
  sampleOutput?: string;
  difficulty: string;
  topic: string;
  language: string;
}

export interface CodeAnalysisResult {
  output: string;
  feedback: string;
  authenticityScore: number;
  plagiarismWarning: string | undefined;
}

// Type for topic data returned from OpenAI
interface TopicData {
  id?: string;
  name: string;
  description?: string;
  // Use index signature with unknown instead of any
  [key: string]: string | undefined;
}

// Helper function to get API key
const getApiKey = (): string => {
  // In browser environment, use NEXT_PUBLIC prefix
  const apiKey = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_OPENAI_API_KEY
    : process.env.OPENAI_API_KEY; // Use non-public env in server context
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.warn('OpenAI API key is not set or invalid - using mock data');
    return '';
  }
  return apiKey;
};

// Create axios instance for OpenAI API - create dynamically to ensure fresh token
const createOpenAiApi = () => {
  const apiKey = getApiKey();
  
  // If no API key, we'll use mock data instead
  if (!apiKey) return null;
  
  return axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });
};

// Function to generate a coding question based on topic and difficulty
export async function generateQuestion(topic: string, difficulty: string, language: string): Promise<CodeQuestion> {
  try {
    const openaiApi = createOpenAiApi();
    
    // If API is not available, return mock data
    if (!openaiApi) {
      return getMockQuestion(topic, difficulty, language);
    }
    
    const response = await openaiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a coding instructor creating programming exercises for students.'
        },
        {
          role: 'user',
          content: `Generate a coding question about ${topic} at ${difficulty} difficulty level specifically for ${language} programming language. The question must require writing ${language} code to solve it. Format the response as JSON with fields: question, hints (array), sampleInput, sampleOutput, difficulty, and topic.`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const questionText = response.data.choices[0].message.content;
    const questionData = JSON.parse(questionText);
    
    return {
      id: `${topic}-${difficulty}-${Date.now()}`,
      question: questionData.question,
      hints: Array.isArray(questionData.hints) ? questionData.hints : [],
      sampleInput: questionData.sampleInput,
      sampleOutput: questionData.sampleOutput,
      difficulty,
      topic,
      language
    };
  } catch (error) {
    console.error('Error generating question:', error);
    return getMockQuestion(topic, difficulty, language);
  }
}

// Mock question generator for when API is unavailable
function getMockQuestion(topic: string, difficulty: string, language: string): CodeQuestion {
  return {
    id: `${topic}-${difficulty}-mock-${Date.now()}`,
    question: `Create a ${difficulty} level ${language} program related to ${topic}.`,
    hints: [`Use ${language}-specific syntax and features.`, 'Break down the problem into smaller steps.'],
    difficulty,
    topic,
    language
  };
}

// Function to analyze code for authenticity and correctness
export async function analyzeCode(
  code: string, 
  language: string, 
  question: CodeQuestion
): Promise<CodeAnalysisResult> {
  try {
    const openaiApi = createOpenAiApi();
    
    // If API is not available, return mock data
    if (!openaiApi) {
      return getMockAnalysis();
    }
    
    const response = await openaiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a coding instructor evaluating student submissions.'
        },
        {
          role: 'user',
          content: `
            Analyze this ${language} code for a ${question.difficulty} level question about ${question.topic}.
            
            QUESTION: ${question.question}
            
            CODE:
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Return JSON with these fields:
            1. output: Simulated execution output
            2. feedback: Detailed code feedback
            3. authenticityScore: Number from 0-100 indicating originality
            4. plagiarismWarning: Any potential plagiarism concerns (or null)
          `
        }
      ],
      response_format: { type: 'json_object' }
    });

    const analysis = response.data.choices[0].message.content;
    const analysisData = JSON.parse(analysis);
    
    return {
      output: analysisData.output || 'No output generated',
      feedback: analysisData.feedback || 'No feedback available',
      authenticityScore: typeof analysisData.authenticityScore === 'number' ? analysisData.authenticityScore : 100,
      plagiarismWarning: analysisData.plagiarismWarning || undefined
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    return getMockAnalysis();
  }
}

// Mock analysis generator for when API is unavailable
function getMockAnalysis(): CodeAnalysisResult {
  return {
    output: 'Code executed successfully (simulated result)',
    feedback: 'The code looks well-structured. Consider adding more comments to explain your logic.',
    authenticityScore: 95,
    plagiarismWarning: undefined
  };
}

// Function to get available programming topics
export async function getTopics(): Promise<{id: string; name: string}[]> {
  try {
    const openaiApi = createOpenAiApi();
    
    // If API is not available, return mock data
    if (!openaiApi) {
      return getMockTopics();
    }
    
    const response = await openaiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a coding curriculum developer.'
        },
        {
          role: 'user',
          content: 'Generate a list of 6 programming topic categories for a learning platform. Return as JSON array with objects containing id and name fields.'
        }
      ],
      response_format: { type: 'json_object' }
    });

    const topicsText = response.data.choices[0].message.content;
    const topicsData = JSON.parse(topicsText);
    
    // Handle different possible response formats
    let topics: TopicData[] = topicsData.topics || topicsData;
    if (!Array.isArray(topics)) {
      topics = [];
    }
    
    return topics.map((topic: TopicData) => ({
      id: topic.id || topic.name.toLowerCase().replace(/\s+/g, '-'),
      name: topic.name
    }));
  } catch (error) {
    console.error('Error fetching topics:', error);
    return getMockTopics();
  }
}

// Mock topics generator for when API is unavailable
function getMockTopics(): Array<{id: string; name: string}> {
  return [
    { id: 'basics', name: 'Programming Basics' },
    { id: 'functions', name: 'Functions and Methods' },
    { id: 'data-structures', name: 'Data Structures' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'oop', name: 'Object-Oriented Programming' },
    { id: 'web-dev', name: 'Web Development' }
  ];
} 