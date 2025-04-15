import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { calculateTaskProgress } from "@/lib/utils";
import { Task } from "@/lib/types";

interface TaskProgress {
  percentage: number;
  formattedPercentage: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
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

  // Update progress whenever tasks change
  useEffect(() => {
    const newProgress = calculateTaskProgress(tasks);
    setProgress(newProgress);
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  };

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const newTasks = [...tasks];
    const draggedTask = newTasks[dragIndex];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(newTasks);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    moveTask,
    editingTask,
    setEditingTask,
    progress,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
