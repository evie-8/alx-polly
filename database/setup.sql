-- Simplified Supabase Database Setup for AlxPolly
-- Run this in your Supabase SQL Editor
-- Note: JWT secrets are automatically handled by Supabase

-- Step 1: Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE vote_type AS ENUM ('single', 'multiple');

-- Step 2: Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status poll_status DEFAULT 'active',
  vote_type vote_type DEFAULT 'single',
  is_anonymous BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  category TEXT,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create poll options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voter_ip INET,
  voter_user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id, voter_ip)
);

-- Step 6: Create vote options table (for multiple choice)
CREATE TABLE vote_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID REFERENCES votes(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create indexes for performance
CREATE INDEX idx_polls_author_id ON polls(author_id);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);

-- Step 8: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Polls policies
CREATE POLICY "Anyone can view active polls" ON polls
  FOR SELECT USING (status = 'active' OR status = 'closed');

CREATE POLICY "Users can view their own polls" ON polls
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE USING (auth.uid() = author_id);

-- Poll options policies
CREATE POLICY "Anyone can view poll options for active polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND (polls.status = 'active' OR polls.status = 'closed')
    )
  );

CREATE POLICY "Users can manage options for their own polls" ON poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.author_id = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Users can view votes on polls they can see" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND (polls.status = 'active' OR polls.status = 'closed')
    )
  );

CREATE POLICY "Users can create votes on active polls" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.status = 'active'
    )
  );

CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT USING (auth.uid() = voter_id);

-- Vote options policies
CREATE POLICY "Users can create vote options for their votes" ON vote_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM votes 
      WHERE votes.id = vote_options.vote_id
      AND votes.voter_id = auth.uid()
    )
  );

-- Step 10: Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 12: Test the setup (optional - run after creating a user)
-- After you create a user through your app or Supabase dashboard,
-- you can test the schema with this sample data:

/*
-- Example: Create a test poll (run this AFTER creating a user)
-- Replace 'your-user-id-here' with an actual user ID from auth.users

INSERT INTO polls (title, description, author_id, status, vote_type, category)
VALUES (
  'What is your favorite programming language?',
  'Let us know which programming language you prefer for development',
  'your-actual-user-id-here',
  'active',
  'single',
  'Technology'
);

-- Example: Add poll options (run this AFTER creating a poll)
-- Replace 'your-poll-id-here' with the actual poll ID

INSERT INTO poll_options (poll_id, text, order_index)
VALUES 
  ('your-actual-poll-id-here', 'JavaScript', 1),
  ('your-actual-poll-id-here', 'Python', 2),
  ('your-actual-poll-id-here', 'TypeScript', 3),
  ('your-actual-poll-id-here', 'Rust', 4),
  ('your-actual-poll-id-here', 'Go', 5);
*/
