import { Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function HeaderPreference({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-2 " align="end">
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="w-4 h-4" /> Delete Goal
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
