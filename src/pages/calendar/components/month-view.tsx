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
    <div className="h-full grid grid-cols-7 grid-rows-[auto_1fr] border rounded-lg overflow-hidden">
      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
        <div key={day} className="p-2 text-center font-medium text-muted-foreground border-b border-r last:border-r-0">
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
              "border-r border-b last:border-r-0 p-1 overflow-hidden",
              "min-h-[100px]",
              !isCurrentMonth && "bg-muted/30",
            )}
            onClick={() => onDateSelect(new Date(day))}
          >
            <div className="flex justify-between items-start">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-sm",
                  isToday(day) && "bg-primary text-primary-foreground font-medium",
                  !isCurrentMonth && "text-muted-foreground",
                )}
              >
                {format(day, "d")}
              </div>
            </div>

            <div className="mt-1 space-y-1 max-h-[calc(100%-28px)] overflow-y-auto">
              {dayEvents.slice(0, 3).map((event) => (
                <TooltipProvider key={event.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "text-xs px-2 py-1 rounded truncate cursor-pointer",
                          event.type === "meeting" && "bg-blue-100 text-blue-800",
                          event.type === "class" && "bg-green-100 text-green-800",
                          event.type === "workshop" && "bg-purple-100 text-purple-800",
                          event.type === "other" && "bg-gray-100 text-gray-800",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventSelect(event.id)
                        }}
                      >
                        {format(new Date(event.startTime), "h:mm a")} {event.title}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs">
                          {format(new Date(event.startTime), "h:mm a")} -{format(new Date(event.endTime), "h:mm a")}
                        </p>
                        <p className="text-xs">Room: {event.room.name}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              {dayEvents.length > 3 && (
                <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 3} more</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

