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
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useGoalContext } from "@/context/GoalContext";

function AddGoalDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalImage, setNewGoalImage] = useState<File | null>(null);

  const { addGoal } = useGoalContext();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Don't proceed if name is empty
    if (!newGoalName.trim()) {
      // You might want to show an error message to the user here
      return;
    }

    const formData = new FormData();
    formData.append("name", newGoalName);
    
    // Only append description if it's not empty
    if (newGoalDescription.trim()) {
      formData.append("description", newGoalDescription);
    }
    
    // Only append image if provided
    if (newGoalImage) {
      formData.append("image", newGoalImage, newGoalImage.name);
    }
    
    formData.append("sub_goals", "[]");

    try {
      console.log("Submitting form data:", {
        name: newGoalName,
        description: newGoalDescription,
        image: newGoalImage ? newGoalImage.name : "No image provided (will use backend default)"
      });
      
      await addGoal(formData);
      
      // Reset form and close dialog on success
      setNewGoalName("");
      setNewGoalDescription("");
      setNewGoalImage(null);
      setOpen(false);
    } catch (error) {
      console.error("Error adding goal:", error);
      // You might want to show an error message to the user here
    }
  };

  const resetForm = () => {
    setNewGoalName("");
    setNewGoalDescription("");
    setNewGoalImage(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
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
  );
}

export default AddGoalDialog;
