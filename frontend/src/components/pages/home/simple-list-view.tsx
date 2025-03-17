import { EditTaskCard } from "@/components/task/edit-task-card";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AddTaskCard } from "@/components/task/add-task-card";
import TaskCard from "@/components/task/task-card";
import { Task } from "@/db/goals";

interface SimpleListViewProps {
  showCompletedTasks: boolean;
  showGoals?: boolean;
  todayTasks?: boolean;
  onEditTask?: (task: Task) => void;
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
}) => {
  const {
    tasks,
    moveTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    editingTask,
    setEditingTask,
  } = useTaskContext();

  const [isAddingTask, setIsAddingTask] = useState(false);

  // Apply filtering based on props
  const filteredTasks = tasks.filter((task) => {
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
      <div className="w-full ">
        {filteredTasks.length > 0 ? (
          <ul className="divide-y">
            {filteredTasks.map((task, index) =>
              editingTask?.id === task.id ? (
                <EditTaskCard
                  key={task.id}
                  task={editingTask}
                  onClose={() => setEditingTask(null)}
                  onSave={(updatedTask) => {
                    updateTask(updatedTask);
                    setEditingTask(null);
                  }}
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
          <div className="text-center text-muted-foreground">
            <p className="font-semibold">What do you need to get done today?</p>
            <p className="text-sm">
              By default, tasks added here will be scheduled for today.
            </p>
          </div>
        )}

        {isAddingTask && (
          <AddTaskCard subGoalId="" onClose={() => setIsAddingTask(false)} />
        )}

        <Button
          variant="ghost"
          className={`mt-2 px-3 gap-3 text-muted-foreground ${
            filteredTasks.length > 0 ? "justify-baseline" : "justify-center"
          } w-full cursor-pointer`}
          onClick={() => setIsAddingTask(true)}
        >
          <CirclePlus className="!size-5" strokeWidth={1} />
          Add Task
        </Button>
      </div>
    </DndProvider>
  );
};

export default SimpleListView;
