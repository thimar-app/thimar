import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoalContext } from "@/context/GoalContext";

interface GoalSelectProps {
  selectedSubGoalId: string;
  onSubGoalSelect: (subGoalId: string) => void;
}

export function GoalSelect({
  selectedSubGoalId,
  onSubGoalSelect,
}: GoalSelectProps) {
  const { goals } = useGoalContext() ?? { goals: [] }; // Ensure goals is always an array

  // const handleValueChange = (value: string) => {
  //   if (value) {
  //     onSubGoalSelect(value);
  //   } else {
  //     const uncategorizedSubGoal = goals
  //       .flatMap((goal) => goal.sub_goals)
  //       .find((subGoal) => subGoal.name === "Uncategorized Tasks");

  //     if (uncategorizedSubGoal) {
  //       onSubGoalSelect(uncategorizedSubGoal.id);
  //     } else {
  //       console.error("No 'Uncategorized Tasks' sub-goal found.");
  //     }
  //   }
  // };

  const handleValueChange = (value: string) => {
    value ? onSubGoalSelect(value) : onSubGoalSelect("");
  };

  return (
    <Select value={selectedSubGoalId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-52 shadow-none border-white/20 h-8">
        <SelectValue placeholder="Select Sub-Goal" />
      </SelectTrigger>
      <SelectContent className="pr-5">
        {goals.map((goal) => (
          <SelectGroup key={goal.id} className="px-2">
            <SelectLabel className="text-muted-foreground">
              {goal.name}
            </SelectLabel>
            {goal.sub_goals.map((subGoal) => (
              <SelectItem
                key={subGoal.id}
                value={subGoal.id}
                className="ml-5 border-l-2 rounded-l-none"
              >
                {subGoal.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
