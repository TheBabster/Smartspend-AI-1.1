# SmartSpend - AI-Powered Financial Wellness App

## Overview

SmartSpend is a mobile-first budgeting and behavioral finance application that helps users make smarter spending decisions through AI-powered insights, real-time purchase decision assistance, and gamified financial wellness tracking. The app combines intelligent decision-making logic with a beautifully designed user interface to create an engaging financial coaching experience.

## Recent Changes (July 29, 2025)

✓ Successfully migrated from in-memory storage to PostgreSQL database with complete schema
✓ Created animated Smartie mascot based on user's brain character design with multiple emotional states
✓ Enhanced SmartieCorner with typing animations and contextual mood responses
✓ Built comprehensive EnhancedPurchaseDecisionModal with AI-powered analysis simulation
✓ Integrated emotional intelligence system with 6 different Smartie moods (happy, thinking, concerned, celebrating, proud, sleepy)
✓ Added real-time database seeding with demo financial data for testing
✓ **MAJOR FUNCTIONALITY OVERHAUL**: Transformed SmartSpend from tool to comprehensive AI financial coach
✓ Implemented SmartieAICoach with contextual advice, coaching style options, and behavioral analysis
✓ Created SavingsTreeGamification with visual tree growth based on savings milestones and streaks
✓ Built DailyChallengeSystem with personalized challenges, badge system, and reward mechanics
✓ Added BehavioralPsychologyTracker for emotional spending pattern analysis and conflict purchase tracking
✓ Enhanced SmartieCorner with quote carousel, outfit shop, and regret journal functionality
✓ Integrated comprehensive Financial Wellness Hub combining all AI coaching features in EnhancedGoals page
✓ Added Smartie tab to bottom navigation for dedicated AI companion access

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a single-page application (SPA) using:
- **React 18** with TypeScript for type safety and component-based architecture
- **Vite** for fast development builds and hot module replacement
- **Tailwind CSS** with custom CSS variables for consistent design system
- **Framer Motion** for smooth animations and microinteractions
- **shadcn/ui** components for consistent, accessible UI elements
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching

The frontend follows a mobile-first responsive design approach with support for both light and dark themes.

### Backend Architecture
The backend uses a RESTful API architecture built with:
- **Express.js** with TypeScript for the web server
- **Node.js** as the runtime environment
- **ESM modules** for modern JavaScript module support
- **Custom storage abstraction layer** for database operations

### Component Structure
- **Pages**: Main route components (Dashboard, Analytics, Goals, Decisions, etc.)
- **UI Components**: Reusable design system components from shadcn/ui
- **Custom Components**: App-specific components (Smartie, BudgetRing, CategoryCard, etc.)
- **Hooks**: Custom React hooks for animations and mobile detection

## Key Components

### AI Assistant (Smartie)
- Personality-driven financial coaching with motivational, supportive, and analytical messaging
- Typing animation effects for natural conversation feel
- Context-aware recommendations based on spending patterns and goals

### Purchase Decision Engine
- Multi-factor analysis considering desire level, urgency, budget impact, and goal alignment
- Real-time decision recommendations with explanations
- Integration with OpenAI API for intelligent analysis

### Budget Management
- Category-based budgeting with visual progress indicators
- Animated budget rings showing remaining funds
- Real-time spending tracking with color-coded alerts

### Gamification System
- Streak tracking for budget adherence
- Achievement system for financial milestones
- Visual celebrations with confetti animations

### Expense Tracking
- Manual expense entry with emotional tagging
- Category-based organization with emoji icons
- Integration ready for bank sync functionality

## Data Flow

1. **User Onboarding**: Multi-step wizard collects income, preferences, and initial budget setup
2. **Budget Creation**: Users set monthly limits per spending category
3. **Expense Logging**: Manual entry or future bank sync updates spending totals
4. **Decision Making**: AI analyzes purchase requests against budget and goals
5. **Progress Tracking**: Real-time updates to budget percentages and goal progress
6. **Analytics**: Historical data analysis for spending patterns and insights

### Database Schema
Using Drizzle ORM with PostgreSQL:
- **Users**: Profile information, income, currency preferences
- **Budgets**: Monthly category limits and spending totals
- **Expenses**: Individual transactions with emotional tags
- **Goals**: Savings targets with progress tracking
- **Decisions**: Purchase decision history and recommendations
- **Streaks**: Gamification data for habit tracking
- **Achievements**: Milestone tracking and rewards

## External Dependencies

### Required Services
- **PostgreSQL Database**: Primary data storage (via Neon serverless)
- **OpenAI API**: AI-powered decision making and insights
- **Environment Variables**: Database URL and OpenAI API key required

### Optional Integrations
- **Bank Sync APIs**: TrueLayer or Plaid for automatic expense import
- **Push Notifications**: For budget alerts and motivational messages
- **Analytics Services**: For user behavior tracking

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **date-fns**: Date manipulation utilities
- **recharts**: Chart components for analytics

## Deployment Strategy

### Development Environment
- **Vite dev server** for frontend with hot reload
- **tsx** for running TypeScript server code directly
- **Replit integration** with development banner and cartographer plugin

### Production Build
- **Vite build** generates optimized frontend bundle
- **esbuild** bundles server code for Node.js deployment
- **Static file serving** for production frontend assets
- **Environment-based configuration** for database and API keys

### File Structure
```
/client          # Frontend React application
/server          # Backend Express API
/shared          # Shared TypeScript types and schemas
/migrations      # Database migration files
/attached_assets # Design specifications and requirements
```

The application is designed to run on Replit with seamless development experience, including error overlays and hot reloading. Production deployment follows standard Node.js patterns with separate frontend and backend builds.

### Performance Considerations
- Lazy loading for route components
- Optimized bundle splitting with Vite
- Efficient re-renders with React Query caching
- Responsive images and assets
- Progressive Web App capabilities ready for implementation