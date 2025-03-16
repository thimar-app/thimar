import { EditTaskCard } from "@/components/task/edit-task-card";
import TaskItem from "@/components/task/task-item";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

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
  onEditTask?: (task: Task) => void;
}

const SimpleListView: React.FC<SimpleListViewProps> = ({
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
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
                toggleTaskStatus={toggleTaskStatus}
                onDelete={deleteTask}
                onEdit={handleEditTask}
              />
            )
          )}
        </ul>
        <Button
          variant={"ghost"}
          className="mt-2 px-3 gap-3 text-muted-foreground w-full justify-baseline cursor-pointer"
        >
          <CirclePlus className="!size-5" strokeWidth={1} />
          <span className="">Add Task</span>
        </Button>
      </div>
    </DndProvider>
  );
};

export default SimpleListView;
