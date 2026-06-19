# Supabase Database Structure

This folder contains the Supabase-side database structure for SlotWise.

## Files

- `config.toml`: Supabase CLI local project configuration.
- `migrations/20260619000000_initial_slotwise_schema.sql`: Creates enums, tables, indexes, triggers, and starter RLS policies.
- `seed.sql`: Optional demo data for local Supabase development.

## Tables

- `User`
- `AvailabilityRule`
- `AvailabilityBlock`
- `Appointment`
- `EmailLog`

## Apply To Supabase

After setting `.env` with your Supabase connection strings:

```bash
npm run supabase:db:push
```

Or paste the migration SQL into the Supabase SQL editor if you prefer a manual first setup.

Prisma remains the application ORM. The SQL migration mirrors `prisma/schema.prisma` so the structure is visible and manageable from Supabase too.
