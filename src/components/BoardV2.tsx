"use client";

import { useEffect, useState } from "react";
import type { Task, Column as ColumnType } from "./types";
import { Column } from "./column";
import dynamic from "next/dynamic";
import * as DndKit from "@dnd-kit/core";
import { useUpdateTaskStatus } from "@/hooks/Mutate";
import { supabase } from "@/lib/supabase/client";
import { useTaskCards } from "@/hooks/query";
import { useTaskStore } from "@/hooks/store";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "@/hooks/useAuth";
import { useCurrentUserName } from "@/hooks/use-current-user-name";

// Lazy client chunks to avoid server bundling issues
const CustomSidebar = dynamic(() => import("./CustomSidebar"), { ssr: false });
const RealtimeCursors = dynamic(
  () => import("@/components/realtime-cursors").then((m) => m.RealtimeCursors),
  { ssr: false }
);

const COLUMN: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In-Progress" },
  { id: "DONE", title: "Done" },
];

export default function MainboardV2() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: user, isLoading } = useUserAuth();
  const username = useCurrentUserName();
  const isAuthed = !!user;

  // Do not fetch tasks until authenticated
  const { data: taskData } = useTaskCards({ enabled: isAuthed });

  const { tasks, setTasks } = useTaskStore();
  const updateTaskStatus = useUpdateTaskStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData, setTasks]);

  // Subscribe to realtime only after auth
  useEffect(() => {
    if (!isAuthed) return;

    const ch = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "taskcard_v2" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getTaskCardsdetails"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "taskcard_v2" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getTaskCardsdetails"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "taskcard_v2" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getTaskCardsdetails"] });
        }
      )
      .subscribe();

    return () => {
      try {
        ch.unsubscribe();
      } catch {}
    };
  }, [isAuthed, queryClient]);

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
  }

  const handleSidebarToggle = () => {
    setOpenSidebar((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-2">Loading board...</h2>
        <p className="text-sm text-neutral-500">Please wait</p>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="p-6 text-center text-sm text-neutral-400">
        Please log in to access the board.
      </div>
    );
  }

  return (
    <>
      <CustomSidebar isOpen={openSidebar} onClick={handleSidebarToggle} />
      <div className="p-4 relative">
        <div className="flex gap-8 justify-center flex-wrap">
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
      <div className="w-full min-h-screen">
        <RealtimeCursors roomName="Draggie" username={username} />
      </div>
    </>
  );
}
