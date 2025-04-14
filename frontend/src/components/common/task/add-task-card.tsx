import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarSync, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/lib/types";
import { PriorityPopover } from "./priority-popover";
import { DatePopover } from "./date-popover";
import { GoalSelect } from "./goal-select";

interface AddTaskCardProps {
  subGoalId: string;
  todayTask?: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function AddTaskCard({
  subGoalId,
  todayTask = false,
  onClose,
  onSave,
}: AddTaskCardProps) {
  const { addTask } = useTaskContext();
  const [newTask, setNewTask] = useState<Task>({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    // Format the date as YYYY-MM-DD
    date: new Date().toISOString().split("T")[0],
    // Use the field names as defined in your serializer
    sub_goal: subGoalId,
    prayer: null,
    priority: "Low",
    status: false,
    repeat: false,
  });

  const handleChange = (field: string, value: any) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: string) => {
    handleChange("date", date);
  };

  const handlePriorityChange = (
    priority: "Low" | "Medium" | "High" | "Urgent"
  ) => {
    handleChange("priority", priority);
  };

  const handleSubGoalChange = (subGoalId: string) => {
    handleChange("sub_goal", subGoalId);
  };

  const handleSave = () => {
    if (!newTask.name.trim()) return;
    addTask(newTask);
    if (onSave) onSave();
    onClose();
  };

  return (
    <Card className="w-full p-0 bg-card/50 border-white/20 shadow-none mt-2 rounded-lg">
      <CardContent className="p-2">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full bg-transparent outline-none font-medium text-md rounded"
          value={newTask.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full bg-transparent outline-none text-xs rounded"
          value={newTask.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <div className="flex items-center gap-2 mt-2">
          <DatePopover
            selectedDate={newTask.date}
            onDateSelect={handleDateChange}
          />
          <PriorityPopover
            selectedPriority={newTask.priority}
            onPrioritySelect={handlePriorityChange}
          />
          <Button
            className={`relative shadow-none h-7 !border-white/20 ${
              newTask.repeat
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : ""
            }`}
            variant="outline"
            size="sm"
            onClick={() => handleChange("repeat", !newTask.repeat)}
          >
            <CalendarSync
              className={`${
                newTask.repeat ? "text-purple-800" : "text-muted-foreground"
              } mr-1 h-4 w-4`}
            />
            <span>Repeat Task</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={newTask.status}
              onCheckedChange={() => handleChange("status", !newTask.status)}
              id="task-status"
            />
            <label
              htmlFor="task-status"
              className="text-sm cursor-pointer flex items-center"
            >
              <Check
                className={`h-4 w-4 mr-1 ${
                  newTask.status ? "text-green-500" : "text-muted-foreground"
                }`}
              />
              Mark as completed
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="!p-2 flex justify-between items-center border-t border-white/20">
        {todayTask ? (
          <GoalSelect
            selectedSubGoalId={newTask.sub_goal}
            onSubGoalSelect={handleSubGoalChange}
          />
        ) : (
          <div></div> // Empty div for spacing when GoalSelect is not shown
        )}
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Add Task
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
