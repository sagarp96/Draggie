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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error signing out:", error);
  }

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
