

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"
import { WeekView } from "./week-view"
import { RoomSidebar } from "./room-sidebar"
import { EventModal } from "./event-modal"
import { DayView } from "./dat-views"
import { EventDetailsModal } from "./event-detail-modal"
import { useCalendarStore } from "./store/store"
import CalendarHeader from "./calendar-header"
import MonthView from "./month-view"

export function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [date, setDate] = useState<Date>(new Date())
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { events, rooms, eventTypes } = useCalendarStore()
  const handleDateSelect = (date: Date) => {
    setDate(date)
    setIsEventModalOpen(true)
  }
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId)
  }
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <RoomSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CalendarHeader
          view={view}
          date={date}
          onViewChange={setView}
          onDateChange={setDate}
          onAddEvent={() => setIsEventModalOpen(true)}
        />
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="flex-1 overflow-hidden">
          <TabsList className="mx-4 mb-2">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="month" className="h-full mt-0">
              <MonthView
                date={date}
                events={events}
                onDateSelect={handleDateSelect}
                onEventSelect={handleEventSelect}
              />
            </TabsContent>
            <TabsContent value="week" className="h-full mt-0">
              <WeekView date={date} events={events} onDateSelect={handleDateSelect} onEventSelect={handleEventSelect} />
            </TabsContent>
            <TabsContent value="day" className="h-full mt-0">
              <DayView date={date} events={events} onDateSelect={handleDateSelect} onEventSelect={handleEventSelect} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        date={date}
        rooms={rooms}
        eventTypes={eventTypes}
      />
      {selectedEventId && <EventDetailsModal eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />}
    </div>
  )
}

