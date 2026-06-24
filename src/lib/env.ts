function hasRealValue(value: string | undefined) {
  return Boolean(
    value &&
      !value.includes("[") &&
      !value.includes("YOUR-PASSWORD") &&
      !value.includes("project-ref") &&
      !value.includes("PROJECT_REF"),
  );
}

export function hasDatabaseConfig() {
  return hasRealValue(process.env.DATABASE_URL);
}

export function hasSupabaseConfig() {
  return (
    hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
