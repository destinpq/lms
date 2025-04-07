// Direct database seeding script that bypasses NestJS
require('dotenv').config();
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Import our mock topics data
const mockTopics = {
  python: [
    { name: 'Variables and Data Types', description: 'Learn about variables, numbers, strings, and booleans in Python.' },
    { name: 'Control Flow', description: 'Master if-else statements, for and while loops in Python.' },
    { name: 'Functions', description: 'Create reusable code blocks with functions, parameters, and return values.' },
    { name: 'Lists and Tuples', description: 'Work with collections of items using Python lists and tuples.' },
    { name: 'Dictionaries', description: 'Store key-value pairs using Python dictionaries.' },
    { name: 'File I/O', description: 'Read from and write to files in Python.' },
    { name: 'Exception Handling', description: 'Handle errors and exceptions in Python code.' },
    { name: 'Object-Oriented Programming', description: 'Create classes and objects in Python.' },
    { name: 'Modules and Packages', description: 'Organize code with modules and packages in Python.' },
    { name: 'Lambda Functions', description: 'Create anonymous functions with lambda expressions.' },
  ],
  java: [
    { name: 'Variables and Data Types', description: 'Learn about primitive types and variables in Java.' },
    { name: 'Control Flow', description: 'Master if-else statements, for and while loops in Java.' },
    { name: 'Methods', description: 'Create reusable code blocks with methods, parameters, and return types.' },
    { name: 'Arrays', description: 'Work with collections of items using Java arrays.' },
    { name: 'Classes and Objects', description: 'Create and use classes and objects in Java.' },
    { name: 'Inheritance', description: 'Extend classes and reuse code with inheritance.' },
    { name: 'Interfaces', description: 'Define contracts with Java interfaces.' },
    { name: 'Exception Handling', description: 'Handle errors and exceptions in Java code.' },
    { name: 'Collections Framework', description: 'Use Lists, Sets, and Maps in Java.' },
    { name: 'Generics', description: 'Create type-safe collections and methods with generics.' },
  ],
  javascript: [
    { name: 'Variables and Data Types', description: 'Learn about variables, numbers, strings, and booleans in JavaScript.' },
    { name: 'Control Flow', description: 'Master if-else statements, for and while loops in JavaScript.' },
    { name: 'Functions', description: 'Create reusable code blocks with functions in JavaScript.' },
    { name: 'Arrays', description: 'Work with collections of items using JavaScript arrays.' },
    { name: 'Objects', description: 'Store key-value pairs using JavaScript objects.' },
    { name: 'DOM Manipulation', description: 'Interact with HTML elements using the Document Object Model.' },
    { name: 'Events', description: 'Handle user interactions with event listeners.' },
    { name: 'Asynchronous JavaScript', description: 'Work with Promises, async/await, and callbacks.' },
    { name: 'ES6 Features', description: 'Use modern JavaScript syntax like arrow functions and destructuring.' },
    { name: 'Modules', description: 'Organize code with import and export statements.' },
  ],
  cpp: [
    { name: 'Variables and Data Types', description: 'Learn about variables, primitives, and type safety in C++.' },
    { name: 'Control Flow', description: 'Master if-else statements, for and while loops in C++.' },
    { name: 'Functions', description: 'Create reusable code blocks with functions, parameters, and return types.' },
    { name: 'Arrays and Vectors', description: 'Work with collections of items using C++ arrays and vectors.' },
    { name: 'Pointers and References', description: 'Understand memory management with pointers and references.' },
    { name: 'Classes and Objects', description: 'Create and use classes and objects in C++.' },
    { name: 'Inheritance', description: 'Extend classes and reuse code with inheritance.' },
    { name: 'Templates', description: 'Write generic code with C++ templates.' },
    { name: 'Standard Template Library', description: 'Use containers, iterators, and algorithms in the STL.' },
    { name: 'Memory Management', description: 'Manage dynamic memory allocation in C++.' },
  ],
};

// Map of language slugs to their UUIDs in the database
const languageMap = {
  python: '9b348e25-02c1-418e-ac90-23fa9ee5806a',
  java: '25fb82e8-6eb7-4a9b-ad49-891c6ca982a5',
  javascript: 'b43ea06d-489f-482a-aef2-6331111b5e98',
  cpp: '0dac14cc-85f2-48d4-a5dc-e84a2ad95c14',
};

// Number of topics to generate for each language (duplicating as needed)
const TOPICS_PER_LANGUAGE = 100;

async function seedTopics() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'lms',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Clear existing topics if --clear flag is present
    if (process.argv.includes('--clear')) {
      console.log('Clearing existing topics...');
      await client.query('DELETE FROM topics');
      console.log('Topics table cleared');
    }

    // Check if topics table exists
    let tableResult;
    try {
      tableResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE  table_schema = 'public' 
          AND    table_name   = 'topics'
        );
      `);
      
      if (!tableResult.rows[0].exists) {
        console.log('Topics table does not exist, creating it...');
        await client.query(`
          CREATE TABLE topics (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            "languageId" UUID NOT NULL,
            FOREIGN KEY ("languageId") REFERENCES languages(id)
          );
        `);
        console.log('Topics table created');
      }
    } catch (err) {
      console.error('Error checking/creating topics table:', err);
      return;
    }

    // Seed topics for each language
    for (const [langSlug, langId] of Object.entries(languageMap)) {
      console.log(`Seeding topics for ${langSlug}...`);
      
      // Get base topics for this language
      const baseTopics = mockTopics[langSlug] || [];
      if (baseTopics.length === 0) {
        console.log(`No topics found for ${langSlug}, skipping`);
        continue;
      }

      // Generate the required number of topics (repeating with suffixes if needed)
      const topicsToInsert = [];
      for (let i = 0; i < TOPICS_PER_LANGUAGE; i++) {
        const baseIndex = i % baseTopics.length;
        const baseTopic = baseTopics[baseIndex];
        
        // Add a suffix to make duplicate topics unique (if needed)
        const suffix = i >= baseTopics.length ? ` ${Math.floor(i / baseTopics.length) + 1}` : '';
        
        topicsToInsert.push({
          id: uuidv4(),
          name: baseTopic.name + suffix,
          description: baseTopic.description,
          languageId: langId
        });
      }

      // Insert topics in batches to avoid overloading the database
      const batchSize = 20;
      for (let i = 0; i < topicsToInsert.length; i += batchSize) {
        const batch = topicsToInsert.slice(i, i + batchSize);
        
        // Prepare batch query
        const values = batch.map((topic, index) => {
          const offset = index * 4;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
        }).join(', ');
        
        const params = batch.flatMap(topic => [
          topic.id, 
          topic.name, 
          topic.description, 
          topic.languageId
        ]);
        
        const query = `
          INSERT INTO topics (id, name, description, "languageId") 
          VALUES ${values}
          ON CONFLICT (id) DO NOTHING;
        `;
        
        try {
          await client.query(query, params);
          console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(topicsToInsert.length / batchSize)} for ${langSlug}`);
        } catch (err) {
          console.error(`Error inserting batch for ${langSlug}:`, err);
        }
      }

      console.log(`Seeded ${topicsToInsert.length} topics for ${langSlug}`);
    }

    // Verify the results
    const countResult = await client.query('SELECT COUNT(*) FROM topics');
    console.log(`Total topics in database: ${countResult.rows[0].count}`);
    
    const countByLangResult = await client.query('SELECT COUNT(*) as count, "languageId" FROM topics GROUP BY "languageId"');
    console.log('Topics by language:');
    console.table(countByLangResult.rows);

  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

// Run the seeding
seedTopics().catch(console.error); 