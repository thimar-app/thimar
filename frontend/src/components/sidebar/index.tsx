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
import goals from "@/db/goals";

const goalsList = goals.map((g) => {
  return {
    name: g.name,
    link: g.id,
  };
});

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Pentagon,
      isActive: true,
    },
    {
      title: "Goals",
      url: "goals",
      icon: Goal,
    },
    {
      title: "Tasks",
      url: "tasks",
      icon: CircleCheckBig,
    },
    {
      title: "Pomodoros",
      url: "pomodoros",
      icon: Clock9,
    },
  ],

  goals: goalsList,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavGoals goals={data.goals} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
