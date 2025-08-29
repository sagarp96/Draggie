import { create } from "zustand";
import type { Task } from "../components/types";

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks: tasks }),
}));
