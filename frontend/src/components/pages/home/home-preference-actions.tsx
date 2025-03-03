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
        <Button variant={"ghost"} size={"icon"}>
          <Settings2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-2 " align="end">
        <span className="text-xs font-semibold">View</span>
        <Card className="p-0 bg-transparent border-0 gap-2 shadow-none my-2">
          <div className="relative grid grid-cols-3 bg-card rounded-lg p-1 gap-1">
            {views.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className={`flex w-full h-16 flex-col items-center justify-center gap-2 p-0 ${
                  view === option.id ? "bg-accent" : ""
                }`}
                onClick={() => setView(option.id)}
                disabled={option.id === "board" && true}
              >
                <option.icon className="!size-6" strokeWidth={1} />
                <span className="text-[10px] font-normal">{option.label}</span>
              </Button>
            ))}

            <BadgeCheck
              className="text-card size-4 absolute right-5 top-6 bg-yellow-500 rounded-full"
              strokeWidth={2}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <Label htmlFor="show-prayer-section" className="text-sm">
              Show Prayer Section
            </Label>
            <Switch
              className="cursor-pointer"
              id="show-prayer-section"
              checked={showPrayerSection}
              onCheckedChange={setShowPrayerSection}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <Label htmlFor="completed-tasks" className="text-sm">
              Show Completed Tasks
            </Label>
            <Switch
              className="cursor-pointer"
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
