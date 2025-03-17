import * as React from "react";
import { Goal, CircleCheckBig, Pentagon, Clock9 } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavGoals } from "@/components/sidebar/nav-goals";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ProfileActions } from "@/components/sidebar/profile-actions";
import { useGoalContext } from "@/context/GoalContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { goals } = useGoalContext();
  const [showMore, setShowMore] = React.useState(false);

  // Create a copy of the goals array to avoid mutation
  const goalsList = goals.map((g) => ({
    name: g.name,
    link: g.id,
  }));

  // Update `showMore` based on the number of goals
  React.useEffect(() => {
    setShowMore(goalsList.length > 7);
  }, [goals.length]);

  // Use slice instead of splice to avoid modifying the array
  const data = {
    navMain: [
      { title: "Home", url: "/", icon: Pentagon, isActive: true },
      { title: "Goals", url: "goals", icon: Goal },
      { title: "Tasks", url: "tasks", icon: CircleCheckBig },
      { title: "Pomodoros", url: "pomodoros", icon: Clock9 },
    ],
    goals: goalsList.slice(0, 7), // Safe array slicing
  };

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex justify-between gap-2 items-center mt-1.5">
          <ProfileActions />
          <SidebarTrigger />
        </div>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavGoals goals={data.goals} showMore={showMore} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
