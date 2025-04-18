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
import { AddTaskCard } from "@/components/common/task/add-task-card";
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  GripVertical,
  Save,
  X,
  PenLine,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ItemTypes } from "./item-types";
import TaskCardDraggable from "@/components/common/task/task-card-draggable";
import { GoalAddTaskCard } from "@/components/common/task/goal-add-task-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

  const { moveSubGoal, updateSubGoal, deleteSubGoal } = useGoalContext();
  const {
    tasks,
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

  const handleSaveTitle = async () => {
    try {
      const updatedSubGoal = { ...subGoal, name: subGoalTitle };
      await updateSubGoal(updatedSubGoal);
      setIsEditingTitle(false);
      // No need to refresh data, Supabase Realtime will handle it
    } catch (error) {
      console.error("Error updating sub-goal title:", error);
    }
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
    drop(item: { id: string; subGoalId: string }) {
      const task = tasks.find((t) => t.id === item.id);
      if (!task || task.sub_goal === subGoal.id) return;
      const updatedTask = { ...task, sub_goal_id: subGoal.id };
      updateTask(updatedTask);
    },
  });

  drag(drop(dropTask(ref)));

  const handleDeleteSubGoal = async () => {
    try {
      await deleteSubGoal(subGoal.id);
      toast.success("Sub-goal deleted successfully");
      // No need to refresh data, Supabase Realtime will handle it
    } catch (error) {
      console.error("Error deleting sub-goal:", error);
      toast.error("Failed to delete sub-goal");
    }
  };

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
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveTitle}
                className="p-1 h-8 w-8"
              >
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
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Sub-Goal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{subGoal.name}"? This action cannot be undone.
                        {filteredTasks.length > 0 && (
                          <span className="block mt-2 text-destructive">
                            Warning: This sub-goal contains {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteSubGoal}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
        <CollapsibleContent className="ml-3.5">
          <div className="p-2 pt-0 pl-4 border-l-2 ">
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
              <GoalAddTaskCard
                onClose={() => setIsAddingTask(false)}
                subGoalId={subGoal.id}
              />
            )}
            <Button
              variant="ghost"
              className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
              onClick={() => setIsAddingTask(true)}
            >
              <CirclePlus className="size-5" strokeWidth={1} />
              Add Task
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SubGoalItem;
