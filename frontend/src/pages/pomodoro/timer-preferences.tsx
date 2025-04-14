import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
}

interface TimerPreferencesProps {
  settings: TimerSettings;
  updateSettings: (settings: Partial<TimerSettings>) => void;
}

export function TimerPreferences({
  settings,
  updateSettings,
}: TimerPreferencesProps) {
  const [pomodoroInput, setPomodoroInput] = useState(
    settings.pomodoro.toString()
  );
  const [shortBreakInput, setShortBreakInput] = useState(
    settings.shortBreak.toString()
  );
  const [longBreakInput, setLongBreakInput] = useState(
    settings.longBreak.toString()
  );

  const pomodoroOptions = [20, 25, 30, 45, 50, 60, 90, 120];
  const shortBreakOptions = [5, 10, 15, 20];
  const longBreakOptions = [15, 20, 25, 30];

  const handlePomodoroChange = (value: string) => {
    setPomodoroInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateSettings({ pomodoro: numValue });
    }
  };

  const handleShortBreakChange = (value: string) => {
    setShortBreakInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateSettings({ shortBreak: numValue });
    }
  };

  const handleLongBreakChange = (value: string) => {
    setLongBreakInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateSettings({ longBreak: numValue });
    }
  };

  const selectPomodoroOption = (value: number) => {
    setPomodoroInput(value.toString());
    updateSettings({ pomodoro: value });
  };

  const selectShortBreakOption = (value: number) => {
    setShortBreakInput(value.toString());
    updateSettings({ shortBreak: value });
  };

  const selectLongBreakOption = (value: number) => {
    setLongBreakInput(value.toString());
    updateSettings({ longBreak: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <h3 className="text-lg">Set Pomodoro Time</h3>
        <div className="relative flex items-center gap-2">
          <Input
            type="number"
            value={pomodoroInput}
            onChange={(e) => handlePomodoroChange(e.target.value)}
            className="!bg-card border-none"
            min="1"
          />
          <span className="absolute right-0 m-1.5 rounded text-muted-foreground px-1 bg-[#1e1e1e]">
            minutes
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {pomodoroOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              className={cn(
                "bg-[#333333] hover:bg-[#444444] h-10 text-xl",
                settings.pomodoro === option &&
                  "bg-primary hover:!bg-primary/80"
              )}
              onClick={() => selectPomodoroOption(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg">Set Short Break</h3>
        <div className="relative flex items-center gap-2">
          <Input
            type="number"
            value={shortBreakInput}
            onChange={(e) => handleShortBreakChange(e.target.value)}
            className="!bg-card border-none"
            min="1"
          />
          <span className="absolute right-0 m-1.5 rounded text-muted-foreground px-1 bg-[#1e1e1e]">
            minutes
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {shortBreakOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              className={cn(
                "bg-[#333333] hover:bg-[#444444] text-white h-10 text-xl",
                settings.shortBreak === option &&
                  "bg-primary hover:!bg-primary/80"
              )}
              onClick={() => selectShortBreakOption(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg">Set Long Break</h3>
        <div className="relative flex items-center gap-2">
          <Input
            type="number"
            value={longBreakInput}
            onChange={(e) => handleLongBreakChange(e.target.value)}
            className="!bg-card border-none"
            min="1"
          />
          <span className="absolute right-0 m-1.5 rounded text-muted-foreground px-1 bg-[#1e1e1e]">
            minutes
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {longBreakOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              className={cn(
                "bg-[#333333] hover:bg-[#444444]  h-10 text-xl",
                settings.longBreak === option &&
                  "bg-primary hover:!bg-primary/80"
              )}
              onClick={() => selectLongBreakOption(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
