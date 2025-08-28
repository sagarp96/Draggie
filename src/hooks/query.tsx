import { useQuery } from "@tanstack/react-query";
import { Task } from "../components/types";
import { createClient } from "../lib/supabase/client";
import { v4 as uuid } from "uuid";
import { useUserAuth } from "./useAuth";

export function getUserDetails() {
  const { data } = useUserAuth();
  const user = data?.user;

  if (!user) return;
  const userImageURL = user.user_metadata.avatar_url;
  const userEmail = user.email;
  const username = user.user_metadata.name;
  return { userImageURL, userEmail, username };
}

export function AddnewTask(task: Task) {
  const { data } = useUserAuth();
  const user = data?.user;
  if (!user) return;
  async function AddnewTaskDB() {
    const { data, error } = await createClient().from("Taskcard").insert({
      id: uuid(),
      User_ID: user.id,
      TaskName: task.title,
      TaskDescription: task.description,
      DueDate: task.duedate,
      Tags: task.tags,
      Status: task.status,
    });
    return { data: "Task Added", error };
  }
  return useQuery({
    queryKey: ["AddnewTask"],
    queryFn: AddnewTaskDB,
  });
}

// export function getTaskCards() {
//   const { data } = useUserAuth();
//   const user = data?.user;
//   if (!user) return;
//   async function getTaskCardsDB() {
//     const { data, error } = await createClient()
//       .from("Taskcard")
//       .select("id, TaskName, TaskDescription, DueDate, Tags, Status")
//       .eq("User_ID", user!.id);
//     return { data, error };
//   }
//   return useQuery({
//     queryKey: ["getTaskCards"],
//     queryFn: getTaskCardsDB,
//   });
// }
