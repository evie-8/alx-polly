-- Test Data for AlxPolly Database
-- Run this AFTER setting up the database and creating at least one user
-- This file contains sample data to test your database setup

-- Step 1: Check if you have users
-- Go to Supabase Dashboard → Authentication → Users
-- Note down a user ID to use for testing

-- Step 2: Create a test poll (replace 'your-user-id-here' with actual user ID)
INSERT INTO polls (title, description, author_id, status, vote_type, category)
VALUES (
  'What is your favorite programming language?',
  'Let us know which programming language you prefer for development',
  'your-actual-user-id-here', -- Replace with actual user ID
  'active',
  'single',
  'Technology'
);

-- Step 3: Get the poll ID (run this query to see the created poll)
-- SELECT id, title, author_id FROM polls WHERE title LIKE '%programming language%';

-- Step 4: Add poll options (replace 'your-poll-id-here' with actual poll ID)
INSERT INTO poll_options (poll_id, text, order_index)
VALUES 
  ('your-actual-poll-id-here', 'JavaScript', 1),    -- Replace with actual poll ID
  ('your-actual-poll-id-here', 'Python', 2),        -- Replace with actual poll ID
  ('your-actual-poll-id-here', 'TypeScript', 3),    -- Replace with actual poll ID
  ('your-actual-poll-id-here', 'Rust', 4),          -- Replace with actual poll ID
  ('your-actual-poll-id-here', 'Go', 5);            -- Replace with actual poll ID

-- Step 5: Create another test poll
INSERT INTO polls (title, description, author_id, status, vote_type, category)
VALUES (
  'Best framework for building APIs?',
  'Share your experience with different frameworks',
  'your-actual-user-id-here', -- Replace with actual user ID
  'active',
  'single',
  'Technology'
);

-- Step 6: Add options for the second poll
INSERT INTO poll_options (poll_id, text, order_index)
VALUES 
  ('your-second-poll-id-here', 'Express.js', 1),    -- Replace with actual poll ID
  ('your-second-poll-id-here', 'FastAPI', 2),       -- Replace with actual poll ID
  ('your-second-poll-id-here', 'Spring Boot', 3),   -- Replace with actual poll ID
  ('your-second-poll-id-here', 'Laravel', 4),       -- Replace with actual poll ID
  ('your-second-poll-id-here', 'Django', 5);        -- Replace with actual poll ID

-- Step 7: Test voting (optional - requires another user or anonymous voting)
-- Note: This requires the voter_id to exist in profiles table
-- For testing, you can create a vote with the same user ID as the poll author

-- Step 8: Verify the setup
-- Run these queries to check your data:

-- Check profiles
-- SELECT * FROM profiles;

-- Check polls
-- SELECT p.*, pr.full_name as author_name 
-- FROM polls p 
-- JOIN profiles pr ON p.author_id = pr.id;

-- Check poll options
-- SELECT po.*, p.title as poll_title 
-- FROM poll_options po 
-- JOIN polls p ON po.poll_id = p.id;

-- Check total votes (should be 0 initially)
-- SELECT title, total_votes FROM polls;

-- Step 9: Test the trigger function
-- The trigger should automatically update total_votes when votes are added
-- You can test this by adding votes and checking if total_votes increases

-- Step 10: Test RLS policies
-- Try to view data from different user contexts to ensure security works
-- The policies should prevent users from seeing other users' private data
