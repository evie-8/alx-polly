# AlxPolly - Modern Polling Application

A Next.js-based polling application that allows users to create, share, and vote on polls. Built with modern web technologies and a beautiful, responsive UI.

## 🚀 Features

- **User Authentication**: Secure login and registration system using Supabase
- **Poll Creation**: Easy-to-use interface for creating custom polls
- **Voting System**: Support for single and multiple choice voting
- **Real-time Results**: Live updates and beautiful visualizations
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Built with Shadcn components and Tailwind CSS
- **Protected Routes**: Authentication-based route protection

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context + Hooks

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── polls/                    # Poll-related pages
│   │   ├── create/              # Poll creation page
│   │   ├── [id]/                # Individual poll view
│   │   └── page.tsx             # Polls listing page
│   ├── dashboard/                # User dashboard (protected)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Home page
├── components/                    # Reusable components
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx        # Login form with Supabase
│   │   ├── RegisterForm.tsx     # Registration form with Supabase
│   │   └── ProtectedRoute.tsx   # Route protection component
│   ├── polls/                    # Poll-related components
│   │   └── PollCard.tsx         # Poll display card
│   ├── forms/                    # Form components
│   │   └── CreatePollForm.tsx   # Poll creation form
│   ├── layout/                   # Layout components
│   │   └── Navigation.tsx       # Main navigation with auth state
│   └── ui/                      # Shadcn UI components
├── contexts/                     # React Context providers
│   └── AuthContext.tsx          # Authentication context
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   ├── middleware.ts        # Next.js middleware
│   │   └── auth.ts              # Server auth utilities
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts              # Authentication types
│   │   └── poll.ts              # Poll-related types
│   ├── auth/                     # Authentication services
│   │   └── authService.ts       # Legacy auth service (placeholder)
│   ├── db/                       # Database services
│   │   └── pollService.ts       # Poll service (placeholder)
│   └── utils.ts                 # Utility functions
├── middleware.ts                 # Next.js middleware for auth
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript configuration
├── env.example                  # Environment variables template
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Note down your project URL and anon key

2. **Configure Environment Variables**:
   ```bash
   # Copy the environment template
   cp env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup** (Optional):
   - Create a `profiles` table for user profiles
   - Create a `polls` table for storing polls
   - Set up Row Level Security (RLS) policies

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Supabase Setup above)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Shadcn Components

```bash
npx shadcn@latest add <component-name>
```

### Authentication Flow

1. **User Registration**: Users sign up with email/password
2. **Email Verification**: Supabase sends verification email
3. **User Login**: Verified users can sign in
4. **Protected Routes**: Dashboard and other private areas require authentication
5. **Session Management**: Automatic session handling with cookies

### Project Structure Guidelines

- **Components**: Place reusable components in appropriate subdirectories
- **Types**: Define TypeScript interfaces in `lib/types/`
- **Services**: Place API/database services in `lib/` subdirectories
- **Pages**: Use Next.js App Router structure in `app/`
- **Auth**: Use `useAuth()` hook for client components, `getCurrentUser()` for server components

## 🎯 Roadmap

### Phase 1: Core Functionality ✅
- [x] Project scaffolding
- [x] Basic UI components
- [x] Authentication forms
- [x] Poll creation interface
- [x] Poll display components
- [x] Supabase authentication integration
- [x] Protected routes

### Phase 2: Backend Integration 🚧
- [ ] Database setup (Supabase PostgreSQL)
- [ ] Poll CRUD operations with Supabase
- [ ] User profile management
- [ ] Real-time subscriptions

### Phase 3: Advanced Features 📋
- [ ] Real-time voting updates
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Mobile app

### Phase 4: Production Ready 🎯
- [ ] Testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment automation

## 🔐 Authentication Features

- **Secure Registration**: Email/password with Supabase Auth
- **Email Verification**: Required before first login
- **Session Management**: Automatic cookie-based sessions
- **Route Protection**: Middleware-based authentication
- **User Context**: Global auth state management
- **Protected Components**: `ProtectedRoute` wrapper for private content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Polling! 🗳️**
