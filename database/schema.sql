-- Enable Row Level Security (RLS)
-- Note: app.jwt_secret is automatically set by Supabase

-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE vote_type AS ENUM ('single', 'multiple');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polls table
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

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voter_ip INET,
  voter_user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id, voter_ip)
);

-- Create vote_options table (for multiple choice votes)
CREATE TABLE vote_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID REFERENCES votes(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_shares table for tracking poll sharing
CREATE TABLE poll_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  platform TEXT, -- 'twitter', 'facebook', 'linkedin', 'email', etc.
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_views table for analytics
CREATE TABLE poll_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewer_ip INET,
  viewer_user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_polls_author_id ON polls(author_id);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_polls_category ON polls(category);
CREATE INDEX idx_polls_tags ON polls USING GIN(tags);

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_options_order ON poll_options(poll_id, order_index);

CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_votes_created_at ON votes(created_at);

CREATE INDEX idx_vote_options_vote_id ON vote_options(vote_id);
CREATE INDEX idx_vote_options_option_id ON vote_options(option_id);

CREATE INDEX idx_poll_shares_poll_id ON poll_shares(poll_id);
CREATE INDEX idx_poll_views_poll_id ON poll_views(poll_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update total_votes count
CREATE OR REPLACE FUNCTION update_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE polls SET total_votes = total_votes + 1 WHERE id = NEW.poll_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE polls SET total_votes = total_votes - 1 WHERE id = OLD.poll_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for vote count updates
CREATE TRIGGER update_poll_vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_poll_vote_count();

-- Create function to get poll results with vote counts
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id as option_id,
    po.text as option_text,
    COUNT(vo.id) as vote_count,
    CASE 
      WHEN p.total_votes = 0 THEN 0
      ELSE ROUND((COUNT(vo.id)::NUMERIC / p.total_votes::NUMERIC) * 100, 2)
    END as percentage
  FROM poll_options po
  LEFT JOIN polls p ON p.id = po.poll_id
  LEFT JOIN vote_options vo ON vo.option_id = po.id
  WHERE po.poll_id = poll_uuid
  GROUP BY po.id, po.text, p.total_votes
  ORDER BY po.order_index, po.created_at;
END;
$$ language 'plpgsql';

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for polls
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

-- RLS Policies for poll_options
CREATE POLICY "Anyone can view poll options for active polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND (polls.status = 'active' OR polls.status = 'closed')
    )
  );

CREATE POLICY "Users can view options for their own polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.author_id = auth.uid()
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

-- RLS Policies for votes
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

-- RLS Policies for vote_options
CREATE POLICY "Users can view vote options for polls they can see" ON vote_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM votes v
      JOIN polls p ON p.id = v.poll_id
      WHERE v.id = vote_options.vote_id
      AND (p.status = 'active' OR p.status = 'closed')
    )
  );

CREATE POLICY "Users can create vote options for their votes" ON vote_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM votes 
      WHERE votes.id = vote_options.vote_id
      AND votes.voter_id = auth.uid()
    )
  );

-- RLS Policies for poll_shares
CREATE POLICY "Anyone can view poll shares" ON poll_shares
  FOR SELECT USING (true);

CREATE POLICY "Users can create poll shares" ON poll_shares
  FOR INSERT WITH CHECK (true);

-- RLS Policies for poll_views
CREATE POLICY "Anyone can view poll views" ON poll_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create poll views" ON poll_views
  FOR INSERT WITH CHECK (true);

-- Create a function to handle new user registration
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

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Note: Sample data should be created AFTER users exist in the system
-- The trigger will automatically create profiles when users register
-- You can then create polls and options using the actual user IDs
