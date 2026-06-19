# Supabase Setup

SlotWise uses Supabase as the hosted PostgreSQL database. Prisma remains the ORM and the Prisma datasource provider remains `postgresql`.

## Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DATABASE_DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

Use the values from **Supabase Dashboard > Project Settings > Database**.

- `DATABASE_URL`: Transaction Pooler connection string, used by the app at runtime.
- `DATABASE_DIRECT_URL`: Direct connection string, preferred by Prisma CLI for `db push` and migrations.
- `NEXT_PUBLIC_SUPABASE_URL`: Project API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project anon public API key.

## Initialize Tables

For the current scaffold, the fastest setup is:

```bash
npm run prisma:push
npm run prisma:generate
```

This pushes the Prisma schema to Supabase and regenerates the Prisma client.

## Prisma Config

`prisma.config.ts` prefers `DATABASE_DIRECT_URL` for CLI commands and falls back to `DATABASE_URL`. The application runtime uses `DATABASE_URL` through Prisma Client.

## Current Tables

- `User`
- `AvailabilityRule`
- `AvailabilityBlock`
- `Appointment`
- `EmailLog`

## Supabase Folder

The project also includes a Supabase-native database folder:

```text
supabase/
  config.toml
  seed.sql
  migrations/
    20260619000000_initial_slotwise_schema.sql
```

Use `supabase/migrations/20260619000000_initial_slotwise_schema.sql` to inspect the database structure directly or apply it from the Supabase SQL editor.

With the Supabase CLI, run:

```bash
npm run supabase:db:push
```

## Local Demo Mode

If `DATABASE_URL` is missing, SlotWise does not initialize Prisma. Dashboard pages use local demo data from `src/lib/demo-data.ts`.
