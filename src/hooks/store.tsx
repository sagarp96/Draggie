import { create } from "zustand";
import type { Task } from "../components/types";

interface InitialStore {
  initialTasks: Task[];
  setInitialTasks: (initialTasks: Task[]) => void;
}

export const initialStore = create<InitialStore>((set) => ({
  initialTasks: [],
  setInitialTasks: (initialTasks: Task[]) => set({ initialTasks }),
}));

export const updatedTasksStore = create((set) => ({
  updatedTasks: [],
  setUpdatedTasks: (updatedTasks: Task[]) => set({ updatedTasks }),
}));

export const deletedTasksStore = create((set) => ({
  deletedTasks: [],
  setDeletedTasks: (deletedTasks: Task[]) => set({ deletedTasks }),
}));
