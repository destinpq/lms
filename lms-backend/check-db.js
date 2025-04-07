// Simple script to check database tables and manually trigger seeding
require('dotenv').config();
const { Client } = require('pg');

async function checkDatabase() {
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

    // Check languages table
    console.log('\n--- Languages ---');
    const langResult = await client.query('SELECT * FROM languages');
    console.log(`Found ${langResult.rows.length} languages`);
    console.table(langResult.rows);

    // Check topics table
    console.log('\n--- Topics ---');
    const topicResult = await client.query('SELECT COUNT(*) as count, "languageId" FROM topics GROUP BY "languageId"');
    console.log(`Topic count by language:`);
    console.table(topicResult.rows);

    // Get sample topics
    const sampleTopics = await client.query('SELECT * FROM topics LIMIT 5');
    console.log('\n--- Sample Topics ---');
    console.table(sampleTopics.rows);

    // Manual seeding trigger
    if (process.argv.includes('--seed')) {
      console.log('\n--- Forcing Manual Seed ---');
      
      // Clear existing topics if --clear flag is present
      if (process.argv.includes('--clear')) {
        console.log('Clearing existing topics...');
        await client.query('DELETE FROM topics');
      }
      
      // Set RUN_SEEDER=true in environment
      process.env.RUN_SEEDER = 'true';
      
      // This is just a demonstration - in a real app, you'd need to properly
      // integrate with NestJS to call the SeedService methods
      console.log('To perform actual seeding:');
      console.log('1. Make sure OPENAI_API_KEY is set in .env');
      console.log('2. Set RUN_SEEDER=true in .env');
      console.log('3. Restart the NestJS application');
    }

  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

checkDatabase().catch(console.error); 