-- Create database if it doesn't exist
CREATE DATABASE lms;

-- Connect to the database
\c lms;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Now database is ready for TypeORM to create tables based on our entities 