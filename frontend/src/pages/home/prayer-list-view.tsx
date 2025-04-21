import React, { useState, useRef, useEffect } from "react";
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
import { useTaskContext } from "@/context/TaskContext";
import { checkPrayerTimesUpdate } from "@/services/prayersApi";
import { SimpleAddTaskCard } from "@/components/common/task/simple-add-task-card";

// Define TypeScript interfaces
interface Task {
  id: string;
  name: string;
  description: string;
  date: string;
  sub_goal: string;
  prayer: string | null;
  priority: string;
  status: boolean;
  repeat: boolean;
}

interface Prayer {
  id: string;
  name: string;
  time: string;
}

interface SubGoal {
  id: number;
  title: string;
  tasks: Task[];
  prayerId: string | null;
}

// DnD item type
const ItemTypes = {
  TASK: "task",
};

interface DragItem {
  type: string;
  taskId: string;
  subGoalId: number;
  index: number;
}

const PrayerListView: React.FC = () => {
  const { tasks, updateTask } = useTaskContext();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTaskCard, setShowAddTaskCard] = useState(false);
  const [selectedSubGoalId, setSelectedSubGoalId] = useState<number | null>(null);

  // State to track which subgoals are expanded
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  // Fetch prayer times
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setIsLoading(true);
        const data = await checkPrayerTimesUpdate();
        setPrayers(data);
      } catch (error) {
        console.error("Failed to fetch prayers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerTimes();
  }, []);

  // Create subgoals based on prayer times
  const createSubGoals = (): SubGoal[] => {
    if (!prayers.length) return [];

    // Sort prayers by time
    const sortedPrayers = [...prayers].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.time}`);
      const timeB = new Date(`1970-01-01T${b.time}`);
      return timeA.getTime() - timeB.getTime();
    });

    // Create subgoals for each prayer time period
    const subGoals: SubGoal[] = [];

    // Add subgoals between prayers
    for (let i = 0; i < sortedPrayers.length; i++) {
      const currentPrayer = sortedPrayers[i];
      const nextPrayer = sortedPrayers[(i + 1) % sortedPrayers.length];
      
      subGoals.push({
        id: i + 1,
        title: `${currentPrayer.name} - ${nextPrayer.name}`,
        tasks: [],
        prayerId: currentPrayer.id
      });
    }

    return subGoals;
  };

  // Get tasks for each subgoal
  const getTasksForSubGoal = (subGoal: SubGoal): Task[] => {
    return tasks.filter(task => {
      // If task has a prayer ID, it belongs to that prayer's subgoal
      if (task.prayer && subGoal.prayerId) {
        return task.prayer === subGoal.prayerId;
      }
      return false;
    });
  };

  // Initialize subgoals with tasks
  const [subGoals, setSubGoals] = useState<SubGoal[]>([]);

  // Update subgoals when prayers or tasks change
  useEffect(() => {
    const newSubGoals = createSubGoals();
    
    // Add tasks to each subgoal
    const subGoalsWithTasks = newSubGoals.map(subGoal => ({
      ...subGoal,
      tasks: getTasksForSubGoal(subGoal)
    }));
    
    setSubGoals(subGoalsWithTasks);
  }, [prayers, tasks]);

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
    const completedTasks = tasks.filter((task) => task.status).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: !task.status };
      updateTask(updatedTask);
    }
  };

  // Move task between or within subgoals
  const moveTask = (
    taskId: string,
    targetSubGoalId: number
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const targetSubGoal = subGoals.find(sg => sg.id === targetSubGoalId);
    if (!targetSubGoal) return;

    const updatedTask = { 
      ...task, 
      prayer: targetSubGoal.prayerId || null 
    };
    
    updateTask(updatedTask);
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
        moveTask(item.taskId, item.subGoalId);

        // Update the index for the dragged item
        item.index = hoverIndex;
        item.subGoalId = subGoalId;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    });

    // Connect the drag and drop refs to our li ref
    const connectRef = (element: HTMLLIElement | null) => {
      dragRef(element);
      dropRef(element);
    };

    return (
      <li
        ref={connectRef}
        className={`relative flex group items-center w-full border-b gap-2 sm:gap-3 pl-2 sm:pl-3 py-2 ${
          isDragging
            ? "opacity-50"
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
          <GripVertical className="h-4 w-4" />
        </Button>

        <Checkbox
          className="rounded-[8px] size-4 sm:size-5 border-muted-foreground cursor-pointer"
          id={`task-${task.id}`}
          checked={task.status}
          onCheckedChange={() => toggleCompletion()}
        />

        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <label
            htmlFor={`task-${task.id}`}
            className={`text-sm sm:text-base truncate ${
              task.status ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.name}
          </label>
          {task.description && (
            <span className="text-xs text-muted-foreground truncate">
              {task.description}
            </span>
          )}
        </div>

        <div className="ml-auto gap-1 items-center group-hover:flex hidden">
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-neutral-200 size-6 sm:size-7 text-muted-foreground"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-neutral-200 size-6 sm:size-7 text-muted-foreground"
          >
            <X className="h-4 w-4" />
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
          moveTask(item.taskId, subGoal.id);
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
        className={`${isOver ? "border-blue-500 border" : ""}`}
      >
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-3 sm:p-4 pl-2 sm:pl-2 cursor-pointer">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <h3 className="font-medium text-sm sm:text-base">{subGoal.title}</h3>
              </div>

              {/* Progress Circle */}
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
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
                <span className="absolute inset-0 flex items-center justify-center text-[8px] sm:text-[10px] font-medium">
                  {calculateProgress(subGoal.tasks)}
                </span>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent
              ref={contentRef}
              className={`pl-2 sm:pl-3 ml-4 border-l-2 ${isOver ? "bg-card" : ""}`}
            >
              {subGoal.tasks.length > 0 ? (
                <ul>
                  {subGoal.tasks.map((task, index) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      subGoalId={subGoal.id}
                      index={index}
                      toggleCompletion={() => toggleTaskCompletion(task.id)}
                    />
                  ))}

                  {showAddTaskCard && selectedSubGoalId === subGoal.id ? (
                    <SimpleAddTaskCard
                      subGoalId={selectedSubGoalId.toString()}
                      onClose={() => {
                        setShowAddTaskCard(false);
                        setSelectedSubGoalId(null);
                      }}
                      onSave={() => {
                        setShowAddTaskCard(false);
                        fetchTasks();
                      }}
                    />
                  ) : (
                    <Button
                      onClick={() => {
                        setShowAddTaskCard(true);
                        setSelectedSubGoalId(subGoal.id);
                      }}
                      variant="ghost"
                      className="mt-2 px-3 gap-2 sm:gap-3 text-muted-foreground w-full justify-start cursor-pointer"
                    >
                      <CirclePlus className="!size-4 sm:!size-5" strokeWidth={1} />
                      <span className="text-sm">Add Task</span>
                    </Button>
                  )}
                </ul>
              ) : (
                <div className="py-4">
                  <p className="text-gray-500 text-xs sm:text-sm italic py-2">
                    Drop tasks here
                  </p>
                  <Button
                    onClick={() => {
                      setShowAddTaskCard(true);
                      setSelectedSubGoalId(subGoal.id);
                    }}
                    variant="ghost"
                    className="mt-2 px-3 gap-2 sm:gap-3 text-muted-foreground w-full justify-start cursor-pointer"
                  >
                    <CirclePlus className="!size-4 sm:!size-5" strokeWidth={1} />
                    <span className="text-sm">Add Task</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?subGoalId=${selectedSubGoalId}`);
      if (response.ok) {
        const data = await response.json();
        updateTask(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2 sm:space-y-4">
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
