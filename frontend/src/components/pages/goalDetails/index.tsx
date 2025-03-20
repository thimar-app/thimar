// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import GoalHeader from "./header";
// import { ImageUp, Sparkles } from "lucide-react";
// import { useTaskContext } from "@/context/TaskContext";
// import { useGoalContext } from "@/context/GoalContext";
// import { useParams, Navigate } from "react-router-dom";

// export default function GoalDetails() {
//   const { progress } = useTaskContext();
//   const { goalId } = useParams<{ goalId: string }>();
//   const { getGoalById } = useGoalContext();

//   const goal = goalId ? getGoalById(goalId) : undefined;

//   useEffect(() => {
//     // This forces a re-render when goalId changes
//   }, [goalId]);

//   if (!goal) {
//     return <Navigate to="/goals" replace />;
//   }

//   return (
//     <main className="flex flex-col">
//       <GoalHeader title={goal.name} />
//       <section className="flex items-center gap-3">
//         <div className="w-full p-4 relative h-40 bg-muted rounded-lg flex flex-col items-center justify-center gap-2">
//           <h2 className="font-semibold text-2xl">{goal.name}</h2>
//           <p className="text-muted-foreground">{goal.description}</p>
//           <Button
//             size="icon"
//             variant="outline"
//             className="absolute right-0 m-4 bottom-0 !bg-card hover:!bg-accent ml-auto"
//           >
//             <ImageUp className="size-6" strokeWidth={1} />
//           </Button>
//         </div>
//       </section>
//       <section className="flex items-center gap-4 my-4">
//         <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
//           <div className="w-full h-3 rounded-full bg-muted-foreground/30">
//             <div
//               className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
//               style={{ width: `${progress.percentage}%` }}
//             />
//           </div>
//           <span>{progress.formattedPercentage}</span>
//         </div>
//         <Button className="!px-12 h-12 bg-violet-600 rounded-lg">
//           <Sparkles />
//           Generate Tasks
//         </Button>
//       </section>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GoalHeader from "./header";
import { ImageUp, Sparkles } from "lucide-react";
import { useGoalContext } from "@/context/GoalContext";
import { useParams, Navigate } from "react-router-dom";
import GoalListView from "./goal-list-view";

export default function GoalDetails() {
  const { goalId } = useParams<{ goalId: string }>();
  const { getGoalById, updateGoal } = useGoalContext();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentGoal, setCurrentGoal] = useState<any>(null);

  const goal = goalId ? getGoalById(goalId) : undefined;

  useEffect(() => {
    if (goal) {
      setTitle(goal.name);
      setDescription(goal.description || "");
      setCurrentGoal(goal); // Keep a local copy for immediate UI update
    }
  }, [goal?.name, goal?.description]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (goal && title.trim() !== goal.name) {
      const updatedGoal = { ...goal, name: title };
      setCurrentGoal(updatedGoal);
      await updateGoal(updatedGoal);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionBlur = async () => {
    if (goal && description.trim() !== goal.description) {
      const updatedGoal = { ...goal, description };
      setCurrentGoal(updatedGoal);
      await updateGoal(updatedGoal);
      setIsEditingDescription(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && goal) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const updatedGoal = { ...goal, image: reader.result as string };
        setCurrentGoal(updatedGoal);
        await updateGoal(updatedGoal);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!goal) {
    return <Navigate to="/goals" replace />;
  }

  return (
    <main className="flex flex-col">
      <GoalHeader title={title} id={goal.id} />
      <section className="flex items-center gap-3">
        <div
          style={{
            backgroundImage: currentGoal?.image
              ? `url(${currentGoal.image})`
              : undefined,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full p-4 relative h-40 bg-muted rounded-lg flex flex-col items-center justify-center gap-2 overflow-hidden"
        >
          {/* Black and blur overlay */}
          {currentGoal?.image && (
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              aria-hidden="true"
            />
          )}

          {/* Content */}
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

          {/* Image Upload Button */}
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
      <section className="flex items-center gap-4 my-4">
        <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${currentGoal?.progress}%` }}
            />
          </div>
          <span>{Math.round(currentGoal?.progress || 0)}%</span>
        </div>
        <Button className="!px-12 h-12 bg-violet-600 rounded-lg">
          <Sparkles />
          Generate Tasks
        </Button>
      </section>

      <section className="flex bg-muted items-center gap-4 p-5 rounded-lg">
        <GoalListView goal={currentGoal} showCompletedTasks />
      </section>
    </main>
  );
}
