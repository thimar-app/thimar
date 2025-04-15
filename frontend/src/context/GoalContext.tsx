import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchGoalsApi,
  fetchGoalByIdApi,
  addGoalApi,
  updateGoalApi,
  deleteGoalApi,
  addSubGoalApi,
  updateSubGoalApi,
  deleteSubGoalApi,
} from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

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
  image_url?: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
  progress: number;
  sub_goals: SubGoal[];
}

interface GoalContextType {
  goals: Goal[];
  currentGoal: Goal | null;
  setCurrentGoal: (goal: Goal | null) => void;
  loading: boolean;
  error: string | null;
  addGoal: (goal: FormData | any) => Promise<void>;
  updateGoal: (goal: any) => Promise<void>;
  calculateOverallProgress: (goals: Goal[]) => number;
  deleteGoal: (id: string) => Promise<void>;
  addSubGoal: (subGoal: any) => Promise<void>;
  updateSubGoal: (subGoal: any) => Promise<void>;
  deleteSubGoal: (id: string) => Promise<void>;
  moveSubGoal: (goalId: string, fromIndex: number, toIndex: number) => void;
  // Legacy methods for backward compatibility
  getGoalById: (id: string) => Goal | undefined;
  getGoalBySubGoalId: (subGoalId: string) => Goal | undefined;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const queryClient = useQueryClient();

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchGoals = useCallback(async (forceRefresh = false, page = 1, pageSize = 8) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`GoalContext: Fetching goals for page ${page} with pageSize ${pageSize}`);
      const data = await fetchGoalsApi(forceRefresh, page, pageSize);
      
      console.log(`GoalContext: Received data:`, data);
      
      // Handle paginated response
      if (data.results) {
        console.log(`GoalContext: Setting paginated data with ${data.results.length} results and count ${data.count}`);
        setGoals(data.results);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(data.count / pageSize),
          totalItems: data.count,
          hasNextPage: !!data.next,
          hasPreviousPage: !!data.previous,
        });
      } else {
        // Handle non-paginated response (backward compatibility)
        console.log(`GoalContext: Setting non-paginated data with ${data.length} items`);
        setGoals(data);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: data.length,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    } catch (err) {
      console.error(`GoalContext: Error fetching goals:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch goals");
      // Set default pagination on error to prevent UI issues
      setPagination({
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGoalById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGoalByIdApi(id);
      setCurrentGoal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch goal");
    } finally {
      setLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (goal: FormData | any) => {
    try {
      setLoading(true);
      setError(null);
      const newGoal = await addGoalApi(goal, null, goal instanceof FormData ? goal : new FormData(), "", "");
      
      // Invalidate the goals query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  const updateGoal = useCallback(async (goal: any) => {
    // Store the original goal for rollback if needed
    const originalGoal = goals.find(g => g.id === goal.id);
    
    try {
      setLoading(true);
      setError(null);
      
      // Optimistically update the UI
      setGoals(prevGoals => 
        prevGoals.map(g => {
          if (g.id === goal.id) {
            return {
              ...g,
              ...goal,
            };
          }
          return g;
        })
      );
      
      // If we have a currentGoal, update it as well
      if (currentGoal && currentGoal.id === goal.id) {
        setCurrentGoal(prevGoal => {
          if (!prevGoal) return null;
          return {
            ...prevGoal,
            ...goal,
          };
        });
      }
      
      // Make the API call
      const updatedGoal = await updateGoalApi(goal);
      
      // Update the UI with the real data from the server
      setGoals(prevGoals => 
        prevGoals.map(g => {
          if (g.id === goal.id) {
            return updatedGoal;
          }
          return g;
        })
      );
      
      // Update currentGoal if needed
      if (currentGoal && currentGoal.id === goal.id) {
        setCurrentGoal(updatedGoal);
      }
      
      // Invalidate the goals query to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      return updatedGoal;
    } catch (err) {
      console.error('GoalContext: Error updating goal:', err);
      
      // Revert the optimistic update on error
      if (originalGoal) {
        setGoals(prevGoals => 
          prevGoals.map(g => {
            if (g.id === goal.id) {
              return originalGoal;
            }
            return g;
          })
        );
        
        // Revert currentGoal if needed
        if (currentGoal && currentGoal.id === goal.id) {
          setCurrentGoal(originalGoal);
        }
      }
      
      setError(err instanceof Error ? err.message : "Failed to update goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient, currentGoal, goals]);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteGoalApi(id);
      
      // Invalidate the goals query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      if (currentGoal?.id === id) {
        setCurrentGoal(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentGoal, queryClient]);

  const calculateOverallProgress = (goals: Goal[]): number => {
    if (goals.length === 0) return 0;
    const total = goals.reduce((acc, goal) => acc + goal.progress, 0);
    return total / goals.length;
  };

  const addSubGoal = useCallback(async (subGoal: any) => {
    try {
      setLoading(true);
      setError(null);
      console.log('GoalContext: Adding subgoal:', subGoal);
      
      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      
      // Create a temporary subgoal object for optimistic update
      const tempSubGoal = {
        id: tempId,
        name: subGoal.name,
        goal: subGoal.goal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Optimistically update the UI
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === subGoal.goal) {
            return {
              ...goal,
              sub_goals: [...goal.sub_goals, tempSubGoal],
            };
          }
          return goal;
        })
      );
      
      // If we have a currentGoal, update it as well
      if (currentGoal && currentGoal.id === subGoal.goal) {
        setCurrentGoal(prevGoal => {
          if (!prevGoal) return null;
          return {
            ...prevGoal,
            sub_goals: [...prevGoal.sub_goals, tempSubGoal],
          };
        });
      }
      
      // Make the API call
      const newSubGoal = await addSubGoalApi(subGoal);
      console.log('GoalContext: Subgoal added successfully:', newSubGoal);
      
      // Update the UI with the real data from the server
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === subGoal.goal) {
            return {
              ...goal,
              sub_goals: goal.sub_goals.map(sg => 
                sg.id === tempId ? newSubGoal : sg
              ),
            };
          }
          return goal;
        })
      );
      
      // Update currentGoal if needed
      if (currentGoal && currentGoal.id === subGoal.goal) {
        setCurrentGoal(prevGoal => {
          if (!prevGoal) return null;
          return {
            ...prevGoal,
            sub_goals: prevGoal.sub_goals.map(sg => 
              sg.id === tempId ? newSubGoal : sg
            ),
          };
        });
      }
      
      // Invalidate the goals query to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      return newSubGoal;
    } catch (err) {
      console.error('GoalContext: Error adding subgoal:', err);
      
      // Revert the optimistic update on error
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === subGoal.goal) {
            return {
              ...goal,
              sub_goals: goal.sub_goals.filter(sg => !sg.id.startsWith('temp-')),
            };
          }
          return goal;
        })
      );
      
      // Revert currentGoal if needed
      if (currentGoal && currentGoal.id === subGoal.goal) {
        setCurrentGoal(prevGoal => {
          if (!prevGoal) return null;
          return {
            ...prevGoal,
            sub_goals: prevGoal.sub_goals.filter(sg => !sg.id.startsWith('temp-')),
          };
        });
      }
      
      setError(err instanceof Error ? err.message : "Failed to add sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient, currentGoal]);

  const updateSubGoal = useCallback(async (subGoal: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSubGoal = await updateSubGoalApi(subGoal);
      
      // Invalidate the goals query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      return updatedSubGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  const deleteSubGoal = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteSubGoalApi(id);
      
      // Invalidate the goals query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

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

  // Legacy methods for backward compatibility
  const getGoalById = useCallback((id: string) => {
    return goals.find((goal) => goal.id === id);
  }, [goals]);

  const getGoalBySubGoalId = useCallback((subGoalId: string) => {
    return goals.find((goal) =>
      goal.sub_goals.some((subGoal) => subGoal.id === subGoalId)
    );
  }, [goals]);

  // Initial data fetch
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const value = {
    goals,
    currentGoal,
    setCurrentGoal,
    loading,
    error,
    addGoal,
    updateGoal,
    calculateOverallProgress,
    deleteGoal,
    addSubGoal,
    updateSubGoal,
    deleteSubGoal,
    moveSubGoal,
    getGoalById,
    getGoalBySubGoalId,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

// New hook name
export const useGoal = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoal must be used within a GoalProvider");
  }
  return context;
};

// Legacy hook name for backward compatibility
export const useGoalContext = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoalContext must be used within a GoalProvider");
  }
  return context;
};
