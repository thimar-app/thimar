import {
  Calendar1,
  CalendarSync,
  CheckCircle2,
  Flag,
  Goal,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import TasksHeader from "./header";
import SimpleListView from "../home/simple-list-view";
import { useTaskContext } from "@/context/TaskContext";
import { useGoalContext } from "@/context/GoalContext";

export default function Tasks() {
  const { progress, tasks } = useTaskContext();
  const { getGoalBySubGoalId } = useGoalContext();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status).length;

  // Filter states
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showOnlyHabits, setShowOnlyHabits] = useState<boolean>(false);

  // Extract unique goals and priorities from tasks

  // Get goal names for display
  const getGoalName = (subGoalId: string) => {
    const parentGoal = getGoalBySubGoalId(subGoalId);
    return parentGoal ? parentGoal.name : "No Goal";
  };
  const uniqueGoals = Array.from(
    new Set(tasks.map((task) => getGoalName(task.sub_goal)))
  ).filter(Boolean) as string[];
  const priorities = ["High", "Medium", "Low"];

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    // Apply goal filter
    if (
      selectedGoals.length > 0 &&
      !selectedGoals.includes(getGoalName(task.sub_goal))
    ) {
      return false;
    }

    // Apply priority filter
    if (
      selectedPriorities.length > 0 &&
      !selectedPriorities.includes(task.priority)
    ) {
      return false;
    }

    // Apply date filter
    if (selectedDates.length > 0 && !selectedDates.includes(task.date)) {
      return false;
    }

    // Apply habits filter
    if (showOnlyHabits && !task.repeat) {
      return false;
    }

    return true;
  });

  // Toggle goal selection
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(goal)
        ? prevGoals.filter((g) => g !== goal)
        : [...prevGoals, goal]
    );
  };

  // Toggle priority selection
  const togglePriority = (priority: string) => {
    setSelectedPriorities((prevPriorities) =>
      prevPriorities.includes(priority)
        ? prevPriorities.filter((p) => p !== priority)
        : [...prevPriorities, priority]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGoals([]);
    setSelectedPriorities([]);
    setSelectedDates([]);
    setShowOnlyHabits(false);
  };

  return (
    <main className="flex flex-col">
      <TasksHeader />
      {/* Progress Bar Section */}
      <section className="flex flex-col sm:flex-row items-center gap-3 p-4">
        <div className="w-full p-4 pb-5 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="flex items-center gap-3 font-semibold text-base sm:text-lg">
              <TrendingUp className="size-4 sm:size-5" />
              Tasks Progress
            </h2>
            <span className="font-semibold text-base sm:text-lg text-muted-foreground">
              {progress.formattedPercentage}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-52 bg-muted rounded-lg py-4 items-center">
          <span className="flex gap-2 items-center font-semibold text-base sm:text-lg">
            <CheckCircle2 className="size-4 sm:size-5" />
            Tasks Done
          </span>
          <span className="font-semibold text-xl sm:text-2xl text-muted-foreground">
            {completedTasks}/{totalTasks}
          </span>
        </div>
      </section>

      {/* Filter Buttons Section */}
      <section className="gap-2 my-4 px-4 grid grid-cols-2 sm:grid-cols-4">
        {/* Goals Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`w-full h-10 ${
                selectedGoals.length ? "bg-violet-800" : "bg-violet-600"
              }`}
            >
              <Goal className="mr-2 size-4 sm:size-5" />
              <span className="hidden sm:inline">Filter by</span> Goals
              {selectedGoals.length > 0 && (
                <span className="ml-1 bg-white text-violet-800 rounded-full px-2 text-xs font-bold">
                  {selectedGoals.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Select Goals</h4>
                {selectedGoals.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGoals([])}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {uniqueGoals.length > 0 ? (
                  uniqueGoals.map((goal, index) => (
                    <div
                      key={`${goal}-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={selectedGoals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <label htmlFor={`goal-${goal}`} className="text-sm">
                        {goal}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No goals available
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Priorities Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`w-full h-10 ${
                selectedPriorities.length ? "bg-violet-800" : "bg-violet-600"
              }`}
            >
              <Flag className="mr-2 size-4 sm:size-5" />
              <span className="hidden sm:inline">Filter by</span> Priority
              {selectedPriorities.length > 0 && (
                <span className="ml-1 bg-white text-violet-800 rounded-full px-2 text-xs font-bold">
                  {selectedPriorities.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Select Priorities</h4>
                {selectedPriorities.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPriorities([])}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                    />
                    <label htmlFor={`priority-${priority}`} className="text-sm">
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`w-full h-10 ${
                selectedDates.length ? "bg-violet-800" : "bg-violet-600"
              }`}
            >
              <Calendar1 className="mr-2 size-4 sm:size-5" />
              <span className="hidden sm:inline">Filter by</span> Date
              {selectedDates.length > 0 && (
                <span className="ml-1 bg-white text-violet-800 rounded-full px-2 text-xs font-bold">
                  {selectedDates.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto !p-2">
            <div>
              <h4 className="font-medium mb-2">Select Dates</h4>
              {selectedDates.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDates([])}
                >
                  Clear Dates
                </Button>
              )}
            </div>
            <Calendar
              mode="multiple"
              selected={selectedDates.map((date) => new Date(date))}
              onSelect={(dates) => {
                if (dates && dates.length) {
                  const formattedDates = dates.map(
                    (date) => date.toISOString().split("T")[0]
                  );
                  setSelectedDates(formattedDates);
                } else {
                  setSelectedDates([]);
                }
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        {/* Habits Filter */}
        <Button
          variant={showOnlyHabits ? "default" : "secondary"}
          className={`w-full h-10 ${showOnlyHabits ? "bg-violet-800" : ""}`}
          onClick={() => setShowOnlyHabits(!showOnlyHabits)}
        >
          <CalendarSync className="mr-2 size-4 sm:size-5" />
          <span className="hidden sm:inline">Show only</span> Habits
          {showOnlyHabits && (
            <span className="ml-1 bg-white text-violet-800 rounded-full px-2 text-xs font-bold">
              ✓
            </span>
          )}
        </Button>
      </section>

      {/* Active Filters Section */}
      {(selectedGoals.length > 0 ||
        selectedPriorities.length > 0 ||
        selectedDates.length > 0 ||
        showOnlyHabits) && (
        <section className="mb-4 px-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-8"
          >
            Clear all filters <X className="ml-1 size-4" />
          </Button>

          {selectedGoals.map((goal) => (
            <Button
              key={`filter-goal-${goal}`}
              variant="outline"
              size="sm"
              className="h-8 bg-violet-100"
              onClick={() => toggleGoal(goal)}
            >
              <span className="hidden sm:inline">Goal:</span> {goal} <X className="ml-1 size-3" />
            </Button>
          ))}

          {selectedPriorities.map((priority) => (
            <Button
              key={`filter-priority-${priority}`}
              variant="outline"
              size="sm"
              className="h-8 bg-violet-100"
              onClick={() => togglePriority(priority)}
            >
              <span className="hidden sm:inline">Priority:</span> {priority} <X className="ml-1 size-3" />
            </Button>
          ))}

          {selectedDates.map((date) => (
            <Button
              key={`filter-date-${date}`}
              variant="outline"
              size="sm"
              className="h-8 bg-violet-100"
              onClick={() =>
                setSelectedDates((prev) => prev.filter((d) => d !== date))
              }
            >
              <span className="hidden sm:inline">Date:</span> {new Date(date).toLocaleDateString()}{" "}
              <X className="ml-1 size-3" />
            </Button>
          ))}

          {showOnlyHabits && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-violet-100"
              onClick={() => setShowOnlyHabits(false)}
            >
              Habits only <X className="ml-1 size-3" />
            </Button>
          )}
        </section>
      )}

      {/* Tasks List Section */}
      <section className="w-full p-4 pt-2 bg-muted rounded-lg">
        <SimpleListView
          onEditTask={() => {
            console.log("Edit task");
          }}
          showCompletedTasks={true}
          showGoals={true}
          tasks={filteredTasks}
        />
      </section>
    </main>
  );
}
