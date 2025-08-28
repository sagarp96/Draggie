import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUserAuth() {
  async function getUserSession() {
    const { data, error } = await createClient().auth.getSession();
    if (error) {
      console.log(error.message);
    }
    const user = data?.session?.user;
    console.log(data, "data");
    console.log(user, "user");
    return { data, user };
  }

  return useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
  });
}
