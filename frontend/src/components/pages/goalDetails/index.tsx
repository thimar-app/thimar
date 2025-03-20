// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import GoalHeader from "./header";
// import { ImageUp, Sparkles } from "lucide-react";
// import { useGoalContext } from "@/context/GoalContext";
// import { useParams, Navigate } from "react-router-dom";
// import GoalListView from "./goal-list-view";

// export default function GoalDetails() {
//   const { goalId } = useParams<{ goalId: string }>();
//   const { getGoalById, updateGoal } = useGoalContext();
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [isEditingDescription, setIsEditingDescription] = useState(false);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [currentGoal, setCurrentGoal] = useState<any>(null);

//   const goal = goalId ? getGoalById(goalId) : undefined;

//   useEffect(() => {
//     if (goal) {
//       setTitle(goal.name);
//       setDescription(goal.description || "");
//       setCurrentGoal(goal); // Keep a local copy for immediate UI update
//     }
//   }, [goal?.name, goal?.description]);

//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTitle(e.target.value);
//   };

//   const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDescription(e.target.value);
//   };

//   const handleTitleBlur = async () => {
//     if (goal && title.trim() !== goal.name) {
//       const updatedGoal = { ...goal, name: title };
//       setCurrentGoal(updatedGoal);
//       await updateGoal(updatedGoal);
//       setIsEditingTitle(false);
//     }
//   };

//   const handleDescriptionBlur = async () => {
//     if (goal && description.trim() !== goal.description) {
//       const updatedGoal = { ...goal, description };
//       setCurrentGoal(updatedGoal);
//       await updateGoal(updatedGoal);
//       setIsEditingDescription(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && goal) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const updatedGoal = { ...goal, image: reader.result as string };
//         setCurrentGoal(updatedGoal);
//         await updateGoal(updatedGoal);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (!goal) {
//     return <Navigate to="/goals" replace />;
//   }

//   return (
//     <main className="flex flex-col">
//       <GoalHeader title={title} id={goal.id} />
//       <section className="flex items-center gap-3">
//         <div
//           style={{
//             backgroundImage: currentGoal?.image
//               ? `url(${currentGoal.image})`
//               : undefined,
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//           className="w-full p-4 relative h-40 bg-muted rounded-lg flex flex-col items-center justify-center gap-2 overflow-hidden"
//         >
//           {/* Black and blur overlay */}
//           {currentGoal?.image && (
//             <div
//               className="absolute inset-0 bg-black/70 backdrop-blur-xs"
//               aria-hidden="true"
//             />
//           )}

//           {/* Content */}
//           <div className="relative z-10 w-full text-center">
//             {isEditingTitle ? (
//               <input
//                 type="text"
//                 value={title}
//                 onChange={handleTitleChange}
//                 onBlur={handleTitleBlur}
//                 className="font-semibold text-2xl bg-transparent border-none outline-none w-full text-center"
//                 autoFocus
//               />
//             ) : (
//               <h2
//                 className="font-semibold text-2xl text-center cursor-pointer"
//                 onClick={() => setIsEditingTitle(true)}
//               >
//                 {title}
//               </h2>
//             )}
//             {isEditingDescription ? (
//               <input
//                 type="text"
//                 value={description}
//                 onChange={handleDescriptionChange}
//                 onBlur={handleDescriptionBlur}
//                 className="text-muted-foreground bg-transparent border-none outline-none w-full text-center"
//                 autoFocus
//               />
//             ) : (
//               <p
//                 className="text-muted-foreground cursor-pointer"
//                 onClick={() => setIsEditingDescription(true)}
//               >
//                 {description}
//               </p>
//             )}
//           </div>

//           {/* Image Upload Button */}
//           <Button
//             size="icon"
//             variant="outline"
//             className="absolute right-0 m-4 bottom-0 !bg-card/40 hover:!bg-card ml-auto z-10"
//             onClick={() => document.getElementById("image-upload")?.click()}
//           >
//             <ImageUp className="size-6" strokeWidth={1} />
//           </Button>
//           <input
//             id="image-upload"
//             type="file"
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={handleImageUpload}
//           />
//         </div>
//       </section>
//       <section className="flex items-center gap-4 my-4">
//         <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
//           <div className="w-full h-3 rounded-full bg-muted-foreground/30">
//             <div
//               className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
//               style={{ width: `${currentGoal?.progress}%` }}
//             />
//           </div>
//           <span>{Math.round(currentGoal?.progress || 0)}%</span>
//         </div>
//         <Button className="!px-12 h-12 bg-violet-600 rounded-lg">
//           <Sparkles />
//           Generate Tasks
//         </Button>
//       </section>

//       <section className="flex bg-muted items-center gap-4 p-5 rounded-lg">
//         <GoalListView goal={currentGoal} showCompletedTasks />
//       </section>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GoalHeader from "./header";
import { ImageUp, Loader, Sparkles } from "lucide-react";
import { useGoalContext } from "@/context/GoalContext";
import { useParams, Navigate } from "react-router-dom";
import GoalListView from "./goal-list-view";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { generateNewTaskFromAI } from "@/services/aiApi";
import { createTask } from "@/services/tasksApi";

export default function GoalDetails() {
  const { goalId } = useParams<{ goalId: string }>();
  const { getGoalById, updateGoal } = useGoalContext();

  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentGoal, setCurrentGoal] = useState<any>(null);

  // AI-based task creation states
  const [aiTaskDialogOpen, setAiTaskDialogOpen] = useState(false);
  const [aiTaskText, setAiTaskText] = useState("");
  const [aiTaskName, setAiTaskName] = useState("");
  const [aiTaskDescription, setAiTaskDescription] = useState("");
  const [aiTaskPriority, setAiTaskPriority] = useState("");
  const [aiTaskRepeat, setAiTaskRepeat] = useState("");
  
  const [selectedSubGoal, setSelectedSubGoal] = useState<string>(""); // user picks subGoal ID
  // Default today's date in YYYY-MM-DD format
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const goal = goalId ? getGoalById(goalId) : undefined;

  useEffect(() => {
    if (goal) {
      setTitle(goal.name);
      setDescription(goal.description || "");
      setCurrentGoal(goal);
    }
  }, [goal?.name, goal?.description, goalId]);

  // Inline editing for goal name
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleTitleBlur = async () => {
    if (goal && title.trim() !== goal.name) {
      const updatedGoal = { ...goal, name: title };
      setCurrentGoal(updatedGoal);
      await updateGoal(updatedGoal);
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
      await updateGoal(updatedGoal);
      setIsEditingDescription(false);
    }
  };

  // Image Upload
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

  // ------------------------------
  // 1) Generate Task from AI
  // ------------------------------
  const handleGenerateTask = async () => {
    setIsGenerateButtonLoading(true);
    if (!currentGoal) return;

    try {
      // Build the request payload
      const payload = {
        goal_id: currentGoal.id,
        goal_name: currentGoal.name,
        goal_description: currentGoal.description,
        // completed_tasks: [...], if your endpoint needs them
      };
      const data = await generateNewTaskFromAI(payload);

      // e.g. data = { name, description, priority, repeat }
      setAiTaskName(data.name || "Untitled Task");
      setAiTaskDescription(data.description || "No Description");
      setAiTaskPriority(data.priority || "Low");
      setAiTaskRepeat(data.repeat || "No");

      // Combine for display in dialog
      const combinedText = `TASK NAME: ${data.name}\nDESCRIPTION: ${data.description}\nPRIORITY: ${data.priority}\nREPEAT: ${data.repeat}`;
      setAiTaskText(combinedText);

      setAiTaskDialogOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI-based task.");
    } finally {
      setIsGenerateButtonLoading(false);
    }
  };

  // Accept the AI-suggested task -> create sub-goal's task in DB
  const handleAcceptGeneratedTask = async () => {
    if (!selectedSubGoal) {
      alert("Please pick a sub-goal first.");
      return;
    }

    const newTaskData = {
      name: aiTaskName,
      description: aiTaskDescription,
      date: taskDate,          // Default or user can set in the UI
      sub_goal: selectedSubGoal,  // subGoal ID
      priority: aiTaskPriority,
      repeat: aiTaskRepeat
    };

    try {
      await createTask(newTaskData);
      // or your context-based approach

      alert("Task created successfully!");
      setAiTaskDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create task.");
    }
  };

  const handleRegenerateTask = async () => {
    setAiTaskDialogOpen(false);
    await handleGenerateTask();
  };

  if (!goal) {
    return <Navigate to="/goals" replace />;
  }

  return (
    <main className="flex flex-col">
      <GoalHeader title={title} id={goal.id} />

      {/* The hero section with background image + inline editing */}
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
          {currentGoal?.image && (
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
          {/* Upload Button */}
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

      {/* Progress + Generate Task */}
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
          disabled={isGenerateButtonLoading}
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
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI-Generated Task</DialogTitle>
            <DialogDescription>
              Below is the task from the AI. Choose a sub-goal to attach it to, then accept or regenerate.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="whitespace-pre-line bg-card p-4 rounded-md">
              <strong>TASK NAME:</strong> {aiTaskName}{"\n"}
              <strong>DESCRIPTION:</strong> {aiTaskDescription}{"\n"}
              <strong>PRIORITY:</strong> {aiTaskPriority}{"\n"}
              <strong>REPEAT:</strong> {aiTaskRepeat}
            </p>

            {/* SubGoal dropdown */}
            <div>
              <label htmlFor="subgoal-select" className="font-semibold">
                Select SubGoal:
              </label>
              <select
                id="subgoal-select"
                className="ml-2 border rounded px-2 py-1"
                value={selectedSubGoal}
                onChange={(e) => setSelectedSubGoal(e.target.value)}
              >
                <option value="" className="text-black" disabled selected>-- Choose a SubGoal --</option>
                {currentGoal?.sub_goals?.map((sg: any) => (
                  <option key={sg.id} value={sg.id} className="text-black">
                    {sg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Optionally let user pick a date */}
            <div>
              <label className="font-semibold mr-2">Date:</label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleRegenerateTask}>
              Regenerate
            </Button>
            <Button
              className="bg-violet-600"
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
