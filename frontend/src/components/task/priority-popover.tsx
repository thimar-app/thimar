"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Flag } from "lucide-react";
import { useState } from "react";

export function PriorityPopover() {
  const colorList = [
    "text-red-500",
    "text-yellow-500",
    "text-blue-500",
    "text-muted-foreground",
  ];
  const [activeIndex, setActiveIndex] = useState(3);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="relative shadow-none h-7 !border-white/20"
          variant="outline"
          size={"sm"}
        >
          <Flag className={`${colorList[activeIndex]}`} />
          <span>{activeIndex === 3 ? "Priority" : `P${activeIndex + 1}`} </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max p-0 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {colorList.map((color, index) => (
            <Button
              onClick={() => {
                setActiveIndex(index);
              }}
              className={`rounded-none ${
                activeIndex !== index ? "pr-8" : "pr-2"
              }`}
              variant={"ghost"}
              key={color}
            >
              <Flag className={color} />
              <span> Priority {index + 1}</span>
              {activeIndex === index && <Check className="text-red-500" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
