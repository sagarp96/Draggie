import { Column as ColumnType, Task } from "./types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./tasks";
import { AddNewTaskBTN } from "./AddNewTaskBTN";
import { useState } from "react";

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
};
export function Column({ column, tasks }: ColumnProps) {
  const [open, setOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <>
      <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4 ">
        <h2 className="mb-4 font-semibold text-neutral-100 h-ful text-center">
          {column.title}
        </h2>

        <div
          ref={setNodeRef}
          className="flex flex-1 flex-col gap-4  h-screen rounded-lg border-2 border-dashed border-transparent hover:border-neutral-600 transition-colors p-2"
          suppressHydrationWarning
        >
          {tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-neutral-500 text-sm h-full">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task) => {
              return <TaskCard key={task.id} task={task} />;
            })
          )}
        </div>
        <footer className="flex justify-center bg-white w-full text-center text-black rounded-full">
          <AddNewTaskBTN />
        </footer>
      </div>
    </>
  );
}
