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
// import { useGoalContext } from "@/context/GoalContext";
// import { useEffect } from "react";

function shortenTitle(title: string) {
  
  if (title.length > 30) {
    return title.substring(0, 24) + "...";
  } else {
    return title;
  }
}

// export function NavGoals() {
//   const { goals, fetchGoals } = useGoalContext();

//   useEffect(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   return (
//     <SidebarGroup>
//       <SidebarGroupContent>
//         <SidebarMenu>
//           <Collapsible defaultOpen>
//             <SidebarMenuItem>
//               <SidebarGroupLabel>My Goals</SidebarGroupLabel>
//               <CollapsibleTrigger asChild>
//                 <SidebarMenuAction className="right-0 bg-sidebar-accent hover:bg-sidebar-primary text-sidebar-accent-foreground data-[state=open]:rotate-90">
//                   <ChevronRight />
//                 </SidebarMenuAction>
//               </CollapsibleTrigger>
//               <CollapsibleContent>
//                 <SidebarMenuSub>
//                   {goals.map((goal) => (
//                     <SidebarMenuSubItem key={goal.id}>
//                       <Link to={`/goals/${goal.id}`} className="block">
//                         <SidebarMenuSubButton asChild className="px-1">
//                           <span>{shortenTitle(goal.name)}</span>
//                         </SidebarMenuSubButton>
//                       </Link>
//                     </SidebarMenuSubItem>
//                   ))}
//                 </SidebarMenuSub>
//               </CollapsibleContent>
//             </SidebarMenuItem>
//           </Collapsible>
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }

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
                  {goals.map((goal) => (
                    <SidebarMenuSubItem key={goal.name}>
                      <Link to={`/goals/${goal.link}`} className="block">
                        <SidebarMenuSubButton asChild className="px-1">
                          <span>{shortenTitle(goal.name)}</span>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}

                  {showMore && (
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
