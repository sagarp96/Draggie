import { useDraggable } from "@dnd-kit/core";
import { Task } from "./types";
import { X } from "lucide-react";
import { EditTaskBTN } from "./Buttons/EditTaskBTN";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import DeleteTaskBTN from "./Buttons/DeleteTaskBTN";
import { useTaskCardDetails } from "@/hooks/query";
type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const { data: taskcardDetails } = useTaskCardDetails(task.id);

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const [openTaskCard, setOpenTaskCard] = useState(false);
  const formatDate = (iso?: string) => {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };
  const TaskOverview = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg text-neutral-50 text-center mb-5">
          {task.name}
        </h3>
        <footer className="text-center">
          <p className="text-xs text-neutral-100 dark:text-neutral-300">
            Created At:{formatDate(task.time)}
          </p>
          <p className="text-xs text-neutral-100 dark:text-neutral-300">
            Due Date: {task.DueDate.toString()}
          </p>
        </footer>
        <div className="flex justify-center ">
          <DeleteTaskBTN taskID={task.id} />
          {taskcardDetails && (
            <EditTaskBTN
              taskID={task.id}
              fetchedTaskdetails={taskcardDetails}
            />
          )}{" "}
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-blue-600"
            onClick={() => setOpenTaskCard(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  };
  const TaskDetails = () => {
    return (
      <motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        exit={{ rotateY: 180 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col justify-center">
          <p className="text-lg text-neutral-50 text-center ">{task.name}</p>
          <p className="text-xs text-neutral-100 dark:text-neutral-300">
            Description:
            <span className="text-neutral-50">{task.description}</span>
          </p>
          <p className="text-xs text-neutral-100 dark:text-neutral-300">
            Time:
            <span className="text-neutral-50"> {formatDate(task.time)}</span>
          </p>
          <p className="text-xs text-neutral-100 dark:text-neutral-300">
            Tags:
            <span className="text-neutral-50">{task.tags}</span>
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-blue-600 "
            onClick={() => setOpenTaskCard(false)}
          >
            <X className="mr-2 h-4 w-4 " />
          </Button>
        </div>
      </motion.div>
    );
  };
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg shadow-sm hover:shadow-md ${task.color} touch-manipulation select-none h-30 w-full`}
      style={style}
      suppressHydrationWarning
    >
      {openTaskCard ? <TaskDetails /> : <TaskOverview />}
    </motion.div>
  );
}
