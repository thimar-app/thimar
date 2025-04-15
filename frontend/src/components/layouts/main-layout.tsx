import { ReactNode } from "react";
import { AppSidebar } from "@/components/layouts/sidebar";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import { TaskProvider } from "@/context/TaskContext";

// Properly define the props type
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <TaskProvider>
          <div className="flex-1 p-5 pt-0 overflow-auto">{children}</div>
        </TaskProvider>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
