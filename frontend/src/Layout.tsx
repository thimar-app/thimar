import { ReactNode } from "react";
import { AppSidebar } from "./components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskProvider } from "@/context/TaskContext";
import { mockTasks } from "@/db/tasks";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <TaskProvider initialTasks={mockTasks}>
          <div className="flex-1 p-5 pt-0 overflow-auto">{children}</div>
        </TaskProvider>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
