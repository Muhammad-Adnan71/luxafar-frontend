"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/CMS/components-ui/shadcn/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="bg-cms-tertiary-color dark:bg-gray-900"
      >
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] text-cms-secondary-color w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-cms-tertiary-color border-cms-primary-color text-white dark:text-gray-200 dark:bg-gray-800 dark:border-gray-900"
      >
        <DropdownMenuItem
          className={`${
            theme === "light" && "bg-cms-primary-color dark:bg-gray-900"
          } dark:text-gray-200 cursor-pointer hover:bg-cms-primary-color dark:hover:bg-gray-900`}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${
            theme === "dark" && "bg-cms-primary-color dark:bg-gray-900"
          } dark:text-gray-200 cursor-pointer hover:bg-cms-primary-color dark:hover:bg-gray-900`}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${
            theme === "system" && "bg-cms-primary-color dark:bg-gray-900"
          } dark:text-gray-200 cursor-pointer hover:bg-cms-primary-color dark:hover:bg-gray-900`}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
