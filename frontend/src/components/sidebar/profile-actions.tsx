import { useEffect, useState } from "react";
import {
  ArrowUp,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logoutUser } from "@/api/auth";

const data = [
  [
    {
      label: "Settings",
      icon: Settings,
    },
    {
      label: "Resources",
      icon: BookOpen,
    },
    {
      label: "What's new",
      icon: ArrowUp,
    },
  ],

  [
    {
      label: "Upgrade to Pro",
      icon: BadgeCheck,
    },
  ],

  [
    {
      label: "Log out",
      icon: LogOut,
    },
  ],
];
const handleLogout = async () => {
  try {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      await logoutUser(refresh);
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/"; // Redirige vers la page de connexion après déconnexion
  }
};

export function ProfileActions() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 px-2 w-max data-[state=open]:bg-accent"
        >
          <Avatar className="size-6">
            <AvatarImage src="https://avatars.githubusercontent.com/u/98880087" />
            <AvatarFallback>NZ</AvatarFallback>
          </Avatar>

          <span className="font-medium">Nzar</span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 overflow-hidden rounded-lg p-0"
        align="start"
      >
        <Sidebar collapsible="none" className="bg-transparent">
          <SidebarContent>
            {data.map((group, index) => (
              <SidebarGroup key={index} className="border-b last:border-none">
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                  {group.map((item, index) => (
  <SidebarMenuItem key={index}>
    <SidebarMenuButton onClick={() => handleLogout()}>
      <item.icon /> <span>{item.label}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      </PopoverContent>
    </Popover>
  );
}
