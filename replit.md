# SmartSpend - AI-Powered Financial Wellness App

## Overview
SmartSpend is a mobile-first budgeting and behavioral finance application designed to empower users to make smarter spending decisions. It provides AI-powered insights, real-time purchase decision assistance, and gamified financial wellness tracking. The app's core purpose is to act as an intelligent AI financial coach, combining advanced decision-making logic with an engaging user interface to deliver a comprehensive financial coaching experience. Key capabilities include contextual AI advice, behavioral analysis, savings gamification, daily challenges, and emotional spending pattern tracking. The project aims for a 9.7+/10 App Store-ready quality with complete brand cohesion and a focus on emotional connection with the user.

## User Preferences
Preferred communication style: Simple, everyday language.
Design focus: 9.7+/10 App Store-ready visual polish with complete brand cohesion and emotional engagement.
Smartie integration: AI companion must appear throughout entire app experience, not limited to specific sections.
Visual requirements: Professional fonts, unique branded logo, rich background harmony, perfect text contrast, smooth animations.
Functionality priorities: Conversational AI chat, accessory customization system, premium visual feedback.

## System Architecture

### Frontend Architecture
The frontend is a single-page application (SPA) built with React 18 and TypeScript for type safety and component-based architecture. It uses Vite for fast development, Tailwind CSS for styling, Framer Motion for animations, and shadcn/ui for consistent UI elements. Routing is handled by Wouter, and server state management by TanStack Query. The design adheres to a mobile-first responsive approach with light and dark theme support. Visuals emphasize clean design, professional typography, consistent spacing, glassmorphism effects, rich gradients, sparkle effects, and micro-animations, aiming for a cohesive and emotionally engaging experience. A key element is the SmartieAvatarSystem with advanced animations and contextual emotional reactions integrated throughout the UI.

### Backend Architecture
The backend is a RESTful API built with Express.js and Node.js (ESM modules) with TypeScript. It utilizes a custom storage abstraction layer for database operations.

### Key Features & Design Patterns
- **AI Assistant (Smartie)**: Personality-driven financial coaching with contextual advice, emotional states, and conversational AI for full interaction. Includes an accessory shop for customization earned through smart financial behavior.
- **Purchase Decision Engine**: Multi-factor analysis leveraging AI to provide real-time decision recommendations based on budget impact, goals, emotional states, and regret probability analysis.
- **Budget Management**: Category-based budgeting with visual progress indicators and real-time spending tracking.
- **Gamification System**: Features streak tracking, achievement badges, level progression, unlockable rewards, social sharing of milestones, and a Savings Tree Gamification with visual growth.
- **Expense Tracking**: Manual expense entry with emotional tagging and category-based organization.
- **Emotional Design Transformation**: Focus on creating a deep emotional connection through context-aware Smartie reactions (25+ rules), consistent brand identity, and an emotional spending tracker linking moods to spending patterns.
- **Comprehensive Analytics**: Tabbed interface with overviews, AI coaching summaries, emotional spending heatmaps, and goal timeline predictions.

### Database Schema
The application uses Drizzle ORM with PostgreSQL. The schema includes tables for Users, Budgets, Expenses, Goals, Decisions, Streaks, and Achievements to support the application's features and data flow.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Primary data storage, utilizing Neon serverless.
- **OpenAI API**: Critical for AI-powered decision making, insights, and intelligent analysis.

### Key Libraries
- `@neondatabase/serverless`: For PostgreSQL connection.
- `drizzle-orm`: For type-safe database operations.
- `@tanstack/react-query`: For server state management.
- `framer-motion`: For animations.
- `date-fns`: For date manipulation utilities.
- `recharts`: For chart components in analytics.

### Optional Integrations (Future Considerations)
- **Bank Sync APIs**: Such as TrueLayer or Plaid for automatic expense import.
- **Push Notifications**: For alerts and motivational messages.
- **Analytics Services**: For user behavior tracking.