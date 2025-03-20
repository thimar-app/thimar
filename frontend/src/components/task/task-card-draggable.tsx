import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Task } from "@/db/goals";
import TaskCard from "@/components/task/task-card";
import { ItemTypes } from "@/components/pages/goalDetails/item-types";
import { EditTaskCard } from "@/components/task/edit-task-card";

interface TaskItemDraggableProps {
  task: Task;
  index: number;
  subGoalId: string;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  toggleTaskStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isEditing: boolean;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  updateTask: (task: Task) => void;
}

const TaskCardDraggable: React.FC<TaskItemDraggableProps> = ({
  task,
  index,
  subGoalId,
  moveTask,
  toggleTaskStatus,
  onDelete,
  onEdit,
  isEditing,
  editingTask,
  setEditingTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, subGoalId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: { id: string; index: number; subGoalId: string }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex && item.subGoalId === subGoalId) return;
      if (item.subGoalId !== subGoalId) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  if (isEditing && editingTask) {
    return (
      <EditTaskCard task={editingTask} onClose={() => setEditingTask(null)} />
    );
  }

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${isDragging ? "opacity-50" : ""}`}
    >
      <TaskCard
        task={task}
        index={index}
        moveTask={moveTask}
        toggleTaskStatus={toggleTaskStatus}
        onDelete={onDelete}
        onEdit={onEdit}
        showGoals={false}
      />
    </div>
  );
};

export default TaskCardDraggable;
