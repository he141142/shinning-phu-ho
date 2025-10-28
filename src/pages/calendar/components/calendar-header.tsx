"use client"

import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/drake_libs/ui/button"

interface CalendarHeaderProps {
  view: "month" | "week" | "day"
  date: Date
  onViewChange: (view: "month" | "week" | "day") => void
  onDateChange: (date: Date) => void
  onAddEvent: () => void
}

export default function CalendarHeader({ view, date, onViewChange, onDateChange, onAddEvent }: CalendarHeaderProps) {
  const goToToday = () => {
    onDateChange(new Date())
  }

  const goToPrevious = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7)
    } else {
      newDate.setDate(date.getDate() - 1)
    }
    onDateChange(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7)
    } else {
      newDate.setDate(date.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const getHeaderText = () => {
    if (view === "month") {
      return format(date, "MMMM yyyy")
    } else if (view === "week") {
      const start = new Date(date)
      start.setDate(date.getDate() - date.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)

      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`
      } else {
        return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`
      }
    } else {
      return format(date, "EEEE, MMMM d, yyyy")
    }
  }

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={goToToday}>
          Today
        </Button>
        <h2 className="text-xl font-bold ml-4">{getHeaderText()}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAddEvent} className="gap-1">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
    </div>
  )
}

