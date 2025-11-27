import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/drake_libs/ui/button"
import { Checkbox } from "@/components/drake_libs/ui/checkbox"
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area"
import { Separator } from "@/components/drake_libs/ui/separator"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/drake_libs/ui/sheet"
import { Room } from "./libs/type"
import { useCalendarStore } from "./store/store"
import { RoomDetails } from "./room-detail"

export function RoomSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const { rooms, eventTypes, toggleRoomFilter, toggleEventTypeFilter, filteredRooms, filteredEventTypes } =
    useCalendarStore()

  return (
    <>
      <div
        className={cn(
          "border-r transition-all duration-300 flex flex-col",
          isOpen ? "w-[280px]" : "w-0 overflow-hidden",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <h4 className="font-medium mb-2">Event Types</h4>
            <div className="space-y-2">
              {eventTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={filteredEventTypes.includes(type.id)}
                    onCheckedChange={() => toggleEventTypeFilter(type.id)}
                  />
                  <label
                    htmlFor={`type-${type.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.name}
                  </label>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium mb-2">Rooms</h4>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`room-${room.id}`}
                      checked={filteredRooms.includes(room.id)}
                      onCheckedChange={() => toggleRoomFilter(room.id)}
                    />
                    <label
                      htmlFor={`room-${room.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {room.name}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(room)}>
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-4 ml-2 z-10"
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {selectedRoom && (
        <Sheet open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Room Details</SheetTitle>
            </SheetHeader>
            <RoomDetails room={selectedRoom} />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

