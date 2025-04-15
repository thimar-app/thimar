import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';

import GoalsHeader from "./header";
import { CirclePlus, Loader, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import GoalCard from "../../components/common/goal/goal-card";
import { useGoalContext } from "@/context/GoalContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { generateNewGoalFromAI } from "@/services/aiApi";
import AddGoalDialog from "@/components/common/goal/add-goal-dialog";
import { useGoalsQuery, useAllGoalsQuery, PaginatedResponse } from "@/services/goalQueries";
import { GoalSkeletonGrid } from "@/components/common/goal/goal-skeleton";
import { LoadingIndicator } from '../../components/ui/loading-indicator';
import { Goal } from '@/types/goal';
import { useQueryClient } from "@tanstack/react-query";

// Constants
const PAGE_SIZE = 8;
const MAX_AI_ATTEMPTS = 10;
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export default function Goals() {
  const { addGoal, currentGoal, setCurrentGoal, calculateOverallProgress } = useGoalContext();
  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch paginated goals and all goals for progress calculation
  const { 
    goals: paginatedGoals, 
    isLoading: isLoadingPaginated,
    pagination
  } = useGoalsQuery(currentPage, PAGE_SIZE);

  const { 
    goals: allGoalsData, 
    isLoading: isLoadingAll
  } = useAllGoalsQuery();

  // AI-based generation states
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGeneratedGoal, setAiGeneratedGoal] = useState<string>("");

  const navigate = useNavigate();

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (!allGoalsData || !Array.isArray(allGoalsData)) return 0;
    return calculateOverallProgress(allGoalsData);
  }, [allGoalsData, calculateOverallProgress]);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (pagination) {
      const totalPages = pagination.totalPages;
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all goal-related queries to force a refetch
      await queryClient.invalidateQueries({ queryKey: ['goals'] });
      await queryClient.invalidateQueries({ queryKey: ['allGoals'] });
      await queryClient.invalidateQueries({ queryKey: ['goal'] });
    } catch (error) {
      console.error('Error refreshing goals:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle goal added
  const handleGoalAdded = (newGoal: Goal) => {
    // Refresh the goals list
    handleRefresh();
  };

  // Handle generate with AI
  const handleGenerateWithAI = async () => {
    setIsGenerateButtonLoading(true);
    try {
      // Format existing goals for the API
      const existingGoals = allGoalsData?.map(goal => ({
        name: goal.name,
        description: goal.description,
        progress: goal.progress
      })) || [];

      const response = await generateNewGoalFromAI(existingGoals);
      // Format the response object into a string
      const formattedResponse = `Goal: ${response.goal}\n\nDescription: ${response.description}`;
      setAiGeneratedGoal(formattedResponse);
      setAiDialogOpen(true);
    } catch (error) {
      console.error('Error generating goal with AI:', error);
    } finally {
      setIsGenerateButtonLoading(false);
    }
  };

  // Handle save generated goal
  const handleSaveGeneratedGoal = async () => {
    try {
      // Extract goal name and description from the formatted string
      const goalMatch = aiGeneratedGoal.match(/Goal: (.*?)\n/);
      const descriptionMatch = aiGeneratedGoal.match(/Description: (.*)/s);
      
      if (!goalMatch || !descriptionMatch) {
        console.error('Could not parse generated goal');
        return;
      }
      
      const goalName = goalMatch[1].trim();
      const goalDescription = descriptionMatch[1].trim();
      
      // Create form data for the new goal
      const formData = new FormData();
      formData.append('name', goalName);
      formData.append('description', goalDescription);
      formData.append('sub_goals', '[]');
      
      // Add the goal using the context function
      await addGoal(formData);
      
      // Close the dialog and refresh the goals list
      setAiDialogOpen(false);
      handleRefresh();
    } catch (error) {
      console.error('Error saving generated goal:', error);
    }
  };

  // Handle goal click
  const handleGoalClick = (goal: Goal) => {
    setCurrentGoal(goal);
    navigate(`/goals/${goal.id}`);
  };

  // -------------------------------------
  // The Render
  // -------------------------------------
  if (isLoadingPaginated || isLoadingAll) {
    return <GoalSkeletonGrid />;
  }

  if (!paginatedGoals || !Array.isArray(paginatedGoals) || !allGoalsData || !Array.isArray(allGoalsData)) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading goals. Please try again later.
      </div>
    );
  }

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="flex flex-col h-full">
      <GoalsHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Goals</h1>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleGenerateWithAI}
              disabled={isGenerateButtonLoading}
            >
              {isGenerateButtonLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate with AI
            </Button>
            <AddGoalDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </AddGoalDialog>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Overall Progress</h2>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </Card>

        {/* Goals Grid */}
        {isLoadingPaginated ? (
          <GoalSkeletonGrid />
        ) : paginatedGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CirclePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first goal to start tracking your progress
            </p>
            <AddGoalDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </AddGoalDialog>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paginatedGoals.map((goal) => (
                <div key={goal.id} onClick={() => handleGoalClick(goal)}>
                  <GoalCard
                    title={goal.name}
                    progress={goal.progress}
                    image_url={goal.image_url}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI-Generated Goal Suggestion</DialogTitle>
            <DialogDescription>
              Here's a goal suggestion from AI. You can accept it or generate a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="whitespace-pre-line">{aiGeneratedGoal}</p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
          <Button 
              variant="outline" 
              onClick={() => setAiDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateWithAI}
              disabled={isGenerateButtonLoading}
            >
              {isGenerateButtonLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate New
                </>
              )}
            </Button>

            <Button 
              variant="default"
              onClick={handleSaveGeneratedGoal}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Save Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
