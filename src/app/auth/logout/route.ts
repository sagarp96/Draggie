import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Sign out the user
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
      }
    }

    // Clear any cached data
    revalidatePath("/", "layout");

    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Logout route error:", error);
    // Even if there's an error, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
}
