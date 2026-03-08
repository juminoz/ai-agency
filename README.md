# BrandBuddy

**AI-powered creator-brand matching platform** — find, vet, and collaborate with influencers who genuinely align with your brand.

BrandBuddy uses a multi-signal scoring engine, AI-driven analysis (via Google Gemini), and YouTube data pipeline to surface the best creator partnerships. Brands search and discover creators by score, niche, and audience fit. Creators build a verified profile that attracts the right deals.

---

## Platform Overview

### For Brands

- **Creator Search & Discovery** — browse scored creator profiles, filter by niche, engagement, subscriber count, and platform status
- **Creator Detail Profiles** — deep-dive into score breakdowns, audience interests, authenticity metrics, recent video performance, and sentiment analysis
- **Deal Management** — send briefs, negotiate terms, and track campaign performance in one place
- **Campaign Simulator** — project reach, engagement, and conversion estimates across channels before committing budget

### For Creators

- **Profile & Score** — a public BrandBuddy Score highlights engagement quality, authenticity, and content consistency
- **Brand Discovery** — browse brands with active briefs, see match scores, and signal interest
- **Deal Inbox** — receive, negotiate, and manage brand deals with built-in messaging

### Admin / Data Pipeline

- **Channel Import** — bulk CSV import of YouTube channels for analysis
- **Scoring Engine** — 6-signal scoring: topic relevance, recent views, engagement health, authenticity, activity consistency, and audience-comment match
- **AI Analysis** — Gemini-powered comment sentiment analysis, audience interest graph extraction, and authenticity detection
- **Brand Intent Search** — keyword-based channel search filtered by score, subscriber count, and engagement
- **Campaign Simulator** — multi-channel reach projection with cost-per-conversion estimates
- **Channel Sync** — sync scored channels into marketplace creator profiles (with on-platform / off-platform status)

---

## Scoring Engine

Each channel receives a **BrandBuddy Score** (0–100) composed of six weighted signals:

| Signal                 | Weight | Description                                               |
| ---------------------- | ------ | --------------------------------------------------------- |
| Topic Relevance        | 25%    | How well content aligns with target categories            |
| Recent Views           | 20%    | Median views across recent uploads                        |
| Engagement Health      | 20%    | Like/comment ratio relative to views                      |
| Authenticity           | 15%    | Fake follower risk, view spike detection, comment quality |
| Activity Consistency   | 10%    | Upload frequency and regularity                           |
| Comment-Audience Match | 10%    | Alignment between comment sentiment and creator niche     |

AI analysis (Google Gemini) powers authenticity scoring, comment sentiment analysis, and audience interest graph extraction.

---

## Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js 15 (App Router, Turbopack)                              |
| Language     | TypeScript (strict mode)                                        |
| Styling      | Tailwind CSS + shadcn/ui                                        |
| Database     | Supabase (PostgreSQL + Row Level Security)                      |
| Auth         | Supabase Auth + RBAC (user, brand, creator, admin)              |
| AI           | Google Gemini (comment analysis, interest graphs, authenticity) |
| Data Source  | YouTube Data API v3                                             |
| Build System | Turborepo + pnpm workspaces                                     |
| Deployment   | Fly.io (Docker)                                                 |

---

## Project Structure

```
ai-agency/
├── apps/
│   └── web/                          # Next.js 15 app
│       └── src/
│           ├── app/
│           │   ├── page.tsx           # Public landing page
│           │   ├── admin/             # Admin dashboard (data pipeline, scoring, analytics)
│           │   ├── brand/             # Brand dashboard (search, deals, campaigns)
│           │   ├── creator/           # Creator dashboard (profile, brands, deals)
│           │   ├── api/admin/         # Admin API routes (channels, scoring, sync, simulate)
│           │   ├── login/             # Auth pages
│           │   └── signup/
│           ├── components/            # Shared UI components
│           └── lib/
│               ├── ai/               # Gemini AI (comment analysis, interest graph, authenticity)
│               ├── auth/              # Auth guards (requireAdmin, requireAuth, requireRole)
│               ├── scoring/           # Scoring engine (6 signals + composite)
│               ├── matching/          # Brand-intent channel matching
│               ├── simulator/         # Campaign reach/conversion simulator
│               ├── youtube/           # YouTube API client + data pipeline
│               ├── supabase/          # Supabase clients + types
│               └── data.ts            # Data access layer (all Supabase queries)
├── packages/
│   ├── ui/                            # Shared component library (shadcn/ui + Tailwind)
│   ├── typescript-config/             # Shared TypeScript configs
│   └── eslint-config/                 # Shared ESLint configs
└── supabase/
    └── migrations/                    # Database schema (channels, scores, profiles, deals)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Supabase project (with service role key)
- YouTube Data API key
- Google Gemini API key

### Environment Variables

Copy `apps/web/src/app/env.example` and create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
YOUTUBE_API_KEY=your-youtube-api-key
GEMINI_API_KEY=your-gemini-api-key
```

### Install

```bash
pnpm install
```

### Database Setup

Run the Supabase migrations in order:

```sql
-- 1. Core schema (channels, videos, comments, scores, analyses)
supabase/migrations/001_initial_schema.sql

-- 2. Auth profiles (users + roles)
supabase/migrations/002_profiles.sql

-- 3. Marketplace schema (creator_profiles, brands, briefs, deals)
supabase/migrations/003_brandbuddy_schema.sql
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

---

## Auth & Roles

| Role        | Access                                                             |
| ----------- | ------------------------------------------------------------------ |
| **Admin**   | `/admin/*` — data pipeline, scoring, analytics, channel management |
| **Brand**   | `/brand/*` — creator search, deals, campaigns, settings            |
| **Creator** | `/creator/*` — profile, brand discovery, deals, settings           |

Authentication uses Supabase Auth with cookie-based sessions. Middleware enforces route protection and role checks.

---

## Adding a Shared UI Component

1. Create component in `packages/ui/src/components/`
2. Import in apps: `import { Component } from "@repo/ui/components/component-name"`
