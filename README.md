# AlxPolly - Next.js Polling App

A modern, real-time polling application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **User Authentication** - Secure login/registration with Supabase Auth
- **Poll Creation** - Create polls with multiple options, categories, and expiration dates
- **Real-time Voting** - Vote on active polls with single or multiple choice options
- **Dashboard** - View your polls, stats, and activity
- **Responsive Design** - Beautiful UI that works on all devices
- **Row Level Security** - Secure data access with Supabase RLS policies 

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: Shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Styling**: Tailwind CSS with custom design system

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── polls/                   # Poll-related pages
│   │   ├── create/              # Create new poll
│   │   ├── [id]/                # Individual poll view
│   │   └── page.tsx             # Browse all polls
│   ├── dashboard/                # User dashboard
│   ├── profile/                  # User profile management
│   └── layout.tsx               # Root layout with navigation
├── components/                   # Reusable UI components
│   ├── auth/                    # Authentication components
│   ├── polls/                   # Poll-related components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   └── ui/                      # Shadcn/ui components
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication context
├── lib/                         # Utility libraries
│   ├── supabase/                # Supabase client configuration
│   ├── db/                      # Database services
│   └── types/                   # TypeScript type definitions
├── database/                    # Database schema and setup
│   ├── schema.sql               # Complete database schema
│   ├── setup.sql                # Quick setup script
│   ├── test-data.sql            # Sample data for testing
│   └── README.md                # Database setup guide
└── public/                      # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd alx-polly
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings → API
3. **Copy environment variables**:

```bash
cp env.example .env.local
```

4. **Fill in your Supabase credentials** in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. **Open Supabase Dashboard** → SQL Editor
2. **Run the setup script**:

```sql
-- Copy and paste the contents of database/setup.sql
-- This creates all tables, policies, and functions
```

3. **Verify setup** by checking Tables → Schema

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The app uses a robust PostgreSQL schema with:

- **profiles** - User profile information
- **polls** - Poll metadata and settings
- **poll_options** - Individual poll options
- **votes** - User votes on polls
- **vote_options** - Which options were selected in each vote
- **poll_shares** - Poll sharing analytics
- **poll_views** - Poll view analytics

### Key Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic triggers** - Vote counting and profile creation
- **Foreign key constraints** - Data integrity
- **Indexes** - Performance optimization

## 🔐 Authentication Flow

1. **Registration** - Users sign up with email/password
2. **Profile Creation** - Automatic profile creation via database trigger
3. **Login** - JWT-based authentication with Supabase
4. **Protected Routes** - Middleware protects authenticated pages
5. **Session Management** - Automatic session refresh and validation

## 📊 Poll Creation & Management

### Creating Polls

1. **Navigate to** `/polls/create`
2. **Fill out the form**:
   - Title (required, min 3 characters)
   - Description (optional)
   - Poll options (minimum 2)
   - Vote type (single/multiple choice)
   - Category (optional)
   - Expiration date (optional)
   - Anonymous option
3. **Submit** - Poll is created and stored in Supabase

### Poll Features

- **Multiple choice support** - Allow users to select multiple options
- **Category organization** - Group polls by topic
- **Expiration dates** - Set when polls automatically close
- **Anonymous polls** - Hide author information
- **Real-time updates** - Vote counts update automatically

## 🎯 Voting System

- **Single choice** - Users select one option
- **Multiple choice** - Users can select multiple options
- **Vote validation** - Prevents duplicate voting
- **Real-time results** - Instant vote count updates

## 🎨 UI Components

Built with Shadcn/ui components:

- **Forms** - Input, Textarea, Select, Checkbox
- **Layout** - Card, Button, Badge, Progress
- **Navigation** - Dropdown menus, responsive navigation
- **Feedback** - Loading states, error messages, success confirmations

## 🚦 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Tailwind CSS** - Utility-first CSS framework

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client-side operations

### Supabase Settings

- **Authentication** - Email/password enabled
- **Database** - PostgreSQL with RLS enabled
- **Storage** - File uploads (if needed)
- **Real-time** - WebSocket connections for live updates

## 🧪 Testing

### Manual Testing

1. **Create a user account** via registration
2. **Create a test poll** with multiple options
3. **Vote on the poll** from different accounts
4. **Check dashboard** for user statistics
5. **Verify RLS policies** by accessing data from different accounts

### Database Testing

Use the `database/test-data.sql` file to create sample data after setting up your database.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push

### Other Platforms

- **Netlify** - Similar to Vercel setup
- **Railway** - Full-stack deployment
- **Self-hosted** - Docker or traditional hosting

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection errors** - Check Supabase credentials and network
2. **Authentication issues** - Verify Supabase Auth settings
3. **RLS policy errors** - Check database policies and user permissions
4. **Type errors** - Ensure all dependencies are installed

### Getting Help

- Check the [database README](./database/README.md) for setup issues
- Review Supabase documentation for authentication problems
- Open an issue for bugs or feature requests

---

**Happy Polling! 🗳️**
