import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchGoalsApi, fetchGoalByIdApi, addGoalApi, updateGoalApi, deleteGoalApi, fetchSubGoalsApi, addSubGoalApi } from './api';
import { Goal, SubGoal } from '@/context/GoalContext';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Custom hook for fetching all goals (for progress calculation)
export const useAllGoalsQuery = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['allGoals'],
    queryFn: () => fetchGoalsApi(false, 1, 1000), // Fetch a large number to get all goals
  });

  const paginatedData = data as PaginatedResponse<Goal> | undefined;
  const goals = paginatedData?.results || [];

  return { goals, isLoading };
};

// Custom hook for fetching paginated goals
export const useGoalsQuery = (page: number = 1, pageSize: number = 8) => {
  const { data, isLoading } = useQuery({
    queryKey: ['goals', page, pageSize],
    queryFn: () => fetchGoalsApi(false, page, pageSize),
  });

  const paginatedData = data as PaginatedResponse<Goal> | undefined;
  const goals = paginatedData?.results || [];
  const pagination: PaginationInfo = {
    currentPage: page,
    totalPages: Math.ceil((paginatedData?.count || 0) / pageSize),
    totalItems: paginatedData?.count || 0,
    hasNextPage: !!paginatedData?.next,
    hasPreviousPage: !!paginatedData?.previous,
  };

  return { goals, pagination, isLoading };
};

export const useGoalByIdQuery = (id: string) => {
  return useQuery<Goal>({
    queryKey: ['goal', id],
    queryFn: () => fetchGoalByIdApi(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubGoalsQuery = (goalId: number, page: number, pageSize: number) => {
  return useQuery<PaginatedResponse<SubGoal>>({
    queryKey: ['subGoals', goalId, page, pageSize],
    queryFn: () => fetchSubGoalsApi(page, pageSize),
  });
};

// Mutation hooks for updating goals
export const useUpdateGoalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateGoalApi,
    onSuccess: () => {
      // Invalidate all goal-related queries to force a refetch
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['allGoals'] });
      queryClient.invalidateQueries({ queryKey: ['goal'] });
    },
  });
};

// Mutation hook for adding subgoals
export const useAddSubGoalMutation = (goalId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addSubGoalApi,
    onMutate: async (newSubGoal) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', goalId] });
      await queryClient.cancelQueries({ queryKey: ['goals'] });
      await queryClient.cancelQueries({ queryKey: ['allGoals'] });

      // Snapshot the previous value
      const previousGoal = queryClient.getQueryData(['goal', goalId]);

      // Optimistically update the goal
      queryClient.setQueryData(['goal', goalId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sub_goals: [...old.sub_goals, { 
            id: 'temp-' + Date.now(),
            name: newSubGoal.name,
            goal: goalId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        };
      });

      return { previousGoal };
    },
    onError: (err, newSubGoal, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', goalId], context.previousGoal);
      }
    },
    onSettled: () => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['allGoals'] });
    },
  });
};

// Helper function to calculate overall progress
export const calculateOverallProgress = (goals: Goal[]): number => {
  if (!goals.length) return 0;
  
  const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
  return Math.round(totalProgress / goals.length);
}; 