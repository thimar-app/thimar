import { JSX, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Sun, CalendarArrowUp } from "lucide-react";

interface DatePopoverProps {
  selectedDate: string; // Date in "YYYY-MM-DD" format
  onDateSelect: (date: string) => void; // Function to receive date as string
}

// Helper to format date as string in format YYYY-MM-DD
const formatDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Helper to parse date string to Date object
const parseStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Helper to get date labels with string format dates
const getDateLabels = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return [
    {
      icon: CalendarIcon,
      title: "Today",
      date: formatDateString(today),
      subTitle: today.toLocaleDateString("en-US", { weekday: "long" }),
      color: "text-green-500",
    },
    {
      icon: Sun,
      title: "Tomorrow",
      date: formatDateString(tomorrow),
      subTitle: tomorrow.toLocaleDateString("en-US", { weekday: "long" }),
      color: "text-yellow-500",
    },
    {
      icon: CalendarArrowUp,
      title: "Next Week",
      date: formatDateString(nextWeek),
      subTitle: nextWeek.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      color: "text-violet-500",
    },
  ];
};

// Helper to create display JSX for a date string
const createDateDisplay = (dateString: string): JSX.Element => {
  const date = parseStringToDate(dateString);

  // Check if date is today
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  // Check if date is tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  // Check if date is in the next week
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const isNextWeek = date > today && date <= nextWeek;

  if (isToday) {
    return (
      <p className="text-green-600 flex items-center gap-1">
        <CalendarIcon />
        <span>Today</span>
      </p>
    );
  } else if (isTomorrow) {
    return (
      <p className="text-yellow-600 flex items-center gap-1">
        <Sun />
        <span>Tomorrow</span>
      </p>
    );
  } else if (isNextWeek) {
    return (
      <p className="text-violet-600 flex items-center gap-1">
        <CalendarArrowUp />
        <span>
          {date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </p>
    );
  } else {
    return (
      <p className="text-blue-600 flex items-center gap-1">
        <CalendarIcon />
        <span>
          {date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </p>
    );
  }
};

export function DatePopover({ selectedDate, onDateSelect }: DatePopoverProps) {
  const [buttonTitle, setButtonTitle] = useState<JSX.Element>(
    createDateDisplay(selectedDate)
  );
  const [date, setDate] = useState<Date>(parseStringToDate(selectedDate));
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Update local state when selectedDate prop changes
  useEffect(() => {
    setDate(parseStringToDate(selectedDate));
    setButtonTitle(createDateDisplay(selectedDate));
  }, [selectedDate]);

  const dates = getDateLabels();

  const handlePresetDateSelect = (presetDateString: string, title: string) => {
    setDate(parseStringToDate(presetDateString));
    setButtonTitle(createDateDisplay(presetDateString));
    onDateSelect(presetDateString);
    setOpen(false);
  };

  const handleCalendarDateSelection = (
    selectedCalendarDate: Date | undefined
  ) => {
    if (selectedCalendarDate) {
      const dateString = formatDateString(selectedCalendarDate);
      setDate(selectedCalendarDate);
      setButtonTitle(createDateDisplay(dateString));
      onDateSelect(dateString);
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Validate if input is in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(inputValue)) {
        const parsedDate = new Date(inputValue);
        if (!isNaN(parsedDate.getTime())) {
          handleCalendarDateSelection(parsedDate);
        }
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="relative shadow-none h-7 !border-white/20"
          variant="outline"
          size="sm"
        >
          {buttonTitle}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={-120}
        className="w-64 p-0 rounded-lg overflow-hidden"
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Type a date (YYYY-MM-DD)"
            className="outline-none m-2 p-1 border rounded"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <hr />
        <div className="flex flex-col">
          {dates.map(
            ({ icon: Icon, title, date: presetDate, subTitle, color }) => (
              <Button
                key={title}
                onClick={() => handlePresetDateSelect(presetDate, title)}
                variant="ghost"
                className="justify-between rounded-none"
              >
                <span className="flex items-center gap-2">
                  <Icon className={color} />
                  {title}
                </span>
                <span className="text-muted-foreground">{subTitle}</span>
              </Button>
            )
          )}
        </div>
        <hr />
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarDateSelection}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
