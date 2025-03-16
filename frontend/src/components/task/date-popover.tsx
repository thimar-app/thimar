import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Sun,
  Armchair,
  CalendarArrowUp,
} from "lucide-react";

const getDateLabels = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const nextWeekend = new Date();
  nextWeekend.setDate(today.getDate() + (6 - today.getDay()) + 7);

  return [
    {
      icon: CalendarIcon,
      title: "Today",
      subTitle: today.toLocaleDateString("en-US", { weekday: "long" }),
      color: "text-green-500",
    },
    {
      icon: Sun,
      title: "Tomorrow",
      subTitle: tomorrow.toLocaleDateString("en-US", { weekday: "long" }),
      color: "text-yellow-500",
    },
    {
      icon: CalendarArrowUp,
      title: "Next Week",
      subTitle: nextWeek.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      color: "text-violet-500",
    },
    {
      icon: Armchair,
      title: "Next Weekend",
      subTitle: nextWeekend.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      color: "text-blue-500",
    },
  ];
};

export function DatePopover() {
  const [buttonTitle, setButtonTitle] = useState<JSX.Element>(
    <p className="text-green-500 flex items-center gap-1">
      <CalendarIcon />
      <span>Today</span>
    </p>
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const dates = getDateLabels();

  const handleTitleChange = (title: string, subTitle: string) => {
    let newTitle;
    switch (title) {
      case "Tomorrow":
        newTitle = (
          <p className="text-yellow-600 flex items-center gap-1">
            <Sun />
            <span>Tomorrow</span>
          </p>
        );
        break;
      case "Next Week":
        newTitle = (
          <p className="text-violet-600 flex items-center gap-1">
            <CalendarArrowUp />
            <span>{subTitle}</span>
          </p>
        );
        break;
      case "Next Weekend":
        newTitle = (
          <p className="text-neutral-600 flex items-center gap-1">
            <Armchair />
            <span>{subTitle}</span>
          </p>
        );
        break;
      default:
        newTitle = (
          <p className="text-green-600 flex items-center gap-1">
            <CalendarIcon />
            <span>Today</span>
          </p>
        );
    }

    setButtonTitle(newTitle);
    setOpen(false);
  };

  const handleDateSelection = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setButtonTitle(
        <p className="text-blue-600 flex items-center gap-1">
          <CalendarIcon />
          <span>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>
      );
      setOpen(false);
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
            placeholder="Type a date"
            className="outline-none m-2"
          />
        </div>

        <hr />
        <div className="flex flex-col">
          {dates.map(({ icon: Icon, title, subTitle, color }) => (
            <Button
              key={title}
              onClick={() => handleTitleChange(title, subTitle)}
              variant="ghost"
              className="justify-between rounded-none"
            >
              <span className="flex items-center gap-2">
                <Icon className={color} />
                {title}
              </span>
              <span className="text-muted-foreground">{subTitle}</span>
            </Button>
          ))}
        </div>
        <hr />
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelection}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
