"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
    // If no explicit user choice, default to system theme
    if (!theme) {
      setTheme("system");
    }
  }, [theme, setTheme]);

  if (!mounted) return null;

  const toggleTheme = () => {
    // Toggle between dark and light based on resolvedTheme
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative h-8 w-8 rounded-full"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${
          resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${
          resolvedTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
