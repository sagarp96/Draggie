export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  user_id: string;
  name: string;
  status: string;
  due_date: Date;
  description: string;
  tags: string;
  created_by: string;
  time: string;
  color: string;
};

export type Column = {
  id: string;
  title: string;
};
