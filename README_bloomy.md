<div align="center">

# 🌱 Bloomly
### *Your Comprehensive Mental Wellness Platform for Youth*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-rose?style=for-the-badge)](LICENSE)

<br>

> **Safe. Anonymous. Empowering.**  
> AI-powered mental wellness tools designed specifically for youth — bloom into your best self 🌸✨

<br>

![Bloomly Feature](https://img.shields.io/badge/🤖_AI_Chat-Gemini_Powered-violet?style=flat-square)
![Bloomly Feature](https://img.shields.io/badge/🎙️_Voice_Journal-AI_Analysis-pink?style=flat-square)
![Bloomly Feature](https://img.shields.io/badge/😊_Mood_Tracker-Daily_Insights-blue?style=flat-square)
![Bloomly Feature](https://img.shields.io/badge/👥_Peer_Circles-Anonymous_Support-teal?style=flat-square)
![Bloomly Feature](https://img.shields.io/badge/🆘_Crisis_Support-Immediate_Help-red?style=flat-square)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Key Components](#-key-components)
- [Authentication](#-authentication)
- [Crisis Support System](#-crisis-support-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Bloomly** is a full-stack mental wellness web application built for young people who need a safe, non-judgmental space to take care of their mental health. It combines AI-powered chat, mood tracking, journaling, peer support, and relaxation tools — all in one beautifully designed platform.

The platform is built with youth-first design principles — anonymous, non-stigmatizing, and immediately accessible. From everyday check-ins to crisis moments, Bloomly has a feature for every mental health need.

---

## ✨ Features

### 🤖 AI Chat Support
- Real-time conversation with an AI mental health companion
- Powered by **Google Gemini AI**
- Supports **PDF upload** — users can share documents and discuss them with the AI
- Automatic **crisis detection** — triggers immediate intervention resources when needed
- Anonymous random avatar assigned per session

### 🎙️ Voice Journal
- Record voice entries directly in the browser (no app required)
- AI analyses the transcript for **emotions, mood score, and insights**
- Saves journal history with timestamps and duration
- Playback support for past entries
- Detects primary and secondary emotions with confidence scores

### 😊 Mood Tracker & Dashboard
- Daily mood logging with emoji-based input
- Visual **mood trend charts** (line charts via Recharts)
- Weekly and monthly mood pattern analytics
- Issue breakdown pie chart (anxiety, stress, relationships, etc.)
- Real-time stats: active users, chat sessions, avg. mood score

### 👥 Peer Circles
- Anonymous support groups around shared topics (study stress, anxiety, relationships, etc.)
- Browse, join, and create circles
- Real-time messaging within circles
- Emoji reactions and support counters on messages
- Private and public circle options

### 🧘 Relaxation Tools
- **Guided breathing exercises** with animated timer (inhale / hold / exhale / pause cycles)
- **Ambient sound player** — forest rain, ocean waves, café, white noise, and more
- **Grounding exercises** — interactive 5-4-3-2-1 technique
- Volume control and customisable session duration

### 🌙 Sleep Companion
- Curated **sleep soundtracks** — nature sounds, binaural beats, ambient, meditation
- **AI-narrated bedtime stories** — adventure, peaceful, fantasy, mindfulness categories
- Sleep timer and progress tracking
- Sound layering and volume control

### 🏆 Self-Care Challenges
- Daily, weekly, and milestone self-care challenges
- Points system with **XP and levelling**
- Streak tracking with longest streak counter
- Badge collection system
- Progress bars per challenge
- Celebration animations on completion

### 🙏 Gratitude Wall
- Post anonymous or named gratitude messages
- Categorised posts (family, friends, achievement, nature, health, moments)
- Heart reactions and community engagement
- Filter by category, date, or most liked
- Shareable gratitude cards

### 📚 AI Recommendations
- Mood-aware book, movie, and music recommendations
- Powered by **Gemini AI** with conversational flow
- Asks a personalised question first, then tailors suggestions
- Covers all moods — from uplifting to reflective

### 🆘 Crisis Support System
- Automatically detected from chat keywords
- Immediate modal with:
  - Emergency helpline numbers
  - Guided breathing exercise (4-4-6-2 cycle with animated indicator)
  - 5-4-3-2-1 grounding technique
  - "Talk to someone now" links
- Always available via navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **AI** | Google Gemini 1.5 Flash |
| **Auth & Database** | Supabase |
| **Backend (Edge)** | Supabase Edge Functions (Deno + Hono) |
| **State Management** | React Context API |
| **PDF Processing** | PDF.js (CDN) |
| **Deployment** | Firebase App Hosting |

---

## 📁 Project Structure

```
bloomy/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Landing page (root)
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── globals.css               # Global styles
│   │   ├── chat/page.tsx             # AI Chat route
│   │   ├── voice/page.tsx            # Voice Journal route
│   │   ├── mood/page.tsx             # Mood Tracker route
│   │   ├── dashboard/page.tsx        # Admin Dashboard route
│   │   ├── circles/page.tsx          # Peer Circles route
│   │   ├── relax/page.tsx            # Relaxation Tools route
│   │   ├── sleep/page.tsx            # Sleep Companion route
│   │   ├── challenges/page.tsx       # Self-Care Challenges route
│   │   ├── gratitude/page.tsx        # Gratitude Wall route
│   │   ├── stories/page.tsx          # Stories route
│   │   ├── recommendations/page.tsx  # AI Recommendations route
│   │   ├── context/
│   │   │   └── app-context.tsx       # Global app state (auth, mood, crisis)
│   │   └── lib/                      # Static JSON data
│   │       ├── challenges-state.json
│   │       ├── gratitude-posts.json
│   │       ├── journal-entries.json
│   │       ├── mood-entries.json
│   │       └── placeholder-images.json
│   │
│   ├── components/                   # Feature components
│   │   ├── LandingPage.tsx           # Hero, features, CTA
│   │   ├── ChatPage.tsx              # AI chat + PDF upload
│   │   ├── VoiceJournal.tsx          # Record, analyse, replay
│   │   ├── MoodDashboard.tsx         # Mood charts and tracker
│   │   ├── Dashboard.tsx             # Admin analytics dashboard
│   │   ├── PeerCircles.tsx           # Anonymous support groups
│   │   ├── RelaxationTools.tsx       # Breathing, music, grounding
│   │   ├── SleepCompanion.tsx        # Soundtracks and bedtime stories
│   │   ├── SelfCareChallenges.tsx    # Gamified self-care
│   │   ├── GratitudeWall.tsx         # Community gratitude feed
│   │   ├── AIRecommendations.tsx     # Mood-based media recs
│   │   ├── StoriesPage.tsx           # Stories feature
│   │   ├── Navigation.tsx            # Top nav + mobile menu
│   │   ├── AuthModal.tsx             # Login / sign-up modal
│   │   ├── CrisisModal.tsx           # Emergency intervention modal
│   │   ├── MoodBuddy.tsx             # Mood buddy widget
│   │   └── ui/                       # shadcn/ui base components
│   │
│   ├── supabase/
│   │   └── functions/server/
│   │       ├── index.tsx             # Hono edge server (CORS, health check)
│   │       └── kv_store.tsx          # Key-value store utility
│   │
│   └── utils/supabase/
│       ├── client.tsx                # Supabase client setup
│       └── info.tsx                  # Supabase project info
│
├── apphosting.yaml                   # Firebase App Hosting config
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config with custom theme
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/bloomy.git
cd bloomy

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🚀

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Getting your keys

**Supabase:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Navigate to Settings → API
3. Copy the `Project URL` and `anon public` key

**Gemini AI:**
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click `Get API Key` → Create API key
3. Copy the key

---

## 🗺️ Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing Page | No |
| `/chat` | AI Chat Support | ✅ Yes |
| `/voice` | Voice Journal | ✅ Yes |
| `/mood` | Mood Tracker | ✅ Yes |
| `/dashboard` | Admin Dashboard | ✅ Yes |
| `/circles` | Peer Circles | ✅ Yes |
| `/relax` | Relaxation Tools | ✅ Yes |
| `/sleep` | Sleep Companion | ✅ Yes |
| `/challenges` | Self-Care Challenges | ✅ Yes |
| `/gratitude` | Gratitude Wall | ✅ Yes |
| `/stories` | Stories | ✅ Yes |
| `/recommendations` | AI Recommendations | ✅ Yes |

> Unauthenticated users visiting protected routes are automatically redirected to the landing page with the login modal open.

---

## 🧩 Key Components

### `AppContext` — Global State
The entire app state is managed through `app-context.tsx`:
- `userSession` — current logged-in user
- `showAuthModal` — controls login/signup modal visibility
- `showCrisisModal` — triggers crisis intervention modal
- `currentMood` — user's current mood state
- `handleCrisisDetected()` — call this anywhere to trigger crisis support

### `CrisisModal` — Emergency Intervention
Triggered automatically when crisis keywords are detected in chat, or manually via `handleCrisisDetected()`. Provides:
- Emergency contacts and hotlines
- Interactive breathing exercise (4-4-6-2 box breathing)
- Step-by-step grounding technique

### `ChatPage` — AI Companion
Connects to Gemini AI for real-time mental health conversations. Features PDF upload so users can share content and discuss it. Monitors messages for crisis signals.

### `VoiceJournal` — Voice Recording & Analysis
Uses the browser's `MediaRecorder` API to capture voice. Sends audio for transcription and emotional analysis via Gemini AI.

---

## 🔐 Authentication

Bloomly uses **Supabase Auth** for user management:
- Email + password sign-up and login
- Session persistence across page refreshes
- Protected route middleware via `AppContext`
- Anonymous usage before login (landing page only)

The `AuthModal` component handles both login and signup flows in a single modal dialog.

---

## 🆘 Crisis Support System

Bloomly takes user safety seriously. The crisis detection flow works like this:

```
User sends message in chat
        ↓
AI response monitored for crisis signals
        ↓
If crisis detected → handleCrisisDetected() called
        ↓
CrisisModal opens automatically
        ↓
User sees: helplines, breathing exercise, grounding steps
```

The crisis modal includes real helpline numbers and evidence-based coping techniques (box breathing, 5-4-3-2-1 grounding).

---

## 🚀 Deployment

The project is configured for **Firebase App Hosting** via `apphosting.yaml`.

```bash
# Build for production
npm run build

# Start production server
npm start
```

For Firebase deployment:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy
firebase login
firebase deploy
```

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 💜 for youth mental health**

*Bloomly — Safe, anonymous, and empowering 🌸*

</div>
