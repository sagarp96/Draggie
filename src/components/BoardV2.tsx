import { useState } from "react";
import type { Task, Column as ColumnType } from "./types";
import { Column } from "./column";
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const COLUMN: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In-Progress" },
  { id: "DONE", title: "Done" },
];

const Initia_TASK: Task[] = [
  {
    id: "1",
    title: "Research",
    status: "TODO",
    description: "maths paper research",
  },
  {
    id: "2",
    title: "Design",
    status: "IN_PROGRESS",
    description: "maths paper design",
  },
  {
    id: "3",
    title: "Development",
    status: "DONE",
    description: "maths paper development",
  },
];

export default function MainboardV2() {
  const [tasks, setTasks] = useState<Task[]>(Initia_TASK);

  // Configure sensors for better touch support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    console.log("Task moved to:", newStatus);
    console.log(tasks);
  }

  return (
    <div className="p-4">
      <div className="flex gap-8  justify-center flex-wrap">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {COLUMN.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
