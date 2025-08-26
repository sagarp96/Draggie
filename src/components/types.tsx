export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
};

export type Column = {
  id: string;
  title: string;
};
