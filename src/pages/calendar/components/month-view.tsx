"use client"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/drake_libs/ui/tooltip"
import { Event } from "./libs/type"

interface MonthViewProps {
  date: Date
  events: Event[]
  onDateSelect: (date: Date) => void
  onEventSelect: (eventId: string) => void
}

export default function MonthView({ date, events, onDateSelect, onEventSelect }: MonthViewProps) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), day))
  }

  return (
    <div className="h-full grid grid-cols-7 grid-rows-[auto_1fr] border-2 rounded-xl overflow-hidden shadow-sm bg-card">
      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
        <div
          key={day}
          className="p-3 text-center font-semibold text-sm text-muted-foreground bg-muted/50 border-b-2 border-r last:border-r-0"
        >
          {day}
        </div>
      ))}

      {/* Calendar cells */}
      {calendarDays.map((day, i) => {
        const dayEvents = getEventsForDay(day)
        const isCurrentMonth = isSameMonth(day, monthStart)

        return (
          <div
            key={i}
            className={cn(
              "border-r border-b last:border-r-0 p-2 overflow-hidden transition-all",
              "min-h-[110px] cursor-pointer hover:bg-accent/50",
              !isCurrentMonth && "bg-muted/20",
              isCurrentMonth && "bg-background"
            )}
            onClick={() => onDateSelect(new Date(day))}
          >
            <div className="flex justify-between items-start mb-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isToday(day) && "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20",
                  !isToday(day) && isCurrentMonth && "hover:bg-muted",
                  !isCurrentMonth && "text-muted-foreground/60",
                )}
              >
                {format(day, "d")}
              </div>
            </div>

            <div className="space-y-1 max-h-[calc(100%-36px)] overflow-y-auto custom-scrollbar">
              {dayEvents.slice(0, 3).map((event) => (
                <TooltipProvider key={event.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "text-xs px-2 py-1.5 rounded-md truncate cursor-pointer font-medium transition-all",
                          "hover:scale-[1.02] hover:shadow-sm",
                          event.type === "meeting" && "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
                          event.type === "class" && "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
                          event.type === "workshop" && "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
                          event.type === "other" && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventSelect(event.id)
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] opacity-80">{format(new Date(event.startTime), "h:mm a")}</span>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">{event.title}</p>
                        <div className="space-y-1 text-xs">
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Time:</span>
                            {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Room:</span>
                            {event.room.name}
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              {dayEvents.length > 3 && (
                <div className="text-xs text-muted-foreground px-2 py-1 font-medium">
                  +{dayEvents.length - 3} more events
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

