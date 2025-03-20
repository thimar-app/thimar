import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Flag } from "lucide-react";

type PriorityType = "Low" | "Medium" | "High" | "Urgent";

interface PriorityPopoverProps {
  selectedPriority: PriorityType;
  onPrioritySelect: (priority: PriorityType) => void;
}

export function PriorityPopover({
  selectedPriority,
  onPrioritySelect,
}: PriorityPopoverProps) {
  // Map priority values to colors and display names
  const priorityConfig = {
    Urgent: { color: "text-red-500", label: "P1" },
    High: { color: "text-yellow-500", label: "P2" },
    Medium: { color: "text-blue-500", label: "P3" },
    Low: { color: "text-muted-foreground", label: "P4" },
  };

  // Array of priority values in order from highest to lowest
  const priorityValues: PriorityType[] = ["Urgent", "High", "Medium", "Low"];

  // Get the color for the currently selected priority
  const selectedColor = priorityConfig[selectedPriority].color;
  const selectedLabel = priorityConfig[selectedPriority].label;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="relative shadow-none h-7 !border-white/20"
          variant="outline"
          size={"sm"}
        >
          <Flag className={selectedColor} />
          <span>{selectedLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max p-0 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {priorityValues.map((priority) => (
            <Button
              onClick={() => onPrioritySelect(priority)}
              className={`rounded-none ${
                selectedPriority !== priority ? "pr-8" : "pr-2"
              }`}
              variant={"ghost"}
              key={priority}
            >
              <Flag className={priorityConfig[priority].color} />
              <span> {priority}</span>
              {selectedPriority === priority && (
                <Check className="text-green-500" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
