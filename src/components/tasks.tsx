import { useDraggable } from "@dnd-kit/core";
import { Task } from "./types";
import { Trash2, X } from "lucide-react";
import { EditTaskBTN } from "./EditTaskBTN";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const [openTaskCard, setOpenTaskCard] = useState(false);

  const TaskOverview = () => {
    return (
      <>
        <h3 className="text-lg text-neutral-50 text-center mb-5">
          {task.title}
        </h3>
        <footer className="text-center">
          <p className="text-xs text-neutral-300 dark:text-neutral-300">
            Created by:Sagar panwar
          </p>
          <p className="text-xs text-neutral-300 dark:text-neutral-300">
            Last Updated:10 hours ago
          </p>
        </footer>
        <div className="flex justify-center ">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
          </Button>
          <EditTaskBTN />
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-blue-600"
            onClick={() => setOpenTaskCard(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };
  const TaskDetails = () => {
    return (
      <>
        <h2 className="text-lg text-neutral-50 text-center mb-5">
          {task.title}
        </h2>
        <p>{task.description}</p>
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-blue-600"
          onClick={() => setOpenTaskCard(false)}
        >
          <X className="mr-2 h-4 w-4" />
        </Button>
      </>
    );
  };
  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="cursor-grab rounded-lg shadow-sm hover:shadow-md  bg-indigo-500 touch-manipulation select-none h-30 "
        style={style}
        suppressHydrationWarning
      >
        {openTaskCard ? <TaskDetails /> : <TaskOverview />}
      </div>
    </>
  );
}
