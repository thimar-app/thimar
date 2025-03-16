import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarSync, Check } from "lucide-react";
import { PriorityPopover } from "./priority-popover";
import { DatePopover } from "./date-popover";
import { ProjectSelect } from "./project-select";
import { Switch } from "@/components/ui/switch";

interface Task {
  id: string;
  name: string;
  description: string;
  date: Date;
  sub_goal_id: string | null;
  prayer_id: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: boolean;
  repeat: boolean;
}

interface EditTaskCardProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskCard({ task, onClose, onSave }: EditTaskCardProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  // Reset form when task changes
  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setEditedTask((prev) => ({
      ...prev,
      date,
    }));
  };

  const handlePriorityChange = (
    priority: "Low" | "Medium" | "High" | "Urgent"
  ) => {
    setEditedTask((prev) => ({
      ...prev,
      priority,
    }));
  };

  const handleRepeatChange = () => {
    setEditedTask((prev) => ({
      ...prev,
      repeat: !prev.repeat,
    }));
  };

  const handleProjectChange = (subGoalId: string | null) => {
    setEditedTask((prev) => ({
      ...prev,
      sub_goal_id: subGoalId,
    }));
  };

  const handleStatusChange = () => {
    setEditedTask((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <Card className="w-full p-0 bg-card/50 border-white/20 shadow-none mt-2 rounded-lg gap-0">
      <CardContent className="p-2">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full bg-transparent outline-none font-medium text-md rounded"
          value={editedTask.name}
          onChange={handleNameChange}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full bg-transparent outline-none text-xs rounded"
          value={editedTask.description}
          onChange={handleDescriptionChange}
        />
        <div className="flex items-center gap-2 mt-2">
          {/* <DatePopover 
            selectedDate={editedTask.date} 
            onDateSelect={handleDateChange} 
          />
          <PriorityPopover 
            selectedPriority={editedTask.priority} 
            onPrioritySelect={handlePriorityChange} 
          /> */}
          <Button
            className={`relative shadow-none h-7 !border-white/20 ${
              editedTask.repeat
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : ""
            }`}
            variant="outline"
            size={"sm"}
            onClick={handleRepeatChange}
          >
            <CalendarSync
              className={`${
                editedTask.repeat ? "text-purple-800" : "text-muted-foreground"
              } mr-1 h-4 w-4`}
            />
            <span>Repeat Task</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={editedTask.status}
              onCheckedChange={handleStatusChange}
              id="task-status"
            />
            <label
              htmlFor="task-status"
              className="text-sm cursor-pointer flex items-center"
            >
              <Check
                className={`h-4 w-4 mr-1 ${
                  editedTask.status ? "text-green-500" : "text-muted-foreground"
                }`}
              />
              Mark as completed
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="!p-2 flex justify-between items-center border-t border-white/20">
        {/* <ProjectSelect 
          selectedProjectId={editedTask.sub_goal_id} 
          onProjectSelect={handleProjectChange}
        /> */}
        <div className="space-x-2">
          <Button size={"sm"} variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button size={"sm"} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
