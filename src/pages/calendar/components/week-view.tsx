"use client"

import { useRef, useEffect } from "react"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addHours, isSameDay, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { Event } from "./libs/type"

interface WeekViewProps {
  date: Date
  events: Event[]
  onDateSelect: (date: Date) => void
  onEventSelect: (eventId: string) => void
}

export function WeekView({ date, events, onDateSelect, onEventSelect }: WeekViewProps) {
  const weekStart = startOfWeek(date)
  const weekEnd = endOfWeek(weekStart)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to 8am on initial render
  useEffect(() => {
    if (containerRef.current) {
      const scrollTarget = containerRef.current.querySelector('[data-hour="8"]')
      if (scrollTarget) {
        scrollTarget.scrollIntoView()
      }
    }
  }, [])

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime)
      return isSameDay(eventStart, day) && eventStart.getHours() === hour
    })
  }

  const calculateEventPosition = (event: Event) => {
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    const startHour = startTime.getHours()
    const startMinute = startTime.getMinutes()
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

    const top = ((startHour * 60 + startMinute) / 15) * 20
    const height = (durationMinutes / 15) * 20

    return { top, height }
  }

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        {/* Empty cell for time column */}
        <div className="p-2 border-r"></div>

        {/* Day headers */}
        {weekDays.map((day, i) => (
          <div key={i} className={cn("p-2 text-center border-r last:border-r-0", isToday(day) && "bg-primary/10")}>
            <div className="font-medium">{format(day, "EEE")}</div>
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center mx-auto mt-1",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto" ref={containerRef}>
        <div className="grid grid-cols-8 relative" style={{ height: `${24 * 60}px` }}>
          {/* Time column */}
          <div className="border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b h-[60px] pr-2 text-right text-sm text-muted-foreground"
                data-hour={hour}
              >
                {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className={cn("border-r last:border-r-0 relative", isToday(day) && "bg-primary/5")}>
              {/* Hour cells */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="border-b h-[60px]"
                  onClick={() => {
                    const newDate = new Date(day)
                    newDate.setHours(hour)
                    onDateSelect(newDate)
                  }}
                >
                  {/* Events */}
                  {events
                    .filter((event) => {
                      const eventDate = new Date(event.startTime)
                      return isSameDay(eventDate, day)
                    })
                    .map((event) => {
                      const { top, height } = calculateEventPosition(event)
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "absolute left-0 right-1 px-2 py-1 rounded text-xs overflow-hidden cursor-pointer",
                            event.type === "meeting" && "bg-blue-100 text-blue-800",
                            event.type === "class" && "bg-green-100 text-green-800",
                            event.type === "workshop" && "bg-purple-100 text-purple-800",
                            event.type === "other" && "bg-gray-100 text-gray-800",
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 20)}px`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventSelect(event.id)
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="truncate">{event.room.name}</div>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

