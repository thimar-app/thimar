import { CirclePlus, type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

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
      <SidebarMenuItem className="mt-4">
        <SidebarMenuButton className="text-foreground bg-sidebar-accent hover:bg-sidebar-primary cursor-pointer justify-center border border-dashed">
          <CirclePlus strokeWidth={1.5} />
          <span>Add Goal</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
