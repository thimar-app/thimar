import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import GoalHeader from "./header";
import { ImageUp, Sparkles } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { useGoalContext } from "@/context/GoalContext";
import { useParams, Navigate } from "react-router-dom";

export default function GoalDetails() {
  const { progress } = useTaskContext();
  const { goalId } = useParams<{ goalId: string }>();
  const { getGoalById } = useGoalContext();

  const goal = goalId ? getGoalById(goalId) : undefined;

  useEffect(() => {
    // This forces a re-render when goalId changes
  }, [goalId]);

  if (!goal) {
    return <Navigate to="/goals" replace />;
  }

  return (
    <main className="flex flex-col">
      <GoalHeader title={goal.name} />
      <section className="flex items-center gap-3">
        <div className="w-full p-4 relative h-40 bg-muted rounded-lg flex flex-col items-center justify-center gap-2">
          <h2 className="font-semibold text-2xl">{goal.name}</h2>
          <p className="text-muted-foreground">{goal.description}</p>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-0 m-4 bottom-0 !bg-card hover:!bg-accent ml-auto"
          >
            <ImageUp className="size-6" strokeWidth={1} />
          </Button>
        </div>
      </section>
      <section className="flex items-center gap-4 my-4">
        <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <span>{progress.formattedPercentage}</span>
        </div>
        <Button className="!px-12 h-12 bg-violet-600 rounded-lg">
          <Sparkles />
          Generate Tasks
        </Button>
      </section>
    </main>
  );
}
