import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Goal, SubGoal } from "@/db/goals";
import { useGoalContext } from "@/context/GoalContext";
import SubGoalItem from "@/components/pages/goalDetails/sub-goal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";

interface GoalListViewProps {
  goal: Goal;
  showCompletedTasks: boolean;
}

const GoalListView: React.FC<GoalListViewProps> = ({
  goal,
  showCompletedTasks,
}) => {
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [newSubGoalName, setNewSubGoalName] = useState("");
  const { addSubGoal } = useGoalContext();

  const handleAddSubGoal = () => {
    if (newSubGoalName.trim()) {
      const newSubGoal: SubGoal = {
        id: `subgoal-${Date.now()}`,
        name: newSubGoalName,
        goal_id: goal.id,
        tasks: [],
      };
      addSubGoal(newSubGoal);
      setNewSubGoalName("");
      setIsAddingSubGoal(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full space-y-4">
        {goal.subGoals.map((subGoal, index) => (
          <SubGoalItem
            key={subGoal.id}
            subGoal={subGoal}
            index={index}
            goalId={goal.id}
            showCompletedTasks={showCompletedTasks}
          />
        ))}
        {isAddingSubGoal ? (
          <div className="border rounded-lg p-3 mb-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Sub-goal name"
                value={newSubGoalName}
                onChange={(e) => setNewSubGoalName(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAddSubGoal} size="sm">
                Add
              </Button>
              <Button
                onClick={() => setIsAddingSubGoal(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="mt-2 px-3 gap-3 text-muted-foreground w-full cursor-pointer"
            onClick={() => setIsAddingSubGoal(true)}
          >
            <CirclePlus size={18} />
            Add Sub Goal
          </Button>
        )}
      </div>
    </DndProvider>
  );
};

export default GoalListView;
