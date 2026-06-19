import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres.password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1",
  },
});
