import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/lib/types";
import { PriorityPopover } from "./priority-popover";
import { DatePopover } from "./date-popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checkPrayerTimesUpdate } from "@/services/prayersApi";

interface GoalAddTaskCardProps {
  subGoalId: string;
  onClose: () => void;
  onSave?: () => void;
}

export function GoalAddTaskCard({
  subGoalId,
  onClose,
  onSave,
}: GoalAddTaskCardProps) {
  const { addTask } = useTaskContext();
  const [prayers, setPrayers] = useState<{ id: string; name: string; time: string }[]>([]);
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

  // Fetch prayer times
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        const data = await checkPrayerTimesUpdate();
        setPrayers(data);
      } catch (error) {
        console.error("Failed to fetch prayers:", error);
      }
    };

    loadPrayerTimes();
  }, []);

  const handleChange = (field: string, value: any) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: string) => {
    handleChange("date", date);
  };

  const handlePriorityChange = (priority: "Low" | "Medium" | "High" | "Urgent") => {
    handleChange("priority", priority);
  };

  const handlePrayerChange = (prayerId: string) => {
    handleChange("prayer", prayerId === "none" ? null : prayerId);
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-name">Task Name</Label>
            <input
              id="task-name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter task name"
              value={newTask.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-description">Description (Optional)</Label>
            <input
              id="task-description"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Prayer Time</Label>
            <Select
              value={newTask.prayer || "none"}
              onValueChange={handlePrayerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select prayer time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {prayers.map((prayer) => (
                  <SelectItem key={prayer.id} value={prayer.id}>
                    {prayer.name} ({prayer.time.slice(0, 5)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <DatePopover
              selectedDate={newTask.date}
              onDateSelect={handleDateChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <PriorityPopover
              selectedPriority={newTask.priority}
              onPrioritySelect={handlePriorityChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="repeat-task"
              checked={newTask.repeat}
              onCheckedChange={(checked) => handleChange("repeat", checked)}
            />
            <Label htmlFor="repeat-task">Repeat daily</Label>
          </div>
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