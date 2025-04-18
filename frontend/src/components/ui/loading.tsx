import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loading({ size = "md", fullScreen = false }: LoadingProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  useEffect(() => {
    // Get theme from localStorage
    const storedTheme = localStorage.getItem("vite-ui-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  // Create a style object for the background color
  const backgroundStyle = fullScreen 
    ? { 
        backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)"
      } 
    : {};

  return (
    <div 
      className={fullScreen ? "fixed inset-0 flex items-center justify-center z-50" : "flex items-center justify-center p-4"}
      style={backgroundStyle}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-primary/20 rounded-full`}
        ></div>
        <div
          className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
        ></div>
      </div>
    </div>
  );
} 