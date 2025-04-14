import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useGoalContext, Goal } from "@/context/GoalContext";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ImageUp, Loader, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateNewTaskFromAI } from "@/services/aiApi";
import { createTaskApi } from "@/services/tasksApi";

export default function GoalDetailsPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { fetchGoalById, updateGoal, selectedGoal, isLoading, error } = useGoalContext();
  const { authAxios, retryWithFreshToken, isReady: isAuthAxiosReady, createAxiosInstance } = useAuthAxios();
  const { isSignedIn, isLoaded } = useAuth();

  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);

  // AI-based task creation states
  const [aiTaskDialogOpen, setAiTaskDialogOpen] = useState(false);
  const [aiTaskName, setAiTaskName] = useState("");
  const [aiTaskDescription, setAiTaskDescription] = useState("");
  const [aiTaskPriority, setAiTaskPriority] = useState("");
  const [aiTaskRepeat, setAiTaskRepeat] = useState("");
  const [selectedSubGoal, setSelectedSubGoal] = useState("");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);

  // Memoize the loadGoal function
  const loadGoal = useCallback(async () => {
    if (!goalId || !isAuthAxiosReady) return;

    try {
      console.log('Fetching goal:', goalId);
      await fetchGoalById(goalId);
    } catch (error) {
      console.error('Error loading goal:', error);
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
      } else {
        navigate('/goals');
      }
    }
  }, [goalId, fetchGoalById, isAuthAxiosReady, retryCount, navigate]);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      if (retryCount > 0 && retryCount < maxRetries) {
        const timer = setTimeout(() => {
          loadGoal();
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        loadGoal();
      }
    }
  }, [loadGoal, isSignedIn, isLoaded, retryCount]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleTitleBlur = useCallback(async () => {
    if (currentGoal && title.trim() !== currentGoal.name) {
      const updatedGoal = { ...currentGoal, name: title };
      setCurrentGoal(updatedGoal);
      await updateGoal(currentGoal.id, { name: title });
      setIsEditingTitle(false);
    }
  }, [currentGoal, title, updateGoal]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleDescriptionBlur = useCallback(async () => {
    if (currentGoal && description.trim() !== currentGoal.description) {
      const updatedGoal = { ...currentGoal, description };
      setCurrentGoal(updatedGoal);
      await updateGoal(currentGoal.id, { description });
      setIsEditingDescription(false);
    }
  }, [currentGoal, description, updateGoal]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentGoal) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('id', currentGoal.id);
      
      // Update the goal with the image file
      updateGoal(formData).then(updatedGoal => {
        if (updatedGoal) {
          setCurrentGoal(updatedGoal);
        }
      });
    }
  }, [currentGoal, updateGoal]);

  const handleGenerateTask = useCallback(async () => {
    if (!currentGoal || !authAxios) return;
    setIsGenerateButtonLoading(true);

    try {
      const payload = {
        goal_id: currentGoal.id,
        goal_name: currentGoal.name,
        goal_description: currentGoal.description,
      };
      
      const axiosInstance = authAxios || await createAxiosInstance();
      if (!axiosInstance) {
        throw new Error('Failed to get axios instance');
      }
      
      const data = await generateNewTaskFromAI(
        axiosInstance,
        payload,
        retryWithFreshToken
      );
      
      setAiTaskName(data.task || "Untitled Task");
      setAiTaskDescription(data.description || "No Description");
      setAiTaskPriority(data.priority || "low");
      setAiTaskRepeat("No");

      setAiTaskDialogOpen(true);
    } catch (err) {
      console.error("Error generating AI task:", err);
      alert("Failed to generate AI-based task.");
    } finally {
      setIsGenerateButtonLoading(false);
    }
  }, [currentGoal, authAxios, createAxiosInstance, retryWithFreshToken]);

  const handleAcceptGeneratedTask = useCallback(async () => {
    if (!selectedSubGoal || !authAxios) {
      alert("Please pick a sub-goal first!");
      return;
    }

    const newTaskData = {
      name: aiTaskName,
      description: aiTaskDescription,
      date: taskDate,      
      sub_goal: selectedSubGoal,
      priority: aiTaskPriority,
      repeat: aiTaskRepeat
    };

    try {
      const axiosInstance = authAxios || await createAxiosInstance();
      if (!axiosInstance) {
        throw new Error('Failed to get axios instance');
      }
      
      const result = await createTaskApi(axiosInstance, newTaskData);
      console.log("Created task:", result);

      alert("Task created successfully!");
      setAiTaskDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating the new task. See console for details.");
    }
  }, [aiTaskName, aiTaskDescription, taskDate, selectedSubGoal, aiTaskPriority, aiTaskRepeat, authAxios, createAxiosInstance]);

  const handleRegenerateTask = useCallback(async () => {
    setAiTaskDialogOpen(false);
    await handleGenerateTask();
  }, [handleGenerateTask]);

  const subGoalOptions = useMemo(() => {
    if (!currentGoal?.sub_goals) return [];
    return currentGoal.sub_goals.map((sg) => (
      <option key={sg.id} value={sg.id} className="truncate">
        {sg.name} (ID: {sg.id})
      </option>
    ));
  }, [currentGoal?.sub_goals]);

  const progressBarStyle = useMemo(() => ({
    width: `${currentGoal?.progress || 0}%`
  }), [currentGoal?.progress]);

  const backgroundImageStyle = useMemo(() => ({
    backgroundImage: currentGoal?.image_url
      ? `url(${currentGoal.image_url})`
      : undefined,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }), [currentGoal?.image_url]);

  if (!isSignedIn || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="ml-2">Checking authentication...</p>
      </div>
    );
  }

  if (!goalId) {
    return <Navigate to="/goals" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate('/goals')}>
          Return to Goals
        </Button>
      </div>
    );
  }

  if (!currentGoal && !isLoading) {
    return <Navigate to="/goals" replace />;
  }

  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 px-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/goals")}
        >
          Back to Goals
        </Button>
      </header>

      {/* Hero section */}
      <section className="flex items-center gap-3 px-4">
        <div
          style={backgroundImageStyle}
          className="w-full p-4 relative h-40 bg-muted rounded-lg flex flex-col items-center justify-center gap-2 overflow-hidden"
        >
          {currentGoal?.image_url && (
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              aria-hidden="true"
            />
          )}
          <div className="relative z-10 w-full text-center">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                className="font-semibold text-2xl bg-transparent border-none outline-none w-full text-center"
                autoFocus
              />
            ) : (
              <h2
                className="font-semibold text-2xl text-center cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h2>
            )}
            {isEditingDescription ? (
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                className="text-muted-foreground bg-transparent border-none outline-none w-full text-center"
                autoFocus
              />
            ) : (
              <p
                className="text-muted-foreground cursor-pointer"
                onClick={() => setIsEditingDescription(true)}
              >
                {description}
              </p>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-0 m-4 bottom-0 !bg-card/40 hover:!bg-card ml-auto z-10"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <ImageUp className="size-6" strokeWidth={1} />
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
      </section>

      {/* Progress and Generate Task button */}
      <section className="flex items-center gap-4 my-4 px-4">
        <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={progressBarStyle}
            />
          </div>
          <span>{Math.round(currentGoal?.progress || 0)}%</span>
        </div>
        <Button
          className="!px-12 h-12 bg-violet-600 rounded-lg"
          onClick={handleGenerateTask}
          disabled={isGenerateButtonLoading}
        >
          {isGenerateButtonLoading ? <Loader className="animate-spin" /> : <Sparkles />}
          Generate Tasks
        </Button>
      </section>

      {/* Sub-goals Section */}
      <section className="flex bg-muted items-center gap-4 p-5 rounded-lg mx-4">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Sub-goals</h2>
          {currentGoal?.sub_goals && currentGoal.sub_goals.length > 0 ? (
            <div className="space-y-4">
              {currentGoal.sub_goals.map((subGoal) => (
                <div
                  key={subGoal.id}
                  className="bg-card p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{subGoal.name}</h3>
                    <span>{Math.round(subGoal.progress)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {subGoal.description}
                  </p>
                  <div className="w-full h-2 bg-background rounded-full">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all duration-300"
                      style={{ width: `${subGoal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No sub-goals yet.</p>
          )}
        </div>
      </section>

      {/* AI-Generated Task Dialog */}
      <Dialog open={aiTaskDialogOpen} onOpenChange={setAiTaskDialogOpen}>
        <DialogContent className="max-w-[600px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">AI-Generated Task</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Below is the new task from AI. Choose a sub-goal and date, then accept or regenerate.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-card p-4 rounded-md space-y-1 max-w-full">
              <p className="break-words overflow-hidden text-ellipsis"><strong>TASK NAME:</strong> {aiTaskName}</p>
              <p className="break-words overflow-hidden text-ellipsis"><strong>DESCRIPTION:</strong> {aiTaskDescription}</p>
              <p className="break-words overflow-hidden text-ellipsis"><strong>PRIORITY:</strong> {aiTaskPriority}</p>
              <p className="break-words overflow-hidden text-ellipsis"><strong>REPEAT:</strong> {aiTaskRepeat}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col">
                <label htmlFor="subgoal-select" className="font-medium mb-1">
                  Attach to Sub-Goal:
                </label>
                <select
                  id="subgoal-select"
                  className="border rounded px-2 py-2 text-sm bg-white text-black dark:bg-gray-800 dark:text-white w-full truncate"
                  value={selectedSubGoal}
                  onChange={(e) => setSelectedSubGoal(e.target.value)}
                >
                  <option value="">-- Choose a SubGoal --</option>
                  {subGoalOptions}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-1">Date:</label>
                <input
                  type="date"
                  className="border rounded px-2 py-2 text-sm w-full"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleRegenerateTask}>
              Regenerate
            </Button>
            <Button
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={handleAcceptGeneratedTask}
              disabled={!selectedSubGoal}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
} 