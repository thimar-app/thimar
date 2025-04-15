import { ReactNode } from "react";
import { ThemeProvider } from "@/components/layouts/theme-provider";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-full max-w-md p-4">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout; 