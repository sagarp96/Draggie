import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTask } from "@/hooks/Mutate";

export default function DeleteTaskBTN({ taskID }: { taskID: string }) {
  const deleteTaskMutation = useDeleteTask();
  const deleteTask = () => {
    deleteTaskMutation.mutate({ taskID });
  };
  return (
    <Button
      onClick={deleteTask}
      variant="ghost"
      className="hover:bg-transparent hover:text-red-600"
    >
      <Trash2 className="mr-2 h-4 w-4" />
    </Button>
  );
}
