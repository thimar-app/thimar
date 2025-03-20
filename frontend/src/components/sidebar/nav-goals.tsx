import { ChevronRight, Ellipsis } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

function shortenTitle(title: string) {
  // Updated to use 28 as the threshold
  if (title.length > 28) {
    return title.substring(0, 24) + "...";
  } else {
    return title;
  }
}

export function NavGoals({
  goals,
  showMore,
}: {
  showMore: boolean;
  goals: {
    name: string;
    link: string;
  }[];
}) {
  // Determine which goals to display
  const displayedGoals = showMore ? goals.slice(0, 6) : goals;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <SidebarGroupLabel>My Goals</SidebarGroupLabel>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="right-0 bg-sidebar-accent hover:bg-sidebar-primary text-sidebar-accent-foreground data-[state=open]:rotate-90">
                  <ChevronRight />
                </SidebarMenuAction>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {displayedGoals.map((goal) => (
                    <SidebarMenuSubItem key={goal.name}>
                      <Link to={`/goals/${goal.link}`} className="block">
                        <SidebarMenuSubButton asChild className="px-1">
                          <span>{shortenTitle(goal.name)}</span>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}

                  {showMore && goals.length > 6 && (
                    <SidebarMenuSubItem>
                      <Link to={`/goals`} className="block">
                        <SidebarMenuSubButton>
                          <Ellipsis /> More
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
