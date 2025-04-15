import * as React from "react";
import { Goal, CircleCheckBig, Pentagon, Clock9 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { NavMain } from "@/components/layouts/sidebar/nav-main";
import { NavGoals } from "@/components/layouts/sidebar/nav-goals";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ProfileActions } from "@/components/layouts/sidebar/profile-actions";
import { useGoalContext } from "@/context/GoalContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { goals = [] } = useGoalContext();
  const location = useLocation();

  const goalsList = goals.map((g) => ({
    name: g.name,
    link: g.id,
  }));

  const navItems = [
    {
      title: "Home",
      url: "/home",
      icon: Pentagon,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: Goal,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CircleCheckBig,
    },
    {
      title: "Pomodoro",
      url: "/pomodoro",
      icon: Clock9,
    },
  ].map((item) => ({
    ...item,
    isActive: location.pathname === item.url,
  }));

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex justify-between gap-2 items-center mt-1.5">
          <ProfileActions />
          <SidebarTrigger />
        </div>
        <NavMain items={navItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavGoals goals={goalsList} showMore={true} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
