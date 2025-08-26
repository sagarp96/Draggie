import { useDroppable } from "@dnd-kit/core";

export default function Droppable() {
  const { setNodeRef } = useDroppable({
    id: "unique-id",
  });

  return (
    <div
      ref={setNodeRef}
      className="border-solid border-2 text-center underline"
    >
      <h1>TODO Area</h1>
    </div>
  );
}
