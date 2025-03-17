import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GripVertical, PenLine, X, Calendar, Repeat } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDrag, useDrop } from "react-dnd";
import React, { useState } from "react";
import { Task } from "@/db/goals";

interface TaskItemProps {
  task: Task;
  index: number;
  showGoals?: boolean;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  toggleTaskStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
}

const ItemTypes = {
  TASK: "task",
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const priorityVariantMap = {
  Low: "outline",
  Medium: "secondary",
  High: "warning",
  Urgent: "destructive",
};

const TaskCard: React.FC<TaskItemProps> = ({
  task,
  index,
  moveTask,
  toggleTaskStatus,
  onDelete,
  onEdit,
  showGoals = false,
}) => {
  const ref = React.useRef<HTMLLIElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index, id: task.id, type: ItemTypes.TASK },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemTypes.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset
        ? clientOffset.y - hoverBoundingRect.top
        : 0;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
  });

  const connectRef = (element: HTMLLIElement) => {
    drag(element);
    drop(element);
    ref.current = element;
  };

  const toggleCompletion = () => {
    toggleTaskStatus(task.id);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    onEdit(task);
  };

  return (
    <>
      <li
        ref={connectRef}
        className={`relative flex group items-start w-full border-b gap-3 pl-3 py-3 ${
          isDragging
            ? "opacity-50 "
            : isOver
            ? "bg-sidebar-accent border-violet-600"
            : ""
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-neutral-200 py-1 rounded absolute cursor-move -left-2 top-[calc(50%-12px)] group-hover:block hidden h-6 w-min text-muted-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </Button>

        <Checkbox
          className="rounded-[8px] size-5 border-muted-foreground cursor-pointer mt-1"
          id={`task-${task.id}`}
          checked={task.status}
          onCheckedChange={toggleCompletion}
        />

        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex">
            <label
              htmlFor={`task-${task.id}`}
              className={
                task.status
                  ? "line-through text-muted-foreground"
                  : "font-medium"
              }
            >
              {task.name}
            </label>

            {showGoals && (
              <div className=" ml-auto gap-1 items-center flex">
                <span className="text-sm text-muted-foreground">
                  {task.name}
                </span>
              </div>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="flex gap-2 mt-1 items-center h-6 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDate(task.date)}
              </span>
            </div>

            <Badge
              variant={priorityVariantMap[task.priority] as any}
              className="text-xs h-5"
            >
              {task.priority}
            </Badge>

            {task.repeat && (
              <div className="flex items-center gap-1">
                <Repeat className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-500">Recurring</span>
              </div>
            )}

            <div className="ml-auto gap-1 items-center group-hover:flex hidden">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-neutral-200 size-6 text-muted-foreground"
                onClick={handleEditClick}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-neutral-200 size-6 text-muted-foreground"
                onClick={handleDeleteClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </li>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskName={task.name}
      />
    </>
  );
};

export default TaskCard;

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskName,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the task "{taskName}". This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
