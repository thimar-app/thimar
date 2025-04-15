import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/lib/types";

interface SimpleAddTaskCardProps {
  subGoalId: string;
  onClose: () => void;
  onSave?: () => void;
}

export function SimpleAddTaskCard({
  subGoalId,
  onClose,
  onSave,
}: SimpleAddTaskCardProps) {
  const { addTask } = useTaskContext();
  const [newTask, setNewTask] = useState<Task>({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    sub_goal: subGoalId,
    prayer: null,
    priority: "Low",
    status: false,
    repeat: false,
  });

  const handleChange = (field: string, value: any) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!newTask.name.trim()) return;
    addTask(newTask);
    if (onSave) onSave();
    onClose();
  };

  return (
    <Card className="w-full mt-2">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter task name"
            value={newTask.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter task description (optional)"
            value={newTask.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
} 