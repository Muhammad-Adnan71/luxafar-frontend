"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "lib/utils";
import { buttonVariants } from "./button";
// import { buttonVariants } from "@components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className, "hello")}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "sm:space-y-4 max-sm:!mb-0 max-sm:!mt-1 ",
        caption: "flex justify-center pt-1 max-sm:pb-2 relative items-center",
        caption_label:
          "text-sm max-sm:text-[12px] text-secondary-color font-medium",
        nav: "space-x-1 flex bg-primary-color items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute bg-primary-color left-1",
        nav_button_next: "absolute bg-primary-color right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-sm w-9 max-sm:w-[28px] text-secondary-color font-[600] text-[13px] max-sm:text-[11px]",
        row: "flex w-full mt-2 max-sm:mt-1",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-sm last:[&:has([aria-selected])]:rounded-r-sm focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 max-sm:h-[20px] w-9 max-sm:w-[28px] text-[10px] text-[rgba(255,255,255,0.7)] p-0 font-normal aria-selected:opacity-100 aria-selected:!bg-primary-color"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-[20px] text-secondary-color w-[20px]" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-[20px] text-secondary-color  w-[20px]" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
