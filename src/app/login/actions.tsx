"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// Remove this import - don't use client supabase in server actions
// import { supabase } from "@/lib/supabase/client";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string | undefined,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/Redirect");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string | undefined,
  };

  // Pass name as user_metadata to Supabase
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { name: data.name, display_name: data.name },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/Redirect");
}

export async function logout() {
  const supabase = await createClient();

  try {
    // First get the current session to check if user is logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("No active session found, redirecting to home");
      revalidatePath("/", "layout");
      redirect("/");
      return;
    }

    // Attempt to sign out
    const { error } = await supabase.auth.signOut({
      scope: "local", // Only sign out from this client
    });

    if (error) {
      console.error("Error signing out:", error);
      // Don't throw error in production, just log it and continue with redirect
      if (process.env.NODE_ENV === "development") {
        throw error;
      }
    } else {
      console.log("Successfully signed out");
    }
  } catch (error) {
    console.error("Logout error:", error);
    // In production, continue with redirect even if logout fails
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }

  // Always revalidate and redirect, even if logout had issues
  revalidatePath("/", "layout");
  redirect("/");
}

export async function GoogleSignIn() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.log(error, "Error in Google-Login");
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
}
