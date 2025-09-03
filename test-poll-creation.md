# Testing Poll Creation Functionality

This guide will help you test that the poll creation feature is working correctly with your Supabase database.

## 🧪 Prerequisites

1. ✅ **Database is set up** - You've run `database/setup.sql` in Supabase
2. ✅ **Environment variables** - Your `.env.local` file has Supabase credentials
3. ✅ **App is running** - `npm run dev` is working
4. ✅ **User account exists** - You can log in to the app

## 🚀 Test Steps

### Step 1: Verify Database Connection

1. **Open your app** at `http://localhost:3000`
2. **Check browser console** for any Supabase connection errors
3. **Verify authentication** - Try logging in/registering

### Step 2: Test Poll Creation

1. **Navigate to** `/polls/create`
2. **Fill out the form**:
   - **Title**: "Test Poll - What's your favorite color?"
   - **Description**: "This is a test poll to verify the system works"
   - **Options**:
     - "Red"
     - "Blue"
     - "Green"
     - "Yellow"
   - **Vote Type**: "Single Choice"
   - **Category**: "Test"
   - **Expires At**: Leave empty (optional)
   - **Anonymous**: Unchecked
3. **Click "Create Poll"**

### Step 3: Verify Success

✅ **Success indicators**:

- Green success message appears
- Redirects to the poll view page after 2 seconds
- No error messages in console

❌ **Failure indicators**:

- Red error message appears
- Console shows database errors
- Form doesn't submit

### Step 4: Check Database

1. **Go to Supabase Dashboard** → Table Editor
2. **Check the `polls` table**:
   - Your new poll should appear
   - Status should be "active"
   - Author ID should match your user ID
3. **Check the `poll_options` table**:
   - 4 options should exist for your poll
   - Each option should have the correct text
   - Order index should be 1, 2, 3, 4

### Step 5: Test Poll Display

1. **Go to** `/polls` (browse all polls)
2. **Your poll should appear** in the list
3. **Check poll details**:
   - Title and description are correct
   - Options are displayed
   - Author information is shown
   - Status badge shows "Active"

### Step 6: Test Dashboard

1. **Go to** `/dashboard`
2. **Check stats**:
   - "Polls Created" should be 1 (or increment)
   - "Total Polls" should show your poll
3. **Check recent polls**:
   - Your test poll should appear in the list
   - Creation date should be recent

## 🔍 Troubleshooting

### Common Issues

#### 1. "Failed to create poll" Error

**Possible causes**:

- Database connection issues
- Missing environment variables
- RLS policy blocking insert
- Database schema not set up

**Solutions**:

- Check browser console for specific errors
- Verify `.env.local` has correct Supabase credentials
- Ensure `database/setup.sql` was run successfully
- Check Supabase project is active

#### 2. Poll Created but Options Missing

**Possible causes**:

- `poll_options` table insert failed
- Foreign key constraint violation

**Solutions**:

- Check `poll_options` table exists
- Verify foreign key relationships
- Check RLS policies for `poll_options`

#### 3. Authentication Errors

**Possible causes**:

- Supabase Auth not configured
- Invalid API keys
- CORS issues

**Solutions**:

- Verify Supabase Auth is enabled
- Check API keys in Supabase dashboard
- Ensure localhost is in allowed origins

### Debug Commands

**Check Supabase connection**:

```javascript
// In browser console
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
console.log("Supabase client:", supabase);
```

**Test database query**:

```javascript
// Test if you can read from polls table
const { data, error } = await supabase.from("polls").select("*").limit(1);
console.log("Test query result:", { data, error });
```

## ✅ Success Criteria

Your poll creation is working correctly if:

1. ✅ **Form submits** without errors
2. ✅ **Success message** appears
3. ✅ **Poll appears** in database tables
4. ✅ **Poll displays** in polls list
5. ✅ **Dashboard updates** with new stats
6. ✅ **No console errors** related to Supabase

## 🎯 Next Steps

Once poll creation is working:

1. **Test voting functionality** - Implement and test the voting system
2. **Add more polls** - Create different types of polls
3. **Test edge cases** - Empty options, very long titles, etc.
4. **Implement real-time updates** - Add WebSocket subscriptions
5. **Add analytics** - Track poll views and engagement

## 📞 Getting Help

If you encounter issues:

1. **Check the console** for specific error messages
2. **Review Supabase logs** in the dashboard
3. **Verify database schema** matches `database/setup.sql`
4. **Check RLS policies** are correctly applied
5. **Open an issue** with detailed error information

---

**Happy Testing! 🧪✨**
