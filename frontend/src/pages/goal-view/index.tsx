import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GoalHeader from "./header";
import { ImageUp, Loader, Sparkles } from "lucide-react";
import { useGoalContext } from "@/context/GoalContext";
import { useParams } from "react-router-dom";
import GoalListView from "./goal-list-view";
import { useGoalByIdQuery } from "@/services/goalQueries";
import { useTaskContext } from "@/context/TaskContext";
import { Task, Priority } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { generateNewTaskFromAI } from "@/services/aiApi";
import { checkPrayerTimesUpdate } from "@/services/prayersApi";

export default function GoalDetails() {
  const { goalId } = useParams<{ goalId: string }>();
  const { updateGoal } = useGoalContext();
  const { addTask } = useTaskContext();
  
  // Use the query hook for proper goal fetching
  const { data: goal, isLoading, error, refetch } = useGoalByIdQuery(goalId || "");

  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentGoal, setCurrentGoal] = useState<any>(null);
  const [prayers, setPrayers] = useState<{ id: string; name: string; time: string }[]>([]);

  // AI-based task creation states
  const [aiTaskDialogOpen, setAiTaskDialogOpen] = useState(false);
  const [aiTaskName, setAiTaskName] = useState("");
  const [aiTaskDescription, setAiTaskDescription] = useState("");
  const [aiTaskPriority, setAiTaskPriority] = useState("");
  const [aiTaskRepeat, setAiTaskRepeat] = useState("");
  const [selectedSubGoal, setSelectedSubGoal] = useState("");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);

  // Fetch prayer times on component mount
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        const data = await checkPrayerTimesUpdate();
        setPrayers(data);
      } catch (error) {
        console.error("Failed to fetch prayers:", error);
      }
    };

    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (goal) {
      setTitle(goal.name);
      setDescription(goal.description || "");
      setCurrentGoal(goal);
    }
  }, [goal]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show error state
  if (error || !goal) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Failed to load goal details</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Inline editing for goal name
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleTitleBlur = async () => {
    if (goal && title.trim() !== goal.name) {
      const updatedGoal = { ...goal, name: title };
      setCurrentGoal(updatedGoal);
      try {
        await updateGoal(updatedGoal);
        setIsEditingTitle(false);
      } catch (error) {
        console.error("Error updating goal title:", error);
      }
    } else {
      setIsEditingTitle(false);
    }
  };

  // Inline editing for goal description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  const handleDescriptionBlur = async () => {
    if (goal && description.trim() !== goal.description) {
      const updatedGoal = { ...goal, description };
      setCurrentGoal(updatedGoal);
      try {
        await updateGoal(updatedGoal);
        setIsEditingDescription(false);
      } catch (error) {
        console.error("Error updating goal description:", error);
      }
    } else {
      setIsEditingDescription(false);
    }
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && goal) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('id', goal.id);
      
      try {
        updateGoal(formData);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // ------------------------------
  // 1) Generate Task from AI
  // ------------------------------
  const handleGenerateTask = async () => {
    if (!currentGoal) return;
    setIsGenerateButtonLoading(true);

    try {
      // The payload to your AI endpoint
      const payload = {
        goal_id: currentGoal.id,
        goal_name: currentGoal.name,
        goal_description: currentGoal.description,
      };
      const data = await generateNewTaskFromAI(payload);
      // Suppose data = { name, description, priority, repeat }
      setAiTaskName(data.name || "Untitled Task");
      setAiTaskDescription(data.description || "No Description");
      setAiTaskPriority(data.priority || "Low");
      setAiTaskRepeat(data.repeat || "No");

      setAiTaskDialogOpen(true);
    } catch (err) {
      console.error("Error generating AI task:", err);
      alert("Failed to generate AI-based task.");
    } finally {
      setIsGenerateButtonLoading(false);
    }
  };

  // 2) Accept => create a new task in DB, passing sub_goal as a UUID string
  const handleAcceptGeneratedTask = async () => {
    if (!selectedSubGoal) {
      alert("Please pick a sub-goal first!");
      return;
    }

    // Create task data in the correct format
    const newTaskData: Task = {
      id: crypto.randomUUID(), // Generate a temporary ID
      name: aiTaskName,
      description: aiTaskDescription,
      date: taskDate,      
      sub_goal: selectedSubGoal,
      prayer: selectedPrayerId,
      priority: aiTaskPriority as Priority,
      status: false,
      repeat: aiTaskRepeat === "Yes"
    };

    try {
      // Use the TaskContext to add the task
      await addTask(newTaskData);
      
      // Refresh the goal data to show the new task
      await refetch();

      alert("Task created successfully!");
      setAiTaskDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating the new task. See console for details.");
    }
  };

  const handleRegenerateTask = async () => {
    setAiTaskDialogOpen(false);
    await handleGenerateTask();
  };

  return (
    <main className="flex flex-col">
      <GoalHeader title={title} id={goal.id} />

      {/* Hero section */}
      <section className="flex items-center gap-3">
        <div
          style={{
            backgroundImage: currentGoal?.image_url
              ? `url(${currentGoal.image_url})`
              : undefined,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
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

      {/* Generate Task button */}
      <section className="flex items-center gap-4 my-4">
        <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${currentGoal?.progress || 0}%` }}
            />
          </div>
          <span>{Math.round(currentGoal?.progress || 0)}%</span>
        </div>
        <Button
          className="!px-12 h-12 bg-violet-600 rounded-lg"
          onClick={handleGenerateTask}
          disabled={isGenerateButtonLoading || !currentGoal?.sub_goals?.length}
        >
          {isGenerateButtonLoading ? <Loader className="animate-spin" /> : <Sparkles />}
          Generate Tasks
        </Button>
      </section>

      <section className="flex bg-muted items-center gap-4 p-5 rounded-lg">
        <GoalListView goal={currentGoal} showCompletedTasks />
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
    {/* Main content area */}
    <div className="py-4 space-y-6">
      {/* Display the AI suggestion in a box with strict overflow control */}
      <div className="bg-card p-4 rounded-md space-y-1 max-w-full">
        <p className="break-words overflow-hidden text-ellipsis"><strong>TASK NAME:</strong> {aiTaskName}</p>
        <p className="break-words overflow-hidden text-ellipsis"><strong>DESCRIPTION:</strong> {aiTaskDescription}</p>
        <p className="break-words overflow-hidden text-ellipsis"><strong>PRIORITY:</strong> {aiTaskPriority}</p>
        <p className="break-words overflow-hidden text-ellipsis"><strong>REPEAT:</strong> {aiTaskRepeat}</p>
      </div>
      {/* SubGoal and Date Inputs in a flex or grid */}
      <div className="flex flex-col space-y-3">
        {/* Sub-goal select */}
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
            {currentGoal?.sub_goals?.map((sg: any) => (
              <option key={sg.id} value={sg.id} className="truncate">
                {sg.name} (ID: {sg.id})
              </option>
            ))}
          </select>
        </div>
        {/* Date input */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Date:</label>
          <input
            type="date"
            className="border rounded px-2 py-2 text-sm w-full"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
        </div>
        {/* Prayer time select */}
        <div className="flex flex-col">
          <label htmlFor="prayer-time-select" className="font-medium mb-1">
            Prayer Time:
          </label>
          <select
            id="prayer-time-select"
            className="border rounded px-2 py-2 text-sm bg-white text-black dark:bg-gray-800 dark:text-white w-full"
            value={selectedPrayerId || ""}
            onChange={(e) => setSelectedPrayerId(e.target.value || null)}
          >
            <option value="">-- Select Prayer Time --</option>
            {prayers.map((prayer) => (
              <option key={prayer.id} value={prayer.id}>
                {prayer.name}
              </option>
            ))}
          </select>
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
