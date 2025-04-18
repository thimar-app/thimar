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
import { subscribeToGoals, subscribeToSubGoals } from "../services/supabaseRealtime";

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
  refreshGoals: () => Promise<void>;
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
      const newGoal = await addGoalApi(goal, new FormData(), "", "");
      
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

  // Handle real-time goal updates
  const handleGoalUpdate = useCallback((updatedGoal: Goal) => {
    console.log('GoalContext: Received real-time goal update:', updatedGoal);
    
    // Update the goals list
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
    
    // Update currentGoal if it's the one being updated
    if (currentGoal && currentGoal.id === updatedGoal.id) {
      setCurrentGoal(updatedGoal);
    }
  }, [currentGoal]);

  // Handle real-time sub-goal updates
  const handleSubGoalUpdate = useCallback((updatedSubGoal: SubGoal) => {
    console.log('GoalContext: Received real-time sub-goal update:', updatedSubGoal);
    
    // Update the goals list
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.sub_goals.some(sg => sg.id === updatedSubGoal.id)) {
          return {
            ...goal,
            sub_goals: goal.sub_goals.map(sg => 
              sg.id === updatedSubGoal.id ? updatedSubGoal : sg
            )
          };
        }
        return goal;
      })
    );
    
    // Update currentGoal if it contains the updated sub-goal
    if (currentGoal && currentGoal.sub_goals.some(sg => sg.id === updatedSubGoal.id)) {
      setCurrentGoal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sub_goals: prev.sub_goals.map(sg => 
            sg.id === updatedSubGoal.id ? updatedSubGoal : sg
          )
        };
      });
    }
  }, [currentGoal]);

  // Set up Supabase Realtime subscriptions
  useEffect(() => {
    console.log('GoalContext: Setting up Supabase Realtime subscriptions');
    
    // Subscribe to goal updates
    const unsubscribeGoals = subscribeToGoals(handleGoalUpdate);
    
    // Subscribe to sub-goal updates
    const unsubscribeSubGoals = subscribeToSubGoals(handleSubGoalUpdate);
    
    // Clean up subscriptions on unmount
    return () => {
      console.log('GoalContext: Cleaning up Supabase Realtime subscriptions');
      unsubscribeGoals();
      unsubscribeSubGoals();
    };
  }, [handleGoalUpdate, handleSubGoalUpdate]);

  const addSubGoal = useCallback(async (subGoal: any) => {
    try {
      setLoading(true);
      setError(null);
      const newSubGoal = await addSubGoalApi(subGoal);
      
      // No need to update local state here, Supabase Realtime will handle it
      
      return newSubGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubGoal = useCallback(async (subGoal: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSubGoal = await updateSubGoalApi(subGoal);
      
      // No need to update local state here, Supabase Realtime will handle it
      
      return updatedSubGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubGoal = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteSubGoalApi(id);
      
      // No need to update local state here, Supabase Realtime will handle it
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sub-goal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    refreshGoals: () => fetchGoals(true),
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
