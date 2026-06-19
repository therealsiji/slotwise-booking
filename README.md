# SlotWise

Appointment scheduling for professionals and freelancers, built with Next.js, Clerk, Prisma, Supabase Postgres, Resend, and FullCalendar.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If no database or Clerk keys are configured, the dashboard uses local demo data so the UI stays usable.

## Supabase Database Setup

This app uses **Supabase Postgres** as the database and **Prisma** as the ORM.

1. Create a Supabase project.
2. In Supabase, open **Project Settings > Database > Connection string**.
3. Copy the Postgres connection string.
4. Create `.env` from `.env.example`.
5. Set:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

For local development and early Supabase setup, run:

```bash
npm run prisma:push
npm run prisma:generate
```

For production migrations, use reviewed Prisma migrations:

```bash
npm run prisma:migrate
```

## Auth Setup

The app is scaffolded for Clerk auth. Add these to `.env` when ready:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
```

Without Clerk keys, the dashboard runs in local demo mode.

## Useful Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run prisma:push
npm run prisma:generate
```
