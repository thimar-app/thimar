import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarSync } from "lucide-react";

import { PriorityPopover } from "./priority-popover";
import { DatePopover } from "./date-popover";
import { ProjectSelect } from "./project-select";

export function AddTaskCard() {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="w-full p-0 bg-card/50 border-white/20 shadow-none mt-2 rounded-lg gap-0">
      <CardContent className="p-2">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full bg-transparent outline-none font-medium text-md rounded"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full bg-transparent outline-none text-xs rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center gap-2 mt-2">
          <DatePopover />
          <PriorityPopover />
          <Button
            className="relative shadow-none h-7 !border-white/20"
            variant="outline"
            size={"sm"}
          >
            <CalendarSync className="text-muted-foreground" />
            <span>Repeat Task</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="!p-2 flex justify-between items-center border-t border-white/20">
        <ProjectSelect />
        <div className="space-x-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => setTaskName("")}
          >
            Cancel
          </Button>
          <Button size={"sm"} onClick={() => console.log("add")}>
            Add Task
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
