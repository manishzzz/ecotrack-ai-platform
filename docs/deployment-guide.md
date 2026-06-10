# EcoTrack AI Deployment Guide

## Architecture

- Frontend: Next.js 15 app in `apps/web`
- Backend: Express + Prisma app in `apps/api`
- Database: Neon PostgreSQL
- Frontend hosting: Vercel
- Backend hosting: Render, Railway, or Vercel

## Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.example.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (`apps/api/.env`)

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=EcoTrack AI <noreply@yourdomain.com>
SEED_ADMIN_PASSWORD=ChangeThisAdminPassword!1
```

## Local Setup

1. Install dependencies from the repository root with `npm install`.
2. Copy [apps/web/.env.local.example](/C:/Users/manis/Documents/EcoTrack%20AI/apps/web/.env.local.example) to `apps/web/.env.local`.
3. Copy [apps/api/.env.example](/C:/Users/manis/Documents/EcoTrack%20AI/apps/api/.env.example) to `apps/api/.env`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate`.
6. Run `npm run db:seed`.
7. Run `npm run test`.
8. Run `npm run dev`.

## Neon PostgreSQL

1. Create a Neon project and database.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Run Prisma migrations from the API workspace.

## Vercel Frontend

1. Import the repository into Vercel.
2. Set the root directory to `apps/web` or configure monorepo project detection.
3. Add the frontend environment variables.
4. Build command: `npm run build --workspace web`
5. Output: `.next`

## Vercel Backend

1. Create a second Vercel project with root directory `apps/api`.
2. Add the backend environment variables shown above.
3. Ensure `DATABASE_URL` points at your Neon project.
4. Build command: `npm run build`
5. Output is handled by [apps/api/vercel.json](/C:/Users/manis/Documents/EcoTrack%20AI/apps/api/vercel.json).

## Render Backend

1. Create a new Web Service pointing to this repository.
2. Set root directory to `apps/api`.
3. Build command:

```bash
npm install
npx prisma generate
npm run build
```

4. Start command:

```bash
npx prisma migrate deploy && npm run start
```

5. Add all backend environment variables and the Neon database URL.

## Railway Backend

1. Create a new service from the repository.
2. Set the service root to `apps/api`.
3. Use the same build and start commands as Render.
4. Provision PostgreSQL if you are not using Neon externally.

## OAuth Setup

1. Create a Google OAuth client.
2. Add your Vercel domain and localhost to authorized JavaScript origins.
3. Use the same client ID in both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`.

## Production Checklist

- Set a strong `JWT_SECRET`.
- Set `SEED_ADMIN_PASSWORD` only when you intentionally want a seeded admin.
- Use a verified sender for password reset email when enabling SMTP.
- Restrict CORS to the frontend domain.
- Run `prisma migrate deploy` during release.
- Monitor API logs and OpenAI usage limits.
- Rotate secrets regularly.
- If `OPENAI_API_KEY` is omitted, the app will fall back to deterministic local recommendations instead of failing hard.
