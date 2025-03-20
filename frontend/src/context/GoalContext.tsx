import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchGoalsApi,
  addGoalApi,
  updateGoalApi,
  deleteGoalApi,
  addSubGoalApi,
  updateSubGoalApi,
  deleteSubGoalApi,
} from "@/services/api";

// Interfaces matching your backend:
export interface SubGoal {
  id: string;
  name: string;
  goal: string; // goal id (snake_case from backend)
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  progress: number;
  sub_goals: SubGoal[];
}

interface GoalContextType {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  getGoalById: (id: string) => Goal | undefined;
  getGoalBySubGoalId: (subGoalId: string) => Goal | undefined;
  addGoal: (goal: any) => Promise<void>;
  updateGoal: (goal: any) => Promise<void>;
  calculateOverallProgress: () => number;
  deleteGoal: (id: string) => Promise<void>;
  addSubGoal: (subGoal: any) => Promise<void>;
  updateSubGoal: (subGoal: any) => Promise<void>;
  deleteSubGoal: (id: string) => Promise<void>;
  moveSubGoal: (goalId: string, fromIndex: number, toIndex: number) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = async () => {
    try {
      const data = await fetchGoalsApi();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const getGoalById = (id: string) => goals.find((goal) => goal.id === id);

  // New function to get goal by subgoal ID
  const getGoalBySubGoalId = (subGoalId: string) => {
    return goals.find((goal) =>
      goal.sub_goals.some((subGoal) => subGoal.id === subGoalId)
    );
  };

  const addGoal = async (goal: any) => {
    try {
      const newGoal = await addGoalApi(goal);
      setGoals((prev) => [...prev, newGoal]);
    } catch (error) {
      console.error("Error adding goal", error);
    }
  };

  const updateGoal = async (updatedGoal: any) => {
    try {
      const newGoal = await updateGoalApi(updatedGoal);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === newGoal.id ? newGoal : goal))
      );
    } catch (error) {
      console.error("Error updating goal", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await deleteGoalApi(goalId);
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal", error);
    }
  };

  const calculateOverallProgress = (): number => {
    if (goals.length === 0) return 0;
    const total = goals.reduce((acc, goal) => acc + goal.progress, 0);
    return total / goals.length;
  };

  const addSubGoal = async (subGoal: any) => {
    try {
      const newSubGoal = await addSubGoalApi(subGoal);
      setGoals((prev) =>
        prev.map((goal) => {
          if (goal.id === newSubGoal.goal) {
            return {
              ...goal,
              sub_goals: [...(goal.sub_goals || []), newSubGoal],
            };
          }
          return goal;
        })
      );
    } catch (error) {
      console.error("Error adding sub-goal", error);
    }
  };

  const updateSubGoal = async (updatedSubGoal: any) => {
    try {
      const newSubGoal = await updateSubGoalApi(updatedSubGoal);
      setGoals((prev) =>
        prev.map((goal) => {
          if (goal.id === newSubGoal.goal) {
            return {
              ...goal,
              sub_goals: goal.sub_goals.map((sg) =>
                sg.id === newSubGoal.id ? newSubGoal : sg
              ),
            };
          }
          return goal;
        })
      );
    } catch (error) {
      console.error("Error updating sub-goal", error);
    }
  };

  const deleteSubGoal = async (subGoalId: string) => {
    try {
      await deleteSubGoalApi(subGoalId);
      setGoals((prev) =>
        prev.map((goal) => ({
          ...goal,
          sub_goals: goal.sub_goals.filter((sg) => sg.id !== subGoalId),
        }))
      );
    } catch (error) {
      console.error("Error deleting sub-goal", error);
    }
  };

  // Move sub-goal ordering locally (for drag/drop UI)
  const moveSubGoal = (goalId: string, fromIndex: number, toIndex: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedSubGoals = Array.from(goal.sub_goals);
          const [moved] = updatedSubGoals.splice(fromIndex, 1);
          updatedSubGoals.splice(toIndex, 0, moved);
          return { ...goal, sub_goals: updatedSubGoals };
        }
        return goal;
      })
    );
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        fetchGoals,
        getGoalById,
        getGoalBySubGoalId,
        addGoal,
        updateGoal,
        deleteGoal,
        calculateOverallProgress,
        addSubGoal,
        updateSubGoal,
        deleteSubGoal,
        moveSubGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoalContext = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoalContext must be used within a GoalProvider");
  }
  return context;
};
