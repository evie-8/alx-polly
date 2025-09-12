# Troubleshooting Poll Creation Error

## 🚨 **The Problem**

You're encountering this error when trying to create a poll:

```
lib/db/pollService.ts (151:15) @ PollService.createPoll
lib/db/pollService.ts (194:13) @ PollService.createPoll
```  

## 🔍 **Root Causes & Solutions**

### **1. Database Connection Issues**

**Symptoms:**
- Error occurs immediately when calling `createPoll`
- No specific error message in console
- Generic "Failed to create poll" error

**Possible Causes:**
- Supabase credentials are incorrect
- Database is not accessible
- Network connectivity issues

**Solutions:**
1. **Check your `.env.local` file**:
   ```bash
   # Verify these are set correctly
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Verify Supabase project is active**:
   - Go to [supabase.com](https://supabase.com)
   - Check if your project is running
   - Ensure billing is not suspended

3. **Test database connection**:
   - Visit `/debug` page in your app
   - Click "Test Connection" button
   - Check browser console for detailed errors

### **2. Database Schema Issues**

**Symptoms:**
- Connection test passes but poll creation fails
- Error occurs during table insert operations

**Possible Causes:**
- Tables don't exist
- RLS policies are blocking operations
- Foreign key constraints are violated

**Solutions:**
1. **Verify database setup**:
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('polls', 'poll_options', 'profiles');
   ```

2. **Check RLS policies**:
   ```sql
   -- Verify RLS is enabled and policies exist
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename IN ('polls', 'poll_options');
   ```

3. **Re-run setup script**:
   - Copy `database/setup.sql` content
   - Paste in Supabase SQL Editor
   - Execute the script

### **3. Authentication Issues**

**Symptoms:**
- User appears logged in but operations fail
- RLS policies blocking database access

**Possible Causes:**
- JWT token is invalid or expired
- User profile doesn't exist in database
- RLS policies are too restrictive

**Solutions:**
1. **Check user authentication**:
   - Visit `/debug` page
   - Verify "User Status" shows "Authenticated"
   - Check if User ID is displayed

2. **Verify user profile exists**:
   ```sql
   -- Check if your user has a profile
   SELECT * FROM profiles WHERE id = 'your-user-id';
   ```

3. **Check RLS policies**:
   ```sql
   -- View RLS policies for polls table
   SELECT * FROM pg_policies WHERE tablename = 'polls';
   ```

### **4. Data Validation Issues**

**Symptoms:**
- Form submits but poll creation fails
- Specific validation errors in console

**Possible Causes:**
- Invalid data types being sent
- Missing required fields
- Data format issues

**Solutions:**
1. **Check form data**:
   - Open browser console
   - Look for "Creating poll with data:" log
   - Verify all required fields are present

2. **Validate data types**:
   - Ensure `vote_type` is "single" or "multiple"
   - Check `author_id` is a valid UUID
   - Verify `options` array has at least 2 items

## 🧪 **Step-by-Step Debugging**

### **Step 1: Use the Debug Page**

1. **Navigate to** `/debug` in your app
2. **Click "Test Connection"** - This tests basic database access
3. **Click "Test Create Poll"** - This tests the full poll creation flow
4. **Check results** - Look for specific error messages

### **Step 2: Check Browser Console**

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Try to create a poll**
4. **Look for detailed error logs**:
   - "Creating poll with data:" - Shows what's being sent
   - "Error creating poll:" - Shows database errors
   - "Error in createPoll:" - Shows general errors

### **Step 3: Verify Database State**

1. **Go to Supabase Dashboard**
2. **Check Table Editor**:
   - Verify `polls` table exists
   - Verify `poll_options` table exists
   - Verify `profiles` table exists
3. **Check RLS policies**:
   - Ensure policies allow authenticated users to insert

### **Step 4: Test Database Permissions**

```sql
-- Test if you can insert into polls table
INSERT INTO polls (title, description, author_id, status, vote_type) 
VALUES ('Test Poll', 'Test Description', 'your-user-id', 'active', 'single');

-- Test if you can insert into poll_options table
INSERT INTO poll_options (poll_id, text, order_index) 
VALUES ('poll-id-from-above', 'Test Option', 1);
```

## 🔧 **Quick Fixes**

### **Fix 1: Recreate Database Schema**

```sql
-- Drop and recreate tables (WARNING: This deletes all data)
DROP TABLE IF EXISTS vote_options, votes, poll_options, polls, poll_shares, poll_views, profiles CASCADE;

-- Then run the full database/setup.sql script
```

### **Fix 2: Reset RLS Policies**

```sql
-- Disable RLS temporarily for testing
ALTER TABLE polls DISABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options DISABLE ROW LEVEL SECURITY;

-- Test poll creation
-- If it works, the issue is with RLS policies
-- Re-enable and fix policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
```

### **Fix 3: Check User Profile**

```sql
-- Ensure user profile exists
INSERT INTO profiles (id, email, full_name) 
VALUES ('your-user-id', 'your-email@example.com', 'Your Name')
ON CONFLICT (id) DO NOTHING;
```

## 📋 **Common Error Messages & Solutions**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Failed to create poll" | Generic error | Check console for specific details |
| "relation 'polls' does not exist" | Table missing | Run database/setup.sql |
| "permission denied" | RLS policy blocking | Check RLS policies |
| "foreign key constraint" | Invalid author_id | Verify user profile exists |
| "invalid input syntax" | Data type mismatch | Check form data types |

## 🆘 **Getting More Help**

### **1. Collect Debug Information**

Before asking for help, gather:
- Screenshot of `/debug` page results
- Browser console error logs
- Supabase dashboard table structure
- Environment variables (without actual values)

### **2. Check Supabase Logs**

1. Go to Supabase Dashboard
2. Navigate to Logs → Database
3. Look for errors during poll creation
4. Check for authentication failures

### **3. Test with Minimal Data**

Try creating a poll with minimal data:
```typescript
const minimalPoll = {
  title: "Test",
  options: ["Option 1", "Option 2"],
  vote_type: "single" as const
};
```

## ✅ **Success Checklist**

Your poll creation is working when:

- [ ] `/debug` page shows "Connection successful"
- [ ] `/debug` page shows "Poll creation successful"
- [ ] No errors in browser console
- [ ] Poll appears in database tables
- [ ] Poll displays in polls list
- [ ] Dashboard shows updated stats

---

**Need more help?** Check the console logs, use the debug page, and verify your database setup step by step!
