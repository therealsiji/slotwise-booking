# Supabase Setup

SlotWise uses Supabase as the hosted PostgreSQL database. Prisma remains the ORM and the Prisma datasource provider remains `postgresql`.

## Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

Use the values from **Supabase Dashboard > Project Settings > Database**.

## Initialize Tables

For the current scaffold, the fastest setup is:

```bash
npm run prisma:push
npm run prisma:generate
```

This pushes the Prisma schema to Supabase and regenerates the Prisma client.

## Current Tables

- `User`
- `AvailabilityRule`
- `AvailabilityBlock`
- `Appointment`
- `EmailLog`

## Local Demo Mode

If `DATABASE_URL` is missing, SlotWise does not initialize Prisma. Dashboard pages use local demo data from `src/lib/demo-data.ts`.
