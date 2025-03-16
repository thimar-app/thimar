import { Task } from "@/context/TaskContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Goal, SubGoal } from "@/context/GoalContext";

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

interface Progress {
  percentage: number;
  formattedPercentage: string;
}

/**
 * Calculates the progress of a goal based on the completion status of all tasks in all subgoals
 */
export const calculateGoalProgress = (goal: Goal): Progress => {
  // Flatten all tasks from all subgoals
  const allTasks: Task[] = goal.subGoals.flatMap((subGoal) => subGoal.tasks);

  // Use the existing task progress function to calculate overall goal progress
  return calculateTaskProgress(allTasks);
};

/**
 * Calculates the progress of a specific subgoal based on its tasks
 */
export const calculateSubGoalProgress = (subGoal: SubGoal): Progress => {
  return calculateTaskProgress(subGoal.tasks);
};
