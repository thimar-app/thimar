// // components/goal/GoalListView.tsx
// import React, { useState } from "react";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Goal, SubGoal } from "@/lib/types";
// import { useGoalContext } from "@/context/GoalContext";
// import SubGoalItem from "@/components/pages/goalDetails/sub-goal-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { CirclePlus } from "lucide-react";

// interface GoalListViewProps {
//   goal: Goal;
//   showCompletedTasks: boolean;
// }

// const GoalListView: React.FC<GoalListViewProps> = ({
//   goal,
//   showCompletedTasks,
// }) => {
//   const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
//   const [newSubGoalName, setNewSubGoalName] = useState("");
//   const { addSubGoal } = useGoalContext();

//   const handleAddSubGoal = () => {
//     if (newSubGoalName.trim()) {
//       const newSubGoal: SubGoal = {
//         id: `subgoal-${Date.now()}`,
//         name: newSubGoalName,
//         // goal: goal.id,
//         goal_id: goal.id,
//         tasks: [],
//       };
//       // addSubGoal(newSubGoal);
//       setNewSubGoalName("");
//       setIsAddingSubGoal(false);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="w-full space-y-4">
//         <h2 className="text-xl font-bold">{goal.name}</h2>
//         {goal.description && (
//           <p className="text-muted-foreground">{goal.description}</p>
//         )}
//         <div>
//             {goal.subGoals.map((subGoal, index) => (
//             <SubGoalItem
//               key={subGoal.id}
//               subGoal={subGoal}
//               index={index}
//               goalId={goal.id}
//               showCompletedTasks={showCompletedTasks}
//             />
//           ))}
//           {isAddingSubGoal ? (
//             <div className="border rounded-lg p-3 mb-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Sub-goal name"
//                   value={newSubGoalName}
//                   onChange={(e) => setNewSubGoalName(e.target.value)}
//                   className="flex-1"
//                   autoFocus
//                 />
//                 <Button onClick={handleAddSubGoal} size="sm">
//                   Add
//                 </Button>
//                 <Button
//                   onClick={() => setIsAddingSubGoal(false)}
//                   variant="outline"
//                   size="sm"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <Button
//               variant="ghost"
//               className="mt-2 px-3 gap-3 text-muted-foreground w-full cursor-pointer"
//               onClick={() => setIsAddingSubGoal(true)}
//             >
//               <CirclePlus size={18} />
//               Add Sub Goal
//             </Button>
//           )}
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default GoalListView;

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Goal, SubGoal } from "@/context/GoalContext";
import { useGoalContext } from "@/context/GoalContext";
import SubGoalItem from "./sub-goal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";

interface GoalListViewProps {
  goal: Goal | null; // Accept null to prevent crashes
  showCompletedTasks: boolean;
}

const GoalListView: React.FC<GoalListViewProps> = ({
  goal,
  showCompletedTasks,
}) => {
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [newSubGoalName, setNewSubGoalName] = useState("");
  const { addSubGoal } = useGoalContext();

  const handleAddSubGoal = async () => {
    if (!goal) return; // Prevent errors if goal is missing
    if (newSubGoalName.trim()) {
      const newSubGoal = {
        name: newSubGoalName,
        goal: goal.id,
      };
      await addSubGoal(newSubGoal);
      setNewSubGoalName("");
      setIsAddingSubGoal(false);
    }
  };

  if (!goal) {
    return (
      <div className="text-center text-muted-foreground">Goal not found</div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full">
        {goal?.sub_goals?.length ? (
          goal.sub_goals.map((subGoal: SubGoal, index: number) => (
            <SubGoalItem
              key={subGoal.id}
              subGoal={subGoal}
              index={index}
              goalId={goal.id}
              showCompletedTasks={showCompletedTasks}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No sub-goals yet.</p>
        )}

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
            className="px-3 gap-3 text-muted-foreground w-full cursor-pointer"
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
