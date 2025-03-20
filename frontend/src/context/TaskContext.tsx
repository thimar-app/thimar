import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { calculateTaskProgress, TaskProgress } from "@/lib/utils";
import { Task } from "@/db/goals";
import {
  addTaskApi,
  fetchTasksApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/services/tasksApi";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  progress: TaskProgress;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  initialTasks?: Task[];
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  initialTasks = [],
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState<TaskProgress>({
    percentage: 0,
    formattedPercentage: "0%",
  });

  // Fetch tasks from backend on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Update progress whenever tasks change
  useEffect(() => {
    const newProgress = calculateTaskProgress(tasks);
    setProgress(newProgress);
  }, [tasks]);

  const addTask = async (task: Task) => {
    try {
      const savedTask = await addTaskApi(task);
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await updateTaskApi(task);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskApi(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const updatedTask = { ...task, status: !task.status };
      const savedTask = await updateTaskApi(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
      );
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTask,
        editingTask,
        setEditingTask,
        progress,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
