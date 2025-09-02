import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export function useUserAuth() {
  const queryClient = useQueryClient();

  async function getUserSession(): Promise<User | null> {
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

  // Listen for auth changes and invalidate cache
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed:", event);
      // Invalidate the userSession query when auth state changes
      queryClient.invalidateQueries({ queryKey: ["userSession"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return useQuery<User | null, Error>({
    queryKey: ["userSession"],
    queryFn: getUserSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
