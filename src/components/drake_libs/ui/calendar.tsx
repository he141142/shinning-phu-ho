"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/drake_libs/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  canEdit?: boolean;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  canEdit = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 100;
  const toYear = currentYear + 10;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={!canEdit}
      captionLayout="dropdown-buttons"
      fromYear={fromYear}
      toYear={toYear}
      className={cn("p-4", canEdit ? "" : "pointer-events-none opacity-60", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: cn(
          "text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
          "tracking-wide"
        ),
        caption_dropdowns: "flex gap-2 justify-center",
        dropdown: cn(
          "relative inline-flex items-center rounded-lg border-2 border-purple-200 dark:border-purple-800",
          "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20",
          "px-3 py-1.5 text-sm font-semibold text-purple-700 dark:text-purple-300",
          "ring-offset-background transition-all duration-300",
          "hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        ),
        dropdown_icon: "ml-1.5 h-4 w-4 opacity-70 text-purple-600",
        vhidden: "sr-only",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30",
          "border-2 border-purple-200 dark:border-purple-800 p-0 transition-all duration-300",
          "hover:border-purple-400 dark:hover:border-purple-600",
          "hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/30",
          "hover:scale-110 active:scale-95"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mt-2",
        head_row: "flex justify-around",
        head_cell: cn(
          "text-purple-600 dark:text-purple-400 rounded-md w-10 font-bold text-xs uppercase tracking-wider",
          "pb-2"
        ),
        row: "flex w-full mt-1 justify-around",
        cell: cn(
          "relative h-10 w-10 text-center text-sm p-0 transition-all duration-200",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-purple-100/50 dark:[&:has([aria-selected].day-outside)]:bg-purple-900/20",
          "[&:has([aria-selected])]:bg-gradient-to-br [&:has([aria-selected])]:from-purple-100 [&:has([aria-selected])]:to-blue-100",
          "dark:[&:has([aria-selected])]:from-purple-900/30 dark:[&:has([aria-selected])]:to-blue-900/30",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-semibold rounded-lg transition-all duration-300",
          "hover:bg-gradient-to-br hover:from-purple-100 hover:to-blue-100",
          "dark:hover:from-purple-900/40 dark:hover:to-blue-900/40",
          "hover:scale-110 hover:shadow-md hover:shadow-purple-200 dark:hover:shadow-purple-900/30",
          "active:scale-95",
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold",
          "hover:from-purple-700 hover:to-blue-700",
          "focus:from-purple-700 focus:to-blue-700",
          "shadow-lg shadow-purple-300 dark:shadow-purple-900/50",
          "hover:shadow-xl hover:shadow-purple-400 dark:hover:shadow-purple-900/70",
          "ring-2 ring-purple-300 dark:ring-purple-700 ring-offset-2"
        ),
        day_today: cn(
          "bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30",
          "text-orange-700 dark:text-orange-300 font-bold",
          "border-2 border-orange-400 dark:border-orange-600",
          "hover:from-orange-200 hover:to-pink-200 dark:hover:from-orange-900/50 dark:hover:to-pink-900/50"
        ),
        day_outside: cn(
          "day-outside text-muted-foreground opacity-40",
          "aria-selected:bg-purple-100/30 dark:aria-selected:bg-purple-900/10",
          "aria-selected:text-muted-foreground aria-selected:opacity-30"
        ),
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent hover:scale-100",
        day_range_middle: cn(
          "aria-selected:bg-gradient-to-r aria-selected:from-purple-100 aria-selected:to-blue-100",
          "dark:aria-selected:from-purple-900/30 dark:aria-selected:to-blue-900/30",
          "aria-selected:text-purple-900 dark:aria-selected:text-purple-100"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft
            className={cn("h-4 w-4 text-purple-600 dark:text-purple-400 transition-transform duration-200", className)}
            {...props}
          />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight
            className={cn("h-4 w-4 text-purple-600 dark:text-purple-400 transition-transform duration-200", className)}
            {...props}
          />
        ),
        Dropdown: ({ className, ...props }) => {
          return (
            <select
              {...props}
              className={cn(
                "appearance-none bg-transparent pr-6 cursor-pointer",
                "hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100",
                "dark:hover:from-purple-900/40 dark:hover:to-blue-900/40",
                "transition-all duration-200",
                className
              )}
            />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
