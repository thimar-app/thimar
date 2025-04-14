import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import GoalsHeader from "./header";
import { CirclePlus, Loader, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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

import { generateNewGoalFromAI } from "@/services/aiApi"; // <-- NEW import
import AddGoalDialog from "@/components/common/goal/add-goal-dialog";

export default function Goals() {
  const { goals, addGoal, calculateOverallProgress } = useGoalContext();
  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  // AI-based generation states
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGeneratedGoal, setAiGeneratedGoal] = useState<string>("");

  const [aiGoalName, setAiGoalName] = useState<string>("");
  const [aiGoalDesc, setAiGoalDesc] = useState<string>("");
  // Attempt-limiting constants
  const MAX_ATTEMPTS = 10;
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  useEffect(() => {
    const overall = calculateOverallProgress();
    setProgress(overall);
  }, [goals, calculateOverallProgress]);

  // AI Generation logic
  const handleGenerateGoal = async () => {
    setIsGenerateButtonLoading(true);
    // Check attempts in localStorage
    const storedData = localStorage.getItem("aiGoalAttempts");
    let attemptsObj = {
      count: 0,
      lastReset: Date.now(),
    };
    if (storedData) {
      attemptsObj = JSON.parse(storedData);
    }

    const now = Date.now();
    // If it's been >6 hours since lastReset, reset attempts
    if (now - attemptsObj.lastReset > SIX_HOURS_MS) {
      attemptsObj.count = 0;
      attemptsObj.lastReset = now;
    }

    if (attemptsObj.count >= MAX_ATTEMPTS) {
      alert(
        `You have used all ${MAX_ATTEMPTS} AI attempts for the next 6 hours!`
      );
      return;
    }

    try {
      // Build the "existing_goals" array
      const existingGoals = goals.map((g) => ({
        name: g.name,
        progress: g.progress,
        description: g.description,
      }));

      // Call the AI service

      const data = await generateNewGoalFromAI(existingGoals);

      // Suppose data = { goal: "...", description: "..." }
      const goalTitle = data.goal || "No AI goal name";
      const goalExplanation = data.description || "No AI description";
      setAiGoalName(goalTitle);
      setAiGoalDesc(goalExplanation);

      // If the server returns { goal: "xyz", description: "abc" }:
      const combinedText = `NEW GOAL: ${data.goal}\n\nDESCRIPTION: ${data.description}`;

      // const aiGoalOutput = data.output || "No data from AI.";
      setAiGeneratedGoal(combinedText);
      setAiDialogOpen(true);

      // Increase attempt count and save
      attemptsObj.count += 1;
      localStorage.setItem("aiGoalAttempts", JSON.stringify(attemptsObj));
      setIsGenerateButtonLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI-based goal. Check console for details.");
    } finally {
      setIsGenerateButtonLoading(false);
    }
  };

  async function fileFromUrl(url: string, fileName: string) {
    // 1) Fetch the remote image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }
    // 2) Convert response to a Blob
    const blob = await response.blob();
    // 3) Turn the Blob into a File (with a given filename)
    return new File([blob], fileName, { type: blob.type });
  }

  const handleAcceptGeneratedGoal = async () => {
    try {
      // Suppose you have a Cloudinary link for the AI goal's default image
      const cloudinaryUrl =
        "https://res.cloudinary.com/dh6yx1sei/image/upload/v1742429727/butmyifqwk0cfvhokmsu.png";

      // 1) Convert the Cloudinary URL into a File object
      const file = await fileFromUrl(cloudinaryUrl, "ai_goal_image.png");

      // 2) Build FormData for the new goal
      const formData = new FormData();
      formData.append("name", aiGoalName); // from your AI states
      formData.append("description", aiGoalDesc);
      formData.append("image", file); // an actual file

      // 3) Use your existing addGoal function that expects FormData
      await addGoal(formData);

      // 4) Close the dialog
      setAiDialogOpen(false);
    } catch (error) {
      console.error("Error accepting AI-generated goal:", error);
      alert("Failed to accept AI-generated goal.");
    }
  };

  const handleRegenerateGoal = async () => {
    setAiDialogOpen(false);
    await handleGenerateGoal();
  };

  // -------------------------------------
  // The Render
  // -------------------------------------
  return (
    <main className="flex flex-col">
      <GoalsHeader />

      {/* Progress Bar Section */}
      <section className="flex items-center gap-3">
        <div className="w-full p-4 pb-5 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="flex items-center gap-3 font-semibold text-lg">
              <TrendingUp />
              Goals Progress
            </h2>
            <span className="font-semibold text-lg text-muted-foreground">
              {Math.floor(progress)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col w-max items-center gap-3">
          <Button
            className="!px-8 bg-violet-600 h-10"
            onClick={handleGenerateGoal}
            disabled={isGenerateButtonLoading}
          >
            {isGenerateButtonLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            Generate Goal
          </Button>

          {/* "Add Goal" dialog (manual) */}
          <AddGoalDialog>
            <Button
              variant="ghost"
              className="gap-3 bg-card w-full cursor-pointer h-10"
            >
              <CirclePlus className="!size-5" strokeWidth={1} />
              <span>Add Goal</span>
            </Button>
          </AddGoalDialog>
        </div>
      </section>

      {/* AI-Generated Goal Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI-Generated Goal</DialogTitle>
            <DialogDescription>
              A suggested goal from the AI. Accept or regenerate if you have
              attempts left.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="whitespace-pre-line bg-card p-4 rounded-md">
              {aiGeneratedGoal}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleRegenerateGoal}>
              Regenerate
            </Button>
            <Button
              className="bg-violet-600"
              onClick={handleAcceptGeneratedGoal}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goals List */}
      <section className="mt-4">
        <div className="container mx-auto w-full">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                No goals found. Create a new goal to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {goals.map((goal) => (
                <Link to={`/goals/${goal.id}`} key={goal.id} className="block">
                  <GoalCard
                    progress={goal.progress}
                    title={goal.name}
                    imageSrc={goal.image}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
