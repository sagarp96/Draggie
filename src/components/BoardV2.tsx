import { useEffect } from "react";
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
import { useUpdateTaskStatus } from "@/hooks/Mutate";
// import { useTaskCardDetails } from "@/hooks/query";
import { useTaskCards } from "@/hooks/query";
const COLUMN: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In-Progress" },
  { id: "DONE", title: "Done" },
];
import { useTaskStore } from "@/hooks/store";
export default function MainboardV2() {
  const { data: taskData } = useTaskCards();
  const { tasks, setTasks } = useTaskStore();
  const updateTaskStatus = useUpdateTaskStatus();
  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData, setTasks]);
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

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    updateTaskStatus.mutate({ taskId, status: newStatus });
    console.log(taskId);
    console.log("Task moved to:", newStatus);
    console.log(updatedTasks);
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
