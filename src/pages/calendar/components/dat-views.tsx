import { useRef, useEffect } from "react"
import { format, addHours } from "date-fns"
import { cn } from "@/lib/utils"
import { Event } from "./libs/type"

interface DayViewProps {
  date: Date
  events: Event[]
  onDateSelect: (date: Date) => void
  onEventSelect: (eventId: string) => void
}

export function DayView({ date, events, onDateSelect, onEventSelect }: DayViewProps) {
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

  // Filter events for the selected day
  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    )
  })

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[100px_1fr] border-b">
        <div className="p-2 border-r"></div>
        <div className="p-2 text-center font-medium">{format(date, "EEEE, MMMM d, yyyy")}</div>
      </div>

      <div className="flex-1 overflow-auto" ref={containerRef}>
        <div className="grid grid-cols-[100px_1fr] relative" style={{ height: `${24 * 60}px` }}>
          {/* Time column */}
          <div className="border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b h-[60px] pr-2 text-right text-sm text-muted-foreground flex items-start justify-end pt-1"
                data-hour={hour}
              >
                {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="relative">
            {/* Hour cells */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b h-[60px]"
                onClick={() => {
                  const newDate = new Date(date)
                  newDate.setHours(hour)
                  onDateSelect(newDate)
                }}
              ></div>
            ))}

            {/* Current time indicator */}
            {new Date().getDate() === date.getDate() &&
              new Date().getMonth() === date.getMonth() &&
              new Date().getFullYear() === date.getFullYear() && (
                <div
                  className="absolute left-0 right-0 border-t border-red-500 z-10"
                  style={{
                    top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / 15) * 20}px`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                </div>
              )}

            {/* Events */}
            {dayEvents.map((event) => {
              const { top, height } = calculateEventPosition(event)
              return (
                <div
                  key={event.id}
                  className={cn(
                    "absolute left-2 right-2 px-3 py-2 rounded text-sm overflow-hidden cursor-pointer",
                    event.type === "meeting" && "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
                    event.type === "class" && "bg-green-100 text-green-800 border-l-4 border-green-500",
                    event.type === "workshop" && "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
                    event.type === "other" && "bg-gray-100 text-gray-800 border-l-4 border-gray-500",
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${Math.max(height, 25)}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventSelect(event.id)
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs mt-1">
                    {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                  </div>
                  <div className="text-xs mt-1">Room: {event.room.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

