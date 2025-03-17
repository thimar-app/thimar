import React, { createContext, useState, useContext, ReactNode } from "react";
import { Task } from "@/context/TaskContext";

export interface SubGoal {
  id: string;
  name: string;
  goal_id: string;
  tasks: Task[];
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  image: string;
  progress: number;
  user_id: string;
  subGoals: SubGoal[];
}

interface GoalProgress {
  percentage: number;
  formattedPercentage: string;
}

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addSubGoal: (subGoal: SubGoal) => void;
  updateSubGoal: (subGoal: SubGoal) => void;
  deleteSubGoal: (id: string) => void;
  moveGoal: (dragIndex: number, hoverIndex: number) => void;
  moveSubGoal: (goalId: string, dragIndex: number, hoverIndex: number) => void;
  editingGoal: Goal | null;
  setEditingGoal: (goal: Goal | null) => void;
  editingSubGoal: SubGoal | null;
  setEditingSubGoal: (subGoal: SubGoal | null) => void;
  calculateOverallProgress: () => GoalProgress;
  getGoalById: (id: string) => Goal | undefined;
  getSubGoalById: (id: string) => SubGoal | undefined;
  getSubGoalsByGoalId: (goalId: string) => SubGoal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

interface GoalProviderProps {
  initialGoals?: Goal[];
  children: ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({
  initialGoals = [],
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingSubGoal, setEditingSubGoal] = useState<SubGoal | null>(null);

  const addGoal = (goal: Goal) => {
    setGoals((prevGoals) => [...prevGoals, goal]);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  const addSubGoal = (subGoal: SubGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === subGoal.goal_id
          ? { ...goal, subGoals: [...goal.subGoals, subGoal] }
          : goal
      )
    );
  };

  const updateSubGoal = (updatedSubGoal: SubGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === updatedSubGoal.goal_id) {
          const updatedSubGoals = goal.subGoals.map((subGoal) =>
            subGoal.id === updatedSubGoal.id ? updatedSubGoal : subGoal
          );
          return { ...goal, subGoals: updatedSubGoals };
        }
        return goal;
      })
    );
  };

  const deleteSubGoal = (id: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => ({
        ...goal,
        subGoals: goal.subGoals.filter((subGoal) => subGoal.id !== id),
      }))
    );
  };

  const moveGoal = (dragIndex: number, hoverIndex: number) => {
    const newGoals = [...goals];
    const draggedGoal = newGoals[dragIndex];
    newGoals.splice(dragIndex, 1);
    newGoals.splice(hoverIndex, 0, draggedGoal);
    setGoals(newGoals);
  };

  const moveSubGoal = (
    goalId: string,
    dragIndex: number,
    hoverIndex: number
  ) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newSubGoals = [...goal.subGoals];
          const draggedSubGoal = newSubGoals[dragIndex];
          newSubGoals.splice(dragIndex, 1);
          newSubGoals.splice(hoverIndex, 0, draggedSubGoal);
          return { ...goal, subGoals: newSubGoals };
        }
        return goal;
      })
    );
  };

  const calculateOverallProgress = (): GoalProgress => {
    if (goals.length === 0) {
      return { percentage: 0, formattedPercentage: "0%" };
    }

    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    const percentage = totalProgress / goals.length;
    const formattedPercentage = `${Math.round(percentage)}%`;

    return { percentage, formattedPercentage };
  };

  const getGoalById = (id: string): Goal | undefined => {
    return goals.find((goal) => goal.id === id);
  };

  const getSubGoalById = (id: string): SubGoal | undefined => {
    for (const goal of goals) {
      const subGoal = goal.subGoals.find((subGoal) => subGoal.id === id);
      if (subGoal) return subGoal;
    }
    return undefined;
  };

  const getSubGoalsByGoalId = (goalId: string): SubGoal[] => {
    const goal = goals.find((g) => g.id === goalId);
    return goal ? goal.subGoals : [];
  };

  const value = {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addSubGoal,
    updateSubGoal,
    deleteSubGoal,
    moveGoal,
    moveSubGoal,
    editingGoal,
    setEditingGoal,
    editingSubGoal,
    setEditingSubGoal,
    calculateOverallProgress,
    getGoalById,
    getSubGoalById,
    getSubGoalsByGoalId,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoalContext = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoalContext must be used within a GoalProvider");
  }
  return context;
};
