import { Task } from "@/context/TaskContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTaskProgress = (tasks: Task[]) => {
  if (!tasks || tasks.length === 0) {
    return { percentage: 0, formattedPercentage: "0%" };
  }

  const completedTasks = tasks.filter((task) => task.status).length;
  const totalTasks = tasks.length;

  const percentage = (completedTasks / totalTasks) * 100;
  const roundedPercentage = Math.round(percentage);

  return {
    percentage,
    formattedPercentage: `${roundedPercentage}%`,
  };
};
