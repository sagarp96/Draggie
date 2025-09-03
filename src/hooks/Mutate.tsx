import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { Task } from "../components/types";

export function useUpdateTaskStatus() {
  return useMutation({
    mutationKey: ["UpdateTaskStatus"],
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: Task["status"];
    }) => {
      const { error } = await supabase
        .from("taskcard_v2")
        .update({ status: status })
        .eq("id", taskId);

      if (error) {
        throw new Error(error.message);
      }
      return { data: "Task Status Updated" };
    },
  });
}

export function useAddnewTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["AddnewTask"],
    mutationFn: async ({ task }: { task: Task }) => {
      const { error } = await supabase.from("taskcard_v2").insert({
        id: task.id,
        user_id: task.user_id,
        name: task.name,
        status: task.status,
        DueDate: task.due_date,
        description: task.description,
        tags: task.tags,
        created_by: task.created_by,
        time: task.time,
        color: task.color,
      });

      if (error) {
        throw new Error(error.message);
      }
      return { data: "Task Added" };
    },
    onSuccess: () => {
      // Invalidate and refetch the the transaction
      queryClient.invalidateQueries({
        queryKey: ["getTaskCardsdetails"],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["DeleteTask"],
    mutationFn: async ({ taskID }: { taskID: string }) => {
      const { error } = await supabase
        .from("taskcard_v2")
        .delete()
        .eq("id", taskID);
      if (error) {
        throw new Error(error.message);
      }
      return { data: "Task Deleted" };
    },
    onSuccess: () => {
      // Invalidate and refetch the the transaction
      queryClient.invalidateQueries({
        queryKey: ["getTaskCardsdetails"],
      });
    },
  });
}

export function EditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["EditTask"],
    mutationFn: async ({
      task,
    }: {
      task: {
        id: string;
        name: string;
        due_date: Date;
        description: string;
        tags: string;
        time: string;
      };
    }) => {
      const { error } = await supabase
        .from("taskcard_v2")
        .update({
          name: task.name,
          DueDate: task.due_date.toISOString(),
          description: task.description,
          tags: task.tags,
          time: task.time,
        })
        .eq("id", task.id);
      if (error) {
        throw new Error(error.message);
      }
      return { data: "Task Updated" };
    },
    onSuccess: () => {
      // Invalidate and refetch the the transaction
      queryClient.invalidateQueries({
        queryKey: ["getTaskCardsdetails"],
      });
    },
  });
}

export function AddUser() {
  return useMutation({
    mutationKey: ["AddUser"],
    mutationFn: async ({
      id,
      color,
      username,
    }: {
      id: string;
      color: string;
      username: string;
    }) => {
      const { error } = await supabase.from("profiles").insert({
        id: id,
        username: username,
        color: color,
      });

      if (error) {
        throw new Error(error.message);
      }
      return { data: { id, username, color } };
    },
  });
}
