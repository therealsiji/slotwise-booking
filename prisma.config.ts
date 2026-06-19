import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_DIRECT_URL ||
      process.env.DATABASE_URL ||
      "postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres",
  },
});
