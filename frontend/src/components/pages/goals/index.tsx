// import type React from "react";

// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import GoalsHeader from "./header";
// import { CirclePlus, Sparkles, TrendingUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import GoalCard from "./goal-card";
// import { useGoalContext } from "@/context/GoalContext";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// export default function Goals() {
//   const { goals, addGoal, calculateOverallProgress, fetchGoals } =
//     useGoalContext();
//   const [progress, setProgress] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [newGoalName, setNewGoalName] = useState("");
//   const [newGoalDescription, setNewGoalDescription] = useState("");
//   const [newGoalImage, setNewGoalImage] = useState<File | null>(null);

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   useEffect(() => {
//     const overallProgress = calculateOverallProgress();
//     setProgress(overallProgress);
//   }, [goals, calculateOverallProgress]);

//   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData();

//     formData.append("name", newGoalName);
//     formData.append("description", newGoalDescription);
//     if (newGoalImage) {
//       formData.append("image", newGoalImage, newGoalImage.name);
//     }
//     // No need to send id, progress, or user; they're auto-generated/attached on the backend.
//     // Optionally, if your backend expects sub_goals, you can append an empty array:
//     formData.append("sub_goals", "[]");

//     await addGoal(formData);

//     // Reset form fields
//     setNewGoalName("");
//     setNewGoalDescription("");
//     setNewGoalImage(null);
//     setOpen(false);
//   };

//   const resetForm = () => {
//     setNewGoalName("");
//     setNewGoalDescription("");
//     setNewGoalImage(null);
//   };

//   return (
//     <main className="flex flex-col">
//       <GoalsHeader />

//       {/* Progress Bar Section */}
//       <section className="flex items-center gap-3">
//         <div className="w-full p-4 pb-5 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
//           <div className="flex justify-between items-center w-full">
//             <h2 className="flex items-center gap-3 font-semibold text-lg">
//               <TrendingUp />
//               Goals Progress
//             </h2>
//             <span className="font-semibold text-lg text-muted-foreground">
//               {Math.floor(progress)}%
//             </span>
//           </div>
//           <div className="w-full h-3 rounded-full bg-muted-foreground/30">
//             <div
//               className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-in-out"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col w-max items-center gap-3">
//           <Button className="!px-8 bg-violet-600 h-10">
//             <Sparkles />
//             Generate Goal
//           </Button>

//           <Dialog
//             open={open}
//             onOpenChange={(isOpen) => {
//               setOpen(isOpen);
//               if (!isOpen) resetForm();
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="gap-3 bg-card w-full cursor-pointer h-10"
//               >
//                 <CirclePlus className="!size-5" strokeWidth={1} />
//                 <span>Add Goal</span>
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <form onSubmit={handleFormSubmit} encType="multipart/form-data">
//                 <DialogHeader>
//                   <DialogTitle>Add New Goal</DialogTitle>
//                   <DialogDescription>
//                     Create a new goal to track your progress.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="goalName" className="text-right">
//                       Name
//                     </Label>
//                     <Input
//                       id="goalName"
//                       value={newGoalName}
//                       onChange={(e) => setNewGoalName(e.target.value)}
//                       className="col-span-3"
//                       required
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="goalDescription" className="text-right">
//                       Description
//                     </Label>
//                     <Textarea
//                       id="goalDescription"
//                       value={newGoalDescription}
//                       onChange={(e) => setNewGoalDescription(e.target.value)}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="goalImage" className="text-right">
//                       Image
//                     </Label>
//                     <Input
//                       id="goalImage"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         if (e.target.files && e.target.files.length > 0) {
//                           setNewGoalImage(e.target.files[0]);
//                         }
//                       }}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit" className="bg-violet-600">
//                     Add Goal
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </section>

//       {/* Goals List */}

//       <section className="mt-4">
//         <div className="container mx-auto w-full">
//           {goals.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-lg text-muted-foreground">
//                 No goals found. Create a new goal to get started.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {goals.map((goal) => (
//                 <Link to={`/goals/${goal.id}`} key={goal.id} className="block">
//                   <GoalCard
//                     progress={goal.progress}
//                     title={goal.name}
//                     imageSrc={goal.image}
//                   />
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import GoalsHeader from "./header";
import { CirclePlus, Loader, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalCard from "./goal-card";
import { useGoalContext } from "@/context/GoalContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { generateNewGoalFromAI } from "@/services/aiApi"; // <-- NEW import

export default function Goals() {
  const { goals, addGoal, calculateOverallProgress, fetchGoals } = useGoalContext();
  const [isGenerateButtonLoading, setIsGenerateButtonLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false); // For "Add Goal" dialog

  // AI-based generation states
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGeneratedGoal, setAiGeneratedGoal] = useState<string>("");

  // Fields for the normal "Add Goal" feature
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalImage, setNewGoalImage] = useState<File | null>(null);

  const [aiGoalName, setAiGoalName] = useState<string>("");
  const [aiGoalDesc, setAiGoalDesc] = useState<string>("");
  // Attempt-limiting constants
  const MAX_ATTEMPTS = 10;
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  // useEffect(() => {
  //   fetchGoals();
  // }, [fetchGoals]);

  useEffect(() => {
    const overall = calculateOverallProgress();
    setProgress(overall);
  }, [goals, calculateOverallProgress]);

  // -------------------------------------
  // 1) Normal "Add Goal" form submission
  // -------------------------------------
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newGoalName);
    formData.append("description", newGoalDescription);
    if (newGoalImage) {
      formData.append("image", newGoalImage, newGoalImage.name);
    }
    formData.append("sub_goals", "[]");

    await addGoal(formData);

    setNewGoalName("");
    setNewGoalDescription("");
    setNewGoalImage(null);
    setOpen(false);
  };

  const resetForm = () => {
    setNewGoalName("");
    setNewGoalDescription("");
    setNewGoalImage(null);
  };

  // -------------------------------------
  // 2) AI Generation logic
  // -------------------------------------
  const handleGenerateGoal = async () => {
    setIsGenerateButtonLoading(true);
    // Check attempts in localStorage
    const storedData = localStorage.getItem("aiGoalAttempts");
    let attemptsObj = {
      count: 0,
      lastReset: Date.now()
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
      alert(`You have used all ${MAX_ATTEMPTS} AI attempts for the next 6 hours!`);
      return;
    }

    try {
      // Build the "existing_goals" array
      const existingGoals = goals.map(g => ({
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
    }
    finally { setIsGenerateButtonLoading(false); }
  };

  async function fileFromUrl(url: string, fileName: string) {
    // 1) Fetch the remote image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    // 2) Convert response to a Blob
    const blob = await response.blob();
    // 3) Turn the Blob into a File (with a given filename)
    return new File([blob], fileName, { type: blob.type });
  }
  

  const handleAcceptGeneratedGoal = async () => {
    try {
      // Suppose you have a Cloudinary link for the AI goal's default image
      const cloudinaryUrl = "https://res.cloudinary.com/dh6yx1sei/image/upload/v1742429727/butmyifqwk0cfvhokmsu.png";
  
      // 1) Convert the Cloudinary URL into a File object
      const file = await fileFromUrl(cloudinaryUrl, "ai_goal_image.png");
  
      // 2) Build FormData for the new goal
      const formData = new FormData();
      formData.append("name", aiGoalName);   // from your AI states
      formData.append("description", aiGoalDesc);
      formData.append("image", file);        // an actual file
  
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
          <Button className="!px-8 bg-violet-600 h-10" onClick={handleGenerateGoal} disabled={isGenerateButtonLoading}>
            {isGenerateButtonLoading ? <Loader className="animate-spin" /> : <Sparkles />}
            Generate Goal
          </Button>

          {/* "Add Goal" dialog (manual) */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" className="gap-3 bg-card w-full cursor-pointer h-10">
                <CirclePlus className="!size-5" strokeWidth={1} />
                <span>Add Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                  <DialogDescription>
                    Create a new goal to track your progress.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goalName" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="goalName"
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goalDescription" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="goalDescription"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goalImage" className="text-right">
                      Image
                    </Label>
                    <Input
                      id="goalImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setNewGoalImage(e.target.files[0]);
                        }
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-violet-600">
                    Add Goal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* AI-Generated Goal Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI-Generated Goal</DialogTitle>
            <DialogDescription>
              A suggested goal from the AI. Accept or regenerate if you have attempts left.
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
            <Button className="bg-violet-600" onClick={handleAcceptGeneratedGoal}>
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
