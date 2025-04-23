import { useState } from "react";
import {
  ArrowUp,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const menuItems = [
    { label: "Profile", icon: User, onClick: () => navigate("/profile") },
    { label: "Settings", icon: Settings, onClick: () => navigate("/settings") },
    { label: "Help", icon: HelpCircle, onClick: () => navigate("/help") },
    { label: "Log out", icon: LogOut, onClick: () => setShowLogoutDialog(true) },
  ];

  return (
    <>
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
              <SidebarGroup>
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton onClick={item.onClick}>
                          <item.icon className="w-5 h-5" />
                          <span className="hidden md:inline">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
