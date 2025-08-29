import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useUserAuth() {
  async function getUserSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Supabase auth error:", error.message);
        return null;
      }

      return data.session?.user ?? null;
    } catch (err) {
      console.error("Error getting session:", err);
      return null;
    }
  }

  return useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
  });
}
