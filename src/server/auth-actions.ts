"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function authRedirect(path: string, message: string) {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function signInWithPassword(formData: FormData) {
  const email = value(formData, "email");
  const password = value(formData, "password");

  if (!email || !password) {
    authRedirect("/sign-in", "Email and password are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect("/sign-in", error.message);
  }

  redirect("/dashboard");
}

export async function signUpWithPassword(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email");
  const password = value(formData, "password");

  if (!name || !email || !password) {
    authRedirect("/sign-up", "Name, email, and password are required.");
  }

  if (password.length < 6) {
    authRedirect("/sign-up", "Password must be at least 6 characters.");
  }

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
    },
  });

  if (error) {
    authRedirect("/sign-up", error.message);
  }

  if (data.session) {
    redirect("/dashboard");
  }

  authRedirect("/sign-in", "Check your email to confirm your account, then sign in.");
}

export async function requestPasswordReset(formData: FormData) {
  const email = value(formData, "email");

  if (!email) {
    authRedirect("/forgot-password", "Email is required.");
  }

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin
      ? `${origin}/auth/confirm?next=${encodeURIComponent("/reset-password")}`
      : undefined,
  });

  if (error) {
    authRedirect("/forgot-password", error.message);
  }

  authRedirect(
    "/forgot-password",
    "If an account exists for that email, a password reset link has been sent.",
  );
}

export async function updatePassword(formData: FormData) {
  const password = value(formData, "password");
  const confirmPassword = value(formData, "confirmPassword");

  if (!password || !confirmPassword) {
    authRedirect("/reset-password", "Password and confirmation are required.");
  }

  if (password.length < 6) {
    authRedirect("/reset-password", "Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    authRedirect("/reset-password", "Passwords do not match.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    authRedirect("/forgot-password", "Your reset link expired. Request a new password reset email.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    authRedirect("/reset-password", error.message);
  }

  await supabase.auth.signOut();
  authRedirect("/sign-in", "Password updated. Log in with your new password.");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
