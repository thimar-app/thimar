// import React, { useState, useRef } from "react";
// import { useDrag, useDrop } from "react-dnd";
// import { useGoalContext } from "@/context/GoalContext";
// import { useTaskContext } from "@/context/TaskContext";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { AddTaskCard } from "@/components/task/add-task-card";
// import {
//   ChevronDown,
//   ChevronRight,
//   CirclePlus,
//   GripVertical,
//   Edit,
//   Save,
//   X,
// } from "lucide-react";
// import { SubGoal, Task } from "@/db/goals";
// import { Input } from "@/components/ui/input";
// import { ItemTypes } from "@/components/pages/goalDetails/item-types";
// import TaskCardDraggable from "@/components/task/task-card-draggable";

// interface SubGoalItemProps {
//   subGoal: SubGoal;
//   index: number;
//   goalId: string;
//   showCompletedTasks: boolean;
// }

// const SubGoalItem: React.FC<SubGoalItemProps> = ({
//   subGoal,
//   index,
//   goalId,
//   showCompletedTasks,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAddingTask, setIsAddingTask] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [subGoalTitle, setSubGoalTitle] = useState(subGoal.name);
//   const ref = useRef<HTMLDivElement>(null);

//   const { moveSubGoal, updateSubGoal } = useGoalContext();
//   const {
//     tasks,
//     addTask,
//     toggleTaskStatus,
//     deleteTask,
//     updateTask,
//     editingTask,
//     setEditingTask,
//     moveTask,
//   } = useTaskContext();

//   const subGoalTasks = tasks.filter((task) => task.sub_goal_id === subGoal.id);
//   const filteredTasks = showCompletedTasks
//     ? subGoalTasks
//     : subGoalTasks.filter((task) => !task.status);

//   const handleSaveTitle = () => {
//     const updatedSubGoal = { ...subGoal, name: subGoalTitle };
//     updateSubGoal(updatedSubGoal);
//     setIsEditingTitle(false);
//   };

//   const handleTaskAdded = (task: Task) => {
//     addTask(task);
//     setIsAddingTask(false);
//   };

//   const handleEditTask = (task: Task) => {
//     setEditingTask(task);
//   };

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.SUBGOAL,
//     item: { id: subGoal.id, index, goalId },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.SUBGOAL,
//     hover(item: { id: string; index: number; goalId: string }, monitor) {
//       if (!ref.current) return;
//       const dragIndex = item.index;
//       const hoverIndex = index;
//       if (dragIndex === hoverIndex) return;
//       const hoverBoundingRect = ref.current.getBoundingClientRect();
//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
//       moveSubGoal(goalId, dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   const [, dropTask] = useDrop({
//     accept: ItemTypes.TASK,
//     drop(item: { id: string; subGoalId: string }, monitor) {
//       const task = tasks.find((t) => t.id === item.id);
//       if (!task || task.sub_goal_id === subGoal.id) return;
//       const updatedTask = { ...task, sub_goal_id: subGoal.id };
//       updateTask(updatedTask);
//     },
//   });

//   drag(drop(dropTask(ref)));

//   return (
//     <div
//       ref={ref}
//       className={`mb-2 rounded-lg ${isDragging ? "opacity-50" : ""}`}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//         <div className="flex items-center p-2 bg-muted/30">
//           <div className="mr-2 cursor-move">
//             <GripVertical className="text-muted-foreground" size={18} />
//           </div>
//           {isEditingTitle ? (
//             <div className="flex items-center flex-1 gap-2">
//               <Input
//                 value={subGoalTitle}
//                 onChange={(e) => setSubGoalTitle(e.target.value)}
//                 className="h-8"
//                 autoFocus
//               />
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={handleSaveTitle}
//                 className="p-1 h-8 w-8"
//               >
//                 <Save size={16} />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => {
//                   setSubGoalTitle(subGoal.name);
//                   setIsEditingTitle(false);
//                 }}
//                 className="p-1 h-8 w-8"
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//           ) : (
//             <>
//               <CollapsibleTrigger className="flex items-center flex-1">
//                 {isOpen ? (
//                   <ChevronDown className="mr-2 h-4 w-4" />
//                 ) : (
//                   <ChevronRight className="mr-2 h-4 w-4" />
//                 )}
//                 <span className="font-medium">{subGoal.name}</span>
//                 <span className="ml-2 text-sm text-muted-foreground">
//                   ({filteredTasks.length} tasks)
//                 </span>
//               </CollapsibleTrigger>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsEditingTitle(true);
//                 }}
//                 className="p-1 h-8 w-8"
//               >
//                 <Edit size={16} />
//               </Button>
//             </>
//           )}
//         </div>
//         <CollapsibleContent>
//           <div className="p-2">
//             <ul className="divide-y">
//               {filteredTasks.map((task, taskIndex) => (
//                 <TaskCardDraggable
//                   key={task.id}
//                   task={task}
//                   index={taskIndex}
//                   subGoalId={subGoal.id}
//                   moveTask={moveTask}
//                   toggleTaskStatus={toggleTaskStatus}
//                   onDelete={deleteTask}
//                   onEdit={handleEditTask}
//                   isEditing={editingTask?.id === task.id}
//                   editingTask={editingTask}
//                   setEditingTask={setEditingTask}
//                   updateTask={updateTask}
//                 />
//               ))}
//             </ul>
//             {isAddingTask && (
//               <AddTaskCard
//                 onClose={() => setIsAddingTask(false)}
//                 subGoalId={subGoal.id}
//               />
//             )}
//             <Button
//               variant="ghost"
//               className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
//               onClick={() => setIsAddingTask(true)}
//             >
//               <CirclePlus className="size-5" strokeWidth={1} />
//               Add Task
//             </Button>
//           </div>
//         </CollapsibleContent>
//       </Collapsible>
//     </div>
//   );
// };

// export default SubGoalItem;


import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useGoalContext } from "@/context/GoalContext";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AddTaskCard } from "@/components/task/add-task-card";
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  GripVertical,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ItemTypes } from "./item-types";
import TaskCardDraggable from "@/components/task/task-card-draggable";

interface SubGoalItemProps {
  subGoal: {
    id: string;
    name: string;
    goal: string;
    created_at: string;
    updated_at: string;
  };
  index: number;
  goalId: string;
  showCompletedTasks: boolean;
}

const SubGoalItem: React.FC<SubGoalItemProps> = ({
  subGoal,
  index,
  goalId,
  showCompletedTasks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [subGoalTitle, setSubGoalTitle] = useState(subGoal.name);
  const ref = useRef<HTMLDivElement>(null);

  const { moveSubGoal, updateSubGoal } = useGoalContext();
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    editingTask,
    setEditingTask,
    moveTask,
  } = useTaskContext();

  const subGoalTasks = tasks.filter((task) => task.sub_goal === subGoal.id);
  const filteredTasks = showCompletedTasks
    ? subGoalTasks
    : subGoalTasks.filter((task) => !task.status);

  const handleSaveTitle = () => {
    const updatedSubGoal = { ...subGoal, name: subGoalTitle };
    updateSubGoal(updatedSubGoal);
    setIsEditingTitle(false);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SUBGOAL,
    item: { id: subGoal.id, index, goalId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SUBGOAL,
    hover(item: { id: string; index: number; goalId: string }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveSubGoal(goalId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [, dropTask] = useDrop({
    accept: ItemTypes.TASK,
    drop(item: { id: string; subGoalId: string }, monitor) {
      const task = tasks.find((t) => t.id === item.id);
      if (!task || task.sub_goal === subGoal.id) return;
      const updatedTask = { ...task, sub_goal_id: subGoal.id };
      updateTask(updatedTask);
    },
  });

  drag(drop(dropTask(ref)));

  return (
    <div
      ref={ref}
      className={`mb-2 rounded-lg ${isDragging ? "opacity-50" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center p-2 bg-muted/30">
          <div className="mr-2 cursor-move">
            <GripVertical className="text-muted-foreground" size={18} />
          </div>
          {isEditingTitle ? (
            <div className="flex items-center flex-1 gap-2">
              <Input
                value={subGoalTitle}
                onChange={(e) => setSubGoalTitle(e.target.value)}
                className="h-8"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveTitle} className="p-1 h-8 w-8">
                <Save size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSubGoalTitle(subGoal.name);
                  setIsEditingTitle(false);
                }}
                className="p-1 h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <>
              <CollapsibleTrigger className="flex items-center flex-1">
                {isOpen ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <span className="font-medium">{subGoal.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({filteredTasks.length} tasks)
                </span>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="p-1 h-8 w-8"
              >
                <Edit size={16} />
              </Button>
            </>
          )}
        </div>
        <CollapsibleContent>
          <div className="p-2">
            <ul className="divide-y">
              {filteredTasks.map((task, taskIndex) => (
                <TaskCardDraggable
                  key={task.id}
                  task={task}
                  index={taskIndex}
                  subGoalId={subGoal.id}
                  moveTask={moveTask}
                  toggleTaskStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  isEditing={editingTask?.id === task.id}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  updateTask={updateTask}
                />
              ))}
            </ul>
            {isAddingTask && (
              <AddTaskCard
                onClose={() => setIsAddingTask(false)}
                subGoalId={subGoal.id}
              />
            )}
            <Button
              variant="ghost"
              className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
              onClick={() => setIsAddingTask(true)}
            >
              <CirclePlus size={18} strokeWidth={1} />
              Add Task
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SubGoalItem;
