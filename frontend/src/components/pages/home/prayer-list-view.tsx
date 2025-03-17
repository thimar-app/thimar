import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  GripVertical,
  PenLine,
  X,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { AddTaskCard } from "@/components/task/add-task-card";

// Define TypeScript interfaces
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface SubGoal {
  id: number;
  title: string;
  tasks: Task[];
}

// DnD item type
const ItemTypes = {
  TASK: "task",
};

interface DragItem {
  type: string;
  taskId: number;
  subGoalId: number;
  index: number;
}

const PrayerListView: React.FC = () => {
  // Sample data - replace with your actual data
  const [subGoals, setSubGoals] = useState<SubGoal[]>([
    {
      id: 0,
      title: "Before Fajr",
      tasks: [
        { id: 101, title: "Install dependencies", completed: true },
        {
          id: 102,
          title: "Configure development environment",
          completed: true,
        },
        { id: 103, title: "Set up version control", completed: false },
      ],
    },
    {
      id: 1,
      title: "Fajr - Dhuhr",
      tasks: [
        { id: 101, title: "Install dependencies", completed: true },
        {
          id: 102,
          title: "Configure development environment",
          completed: true,
        },
        { id: 103, title: "Set up version control", completed: false },
      ],
    },
    {
      id: 2,
      title: "Dhuhr - Asr",
      tasks: [
        { id: 201, title: "Create wireframes", completed: true },
        { id: 202, title: "Design component library", completed: false },
        { id: 203, title: "Get design approval", completed: false },
        { id: 204, title: "Implement responsive design", completed: false },
      ],
    },
    {
      id: 3,
      title: "Asr - Maghreb",
      tasks: [
        { id: 301, title: "Create user authentication", completed: false },
        { id: 302, title: "Build dashboard", completed: false },
        { id: 303, title: "Implement CRUD operations", completed: false },
      ],
    },
    {
      id: 4,
      title: "Maghreb - Isha",
      tasks: [
        { id: 301, title: "Create user authentication", completed: false },
        { id: 302, title: "Build dashboard", completed: false },
        { id: 303, title: "Implement CRUD operations", completed: false },
      ],
    },
    {
      id: 5,
      title: "After Isha",
      tasks: [
        { id: 301, title: "Create user authentication", completed: false },
        { id: 302, title: "Build dashboard", completed: false },
        { id: 303, title: "Implement CRUD operations", completed: false },
      ],
    },
  ]);

  const [showAddTaskCard, setShowAddTaskCard] = useState(false);

  // State to track which subgoals are expanded
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  // Toggle expansion state of a subgoal
  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate progress percentage for a subgoal
  const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Toggle task completion status
  const toggleTaskCompletion = (subGoalId: number, taskId: number) => {
    setSubGoals((prevSubGoals) =>
      prevSubGoals.map((subGoal) =>
        subGoal.id === subGoalId
          ? {
              ...subGoal,
              tasks: subGoal.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : subGoal
      )
    );
  };

  // Move task between or within subgoals
  const moveTask = (
    taskId: number,
    sourceSubGoalId: number,
    targetSubGoalId: number,
    sourceIndex?: number,
    targetIndex?: number
  ) => {
    setSubGoals((prevSubGoals) => {
      // Find the source and target subgoals
      const sourceSubGoal = prevSubGoals.find(
        (sg) => sg.id === sourceSubGoalId
      );
      const targetSubGoal = prevSubGoals.find(
        (sg) => sg.id === targetSubGoalId
      );

      if (!sourceSubGoal || !targetSubGoal) return prevSubGoals;

      // Find the task to move
      const taskToMove = sourceSubGoal.tasks.find((t) => t.id === taskId);
      if (!taskToMove) return prevSubGoals;

      // If moving within the same subgoal and we have indices
      if (
        sourceSubGoalId === targetSubGoalId &&
        sourceIndex !== undefined &&
        targetIndex !== undefined
      ) {
        // Create a new array of tasks with the moved task
        const newTasks = [...sourceSubGoal.tasks];
        newTasks.splice(sourceIndex, 1); // Remove from source position
        newTasks.splice(targetIndex, 0, taskToMove); // Insert at target position

        // Return updated subgoals
        return prevSubGoals.map((subGoal) =>
          subGoal.id === sourceSubGoalId
            ? { ...subGoal, tasks: newTasks }
            : subGoal
        );
      }
      // If moving between different subgoals
      else if (sourceSubGoalId !== targetSubGoalId) {
        return prevSubGoals.map((subGoal) => {
          if (subGoal.id === sourceSubGoalId) {
            return {
              ...subGoal,
              tasks: subGoal.tasks.filter((t) => t.id !== taskId),
            };
          } else if (subGoal.id === targetSubGoalId) {
            // If we have a targetIndex, insert at that position
            if (targetIndex !== undefined) {
              const newTasks = [...subGoal.tasks];
              newTasks.splice(targetIndex, 0, taskToMove);
              return { ...subGoal, tasks: newTasks };
            }
            // Otherwise just append to the end
            else {
              return {
                ...subGoal,
                tasks: [...subGoal.tasks, taskToMove],
              };
            }
          }
          return subGoal;
        });
      }

      return prevSubGoals;
    });
  };

  // Individual Task component with drag capability
  const DraggableTask: React.FC<{
    task: Task;
    subGoalId: number;
    index: number;
    toggleCompletion: () => void;
  }> = ({ task, subGoalId, index, toggleCompletion }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: ItemTypes.TASK,
      item: {
        type: ItemTypes.TASK,
        taskId: task.id,
        subGoalId,
        index,
      } as DragItem,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [{ isOver }, dropRef] = useDrop({
      accept: ItemTypes.TASK,
      hover: (item: DragItem, monitor) => {
        if (!monitor.isOver({ shallow: true })) return;

        const dragIndex = item.index;
        const hoverIndex = index;
        const dragSubGoalId = item.subGoalId;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex && dragSubGoalId === subGoalId) {
          return;
        }

        // Time to actually perform the action
        moveTask(item.taskId, item.subGoalId, subGoalId, dragIndex, hoverIndex);

        // Update the index for the dragged item
        item.index = hoverIndex;
        item.subGoalId = subGoalId;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    });

    // Create a ref for the li element
    const liRef = useRef<HTMLLIElement>(null);

    // Connect the drag and drop refs to our li ref
    const connectRef = (element: HTMLLIElement | null) => {
      dragRef(element);
      dropRef(element);
    };

    return (
      <li
        ref={connectRef}
        className={`relative flex group items-center w-full border-b gap-3 pl-3 py-2 ${
          isDragging
            ? "opacity-50 "
            : isOver
            ? "bg-sidebar-accent border-violet-600"
            : ""
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-neutral-200 py-1 rounded absolute cursor-move -left-2 top-[calc(50%-12px)] group-hover:block hidden h-6 w-min text-muted-foreground"
        >
          <GripVertical />
        </Button>

        <Checkbox
          className="rounded-[8px] size-5 border-muted-foreground cursor-pointer"
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleCompletion()}
        />

        <div className="flex flex-col gap-0.5">
          <label
            htmlFor={`task-${task.id}`}
            className={
              task.completed ? "line-through text-muted-foreground" : ""
            }
          >
            {task.title}
          </label>
        </div>

        <div className="ml-auto gap-1 items-center group-hover:flex hidden">
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-neutral-200 size-6 text-muted-foreground"
          >
            <PenLine />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-neutral-200 size-6 text-muted-foreground"
          >
            <X />
          </Button>
        </div>
      </li>
    );
  };

  // SubGoal component with drop capability
  const DroppableSubGoal: React.FC<{
    subGoal: SubGoal;
    isOpen: boolean;
    onToggle: () => void;
  }> = ({ subGoal, isOpen, onToggle }) => {
    const [{ isOver }, dropRef] = useDrop({
      accept: ItemTypes.TASK,
      drop: (item: DragItem, monitor) => {
        // Don't do anything if the item is dropped on a task in this subgoal
        if (monitor.didDrop()) {
          return;
        }

        // If dropping on the container itself (not a task), append to end
        if (item.subGoalId !== subGoal.id || item.index === undefined) {
          moveTask(item.taskId, item.subGoalId, subGoal.id);
        }
      },
      collect: (monitor) => ({
        isOver:
          !!monitor.isOver({ shallow: true }) &&
          !monitor.isOver({ shallow: false }),
      }),
    });

    // Create a ref for the CardContent element
    const contentRef = useRef<HTMLDivElement>(null);

    // Connect the drop ref to our content ref
    dropRef(contentRef);

    return (
      <div
        key={subGoal.id}
        className={` ${isOver ? "border-blue-500 border" : ""}`}
      >
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 pl-2 cursor-pointer">
              <div className="flex items-center space-x-3">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-medium">{subGoal.title}</h3>
              </div>

              {/* Progress Circle */}
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                <svg className="absolute inset-0" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${
                      (2 * Math.PI * 14 * calculateProgress(subGoal.tasks)) /
                      100
                    } ${2 * Math.PI * 14}`}
                    strokeLinecap="round"
                    transform="rotate(-90 16 16)"
                    className="text-violet-600"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                  {calculateProgress(subGoal.tasks)}
                </span>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent
              ref={contentRef}
              className={`pl-3 ml-4 border-l-2 ${isOver ? "bg-card" : ""}`}
            >
              {subGoal.tasks.length > 0 ? (
                <ul>
                  {subGoal.tasks.map((task, index) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      subGoalId={subGoal.id}
                      index={index}
                      toggleCompletion={() =>
                        toggleTaskCompletion(subGoal.id, task.id)
                      }
                    />
                  ))}
                  {/* <TaskCard
                    isCompleted
                    description="afasd"
                    task="get my things done"
                  /> */}

                  {showAddTaskCard ? (
                    <AddTaskCard subGoalId="" onClose={() => {}} />
                  ) : (
                    <Button
                      onClick={() => setShowAddTaskCard(true)}
                      variant={"ghost"}
                      className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
                    >
                      <CirclePlus className="!size-5" strokeWidth={1} />
                      <span className="">Add Task</span>
                    </Button>
                  )}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic py-2">
                  Drop tasks here
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {subGoals.map((subGoal) => (
          <DroppableSubGoal
            key={subGoal.id}
            subGoal={subGoal}
            isOpen={!!openItems[subGoal.id]}
            onToggle={() => toggleItem(subGoal.id)}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default PrayerListView;
