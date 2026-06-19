"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { demoUser } from "@/lib/demo-data";
import { getDb } from "@/lib/db";
import { hasClerkConfig } from "@/lib/env";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 36);
}

export async function getCurrentSlotWiseUser() {
  if (!hasClerkConfig()) {
    return demoUser;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses.at(0)?.emailAddress ||
    `${userId}@example.com`;
  const name =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    "SlotWise User";
  const baseSlug = slugify(name || email.split("@")[0]) || "slotwise";

  try {
    const db = getDb();
    const existing = await db.user.findUnique({ where: { clerkUserId: userId } });

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
        clerkUserId: userId,
        name,
        email,
        bookingSlug,
        businessName: clerkUser?.publicMetadata.businessName as string | undefined,
      },
    });
  } catch (error) {
    console.error("User sync failed", error);
    throw new Error("SlotWise needs a configured Supabase DATABASE_URL before dashboard data can load.");
  }
}
