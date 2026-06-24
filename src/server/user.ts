"use server";

import { redirect } from "next/navigation";
import { demoUser } from "@/lib/demo-data";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig, hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 36);
}

export async function getCurrentSlotWiseUser() {
  if (!hasSupabaseConfig() || !hasDatabaseConfig()) {
    return demoUser;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const email = user.email ?? `${user.id}@example.com`;
  const metadataName = user.user_metadata?.name;
  const name =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName.trim()
      : email.split("@")[0] || "SlotWise User";
  const baseSlug = slugify(name || email.split("@")[0]) || "slotwise";

  try {
    const db = getDb();
    const existing = await db.user.findUnique({ where: { authUserId: user.id } });

    if (existing) {
      return existing;
    }

    let bookingSlug = baseSlug;
    let suffix = 1;

    while (await db.user.findUnique({ where: { bookingSlug } })) {
      suffix += 1;
      bookingSlug = `${baseSlug}-${suffix}`;
    }

    return db.user.create({
      data: {
        authUserId: user.id,
        name,
        email,
        bookingSlug,
      },
    });
  } catch (syncError) {
    console.error("User sync failed", syncError);
    throw new Error("SlotWise needs a configured Supabase DATABASE_URL before dashboard data can load.");
  }
}
