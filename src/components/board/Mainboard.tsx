"use client";
// import Todo from "./Todo";
import InProgress from "./InProgress";
import Done from "./Done";
import Chat from "./Chat";
import { DndContext, useDroppable } from "@dnd-kit/core";
import Draggable from "./draggable";
import Droppable from "./dropable";

export default function Mainboard() {
  return (
    <DndContext>
      <div className="grid grid-cols-4 gap-4 p-10 border-solid border-2 h-screen w-full justify-center">
        <Droppable />
        <div className="border-solid border-2 text-center underline">
          <InProgress />
          <Draggable />
        </div>
        <div className="border-solid border-2 text-center underline">
          <Done />
        </div>
        <div className="border-solid border-2 text-center underline">
          <Chat />
        </div>
      </div>
    </DndContext>
  );
}
