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
