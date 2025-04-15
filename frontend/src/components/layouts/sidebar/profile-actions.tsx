import { useEffect, useState } from "react";
import {
  ArrowUp,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
import { logoutUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

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

export function ProfileActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Clear user data from context
      setCurrentUser(null);
      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.username) return "U";
    return currentUser.username.substring(0, 2).toUpperCase();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 px-0.5 w-max data-[state=open]:bg-accent"
        >
          <Avatar className="!size-6">
            <AvatarImage src="https://avatars.githubusercontent.com/u/98880087" />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>

          <span className="font-medium">{currentUser?.username || "User"}</span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="!w-56 overflow-hidden rounded-lg !p-0"
        align="start"
      >
        <Sidebar collapsible="none" className="bg-transparent">
          <SidebarContent className="!p-0">
            {data.map((group, index) => (
              <SidebarGroup key={index} className="border-b last:border-none">
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                    {group.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton onClick={item.label === "Log out" ? handleLogout : undefined}>
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
