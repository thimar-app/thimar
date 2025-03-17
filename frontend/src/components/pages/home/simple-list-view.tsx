import { EditTaskCard } from "@/components/task/edit-task-card";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AddTaskCard } from "@/components/task/add-task-card";
import TaskCard from "@/components/task/task-card";

interface Task {
  id: string;
  name: string;
  description: string;
  date: Date;
  sub_goal_id: string | null;
  prayer_id: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: boolean;
  repeat: boolean;
}

interface SimpleListViewProps {
  showCompletedTasks: boolean;
  showGoals?: boolean;
  onEditTask?: (task: Task) => void;
}

const SimpleListView: React.FC<SimpleListViewProps> = ({
  showGoals = false,
  showCompletedTasks,
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

  // Filter tasks based on showCompletedTasks
  const filteredTasks = showCompletedTasks
    ? tasks
    : tasks.filter((task) => !task.status);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    if (onEditTask) {
      onEditTask(task);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full">
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
        {isAddingTask && <AddTaskCard onClose={() => setIsAddingTask(false)} />}

        <Button
          variant="ghost"
          className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
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
