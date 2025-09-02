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

type UseTaskCardsOptions = { enabled?: boolean };

export function useTaskCards(options: UseTaskCardsOptions = {}) {
  const { data: user } = useUserAuth();
  const enabled = options.enabled ?? !!user;

  return useQuery({
    queryKey: ["getTaskCardsdetails"],
    queryFn: async () => {
      const { data, error } = await supabase.from("taskcard_v2").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled,
  });
}

export function useTaskCardDetails(taskID: string) {
  const { data: user } = useUserAuth();

  return useQuery({
    queryKey: ["TaskCard", taskID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("taskcard_v2")
        .select("id,name, description, tags, DueDate, time")
        .eq("id", taskID);
      if (error) {
        throw new Error(error.message);
      }
      return data[0];
    },
    enabled: !!user,
  });
}

export function CheckUserExist() {
  const { data: user } = useUserAuth();

  return useQuery({
    queryKey: ["CheckUser"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id");
      if (error) {
        throw new Error(error.message);
      }
      return profiles;
    },
    enabled: !!user,
  });
}

export function Getusercolor(userID: string) {
  const { data: user } = useUserAuth();

  return useQuery({
    queryKey: ["Getusercolor", userID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("color")
        .eq("id", userID);
      if (error) {
        throw new Error(error.message);
      }
      return data[0].color;
    },
    enabled: !!user && !!userID,
  });
}
