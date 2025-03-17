import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GoalsHeader from "./header";
import { CirclePlus, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalCard from "./goal-card";
import { useGoalContext } from "@/context/GoalContext";

export default function Goals() {
  const { goals, addGoal, calculateOverallProgress } = useGoalContext();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get overall progress from context
    const overallProgress = calculateOverallProgress();
    setProgress(overallProgress.percentage);
  }, [goals, calculateOverallProgress]);

  // Function to add an empty goal and redirect
  const handleAddGoal = () => {
    const newGoalId = uuidv4();

    const emptyGoal = {
      id: newGoalId,
      name: "New Goal",
      description: "Click to edit your goal description",
      image: "https://placehold.co/500x550/1e1e1e/a1a1aa", // Default placeholder image
      progress: 0,
      user_id: "user_123", // This would ideally come from your auth system
      subGoals: [],
    };

    // Add the goal to context
    addGoal(emptyGoal);
  };

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
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col w-max items-center gap-3">
          <Button className="!px-8 bg-violet-600 h-10">
            <Sparkles />
            Generate Goal
          </Button>
          <Button
            variant="ghost"
            className="gap-3 bg-card w-full cursor-pointer h-10"
            onClick={handleAddGoal} // Added onClick handler
          >
            <CirclePlus className="!size-5" strokeWidth={1} />
            <span className="">Add Goal</span>
          </Button>
        </div>
      </section>

      {/* Goals List */}
      <section className="mt-4">
        <div className="container mx-auto w-full">
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
        </div>
      </section>
    </main>
  );
}
