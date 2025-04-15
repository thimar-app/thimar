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
import { useAddSubGoalMutation } from "@/services/goalQueries";
import { toast } from "sonner";
import { GoalAddTaskCard } from "@/components/common/task/goal-add-task-card";

interface GoalListViewProps {
  goal: Goal | null;
  showCompletedTasks: boolean;
}

const GoalListView: React.FC<GoalListViewProps> = ({
  goal,
  showCompletedTasks,
}) => {
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [newSubGoalName, setNewSubGoalName] = useState("");
  const [showAddTaskCard, setShowAddTaskCard] = useState(false);
  const [selectedSubGoalId, setSelectedSubGoalId] = useState<string | null>(null);
  
  // Use the mutation hook instead of context
  const addSubGoalMutation = useAddSubGoalMutation(goal?.id || "");

  const handleAddSubGoal = async () => {
    if (!goal) return;
    if (newSubGoalName.trim()) {
      try {
        await addSubGoalMutation.mutateAsync({
          name: newSubGoalName,
          goal: goal.id,
        });
        
        // Reset form state
        setNewSubGoalName("");
        setIsAddingSubGoal(false);
        
        // Show success message
        toast.success("Sub-goal added successfully");
      } catch (error) {
        console.error('Error creating subgoal:', error);
        toast.error("Failed to add sub-goal");
      }
    }
  };

  if (!goal) {
    return (
      <div className="text-center text-muted-foreground">Goal not found</div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex flex-col">
        {goal?.sub_goals?.map((subGoal: SubGoal, index: number) => (
          <div key={subGoal.id}>
            <SubGoalItem
              subGoal={subGoal}
              index={index}
              goalId={goal.id}
              showCompletedTasks={showCompletedTasks}
            />
            {showAddTaskCard && selectedSubGoalId === subGoal.id && (
              <GoalAddTaskCard
                subGoalId={selectedSubGoalId}
                onClose={() => {
                  setShowAddTaskCard(false);
                  setSelectedSubGoalId(null);
                }}
                onSave={() => {
                  setShowAddTaskCard(false);
                }}
              />
            )}
          </div>
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
            className="px-3 gap-3 text-muted-foreground w-full justify-start cursor-pointer"
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
