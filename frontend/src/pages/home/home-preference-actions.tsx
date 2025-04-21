import {
  BadgeCheck,
  Settings2,
  SquareChartGantt,
  SquareKanban,
  SquareMenu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

type View = "simple-list" | "prayer-list" | "board";

type HomeHeader = {
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
  showPrayerSection: boolean;
  showCompletedTasks: boolean;
  setShowPrayerSection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ViewOption {
  id: View;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const views: ViewOption[] = [
  {
    id: "simple-list",
    label: "Simple List",
    icon: SquareChartGantt,
  },
  {
    id: "prayer-list",
    label: "Prayer List",
    icon: SquareMenu,
  },
  {
    id: "board",
    label: "Board",
    icon: SquareKanban,
  },
];

export function HomePreferenceActions({
  view,
  setView,
  showPrayerSection,
  setShowPrayerSection,
  showCompletedTasks,
  setShowCompletedTasks,
}: HomeHeader) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[280px] sm:w-[320px] p-3 sm:p-4" 
        align="end"
        sideOffset={8}
      >
        <span className="text-sm sm:text-base font-semibold">View</span>
        <Card className="!p-0 bg-transparent border-0 gap-2 shadow-none my-3 sm:my-4">
          <div className="relative grid grid-cols-3 bg-card rounded-lg p-1.5 sm:p-2 gap-1.5 sm:gap-2">
            {views.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className={`flex w-full h-16 sm:h-20 flex-col items-center justify-center gap-2 p-0 ${
                  view === option.id ? "bg-accent" : ""
                }`}
                onClick={() => setView(option.id)}
                disabled={option.id === "board" && true}
              >
                <option.icon className="!size-6 sm:!size-7" strokeWidth={1} />
                <span className="text-xs sm:text-sm font-normal">{option.label}</span>
              </Button>
            ))}

            <BadgeCheck
              className="text-card size-4 sm:size-5 absolute right-5 top-6 sm:top-8 bg-yellow-500 rounded-full"
              strokeWidth={2}
            />
          </div>
          <div className="flex items-center justify-between py-3 sm:py-4 border-t">
            <Label htmlFor="show-prayer-section" className="text-sm sm:text-base">
              Show Prayer Section
            </Label>
            <Switch
              className="cursor-pointer h-5 w-9 sm:h-6 sm:w-11"
              id="show-prayer-section"
              checked={showPrayerSection}
              onCheckedChange={setShowPrayerSection}
            />
          </div>
          <div className="flex items-center justify-between py-3 sm:py-4 border-t">
            <Label htmlFor="completed-tasks" className="text-sm sm:text-base">
              Show Completed Tasks
            </Label>
            <Switch
              className="cursor-pointer h-5 w-9 sm:h-6 sm:w-11"
              id="completed-tasks"
              checked={showCompletedTasks}
              onCheckedChange={setShowCompletedTasks}
            />
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
