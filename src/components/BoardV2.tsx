import { useEffect, useState } from "react";
import type { Task, Column as ColumnType } from "./types";
import { Column } from "./column";
import dynamic from "next/dynamic";
import * as DndKit from "@dnd-kit/core";
import { useUpdateTaskStatus } from "@/hooks/Mutate";
import { supabase } from "@/lib/supabase/client";
import { useTaskCards } from "@/hooks/query";
const CustomSidebar = dynamic(() => import("./CustomSidebar"), { ssr: false });
const COLUMN: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In-Progress" },
  { id: "DONE", title: "Done" },
];
import { useTaskStore } from "@/hooks/store";
import { useQueryClient } from "@tanstack/react-query";
export default function MainboardV2() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: taskData } = useTaskCards();
  const { tasks, setTasks } = useTaskStore();
  const updateTaskStatus = useUpdateTaskStatus();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData, setTasks]);

  useEffect(() => {
    const taskcardV2 = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "taskcard_v2" },
        (payload) => {
          console.log("Change received!", payload);
          queryClient.invalidateQueries({
            queryKey: ["getTaskCardsdetails"],
          });
        }
      )
      .subscribe();

    console.log(taskcardV2);
  }, [queryClient]);

  const mouseSensor = DndKit.useSensor(DndKit.MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = DndKit.useSensor(DndKit.TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 10 },
  });
  const sensors = DndKit.useSensors(mouseSensor, touchSensor);

  function handleDragEnd(event: DndKit.DragEndEvent) {
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
  const handleSidebarToggle = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <>
      <CustomSidebar
        isOpen={openSidebar}
        onClick={handleSidebarToggle}
      ></CustomSidebar>
      <div className="p-4 relative">
        <div className="flex gap-8  justify-center flex-wrap">
          <DndKit.DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {COLUMN.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </DndKit.DndContext>
        </div>
      </div>
    </>
  );
}
