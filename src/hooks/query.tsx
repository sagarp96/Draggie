import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { useUserAuth } from "./useAuth";

export function useUserDetails() {
  const { data: user } = useUserAuth();

  if (!user) return;
  const userImageURL = user.user_metadata.avatar_url;
  const userEmail = user.email;
  const username = user.user_metadata.name;
  const userID = user.id;
  return { userImageURL, userEmail, username, userID };
}

export function useTaskCards() {
  return useQuery({
    queryKey: ["getTaskCardsdetails"],
    queryFn: async () => {
      const { data, error } = await supabase.from("taskcard_v2").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
