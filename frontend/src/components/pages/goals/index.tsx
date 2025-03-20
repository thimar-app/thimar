// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import GoalsHeader from "./header";
// import { CirclePlus, Sparkles, TrendingUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import GoalCard from "./goal-card";
// import { useGoalContext } from "@/context/GoalContext";

// export default function Goals() {
//   const { goals, addGoal, calculateOverallProgress, fetchGoals } = useGoalContext();
//   const [progress, setProgress] = useState(0);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newGoalName, setNewGoalName] = useState("");
//   const [newGoalDescription, setNewGoalDescription] = useState("");
//   const [newGoalImage, setNewGoalImage] = useState<File | null>(null);

//   useEffect(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   useEffect(() => {
//     const overallProgress = calculateOverallProgress();
//     setProgress(overallProgress.percentage);
//   }, [goals, calculateOverallProgress]);

//   // const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();
//   //   const newGoalId = uuidv4();

//   //   let imageURL = "https://placehold.co/500x550/1e1e1e/a1a1aa"; // Default placeholder
//   //   if (newGoalImage) {
//   //     // Create an object URL for the selected image file
//   //     imageURL = URL.createObjectURL(newGoalImage);
//   //   }

//   //   const newGoal = {
//   //     id: newGoalId,
//   //     name: newGoalName,
//   //     description: newGoalDescription,
//   //     image: imageURL,
//   //     progress: 0,
//   //     user_id: "user_123", // Ideally comes from your auth system
//   //     subGoals: [],
//   //   };

//   //   addGoal(newGoal);
//   //   setNewGoalName("");
//   //   setNewGoalDescription("");
//   //   setNewGoalImage(null);
//   //   setShowAddForm(false);
//   // };
//   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const newGoalId = uuidv4();

//     const formData = new FormData();
//     formData.append("id", newGoalId);
//     formData.append("name", newGoalName);
//     formData.append("description", newGoalDescription);
//     // Append file if one was selected
//     if (newGoalImage) {
//       formData.append("image", newGoalImage);
//     }

//     // Append other fields as needed...
//     // Then send formData via your API (axios or fetch)
//     addGoal(formData);

//     // Reset form fields...
//     setNewGoalName("");
//     setNewGoalDescription("");
//     setNewGoalImage(null);
//     setShowAddForm(false);
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
//               {progress}%
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
//           {showAddForm ? (
//             <form onSubmit={handleFormSubmit}
//             encType="multipart/form-data"
//             className="flex flex-col gap-2">
//               <input
//                 type="text"
//                 placeholder="Goal Name"
//                 value={newGoalName}
//                 onChange={(e) => setNewGoalName(e.target.value)}
//                 className="p-2 border rounded"
//                 required
//               />
//               <textarea
//                 placeholder="Goal Description"
//                 value={newGoalDescription}
//                 onChange={(e) => setNewGoalDescription(e.target.value)}
//                 className="p-2 border rounded"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files.length > 0) {
//                     setNewGoalImage(e.target.files[0]);
//                   }
//                 }}
//                 className="p-2 border rounded"
//               />
//               <div className="flex gap-2">
//                 <Button type="submit" className="bg-violet-600">
//                   Submit
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={() => setShowAddForm(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           ) : (
//             <Button
//               variant="ghost"
//               className="gap-3 bg-card w-full cursor-pointer h-10"
//               onClick={() => setShowAddForm(true)}
//             >
//               <CirclePlus className="!size-5" strokeWidth={1} />
//               <span>Add Goal</span>
//             </Button>
//           )}
//         </div>
//       </section>

//       {/* Goals List */}
//       <section className="mt-4">
//         <div className="container mx-auto w-full">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {goals.map((goal) => (
//               <Link to={`/goals/${goal.id}`} key={goal.id} className="block">
//                 <GoalCard
//                   progress={goal.progress}
//                   title={goal.name}
//                   imageSrc={goal.image}
//                 />
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// ---------------------------------------------------------------------------

// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import GoalsHeader from "./header";
// import { CirclePlus, Sparkles, TrendingUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import GoalCard from "./goal-card";
// import { useGoalContext } from "@/context/GoalContext";

// export default function Goals() {
//   const { goals, addGoal, calculateOverallProgress, fetchGoals } =
//     useGoalContext();
//   const [progress, setProgress] = useState(0);
//   const [showAddForm, setShowAddForm] = useState(false);
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
//     setShowAddForm(false);
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
//           {showAddForm ? (
//             <form
//               onSubmit={handleFormSubmit}
//               encType="multipart/form-data"
//               className="flex flex-col gap-2"
//             >
//               <input
//                 type="text"
//                 placeholder="Goal Name"
//                 value={newGoalName}
//                 onChange={(e) => setNewGoalName(e.target.value)}
//                 className="p-2 border rounded"
//                 required
//               />
//               <textarea
//                 placeholder="Goal Description"
//                 value={newGoalDescription}
//                 onChange={(e) => setNewGoalDescription(e.target.value)}
//                 className="p-2 border rounded"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files.length > 0) {
//                     setNewGoalImage(e.target.files[0]);
//                   }
//                 }}
//                 className="p-2 border rounded"
//               />
//               <div className="flex gap-2">
//                 <Button type="submit" className="bg-violet-600">
//                   Submit
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={() => setShowAddForm(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           ) : (
//             <Button
//               variant="ghost"
//               className="gap-3 bg-card w-full cursor-pointer h-10"
//               onClick={() => setShowAddForm(true)}
//             >
//               <CirclePlus className="!size-5" strokeWidth={1} />
//               <span>Add Goal</span>
//             </Button>
//           )}
//         </div>
//       </section>

//       {/* Goals List */}
//       <section className="mt-4">
//         <div className="container mx-auto w-full">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {goals.map((goal) => (
//               <Link to={`/goals/${goal.id}`} key={goal.id} className="block">
//                 <GoalCard
//                   progress={goal.progress}
//                   title={goal.name}
//                   imageSrc={goal.image}
//                 />
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

import type React from "react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GoalsHeader from "./header";
import { CirclePlus, Sparkles, TrendingUp } from "lucide-react";
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

export default function Goals() {
  const { goals, addGoal, calculateOverallProgress, fetchGoals } =
    useGoalContext();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalImage, setNewGoalImage] = useState<File | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const overallProgress = calculateOverallProgress();
    setProgress(overallProgress);
  }, [goals, calculateOverallProgress]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", newGoalName);
    formData.append("description", newGoalDescription);
    if (newGoalImage) {
      formData.append("image", newGoalImage, newGoalImage.name);
    }
    // No need to send id, progress, or user; they're auto-generated/attached on the backend.
    // Optionally, if your backend expects sub_goals, you can append an empty array:
    formData.append("sub_goals", "[]");

    await addGoal(formData);

    // Reset form fields
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
          <Button className="!px-8 bg-violet-600 h-10">
            <Sparkles />
            Generate Goal
          </Button>

          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="gap-3 bg-card w-full cursor-pointer h-10"
              >
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
