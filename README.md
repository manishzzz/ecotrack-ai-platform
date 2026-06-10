# EcoTrack AI

EcoTrack AI is a full-stack carbon footprint awareness platform built with Next.js 15, Express, Prisma, and PostgreSQL. It helps users calculate their emissions, track progress over time, complete sustainability challenges, read ESG content, and receive AI-powered recommendations.

## Quality Notes

- Cookie-based authentication with secure production settings
- Centralized environment validation and graceful AI/email fallback behavior
- Typechecked frontend and backend workspaces
- Utility test coverage for carbon calculation and forecasting logic
- Committed Prisma migrations for repeatable deploys

## Monorepo Structure

- `apps/web`: Next.js 15 frontend with Tailwind CSS, Framer Motion, Recharts, and shadcn-style components
- `apps/api`: Express API with Prisma, JWT auth, Google login, OpenAI integration, PDF report generation, and admin tools
- `docs`: deployment, SQL, and setup notes

## Quick Start

```bash
npm install
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test
npm run dev
```

## Product Highlights

- JWT + Google authentication
- Carbon calculator with score generation
- AI sustainability advisor and eco assistant chat
- Historical analytics dashboard with charts
- Challenges, rewards, badges, and leaderboard
- Carbon offset marketplace with mock payments
- Forecasting engine for 1/3/6 month carbon predictions
- Blog, comments, likes, and admin CMS
- PDF sustainability reports
- ESG insights and comparison benchmarks
- Graceful fallback behavior when OpenAI or SMTP are not configured

Detailed production setup lives in [docs/deployment-guide.md](/C:/Users/manis/Documents/EcoTrack%20AI/docs/deployment-guide.md).
