import { EditTaskCard } from "@/components/common/task/edit-task-card";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AddTaskCard } from "@/components/common/task/add-task-card";
import TaskCard from "@/components/common/task/task-card";
import { Task } from "@/lib/types";

interface SimpleListViewProps {
  showCompletedTasks: boolean;
  showGoals?: boolean;
  todayTasks?: boolean;
  onEditTask?: (task: Task) => void;
  tasks?: Task[];
}

// Utility function to check if a date is today (ignores time)
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const SimpleListView: React.FC<SimpleListViewProps> = ({
  showGoals = false,
  showCompletedTasks,
  todayTasks = false,
  onEditTask,
  tasks: propTasks,
}) => {
  const {
    tasks: contextTasks,
    moveTask,
    toggleTaskStatus,
    deleteTask,
    editingTask,
    setEditingTask,
  } = useTaskContext();

  const [isAddingTask, setIsAddingTask] = useState(false);

  // Use propTasks if provided, otherwise use contextTasks
  const tasksToUse = propTasks || contextTasks;

  // Apply filtering based on props
  const filteredTasks = tasksToUse.filter((task) => {
    const isTaskToday = isToday(new Date(task.date));
    const isTaskCompleted = task.status; // true means completed

    if (todayTasks) {
      return isTaskToday && (showCompletedTasks || !isTaskCompleted);
    }
    return showCompletedTasks || !isTaskCompleted;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    if (onEditTask) {
      onEditTask(task);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-2 sm:p-4">
        {filteredTasks.length > 0 ? (
          <ul className="divide-y space-y-2 sm:space-y-4">
            {filteredTasks.map((task, index) =>
              editingTask?.id === task.id ? (
                <EditTaskCard
                  key={task.id}
                  task={editingTask}
                  onClose={() => setEditingTask(null)}
                />
              ) : (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  moveTask={moveTask}
                  toggleTaskStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  showGoals={showGoals}
                />
              )
            )}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-4 sm:py-6">
            {todayTasks ? (
              <div className="space-y-2 sm:space-y-3">
                <p className="font-semibold text-base sm:text-lg">
                  What do you need to get done today?
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  By default, tasks added here will be scheduled for today.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-base sm:text-lg">
                  What do you need to get done?
                </p>
              </div>
            )}
          </div>
        )}
        {isAddingTask && (
          <AddTaskCard
            todayTask={todayTasks}
            subGoalId=""
            onClose={() => setIsAddingTask(false)}
          />
        )}
        <Button
          variant="ghost"
          className={`mt-4 sm:mt-6 px-3 gap-2 sm:gap-3 text-muted-foreground ${
            filteredTasks.length > 0 ? "justify-start" : "justify-center"
          } w-full cursor-pointer`}
          onClick={() => setIsAddingTask(true)}
        >
          <CirclePlus className="size-4 sm:size-5" strokeWidth={1} />
          <span className="text-sm sm:text-base">Add Task</span>
        </Button>
      </div>
    </DndProvider>
  );
};

export default SimpleListView;
