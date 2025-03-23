import { CirclePlus, type LucideIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useGoalContext } from "@/context/GoalContext";
import AddGoalDialog from "./add-goal-dialog";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const { addGoal } = useGoalContext();
  const navigate = useNavigate();

  const handleAddGoal = () => {
    const newGoalId = uuidv4();

    const emptyGoal = {
      id: newGoalId,
      name: "⭐ New Goal",
      description: "Click to edit your goal description",
      image: "https://placehold.co/500x550/1e1e1e/a1a1aa",
      progress: 0,
      user_id: "user_123",
      subGoals: [],
    };

    addGoal(emptyGoal);
    navigate(`/goals/${newGoalId}`);
  };
  return (
    <SidebarMenu className="mt-2 mb-4 gap-0.5">
      {items.map((item) => (
        <SidebarMenuItem className="" key={item.title}>
          <Link to={item.url} className="w-full">
            <SidebarMenuButton isActive={item.isActive}>
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}

      <AddGoalDialog>
        <SidebarMenuItem className="mt-4">
          <SidebarMenuButton
            onClick={handleAddGoal}
            className="text-foreground bg-sidebar-accent hover:bg-sidebar-primary cursor-pointer justify-center border border-dashed"
          >
            <CirclePlus strokeWidth={1.5} />
            <span>Add Goal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </AddGoalDialog>
    </SidebarMenu>
  );
}
