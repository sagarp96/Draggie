"use client";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "./types";
import { Trash2 } from "lucide-react";
import { EditTaskBTN } from "./EditTaskBTN";
import { Button } from "@/components/ui/button";

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

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg p-4 shadow-sm hover:shadow-md mt-3 bg-indigo-500 touch-manipulation select-none"
      style={style}
    >
      <h3 className="font-medium text-neutral-100 text-center mb-10">
        {task.title}
      </h3>
      <br />
      <footer className="text-center">
        <p className="text-xs text-neutral-400">Created by:Sagar panwar</p>
        <p className="text-xs text-neutral-400">Last Updated:12:00pn</p>
      </footer>
      <div className="flex justify-center ">
        <Button variant="ghost">
          <Trash2 className="mr-2 h-4 w-4 " />
        </Button>
        <EditTaskBTN />
      </div>
    </div>
  );
}
