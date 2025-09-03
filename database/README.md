# Supabase Database Setup Guide

This guide will walk you through setting up the database schema for your AlxPolly polling application in Supabase.

## 🚀 Quick Setup (Recommended)

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Setup Script

1. Copy the entire contents of `setup.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see the following tables:
   - `profiles`
   - `polls`
   - `poll_options`
   - `votes`
   - `vote_options`

## 📋 Detailed Setup Steps

### 1. Create Custom Types

```sql
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE vote_type AS ENUM ('single', 'multiple');
```

### 2. Create Tables

Run each table creation script in order:

#### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Polls Table

```sql
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
```

#### Poll Options Table

```sql
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Votes Table

```sql
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voter_ip INET,
  voter_user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id, voter_ip)
);
```

#### Vote Options Table

```sql
CREATE TABLE vote_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID REFERENCES votes(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Create Indexes

```sql
CREATE INDEX idx_polls_author_id ON polls(author_id);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
```

### 4. Enable Row Level Security

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;
```

### 5. Create RLS Policies

Run the RLS policies from the setup script to secure your tables.

### 6. Create User Registration Trigger

```sql
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔐 Row Level Security (RLS) Policies

The setup script creates the following security policies:

### Profiles

- Users can only view, update, and insert their own profile

### Polls

- Anyone can view active/closed polls
- Users can only manage (CRUD) their own polls

### Poll Options

- Anyone can view options for active/closed polls
- Users can only manage options for their own polls

### Votes

- Users can view votes on polls they can see
- Users can only create votes on active polls
- Users can view their own votes

### Vote Options

- Users can only create vote options for their own votes

## 📊 Database Schema Overview

```
profiles (extends auth.users)
├── id (UUID, PK)
├── email (TEXT)
├── full_name (TEXT)
├── avatar_url (TEXT)
├── bio (TEXT)
└── timestamps

polls
├── id (UUID, PK)
├── title (TEXT)
├── description (TEXT)
├── author_id (UUID, FK to profiles)
├── status (poll_status enum)
├── vote_type (vote_type enum)
├── is_anonymous (BOOLEAN)
├── expires_at (TIMESTAMP)
├── tags (TEXT[])
├── category (TEXT)
├── total_votes (INTEGER)
└── timestamps

poll_options
├── id (UUID, PK)
├── poll_id (UUID, FK to polls)
├── text (TEXT)
├── order_index (INTEGER)
└── timestamps

votes
├── id (UUID, PK)
├── poll_id (UUID, FK to polls)
├── voter_id (UUID, FK to profiles)
├── voter_ip (INET)
├── voter_user_agent (TEXT)
└── timestamps

vote_options
├── id (UUID, PK)
├── vote_id (UUID, FK to votes)
├── option_id (UUID, FK to poll_options)
└── timestamps
```

## 🧪 Testing the Setup

### 1. Create a Test User

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Enter email and password
4. Check that a profile is automatically created

### 2. Test Poll Creation

1. Use the SQL Editor to insert a test poll:

```sql
INSERT INTO polls (title, description, author_id, status, vote_type, category)
VALUES (
  'Test Poll',
  'This is a test poll',
  'your-user-id-here',
  'active',
  'single',
  'Test'
);
```

### 3. Test Poll Options

```sql
INSERT INTO poll_options (poll_id, text, order_index)
VALUES
  ('your-poll-id-here', 'Option 1', 1),
  ('your-poll-id-here', 'Option 2', 2);
```

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied to set parameter "app.jwt_secret"**
   - **Solution**: This error is expected and can be ignored. Supabase automatically handles JWT secrets.
   - **Why**: The `app.jwt_secret` parameter can only be set by database superusers, which is not needed for normal operation.

2. **Permission Denied**: Make sure you're running as the `postgres` user
3. **Table Already Exists**: Drop existing tables first or use `CREATE TABLE IF NOT EXISTS`
4. **RLS Policy Errors**: Check that policies are created in the correct order

### Reset Database

If you need to start over:

```sql
DROP TABLE IF EXISTS vote_options CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS poll_status CASCADE;
DROP TYPE IF EXISTS vote_type CASCADE;
```

## 🔄 Next Steps

After setting up the database:

1. **Update Environment Variables**: Ensure your `.env.local` has the correct Supabase credentials
2. **Test Authentication**: Try registering and logging in users
3. **Test Poll Creation**: Create polls through your application
4. **Test Voting**: Cast votes on polls
5. **Monitor Logs**: Check Supabase logs for any errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?** Check the Supabase logs or create an issue in the repository.
